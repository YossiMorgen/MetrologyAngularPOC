import { Resolution } from "../TestDefinition/resolution";
import { ResolutionToolTopLevelDefinition } from "../TestDefinition/resolution-tool-top-level-definition";
import { TestDefinitionGroup } from "../TestDefinition/test-definition-group";
import { IsoProcedure } from "./iso-procedure";
import { MeasurementUnit } from "./measurement-unit";
import { SubTechnology } from "./sub-technology";
import { ToolFamilyLevelDefinition } from "./tool-family-level-definition";

export class ToolTopLevelDefinition {
    public ToolTopLevelDefinitionID: number;
    public ToolTopLevelDefinitionName: string;
    public SubTechID: number;
    public SubTechnology: SubTechnology;
    
    public ValueUnitID: number;
    public MeasurementUnit: MeasurementUnit;
    public IsoProcedure: IsoProcedure;
    
    public Resolutions: Resolution[] = [];
    public TestDefinitionGroups: TestDefinitionGroup[] = [];
    public ToolFamilyLevelDefinitions: ToolFamilyLevelDefinition[] = [];
    public ResolutionToolTopLevelDefinition: ResolutionToolTopLevelDefinition[] = [];

    constructor(
        ToolTopLevelDefinitionName: string, 
        SubTechID: number, 
        ToolTopLevelDefinitionID?: number,
        ValueUnitID: number = 0,
    ) {
        this.ToolTopLevelDefinitionID = ToolTopLevelDefinitionID;
        this.ToolTopLevelDefinitionName = ToolTopLevelDefinitionName;
        this.SubTechID = SubTechID;
        this.ValueUnitID = ValueUnitID;
    }
}
