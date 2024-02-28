import { Technology } from "./technology";
import { ToolTopLevelDefinition } from "./tool-top-level-definition";

export class SubTechnology {
    public SubTechnologyID: number;
    public SubTechnologyName: string;
    public MCode: number;
    public TechID: number;
    public Technology: Technology;
    
    public ToolTopLevelDefinitions: ToolTopLevelDefinition[] = [];
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
