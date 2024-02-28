import { SubTechnology } from "./sub-technology";

export class Technology {
    public TechnologyID: number;
    public TechnologyName: string;
    public MCode: number;

    public SubTechnologies: SubTechnology[] = [];

    constructor(TechnologyName: string, MCode: number) {
        this.TechnologyName = TechnologyName;
        this.MCode = MCode;
    }
}
