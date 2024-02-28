import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'angular-toastify';
import { ConfirmDialogComponent } from 'src/app/components/dashboard/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from 'src/app/models/confirm-dialog';
import { SubTechnology } from 'src/app/models/toolDefinitionModels/sub-technology';
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
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  subTechnologies: SubTechnology[];
  toolTopLevels: ToolTopLevelDefinition[];

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private dialog: MatDialog,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.toolMeasurementLevelDefinitionForm = this.formBuilder.group({
      TechID:[0],
      SubTechID: [0],
      ToolTopLevelDefinitionID: [0, [Validators.required]],
      ValueUnitID: [0, [Validators.required]],
      ValueMin: [1.0000, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'), Validators.min(0)]],
      ValueMax: [1.0000, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'), Validators.min(0)]],
      MCode: [0, [Validators.required, Validators.pattern('^[0-9]*$')]]
    });

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies;
      this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
    });

    this.toolMeasurementLevelDefinitionForm.controls.TechID.valueChanges.subscribe((value: number) => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies.filter(subTech => subTech.TechID === +value);
      if(this.subTechnologies.length === 0 && value){
        this.toastService.error('לא קיימות תת טכנולוגיות תחת טכנולוגיה זו');
      }
    });

    this.toolMeasurementLevelDefinitionForm.controls.SubTechID.valueChanges.subscribe((value: number) => {
      this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions.filter(tool => tool.SubTechID === +value);
      if(this.toolTopLevels.length === 0 && value){
        this.toastService.error('לא קיימים כלים על פי הטכנולוגיה והתת טכנולוגיה שנבחרו');
        return;
      }
      // set TechID value
      this.toolMeasurementLevelDefinitionForm.controls.TechID.setValue(
        this.toolsDefinitionService.subTechnologies.find(subTech => subTech.SubTechnologyID === +value)?.TechID
      );
    });

    this.toolMeasurementLevelDefinitionForm.controls.ToolTopLevelDefinitionID.valueChanges.subscribe((value: number) =>{
      const tool = this.toolsDefinitionService.toolTopLevelDefinitions.find(tool => tool.ToolTopLevelDefinitionID === +value);
      this.toolMeasurementLevelDefinitionForm.controls.SubTechID.setValue(tool.SubTechID);
      this.toolMeasurementLevelDefinitionForm.controls.TechID.setValue(tool.SubTechnology?.TechID);
    });

    // set all the form to null
    this.toolMeasurementLevelDefinitionForm.setValue({
      TechID: null,
      SubTechID: null,
      ToolTopLevelDefinitionID: null,
      ValueMin: 0,
      ValueMax: null,
      ValueUnitID: null,
      MCode: null
    });

    // selects default values
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
  
  }

  ngOnChanges(): void {
    console.log(this.toolId);
    if(this.toolId){
      const tool = this.toolsDefinitionService.toolMeasurementLevelDefinition.find(tool => tool.ToolMeasurementLevelDefinitionID == this.toolId);
      
      this.toolMeasurementLevelDefinitionForm.setValue({
        TechID: tool.ToolTopLevelDefinition?.SubTechnology?.TechID || 0,
        SubTechID: tool.ToolTopLevelDefinition?.SubTechID || 0,
        ToolTopLevelDefinitionID: tool.ToolTopLevelDefinitionID,
        ValueMin: tool.ValueMin,
        ValueMax: tool.ValueMax,
        ValueUnitID: tool.ValueUnitID,
        MCode: tool.MCode,
      });
    }
  }

  public toolMeasurementLevelDefinitionForm: any;

  async submitForm(){
    const newTool = new ToolMeasurementLevelDefinition(
      this.toolMeasurementLevelDefinitionForm.value.ToolTopLevelDefinitionID, 
      +this.toolMeasurementLevelDefinitionForm.value.ValueMin, 
      +this.toolMeasurementLevelDefinitionForm.value.ValueMax, 
      +this.toolMeasurementLevelDefinitionForm.value.ValueUnitID, 
      +this.toolMeasurementLevelDefinitionForm.value.MCode
    );
    console.log(newTool);
    
    if(this.toolId){
      await this.toolsDefinitionService.updateToolDefinition(newTool, this.toolId);
      // this.toolsDefinitionService.toolMeasurementLevelDefinition = this.toolsDefinitionService.toolMeasurementLevelDefinition.map(tool => tool.ToolMeasurementLevelDefinitionID === this.toolId ? newTool : tool);
      this.toastService.success('הכלי עודכן בהצלחה');
    } else{
      await this.toolsDefinitionService.createToolDefinition(newTool);
      // const id = await this.toolsDefinitionService.createToolDefinition(newTool);
      // newTool.ToolMeasurementLevelDefinitionID = id;
      // this.toolsDefinitionService.toolMeasurementLevelDefinition.push(newTool);
      this.toastService.success('הכלי נוצר בהצלחה');
    }

    // newTool.ToolTopLevelDefinition = this.toolsDefinitionService.toolTopLevelDefinitions.find(tool => tool.ToolTopLevelDefinitionID === newTool.ToolTopLevelDefinitionID);
    // newTool.ValueUnit = this.toolsDefinitionService.MeasurementUnit.find(unit => unit.MeasurementUnitID === newTool.ValueUnitID);

    // this.toolsDefinitionService.dataSubject.next(true);
    this.toolId = null;

    this.resetForm();
    // this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    // this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
  }

  resetForm() {
    this.formDirective.resetForm();
    this.toolMeasurementLevelDefinitionForm.reset();
  }

  async deleteToolMeasurementLevelDefinition(): Promise<void> {
    const tool = this.toolsDefinitionService.toolLowLevelDefinition.find(tool => tool.ToolMeasurementLevelDefinitionID === this.toolId);
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
          this.toolsDefinitionService.toolMeasurementLevelDefinition = this.toolsDefinitionService.toolMeasurementLevelDefinition.filter(toolMeasurementLevelDefinition => toolMeasurementLevelDefinition.ToolMeasurementLevelDefinitionID !== this.toolId);
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
}
