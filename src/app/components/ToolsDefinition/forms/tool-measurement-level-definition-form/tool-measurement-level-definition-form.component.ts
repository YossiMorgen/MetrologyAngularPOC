import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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

  subTechnologies: SubTechnology[] = this.toolsDefinitionService.subTechnologies;
  toolTopLevels: ToolTopLevelDefinition[] = this.toolsDefinitionService.toolTopLevelDefinitions;

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
      if(this.subTechnologies.length === 0 && value !== 0){
        this.toastService.error('לא קיימות תת טכנולוגיות תחת טכנולוגיה זו');
      }
    });

    this.toolMeasurementLevelDefinitionForm.controls.SubTechID.valueChanges.subscribe((value) => {
      this.toolTopLevels = this.toolsDefinitionService.toolTopLevelDefinitions.filter(tool => tool.SubTechID === +value);
      if(this.toolTopLevels.length === 0 && value !== 0){
        this.toastService.error('לא קיימים כלים על פי הטכנולוגיה והתת טכנולוגיה שנבחרו');
      }
    });
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
    ValueMin: [0],
    ValueMax: [0],
    ValueUnitID: [0],
    MCode: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    UncertaintyDelta: [0, [Validators.required]],
    UncertaintyUnitID: [0]
  });

  async submitForm(){
    const newTool = new ToolMeasurementLevelDefinition(this.toolMeasurementLevelDefinitionForm.value.ToolTopLevelDefinitionID, +this.toolMeasurementLevelDefinitionForm.value.ValueMin, +this.toolMeasurementLevelDefinitionForm.value.ValueMax, +this.toolMeasurementLevelDefinitionForm.value.ValueUnitID, +this.toolMeasurementLevelDefinitionForm.value.MCode, +this.toolMeasurementLevelDefinitionForm.value.UncertaintyDelta, +this.toolMeasurementLevelDefinitionForm.value.UncertaintyUnitID);
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
    this.toolMeasurementLevelDefinitionForm.reset();
    this.toolId = null;
  }
}
