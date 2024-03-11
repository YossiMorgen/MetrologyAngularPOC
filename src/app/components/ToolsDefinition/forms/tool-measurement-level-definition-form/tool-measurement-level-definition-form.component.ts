import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ConfirmDialogComponent } from 'src/app/components/dashboard/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from 'src/app/models/confirm-dialog';
import { SubTechnology } from 'src/app/models/toolDefinitionModels/sub-technology';
import { ToolFamilyLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-family-level-definition';
import { ToolMeasurementLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-measurement-level-definition';
import { ToolTopLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-top-level-definition';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-tool-measurement-level-definition-form',
  templateUrl: './tool-measurement-level-definition-form.component.html',
  styleUrls: ['./tool-measurement-level-definition-form.component.css']
})
export class ToolMeasurementLevelDefinitionFormComponent implements OnChanges, OnInit {
  @Input() public toolId: number = null;
  @Input() public toolFamilyLevelDefinitionId: number = null;
  @Input() public toolMeasurementLevelDefinitions: ToolMeasurementLevelDefinition[] = [];
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {

    this.toolMeasurementLevelDefinitionForm.controls.TechID.valueChanges.subscribe((value: number) => {
      if(!value) return;

      const technology = this.toolsDefinitionService.technologies.find(tech => tech.TechnologyID === +value);
      if(technology){
        this.updateSubTechnologies(this.subTechnologies);
      }
    });

    this.toolMeasurementLevelDefinitionForm.controls.SubTechID.valueChanges.subscribe((value: number) => {
      if(!value) return;

      const SubTechnology = this.toolsDefinitionService.subTechnologies.find(subTech => subTech.SubTechnologyID === +value);
      if(SubTechnology){
        this.updateToolTopLevels(this.toolTopLevels);
      }
      this.toolMeasurementLevelDefinitionForm.controls.TechID.setValue(SubTechnology.TechID, {emitEvent: false});
    });

    this.toolMeasurementLevelDefinitionForm.controls.ToolTopLevelDefinitionID.valueChanges.subscribe((value: number) =>{
      const tool = this.toolsDefinitionService.toolTopLevelDefinitions?.find(tool => tool.ToolTopLevelDefinitionID === +value);
      if(tool){
        this.updateToolFamilies(tool.ToolFamilyLevelDefinitions);
        this.toolMeasurementLevelDefinitionForm.controls.SubTechID.setValue(tool.SubTechID, {emitEvent: false});
        this.toolMeasurementLevelDefinitionForm.controls.TechID.setValue(tool.SubTechnology?.TechID, {emitEvent: false});
      }
    });

    this.toolMeasurementLevelDefinitionForm.controls.ToolFamilyLevelDefinitionID.valueChanges.subscribe((value: number) => {
      if(!value) return;
      // this.router.navigate([`/tool_definitions/tool_measurement_level_definition/${value}`]);
      this.onToolFamilyIdChange(value);
    });

    this.toolMeasurementLevelDefinitionForm.controls.MCode.valueChanges.subscribe((value: number) => {
      if(!value) return;
      this.toolMeasurementLevelDefinitionForm.controls.ValueMax.setValue(value);
    });

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.setSelectsDefaultValues();
      this.toolMeasurementLevelDefinitionForm.controls.ToolFamilyLevelDefinitionID.setValue(this.toolFamilyLevelDefinitionId);
    });
    this.setSelectsDefaultValues();
    this.toolMeasurementLevelDefinitionForm.reset();
    this.toolMeasurementLevelDefinitionForm.controls.ValueMin.setValue(0);

  }

  onToolFamilyIdChange(value: number){
    console.log("onToolFamilyIdChange");
    
    const tool = this.toolsDefinitionService.toolFamilyDefinitions?.find(tool => tool.ToolFamilyLevelDefinitionID === +value);
    console.log(tool);
    
    if(tool){
      this.subTechnologies = this.toolsDefinitionService.subTechnologies;
      this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
      this.toolFamilies = this.toolsDefinitionService.toolFamilyDefinitions;
      this.toolMeasurementLevelDefinitionForm.controls.ToolTopLevelDefinitionID.setValue(tool.ToolTopLevelDefinitionID, {emitEvent: false});
      this.toolMeasurementLevelDefinitionForm.controls.SubTechID.setValue(tool.ToolTopLevelDefinition.SubTechID, {emitEvent: false});
      this.toolMeasurementLevelDefinitionForm.controls.TechID.setValue(tool.ToolTopLevelDefinition.SubTechnology.SubTechnologyID, {emitEvent: false});
      console.log(this.toolMeasurementLevelDefinitionForm.value);
      // the html doesn't render properly so we need to do it manually
      // this.toolMeasurementLevelDefinitionForm.controls.ToolTopLevelDefinitionID.updateValueAndValidity();
      // this.toolMeasurementLevelDefinitionForm.controls.SubTechID.updateValueAndValidity();
      // this.toolMeasurementLevelDefinitionForm.controls.TechID.updateValueAndValidity();
      this.toolMeasurementLevelDefinitionForm.updateValueAndValidity();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(
      changes['toolId'] && 
      changes['toolId'].currentValue !== changes['toolId'].previousValue && 
      this.toolsDefinitionService.toolMeasurementLevelDefinitions && 
      this.toolId
    ){
      const tool = this.toolsDefinitionService.toolMeasurementLevelDefinitions.find(tool => tool.ToolMeasurementLevelDefinitionID == this.toolId);
      
      this.toolMeasurementLevelDefinitionForm.setValue({
        TechID: tool.ToolFamilyLevelDefinition?.ToolTopLevelDefinition?.SubTechnology?.TechID || 0,
        SubTechID: tool.ToolFamilyLevelDefinition?.ToolTopLevelDefinition?.SubTechID || 0,
        ToolTopLevelDefinitionID: tool.ToolFamilyLevelDefinition?.ToolTopLevelDefinitionID,
        ToolFamilyLevelDefinitionID: tool.ToolFamilyLevelDefinitionID,
        ValueMin: tool.ValueMin,
        ValueMax: tool.ValueMax,
        ValueUnitID: tool.ValueUnitID,
        MCode: tool.MCode,
      });
    }

    if(changes['toolFamilyLevelDefinitionId']){
      console.log('toolFamilyLevelDefinitionId');
      
      console.log(this.toolFamilyLevelDefinitionId);
      
      this.toolMeasurementLevelDefinitionForm.controls.ToolFamilyLevelDefinitionID.setValue(this.toolFamilyLevelDefinitionId);
      this.toolMeasurementLevelDefinitionForm.controls.ToolFamilyLevelDefinitionID.updateValueAndValidity();

      this.onToolFamilyIdChange(this.toolFamilyLevelDefinitionId);
    }
  }

  toolMeasurementLevelDefinitionForm = this.formBuilder.group({
    TechID:[0],
    SubTechID: [0],
    ToolTopLevelDefinitionID: [0],
    ToolFamilyLevelDefinitionID: [0, [Validators.required]],
    ValueUnitID: [0, [Validators.required]],
    ValueMin: [1.0000, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'), Validators.min(0)]],
    ValueMax: [1.0000, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'), Validators.min(0)]],
    MCode: [0, [Validators.required, Validators.pattern('^[0-9]*$')]]
  });

  async submitForm(){
    const newTool = new ToolMeasurementLevelDefinition(
      this.toolMeasurementLevelDefinitionForm.value.ToolFamilyLevelDefinitionID, 
      +this.toolMeasurementLevelDefinitionForm.value.ValueMin, 
      +this.toolMeasurementLevelDefinitionForm.value.ValueMax, 
      +this.toolMeasurementLevelDefinitionForm.value.ValueUnitID, 
      +this.toolMeasurementLevelDefinitionForm.value.MCode

    );
    console.log(newTool);
    
    if(this.toolId){
      await this.toolsDefinitionService.updateToolDefinition(newTool, this.toolId);
      this.toastService.success('הכלי עודכן בהצלחה');
    } else{
      await this.toolsDefinitionService.createToolDefinition(newTool);
      this.toastService.success('הכלי נוצר בהצלחה');
    }
    this.toolId = null;

    this.toolMeasurementLevelDefinitionForm.controls.MCode.setValue(null);
    this.toolMeasurementLevelDefinitionForm.controls.ValueMax.setValue(null);
    this.toolMeasurementLevelDefinitionForm.controls.MCode.setErrors(null);
    this.toolMeasurementLevelDefinitionForm.controls.ValueMax.setErrors(null);
  }

  resetForm() {
    this.formDirective.resetForm();
    this.toolMeasurementLevelDefinitionForm.reset();
  }

  async deleteToolMeasurementLevelDefinition(): Promise<void> {
    const tool = this.toolsDefinitionService.toolLowLevelDefinitions.find(tool => tool.ToolMeasurementLevelDefinitionID === this.toolId);
    if(tool){
      this.toastService.error(" אי אפשר למחוק את הכלי הזה כי הוא בשימוש ");
      return;
    }

    const dialogData = new ConfirmDialogModel("אישור מחיקת כלי", "האם אתה בטוח שברצונך למחוק את הכלי?");
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        try {
          await this.toolsDefinitionService.deleteToolDefinition("ToolMeasurementLevelDefinition", this.toolId);
          this.toolsDefinitionService.toolMeasurementLevelDefinitions = this.toolsDefinitionService.toolMeasurementLevelDefinitions.filter(toolMeasurementLevelDefinition => toolMeasurementLevelDefinition.ToolMeasurementLevelDefinitionID !== this.toolId);
          this.toolsDefinitionService.dataSubject.next(true);
          this.toolId = null;
          this.resetForm();
          this.toastService.success('הכלי נמחק בהצלחה');
        } catch (error: any) {
          this.toastService.error(error);
        }
      }
    });
  }

  // organize SelectsValues -----------------------------------------------------------------------------------

  
  subTechnologies: SubTechnology[];
  toolTopLevels: ToolTopLevelDefinition[];
  toolFamilies: ToolFamilyLevelDefinition[];

  setSelectsDefaultValues(){    
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
    this.toolFamilies = this.toolsDefinitionService.toolFamilyDefinitions;   
  }

  updateSubTechnologies(subTechnologies: SubTechnology[]){
    this.subTechnologies = subTechnologies;
    if(this.subTechnologies.length === 0){
      this.toastService.error('לא קיימות תת טכנולוגיות על פי הבחירה הנוכחית');
      return;
    }

    if(this.subTechnologies.length === 1){
      this.toolMeasurementLevelDefinitionForm.controls.SubTechID.setValue(this.subTechnologies[0].SubTechnologyID, { emitEvent: false });
    }

    let toolTopLevels: ToolTopLevelDefinition[] = [];
    subTechnologies.forEach(subTech =>
      toolTopLevels.push(...subTech.ToolTopLevelDefinitions)
    );
    this.updateToolTopLevels(toolTopLevels);
  }

  updateToolTopLevels(toolTopLevels: ToolTopLevelDefinition[]){
    this.toolTopLevels = toolTopLevels;
    if(this.toolTopLevels.length === 0){
      this.toastService.error('לא קיימים כלים על פי הבחירה הנוכחית');
      return;
    }

    if(this.toolTopLevels.length === 1){
      this.toolMeasurementLevelDefinitionForm.controls.ToolTopLevelDefinitionID.setValue(this.toolTopLevels[0].ToolTopLevelDefinitionID, { emitEvent: false });
    }
    console.log(toolTopLevels);
    
    let toolFamilies: ToolFamilyLevelDefinition[] = [];
    toolTopLevels.forEach(toolTopLevel =>
      toolFamilies.push(...toolTopLevel.ToolFamilyLevelDefinitions)
    );
    this.updateToolFamilies(toolFamilies);
  }

  updateToolFamilies(toolFamilies: ToolFamilyLevelDefinition[]){
    this.toolFamilies = toolFamilies;
    if(this.toolFamilies.length === 0){
      this.toastService.error('לא קיימים משפחות כלים על פי הבחירה הנוכחית');
      return;
    }
    console.log(toolFamilies);
    
    if(this.toolFamilies.length === 1){
      this.toolMeasurementLevelDefinitionForm.controls.ToolFamilyLevelDefinitionID.setValue(this.toolFamilies[0].ToolFamilyLevelDefinitionID, { emitEvent: false });
    }
  }

  // set Form Default Values -----------------------------------------------------------------------------------
  setFormDefaultValues(){
    if(this.toolId){
      const tool = this.toolsDefinitionService.toolMeasurementLevelDefinitions.find(tool => tool.ToolMeasurementLevelDefinitionID == this.toolId);
      
      this.toolMeasurementLevelDefinitionForm.setValue({
        TechID: tool.ToolFamilyLevelDefinition?.ToolTopLevelDefinition?.SubTechnology?.TechID || 0,
        SubTechID: tool.ToolFamilyLevelDefinition?.ToolTopLevelDefinition?.SubTechID || 0,
        ToolTopLevelDefinitionID: tool.ToolFamilyLevelDefinition?.ToolTopLevelDefinitionID,
        ToolFamilyLevelDefinitionID: tool.ToolFamilyLevelDefinitionID,
        ValueMin: tool.ValueMin,
        ValueMax: tool.ValueMax,
        ValueUnitID: tool.ValueUnitID,
        MCode: tool.MCode,
      });
      return;
    }
  }
}
