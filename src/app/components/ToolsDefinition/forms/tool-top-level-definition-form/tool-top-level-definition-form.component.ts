import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { ToolTopLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-top-level-definition';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-tool-top-level-definition-form',
  templateUrl: './tool-top-level-definition-form.component.html',
  styleUrls: ['./tool-top-level-definition-form.component.css']
})
export class ToolTopLevelDefinitionFormComponent implements OnChanges, OnInit {
  @Input() public toolId: number = null;
  subTechnologies = this.toolsDefinitionService.subTechnologies;

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    });

    this.toolTopLevelDefinitionForm.controls.TechID.valueChanges.subscribe((value) => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies.filter(subTech => subTech.TechID === +value);
      if(this.subTechnologies.length === 0 && value !== 0){
        this.toastService.error('לא קיימות תת טכנולוגיות תחת טכנולוגיה זו');
      }
    });
  }

  ngOnChanges(): void {
    console.log(this.toolId);
    if(this.toolId){
      const tool = this.toolsDefinitionService.toolTopLevelDefinitions.find(tool => tool.ToolTopLevelDefinitionID == this.toolId);
      
      this.toolTopLevelDefinitionForm.setValue({
        ToolTopLevelDefinitionName: tool.ToolTopLevelDefinitionName,
        TechID: tool.SubTechnology?.TechID || 0,
        SubTechID: tool.SubTechID,
        IsoProcedureID: tool.IsoProcedureID
      });
    }
  }

  public toolTopLevelDefinitionForm = this.formBuilder.group({
    ToolTopLevelDefinitionName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z\u0590-\u05FF\u200f\u200e]*$')]],
    TechID:[0],
    SubTechID: [0, [Validators.required]],
    IsoProcedureID: [0, [Validators.required]]
  });

  async submitForm(){
    const newTool = new ToolTopLevelDefinition(this.toolTopLevelDefinitionForm.value.ToolTopLevelDefinitionName, +this.toolTopLevelDefinitionForm.value.SubTechID, +this.toolTopLevelDefinitionForm.value.IsoProcedureID);
    if(this.toolId){
      await this.toolsDefinitionService.updateToolDefinition(newTool, this.toolId);
      this.toolsDefinitionService.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions.map(tool => tool.ToolTopLevelDefinitionID === this.toolId ? newTool : tool);
      this.toastService.success('הכלי עודכן בהצלחה');
    } else{
      const id = await this.toolsDefinitionService.createToolDefinition(newTool);
      newTool.ToolTopLevelDefinitionID = id;
      this.toolsDefinitionService.toolTopLevelDefinitions.push(newTool);
      this.toastService.success('הכלי נוצר בהצלחה');
    }

    newTool.SubTechnology = this.toolsDefinitionService.subTechnologies.find(subTech => subTech.SubTechnologyID === newTool.SubTechID);
    newTool.IsoProcedure = this.toolsDefinitionService.isoProcedure.find(iso => iso.IsoProcedureID === newTool.IsoProcedureID);
    this.toolsDefinitionService.dataSubject.next(true);
    this.toolTopLevelDefinitionForm.reset();
    this.toolId = null;
  }

}
