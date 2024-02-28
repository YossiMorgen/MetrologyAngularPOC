import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'angular-toastify';
import { ConfirmDialogComponent } from 'src/app/components/dashboard/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from 'src/app/models/confirm-dialog';
import { Technology } from 'src/app/models/toolDefinitionModels/technology';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-technology-form',
  templateUrl: './technology-form.component.html',
  styleUrls: ['./technology-form.component.css']
})
export class TechnologyFormComponent implements OnChanges, OnInit {
  @Input() public toolId: number = null;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private toastService: ToastService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.technologyForm.controls.MCode.setValue(null);
  }

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
    TechnologyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z\u0590-\u05FF\u200f\u200e ]*$')]],
    MCode: [0, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]]
  });

  async submitForm() {
    try {
      const newTechnology = new Technology(this.technologyForm.value.TechnologyName, +this.technologyForm.value.MCode);
      if(this.toolId){
        await this.toolsDefinitionService.updateToolDefinition(newTechnology, this.toolId);
        this.toastService.success('הטכנולוגיה עודכנה בהצלחה');
      } else{
        const id = await this.toolsDefinitionService.createToolDefinition(newTechnology);
        this.toastService.success('הטכנולוגיה נוצרה בהצלחה');
      }
      
      this.resetForm();
      this.toolId = null;
    } catch (error: any) {
      this.toastService.error(error);
    }
  }

  resetForm() {
    this.formDirective.resetForm();
    this.technologyForm.reset();
  }

  async deleteTechnology(): Promise<void> {
    const subTech = this.toolsDefinitionService.subTechnologies.find(subTech => subTech.TechID === this.toolId);
    if(subTech){
      this.toastService.error("אי אפשר למחוק את הטכנולוגיה הזאת כי יש לה תתי טכנולוגיות");
      return;
    }

    const dialogData = new ConfirmDialogModel("מחיקת טכנולוגיה", "האם אתה בטוח שאתה רוצה למחוק את הטכנולוגיה?");

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        try {
          await this.toolsDefinitionService.deleteToolDefinition("Technology", this.toolId);
          this.toolsDefinitionService.technologies = this.toolsDefinitionService.technologies.filter(technology => technology.TechnologyID !== this.toolId);
          this.toolsDefinitionService.dataSubject.next(true);
          this.toolId = null;
          this.resetForm();
          this.toastService.success('הטכנולוגיה נמחקה בהצלחה');        
        } catch (error: any) {
          this.toastService.error(error);
        }
      }
    });
  }
}
