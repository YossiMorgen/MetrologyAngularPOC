import { TestDefinition } from "./test-definition";
import { TestTemplate } from "./test-template";

export class TestTemplatesDefinition {
    
    TestTemplateDefinitionID: number;
    TestTemplateID: number;
    TestDefinitionID: number;

    TestTemplate: TestTemplate;
    TestDefinition: TestDefinition;

    constructor(TestTemplateID: number, TestDefinitionID: number = 0, TestTemplateDefinitionID: number = 0) {
        this.TestTemplateID = TestTemplateID;
        this.TestDefinitionID = TestDefinitionID;
        this.TestTemplateDefinitionID = TestTemplateDefinitionID;
    }
}

export class TestTemplatesDefinitionResponse extends TestTemplatesDefinition {

    $action: 'DELETE' | 'INSERT' | 'UPDATE';
    TestTemplateDefinitionID1: number;

}