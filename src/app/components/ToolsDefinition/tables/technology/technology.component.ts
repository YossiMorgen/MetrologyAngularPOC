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


}
