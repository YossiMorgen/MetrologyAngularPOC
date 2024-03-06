import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ToolTopLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-top-level-definition';
import { ToolDefinitionURLs } from 'src/app/services/app-config.service';
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
  public toolTopId: number = null;
  public toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions;

  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe((data) => {
      this.setToolTopLevelDefinitions();
    });

    this.route.params.subscribe(params => {
      this.toolTopId = +params['id'];
      this.setToolTopLevelDefinitions();
    });

    this.setToolTopLevelDefinitions();
  }

  setToolTopLevelDefinitions(){    
    if(this.toolTopId && this.toolsDefinitionService.toolTopLevelDefinitions){
      this.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions
        .filter(x => x.ToolTopLevelDefinitionID == this.toolTopId)
        .sort((a, b) => a.IsoProcedure.MCode - b.IsoProcedure.MCode);
    } else {
      this.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions;
    }
  }

  changeToolId(toolId: number): void {
    this.toolId = toolId;
  }

  // async deleteToolTopLevelDefinition(toolId: number): Promise<void> {
  //   const tool = this.toolsDefinitionService.toolMeasurementLevelDefinition.find(tool => tool.ToolTopLevelDefinitionID === toolId);
  //   if(tool){
  //     this.toastService.error(" אי אפשר למחוק את הכלי הזה כי הוא בשימוש ");
  //     return;
  //   }
  //   try {
  //     await this.toolsDefinitionService.deleteToolDefinition("ToolTopLevelDefinition", toolId);
      
  //     this.toolsDefinitionService.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions.filter(toolTopLevelDefinition => toolTopLevelDefinition.ToolTopLevelDefinitionID !== toolId);
  //     this.toolsDefinitionService.dataSubject.next(true);
  //     this.toastService.success(" כלי נמחק בהצלחה :)");
  //   } catch (error: any) {
  //     console.error(error);
  //   }
  // }
  
  resolutionToolTipStr(tool: ToolTopLevelDefinition){
    return tool.Resolutions.map((resolutions => resolutions.Value)).join(", ");
  }

}
