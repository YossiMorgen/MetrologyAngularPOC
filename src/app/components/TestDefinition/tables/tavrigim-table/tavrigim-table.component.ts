import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-tavrigim-table',
  templateUrl: './tavrigim-table.component.html',
  styleUrls: ['./tavrigim-table.component.css']
})
export class TavrigimTableComponent {
  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private route: ActivatedRoute,
  ) { }
}
