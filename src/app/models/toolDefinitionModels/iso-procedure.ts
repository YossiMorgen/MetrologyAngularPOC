export class IsoProcedure {
    public IsoProcedureID: number; 
    public MCode: number;
    public WordFileLink: string;
    public CertificateText: string;
    public Description: string;

    constructor(MCode: number, WordFileLink: string, CertificateText: string, Description: string, IsoProcedureID?: number) {
        this.IsoProcedureID = IsoProcedureID;
        this.MCode = MCode;
        this.WordFileLink = WordFileLink;
        this.CertificateText = CertificateText;
        this.Description = Description;
    }
}
