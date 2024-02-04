import { Component, OnInit } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { SubTechnology } from 'src/app/models/toolDefinitionModels/sub-technology';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-sub-technology',
  templateUrl: './sub-technology.component.html',
  styleUrls: ['./sub-technology.component.css']
})
export class SubTechnologyComponent implements OnInit {

  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private toastService: ToastService
  ) { }

  public subTechnologies: SubTechnology[] = this.toolsDefinitionService.subTechnologies;

  public toolId: number = null;

  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies;      
    }); 
  }

  changeToolId(toolId: number): void {
    this.toolId = toolId;
  }

  async deleteSubTechnology(toolId: number): Promise<void> {
    const tool = this.toolsDefinitionService.toolTopLevelDefinitions.find(tool => tool.SubTechID === toolId);
    if(tool){
      this.toastService.error(" אי אפשר למחוק את התת טכנולוגיה הזאת כי היא בשימוש ");
      return;
    }
    try {
      await this.toolsDefinitionService.deleteToolDefinition("SubTechnology", toolId);
      this.toolsDefinitionService.subTechnologies = this.toolsDefinitionService.subTechnologies.filter(subTechnology => subTechnology.SubTechnologyID !== toolId);
      this.toolsDefinitionService.dataSubject.next(true);
      this.toastService.success('הטכנולוגיה נמחקה בהצלחה');
    } catch (error: any) {
      this.toastService.error(error);
    }
  }
}
