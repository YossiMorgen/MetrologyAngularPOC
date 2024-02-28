import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { TestDefinition } from 'src/app/models/TestDefinition/test-definition';
import { TestDefinitionGroup } from 'src/app/models/TestDefinition/test-definition-group';
import { TestTemplate } from 'src/app/models/TestDefinition/test-template';
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

  public toolMeasurementLevelDefinitions: ToolMeasurementLevelDefinition[] = [];
  public toolLowLevelDefinitions: ToolLowLevelDefinition[] = [];
  public testDefinitions: TestDefinition[] = [];

  public testTemplateForm = this.formBuilder.group({
    ToolTopLevelDefinitionID: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    TestDefinitionGroupID: [0, Validators.required],
    ToolMeasurementLevelDefinitionID: [0],
    ToolLowLevelDefinitionID: [0, [Validators.required]],
    TestTemplateName: [' '],
    TestTemplateID: [0],
  });

  ngOnInit(): void {

    this.testTemplateForm.reset();
    
    this.testTemplateForm.controls.ToolTopLevelDefinitionID.valueChanges.subscribe((value: number) => {
      this.testTemplateForm.controls.ToolMeasurementLevelDefinitionID.setValue(null);
      this.testTemplateForm.controls.ToolLowLevelDefinitionID.setValue(null);
      this.testDefinitions = [];
      this.filteredTestDefinitionGroups = this.toolsDefinitionService.testDefinitionGroups.filter(testDefinitionGroup => testDefinitionGroup.ToolTopLevelDefinitionID === value);
      
      const toolTopLevel = this.toolsDefinitionService.toolTopLevelDefinitions.find(toolTopLevelDefinition => toolTopLevelDefinition.ToolTopLevelDefinitionID === value);
      
      // get the toolMeasurementLevelDefinitions of the selected testDefinitionGroup and sort them by ValueMax
      this.toolMeasurementLevelDefinitions = toolTopLevel?.ToolMeasurementLevelDefinitions.sort((a, b) => a.ValueMax - b.ValueMax);

      this.toolLowLevelDefinitions = [];
      this.toolMeasurementLevelDefinitions.forEach(definition => {
        this.toolLowLevelDefinitions = this.toolLowLevelDefinitions.concat(definition.ToolLowLevelDefinitions);
      });

      this.toolLowLevelDefinitions = this.toolLowLevelDefinitions.sort((a, b) => a.ValueMax - b.ValueMax);

      if(this.toolLowLevelDefinitions.length == 0){
        this.toastService.error(' אין גודלי כלי לכלי זה, נא להגדיר גדלים ולחזור לטופס זה');
      }
    });

    this.testTemplateForm.controls.TestDefinitionGroupID.valueChanges.subscribe((value: number) => {
      if(!value) return;
      
      // find the testDefinitionGroup by the selected value
      this.testDefinitionGroup = this.toolsDefinitionService.testDefinitionGroups.find(testDefinitionGroup => testDefinitionGroup.TestDefinitionGroupID === value);
      console.log(this.testDefinitionGroup);

      this.testTemplateForm.controls.ToolTopLevelDefinitionID.setValue(this.testDefinitionGroup.ToolTopLevelDefinitionID);
     
      // get the testDefinitions of the selected testDefinitionGroup
      this.testDefinitions = this.testDefinitionGroup.TestDefinitions;
      console.log(this.testDefinitions);
      

    });

    this.testTemplateForm.controls.ToolMeasurementLevelDefinitionID.valueChanges.subscribe((value: number) => {
      this.toolLowLevelDefinitions = this.toolLowLevelDefinitions.filter(toolLowLevelDefinition => toolLowLevelDefinition.ToolMeasurementLevelDefinitionID === value);
    });

    this.testTemplateForm.controls.ToolLowLevelDefinitionID.valueChanges.subscribe((value: number) => {
      const toolLow = this.toolLowLevelDefinitions.find(toolLowLevelDefinition => toolLowLevelDefinition.ToolLowLevelDefinitionID === value)
      this.testTemplateForm.controls?.ToolMeasurementLevelDefinitionID?.setValue(toolLow?.ToolMeasurementLevelDefinitionID || null);

      const testTemplate = this.toolsDefinitionService.testTemplates.find(testTemplate => 
        testTemplate.ToolLowLevelDefinitionID === value && 
        (
          testTemplate.TestDefinitions[0]?.TestDefinitionGroupID === this.testDefinitionGroup.TestDefinitionGroupID || 
          testTemplate.TestDefinitions.length === 0
        )
      );

      if(testTemplate){
        
        // this.toastService.info('קיים כבר תבנית בדיקה עבור כלי זה');
        this.testTemplateForm.controls.TestTemplateID.setValue(testTemplate.TestTemplateID);
        this.testTemplateForm.controls.TestTemplateID.setValue(testTemplate.TestTemplateID);
        console.log(this.testDefinitionIDs);
        if(testTemplate.TestDefinitions.length > 0){
          this.testDefinitionIDs = testTemplate.TestDefinitions.map(test => test.TestDefinitionID);
        }  
        
      } else {
        this.testTemplateForm.controls.TestTemplateID.setValue(0);
        this.testDefinitionIDs = [];
      }
    });

    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.filteredTestDefinitionGroups = this.toolsDefinitionService.testDefinitionGroups;
    });

    this.filteredTestDefinitionGroups = this.toolsDefinitionService.testDefinitionGroups;
    console.log(this.filteredTestDefinitionGroups);
    
  }

  ngOnChanges(): void {
    console.log("change");
    console.log(this.testTemplateInput);
    
    if(this.testTemplateInput){
      this.testTemplateForm.setValue({
        ToolTopLevelDefinitionID: this.testTemplateInput?.ToolLowLevelDefinition?.ToolMeasurementLevelDefinition?.ToolTopLevelDefinitionID,
        TestDefinitionGroupID: this.testTemplateInput.TestDefinitions?.[0]?.TestDefinitionGroupID || 0,
        ToolMeasurementLevelDefinitionID: this.testTemplateInput.ToolLowLevelDefinition?.ToolMeasurementLevelDefinitionID || 0,
        ToolLowLevelDefinitionID: this.testTemplateInput.ToolLowLevelDefinitionID || 0,
        TestTemplateName: this.testTemplateInput.TestTemplateName,
        TestTemplateID: this.testTemplateInput.TestTemplateID,
      })

      this.testDefinitionIDs = this.testTemplateInput.TestTemplatesDefinitions.map(testTemplateDefinition => testTemplateDefinition.TestDefinitionID);
    }
  }

  addTestDefinitionID(id: number) {
    this.testDefinitionIDs.push(id);
  }

  removeTestDefinitionID(id: number) {
    this.testDefinitionIDs = this.testDefinitionIDs.filter(testDefinitionID => testDefinitionID !== id);
  }

  isTestDefinitionIDExist(id: number) {
    return this.testDefinitionIDs.includes(id) ? true : false;
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
    console.log(testDefinitionIDs);
    console.log(this.testTemplateForm.value);

    const newTestTemplate = new TestTemplate(
      this.testTemplateForm.value.TestTemplateName || ' ',
      this.testTemplateForm.value.ToolLowLevelDefinitionID,
      this.testTemplateForm.value.TestTemplateID || 0,
    );

    try {
      await this.toolsDefinitionService.uploadTestTemplate( newTestTemplate, testDefinitionIDs);
      // this.testTemplateForm.reset();
      this.formDirective.resetForm();
      this.toastService.success(' התבנית נשמרה בהצלחה ');
    } catch (error: any) {
      this.toastService.error(error);
    }
  }


  // searchable select testDefinitionGroup variables and functions: ---------------------
  public searchInput = new FormControl('');
  public filteredTestDefinitionGroups = this.toolsDefinitionService.testDefinitionGroups;
  public selectedTestDefinitionGroup: TestDefinitionGroup = null;

  public filterTestDefinitionGroups() {
    this.filteredTestDefinitionGroups = this.toolsDefinitionService.testDefinitionGroups.filter(testDefinitionGroup => testDefinitionGroup.TestDefinitionGroupName.includes(this.searchInput.value));
  }

  public selectTestDefinitionGroup(testDefinitionGroup: TestDefinitionGroup) {
    this.selectedTestDefinitionGroup = testDefinitionGroup;
    this.testTemplateForm.controls.TestDefinitionGroupID.setValue(testDefinitionGroup.TestDefinitionGroupID);
    this.searchInput.setValue(testDefinitionGroup.TestDefinitionGroupName);
  }

  // -----------------------------------------------------------------------------------
}
