import { Component, OnInit } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-measurement-units',
  templateUrl: './measurement-units.component.html',
  styleUrls: ['./measurement-units.component.css']
})
export class MeasurementUnitsComponent implements OnInit {
  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private toastService: ToastService
  ) { }
  public measurementUnits = this.toolsDefinitionService.measurementUnits;

  public toolId: number = null;

  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe((data) => {
      this.measurementUnits = this.toolsDefinitionService.measurementUnits;
    });
  }

  changeToolId(toolId: number): void {
    this.toolId = toolId;
  }

  async deleteMeasurementUnit(toolId: number): Promise<void> {
    const toolMeasurementLevel = this.toolsDefinitionService.toolMeasurementLevelDefinition.find(tool => tool.ValueUnitID === toolId || tool.UncertaintyUnitID === toolId);
    const lowLevel = this.toolsDefinitionService.toolLowLevelDefinition.find(tool => tool.ValueUnitID === toolId);
    if(lowLevel || toolMeasurementLevel){
      this.toastService.warn("אי אפשר למחוק את היחידה הזו כי היא בשימוש")
      return;
    }

    try {
      await this.toolsDefinitionService.deleteToolDefinition("MeasurementUnits", toolId);
      this.toolsDefinitionService.measurementUnits = this.toolsDefinitionService.measurementUnits.filter(measurementUnits => measurementUnits.MeasurementUnitsID !== toolId);
      this.toolsDefinitionService.dataSubject.next(true);
      this.toastService.success(" יחידת מידה נמחקה בהצלחה :)");
    } catch (error: any) {
      this.toastService.error(error);
    }
  }
}
