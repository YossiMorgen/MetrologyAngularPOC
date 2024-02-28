import { ToolTopLevelDefinition } from "../toolDefinitionModels/tool-top-level-definition";
import { TestDefinition } from "./test-definition";

export class TestDefinitionGroup {
    
    public TestDefinitionGroupID: number;
    public TestDefinitionGroupName: string;
    public ToolTopLevelDefinitionID: number;
    public ToolTopLevelDefinition: ToolTopLevelDefinition;
    public TestDefinitions: TestDefinition[] = [];

    constructor(TestDefinitionGroupName: string, ToolTopLevelDefinitionID: number, TestDefinitionGroupID?: number) {
        this.TestDefinitionGroupName = TestDefinitionGroupName;
        this.ToolTopLevelDefinitionID = ToolTopLevelDefinitionID;
        this.TestDefinitionGroupID = TestDefinitionGroupID;
    }
}
