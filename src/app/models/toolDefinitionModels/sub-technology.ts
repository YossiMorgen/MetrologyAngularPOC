import { Technology } from "./technology";

export class SubTechnology {
    public SubTechnologyID: number;
    public SubTechnologyName: string;
    public MCode: number;
    public TechID: number;
    public Technology: Technology;

    constructor(
        SubTechnologyName: string,
        MCode: number,
        TechID: number
    ) {
        this.SubTechnologyName = SubTechnologyName;
        this.MCode = MCode;
        this.TechID = TechID;
    }
}
