import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-tool-low-level-definition',
  templateUrl: './tool-low-level-definition.component.html',
  styleUrls: ['./tool-low-level-definition.component.css']
})
export class ToolLowLevelDefinitionComponent implements OnInit {

  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) { }

  public toolId: number = null;
  public toolMeasurementLevelDefinitionId: number = null;
  public toolLowLevelDefinitions = this.toolsDefinitionService.toolLowLevelDefinitions;

  ngOnInit(): void {   
    this.route.params.subscribe(params => {
      this.toolMeasurementLevelDefinitionId = +params['id'];
      this.setToolLowLevelDefinitions();
    });
    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.setToolLowLevelDefinitions();
    });
    this.setToolLowLevelDefinitions();
  }

  setToolLowLevelDefinitions(){
    if(this.toolMeasurementLevelDefinitionId && this.toolsDefinitionService.toolLowLevelDefinitions){
      this.toolLowLevelDefinitions = this.toolsDefinitionService.toolLowLevelDefinitions
        .filter(x => x.ToolMeasurementLevelDefinitionID == this.toolMeasurementLevelDefinitionId)
    } else {
      this.toolLowLevelDefinitions = this.toolsDefinitionService.toolLowLevelDefinitions;
    }
  }

  changeToolId(toolId: number): void {
    this.toolId = toolId;
  }
}
