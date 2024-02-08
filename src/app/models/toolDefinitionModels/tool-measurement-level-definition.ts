import { MeasurementUnit } from "./measurement-unit";
import { ToolTopLevelDefinition } from "./tool-top-level-definition";

export class ToolMeasurementLevelDefinition {
    public ToolMeasurementLevelDefinitionID: number;
    public ToolTopLevelDefinitionID: number;
    public ToolTopLevelDefinition: ToolTopLevelDefinition;
    public ValueMin: number;
    public ValueMax: number;
    public ValueUnitID: number;
    public ValueUnit: MeasurementUnit;
    public MCode: number;
    public UncertaintyDelta: number;

    constructor(ToolTopLevelDefinitionID: number, ValueMin: number, ValueMax: number, ValueUnitID: number, MCode: number, ToolMeasurementLevelDefinitionID?: number) {
        this.ToolMeasurementLevelDefinitionID = ToolMeasurementLevelDefinitionID;
        this.ToolTopLevelDefinitionID = ToolTopLevelDefinitionID;
        this.ValueMin = ValueMin;
        this.ValueMax = ValueMax;
        this.ValueUnitID = ValueUnitID;
        this.MCode = MCode;
    }
}
