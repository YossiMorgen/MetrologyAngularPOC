import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ToolFamilyLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-family-level-definition';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-tool-family-level-definition-table',
  templateUrl: './tool-family-level-definition-table.component.html',
  styleUrls: ['./tool-family-level-definition-table.component.css']
})
export class ToolFamilyLevelDefinitionTableComponent implements OnInit {

  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) { }

  public toolId: number = null;
  public ToolTopId: number = null;
  public toolFamilyLevelDefinitions: ToolFamilyLevelDefinition[] = this.toolsDefinitionService.toolFamilyDefinitions;


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ToolTopId = +params['id'];
      this.setToolFamilyLevelDefinitions();
    });

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.setToolFamilyLevelDefinitions();
    }); 
    this.setToolFamilyLevelDefinitions();
  }

  setToolFamilyLevelDefinitions(): void {
    if(this.ToolTopId ){
      this.toolFamilyLevelDefinitions = this.toolsDefinitionService.toolFamilyDefinitions.filter(x => x.ToolTopLevelDefinitionID == this.ToolTopId);
    } else {
      this.toolFamilyLevelDefinitions = this.toolsDefinitionService.toolFamilyDefinitions;
    }
  }

  changeToolId(toolId: number): void {
    this.toolId = toolId;
  }
}
