import { Injectable } from '@angular/core';
import { AppConfigService, ToolDefinitionURLs } from './app-config.service';
import { Technology } from '../models/toolDefinitionModels/technology';
import { SubTechnology } from '../models/toolDefinitionModels/sub-technology';
import { IsoProcedure } from '../models/toolDefinitionModels/iso-procedure';
import { ToolTopLevelDefinition } from '../models/toolDefinitionModels/tool-top-level-definition';
import { MeasurementUnit } from '../models/toolDefinitionModels/measurement-unit';
import { ToolMeasurementLevelDefinition } from '../models/toolDefinitionModels/tool-measurement-level-definition';
import { ToolLowLevelDefinition } from '../models/toolDefinitionModels/tool-low-level-definition';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { Resolution } from '../models/TestDefinition/resolution';
import { ResolutionToolTopLevelDefinition, ResolutionToolTopLevelDefinitionResponse } from '../models/TestDefinition/resolution-tool-top-level-definition';
import { TestDefinitionGroup } from '../models/TestDefinition/test-definition-group';
import { Endurance } from '../models/TestDefinition/endurance';
import { TestTemplate } from '../models/TestDefinition/test-template';
import { TestTemplatesDefinition, TestTemplatesDefinitionResponse } from '../models/TestDefinition/test-templates-definition';
import { TestDefinition } from '../models/TestDefinition/test-definition';
import { ToolFamilyLevelDefinition } from '../models/toolDefinitionModels/tool-family-level-definition';
import { Models, PostGroupAndTestDefAndEndurance, PostTestDefinition, PostTestTemplate, PostToolTopLevelDefinition, PostToolTopLevelDefinitionResult, ToolDefinitionData } from '../models/dtos';


@Injectable({
  providedIn: 'root'
})
export class ToolsDefinitionService {

  constructor(private appConfig: AppConfigService, private http: HttpClient) { 
    this.getToolsDefinitionData();
  }

  public MeasurementUnit: MeasurementUnit[];
  public technologies: Technology[];
  public subTechnologies: SubTechnology[];
  public isoProcedure: IsoProcedure[];
  public toolTopLevelDefinitions: ToolTopLevelDefinition[];
  public toolFamilyDefinitions: ToolFamilyLevelDefinition[];
  public toolMeasurementLevelDefinitions: ToolMeasurementLevelDefinition[];
  public toolLowLevelDefinitions: ToolLowLevelDefinition[];
  public resolutions: Resolution[];
  public resolutionToolTopLevelDefinitions: ResolutionToolTopLevelDefinition[];
  public testDefinitionGroups: TestDefinitionGroup[];
  public testDefinitions: TestDefinition[];
  public endurance: Endurance[];
  public testTemplates: TestTemplate[];
  public testTemplatesDefinitions: TestTemplatesDefinition[];

  public dataSubject: Subject<boolean> = new Subject<boolean>();

  public async getToolsDefinitionData(): Promise<void> {
    const observable = this.http.get<ToolDefinitionData>(this.appConfig.toolDefinitionURL);
    const data = await firstValueFrom(observable);

    console.log(data);
    
    this.MeasurementUnit = data.MeasurementUnits;
    this.technologies = data.Technologies;
    this.subTechnologies = data.SubTechnologies;
    this.isoProcedure = data.IsoProcedures;
    this.toolTopLevelDefinitions = data.ToolTopLevelDefinitions;
    this.toolFamilyDefinitions = data.ToolFamilyLevelDefinitions;
    this.toolMeasurementLevelDefinitions = data.ToolMeasurementLevelDefinitions;
    this.toolLowLevelDefinitions = data.ToolLowLevelDefinitions;
    this.resolutions = data.Resolutions;
    this.resolutionToolTopLevelDefinitions = data.Resolution_ToolTopLevelDefinitions;
    this.testDefinitionGroups = data.TestDefinitionGroups;
    this.testDefinitions = data.TestDefinitions;
    this.endurance = data.Endurance;
    this.testTemplates = data.TestTemplates;
    this.testTemplatesDefinitions = data.TestTemplatesDefinitions;

    this.linkTheData();
    
  }

  public async createToolDefinition(toolDef: Models, isNotGetToolsDefinitionData = false): Promise<number> {
    console.log(toolDef);
    
    let sname = this.getStringNameFromObject(toolDef);
    console.log(sname);
    
    let body = {
      toolDefinitionName : sname,
      payload : toolDef
    }
    console.log(body);
    
    const observable = this.http.post<number>(this.appConfig.toolDefinitionURL, body);
    const id = await firstValueFrom(observable);
    !isNotGetToolsDefinitionData && await this.getToolsDefinitionData();
    
    return id;
  }

  public async updateToolDefinition(
      toolDef: Models,
      id: number,
      isNotGetToolsDefinitionData = false
    ): Promise<void> {
    console.log(toolDef);
    
    let sname = this.getStringNameFromObject(toolDef);
      console.log(sname);
      
    let body = {
      toolDefinitionName : sname,
      payload : toolDef
    }
    console.log(body);
    
    const observable = this.http.put(this.appConfig.toolDefinitionURL + "/" + id, body);
    await firstValueFrom(observable);
    !isNotGetToolsDefinitionData && await this.getToolsDefinitionData();
  }

  public async deleteToolDefinition(model: string,id: number, toolDefinitionURLs: ToolDefinitionURLs = ToolDefinitionURLs.toolDefinitionURL, isNotGetToolsDefinitionData = false): Promise<void> {
    
    let str: string;
    switch(toolDefinitionURLs)
    {
      case ToolDefinitionURLs.toolDefinitionURL:
        str = this.appConfig.toolDefinitionURL + "/" + id + "?model=" + model;
        break;
      case ToolDefinitionURLs.TestDefinitionGroupURL:
        str = this.appConfig.TestDefinitionGroupURL + "/" + id;
        break;
      case ToolDefinitionURLs.TestDefinitionURL:
        str = this.appConfig.TestDefinitionURL + "/" + id;
        break;
    }
    const observable = this.http.delete(str);
    await firstValueFrom(observable);
  }

  public async uploadToolTopDefinition(ToolTopLevelDefinition: ToolTopLevelDefinition, IsoProcedure?: IsoProcedure, SValues?: string, isNotGetToolsDefinitionData = false): Promise<number> {

    if(!IsoProcedure){
      IsoProcedure = ToolTopLevelDefinition.IsoProcedure;
    }

    if(!SValues){
      SValues = ToolTopLevelDefinition.ResolutionToolTopLevelDefinition.map(res => res.Resolution.Value).join(",") || "1";
    }
    const payload: PostToolTopLevelDefinition = { ToolTopLevelDefinition, SValues, IsoProcedure };

    const observable = this.http.post<PostToolTopLevelDefinitionResult>(this.appConfig.ToolTopLevelDefinitionURL, payload);
    const data = await firstValueFrom(observable);
    return data.ToolTopLevelDefinition.ToolTopLevelDefinitionID;
  }

  public async uploadTestDefinition(testDefinition: TestDefinition, endurance: Endurance[], isNotGetToolsDefinitionData = false): Promise<void> {
    const payload = { testDefinition, endurance };
    const observable = this.http.post<PostTestDefinition>(this.appConfig.TestDefinitionURL, payload);
    await firstValueFrom(observable);
    !isNotGetToolsDefinitionData && await this.getToolsDefinitionData();
  }

  async uploadTestTemplate(testTemplate: TestTemplate, testDefinitionsIDs: string, isNotGetToolsDefinitionData = false): Promise<void>{
    const observable = this.http.post<PostTestTemplate>(this.appConfig.TestTemplateURL, { TestTemplate: testTemplate, TestDefinitionsIDs: testDefinitionsIDs });
    await firstValueFrom(observable);
    !isNotGetToolsDefinitionData && await this.getToolsDefinitionData();
  }

  async uploadTavrig(toolLowLevelDefinition: ToolLowLevelDefinition, GTE: PostGroupAndTestDefAndEndurance[], isNotGetToolsDefinitionData = false): Promise<void>{
    toolLowLevelDefinition.TestTemplates = [];
    toolLowLevelDefinition.ToolMeasurementLevelDefinition = null;
    toolLowLevelDefinition.CovertOpsJsonToolJson = null;
    
    const observable = this.http.post(this.appConfig.TavrigURL, { PostGroupAndTestDefAndEndurance: GTE, ToolLowLevelDefinition: toolLowLevelDefinition });
    await firstValueFrom(observable);
    !isNotGetToolsDefinitionData && await this.getToolsDefinitionData();
  }

  linkTheData(): void {
    this.clearTheArrays();

    this.subTechnologies.forEach(subTechnology => {
      const technology = this.technologies.find(technology => technology.TechnologyID === subTechnology.TechID);   
      if(technology){
        technology.SubTechnologies.push(subTechnology);
        subTechnology.Technology = technology;
      }
    });

    this.toolTopLevelDefinitions.forEach(toolTopLevelDefinition => {
      const subTechnology = this.subTechnologies.find(subTechnology => subTechnology.SubTechnologyID === toolTopLevelDefinition.SubTechID);
      const isoProcedure = this.isoProcedure.find(isoProcedure => isoProcedure.ToolTopLevelDefinitionID === toolTopLevelDefinition.ToolTopLevelDefinitionID);
      if(isoProcedure && subTechnology){
        toolTopLevelDefinition.SubTechnology = subTechnology;
        subTechnology?.ToolTopLevelDefinitions?.push(toolTopLevelDefinition);

        // isoProcedure.ToolTopLevelDefinition = toolTopLevelDefinition;
        toolTopLevelDefinition.IsoProcedure = isoProcedure;
      }
    });

    this.toolFamilyDefinitions.forEach((toolFamilyDefinition: ToolFamilyLevelDefinition) => {
      const toolTopLevelDefinition = this.toolTopLevelDefinitions.find(toolTopLevelDefinition => toolTopLevelDefinition.ToolTopLevelDefinitionID === toolFamilyDefinition.ToolTopLevelDefinitionID);
      if(toolTopLevelDefinition){
        toolFamilyDefinition.ToolTopLevelDefinition = toolTopLevelDefinition;
        toolTopLevelDefinition.ToolFamilyLevelDefinitions.push(toolFamilyDefinition);
      }
    });

    this.toolMeasurementLevelDefinitions.forEach(measurement => {
      const toolFamily = this.toolFamilyDefinitions.find(toolFamily => toolFamily.ToolFamilyLevelDefinitionID === measurement.ToolFamilyLevelDefinitionID);
      const valueUnit = this.MeasurementUnit.find(measurementUnit => measurementUnit.MeasurementUnitID === measurement.ValueUnitID);
      if(valueUnit && toolFamily){
        measurement.ToolFamilyLevelDefinition = toolFamily;
        toolFamily.ToolMeasurementLevelDefinitions.push(measurement);
        valueUnit.ToolMeasurementLevelDefinition.push(measurement);
        measurement.ValueUnit = valueUnit;
      }
    });

    this.toolLowLevelDefinitions.forEach(low => {
      const toolMeasurementLevelDefinition = this.toolMeasurementLevelDefinitions.find(toolMeasurementLevelDefinition => toolMeasurementLevelDefinition.ToolMeasurementLevelDefinitionID === low.ToolMeasurementLevelDefinitionID);
      if (toolMeasurementLevelDefinition){
        low.ToolMeasurementLevelDefinition = toolMeasurementLevelDefinition;
        toolMeasurementLevelDefinition?.ToolLowLevelDefinitions?.push(low);
      }
    });

    this.resolutionToolTopLevelDefinitions.forEach(res_top => {
      const toolTopLevelDefinition = this.toolTopLevelDefinitions.find(toolTopLevelDefinition => toolTopLevelDefinition.ToolTopLevelDefinitionID === res_top.ToolTopLevelDefinitionID);
      const resolution = this.resolutions.find(resolution => resolution.ResolutionID === res_top.ResolutionID);
     
      if(resolution && toolTopLevelDefinition){
        toolTopLevelDefinition.Resolutions.push(resolution);
        toolTopLevelDefinition.ResolutionToolTopLevelDefinition.push(res_top);

        resolution.ToolTopLevelDefinitions.push(toolTopLevelDefinition);
        resolution.ResolutionToolTopLevelDefinitions.push(res_top);

        res_top.ToolTopLevelDefinition = toolTopLevelDefinition;
        res_top.Resolution = resolution;
      } else {
        console.log("resolution or toolTopLevelDefinition not found");
        console.log(res_top);        
        console.log(this.resolutions);
        console.log(this.toolTopLevelDefinitions);
        
      }
    });

    this.testDefinitionGroups.forEach(group => {
      const toolTopLevelDefinition = this.toolTopLevelDefinitions.find(toolTopLevelDefinition => toolTopLevelDefinition.ToolTopLevelDefinitionID === group.ToolTopLevelDefinitionID);
      if(toolTopLevelDefinition){
        group.ToolTopLevelDefinition = toolTopLevelDefinition;
        toolTopLevelDefinition.TestDefinitionGroups.push(group);
      }
    });


    this.endurance.forEach(endurance => {
      const testDefinition = this.testDefinitions.find(testDefinition => testDefinition.TestDefinitionID === endurance.TestDefinitionID);
      const resTool = this.resolutionToolTopLevelDefinitions.find(res => res.Resolution_ToolTopLevelDefinitionID === endurance.Resolution_ToolTopLevelDefinitionID);
      if(resTool && testDefinition){
        endurance.Resolution_ToolTopLevelDefinition = resTool;
        endurance.TestDefinition = testDefinition;
  
        resTool.Endurance.push(endurance);
        testDefinition.Endurance.push(endurance);
      }

    });

    this.testDefinitions.forEach(test => {
      const testDefinitionGroup = this.testDefinitionGroups.find(testDefinitionGroup => testDefinitionGroup.TestDefinitionGroupID === test.TestDefinitionGroupID);
      if(testDefinitionGroup){      
        test.TestDefinitionGroup = testDefinitionGroup;
        testDefinitionGroup.TestDefinitions.push(test);
      }
      test.Endurance = test.Endurance.sort((a, b) => a.ValueEnduranceUp - b.ValueEnduranceUp);
    });


    this.testTemplates.forEach(template => {
      const toolLowLevelDefinition = this.toolLowLevelDefinitions.find(toolLowLevelDefinition => toolLowLevelDefinition.ToolLowLevelDefinitionID === template.ToolLowLevelDefinitionID);
      if(toolLowLevelDefinition){
        template.ToolLowLevelDefinition = toolLowLevelDefinition;
        toolLowLevelDefinition.TestTemplates.push(template);
      }
    });

    this.testTemplatesDefinitions.forEach(definition => {
      const testDefinition = this.testDefinitions.find(testDefinition => testDefinition.TestDefinitionID === definition.TestDefinitionID);
      const testTemplate = this.testTemplates.find(testTemplate => testTemplate.TestTemplateID === definition.TestTemplateID);

      // definition.TestDefinition = testDefinition;
      // definition.TestTemplate = testTemplate;

      if(testDefinition && testTemplate){
        testDefinition.TestTemplates.push(testTemplate);
        testTemplate.TestDefinitions.push(testDefinition);
      }
    });
 
    this.toolMeasurementLevelDefinitions = this.toolMeasurementLevelDefinitions.sort((a, b) => a.ValueMax - b.ValueMax);
    
    console.log("Data linked");
    console.log(this);

    this.dataSubject.next(true);
  }

  clearTheArrays(){

    this.resolutionToolTopLevelDefinitions.forEach(res => {
      res.Endurance = [];
    });

    this.technologies.forEach(tech =>{
      tech.SubTechnologies = [];
    })

    this.subTechnologies.forEach(subTech => {
      subTech.ToolTopLevelDefinitions = [];
    });

    this.MeasurementUnit.forEach(measurement => {
      measurement.ToolMeasurementLevelDefinition = [];
    });

    this.resolutions.forEach(res => {
      res.ToolTopLevelDefinitions = [];
    });

    this.toolTopLevelDefinitions.forEach(tool => {
      tool.Resolutions = [];
      tool.TestDefinitionGroups = [];
      tool.ToolFamilyLevelDefinitions = [];
      tool.ResolutionToolTopLevelDefinition = [];
    });

    this.resolutions.forEach(res => {
      res.ToolTopLevelDefinitions = [];
      res.ResolutionToolTopLevelDefinitions = []; 
    });

    this.toolFamilyDefinitions.forEach(family => {
      family.ToolMeasurementLevelDefinitions = [];
    });

    this.toolMeasurementLevelDefinitions.forEach(measurement => {
      measurement.ToolLowLevelDefinitions = [];
    });

    this.toolLowLevelDefinitions = this.toolLowLevelDefinitions.map(measurement =>{
      const measurementInstance = new ToolLowLevelDefinition(measurement.MCode, measurement.ToolMeasurementLevelDefinitionID, measurement.ValueMin, measurement.ValueMax, measurement.ToolLowLevelDefinitionName, measurement.ToolLowLevelDefinitionID, measurement.CovertOpsJsonTool);
      return measurementInstance;    
    })

    this.testDefinitionGroups.forEach(group => {
      group.TestDefinitions = [];
    });

    this.testDefinitions.forEach(test => {
      test.Endurance = [];
      test.TestTemplates = [];
      test.TestTemplatesDefinitions = [];
    });

    this.testTemplates.forEach(template => {
      template.TestTemplatesDefinitions = [];
      template.TestDefinitions = [];
    });

    // this.testTemplatesDefinitions.forEach(definition => {
      
    // });
  }

  getUniqueAndSortedResolutions(): number[] {
    return[...new Set(this.resolutions?.map(res => res.Value))].sort();
  }

  getNextMCode(MCodes: number[]): number {
    let max = Math.max(...MCodes, 0);
    return max + 1;
  }

  getStringNameFromObject(model: Models): string {
    let sname = "";

    switch(model.constructor.name){
      case  Technology.name: 
        sname = "Technology";
        break;
      case  SubTechnology.name:
        sname = "SubTechnology";
        break;
      case  IsoProcedure.name:
        sname = "IsoProcedure";
        break;
      case  ToolTopLevelDefinition.name:
        sname = "ToolTopLevelDefinition";
        break;
      case  MeasurementUnit.name:
        sname = "MeasurementUnit";
        break;
      case  ToolFamilyLevelDefinition.name:
        sname = "ToolFamilyLevelDefinition";
        break;
      case  ToolMeasurementLevelDefinition.name:
        sname = "ToolMeasurementLevelDefinition";
        break;
      case  ToolLowLevelDefinition.name:
        sname = "ToolLowLevelDefinition";
        break;
      case  Resolution.name:
        sname = "Resolution";
        break;
      case  ResolutionToolTopLevelDefinition.name:
        sname = "ResolutionToolTopLevelDefinition";
        break;
      case  TestDefinitionGroup.name:
        sname = "TestDefinitionGroup";
        break;
      case  TestDefinition.name:
        sname = "TestDefinition";
        break;
      case  Endurance.name:
        sname = "Endurance";
        break;
      case  TestTemplate.name:
        sname = "TestTemplate";
        break;
      case  TestTemplatesDefinition.name:
        sname = "TestTemplatesDefinition";
        break;
    }
    
    return sname;
  }
}