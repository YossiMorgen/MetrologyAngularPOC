import { Component, OnInit } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { MeasurementUnit } from 'src/app/models/toolDefinitionModels/measurement-unit';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-measurement-units',
  templateUrl: './measurement-units.component.html',
  styleUrls: ['./measurement-units.component.css']
})
export class MeasurementUnitComponent implements OnInit {
  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private toastService: ToastService
    ) { }
  public MeasurementUnits = this.toolsDefinitionService.MeasurementUnit;
  public MeasurementUnit: MeasurementUnit = null;


  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe((data) => {
      this.MeasurementUnits = this.toolsDefinitionService.MeasurementUnit;
    });
  }

  changeMeasurementUnit(MeasurementUnit: MeasurementUnit): void {
    this.MeasurementUnit = MeasurementUnit;
  }

  async deleteMeasurementUnit(MeasurementUnit: MeasurementUnit): Promise<void> {

    if(MeasurementUnit.ToolMeasurementLevelDefinition.length > 0){
      this.toastService.error('לא ניתן למחוק יחידת מדידה עם תחומי מדידה');
      return;
    }

    try {
      await this.toolsDefinitionService.deleteToolDefinition("MeasurementUnit", MeasurementUnit.MeasurementUnitID);
      this.toolsDefinitionService.MeasurementUnit = this.toolsDefinitionService.MeasurementUnit.filter(MeasurementUnit => MeasurementUnit.MeasurementUnitID === MeasurementUnit.MeasurementUnitID);
      this.toolsDefinitionService.dataSubject.next(true);
      this.toastService.success('יחידת המדידה נמחקה בהצלחה');
    } catch (error) {
      this.toastService.error("שגיאה במחיקת יחידת מדידה ");
    }
  }
}
