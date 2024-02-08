export class TestTemplatesDefinitions {
    public TestTemplatesDefinitionsID: number;
    public TestTemplateID: number;
    public TestDefinitionID: number;

    constructor(
        TestTemplateID: number, 
        TestDefinitionID: number, 
        TestTemplatesDefinitionsID?: number
    ) {
        this.TestTemplatesDefinitionsID = TestTemplatesDefinitionsID;
        this.TestTemplateID = TestTemplateID;
        this.TestDefinitionID = TestDefinitionID;
    }
}
