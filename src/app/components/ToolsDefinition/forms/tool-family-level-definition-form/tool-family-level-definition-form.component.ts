import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'angular-toastify';
import { ConfirmDialogComponent } from 'src/app/components/dashboard/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from 'src/app/models/confirm-dialog';
import { SubTechnology } from 'src/app/models/toolDefinitionModels/sub-technology';
import { ToolFamilyLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-family-level-definition';
import { ToolTopLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-top-level-definition';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-tool-family-level-definition-form',
  templateUrl: './tool-family-level-definition-form.component.html',
  styleUrls: ['./tool-family-level-definition-form.component.css']
})
export class ToolFamilyLevelDefinitionFormComponent implements OnChanges, OnInit {
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  
  @Input() toolId: number = null;
  @Input() ToolTopId: number = null;
  public toolFamilyLevels: ToolFamilyLevelDefinition[] = [];

  public toolFamilyLevelForm = this.formBuilder.group({
    TechID: [0],
    SubTechID: [0],
    ToolTopLevelDefinitionID: [0, [Validators.required]],
    ToolFamilyLevelDefinitionID: [0],
    ToolFamilyLevelDefinitionName: ['', [Validators.required, Validators.pattern('^[0-9a-zA-Z\u0590-\u05FF\u200f\u200e ]*$')]],
  });

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private dialog: MatDialog,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.toolFamilyLevels = this.toolsDefinitionService.toolFamilyDefinitions;
      this.setDefaultSelectsValues();
    });
    this.toolFamilyLevels = this.toolsDefinitionService.toolFamilyDefinitions;
    this.setDefaultSelectsValues();

    this.toolFamilyLevelForm.controls.TechID.valueChanges.subscribe((value: number) => {
      if(!value) return;

      const tech = this.toolsDefinitionService.technologies.find(tech => tech.TechnologyID === value);
      if(tech) this.setSubTechnologies(tech.SubTechnologies);
    });

    this.toolFamilyLevelForm.controls.SubTechID.valueChanges.subscribe((value: number) => {
      if(!value) return;

      const subTech = this.subTechnologies.find(subTech => subTech.SubTechnologyID === value);
      if(subTech) this.setToolTopLevels(subTech.ToolTopLevelDefinitions);
      this.toolFamilyLevelForm.controls.TechID.setValue(subTech.TechID, {emitEvent: false});
    });

    this.toolFamilyLevelForm.controls.ToolTopLevelDefinitionID.valueChanges.subscribe((value: number) => {
      if(!value) return;

      const toolTop = this.toolTopLevels.find(toolTop => toolTop.ToolTopLevelDefinitionID === value);
      this.toolFamilyLevelForm.controls.SubTechID.setValue(toolTop.SubTechID, {emitEvent: false});
      this.toolFamilyLevelForm.controls.TechID.setValue(toolTop.SubTechnology?.TechID, {emitEvent: false});
    });
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['toolId'] && this.toolId !== null){
      const tool = this.toolFamilyLevels.find(tool => tool.ToolFamilyLevelDefinitionID === this.toolId);
      this.toolFamilyLevelForm.setValue({
        TechID: tool.ToolTopLevelDefinition.SubTechnology.TechID,
        SubTechID: tool.ToolTopLevelDefinition.SubTechID,
        ToolTopLevelDefinitionID: tool.ToolTopLevelDefinitionID,
        ToolFamilyLevelDefinitionID: tool.ToolFamilyLevelDefinitionID,
        ToolFamilyLevelDefinitionName: tool.ToolFamilyLevelDefinitionName,
      });
    }

    if(changes['ToolTopId'] && this.ToolTopId !== null){
      this.toolFamilyLevelForm.controls.ToolTopLevelDefinitionID.setValue(this.ToolTopId);
    }
  }

  async onSubmit(){
    if(this.toolFamilyLevelForm.invalid) return;

    const toolFamilyLevel = new ToolFamilyLevelDefinition(
      this.toolFamilyLevelForm.controls.ToolFamilyLevelDefinitionName.value,
      this.toolFamilyLevelForm.controls.ToolTopLevelDefinitionID.value,
      this.toolFamilyLevelForm.controls.ToolFamilyLevelDefinitionID.value
    );

    try {
      if(this.toolFamilyLevelForm.controls.ToolFamilyLevelDefinitionID.value){
        await this.toolsDefinitionService.updateToolDefinition(toolFamilyLevel, toolFamilyLevel.ToolFamilyLevelDefinitionID)
      } else {
        await this.toolsDefinitionService.createToolDefinition(toolFamilyLevel);
      }
      this.toastService.success('הנתונים נשמרו בהצלחה');
      this.formDirective.resetForm();
      this.toolFamilyLevelForm.reset();
      this.toolFamilyLevelForm.controls.ToolTopLevelDefinitionID.setValue(toolFamilyLevel.ToolTopLevelDefinitionID);
    } catch (error: any) {
      this.toastService.error('שגיאה בשמירת הנתונים');
    }

  }

  async deleteFamily(){
    const toolMeasurementLevel = this.toolsDefinitionService.toolMeasurementLevelDefinitions.find(family => family.ToolFamilyLevelDefinitionID === this.toolId);
    if(toolMeasurementLevel){
      this.toastService.error('לא ניתן למחוק סוג כלי זה מכיוון שקיימים רמות מדידה המשוייכות אליה');
      return;
    }

    const dialogData = new ConfirmDialogModel('מחיקת סוג כלי', 'האם אתה בטוח שברצונך למחוק סוג כלי זה?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(async dialogResult => {
      if(dialogResult){
        try {
          await this.toolsDefinitionService.deleteToolDefinition("ToolFamilyLevelDefinition", this.toolId);
          this.toolsDefinitionService.toolFamilyDefinitions = this.toolsDefinitionService.toolFamilyDefinitions.filter(family => family.ToolFamilyLevelDefinitionID !== this.toolId);
          this.toolsDefinitionService.linkTheData();
          this.toastService.success('הנתונים נמחקו בהצלחה');
          this.formDirective.resetForm();
          this.toolFamilyLevelForm.reset();
        } catch (error: any) {
          this.toastService.error('שגיאה במחיקת הנתונים');
        }
      }
    });
  }

  // organize SelectsValues -----------------------------------------------------------------------------------

  subTechnologies: SubTechnology[] = [];
  toolTopLevels: ToolTopLevelDefinition[] = [];

  setDefaultSelectsValues(){
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
  }

  setSubTechnologies(subTechs: SubTechnology[]){
    this.subTechnologies = subTechs;

    if(subTechs.length === 0){
      this.toastService.error('אין תתי טכנולוגיות זמינות');
      return;
    }

    if(subTechs.length === 1){
      this.toolFamilyLevelForm.controls.SubTechID.setValue(subTechs[0].SubTechnologyID);
    }

    let toolTopLevels: ToolTopLevelDefinition[] = [];
    subTechs.forEach(subTech => {
      toolTopLevels = toolTopLevels.concat(subTech.ToolTopLevelDefinitions);
    });
    this.setToolTopLevels(toolTopLevels);
  }

  setToolTopLevels(toolTopLevels: ToolTopLevelDefinition[]){
    this.toolTopLevels = toolTopLevels;

    if(toolTopLevels.length === 0){
      this.toastService.error('אין רמות כלים זמינות');
      return;
    }

    if(toolTopLevels.length === 1){
      this.toolFamilyLevelForm.controls.ToolTopLevelDefinitionID.setValue(toolTopLevels[0].ToolTopLevelDefinitionID);
    }
  }
}
