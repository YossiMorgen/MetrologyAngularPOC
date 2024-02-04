import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { Technology } from 'src/app/models/toolDefinitionModels/technology';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-technology-form',
  templateUrl: './technology-form.component.html',
  styleUrls: ['./technology-form.component.css']
})
export class TechnologyFormComponent implements OnChanges {
  @Input() public toolId: number = null;

  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private toastService: ToastService
  ) { }

  ngOnChanges(): void {
    console.log(this.toolId);
    
    if(this.toolId){
      const tool = this.toolsDefinitionService.technologies.find(tool => tool.TechnologyID === this.toolId);
      this.technologyForm.setValue({
        TechnologyName: tool.TechnologyName,
        MCode: tool.MCode
      });
    }
  }

  public technologyForm = this.formBuilder.group({
    TechnologyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z\u0590-\u05FF\u200f\u200e]*$')]],
    MCode: [0, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]]
  });

  async submitForm() {
    try {
      const newTechnology = new Technology(this.technologyForm.value.TechnologyName, +this.technologyForm.value.MCode);
      if(this.toolId){
        await this.toolsDefinitionService.updateToolDefinition(newTechnology, this.toolId);
        this.toolsDefinitionService.technologies = this.toolsDefinitionService.technologies.map(technology => technology.TechnologyID === this.toolId ? newTechnology : technology);
        this.toastService.success('הטכנולוגיה עודכנה בהצלחה');
      } else{
        const id = await this.toolsDefinitionService.createToolDefinition(newTechnology);
        newTechnology.TechnologyID = id;
        this.toolsDefinitionService.technologies.push(newTechnology);
        this.toastService.success('הטכנולוגיה נוצרה בהצלחה');
      }
      
      this.toolsDefinitionService.dataSubject.next(true);
      this.technologyForm.reset();
      this.toolId = null;
    } catch (error: any) {
      this.toastService.error(error);
    }
  }
}
