import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { IsoProcedure } from 'src/app/models/toolDefinitionModels/iso-procedure';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-iso-procedure-form',
  templateUrl: './iso-procedure-form.component.html',
  styleUrls: ['./iso-procedure-form.component.css']
})
export class IsoProcedureFormComponent implements OnChanges {
  @Input() public toolId: number = null;

  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private toastService: ToastService
  ) { }

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
      });
    }
  }

  public isoProcedureForm = this.formBuilder.group({
    MCode: [0, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
    WordFileLink: ["link"],
    CertificateText: [""]
  });

  async submitForm() {
    try {
      const newIsoProcedure = new IsoProcedure(
        +this.isoProcedureForm.value.MCode,
        this.isoProcedureForm.value.WordFileLink,
        this.isoProcedureForm.value.CertificateText
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
      this.isoProcedureForm.reset();
      this.toolId = null;
    } catch (error: any) {
      this.toastService.error(error);
    }
  }
}
