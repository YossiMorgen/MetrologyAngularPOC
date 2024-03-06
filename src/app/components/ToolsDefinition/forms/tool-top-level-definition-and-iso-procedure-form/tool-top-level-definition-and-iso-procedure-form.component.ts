import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { ToolFamilyLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-family-level-definition';

@Component({
  selector: 'app-tool-top-level-definition-and-iso-procedure-form',
  templateUrl: './tool-top-level-definition-and-iso-procedure-form.component.html',
  styleUrls: ['./tool-top-level-definition-and-iso-procedure-form.component.css']
})
export class ToolTopLevelDefinitionAndIsoProcedureFormComponent implements OnChanges, OnInit {
  @Input() public toolId: number = null;
  @Input() public toolTopId: number = null;

  subTechnologies: SubTechnology[];
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  filteredToolTops: ToolTopLevelDefinition[] = [];

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private dialog: MatDialog,
    private toastService: ToastService
  ) { }
    
  ngOnInit(): void {

    this.resetForm();

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies;
      this.filteredToolTops = this.toolsDefinitionService.toolTopLevelDefinitions;
      this.setDefaultMCode();
    });
    this.filteredToolTops = this.toolsDefinitionService.toolTopLevelDefinitions;
    this.setDefaultMCode();

    this.toolTopLevelDefinitionAndIsoForm.controls.TechID.valueChanges.subscribe((value: number) => {

      if(!value){
        this.subTechnologies = this.toolsDefinitionService.subTechnologies;
        return;
      }

      this.subTechnologies = this.toolsDefinitionService.subTechnologies?.filter(subTech => subTech.TechID === +value);
      
      if(this.subTechnologies.length === 0){
        this.toastService.error('לא קיימות תת טכנולוגיות תחת טכנולוגיה זו');
      }
    });

    this.toolTopLevelDefinitionAndIsoForm.controls.SubTechID.valueChanges.subscribe((value: number) => {
      this.toolTopLevelDefinitionAndIsoForm.controls.TechID.setValue(
        this.toolsDefinitionService.subTechnologies?.find(subTech => subTech.SubTechnologyID === +value)?.TechID
      );

      this.filteredToolTops = this.toolsDefinitionService.toolTopLevelDefinitions?.filter(toolTop => toolTop.SubTechID === +value);
      this.setDefaultMCode();
    });

    this.toolTopLevelDefinitionAndIsoForm.controls.MCode.valueChanges.subscribe((value: number) => {
      this.toolTopLevelDefinitionAndIsoForm.controls.CertificateText.setValue("מבוסס על נוהל כיול " + value);
    });

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.subTechnologies = this.toolsDefinitionService.subTechnologies; 
      this.allResolutionsPreviousValues = this.toolsDefinitionService.getUniqueAndSortedResolutions();      
      this.toolTopLevelDefinitionAndIsoForm.controls.SubTechID.setValue(this.toolTopId);
    });
    this.toolTopLevelDefinitionAndIsoForm.controls.SubTechID.setValue(this.toolTopId);
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.allResolutionsPreviousValues = this.toolsDefinitionService.getUniqueAndSortedResolutions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.toolId);
    if(this.toolId && changes['toolId'] ){
      const tool = this.toolsDefinitionService.toolTopLevelDefinitions.find(tool => tool.ToolTopLevelDefinitionID == this.toolId);

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

  toolTopLevelDefinitionAndIsoForm = this.formBuilder.group({
    toolTopLevelDefinitionID: [0],
    ToolTopLevelDefinitionName: ["", [Validators.required, Validators.minLength(2), Validators.pattern('^[0-90-9a-zA-Z\u0590-\u05FF\u200f\u200e ]*$')]],
    TechID:[0],
    SubTechID: [0, [Validators.required]],
    IsoProcedureID: [0],
    MCode: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    WordFileLink: [" "],
    CertificateText: [" "],
    Description: [" "],
  });

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
      const id = await this.toolsDefinitionService.uploadToolTopDefinition(SValues, newToolTopLevelDefinition, newIsoProcedure);
      if(!this.toolId){
        const family = new ToolFamilyLevelDefinition(newToolTopLevelDefinition.ToolTopLevelDefinitionName, id);
        await this.toolsDefinitionService.createToolDefinition(family);
      } else {
        await this.toolsDefinitionService.getToolsDefinitionData();
      }
      this.toastService.success('העדכון התבצע בהצלחה');
      this.resetForm();
      this.setDefaultMCode();
    } catch (error) {
      this.toastService.error('העדכון נכשל');
    }

    // this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    // this.resetForm();
    this.toolId = null;
  }

  resetForm() {
    this.toolTopLevelDefinitionAndIsoForm.controls.ToolTopLevelDefinitionName.setValue(null);
    this.toolTopLevelDefinitionAndIsoForm.controls.ToolTopLevelDefinitionName.setErrors(null);
    this.toolTopLevelDefinitionAndIsoForm.controls.Description.setValue(null);
    this.resolutions = [];
  }

  async deleteToolTopLevelDefinitionAndIsoProcedure(): Promise<void> {
    const tool = this.toolsDefinitionService.toolFamilyDefinitions.find(tool => tool.ToolFamilyLevelDefinitionID === this.toolId);
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
          this.toolTopLevelDefinitionAndIsoForm.reset();
          this.formDirective.resetForm();
          this.resolutions = [];
          this.setDefaultMCode();
          this.toolId = null;
          this.toastService.success(" כלי נמחק בהצלחה :)");
        } catch (error: any) {
          console.error(error);
        }
      }
    });
  }

  setDefaultMCode(){    
    const maxMCode = this.filteredToolTops?.reduce((max, toolTop) => { return toolTop.IsoProcedure?.MCode > max ? toolTop.IsoProcedure?.MCode : max }, 0);    
    this.toolTopLevelDefinitionAndIsoForm.controls.MCode.setValue(maxMCode + 1);
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

  // ------------------------------------------------------------------------------------------------

}
