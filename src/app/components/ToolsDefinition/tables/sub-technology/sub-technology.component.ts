import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) { }

  public toolId: number = null;
  public techID: number = null;
  public subTechnologies: SubTechnology[] = this.toolsDefinitionService.subTechnologies;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.techID = +params['id'];
      this.setSubTechnologies();
    });

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.setSubTechnologies();
    }); 
    this.setSubTechnologies();
  }

  setSubTechnologies(): void {
    if(this.techID ){
      this.subTechnologies = this.toolsDefinitionService.subTechnologies.filter(x => x.TechID == this.techID);
    } else {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    }
  }

  changeToolId(toolId: number): void {
    this.toolId = toolId;
  }


}
