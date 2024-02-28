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


}
