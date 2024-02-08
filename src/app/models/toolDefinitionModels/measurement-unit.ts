export class MeasurementUnit {
    public MeasurementUnitID: number;
    public Symbol: string;

    constructor(Symbol: string, MeasurementUnitID?: number) {
        this.MeasurementUnitID = MeasurementUnitID;
        this.Symbol = Symbol;
    }
}
