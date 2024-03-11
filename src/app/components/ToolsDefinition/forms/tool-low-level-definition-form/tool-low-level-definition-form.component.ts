import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'angular-toastify';
import { ConfirmDialogComponent } from 'src/app/components/dashboard/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from 'src/app/models/confirm-dialog';
import { SubTechnology } from 'src/app/models/toolDefinitionModels/sub-technology';
import { ToolFamilyLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-family-level-definition';
import { ToolLowLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-low-level-definition';
import { ToolMeasurementLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-measurement-level-definition';
import { ToolTopLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-top-level-definition';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-tool-low-level-definition-form',
  templateUrl: './tool-low-level-definition-form.component.html',
  styleUrls: ['./tool-low-level-definition-form.component.css']
})
export class ToolLowLevelDefinitionFormComponent implements OnChanges, OnInit {
  @Input() public toolId: number = null;
  @Input() public toolMeasurementLevelDefinitionId: number = null;
  public toolLowLevelDefinitions: ToolLowLevelDefinition[] = [];

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  subTechnologies: SubTechnology[];
  toolTopLevels: ToolTopLevelDefinition[];
  toolFamilyLevels: ToolFamilyLevelDefinition[];
  toolMeasurementLevels: ToolMeasurementLevelDefinition[];

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private dialog: MatDialog,
    private formBuilder : FormBuilder,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {


    this.resetForm();

    this.toolLowLevelDefinitionForm.controls.TechID.valueChanges.subscribe((value: number) => {
      if(!value) {
        this.subTechnologies = this.toolsDefinitionService.subTechnologies;
        return;
      }
      this.subTechnologies = this.toolsDefinitionService.subTechnologies.filter(subTech => subTech.TechID === +value);
      if(this.subTechnologies.length === 0 && value){
        this.toastService.error('לא קיימות תת טכנולוגיות תחת טכנולוגיה זו');
      }
    });

    this.toolLowLevelDefinitionForm.controls.SubTechID.valueChanges.subscribe((value: number) => {
      if(!value) {
        this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
        return;
      }
      this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions.filter(tool => tool.SubTechID === +value);
      
      if(this.toolTopLevels.length === 0 && value){
        this.toastService.error('לא קיימים כלים על פי הטכנולוגיה והתת טכנולוגיה שנבחרו');
        return;
      }

      this.toolLowLevelDefinitionForm.controls.TechID.setValue(
        this.toolsDefinitionService.subTechnologies.find(subTech => subTech.SubTechnologyID === +value)?.TechID
      );
    });

    this.toolLowLevelDefinitionForm.controls.ToolTopLevelDefinitionID.valueChanges.subscribe((value: number) =>{
      if(!value) {
        this.toolMeasurementLevels = this.toolsDefinitionService.toolMeasurementLevelDefinitions;
        return;
      }

      const tool = this.toolsDefinitionService.toolTopLevelDefinitions.find(tool => tool.ToolTopLevelDefinitionID === +value);
      this.toolFamilyLevels = this.toolsDefinitionService.toolFamilyDefinitions.filter(tool => tool.ToolTopLevelDefinitionID === +value);

      if(tool.ToolFamilyLevelDefinitions.length === 0){
        this.toastService.error('לא קיימים משפחות כלים על פי הכלי שנבחר');
        return;
      }

      this.toolMeasurementLevels = [];
      tool.ToolFamilyLevelDefinitions.forEach(toolFamily => {
        this.toolMeasurementLevels = this.toolMeasurementLevels.concat(toolFamily.ToolMeasurementLevelDefinitions);
      });

      if(this.toolMeasurementLevels.length === 0){
        this.toastService.error('לא קיימים תחומי מדידה על פי הכלי שנבחר');
        return;
      }


      if(tool){
        this.toolLowLevelDefinitionForm.controls.SubTechID.setValue(tool.SubTechID);
        this.toolLowLevelDefinitionForm.controls.TechID.setValue(tool.SubTechnology?.TechID);
      }
    });

    this.toolLowLevelDefinitionForm.controls.ToolFamilyLevelDefinitionID.valueChanges.subscribe((value: number) => {
      if(!value) return;

      const tool = this.toolsDefinitionService.toolFamilyDefinitions.find(tool => tool.ToolFamilyLevelDefinitionID === +value);
      
      if(tool.ToolMeasurementLevelDefinitions.length === 0){
        this.toastService.error('לא קיימים תחומי מדידה על פי המשפחה שנבחרה');
        return;
      }

      if(tool){
        this.toolLowLevelDefinitionForm.controls.TechID.setValue(tool.ToolTopLevelDefinition.SubTechnology?.TechID);
        this.toolLowLevelDefinitionForm.controls.SubTechID.setValue(tool.ToolTopLevelDefinition.SubTechID);
        this.toolLowLevelDefinitionForm.controls.ToolTopLevelDefinitionID.setValue(tool.ToolTopLevelDefinitionID);
      }
    });

    this.toolLowLevelDefinitionForm.controls.ToolMeasurementLevelDefinitionID.valueChanges.subscribe((value: number) =>{
      if(!value) return;
      const tool = this.toolsDefinitionService.toolMeasurementLevelDefinitions.find(tool => tool.ToolMeasurementLevelDefinitionID === +value);
      
      if(tool){
        this.toolLowLevelDefinitionForm.controls.TechID.setValue(tool.ToolFamilyLevelDefinition.ToolTopLevelDefinition?.SubTechnology?.TechID);
        this.toolLowLevelDefinitionForm.controls.SubTechID.setValue(tool.ToolFamilyLevelDefinition.ToolTopLevelDefinition?.SubTechID);
        this.toolLowLevelDefinitionForm.controls.ToolTopLevelDefinitionID.setValue(tool.ToolFamilyLevelDefinition.ToolTopLevelDefinitionID);
        this.toolLowLevelDefinitionForm.controls.ToolFamilyLevelDefinitionID.setValue(tool.ToolFamilyLevelDefinitionID);

      }
    });

    this.toolLowLevelDefinitionForm.controls.MCode.valueChanges.subscribe((value: number) => {
      if(!value) return;
      this.toolLowLevelDefinitionForm.controls.ValueMax.setValue(value);
    });

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.toolLowLevelDefinitionForm.controls.ToolMeasurementLevelDefinitionID.setValue(this.toolMeasurementLevelDefinitionId);
      this.setDefaultSelectsValues();
    });
    this.setDefaultSelectsValues();    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['toolId'] && changes['toolId'].currentValue !== changes['toolId'].previousValue && this.toolsDefinitionService.toolLowLevelDefinitions){
      const tool = this.toolsDefinitionService.toolLowLevelDefinitions.find(tool => tool.ToolLowLevelDefinitionID == this.toolId);
      if(!tool) return;
      this.toolLowLevelDefinitionForm.setValue({
        TechID: tool.ToolMeasurementLevelDefinition.ToolFamilyLevelDefinition?.ToolTopLevelDefinition?.SubTechnology?.TechID || 0,
        SubTechID: tool.ToolMeasurementLevelDefinition.ToolFamilyLevelDefinition?.ToolTopLevelDefinition?.SubTechID || 0,
        ToolTopLevelDefinitionID: tool.ToolMeasurementLevelDefinition.ToolFamilyLevelDefinition?.ToolTopLevelDefinitionID,
        ToolFamilyLevelDefinitionID: tool.ToolMeasurementLevelDefinition.ToolFamilyLevelDefinitionID,
        ToolMeasurementLevelDefinitionID: tool.ToolMeasurementLevelDefinitionID,
        MCode: tool.MCode,
        ValueMin: tool.ValueMin,
        ValueMax: tool.ValueMax,
      });
    }  
    if(changes['toolMeasurementLevelDefinitionId']){
      this.toolLowLevelDefinitionForm.controls.ToolMeasurementLevelDefinitionID.setValue(this.toolMeasurementLevelDefinitionId);
    }
  }

  public toolLowLevelDefinitionForm = this.formBuilder.group({
    TechID: [0],
    SubTechID: [0],
    ToolTopLevelDefinitionID: [0],
    ToolFamilyLevelDefinitionID: [0],
    ToolMeasurementLevelDefinitionID: [0, [Validators.required]],
    MCode: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]],
    ValueMin: [0.0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+(.[0-9]{0,1})?$')]],
    ValueMax: [0.0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+(.[0-9]{0,1})?$')]],
  });

  async submitForm(){
    const newTool = new ToolLowLevelDefinition(
      +this.toolLowLevelDefinitionForm.value.MCode,
      +this.toolLowLevelDefinitionForm.value.ToolMeasurementLevelDefinitionID,
      +this.toolLowLevelDefinitionForm.value.ValueMin,
      +this.toolLowLevelDefinitionForm.value.ValueMax,
    );
    console.log(+newTool.ValueMin);
    
    if(this.toolId){
      await this.toolsDefinitionService.updateToolDefinition(newTool, this.toolId);
      this.toastService.success('הכלי עודכן בהצלחה');
    } else{
      await this.toolsDefinitionService.createToolDefinition(newTool);
      this.toastService.success('הכלי נוצר בהצלחה');
    }
    this.toolLowLevelDefinitionForm.controls.ToolMeasurementLevelDefinitionID.setValue(newTool.ToolMeasurementLevelDefinitionID);
    console.log(this.toolLowLevelDefinitionForm.value);

    this.toolId = null;
    // this.resetForm();
    
    this.toolLowLevelDefinitionForm.controls.MCode.setValue(null);
    this.toolLowLevelDefinitionForm.controls.ValueMax.setValue(null);
    this.toolLowLevelDefinitionForm.controls.MCode.setErrors(null);
    this.toolLowLevelDefinitionForm.controls.ValueMax.setErrors(null);
  }

  resetForm() {
    if(this.toolLowLevelDefinitionForm.controls.ValueMin.value) {      
      this.toolLowLevelDefinitionForm.controls.ValueMin.setValue(this.toolLowLevelDefinitionForm.controls.ValueMax.value || 0);
    } else {      
      this.toolLowLevelDefinitionForm.controls.ValueMin.setValue(0);
    }
    this.toolLowLevelDefinitionForm.controls.MCode.setValue(null);
    this.toolLowLevelDefinitionForm.controls.ValueMax.setValue(null);

    this.toolLowLevelDefinitionForm.controls.MCode.setErrors(null);
    this.toolLowLevelDefinitionForm.controls.ValueMax.setErrors(null);

  }
  async deleteToolLowLevelDefinition(): Promise<void> {

    const dialogData = new ConfirmDialogModel("אישור מחיקת כלי", "האם אתה בטוח שברצונך למחוק את הכלי?");

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(async dialogResult => {
      if(dialogResult){
        try {
          await this.toolsDefinitionService.deleteToolDefinition("ToolLowLevelDefinition", this.toolId);
          this.toolsDefinitionService.toolLowLevelDefinitions = this.toolsDefinitionService.toolLowLevelDefinitions.filter(toolLowLevelDefinition => toolLowLevelDefinition.ToolLowLevelDefinitionID !== this.toolId);
          this.toolsDefinitionService.dataSubject.next(true);
          this.toolId = null;
          this.toastService.success('הכלי נמחק בהצלחה');
          this.resetForm();
        } catch (error: any) {
          this.toastService.error(error);
        }
      }
    });
  }

  setDefaultSelectsValues(){
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
    this.toolFamilyLevels = this.toolsDefinitionService.toolFamilyDefinitions;
    this.toolMeasurementLevels = this.toolsDefinitionService.toolMeasurementLevelDefinitions;
  }
}
