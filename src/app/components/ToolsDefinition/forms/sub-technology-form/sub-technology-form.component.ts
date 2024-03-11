import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ConfirmDialogComponent } from 'src/app/components/dashboard/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from 'src/app/models/confirm-dialog';
import { SubTechnology } from 'src/app/models/toolDefinitionModels/sub-technology';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-sub-technology-form',
  templateUrl: './sub-technology-form.component.html',
  styleUrls: ['./sub-technology-form.component.css']
})
export class SubTechnologyFormComponent implements OnChanges, OnInit {
  @Input() public toolId: number = null;
  @Input() public techID: number = null;
  @Input() public subTechnologies: SubTechnology[] = [];
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private dialog: MatDialog,
    private toastService: ToastService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initialForm();
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.initialForm();
    });

    this.subTechnologyForm.controls.TechID.valueChanges.subscribe((value) => {
      console.log(value);
      
      if(!value){
        return;
      }
      this.router.navigate([`/tool_definitions/sub_technology/${value}`]);
      this.initialForm();
    });
  }

  initialForm(){
    const MCodes = this.subTechnologies?.map(subTechnology => subTechnology.MCode);
    this.subTechnologyForm.controls.MCode.setValue(this.toolsDefinitionService.getNextMCode(MCodes || []));
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.toolId);
    
    if(changes['toolId'] && this.toolId !== null){
      const tool = this.toolsDefinitionService.subTechnologies.find(tool => tool.SubTechnologyID === this.toolId);
      this.subTechnologyForm.setValue({
        TechID: tool.TechID,
        SubTechnologyName: tool.SubTechnologyName,
        MCode: tool.MCode
      });
    }

    if(changes['techID'] && this.techID){
      this.subTechnologyForm.controls.TechID.setValue(this.techID);
    }
  }

  public subTechnologyForm = this.formBuilder.group({
    TechID: [0, [Validators.required]],
    SubTechnologyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[0-9a-zA-Z\u0590-\u05FF\u200f\u200e ]*$')]],
    MCode: [0, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]]
  });
  
  async submitForm(){
    try {

      const newSubTechnology = new SubTechnology(this.subTechnologyForm.value.SubTechnologyName, +this.subTechnologyForm.value.MCode, +this.subTechnologyForm.value.TechID);
      if(this.toolId){
        await this.toolsDefinitionService.updateToolDefinition(newSubTechnology, this.toolId);
        // this.toolsDefinitionService.subTechnologies = this.toolsDefinitionService.subTechnologies.map(tool => tool.SubTechnologyID === this.toolId ? newSubTechnology : tool);
        this.toastService.success('הטכנולוגיה עודכנה בהצלחה');
        this.initialForm();
      } else{
        await this.toolsDefinitionService.createToolDefinition(newSubTechnology);
        // const id = await this.toolsDefinitionService.createToolDefinition(newSubTechnology);
        // newSubTechnology.SubTechnologyID = id;
        // this.toolsDefinitionService.subTechnologies.push(newSubTechnology);
        this.toastService.success('הטכנולוגיה נוצרה בהצלחה');
        this.subTechnologyForm.controls.MCode.setValue(newSubTechnology.MCode + 1);
      }
      
      // newSubTechnology.Technology = this.toolsDefinitionService.technologies.find(tech => tech.TechnologyID === newSubTechnology.TechID);
      // this.toolsDefinitionService.dataSubject.next(true);

      this.subTechnologyForm.controls.SubTechnologyName.setValue(null);
      this.toolId = null;
    } catch (error: any) {
      this.toastService.error(error);
    }
  }

  resetForm() {
    this.formDirective.resetForm();
    this.subTechnologyForm.reset();
  }

  async deleteSubTechnology(): Promise<void> {
    const tool = this.toolsDefinitionService.toolTopLevelDefinitions.find(tool => tool.SubTechID === this.toolId);
    if(tool){
      this.toastService.error(" אי אפשר למחוק את התת טכנולוגיה הזאת כי היא בשימוש ");
      return;
    }

    const dialogData = new ConfirmDialogModel("מחיקת תת טכנולוגיה", "האם אתה בטוח שאתה רוצה למחוק את התת טכנולוגיה?");

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        try {
          await this.toolsDefinitionService.deleteToolDefinition("SubTechnology", this.toolId);
          this.toolsDefinitionService.subTechnologies = this.toolsDefinitionService.subTechnologies.filter(subTechnology => subTechnology.SubTechnologyID !== this.toolId);
          this.toolsDefinitionService.dataSubject.next(true);
          this.toastService.success('הטכנולוגיה נמחקה בהצלחה');
          this.resetForm();
          this.toolId = null;
          
        } catch (error: any) {
          this.toastService.error(error);
        }
      }
    });
  }
}
