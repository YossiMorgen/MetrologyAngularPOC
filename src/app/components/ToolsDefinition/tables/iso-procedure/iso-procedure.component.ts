import { Component, OnInit } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { IsoProcedure } from 'src/app/models/toolDefinitionModels/iso-procedure';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-iso-procedure',
  templateUrl: './iso-procedure.component.html',
  styleUrls: ['./iso-procedure.component.css']
})
export class IsoProcedureComponent implements OnInit {
  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private toastService: ToastService
  ) { }

  public isoProcedures: IsoProcedure[] = this.toolsDefinitionService.isoProcedure;

  public toolId: number = null;

  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.isoProcedures = this.toolsDefinitionService.isoProcedure;          
    });
  }

  changeToolId(toolId: number): void {
    this.toolId = toolId;
  }

  async deleteIsoProcedure(toolId: number): Promise<void> {
    const topLevel = this.toolsDefinitionService.toolTopLevelDefinitions.find(topLevel => topLevel.IsoProcedureID === toolId);
    if(topLevel){
      this.toastService.error("אי אפשר למחוק את הנוהל הזה כי הוא בשימוש");
      return;
    }
    try {
      await this.toolsDefinitionService.deleteToolDefinition("IsoProcedure", toolId);
      this.toolsDefinitionService.isoProcedure = this.toolsDefinitionService.isoProcedure.filter(isoProcedure => isoProcedure.IsoProcedureID !== toolId);
      this.toolsDefinitionService.dataSubject.next(true);
      this.toastService.success(" נוהל נמחק בהצלחה :)");
    } catch (error: any) {
      this.toastService.error(error);
    }
  }
}
 