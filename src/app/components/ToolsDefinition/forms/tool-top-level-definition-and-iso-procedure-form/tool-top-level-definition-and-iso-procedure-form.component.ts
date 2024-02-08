import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { IsoProcedure } from 'src/app/models/toolDefinitionModels/iso-procedure';
import { SubTechnology } from 'src/app/models/toolDefinitionModels/sub-technology';
import { ToolTopLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-top-level-definition';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-tool-top-level-definition-and-iso-procedure-form',
  templateUrl: './tool-top-level-definition-and-iso-procedure-form.component.html',
  styleUrls: ['./tool-top-level-definition-and-iso-procedure-form.component.css']
})
export class ToolTopLevelDefinitionAndIsoProcedureFormComponent implements OnChanges, OnInit {
  @Input() public toolId: number = null;
  subTechnologies: SubTechnology[];
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private toastService: ToastService
  ) { }
    
  ngOnInit(): void {
    this.toolTopLevelDefinitionAndIsoForm = this.formBuilder.group({
      ToolTopLevelDefinitionName: ["", [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z\u0590-\u05FF\u200f\u200e ]*$')]],
      TechID:[0],
      SubTechID: [0],
      IsoProcedureID: [0],
      MCode: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
      WordFileLink: [" "],
      CertificateText: [" "],
      Description: [" "],
    });

    this.toolTopLevelDefinitionAndIsoForm.setValue({
      ToolTopLevelDefinitionName: "",
      TechID: 0,
      SubTechID: 0,
      IsoProcedureID: 0,
      MCode: null,
      WordFileLink: " ",
      CertificateText: " ",
      Description: " ",
    })
    

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    });

    this.toolTopLevelDefinitionAndIsoForm.controls.TechID.valueChanges.subscribe((value: number) => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies?.filter(subTech => subTech.TechID === +value);
      
      if(this.subTechnologies.length === 0 && value){
        this.toastService.error('לא קיימות תת טכנולוגיות תחת טכנולוגיה זו');
      }
    });

    this.toolTopLevelDefinitionAndIsoForm.controls.SubTechID.valueChanges.subscribe((value: number) => {
      this.toolTopLevelDefinitionAndIsoForm.controls.TechID.setValue(
        this.toolsDefinitionService.subTechnologies?.find(subTech => subTech.SubTechnologyID === +value)?.TechID
      );
    });
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;  
  }

  ngOnChanges(): void {
    console.log(this.toolId);
    if(this.toolId){
      const tool = this.toolsDefinitionService.toolTopLevelDefinitions.find(tool => tool.ToolTopLevelDefinitionID == this.toolId);
      console.log(tool);
      
      this.toolTopLevelDefinitionAndIsoForm.setValue({
        ToolTopLevelDefinitionName: tool.ToolTopLevelDefinitionName,
        TechID: tool.SubTechnology?.TechID,
        SubTechID: tool.SubTechID,
        IsoProcedureID: tool.IsoProcedureID,
        MCode: tool.IsoProcedure?.MCode || null,
        WordFileLink: tool.IsoProcedure?.WordFileLink,
        CertificateText: tool.IsoProcedure?.CertificateText,
        Description: tool.IsoProcedure?.Description,
      });
    }
  }

  public toolTopLevelDefinitionAndIsoForm: any;

  async submitForm(){
    const newIsoProcedure = new IsoProcedure(
      +this.toolTopLevelDefinitionAndIsoForm.value.MCode,
      this.toolTopLevelDefinitionAndIsoForm.value.WordFileLink || " ",
      this.toolTopLevelDefinitionAndIsoForm.value.CertificateText || " " ,
      this.toolTopLevelDefinitionAndIsoForm.value.Description || " ",
      this.toolTopLevelDefinitionAndIsoForm.value.IsoProcedureID || 0
    )
    
    const newToolTopLevelDefinition = new ToolTopLevelDefinition(
      this.toolTopLevelDefinitionAndIsoForm.value.ToolTopLevelDefinitionName, 
      +this.toolTopLevelDefinitionAndIsoForm.value.SubTechID, 
      +this.toolTopLevelDefinitionAndIsoForm.value.IsoProcedureID, 
      this.toolId || 0
    );

    console.log(newIsoProcedure);
    console.log(newToolTopLevelDefinition);
    
    
    if(this.toolId){
      try {
        await this.toolsDefinitionService.updateToolDefinition(newIsoProcedure, this.toolId);
        await this.toolsDefinitionService.updateToolDefinition(newToolTopLevelDefinition, this.toolId);
      
        newToolTopLevelDefinition.IsoProcedure = newIsoProcedure;
        newToolTopLevelDefinition.SubTechnology = this.subTechnologies.find(subTech => subTech.SubTechnologyID === newToolTopLevelDefinition.SubTechID);
        
        this.toolsDefinitionService.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions.map(tool => tool.ToolTopLevelDefinitionID === this.toolId ? newToolTopLevelDefinition : tool);
        this.toolsDefinitionService.isoProcedure = this.toolsDefinitionService.isoProcedure.map(isoProcedure => isoProcedure.IsoProcedureID === this.toolId ? newIsoProcedure : isoProcedure);
        this.toastService.success('הכלי עודכן בהצלחה');
      } catch (error: any) {
        this.toastService.error(error);
      }
    } else{
      try {
        const id = await this.toolsDefinitionService.createToolDefinition(newIsoProcedure);
        console.log(id);
        
        newToolTopLevelDefinition.IsoProcedureID = id;
        const toolId = await this.toolsDefinitionService.createToolDefinition(newToolTopLevelDefinition);
        newToolTopLevelDefinition.ToolTopLevelDefinitionID = toolId;
        newToolTopLevelDefinition.IsoProcedure = newIsoProcedure;
        newToolTopLevelDefinition.SubTechnology = this.subTechnologies.find(subTech => subTech.SubTechnologyID === newToolTopLevelDefinition.SubTechID);

        this.toolsDefinitionService.toolTopLevelDefinitions.push(newToolTopLevelDefinition);
        this.toolsDefinitionService.isoProcedure.push(newIsoProcedure);
        console.log(this.toolsDefinitionService.isoProcedure);
        console.log(this.toolsDefinitionService.toolTopLevelDefinitions);
        
        
        this.toastService.success('הכלי נוצר בהצלחה');
      } catch (error: any) {
        this.toastService.error(error);
      }
    }
    
    this.toolsDefinitionService.dataSubject.next(true);
    this.formDirective.resetForm();
    this.toolId = null;
  }
}
