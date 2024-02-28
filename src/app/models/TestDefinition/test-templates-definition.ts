import { TestDefinition } from "./test-definition";
import { TestTemplate } from "./test-template";

export class TestTemplatesDefinition {
    
    TestTemplatesDefinitionID: number;
    TestTemplateID: number;
    TestDefinitionID: number;

    TestTemplate: TestTemplate;
    TestDefinition: TestDefinition;

    constructor(TestTemplateID: number, TestDefinitionID: number, TestTemplatesDefinitionID?: number) {
        this.TestTemplateID = TestTemplateID;
        this.TestDefinitionID = TestDefinitionID;
        this.TestTemplatesDefinitionID = TestTemplatesDefinitionID;
    }
}

export class TestTemplatesDefinitionResponse extends TestTemplatesDefinition {

    $action: 'DELETE' | 'INSERT' | 'UPDATE';
    TestTemplatesDefinitionID1: number;

}