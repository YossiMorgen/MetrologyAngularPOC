import { IsoProcedure } from "./iso-procedure";
import { SubTechnology } from "./sub-technology";

export class ToolTopLevelDefinition {
    public ToolTopLevelDefinitionID: number;
    public ToolTopLevelDefinitionName: string;
    public SubTechID: number;
    public SubTechnology: SubTechnology;
    public IsoProcedureID: number;
    public IsoProcedure: IsoProcedure;

    constructor(ToolTopLevelDefinitionName: string, SubTechID: number, IsoProcedureID: number, ToolTopLevelDefinitionID?: number) {
        this.ToolTopLevelDefinitionID = ToolTopLevelDefinitionID;
        this.ToolTopLevelDefinitionName = ToolTopLevelDefinitionName;
        this.SubTechID = SubTechID;
        this.IsoProcedureID = IsoProcedureID;
    }
}
