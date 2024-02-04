import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { MeasurementUnits } from 'src/app/models/toolDefinitionModels/measurement-units';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-measurement-units-form',
  templateUrl: './measurement-units-form.component.html',
  styleUrls: ['./measurement-units-form.component.css']
})
export class MeasurementUnitsFormComponent implements OnChanges {
  @Input() public toolId: number = null;

  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private toastService: ToastService
  ) { }

  ngOnChanges(): void {
    console.log(this.toolId);
    console.log(this.toolsDefinitionService.measurementUnits);
    
    
    if(this.toolId){
      const tool = this.toolsDefinitionService.measurementUnits.find(tool => tool.MeasurementUnitsID === this.toolId);
      console.log(tool);
      
      this.measurementUnitsForm.setValue({
        MeasurementUnitsID: tool.MeasurementUnitsID,
        Symbol: tool.Symbol,
      });
    }
  }

  public measurementUnitsForm = this.formBuilder.group({
    MeasurementUnitsID: [0, [Validators.required]],
    Symbol: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
  });

  async submitForm() {
    try {
      const newMeasurementUnits = new MeasurementUnits(
        +this.measurementUnitsForm.value.MeasurementUnitsID,
        this.measurementUnitsForm.value.Symbol,
      );

      if(this.toolId){
        await this.toolsDefinitionService.updateToolDefinition(newMeasurementUnits, this.toolId);
        this.toolsDefinitionService.measurementUnits = this.toolsDefinitionService.measurementUnits.map(measurementUnits => measurementUnits.MeasurementUnitsID === this.toolId ? newMeasurementUnits : measurementUnits);
        this.toastService.success('היחידות נמדדו בהצלחה');
      } else{
        const id = await this.toolsDefinitionService.createToolDefinition(newMeasurementUnits);
        newMeasurementUnits.MeasurementUnitsID = id;
        this.toolsDefinitionService.measurementUnits.push(newMeasurementUnits);
        this.toastService.success('היחידות נוצרו בהצלחה');
      }

      this.toolsDefinitionService.dataSubject.next(true);
      this.measurementUnitsForm.reset();
      this.toolId = null;
    } catch (error) {
      this.toastService.error('אירעה שגיאה');
    }
  }

}
