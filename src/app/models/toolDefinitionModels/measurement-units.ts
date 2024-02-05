export class MeasurementUnits {
    public MeasurementUnitsID: number;
    public Symbol: string;

    constructor(Symbol: string, MeasurementUnitsID?: number) {
        this.MeasurementUnitsID = MeasurementUnitsID;
        this.Symbol = Symbol;
    }
}
