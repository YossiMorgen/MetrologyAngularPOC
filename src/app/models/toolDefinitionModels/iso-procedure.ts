import { ToolTopLevelDefinition } from "./tool-top-level-definition";

export class IsoProcedure {
    public IsoProcedureID: number; 
    public MCode: number;
    public WordFileLink: string;
    public CertificateText: string;
    public Description: string;

    public ToolTopLevelDefinitionID: number;
    // public ToolTopLevelDefinition: ToolTopLevelDefinition;

    constructor(
        MCode: number, 
        WordFileLink: string, 
        CertificateText: string, 
        Description: string, 
        ToolTopLevelDefinitionID: number = 0, 
        IsoProcedureID: number = 0
    ) {
        this.IsoProcedureID = IsoProcedureID;
        this.MCode = MCode;
        this.WordFileLink = WordFileLink;
        this.CertificateText = CertificateText;
        this.Description = Description;
        this.ToolTopLevelDefinitionID = ToolTopLevelDefinitionID;
    }
}
