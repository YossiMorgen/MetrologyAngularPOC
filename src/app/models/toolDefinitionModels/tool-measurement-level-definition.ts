import { MeasurementUnits } from "./measurement-units";
import { ToolTopLevelDefinition } from "./tool-top-level-definition";

export class ToolMeasurementLevelDefinition {
    public ToolMeasurementLevelDefinitionID: number;
    public ToolTopLevelDefinitionID: number;
    public ToolTopLevelDefinition: ToolTopLevelDefinition;
    public ValueMin: number;
    public ValueMax: number;
    public ValueUnitID: number;
    public ValueUnit: MeasurementUnits;
    public MCode: number;
    public UncertaintyDelta: number;
    public UncertaintyUnitID: number;
    public UncertaintyUnit: MeasurementUnits;

    constructor(ToolTopLevelDefinitionID: number, ValueMin: number, ValueMax: number, ValueUnitID: number, MCode: number, UncertaintyDelta: number, UncertaintyUnitID: number, ToolMeasurementLevelDefinitionID?: number) {
        this.ToolMeasurementLevelDefinitionID = ToolMeasurementLevelDefinitionID;
        this.ToolTopLevelDefinitionID = ToolTopLevelDefinitionID;
        this.ValueMin = ValueMin;
        this.ValueMax = ValueMax;
        this.ValueUnitID = ValueUnitID;
        this.MCode = MCode;
        this.UncertaintyDelta = UncertaintyDelta;
        this.UncertaintyUnitID = UncertaintyUnitID;
    }
}
