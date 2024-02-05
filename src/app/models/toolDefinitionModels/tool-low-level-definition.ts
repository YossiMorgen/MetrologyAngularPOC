import { MeasurementUnits } from "./measurement-units";
import { ToolMeasurementLevelDefinition } from "./tool-measurement-level-definition";

export class ToolLowLevelDefinition {
    public ToolLowLevelDefinitionID: number;
    public MCode: number;
    public ToolMeasurementLevelDefinitionID: number;
    public ToolMeasurementLevelDefinition: ToolMeasurementLevelDefinition;
    public ValueMin: number;
    public ValueMax: number;
    public ValueUnitID: number;
    public ValueUnit: MeasurementUnits;

    constructor(
        MCode: number, 
        ToolMeasurementLevelDefinitionID: number, 
        ValueUnitID: number,
        ValueMin: number, 
        ValueMax: number, 
        ToolLowLevelDefinitionID?: number
    ) {
        this.ToolLowLevelDefinitionID = ToolLowLevelDefinitionID;
        this.MCode = MCode;
        this.ToolMeasurementLevelDefinitionID = ToolMeasurementLevelDefinitionID;
        this.ValueMin = ValueMin;
        this.ValueMax = ValueMax;
        this.ValueUnitID = ValueUnitID;
    }
}
