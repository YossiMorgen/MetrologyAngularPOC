import { ToolMeasurementLevelDefinition } from "./tool-measurement-level-definition";

export class MeasurementUnit {
    public MeasurementUnitID: number;
    public Symbol: string;

    public ToolMeasurementLevelDefinition : ToolMeasurementLevelDefinition[];

    constructor(Symbol: string, MeasurementUnitID?: number) {
        this.MeasurementUnitID = MeasurementUnitID;
        this.Symbol = Symbol;
    }
}
