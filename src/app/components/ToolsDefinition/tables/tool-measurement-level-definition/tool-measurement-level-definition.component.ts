import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ToolMeasurementLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-measurement-level-definition';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-tool-measurement-level-definition',
  templateUrl: './tool-measurement-level-definition.component.html',
  styleUrls: ['./tool-measurement-level-definition.component.css']
})
export class ToolMeasurementLevelDefinitionComponent implements OnInit {

  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) { }

  public toolId: number = null;
  public toolFamilyLevelDefinitionId: number = null;
  public toolMeasurementLevelDefinitions: ToolMeasurementLevelDefinition[] = this.toolsDefinitionService.toolMeasurementLevelDefinitions;

  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe((data) => {
      this.setToolMeasurementLevelDefinitions();
    });
    this.route.params.subscribe(params => {
      this.toolFamilyLevelDefinitionId = +params['id'];
      this.setToolMeasurementLevelDefinitions();
    });
    this.setToolMeasurementLevelDefinitions();
  }

  setToolMeasurementLevelDefinitions(){
    if(this.toolFamilyLevelDefinitionId && this.toolsDefinitionService.toolMeasurementLevelDefinitions){
      this.toolMeasurementLevelDefinitions = this.toolsDefinitionService.toolMeasurementLevelDefinitions
        .filter(x => x.ToolFamilyLevelDefinitionID == this.toolFamilyLevelDefinitionId)
    } else {
      this.toolMeasurementLevelDefinitions = this.toolsDefinitionService.toolMeasurementLevelDefinitions;
    }
  }

  changeToolId(toolId: number): void {
    this.toolId = toolId;
  }
}
