export class ToolDefinition {
    public ToolDefinitionID: number;
    public ToolLowLevelDefinitionID: number;
    public MeasurementResolutionSingleID: number;
    public TestTemplateID: number;

    constructor(
        ToolLowLevelDefinitionID: number,
        MeasurementResolutionSingleID: number,
        TestTemplateID: number,
        ToolDefinitionID?: number
    ) {
        this.ToolDefinitionID = ToolDefinitionID;
        this.ToolLowLevelDefinitionID = ToolLowLevelDefinitionID;
        this.MeasurementResolutionSingleID = MeasurementResolutionSingleID;
        this.TestTemplateID = TestTemplateID;
    }
}
