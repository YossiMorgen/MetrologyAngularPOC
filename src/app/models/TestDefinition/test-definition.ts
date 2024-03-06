import { Endurance } from "./endurance";
import { TestDefinitionGroup } from "./test-definition-group";
import { TestTemplate } from "./test-template";
import { TestTemplatesDefinition } from "./test-templates-definition";



export class TestDefinition {

    public TestDefinitionID: number;
    public TestDefinitionName: string;
    public TestDefinitionGroupID: number;
    public TestDefinitionGroup: TestDefinitionGroup;
    public ValueRequired: number;
    public ValueUncertainty: number;
    public IsIso17025: boolean;
    public Endurance: Endurance[] = [];

    public TestTemplates: TestTemplate[] = [];
    public TestTemplatesDefinitions: TestTemplatesDefinition[] = [];

    constructor(
        TestDefinitionName: string, 
        TestDefinitionGroupID: number, 
        ValueRequired: number, 
        ValueUncertainty: number, 
        IsIso17025: boolean = true,
        TestDefinitionID?: number
    ) {
        this.TestDefinitionName = TestDefinitionName;
        this.TestDefinitionGroupID = TestDefinitionGroupID;
        this.ValueRequired = ValueRequired;
        this.ValueUncertainty = ValueUncertainty;
        this.IsIso17025 = IsIso17025;
        this.TestDefinitionID = TestDefinitionID;
    }
}
