export class IsoProcedure {
    public IsoProcedureID: number; 
    public MCode: number;
    public WordFileLink: string;
    public CertificateText: string;

    constructor(MCode: number, WordFileLink: string, CertificateText: string, IsoProcedureID?: number) {
        this.IsoProcedureID = IsoProcedureID;
        this.MCode = MCode;
        this.WordFileLink = WordFileLink;
        this.CertificateText = CertificateText;
    }
}
