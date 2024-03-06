import { ToolMeasurementLevelDefinition } from "./tool-measurement-level-definition";
import { ToolTopLevelDefinition } from "./tool-top-level-definition";

export class ToolFamilyLevelDefinition {
    public ToolFamilyLevelDefinitionID: number;
    public ToolFamilyLevelDefinitionName: string;
    public ToolTopLevelDefinitionID: number;

    public ToolTopLevelDefinition: ToolTopLevelDefinition;
    public ToolMeasurementLevelDefinitions: ToolMeasurementLevelDefinition[] = [];
    
    constructor(
        ToolFamilyLevelDefinitionName: string,
        ToolTopLevelDefinitionID: number,
        ToolFamilyLevelDefinitionID?: number
    ) {
        this.ToolFamilyLevelDefinitionID = ToolFamilyLevelDefinitionID;
        this.ToolFamilyLevelDefinitionName = ToolFamilyLevelDefinitionName;
        this.ToolTopLevelDefinitionID = ToolTopLevelDefinitionID;
    }
    
}
