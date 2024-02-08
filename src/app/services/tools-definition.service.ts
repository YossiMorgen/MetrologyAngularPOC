import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Technology } from '../models/toolDefinitionModels/technology';
import { SubTechnology } from '../models/toolDefinitionModels/sub-technology';
import { IsoProcedure } from '../models/toolDefinitionModels/iso-procedure';
import { ToolTopLevelDefinition } from '../models/toolDefinitionModels/tool-top-level-definition';
import { MeasurementUnit } from '../models/toolDefinitionModels/measurement-unit';
import { ToolMeasurementLevelDefinition } from '../models/toolDefinitionModels/tool-measurement-level-definition';
import { ToolLowLevelDefinition } from '../models/toolDefinitionModels/tool-low-level-definition';
import { HttpClient } from '@angular/common/http';
import { Subject, firstValueFrom } from 'rxjs';

interface ToolDefinitionData {
  Technologies: Technology[];
  SubTechnologies: SubTechnology[];
  IsoProcedures: IsoProcedure[];
  ToolTopLevelDefinitions: ToolTopLevelDefinition[];
  MeasurementUnit: MeasurementUnit[];
  ToolMeasurementLevelDefinition: ToolMeasurementLevelDefinition[];
  ToolLowLevelDefinition: ToolLowLevelDefinition[];
}

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

  public dataSubject: Subject<boolean> = new Subject<boolean>();

  public async getToolsDefinitionData(): Promise<void> {
    const observable = this.http.get<ToolDefinitionData>(this.appConfig.toolDefinitionURL);
    const data = await firstValueFrom(observable);
    console.log(data);
    
    this.technologies = data.Technologies;
    
    this.subTechnologies = data.SubTechnologies.map(subTechnology => { 
      return { ...subTechnology, Technology: this.technologies.find(technology => technology.TechnologyID === subTechnology.TechID) } 
    });

    this.isoProcedure = data.IsoProcedures;

    this.toolTopLevelDefinitions = data.ToolTopLevelDefinitions.map(toolTopLevelDefinition => {
      return { ...toolTopLevelDefinition, 
        SubTechnology: this.subTechnologies.find(subTechnology => subTechnology.SubTechnologyID === toolTopLevelDefinition.SubTechID),
        IsoProcedure: this.isoProcedure.find(isoProcedure => isoProcedure.IsoProcedureID === toolTopLevelDefinition.IsoProcedureID)
      }
    });

    this.MeasurementUnit = data.MeasurementUnit;

    this.toolMeasurementLevelDefinition = data.ToolMeasurementLevelDefinition.map(measurement =>
      { 
        return { ...measurement,
          ToolTopLevelDefinition: this.toolTopLevelDefinitions.find(toolTopLevelDefinition => toolTopLevelDefinition.ToolTopLevelDefinitionID === measurement.ToolTopLevelDefinitionID),
          ValueUnit: this.MeasurementUnit.find(measurementUnit => measurementUnit.MeasurementUnitID === measurement.ValueUnitID),
        }
      }
    );

    this.toolLowLevelDefinition = data.ToolLowLevelDefinition;
    console.log(this.toolLowLevelDefinition);
    this.dataSubject.next(true);
  }

  public async createToolDefinition(toolDef: Technology | 
        SubTechnology | IsoProcedure | ToolTopLevelDefinition | 
        MeasurementUnit | ToolMeasurementLevelDefinition | ToolLowLevelDefinition): Promise<number> {
    
    let cname = toolDef.constructor.name;

    let body = {
      toolDefinitionName : cname,
      payload : toolDef
    }
    const observable = this.http.post<number>(this.appConfig.toolDefinitionURL, body);
    return await firstValueFrom(observable);

  }

  public async updateToolDefinition(toolDef: Technology | 
        SubTechnology | IsoProcedure | ToolTopLevelDefinition | 
        MeasurementUnit | ToolMeasurementLevelDefinition | ToolLowLevelDefinition,
        id: number
    ): Promise<void> {
    
    let cname = toolDef.constructor.name;

    let body = {
      toolDefinitionName : cname,
      payload : toolDef
    }
    const observable = this.http.put(this.appConfig.toolDefinitionURL + "/" + id, body);
    await firstValueFrom(observable);

  }

  public async deleteToolDefinition(model: string,id: number): Promise<void> {
    const observable = this.http.delete(this.appConfig.toolDefinitionURL + "/" + id + "?model=" + model);
    await firstValueFrom(observable);
  }

}
