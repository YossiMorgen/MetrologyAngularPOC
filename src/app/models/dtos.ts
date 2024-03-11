import { MeasurementUnit } from "./toolDefinitionModels/measurement-unit";
import { Technology } from "./toolDefinitionModels/technology";
import { Resolution } from '../models/TestDefinition/resolution';
import { ResolutionToolTopLevelDefinition, ResolutionToolTopLevelDefinitionResponse } from '../models/TestDefinition/resolution-tool-top-level-definition';
import { TestDefinitionGroup } from '../models/TestDefinition/test-definition-group';
import { Endurance } from '../models/TestDefinition/endurance';
import { TestTemplate } from '../models/TestDefinition/test-template';
import { TestTemplatesDefinition, TestTemplatesDefinitionResponse } from '../models/TestDefinition/test-templates-definition';
import { TestDefinition } from '../models/TestDefinition/test-definition';
import { ToolFamilyLevelDefinition } from '../models/toolDefinitionModels/tool-family-level-definition';
import { SubTechnology } from "./toolDefinitionModels/sub-technology";
import { IsoProcedure } from "./toolDefinitionModels/iso-procedure";
import { ToolTopLevelDefinition } from "./toolDefinitionModels/tool-top-level-definition";
import { ToolMeasurementLevelDefinition } from "./toolDefinitionModels/tool-measurement-level-definition";
import { ToolLowLevelDefinition } from "./toolDefinitionModels/tool-low-level-definition";

export interface ToolDefinitionData {
    MeasurementUnits: MeasurementUnit[];
    Technologies: Technology[];
    SubTechnologies: SubTechnology[];
    IsoProcedures: IsoProcedure[];
    ToolTopLevelDefinitions: ToolTopLevelDefinition[];
    ToolFamilyLevelDefinitions: ToolFamilyLevelDefinition[];
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

export interface PostToolTopLevelDefinition
{
    ToolTopLevelDefinition: ToolTopLevelDefinition;
    SValues: string;
    IsoProcedure: IsoProcedure;
}

export interface PostToolTopLevelDefinitionResult
{
ToolTopLevelDefinition: ToolTopLevelDefinition;
Resolution_ToolTopLevelDefinitions: ResolutionToolTopLevelDefinitionResponse[];
Resolutions: Resolution[];
IsoProcedure: IsoProcedure;
}

export interface PostTestDefinition{
TestDefinition: TestDefinition;
Endurance: Endurance[];
}

export interface PostTestTemplate {
TestTemplate: TestTemplate;
TestDefinitionsIDs: string;
TestTemplatesDefinitions: TestTemplatesDefinitionResponse[];
}

export type Models = Technology | 
MeasurementUnit | SubTechnology | IsoProcedure | ToolTopLevelDefinition | 
ToolFamilyLevelDefinition | ToolMeasurementLevelDefinition | ToolLowLevelDefinition |
Resolution | ResolutionToolTopLevelDefinition | TestDefinitionGroup |
TestDefinition | Endurance | TestTemplate | TestTemplatesDefinition;
  
export interface PostGroupAndTestDefAndEndurance {
    TestDefinitionGroup: TestDefinitionGroup;
    TestDefinition: TestDefinition;
    TestTemplate: TestTemplate;
    Endurance: Endurance;
}

export interface PostTavrig{
    ToolLowLevelDefinition: ToolLowLevelDefinition;
    PostGroupAndTestDefAndEndurance: PostGroupAndTestDefAndEndurance[];
}