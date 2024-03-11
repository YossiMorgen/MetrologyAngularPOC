import { ToolLowLevelDefinition } from "../toolDefinitionModels/tool-low-level-definition";
import { TestDefinition } from "./test-definition";
import { TestTemplatesDefinition } from "./test-templates-definition";

export class TestTemplate {
    
    TestTemplateID: number;
    TestTemplateName: string;
    
    ToolLowLevelDefinitionID: number;
    ToolLowLevelDefinition: ToolLowLevelDefinition;

    TestTemplatesDefinitions: TestTemplatesDefinition[] = [];
    TestDefinitions: TestDefinition[] = [];

    constructor(TestTemplateName: string, ToolLowLevelDefinitionID: number = 0, TestTemplateID: number = 0) {
        this.TestTemplateName = TestTemplateName;
        this.ToolLowLevelDefinitionID = ToolLowLevelDefinitionID;
        this.TestTemplateID = TestTemplateID;
    }
}
