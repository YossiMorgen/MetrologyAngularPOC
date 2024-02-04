import { Component, OnInit } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { Technology } from 'src/app/models/toolDefinitionModels/technology';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.css']
})
export class TechnologyComponent implements OnInit {
  
    constructor(
      private toolsDefinitionService: ToolsDefinitionService,
      private toastService: ToastService
    ) { }

    public technologies: Technology[] = this.toolsDefinitionService.technologies;

    public toolId: number = null;

    ngOnInit(): void {
      this.toolsDefinitionService.dataSubject.subscribe(() => {
        this.technologies = this.toolsDefinitionService.technologies;
      });
    }

    changeToolId(toolId: number): void {
      this.toolId = toolId;
    }

    async deleteTechnology(toolId: number): Promise<void> {
      const subTech = this.toolsDefinitionService.subTechnologies.find(subTech => subTech.TechID === toolId);
      if(subTech){
        this.toastService.error("אי אפשר למחוק את הטכנולוגיה הזאת כי יש לה תתי טכנולוגיות");
        return;
      }
      try {
        await this.toolsDefinitionService.deleteToolDefinition("Technology", toolId);
        this.toolsDefinitionService.technologies = this.toolsDefinitionService.technologies.filter(technology => technology.TechnologyID !== toolId);
        this.toolsDefinitionService.dataSubject.next(true);
        this.toastService.success('הטכנולוגיה נמחקה בהצלחה');        
      } catch (error: any) {
        this.toastService.error(error);
      }
    }
}
