import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { SubTechnology } from 'src/app/models/toolDefinitionModels/sub-technology';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-sub-technology-form',
  templateUrl: './sub-technology-form.component.html',
  styleUrls: ['./sub-technology-form.component.css']
})
export class SubTechnologyFormComponent implements OnChanges, OnInit {
  @Input() public toolId: number = null;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
      this.subTechnologyForm.controls.TechID.setValue(null);
      this.subTechnologyForm.controls.MCode.setValue(null);
  }

  ngOnChanges(): void {
    console.log(this.toolId);
    
    if(this.toolId){
      const tool = this.toolsDefinitionService.subTechnologies.find(tool => tool.SubTechnologyID === this.toolId);
      this.subTechnologyForm.setValue({
        TechID: tool.TechID,
        SubTechnologyName: tool.SubTechnologyName,
        MCode: tool.MCode
      });
    }
  }

  public subTechnologyForm = this.formBuilder.group({
    TechID: [0, [Validators.required]],
    SubTechnologyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z\u0590-\u05FF\u200f\u200e ]*$')]],
    MCode: [0, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]]
  });
  
  async submitForm(){
    try {

      const newSubTechnology = new SubTechnology(this.subTechnologyForm.value.SubTechnologyName, +this.subTechnologyForm.value.MCode, +this.subTechnologyForm.value.TechID);
      if(this.toolId){
        await this.toolsDefinitionService.updateToolDefinition(newSubTechnology, this.toolId);
        this.toolsDefinitionService.subTechnologies = this.toolsDefinitionService.subTechnologies.map(tool => tool.SubTechnologyID === this.toolId ? newSubTechnology : tool);
        this.toastService.success('הטכנולוגיה עודכנה בהצלחה');
      } else{
        const id = await this.toolsDefinitionService.createToolDefinition(newSubTechnology);
        newSubTechnology.SubTechnologyID = id;
        this.toolsDefinitionService.subTechnologies.push(newSubTechnology);
        this.toastService.success('הטכנולוגיה נוצרה בהצלחה');
      }
      
      newSubTechnology.Technology = this.toolsDefinitionService.technologies.find(tech => tech.TechnologyID === newSubTechnology.TechID);
      this.toolsDefinitionService.dataSubject.next(true);
      this.formDirective.resetForm();
      this.toolId = null;
    } catch (error: any) {
      this.toastService.error(error);
    }
  }
}
