import { Component, OnInit } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-tool-measurement-level-definition',
  templateUrl: './tool-measurement-level-definition.component.html',
  styleUrls: ['./tool-measurement-level-definition.component.css']
})
export class ToolMeasurementLevelDefinitionComponent implements OnInit {

  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private toastService: ToastService
  ) { }
  public toolMeasurementLevelDefinition = this.toolsDefinitionService.toolMeasurementLevelDefinition;

  public toolId: number = null;

  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe((data) => {
      this.toolMeasurementLevelDefinition = this.toolsDefinitionService.toolMeasurementLevelDefinition;
    });
  }

  changeToolId(toolId: number): void {
    this.toolId = toolId;
  }

  // async deleteToolMeasurementLevelDefinition(toolId: number): Promise<void> {
  //   const tool = this.toolsDefinitionService.toolLowLevelDefinition.find(tool => tool.ToolMeasurementLevelDefinitionID === toolId);
  //   if(tool){
  //     this.toastService.error(" אי אפשר למחוק את הכלי הזה כי הוא בשימוש ");
  //     return;
  //   }
  //   try {
  //     await this.toolsDefinitionService.deleteToolDefinition("ToolMeasurementLevelDefinition", toolId);
  //     this.toolsDefinitionService.toolMeasurementLevelDefinition = this.toolsDefinitionService.toolMeasurementLevelDefinition.filter(toolMeasurementLevelDefinition => toolMeasurementLevelDefinition.ToolMeasurementLevelDefinitionID !== toolId);
  //     this.toolsDefinitionService.dataSubject.next(true);
  //   } catch (error: any) {
  //     this.toastService.error(error);
  //   }
  // }
}
