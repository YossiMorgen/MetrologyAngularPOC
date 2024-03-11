import { ResolutionToolTopLevelDefinition } from "./resolution-tool-top-level-definition";
import { TestDefinition } from "./test-definition";

export class Endurance {
    
    EnduranceID: number;
    TestDefinitionID: number;
    TestDefinition: TestDefinition;
    
    Resolution_ToolTopLevelDefinitionID: number;
    Resolution_ToolTopLevelDefinition: ResolutionToolTopLevelDefinition
    ValueEnduranceUp: number;
    ValueEnduranceDown: number;

    constructor(
        TestDefinitionID: number, 
        Resolution_ToolTopLevelDefinitionID: number, 
        ValueEnduranceUp: number, 
        ValueEnduranceDown: number,
        TestDefinition?: TestDefinition,
        Resolution_ToolTopLevelDefinition?: ResolutionToolTopLevelDefinition, 
        EnduranceID?: number,
    ) {
        this.TestDefinitionID = TestDefinitionID || 0;
        this.Resolution_ToolTopLevelDefinitionID = Resolution_ToolTopLevelDefinitionID || 0;
        this.ValueEnduranceUp = ValueEnduranceUp;
        this.ValueEnduranceDown = ValueEnduranceDown;
        this.TestDefinition = TestDefinition;
        this.Resolution_ToolTopLevelDefinition = Resolution_ToolTopLevelDefinition;
        this.EnduranceID = EnduranceID || 0;
    }
}
