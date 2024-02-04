export class Technology {
    public TechnologyID: number;
    public TechnologyName: string;
    public MCode: number;

    constructor(TechnologyName: string, MCode: number) {
        this.TechnologyName = TechnologyName;
        this.MCode = MCode;
    }
}
