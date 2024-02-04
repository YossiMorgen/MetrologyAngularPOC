import { Component, OnInit } from '@angular/core';
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
    private toastService: ToastService
  ) { }
  public toolLowLevelDefinitions = this.toolsDefinitionService.toolLowLevelDefinition;

  public toolId: number = null;

  ngOnInit(): void {
    console.log(this.toolsDefinitionService.toolLowLevelDefinition);
    
    this.toolsDefinitionService.dataSubject.subscribe(() => {
        this.toolLowLevelDefinitions = this.toolsDefinitionService.toolLowLevelDefinition;
    });
  }

  changeToolId(toolId: number): void {
    this.toolId = toolId;
  }

  async deleteToolLowLevelDefinition(toolId: number): Promise<void> {

    try {
      await this.toolsDefinitionService.deleteToolDefinition("ToolLowLevelDefinition", toolId);
      this.toolsDefinitionService.toolLowLevelDefinition = this.toolsDefinitionService.toolLowLevelDefinition.filter(toolLowLevelDefinition => toolLowLevelDefinition.ToolLowLevelDefinitionID !== toolId);
      this.toolsDefinitionService.dataSubject.next(true);
    } catch (error: any) {
      this.toastService.error(error);
    }
  }
}
