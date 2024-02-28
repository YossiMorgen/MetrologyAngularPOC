import { ToolTopLevelDefinition } from "../toolDefinitionModels/tool-top-level-definition";
import { Endurance } from "./endurance";
import { Resolution } from "./resolution";

export class ResolutionToolTopLevelDefinition {
    
    Resolution_ToolTopLevelDefinitionID: number;
    ResolutionID: number;
    Resolution: Resolution;
    
    ToolTopLevelDefinitionID: number;
    ToolTopLevelDefinition: ToolTopLevelDefinition;

    Endurance: Endurance[] = [];

    constructor(
        ResolutionID: number, 
        ToolTopLevelDefinitionID: number, 
        Resolution?: Resolution,
        ToolTopLevelDefinition?: ToolTopLevelDefinition,
        Resolution_ToolTopLevelDefinitionID?: number
    ) {
        this.ResolutionID = ResolutionID;
        this.ToolTopLevelDefinitionID = ToolTopLevelDefinitionID;
        this.Resolution_ToolTopLevelDefinitionID = Resolution_ToolTopLevelDefinitionID;
    }
}


export class ResolutionToolTopLevelDefinitionResponse extends ResolutionToolTopLevelDefinition {

    $action: 'DELETE' | 'INSERT' | 'UPDATE';
    Resolution_ToolTopLevelDefinitionID1: number;

}