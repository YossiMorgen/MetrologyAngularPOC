import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ToolTopLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-top-level-definition';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-tool-top-level-definition',
  templateUrl: './tool-top-level-definition.component.html',
  styleUrls: ['./tool-top-level-definition.component.css']
})
export class ToolTopLevelDefinitionComponent implements OnInit {
  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) { }


  public toolId: number = null;
  public subTechId: number = null;
  public toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions;

  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe((data) => {
      this.setToolTopLevelDefinitions();
    });

    this.route.params.subscribe(params => {
      this.subTechId = +params['id'];
      console.log(this.subTechId);
      
      this.setToolTopLevelDefinitions();
    });

    this.setToolTopLevelDefinitions();
  }

  setToolTopLevelDefinitions(){    
    if(this.subTechId && this.toolsDefinitionService.toolTopLevelDefinitions){
      this.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions
        .filter(x => x.SubTechID == this.subTechId)
        .sort((a, b) => a.IsoProcedure.MCode - b.IsoProcedure.MCode);
    } else {
      this.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions;
    }
  }

  changeToolId(toolId: number): void {
    this.toolId = toolId;
  }

  testDefinitionGroupsToolTipStr(tool: ToolTopLevelDefinition): string{
    return tool.TestDefinitionGroups.map((testTemplates => testTemplates.TestDefinitionGroupName)).join(", ");    
  }

}
