import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { Endurance } from 'src/app/models/TestDefinition/endurance';
import { TestDefinition } from 'src/app/models/TestDefinition/test-definition';
import { TestDefinitionGroup } from 'src/app/models/TestDefinition/test-definition-group';
import { TestTemplate } from 'src/app/models/TestDefinition/test-template';
import { PostGroupAndTestDefAndEndurance } from 'src/app/models/dtos';
import { SubTechnology } from 'src/app/models/toolDefinitionModels/sub-technology';
import { ToolFamilyLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-family-level-definition';
import { CovertOpsJsonToolJsons, ToolLowLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-low-level-definition';
import { ToolMeasurementLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-measurement-level-definition';
import { ToolTopLevelDefinition } from 'src/app/models/toolDefinitionModels/tool-top-level-definition';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';
@Component({
  selector: 'app-tavrigim-form',
  templateUrl: './tavrigim-form.component.html',
  styleUrls: ['./tavrigim-form.component.css']
})
export class TavrigimFormComponent implements OnInit {

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ) { }

  public testTemplateForm = this.formBuilder.group({
    TechID: [0],
    SubTechID: [0],
    ToolTopLevelDefinitionID: [0],
    toolFamilyDefinitionID: [0],
    ToolMeasurementLevelDefinitionID: [0],
    ToolLowLevelDefinitionID: [0, [Validators.required]],
    Wire: [0, Validators.required],
    Go: [0, Validators.required], 
    NoGo: [0, Validators.required],
  });

  public TestDefinitionsForm = this.formBuilder.array([
    this.formBuilder.group({
      TestDefinitionGroupID: [0],
      TestDefinitionID: [0],
      TestTemplateID: [0],
      EnduranceID: [0],
      TestDefinitionGroupName: ['קוטר חיצוני GO', [Validators.required]],
      ValueRequired: [0, [Validators.required]],
      ValueEndurance: [0, [Validators.required]],
      EnduranceUp: [true],
      EnduranceDown: [true],
      ValueUncertainty: [0, [Validators.required]],
      IsIso17025: [true, [Validators.required]],
    })
  ])

  ngOnInit(): void {
    this.testTemplateForm.controls.TechID.valueChanges.subscribe((techID: number) => this.onTechIDChange(techID));
    this.testTemplateForm.controls.SubTechID.valueChanges.subscribe((subTechID: number) => this.onSubTechIDChange(subTechID));
    this.testTemplateForm.controls.ToolTopLevelDefinitionID.valueChanges.subscribe((toolTopID: number) => this.onToolTopLevelDefinitionIDChange(toolTopID));
    this.testTemplateForm.controls.toolFamilyDefinitionID.valueChanges.subscribe((toolFamilyID: number) => this.onToolFamilyDefinitionIDChange(toolFamilyID));
    this.testTemplateForm.controls.ToolMeasurementLevelDefinitionID.valueChanges.subscribe((toolMeasurementID: number) => this.onToolMeasurementLevelDefinitionIDChange(toolMeasurementID));
    this.testTemplateForm.controls.ToolLowLevelDefinitionID.valueChanges.subscribe((toolLowID: number) => this.onToolLowLevelDefinitionIDChange(toolLowID));

    this.toolsDefinitionService.dataSubject.subscribe(()=>{
      this.setDefaultSelectsValues();
    });
    this.setDefaultSelectsValues();
    this.setFormDefaultValues();
    this.setEmptyTestDefinitionsForm();
  }

  async onSubmit(){
    const toolLow = this.toolsDefinitionService.toolLowLevelDefinitions.find(low => low.ToolLowLevelDefinitionID === this.testTemplateForm.controls.ToolLowLevelDefinitionID.value);
    this.setCovertOpsJsonToolJsonsFromForm(toolLow);
    console.log(toolLow);
    
    const groupAndTestDefAndEndurance: PostGroupAndTestDefAndEndurance[] = [];
    this.TestDefinitionsForm.controls.forEach((group: FormGroup) => {
      const testDef = group.value;
      const testTemplate = this.toolsDefinitionService.testTemplates.find(template => template.TestTemplateID === testDef.TestTemplateID);

      groupAndTestDefAndEndurance.push({
        TestDefinitionGroup: new TestDefinitionGroup(
          testDef.TestDefinitionGroupName,
          toolLow.ToolMeasurementLevelDefinition?.ToolFamilyLevelDefinition?.ToolTopLevelDefinitionID,
          testDef.TestDefinitionGroupID,
        ),  
        TestDefinition: new TestDefinition(
          testDef.TestDefinitionGroupName,
          testDef.TestDefinitionGroupID,
          testDef.ValueRequired,
          testDef.ValueUncertainty,
          testDef.IsIso17025,
          testDef.TestDefinitionID,
        ),
        Endurance: new Endurance(
          toolLow.ToolMeasurementLevelDefinition?.ToolFamilyLevelDefinition?.ToolTopLevelDefinition?.ResolutionToolTopLevelDefinition[0]?.Resolution_ToolTopLevelDefinitionID,
          testDef.Resolution_ToolTopLevelDefinitionID,
          testDef.EnduranceUp && testDef.ValueEndurance,
          testDef.EnduranceDown && testDef.ValueEndurance,
        ),
        TestTemplate: new TestTemplate(
          testTemplate?.TestTemplateName || '',
          toolLow?.ToolLowLevelDefinitionID || 0,
          testTemplate?.TestTemplateID || 0,
        ),
      });
    });  
    console.log(groupAndTestDefAndEndurance);
    
    try {
      await this.toolsDefinitionService.uploadTavrig(toolLow, groupAndTestDefAndEndurance);
    } catch (error) {
      console.log(error);
      
      this.toastService.error("שגיאה בהעלאת תבריג");
    }
  }
  // organize form listeners -----------------------------------------------------------------------------------
  public onTechIDChange(techID: number) {
    if(!techID) return;
    const toolTop = this.toolsDefinitionService.technologies.find(tech => tech.TechnologyID === techID);
    toolTop && this.updateSubTechnologies(toolTop.SubTechnologies);
    this.testTemplateForm.controls.SubTechID.setValue(0, {emitEvent: false});
  }

  public onSubTechIDChange(subTechID: number) {
    if(!subTechID) return;
    const subTech = this.subTechnologies.find(sub => sub.SubTechnologyID === subTechID);
    if(!subTech) return;
    this.updateToolTopLevelDefinitions(subTech.ToolTopLevelDefinitions);
    this.testTemplateForm.controls.ToolTopLevelDefinitionID.setValue(0, {emitEvent: false});
    this.testTemplateForm.controls.TechID.setValue(subTech.TechID, {emitEvent: false});
  }

  public onToolTopLevelDefinitionIDChange(toolTopID: number) {
    if(!toolTopID) return;
    const toolTop = this.toolTopLevelDefinitions.find(top => top.ToolTopLevelDefinitionID === toolTopID);
    if(!toolTop) return;
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.updateToolFamilyDefinitions(toolTop.ToolFamilyLevelDefinitions);
    this.testTemplateForm.controls.toolFamilyDefinitionID.setValue(0, {emitEvent: false});
    this.testTemplateForm.controls.SubTechID.setValue(toolTop.SubTechID, {emitEvent: false});
    this.testTemplateForm.controls.TechID.setValue(toolTop.SubTechnology.TechID, {emitEvent: false});
  }

  public onToolFamilyDefinitionIDChange(toolFamilyID: number) {
    if(!toolFamilyID) return;
    const toolFamily = this.toolFamilyDefinitions.find(family => family.ToolFamilyLevelDefinitionID === toolFamilyID);
    if(!toolFamily) return;
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions;
    this.updateToolMeasurementLevelDefinitions(toolFamily.ToolMeasurementLevelDefinitions);
    this.testTemplateForm.controls.ToolMeasurementLevelDefinitionID.setValue(0, {emitEvent: false});
    this.testTemplateForm.controls.ToolTopLevelDefinitionID.setValue(toolFamily.ToolTopLevelDefinitionID, {emitEvent: false});
    this.testTemplateForm.controls.SubTechID.setValue(toolFamily.ToolTopLevelDefinition.SubTechID, {emitEvent: false});
    this.testTemplateForm.controls.TechID.setValue(toolFamily.ToolTopLevelDefinition.SubTechnology.TechID, {emitEvent: false});
  }

  public onToolMeasurementLevelDefinitionIDChange(toolMeasurementID: number) {
    if(!toolMeasurementID) return;
    const toolMeasurement = this.toolMeasurementLevelDefinitions.find(measure => measure.ToolMeasurementLevelDefinitionID === toolMeasurementID);
    if(!toolMeasurement) return;
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions;
    this.toolFamilyDefinitions = this.toolsDefinitionService.toolFamilyDefinitions;
    this.updateToolLowLevelDefinitions(toolMeasurement.ToolLowLevelDefinitions);
    this.testTemplateForm.controls.ToolLowLevelDefinitionID.setValue(0, {emitEvent: false});
    this.testTemplateForm.controls.toolFamilyDefinitionID.setValue(toolMeasurement.ToolFamilyLevelDefinitionID, {emitEvent: false});
    this.testTemplateForm.controls.ToolTopLevelDefinitionID.setValue(toolMeasurement.ToolFamilyLevelDefinition.ToolTopLevelDefinitionID, {emitEvent: false});
    this.testTemplateForm.controls.SubTechID.setValue(toolMeasurement.ToolFamilyLevelDefinition.ToolTopLevelDefinition.SubTechID, {emitEvent: false});
    this.testTemplateForm.controls.TechID.setValue(toolMeasurement.ToolFamilyLevelDefinition.ToolTopLevelDefinition.SubTechnology.TechID, {emitEvent: false});
  }

  public onToolLowLevelDefinitionIDChange(toolLowID: number) {
    if(!toolLowID) return;
    const toolLow = this.toolLowLevelDefinitions.find(low => low.ToolLowLevelDefinitionID === toolLowID);
    if(!toolLow) return;
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions;
    this.toolFamilyDefinitions = this.toolsDefinitionService.toolFamilyDefinitions;
    this.toolMeasurementLevelDefinitions = this.toolsDefinitionService.toolMeasurementLevelDefinitions;
    this.testTemplateForm.controls.ToolMeasurementLevelDefinitionID.setValue(toolLow.ToolMeasurementLevelDefinitionID, {emitEvent: false});
    this.testTemplateForm.controls.toolFamilyDefinitionID.setValue(toolLow.ToolMeasurementLevelDefinition.ToolFamilyLevelDefinitionID, {emitEvent: false});
    this.testTemplateForm.controls.ToolTopLevelDefinitionID.setValue(toolLow.ToolMeasurementLevelDefinition.ToolFamilyLevelDefinition.ToolTopLevelDefinitionID, {emitEvent: false});
    this.testTemplateForm.controls.SubTechID.setValue(toolLow.ToolMeasurementLevelDefinition.ToolFamilyLevelDefinition.ToolTopLevelDefinition.SubTechID, {emitEvent: false});
    this.testTemplateForm.controls.TechID.setValue(toolLow.ToolMeasurementLevelDefinition.ToolFamilyLevelDefinition.ToolTopLevelDefinition.SubTechnology.TechID, {emitEvent: false});
    this.setExistingValuesForTestDefinitionsForm(toolLow);
  }

  setFormDefaultValues(){
    this.testTemplateForm.controls.Wire.setValue(null, {emitEvent: false});
    this.testTemplateForm.controls.Go.setValue(null, {emitEvent: false});
    this.testTemplateForm.controls.NoGo.setValue(null, {emitEvent: false});
  }

  // updateValuesFromExistingTavrig()

  // organize SelectsValues -----------------------------------------------------------------------------------

  public toolLowLevelDefinitions: ToolLowLevelDefinition[] = [];
  public toolMeasurementLevelDefinitions: ToolMeasurementLevelDefinition[] = [];
  public toolFamilyDefinitions: ToolFamilyLevelDefinition[] = [];
  public toolTopLevelDefinitions: ToolTopLevelDefinition[] = [];
  public subTechnologies: SubTechnology[] = [];

  setDefaultSelectsValues(){
    this.subTechnologies = this.toolsDefinitionService.subTechnologies;
    this.toolTopLevelDefinitions = this.toolsDefinitionService.toolTopLevelDefinitions;
    this.toolFamilyDefinitions = this.toolsDefinitionService.toolFamilyDefinitions;
    this.toolMeasurementLevelDefinitions = this.toolsDefinitionService.toolMeasurementLevelDefinitions;
    this.toolLowLevelDefinitions = this.toolsDefinitionService.toolLowLevelDefinitions;
  }

  updateToolLowLevelDefinitions(lows: ToolLowLevelDefinition[]) {
    this.toolLowLevelDefinitions = lows;

    if(lows.length === 0){
      this.toastService.error("No Tool Low Level Definitions found");
      return;
    }

    if(lows.length === 1){
      this.testTemplateForm.controls.ToolLowLevelDefinitionID.setValue(lows[0].ToolLowLevelDefinitionID, {emitEvent: false});
    }
  }

  updateToolMeasurementLevelDefinitions(measures: ToolMeasurementLevelDefinition[]) {
    this.toolMeasurementLevelDefinitions = measures;

    if(measures.length === 0){
      this.toastService.error("No Tool Measurement Level Definitions found");
      return;
    }

    if(measures.length === 1){
      this.testTemplateForm.controls.ToolMeasurementLevelDefinitionID.setValue(measures[0].ToolMeasurementLevelDefinitionID, {emitEvent: false});
    }

    let lows: ToolLowLevelDefinition[] = [];
    measures.forEach(measure => {
      lows.push(...measure.ToolLowLevelDefinitions);
    });
    this.updateToolLowLevelDefinitions(lows);
  }

  updateToolFamilyDefinitions(families: ToolFamilyLevelDefinition[]) {
    this.toolFamilyDefinitions = families;

    if(families.length === 0){
      this.toastService.error("No Tool Family Level Definitions found");
      return;
    }

    if(families.length === 1){
      this.testTemplateForm.controls.toolFamilyDefinitionID.setValue(families[0].ToolFamilyLevelDefinitionID, {emitEvent: false});
    }

    let measures: ToolMeasurementLevelDefinition[] = [];
    families.forEach(family => {
      measures.push(...family.ToolMeasurementLevelDefinitions);
    });
    this.updateToolMeasurementLevelDefinitions(measures);
  }

  updateToolTopLevelDefinitions(tops: ToolTopLevelDefinition[]) {
    this.toolTopLevelDefinitions = tops;

    if(tops.length === 0){
      this.toastService.error("No Tool Top Level Definitions found");
      return;
    }

    if(tops.length === 1){
      this.testTemplateForm.controls.ToolTopLevelDefinitionID.setValue(tops[0].ToolTopLevelDefinitionID, {emitEvent: false});
    }

    let families: ToolFamilyLevelDefinition[] = [];
    tops.forEach(top => {
      families.push(...top.ToolFamilyLevelDefinitions);
    });
    this.updateToolFamilyDefinitions(families);
  }

  updateSubTechnologies(subs: SubTechnology[]) {
    this.subTechnologies = subs;
    console.log(subs);
    
    if(subs.length === 0){
      this.toastService.error("No Sub Technologies found");
      return;
    }

    if(subs.length === 1){
      this.testTemplateForm.controls.SubTechID.setValue(subs[0].SubTechnologyID);
    }

    let tops: ToolTopLevelDefinition[] = [];
    subs.forEach(sub => {
      tops.push(...sub.ToolTopLevelDefinitions);
    });
    this.updateToolTopLevelDefinitions(tops);
  }

  // dashboard -----------------------------------------------------------------------------------
  setEmptyTestDefinitionsForm(){
    this.TestDefinitionsForm.clear();
    console.log(this.TestDefinitionsForm.controls);
    
    const TestDefinitionGroupNames = [ 'קוטר חיצוני GO', 'קוטר חיצוני NO-GO', 'PD GO', 'PD NO-GO',];
    TestDefinitionGroupNames.forEach(name =>{

      const form = this.formBuilder.group({
        TestDefinitionGroupID: [0],
        TestDefinitionID: [0],
        TestTemplateID: [0],
        EnduranceID: [0],
        TestDefinitionGroupName: [name, [Validators.required]],
        ValueRequired: [0, [Validators.required]],
        ValueEndurance: [0, [Validators.required]],
        EnduranceUp: [true],
        EnduranceDown: [true],
        ValueUncertainty: [0, [Validators.required]],
        IsIso17025: [true, [Validators.required]],
      });
      this.TestDefinitionsForm.push(
        form
      );
    });
  }

  setExistingValuesForTestDefinitionsForm(toolLow: ToolLowLevelDefinition){
    toolLow.TestTemplates.forEach((template: TestTemplate) => {
      template.TestDefinitions.forEach((testDef: TestDefinition) => {
        const TestDef = template.TestDefinitions[0];
        const endurance = TestDef.Endurance[0];
        const form = this.formBuilder.group({
          TestDefinitionGroupID: [testDef?.TestDefinitionGroupID],
          TestDefinitionID: [testDef?.TestDefinitionID || 0],
          TestTemplateID: [template?.TestTemplateID || 0],
          EnduranceID: [endurance?.EnduranceID || 0],
          TestDefinitionGroupName: [testDef?.TestDefinitionName || '', [Validators.required]],
          ValueRequired: [testDef?.ValueRequired || null, [Validators.required]],
          ValueEndurance: [endurance?.ValueEnduranceUp || endurance?.ValueEnduranceDown || null, [Validators.required]],
          EnduranceUp: [endurance?.ValueEnduranceUp ? true : false, [Validators.required]],
          EnduranceDown: [endurance?.ValueEnduranceDown ? true : false, [Validators.required]],
          ValueUncertainty: [testDef?.ValueUncertainty || null, [Validators.required]],
          IsIso17025: [testDef?.IsIso17025, [Validators.required]],
        });
        this.TestDefinitionsForm.push(
          form
        );
      });
    });
  }

  // CovertOpsJsonToolJsons -----------------------------------------------------------------------------------
  
  public Cover: CovertOpsJsonToolJsons[] = [
    {
      order : 1,
      key   : "wire",
      name  : "קוטר חוט",
      value : null
    },
    {
      order : 2,
      key   : "GO",
      name  : "מידה ל GO",
      value : null
    },
    {
      order : 3,
      key   : "NOGO",
      name  : "מידה ל NOGO",
      value : null
    },
  ];

  setCovertOpsJsonToolJsonsFromForm(toolLow: ToolLowLevelDefinition){
    toolLow.CovertOpsJsonToolJson = [];
  
    this.Cover.forEach((json: CovertOpsJsonToolJsons) => {
      switch(json.key) {
        case "wire":
          json.value = this.testTemplateForm.controls.Wire.value;
          break;
        case "GO":
          json.value = this.testTemplateForm.controls.Go.value;
          break;
        case "NOGO":
          json.value = this.testTemplateForm.controls.NoGo.value;
          break;
      }

      toolLow.CovertOpsJsonToolJson.push(json);
    });
    toolLow.CovertOpsJsonTool = JSON.stringify(toolLow.CovertOpsJsonToolJson);
  }

  setFormFromCovertOpsJsonToolJsons(toolLow: ToolLowLevelDefinition){
    toolLow.CovertOpsJsonToolJson.forEach((json: CovertOpsJsonToolJsons) => {
      switch(json.key) {
        case "wire":
          this.testTemplateForm.controls.Wire.setValue(json.value);
          break;
        case "GO":
          this.testTemplateForm.controls.Go.setValue(json.value);
          break;
        case "NOGO":
          this.testTemplateForm.controls.NoGo.setValue(json.value);
          break;
      }
    });
  }
}
