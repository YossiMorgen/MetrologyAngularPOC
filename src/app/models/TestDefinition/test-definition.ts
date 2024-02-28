import { Endurance } from "./endurance";
import { TestDefinitionGroup } from "./test-definition-group";
import { TestTemplate } from "./test-template";
import { TestTemplatesDefinition } from "./test-templates-definition";

export class TestDefinition {

    TestDefinitionID: number;
    TestDefinitionName: string;
    TestDefinitionGroupID: number;
    TestDefinitionGroup: TestDefinitionGroup;
    ValueRequired: number;
    ValueUncertainty: number;
    Endurance: Endurance[] = [];

    TestTemplates: TestTemplate[] = [];
    TestTemplatesDefinitions: TestTemplatesDefinition[] = [];

    constructor(
        TestDefinitionName: string, 
        TestDefinitionGroupID: number, 
        ValueRequired: number, 
        ValueUncertainty: number, 
        TestDefinitionID?: number
    ) {
        this.TestDefinitionName = TestDefinitionName;
        this.TestDefinitionGroupID = TestDefinitionGroupID;
        this.ValueRequired = ValueRequired;
        this.ValueUncertainty = ValueUncertainty;
        this.TestDefinitionID = TestDefinitionID;
    }
}
