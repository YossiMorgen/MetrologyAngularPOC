import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tools-definition',
  templateUrl: './tools-definition.component.html',
  styleUrls: ['./tools-definition.component.css']
})
export class ToolsDefinitionComponent {

  constructor(
    private route: ActivatedRoute, 
    private router: Router
  ) { }
}
