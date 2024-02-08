export class TestType {
    public TestTypeID: number;
    public TestTypeName: string;
    public TestTypeEnum: number;

    constructor(TestTypeName: string, TestTypeEnum: number, TestTypeID?: number) {
        this.TestTypeID = TestTypeID;
        this.TestTypeName = TestTypeName;
        this.TestTypeEnum = TestTypeEnum;
    }
}
