import { ToolMeasurementLevelDefinition } from "./tool-measurement-level-definition";

export class MeasurementUnit {
    public MeasurementUnitID: number;
    public Symbol: string;

    public ToolMeasurementLevelDefinition : ToolMeasurementLevelDefinition[];

    constructor(Symbol: string, MeasurementUnitID: number = 0) {
        this.MeasurementUnitID = MeasurementUnitID;
        this.Symbol = Symbol;
    }
}
