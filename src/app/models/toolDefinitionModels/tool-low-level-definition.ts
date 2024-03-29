import { TestTemplate } from "../TestDefinition/test-template";
import { MeasurementUnit } from "./measurement-unit";
import { ToolMeasurementLevelDefinition } from "./tool-measurement-level-definition";

export class CovertOpsJsonToolJsons {
    order: number;
    name: string;
    key: string;
    value: number;
}

export class ToolLowLevelDefinition {
    public ToolLowLevelDefinitionID: number;
    public ToolLowLevelDefinitionName: string;
    public MCode: number;
    public ToolMeasurementLevelDefinitionID: number;
    public ToolMeasurementLevelDefinition: ToolMeasurementLevelDefinition;
    public ValueMin: number;
    public ValueMax: number;
    
    public CovertOpsJsonTool: string;
    public CovertOpsJsonToolJson: CovertOpsJsonToolJsons[];

    public TestTemplates: TestTemplate[] = [];

    constructor(
        MCode: number, 
        ToolMeasurementLevelDefinitionID: number, 
        ValueMin: number, 
        ValueMax: number, 
        ToolLowLevelDefinitionName: string = "",
        ToolLowLevelDefinitionID?: number,
        CovertOpsJsonTool: string = "",
    ) {
        this.ToolLowLevelDefinitionID = ToolLowLevelDefinitionID;
        this.ToolLowLevelDefinitionName = ToolLowLevelDefinitionName;
        this.MCode = MCode;
        this.ToolMeasurementLevelDefinitionID = ToolMeasurementLevelDefinitionID;
        this.ValueMin = ValueMin;
        this.ValueMax = ValueMax;
        this.CovertOpsJsonTool = CovertOpsJsonTool;
        this.CovertOpsJsonToolJson = CovertOpsJsonTool ?  JSON.parse(CovertOpsJsonTool) : {};
    }
}
