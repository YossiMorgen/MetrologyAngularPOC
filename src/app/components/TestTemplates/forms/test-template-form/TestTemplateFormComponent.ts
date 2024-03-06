import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { TestDefinition } from 'src/app/models/TestDefinition/test-definition';
import { TestDefinitionGroup } from 'src/app/models/TestDefinition/test-definition-group';
import { TestTemplate } from 'src/app/models/TestDefinition/test-template';
import { ToolFamilyLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-family-level-definition';
import { ToolLowLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-low-level-definition';
import { ToolMeasurementLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-measurement-level-definition';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';


@Component({
  selector: 'app-test-template-form',
  templateUrl: './test-template-form.component.html',
  styleUrls: ['./test-template-form.component.css']
})
export class TestTemplateFormComponent implements OnInit, OnChanges {
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ) { }

  @Input() testTemplateInput: TestTemplate = null

  public testDefinitionIDs: number[] = [];
  public testDefinitionGroup: TestDefinitionGroup = null;

  // public testDefinitions: TestDefinition[] = [];
  
  public toolLowLevelDefinitions: ToolLowLevelDefinition[] = [];
  public toolMeasurementLevelDefinitions: ToolMeasurementLevelDefinition[] = [];
  public toolFamilyDefinitions: ToolFamilyLevelDefinition[] = [];


  public testTemplateForm = this.formBuilder.group({
    ToolTopLevelDefinitionID: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    TestDefinitionGroupID: [0, Validators.required],
    toolFamilyDefinitionID: [0],
    ToolMeasurementLevelDefinitionID: [0],
    ToolLowLevelDefinitionID: [0, [Validators.required]],
    TestTemplateName: [' '],
    TestTemplateID: [0],
  });

  ngOnInit(): void {
    this.setDefaultSelectsValues();

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.setDefaultSelectsValues();
    });

    this.testTemplateForm.controls.ToolTopLevelDefinitionID.valueChanges.subscribe((value: number) => {
      if(!value) return;
      this.selectedTestDefinitionGroup = null;
      const toolTop = this.toolsDefinitionService.toolTopLevelDefinitions.find(toolTop => toolTop.ToolTopLevelDefinitionID === value);
      this.updateToolFamilyDefinitions(toolTop.ToolFamilyLevelDefinitions || []);
    });

    this.testTemplateForm.controls.toolFamilyDefinitionID.valueChanges.subscribe((value: number) => {
      if(!value) return;
      
      const family = this.toolFamilyDefinitions.find(family => family.ToolFamilyLevelDefinitionID === value);
      console.log(family);
      
      this.updateToolMeasurementLevelDefinitions(family.ToolMeasurementLevelDefinitions);
      this.testTemplateForm.controls.ToolTopLevelDefinitionID.setValue(family.ToolTopLevelDefinitionID, { emitEvent: false });
    });

    this.testTemplateForm.controls.ToolMeasurementLevelDefinitionID.valueChanges.subscribe((value: number) => {
      if(!value) return;
      const measurement = this.toolMeasurementLevelDefinitions.find(measurement => measurement.ToolMeasurementLevelDefinitionID === value);
      this.updateToolLowLevelDefinitions(measurement.ToolLowLevelDefinitions);
      this.testTemplateForm.controls.toolFamilyDefinitionID.setValue(measurement.ToolFamilyLevelDefinitionID, { emitEvent: false });
      this.testTemplateForm.controls.ToolTopLevelDefinitionID.setValue(measurement.ToolFamilyLevelDefinition?.ToolTopLevelDefinitionID, { emitEvent: false });
    });

    this.testTemplateForm.controls.ToolLowLevelDefinitionID.valueChanges.subscribe((value: number) => {
      if(!value) return;
      const low = this.toolLowLevelDefinitions.find(low => low.ToolLowLevelDefinitionID === value);
      this.testTemplateForm.controls.toolFamilyDefinitionID.setValue(low.ToolMeasurementLevelDefinition?.ToolFamilyLevelDefinitionID, { emitEvent: false });
      this.testTemplateForm.controls.ToolTopLevelDefinitionID.setValue(low.ToolMeasurementLevelDefinition?.ToolFamilyLevelDefinition?.ToolTopLevelDefinitionID, { emitEvent: false });
      this.testTemplateForm.controls.ToolMeasurementLevelDefinitionID.setValue(low.ToolMeasurementLevelDefinitionID, { emitEvent: false })

      console.log(this.selectedTestDefinitionGroup);
      
      if(this.selectedTestDefinitionGroup){
        this.selectTheTestTemplateDefinitions();
      }
    });

    this.testTemplateForm.controls.TestDefinitionGroupID.valueChanges.subscribe((value: number) => {
      console.log(value);
      if(!value) return;
      
      const group = this.toolsDefinitionService.testDefinitionGroups.find(group => group.TestDefinitionGroupID === value);
      group.TestDefinitions = group.TestDefinitions.sort((a, b) => a.ValueRequired - b.ValueRequired);
      this.selectedTestDefinitionGroup = group;
      this.testTemplateForm.controls.ToolTopLevelDefinitionID.setValue(group?.ToolTopLevelDefinitionID, { emitEvent: false });
      
      if(this.testTemplateForm.controls.ToolLowLevelDefinitionID.value){
        this.selectTheTestTemplateDefinitions();
      }
    });
  }

  selectTheTestTemplateDefinitions(): void {
    console.log("selectTheTestTemplateDefinitions");
    
    const toolLowLevel = this.toolsDefinitionService.toolLowLevelDefinitions.find(toolLowLevel => toolLowLevel.ToolLowLevelDefinitionID === this.testTemplateForm.controls.ToolLowLevelDefinitionID.value);
    if(toolLowLevel){
      console.log("toolLowLevel");
      console.log(toolLowLevel);
      
      
      const testTemplate = toolLowLevel.TestTemplates.find(test => test.TestDefinitions[0]?.TestDefinitionGroupID === this.testTemplateForm.controls.TestDefinitionGroupID.value);
      this.testTemplateForm.controls.TestTemplateID.setValue(testTemplate?.TestTemplateID || 0);
      if(testTemplate){
        console.log("testTemplate");
        
        this.testDefinitionIDs = testTemplate.TestTemplatesDefinitions.map(testTemplateDefinition => testTemplateDefinition.TestDefinitionID);
      }
    }
    console.log(this.testDefinitionIDs);
    
  }

  ngOnChanges(): void {
    console.log("change");
    console.log(this.testTemplateInput);
    
    if(this.testTemplateInput){
      this.testTemplateForm.setValue(
        {
          ToolTopLevelDefinitionID: this.testTemplateInput?.ToolLowLevelDefinition?.ToolMeasurementLevelDefinition?.ToolFamilyLevelDefinition?.ToolTopLevelDefinitionID || 0,
          TestDefinitionGroupID: null,
          toolFamilyDefinitionID: this.testTemplateInput?.ToolLowLevelDefinition?.ToolMeasurementLevelDefinition?.ToolFamilyLevelDefinitionID || 0,
          ToolMeasurementLevelDefinitionID: this.testTemplateInput.ToolLowLevelDefinition?.ToolMeasurementLevelDefinitionID || 0,
          ToolLowLevelDefinitionID: this.testTemplateInput.ToolLowLevelDefinitionID || 0,
          TestTemplateName: this.testTemplateInput.TestTemplateName,
          TestTemplateID: this.testTemplateInput.TestTemplateID,
        },
        { emitEvent: false}
      )

      // trigger TestDefinitionGroupID.valueChanges
      this.testTemplateForm.controls.TestDefinitionGroupID.setValue(this.testTemplateInput.TestDefinitions?.[0]?.TestDefinitionGroupID || 0);
    }
  }

  addTestDefinitionID(id: number) {
    this.testDefinitionIDs.push(id);
  }

  removeTestDefinitionID(id: number) {
    this.testDefinitionIDs = this.testDefinitionIDs?.filter(testDefinitionID => testDefinitionID !== id);
  }

  isTestDefinitionIDExist(id: number) {
    return this.testDefinitionIDs?.includes(id) ? true : false;
  }

  getEnduranceByResolution(resolution: number, test: TestDefinition): number | string {
    return test.Endurance.find(endurance => endurance?.Resolution_ToolTopLevelDefinition?.Resolution.Value === resolution)?.ValueEnduranceUp || '-';
  }

  cancelEdit(){
    this.testTemplateForm.reset();
    this.testDefinitionIDs = [];
    this.filteredTestDefinitionGroups = this.toolsDefinitionService.testDefinitionGroups;
  }

  async onSubmit(){
    const testDefinitionIDs: string = this.testDefinitionIDs.join(',');

    const newTestTemplate = new TestTemplate(
      this.testTemplateForm.value.TestTemplateName || ' ',
      this.testTemplateForm.value.ToolLowLevelDefinitionID,
      this.testTemplateForm.value.TestTemplateID || 0,
    );

    console.log(newTestTemplate.TestTemplateID);
    
    // if the testTemplateID is 0, it means that the testTemplate is new and I want to use a free testTemplateID to save space in the database
    if(newTestTemplate.TestTemplateID === 0){
      const freeTemplate = this.toolsDefinitionService.testTemplates.find(template => template.TestTemplatesDefinitions.length === 0);
      if(freeTemplate){
        newTestTemplate.TestTemplateID = freeTemplate.TestTemplateID;
      }
    }

    try {
      await this.toolsDefinitionService.uploadTestTemplate( newTestTemplate, testDefinitionIDs);
      this.testTemplateForm.controls.TestDefinitionGroupID.setValue(null);
      this.testTemplateForm.controls.TestDefinitionGroupID.setErrors(null);
      // this.searchInput.setValue(null);
      this.selectedTestDefinitionGroup = null;
      this.toastService.success(' התבנית נשמרה בהצלחה ');
    } catch (error: any) {
      this.toastService.error(error);
    }
  }


  // searchable select testDefinitionGroup variables and functions: ------------------------------------------
  public searchInput = new FormControl('');
  public filteredTestDefinitionGroups = this.toolsDefinitionService.testDefinitionGroups;
  public selectedTestDefinitionGroup: TestDefinitionGroup = null;

  public filterTestDefinitionGroups() {
    this.filteredTestDefinitionGroups = this.toolsDefinitionService.testDefinitionGroups.filter(testDefinitionGroup => testDefinitionGroup.TestDefinitionGroupName.includes(this.searchInput.value));
  }

  public selectTestDefinitionGroup(testDefinitionGroup: TestDefinitionGroup) {
    console.log("selectTestDefinitionGroup");
    
    this.selectedTestDefinitionGroup = testDefinitionGroup;
    this.testTemplateForm.controls.TestDefinitionGroupID.setValue(testDefinitionGroup.TestDefinitionGroupID);
    this.searchInput.setValue(testDefinitionGroup.TestDefinitionGroupName);
    
  }

  // organize SelectsValues -----------------------------------------------------------------------------------

  setDefaultSelectsValues(){
    this.filteredTestDefinitionGroups = this.toolsDefinitionService.testDefinitionGroups;
    this.toolLowLevelDefinitions = this.toolsDefinitionService.toolLowLevelDefinitions;
    this.toolMeasurementLevelDefinitions = this.toolsDefinitionService.toolMeasurementLevelDefinitions;
    this.toolFamilyDefinitions = this.toolsDefinitionService.toolFamilyDefinitions;
  }

  updateToolFamilyDefinitions(familyDefinitions: ToolFamilyLevelDefinition[]): void {
    this.toolFamilyDefinitions = familyDefinitions;

    if(familyDefinitions.length === 0) {
      this.toastService.error('לא נמצאו משפחות כלים להצגה');
      return;
    }

    if(familyDefinitions.length === 1){
      this.testTemplateForm.controls.toolFamilyDefinitionID.setValue(familyDefinitions[0].ToolFamilyLevelDefinitionID, { emitEvent: false });
    }

    let toolMeasurementLevelDefinitions: ToolMeasurementLevelDefinition[] = [];
    familyDefinitions.forEach(familyDefinition => {
      toolMeasurementLevelDefinitions.concat(familyDefinition.ToolMeasurementLevelDefinitions);
    });
    console.log(1);
    
    this.updateToolMeasurementLevelDefinitions(toolMeasurementLevelDefinitions);
  }

  updateToolMeasurementLevelDefinitions(measurementLevelDefinitions: ToolMeasurementLevelDefinition[]): void {
    this.toolMeasurementLevelDefinitions = measurementLevelDefinitions;
    console.log(measurementLevelDefinitions);
    
    
    if(measurementLevelDefinitions.length === 0) {
      this.toastService.error('לא נמצאו טווחי מדידה להצגה');
      return;
    }

    if(measurementLevelDefinitions.length === 1){
      this.testTemplateForm.controls.ToolMeasurementLevelDefinitionID.setValue(measurementLevelDefinitions[0].ToolMeasurementLevelDefinitionID, { emitEvent: false });
    }
    
    let toolLowLevelDefinitions: ToolLowLevelDefinition[] = [];
    measurementLevelDefinitions.forEach(measurementLevelDefinition => {
      console.log(measurementLevelDefinition);
      
      toolLowLevelDefinitions = toolLowLevelDefinitions.concat(measurementLevelDefinition.ToolLowLevelDefinitions);
    });
    console.log(toolLowLevelDefinitions);
    
    this.updateToolLowLevelDefinitions(toolLowLevelDefinitions);
  }

  updateToolLowLevelDefinitions(toolLowLevelDefinitions: ToolLowLevelDefinition[]): void {
    this.toolLowLevelDefinitions = toolLowLevelDefinitions;
    console.log(toolLowLevelDefinitions);
    

    if(toolLowLevelDefinitions.length === 0) {
      this.toastService.error('לא נמצאו גדלי כלי להצגה');
      return;
    }

    if(toolLowLevelDefinitions.length === 1){
      this.testTemplateForm.controls.ToolLowLevelDefinitionID.setValue(toolLowLevelDefinitions[0].ToolLowLevelDefinitionID, { emitEvent: false });
    }
  }

  updateFilteredTestDefinitionGroups(groups: TestDefinitionGroup[]): void {
    this.filteredTestDefinitionGroups = groups;

    if(groups.length === 0) {
      this.toastService.error('לא נמצאו קבוצות בדיקות להצגה');
      return;
    }

    if(groups.length === 1){
      this.testTemplateForm.controls.TestDefinitionGroupID.setValue(groups[0].TestDefinitionGroupID, { emitEvent: false });
    }
  }

  // --------------------------------------------------------------------------------------------------------
}
