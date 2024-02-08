import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { SubTechnology } from 'src/app/models/toolDefinitionModels/sub-technology';
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
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  subTechnologies: SubTechnology[];
  toolTopLevels: ToolTopLevelDefinition[];
  toolMeasurementLevels: ToolMeasurementLevelDefinition[];

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {

    this.toolLowLevelDefinitionForm = this.formBuilder.group({
      TechID: [0],
      SubTechID: [0],
      ToolTopLevelDefinitionID: [0],
      ToolMeasurementLevelDefinitionID: [0, [Validators.required]],
      MCode: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]],
      ValueMin: [1.0000, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+(.[0-9]{0,1})?$')]],
      ValueMax: [1.0000, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+(.[0-9]{0,1})?$')]],
    });

    // set all the form to null
    this.toolLowLevelDefinitionForm.setValue({
      TechID: null,
      SubTechID: null,
      ToolTopLevelDefinitionID: null,
      ToolMeasurementLevelDefinitionID: null,
      MCode: null,
      ValueMin: null,
      ValueMax: null,
    });

    // set the selects default values
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
    this.toolMeasurementLevels = this.toolsDefinitionService.toolMeasurementLevelDefinition;
  

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies;
      this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
      this.toolMeasurementLevels = this.toolsDefinitionService.toolMeasurementLevelDefinition;
    });

    this.toolLowLevelDefinitionForm.controls.TechID.valueChanges.subscribe((value: number) => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies.filter(subTech => subTech.TechID === +value);
      if(this.subTechnologies.length === 0 && value){
        this.toastService.error('לא קיימות תת טכנולוגיות תחת טכנולוגיה זו');
      }
    });

    this.toolLowLevelDefinitionForm.controls.SubTechID.valueChanges.subscribe((value: number) => {
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
      this.toolMeasurementLevels = this.toolsDefinitionService.toolMeasurementLevelDefinition.filter(tool => tool.ToolTopLevelDefinitionID === +value);
      if(this.toolMeasurementLevels.length === 0 && value){
        this.toastService.error('לא קיימים תחומי מדידה על פי הכלי שנבחר');
        return;
      }

      const tool = this.toolsDefinitionService.toolTopLevelDefinitions.find(tool => tool.ToolTopLevelDefinitionID === +value);
      this.toolLowLevelDefinitionForm.controls.SubTechID.setValue(tool.SubTechID);
      this.toolLowLevelDefinitionForm.controls.TechID.setValue(tool.SubTechnology?.TechID);
    });

    this.toolLowLevelDefinitionForm.controls.ToolMeasurementLevelDefinitionID.valueChanges.subscribe((value: number) =>{
      const tool = this.toolsDefinitionService.toolMeasurementLevelDefinition.find(tool => tool.ToolMeasurementLevelDefinitionID === +value);
      console.log(tool);
      
      this.toolLowLevelDefinitionForm.controls.ToolTopLevelDefinitionID.setValue(tool.ToolTopLevelDefinitionID);
      this.toolLowLevelDefinitionForm.controls.SubTechID.setValue(tool.ToolTopLevelDefinition?.SubTechID);
      this.toolLowLevelDefinitionForm.controls.TechID.setValue(tool.ToolTopLevelDefinition?.SubTechnology?.TechID);
    });
  }

  ngOnChanges(): void {
    console.log(this.toolId);
    if(this.toolId){
      const tool = this.toolsDefinitionService.toolLowLevelDefinition.find(tool => tool.ToolLowLevelDefinitionID == this.toolId);
      
      this.toolLowLevelDefinitionForm.setValue({
        TechID: tool.ToolMeasurementLevelDefinition.ToolTopLevelDefinition?.SubTechnology?.TechID || 0,
        SubTechID: tool.ToolMeasurementLevelDefinition.ToolTopLevelDefinition?.SubTechID || 0,
        ToolTopLevelDefinitionID: tool.ToolMeasurementLevelDefinition.ToolTopLevelDefinitionID,
        ToolMeasurementLevelDefinitionID: tool.ToolMeasurementLevelDefinitionID,
        MCode: tool.MCode,
        ValueMin: tool.ValueMin,
        ValueMax: tool.ValueMax,
      });
    }  
  }

  public toolLowLevelDefinitionForm: any;

  async submitForm(){
    const newTool = new ToolLowLevelDefinition(
      +this.toolLowLevelDefinitionForm.value.MCode,
      +this.toolLowLevelDefinitionForm.value.ToolMeasurementLevelDefinitionID,
      +this.toolLowLevelDefinitionForm.value.ValueUnitID,
      +this.toolLowLevelDefinitionForm.value.ValueMin,
      +this.toolLowLevelDefinitionForm.value.ValueMax,
    );
    
    if(this.toolId){
      await this.toolsDefinitionService.updateToolDefinition(newTool, this.toolId);
      this.toolsDefinitionService.toolLowLevelDefinition = this.toolsDefinitionService.toolLowLevelDefinition.map(tool => tool.ToolLowLevelDefinitionID === this.toolId ? newTool : tool);
      this.toastService.success('הכלי עודכן בהצלחה');
    } else{
      const id = await this.toolsDefinitionService.createToolDefinition(newTool);
      newTool.ToolLowLevelDefinitionID = id;
      this.toolsDefinitionService.toolLowLevelDefinition.push(newTool);
      this.toastService.success('הכלי נוצר בהצלחה');
    }

    newTool.ToolMeasurementLevelDefinition = this.toolsDefinitionService.toolMeasurementLevelDefinition.find(tool => tool.ToolMeasurementLevelDefinitionID === newTool.ToolMeasurementLevelDefinitionID);
    this.toolsDefinitionService.dataSubject.next(true);

    this.toolId = null;
    this.formDirective.resetForm();

    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
    this.toolMeasurementLevels = this.toolsDefinitionService.toolMeasurementLevelDefinition;
  }
}
