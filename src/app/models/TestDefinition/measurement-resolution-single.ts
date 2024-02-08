export class MeasurementResolutionSingle {
    public MeasurementResolutionSingleID: number;
    public Resolution: number;
    public ValueEnduranceUp: number;
    public ValueEnduranceDown: number;
    public MeasurementResolutionSetID: number;

    constructor(
        Resolution: number, 
        ValueEnduranceUp: number, 
        ValueEnduranceDown: number, 
        MeasurementResolutionSetID: number,
        MeasurementResolutionSingleID?: number
    ) {
        this.MeasurementResolutionSingleID = MeasurementResolutionSingleID;
        this.Resolution = Resolution;
        this.ValueEnduranceUp = ValueEnduranceUp;
        this.MeasurementResolutionSetID = MeasurementResolutionSetID;
        this.ValueEnduranceDown = ValueEnduranceDown;
    }
}
