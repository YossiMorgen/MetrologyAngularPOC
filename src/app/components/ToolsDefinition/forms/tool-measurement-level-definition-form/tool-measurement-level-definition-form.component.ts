import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
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
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies;
      this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
    });

    this.toolMeasurementLevelDefinitionForm.controls.TechID.valueChanges.subscribe((value) => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies.filter(subTech => subTech.TechID === +value);
      if(this.subTechnologies.length === 0 && value){
        this.toastService.error('לא קיימות תת טכנולוגיות תחת טכנולוגיה זו');
      }
    });

    this.toolMeasurementLevelDefinitionForm.controls.SubTechID.valueChanges.subscribe((value) => {
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

    this.toolMeasurementLevelDefinitionForm.controls.ToolTopLevelDefinitionID.valueChanges.subscribe(value =>{
      const tool = this.toolsDefinitionService.toolTopLevelDefinitions.find(tool => tool.ToolTopLevelDefinitionID === +value);
      this.toolMeasurementLevelDefinitionForm.controls.SubTechID.setValue(tool.SubTechID);
      this.toolMeasurementLevelDefinitionForm.controls.TechID.setValue(tool.SubTechnology?.TechID);
    });

    // set all the form to null
    this.toolMeasurementLevelDefinitionForm.setValue({
      TechID: null,
      SubTechID: null,
      ToolTopLevelDefinitionID: null,
      ValueMin: null,
      ValueMax: null,
      ValueUnitID: null,
      MCode: null,
      UncertaintyDelta: null,
      UncertaintyUnitID: null
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
        UncertaintyDelta: tool.UncertaintyDelta,
        UncertaintyUnitID: tool.UncertaintyUnitID
      });
    }
  }

  public toolMeasurementLevelDefinitionForm = this.formBuilder.group({
    TechID:[0],
    SubTechID: [0],
    ToolTopLevelDefinitionID: [0],
    ValueUnitID: [0, [Validators.required]],
    ValueMin: [1.0000, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'), Validators.min(0)]],
    ValueMax: [1.0000, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'), Validators.min(0)]],
    MCode: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    UncertaintyUnitID: [1.0000, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'), Validators.min(0)]],
    UncertaintyDelta: [0, [Validators.required]],
  });

  async submitForm(){
    const newTool = new ToolMeasurementLevelDefinition(this.toolMeasurementLevelDefinitionForm.value.ToolTopLevelDefinitionID, +this.toolMeasurementLevelDefinitionForm.value.ValueMin, +this.toolMeasurementLevelDefinitionForm.value.ValueMax, +this.toolMeasurementLevelDefinitionForm.value.ValueUnitID, +this.toolMeasurementLevelDefinitionForm.value.MCode, +this.toolMeasurementLevelDefinitionForm.value.UncertaintyDelta, +this.toolMeasurementLevelDefinitionForm.value.UncertaintyUnitID);
    console.log(newTool);
    
    if(this.toolId){
      await this.toolsDefinitionService.updateToolDefinition(newTool, this.toolId);
      this.toolsDefinitionService.toolMeasurementLevelDefinition = this.toolsDefinitionService.toolMeasurementLevelDefinition.map(tool => tool.ToolMeasurementLevelDefinitionID === this.toolId ? newTool : tool);
      this.toastService.success('הכלי עודכן בהצלחה');
    } else{
      const id = await this.toolsDefinitionService.createToolDefinition(newTool);
      newTool.ToolMeasurementLevelDefinitionID = id;
      this.toolsDefinitionService.toolMeasurementLevelDefinition.push(newTool);
      this.toastService.success('הכלי נוצר בהצלחה');
    }

    newTool.ToolTopLevelDefinition = this.toolsDefinitionService.toolTopLevelDefinitions.find(tool => tool.ToolTopLevelDefinitionID === newTool.ToolTopLevelDefinitionID);
    newTool.ValueUnit = this.toolsDefinitionService.measurementUnits.find(unit => unit.MeasurementUnitsID === newTool.ValueUnitID);
    newTool.UncertaintyUnit = this.toolsDefinitionService.measurementUnits.find(unit => unit.MeasurementUnitsID === newTool.UncertaintyUnitID);

    this.toolsDefinitionService.dataSubject.next(true);
    this.toolId = null;
    this.formDirective.resetForm();

    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions;
  }
}
