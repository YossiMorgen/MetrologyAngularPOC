import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'angular-toastify';
import { ConfirmDialogComponent } from 'src/app/components/dashboard/confirm-dialog/confirm-dialog.component';
import { DeviationCalcTypeEnum, TestDefinitionGroup } from 'src/app/models/TestDefinition/test-definition-group';
import { ConfirmDialogModel } from 'src/app/models/confirm-dialog';
import { SubTechnology } from 'src/app/models/toolDefinitionModels/sub-technology';
import { ToolTopLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-top-level-definition';
import { ToolDefinitionURLs } from 'src/app/services/app-config.service';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-test-definition-group-form',
  templateUrl: './test-definition-group-form.component.html',
  styleUrls: ['./test-definition-group-form.component.css']
})
export class TestDefinitionGroupFormComponent implements OnChanges, OnInit {
  @Input() testDefinitionGroupInput: TestDefinitionGroup = null;
  @Input() public toolTopId: number = null;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  public keepEditing = new FormControl(true);
  subTechnologies: SubTechnology[];
  toolTopLevels: ToolTopLevelDefinition[];
  DeviationCalcTypes = Object.values(DeviationCalcTypeEnum);

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private dialog: MatDialog,
    private formBuilder : FormBuilder,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {

    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies;
      this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
      this.testDefinitionGroupForm.controls.ToolTopLevelDefinitionID.setValue(this.toolTopId);
    });

    this.testDefinitionGroupForm.controls.TechID.valueChanges.subscribe((value: number) => {
      if(!value) return;
      const tech = this.toolsDefinitionService.technologies.find(tech => tech.TechnologyID === +value);
      this.subTechnologies = tech.SubTechnologies;
      this.toolTopLevels = [];
      this.subTechnologies.forEach(tech => {
        this.toolTopLevels.push(...tech.ToolTopLevelDefinitions);
      });

      if(this.toolTopLevels.length === 0 ){
        this.toastService.error('לא קיימים כלים על פי הטכנולוגיה שנבחרה');
      }

    });

    this.testDefinitionGroupForm.controls.SubTechID.valueChanges.subscribe((value: number) => {
      if(!value) return;
      const subTech = this.subTechnologies.find(subTech => subTech.SubTechnologyID === +value);      
      this.toolTopLevels = subTech.ToolTopLevelDefinitions;

      if(this.toolTopLevels.length === 0 && value){
        this.toastService.error('לא קיימים כלים על פי הטכנולוגיה והתת טכנולוגיה שנבחרו');
        return;
      }
      // set TechID value
      this.testDefinitionGroupForm.controls.TechID.setValue(subTech.TechID);
    });

    this.testDefinitionGroupForm.controls.ToolTopLevelDefinitionID.valueChanges.subscribe((value: number) => {
      if(value){
        const tool = this.toolTopLevels.find(tool => tool.ToolTopLevelDefinitionID === +value);
        this.testDefinitionGroupForm.controls.SubTechID.setValue(tool.SubTechID);
        this.testDefinitionGroupForm.controls.TechID.setValue(tool.SubTechnology?.TechID);
      }
    });


  }

  ngOnChanges(
    changes: SimpleChanges,
  ): void {    
    if(changes['testDefinitionGroupInput'] && this.testDefinitionGroupInput){
      this.testDefinitionGroupForm.setValue({
        TechID: this.testDefinitionGroupInput?.ToolTopLevelDefinition?.SubTechnology?.TechID || null,
        SubTechID: this.testDefinitionGroupInput?.ToolTopLevelDefinition?.SubTechID || null,
        ToolTopLevelDefinitionID: this.testDefinitionGroupInput?.ToolTopLevelDefinitionID || null,
        TestDefinitionGroupName: this.testDefinitionGroupInput?.TestDefinitionGroupName || null,
        DeviationCalcType: this.testDefinitionGroupInput?.DeviationCalcType || null,
      });
    }

    if(changes['toolTopId'] && this.toolTopId && this.toolsDefinitionService.toolTopLevelDefinitions){
      this.testDefinitionGroupForm.controls.ToolTopLevelDefinitionID.setValue(this.toolTopId);
    }
  }

  testDefinitionGroupForm = this.formBuilder.group({
    TechID:[0],
    SubTechID: [0],
    ToolTopLevelDefinitionID: [0, [Validators.required]],
    TestDefinitionGroupName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[0-9a-zA-Z\u0590-\u05FF\u200f\u200e ]*$')] ],
    DeviationCalcType: [DeviationCalcTypeEnum.AVG, [Validators.required]],
  });

  async submitForm() {
    try {

      const newGroup = new TestDefinitionGroup(
        this.testDefinitionGroupForm.value.TestDefinitionGroupName, 
        this.testDefinitionGroupForm.value.ToolTopLevelDefinitionID,
        this.testDefinitionGroupInput?.TestDefinitionGroupID || 0,
        this.testDefinitionGroupForm.value.DeviationCalcType
      )

      let id: number = this.testDefinitionGroupInput?.TestDefinitionGroupID;

      if(newGroup.TestDefinitionGroupID){
        await this.toolsDefinitionService.updateToolDefinition(newGroup, newGroup.TestDefinitionGroupID);
        this.toastService.success('הבדיקה עודכנה בהצלחה');
      } else {
        id = await this.toolsDefinitionService.createToolDefinition(newGroup);
        this.toastService.success('הבדיקה נוצרה בהצלחה');
      }

      if(!this.keepEditing.value){
        this.testDefinitionGroupInput = null;
        this.formDirective.resetForm();
        this.testDefinitionGroupForm.reset();
      } else {
        this.testDefinitionGroupInput = this.toolsDefinitionService.testDefinitionGroups.find(group => group.TestDefinitionGroupID === id);
      }

      this.toolsDefinitionService.linkTheData();
    } catch (error: any) {
      this.toastService.error(error);
    }
  }

  cancelEdit(){
    this.testDefinitionGroupInput = null;
    this.formDirective.resetForm();
    this.testDefinitionGroupForm.reset();
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
  }

  resetForm() {
    this.formDirective.resetForm();
    this.testDefinitionGroupForm.reset();
    this.testDefinitionGroupForm.controls.DeviationCalcType.setValue(DeviationCalcTypeEnum.AVG);
  }

  
  async deleteTestDefinitionGroup(): Promise<void> { 

    const dialogData = new ConfirmDialogModel("מחיקת בדיקה", "האם אתה בטוח שברצונך למחוק את הבדיקה?");

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        const testDefinitionGroupId = this.testDefinitionGroupInput.TestDefinitionGroupID;   
        try {
          await this.toolsDefinitionService.deleteToolDefinition("TestDefinitionGroup", testDefinitionGroupId, ToolDefinitionURLs.TestDefinitionGroupURL);
          this.toolsDefinitionService.testDefinitionGroups = this.toolsDefinitionService.testDefinitionGroups.filter(testDefinitionGroup => testDefinitionGroup.TestDefinitionGroupID !== testDefinitionGroupId);
          this.toolsDefinitionService.linkTheData();
          this.resetForm();
          this.testDefinitionGroupInput = null;
          this.toastService.success('הקבוצה נמחקה בהצלחה');
        } catch (error: any) {
          this.toastService.error(error);
        }
      }
    })
  }
}
