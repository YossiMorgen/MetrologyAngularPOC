import { Resolution } from "../TestDefinition/resolution";
import { ResolutionToolTopLevelDefinition } from "../TestDefinition/resolution-tool-top-level-definition";
import { TestDefinitionGroup } from "../TestDefinition/test-definition-group";
import { IsoProcedure } from "./iso-procedure";
import { SubTechnology } from "./sub-technology";
import { ToolMeasurementLevelDefinition } from "./tool-measurement-level-definition";

export class ToolTopLevelDefinition {
    public ToolTopLevelDefinitionID: number;
    public ToolTopLevelDefinitionName: string;
    public SubTechID: number;
    public SubTechnology: SubTechnology;

    public IsoProcedure: IsoProcedure;
    
    public Resolutions: Resolution[] = [];
    public TestDefinitionGroups: TestDefinitionGroup[] = [];
    public ToolMeasurementLevelDefinitions: ToolMeasurementLevelDefinition[] = [];
    public ResolutionToolTopLevelDefinition: ResolutionToolTopLevelDefinition[] = [];

    constructor(ToolTopLevelDefinitionName: string, SubTechID: number, ToolTopLevelDefinitionID?: number) {
        this.ToolTopLevelDefinitionID = ToolTopLevelDefinitionID;
        this.ToolTopLevelDefinitionName = ToolTopLevelDefinitionName;
        this.SubTechID = SubTechID;

    }
}
