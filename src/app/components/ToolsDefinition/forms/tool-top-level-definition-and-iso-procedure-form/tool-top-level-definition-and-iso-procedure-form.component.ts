import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { Resolution } from 'src/app/models/TestDefinition/resolution';
import { IsoProcedure } from 'src/app/models/toolDefinitionModels/iso-procedure';
import { SubTechnology } from 'src/app/models/toolDefinitionModels/sub-technology';
import { ToolTopLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-top-level-definition';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/dashboard/confirm-dialog/confirm-dialog.component';

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
    private dialog: MatDialog,
    private toastService: ToastService
  ) { }
    
  ngOnInit(): void {
    this.toolTopLevelDefinitionAndIsoForm = this.formBuilder.group({
      toolTopLevelDefinitionID: [0],
      ToolTopLevelDefinitionName: ["", [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z\u0590-\u05FF\u200f\u200e ]*$')]],
      TechID:[0],
      SubTechID: [0, [Validators.required]],
      IsoProcedureID: [0],
      MCode: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
      WordFileLink: [" "],
      CertificateText: [" "],
      Description: [" "],
    });

    this.toolTopLevelDefinitionAndIsoForm.setValue({
      toolTopLevelDefinitionID: 0,
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

    this.toolTopLevelDefinitionAndIsoForm.controls.MCode.valueChanges.subscribe((value: number) => {
      this.toolTopLevelDefinitionAndIsoForm.controls.CertificateText.setValue("מבוסס על נוהל כיול " + value);
    });

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies; 
      this.allResolutionsPreviousValues = this.toolsDefinitionService.getUniqueAndSortedResolutions();
      console.log(this.allResolutionsPreviousValues);
      
    });
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.allResolutionsPreviousValues = this.toolsDefinitionService.getUniqueAndSortedResolutions();
  }

  ngOnChanges(): void {
    console.log(this.toolId);
    if(this.toolId){
      const tool = this.toolsDefinitionService.toolTopLevelDefinitions.find(tool => tool.ToolTopLevelDefinitionID == this.toolId);
      console.log(tool);

      this.toolTopLevelDefinitionAndIsoForm.setValue({
        toolTopLevelDefinitionID: tool.ToolTopLevelDefinitionID,
        ToolTopLevelDefinitionName: tool.ToolTopLevelDefinitionName,
        TechID: tool.SubTechnology?.TechID,
        SubTechID: tool.SubTechID,
        IsoProcedureID: tool.IsoProcedure?.IsoProcedureID || 0,
        MCode: tool.IsoProcedure?.MCode || null,
        WordFileLink: tool.IsoProcedure?.WordFileLink,
        CertificateText: tool.IsoProcedure?.CertificateText,
        Description: tool.IsoProcedure?.Description,
      });

      this.resolutions = tool.Resolutions.map(resolution => resolution.Value);
    }
  }

  public toolTopLevelDefinitionAndIsoForm: any;

  async submitForm(){
    const newIsoProcedure = new IsoProcedure(
      +this.toolTopLevelDefinitionAndIsoForm.value.MCode,
      this.toolTopLevelDefinitionAndIsoForm.value.WordFileLink || " ",
      this.toolTopLevelDefinitionAndIsoForm.value.CertificateText || " " ,
      this.toolTopLevelDefinitionAndIsoForm.value.Description || " ",
      +this.toolTopLevelDefinitionAndIsoForm.value.toolTopLevelDefinitionID || 0,
      +this.toolTopLevelDefinitionAndIsoForm.value.IsoProcedureID || 0
    )
    
    const newToolTopLevelDefinition = new ToolTopLevelDefinition(
      this.toolTopLevelDefinitionAndIsoForm.value.ToolTopLevelDefinitionName, 
      +this.toolTopLevelDefinitionAndIsoForm.value.SubTechID, 
      this.toolId || 0
    );

    let SValues:string;
    if(this.resolutions.length > 0){
      SValues = this.resolutions.join('|');
    } else {
      SValues = "1";
    }

    try {
      await this.toolsDefinitionService.uploadToolTopDefinition(SValues, newToolTopLevelDefinition, newIsoProcedure);
      this.toastService.success('העדכון התבצע בהצלחה');
    } catch (error) {
      this.toastService.error('העדכון נכשל');
    }

    // this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.resetForm();
    this.toolId = null;
  }

  resetForm() {
    this.formDirective.resetForm();
    this.toolTopLevelDefinitionAndIsoForm.reset();
    this.resolutions = [];
  }

  async deleteToolTopLevelDefinitionAndIsoProcedure(): Promise<void> {
    const tool = this.toolsDefinitionService.toolMeasurementLevelDefinition.find(tool => tool.ToolTopLevelDefinitionID === this.toolId);
    if(tool){
      this.toastService.error(" אי אפשר למחוק את הכלי הזה כי הוא בשימוש ");
      return;
    }

    const dialogData = {
      title: "מחיקת כלי",
      message: "האם אתה בטוח שאתה רוצה למחוק את הכלי?"
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        try {
          const isoId = this.toolsDefinitionService.toolTopLevelDefinitions.find(tool => tool.ToolTopLevelDefinitionID === this.toolId).IsoProcedure?.IsoProcedureID;
          await this.toolsDefinitionService.deleteToolDefinition("ToolTopLevelDefinition", this.toolId);
          await this.toolsDefinitionService.deleteToolDefinition("IsoProcedure", isoId);
          this.toolsDefinitionService.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions.filter(toolTopLevelDefinition => toolTopLevelDefinition.ToolTopLevelDefinitionID !== this.toolId);
          this.toolsDefinitionService.dataSubject.next(true);
          this.resetForm();
          this.toolId = null;
          this.toastService.success(" כלי נמחק בהצלחה :)");
        } catch (error: any) {
          console.error(error);
        }
      }
    });
  }

// resolutionSelectForm using MatChipsModule-------------------------------------------------------
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('resolutionsInput') resolutionsInput: ElementRef<HTMLInputElement>;
  resolutionsControl = new FormControl(0, [Validators.pattern('^[0-9]{0,2}(.[0-9]{0,8})?$')]);


  resolutions: number[] = [];
  allResolutionsPreviousValues: number[] = [];

  addResolutionsFromInput(event: MatChipInputEvent): void {
    const value = +(event.value || '').trim();
    if(!value){
      this.toastService.error('רק ערכים מספריים יכולים להיכנס לרשימה');
    } else {
      this.resolutions.push(value);
    }

    event.chipInput!.clear();
    this.resolutionsControl.setValue(null);
  }

  removeResolutionFromSelection(index: number): void {
    // const index = this.resolutions.indexOf(resolution);

    if (index >= 0) {
      this.resolutions.splice(index, 1);
    }
  }

  selectedResolution(event: MatAutocompleteSelectedEvent){
    this.resolutions.push(+event.option.value);
    this.resolutionsInput.nativeElement.value = '';
    this.resolutionsControl.setValue(null);
  }
}
