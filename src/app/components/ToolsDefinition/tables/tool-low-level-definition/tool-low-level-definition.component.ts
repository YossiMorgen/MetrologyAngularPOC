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
    this.toolsDefinitionService.dataSubject.subscribe(() => {
        this.toolLowLevelDefinitions = this.toolsDefinitionService.toolLowLevelDefinition;
    });
  }

  changeToolId(toolId: number): void {
    this.toolId = toolId;
  }

}
