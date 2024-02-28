import { TestTemplate } from "../TestDefinition/test-template";
import { MeasurementUnit } from "./measurement-unit";
import { ToolMeasurementLevelDefinition } from "./tool-measurement-level-definition";

export class ToolLowLevelDefinition {
    public ToolLowLevelDefinitionID: number;
    public MCode: number;
    public ToolMeasurementLevelDefinitionID: number;
    public ToolMeasurementLevelDefinition: ToolMeasurementLevelDefinition;
    public ValueMin: number;
    public ValueMax: number;

    public TestTemplates: TestTemplate[] = [];

    constructor(
        MCode: number, 
        ToolMeasurementLevelDefinitionID: number, 
        ValueMin: number, 
        ValueMax: number, 
        ToolLowLevelDefinitionID?: number
    ) {
        this.ToolLowLevelDefinitionID = ToolLowLevelDefinitionID;
        this.MCode = MCode;
        this.ToolMeasurementLevelDefinitionID = ToolMeasurementLevelDefinitionID;
        this.ValueMin = ValueMin;
        this.ValueMax = ValueMax;
    }
}
