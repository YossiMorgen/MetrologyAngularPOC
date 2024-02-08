export class MeasurementResolutionSet {

    public MeasurementResolutionSetID: number;
    public TestDefinitionID: number;

    constructor(
        MeasurementResolutionSetID: number,
        TestDefinitionID: number
    ) {
        this.MeasurementResolutionSetID = MeasurementResolutionSetID;
        this.TestDefinitionID = TestDefinitionID;
    }
}
