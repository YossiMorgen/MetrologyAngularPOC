import { ToolTopLevelDefinition } from "../toolDefinitionModels/tool-top-level-definition";
import { TestDefinition } from "./test-definition";

export enum DeviationCalcTypeEnum {
    AVG = "AVG",
    MAX = "MAX",
    MIN = "MIN"
}    

export class TestDefinitionGroup {
    
    public TestDefinitionGroupID: number;
    public TestDefinitionGroupName: string;
    public ToolTopLevelDefinitionID: number;
    public ToolTopLevelDefinition: ToolTopLevelDefinition;
    public TestDefinitions: TestDefinition[] = [];
    public DeviationCalcType: DeviationCalcTypeEnum;

    constructor(
        TestDefinitionGroupName: string, 
        ToolTopLevelDefinitionID: number = 0, 
        TestDefinitionGroupID: number = 0,
        DeviationCalcType: DeviationCalcTypeEnum = DeviationCalcTypeEnum.AVG,
    ) {
        this.TestDefinitionGroupName = TestDefinitionGroupName;
        this.ToolTopLevelDefinitionID = ToolTopLevelDefinitionID;
        this.TestDefinitionGroupID = TestDefinitionGroupID;
        this.DeviationCalcType = DeviationCalcType;
    }
}
