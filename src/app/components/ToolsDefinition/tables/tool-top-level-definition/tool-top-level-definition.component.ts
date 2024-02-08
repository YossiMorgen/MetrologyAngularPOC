import { Component, OnInit } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-tool-top-level-definition',
  templateUrl: './tool-top-level-definition.component.html',
  styleUrls: ['./tool-top-level-definition.component.css']
})
export class ToolTopLevelDefinitionComponent implements OnInit {
  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private toastService: ToastService
  ) { }

  public toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions;

  public toolId: number = null;

  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe((data) => {
      this.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions;
    });
  }

  changeToolId(toolId: number): void {
    this.toolId = toolId;
  }

  async deleteToolTopLevelDefinition(toolId: number, procedureId: number): Promise<void> {
    const tool = this.toolsDefinitionService.toolMeasurementLevelDefinition.find(tool => tool.ToolTopLevelDefinitionID === toolId);
    if(tool){
      this.toastService.error(" אי אפשר למחוק את הכלי הזה כי הוא בשימוש ");
      return;
    }
    try {
      await this.toolsDefinitionService.deleteToolDefinition("ToolTopLevelDefinition", toolId);
      await this.toolsDefinitionService.deleteToolDefinition("IsoProcedure", procedureId);
      
      this.toolsDefinitionService.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions.filter(toolTopLevelDefinition => toolTopLevelDefinition.ToolTopLevelDefinitionID !== toolId);
      this.toolsDefinitionService.dataSubject.next(true);
      this.toastService.success(" כלי נמחק בהצלחה :)");
    } catch (error: any) {
      console.error(error);
    }
  }
  

}
