import { Component, OnInit } from '@angular/core';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-measurement-units',
  templateUrl: './measurement-units.component.html',
  styleUrls: ['./measurement-units.component.css']
})
export class MeasurementUnitComponent implements OnInit {
  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
  ) { }
  public MeasurementUnit = this.toolsDefinitionService.MeasurementUnit;


  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe((data) => {
      this.MeasurementUnit = this.toolsDefinitionService.MeasurementUnit;
    });
  }
}
