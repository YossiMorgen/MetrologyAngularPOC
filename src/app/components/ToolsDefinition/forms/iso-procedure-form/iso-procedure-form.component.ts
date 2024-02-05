import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { IsoProcedure } from 'src/app/models/toolDefinitionModels/iso-procedure';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-iso-procedure-form',
  templateUrl: './iso-procedure-form.component.html',
  styleUrls: ['./iso-procedure-form.component.css']
})
export class IsoProcedureFormComponent implements OnChanges, OnInit {
  @Input() public toolId: number = null;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.isoProcedureForm.controls.MCode.setValue(null);
  }

  ngOnChanges(): void {
    console.log(this.toolId);
    console.log(this.toolsDefinitionService.isoProcedure);
    
    this.toolsDefinitionService.isoProcedure.forEach(isoProcedure => {console.log(isoProcedure.IsoProcedureID)})
    
    if(this.toolId){
      const tool = this.toolsDefinitionService.isoProcedure.find(tool => tool.IsoProcedureID === this.toolId);
      console.log(tool);
      
      this.isoProcedureForm.setValue({
        MCode: tool.MCode,
        WordFileLink: "link",
        CertificateText: tool.CertificateText,
        Description: tool.Description,
      });
    }
  }

  public isoProcedureForm = this.formBuilder.group({
    MCode: [0, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
    WordFileLink: [" "],
    CertificateText: [" "],
    Description: [" "],
  });

  async submitForm() {
    try {
      const newIsoProcedure = new IsoProcedure(
        +this.isoProcedureForm.value.MCode,
        this.isoProcedureForm.value.WordFileLink || " ",
        this.isoProcedureForm.value.CertificateText || " " ,
        this.isoProcedureForm.value.Description || " ",
      );
      if(this.toolId){
        await this.toolsDefinitionService.updateToolDefinition(newIsoProcedure, this.toolId);
        this.toolsDefinitionService.isoProcedure = this.toolsDefinitionService.isoProcedure.map(isoProcedure => isoProcedure.IsoProcedureID === this.toolId ? newIsoProcedure : isoProcedure);
        this.toastService.success('הנוהל עודכן בהצלחה');
      } else{
        const id = await this.toolsDefinitionService.createToolDefinition(newIsoProcedure);
        newIsoProcedure.IsoProcedureID = id;
        this.toolsDefinitionService.isoProcedure.push(newIsoProcedure);
        this.toastService.success('הנוהל נוצר בהצלחה');
      }
      
      this.toolsDefinitionService.dataSubject.next(true);
      this.formDirective.resetForm();
      this.toolId = null;
    } catch (error: any) {
      this.toastService.error(error);
    }
  }
}
