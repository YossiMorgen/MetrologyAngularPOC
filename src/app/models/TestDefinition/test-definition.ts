export class TestDefinition {
    public TestDefinitionID: number;
    public TestDefinitionName: string;
    public TestTypeID: number;
    public IsIso17025: boolean;
    public ValueMeasurementUnitID: number;
    public ValueRequired: number;
    public ValueUncertainty: number;
    public IsIntact: boolean;
    public IsDisqualify: boolean;
    public Description: string;

    constructor(
        TestDefinitionName: string, 
        TestTypeID: number, 
        IsIso17025: boolean, 
        ValueMeasurementUnitID: number, 
        ValueRequired: number, 
        ValueUncertainty: number, 
        IsIntact: boolean, 
        IsDisqualify: boolean, 
        Description: string, 
        TestDefinitionID?: number
    ) {
        this.TestDefinitionID = TestDefinitionID;
        this.TestDefinitionName = TestDefinitionName;
        this.TestTypeID = TestTypeID;
        this.IsIso17025 = IsIso17025;
        this.ValueMeasurementUnitID = ValueMeasurementUnitID;
        this.ValueRequired = ValueRequired;
        this.ValueUncertainty = ValueUncertainty;
        this.IsIntact = IsIntact;
        this.IsDisqualify = IsDisqualify;
        this.Description = Description;
    }
}
