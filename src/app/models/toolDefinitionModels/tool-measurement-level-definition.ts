import { ToolFamilyLevelDefinition } from "./tool-family-level-definition";
import { MeasurementUnit } from "./measurement-unit";
import { ToolLowLevelDefinition } from "./tool-low-level-definition";

export class ToolMeasurementLevelDefinition {
    public ToolMeasurementLevelDefinitionID: number;
    public ToolFamilyLevelDefinitionID: number;
    public ToolFamilyLevelDefinition: ToolFamilyLevelDefinition;
    public ValueMin: number;
    public ValueMax: number;
    public ValueUnitID: number;
    public ValueUnit: MeasurementUnit;
    public MCode: number;
    public UncertaintyDelta: number;

    public ToolLowLevelDefinitions : ToolLowLevelDefinition[] = [];

    constructor(
        ToolFamilyLevelDefinitionID: number, 
        ValueMin: number, ValueMax: number, 
        ValueUnitID: number, 
        MCode: number, 
        ToolMeasurementLevelDefinitionID?: number
    ) {
        this.ToolMeasurementLevelDefinitionID = ToolMeasurementLevelDefinitionID;
        this.ToolFamilyLevelDefinitionID = ToolFamilyLevelDefinitionID;
        this.ValueMin = ValueMin;
        this.ValueMax = ValueMax;
        this.ValueUnitID = ValueUnitID;
        this.MCode = MCode;
    }
}
