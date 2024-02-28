import { ToolTopLevelDefinition } from "../toolDefinitionModels/tool-top-level-definition";
import { Endurance } from "./endurance";
import { ResolutionToolTopLevelDefinition } from "./resolution-tool-top-level-definition";

export class Resolution {
    ResolutionID: number;
    Value: number;

    ResolutionToolTopLevelDefinitions: ResolutionToolTopLevelDefinition[] = [];
    ToolTopLevelDefinitions: ToolTopLevelDefinition[] = [];

    constructor(Value: number, ResolutionID?: number) {
        this.Value = Value;
        this.ResolutionID = ResolutionID;
    }
}
