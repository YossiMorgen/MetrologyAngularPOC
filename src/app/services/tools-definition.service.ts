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

interface ToolDefinitionData {
  Technologies: Technology[];
  SubTechnologies: SubTechnology[];
  IsoProcedures: IsoProcedure[];
  ToolTopLevelDefinitions: ToolTopLevelDefinition[];
  MeasurementUnits: MeasurementUnit[];
  ToolMeasurementLevelDefinitions: ToolMeasurementLevelDefinition[];
  ToolLowLevelDefinitions: ToolLowLevelDefinition[];
  Resolutions: Resolution[];
  Resolution_ToolTopLevelDefinitions: ResolutionToolTopLevelDefinition[];
  TestDefinitionGroups: TestDefinitionGroup[];
  TestDefinitions: TestDefinition[];
  Endurance: Endurance[];
  TestTemplates: TestTemplate[];
  TestTemplatesDefinitions: TestTemplatesDefinition[];
}

interface PostToolTopLevelDefinition
{
    ToolTopLevelDefinition: ToolTopLevelDefinition;
    SValues: string;
    IsoProcedure: IsoProcedure;
}

interface PostToolTopLevelDefinitionResult
{
  ToolTopLevelDefinition: ToolTopLevelDefinition;
  Resolution_ToolTopLevelDefinitions: ResolutionToolTopLevelDefinitionResponse[];
  Resolutions: Resolution[];
  IsoProcedure: IsoProcedure;
}

interface PostTestDefinition{
  TestDefinition: TestDefinition;
  Endurance: Endurance[];
}

interface PostTestTemplate {
  TestTemplate: TestTemplate;
  TestDefinitionsIDs: string;
  TestTemplatesDefinitions: TestTemplatesDefinitionResponse[];
}

type Models = Technology | 
SubTechnology | IsoProcedure | ToolTopLevelDefinition | 
MeasurementUnit | ToolMeasurementLevelDefinition | ToolLowLevelDefinition |
Resolution | ResolutionToolTopLevelDefinition | TestDefinitionGroup |
TestDefinition | Endurance | TestTemplate | TestTemplatesDefinition;

@Injectable({
  providedIn: 'root'
})
export class ToolsDefinitionService {

  constructor(private appConfig: AppConfigService, private http: HttpClient) { 
    this.getToolsDefinitionData();
  }

  public technologies: Technology[];
  public subTechnologies: SubTechnology[];
  public isoProcedure: IsoProcedure[];
  public toolTopLevelDefinitions: ToolTopLevelDefinition[];
  public MeasurementUnit: MeasurementUnit[];
  public toolMeasurementLevelDefinition: ToolMeasurementLevelDefinition[];
  public toolLowLevelDefinition: ToolLowLevelDefinition[];
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
    
    this.technologies = data.Technologies;
    this.subTechnologies = data.SubTechnologies;
    this.isoProcedure = data.IsoProcedures;
    this.toolTopLevelDefinitions = data.ToolTopLevelDefinitions;
    this.MeasurementUnit = data.MeasurementUnits;
    this.toolMeasurementLevelDefinition = data.ToolMeasurementLevelDefinitions;
    this.toolLowLevelDefinition = data.ToolLowLevelDefinitions;
    this.resolutions = data.Resolutions;
    this.resolutionToolTopLevelDefinitions = data.Resolution_ToolTopLevelDefinitions;
    this.testDefinitionGroups = data.TestDefinitionGroups;
    this.testDefinitions = data.TestDefinitions;
    this.endurance = data.Endurance;
    this.testTemplates = data.TestTemplates;
    this.testTemplatesDefinitions = data.TestTemplatesDefinitions;

    this.linkTheData();
    
  }

  public async createToolDefinition(toolDef: Models): Promise<number> {
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
    await this.getToolsDefinitionData();
    return id;
  }

  public async updateToolDefinition(
      toolDef: Models,
        id: number
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
    await this.getToolsDefinitionData();
  }

  public async deleteToolDefinition(model: string,id: number, toolDefinitionURLs: ToolDefinitionURLs = ToolDefinitionURLs.toolDefinitionURL): Promise<void> {
    
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

    // this.linkTheData();
  }

  public async uploadToolTopDefinition(SValues: string, ToolTopLevelDefinition: ToolTopLevelDefinition, IsoProcedure: IsoProcedure): Promise<void> {
    const payload: PostToolTopLevelDefinition = { ToolTopLevelDefinition, SValues, IsoProcedure };

    const observable = this.http.post<PostToolTopLevelDefinitionResult>(this.appConfig.ToolTopLevelDefinitionURL, payload);
    await firstValueFrom(observable);
    await this.getToolsDefinitionData();
    // const data = await firstValueFrom(observable);

    // if(ToolTopLevelDefinition.ToolTopLevelDefinitionID === 0){
    //   this.isoProcedure.unshift(data.IsoProcedure);
    //   this.toolTopLevelDefinitions.unshift(data.ToolTopLevelDefinition);
    //   console.log(this.toolTopLevelDefinitions);
    // } else {
    //   this.isoProcedure = this.isoProcedure.map(iso => iso.IsoProcedureID === IsoProcedure.IsoProcedureID ? data.IsoProcedure : iso);
    //   this.toolTopLevelDefinitions = this.toolTopLevelDefinitions.map(tool => tool.ToolTopLevelDefinitionID === ToolTopLevelDefinition.ToolTopLevelDefinitionID ? data.ToolTopLevelDefinition : tool);
    // }
    
    // data.Resolution_ToolTopLevelDefinitions.forEach((Resolution_ToolTopLevelDefinition: ResolutionToolTopLevelDefinitionResponse) => {
    //   if(Resolution_ToolTopLevelDefinition.$action === 'INSERT'){
    //     this.resolutionToolTopLevelDefinitions.unshift(Resolution_ToolTopLevelDefinition);
    //   } else if(Resolution_ToolTopLevelDefinition.$action === 'DELETE'){
    //     this.resolutionToolTopLevelDefinitions = this.resolutionToolTopLevelDefinitions.filter(res => res.Resolution_ToolTopLevelDefinitionID !== Resolution_ToolTopLevelDefinition.Resolution_ToolTopLevelDefinitionID1);
    //   }
    // }); 

    // this.resolutions = this.resolutions.concat(data.Resolutions);
    // this.linkTheData();
  }

  public async uploadTestDefinition(testDefinition: TestDefinition, endurance: Endurance[]): Promise<void> {
    const payload = { testDefinition, endurance };
    const observable = this.http.post<PostTestDefinition>(this.appConfig.TestDefinitionURL, payload);
    await firstValueFrom(observable);
    await this.getToolsDefinitionData();
    // const data = await firstValueFrom(observable);
    // console.log(data);

    // if(testDefinition.TestDefinitionID === 0){
    //   this.testDefinitions.unshift(data.TestDefinition);
    // } else {
    //   this.endurance = this.endurance.filter(end => end.TestDefinitionID !== testDefinition.TestDefinitionID);
    //   this.testDefinitions = this.testDefinitions.map(test => test.TestDefinitionID === testDefinition.TestDefinitionID ? data.TestDefinition : test);
    // }
    
    // data.Endurance = data.Endurance?.filter(endurance => endurance.EnduranceID != null);
    // this.endurance = this.endurance.concat(data.Endurance);

    // this.linkTheData();
  }

  async uploadTestTemplate(testTemplate: TestTemplate, testDefinitionsIDs: string): Promise<void>{
    const observable = this.http.post<PostTestTemplate>(this.appConfig.TestTemplateURL, { TestTemplate: testTemplate, TestDefinitionsIDs: testDefinitionsIDs });
    await firstValueFrom(observable);
    this.getToolsDefinitionData();
    // const data = await firstValueFrom(observable);
    // console.log(data);

    // if(testTemplate.TestTemplateID === 0){
    //   this.testTemplates.unshift(data.TestTemplate);
    // } else {
    //   this.testTemplates = this.testTemplates.map(template => template.TestTemplateID === testTemplate.TestTemplateID ? data.TestTemplate : template);
    // }

    // data.TestTemplatesDefinitions.forEach(template =>
    // {
    //   if(template.$action === 'INSERT'){
    //     this.testTemplatesDefinitions.unshift(template);
    //   } else if(template.$action === 'DELETE'){
    //     this.testTemplatesDefinitions = this.testTemplatesDefinitions.filter(def => def.TestTemplatesDefinitionID !== template.TestTemplatesDefinitionID1);
    //   }
    // });

    // this.linkTheData();
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

    this.toolMeasurementLevelDefinition.forEach(measurement => {
      const toolTopLevelDefinition = this.toolTopLevelDefinitions.find(toolTopLevelDefinition => toolTopLevelDefinition.ToolTopLevelDefinitionID === measurement.ToolTopLevelDefinitionID);
      const valueUnit = this.MeasurementUnit.find(measurementUnit => measurementUnit.MeasurementUnitID === measurement.ValueUnitID);
      if(valueUnit && toolTopLevelDefinition){
        measurement.ToolTopLevelDefinition = toolTopLevelDefinition;
        toolTopLevelDefinition.ToolMeasurementLevelDefinitions.push(measurement);
        valueUnit.ToolMeasurementLevelDefinition.push(measurement);
        measurement.ValueUnit = valueUnit;
      }
    });

    this.toolLowLevelDefinition.forEach(low => {
      const toolMeasurementLevelDefinition = this.toolMeasurementLevelDefinition.find(toolMeasurementLevelDefinition => toolMeasurementLevelDefinition.ToolMeasurementLevelDefinitionID === low.ToolMeasurementLevelDefinitionID);
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
      const toolLowLevelDefinition = this.toolLowLevelDefinition.find(toolLowLevelDefinition => toolLowLevelDefinition.ToolLowLevelDefinitionID === template.ToolLowLevelDefinitionID);
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
        testDefinition.TestTemplatesDefinitions?.push(definition);
        testTemplate.TestDefinitions.push(testDefinition);
        testTemplate.TestTemplatesDefinitions.push(definition);
      }
    });

    console.log("Data linked");
    console.log(this); 
    
    this.dataSubject.next(true);
  }

  clearTheArrays(){

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
      tool.ToolMeasurementLevelDefinitions = [];
      tool.ResolutionToolTopLevelDefinition = [];
    });

    this.resolutions.forEach(res => {
      res.ToolTopLevelDefinitions = [];
      res.ResolutionToolTopLevelDefinitions = []; 
    });

    this.resolutionToolTopLevelDefinitions.forEach(res => {
      res.Endurance = [];
    });

    this.toolMeasurementLevelDefinition.forEach(measurement => {
      measurement.ToolLowLevelDefinitions = [];
    });

    this.toolLowLevelDefinition.forEach(low => {
      low.TestTemplates = [];
    });

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
    return[...new Set(this.resolutions.map(res => res.Value))].sort();
  }

  getStringNameFromObject(model: Models): string {
    console.log("getStringNameFromObject");
    console.log(model);    
    console.log(model.constructor.name);
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