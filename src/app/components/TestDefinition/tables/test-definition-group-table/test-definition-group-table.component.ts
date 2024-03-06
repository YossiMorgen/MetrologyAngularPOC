import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { TestDefinitionGroup } from 'src/app/models/TestDefinition/test-definition-group';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';
import { TestDefinitionGroupFormComponent } from '../../forms/test-definition-group-form/test-definition-group-form.component';

@Component({
  selector: 'app-test-definition-group-table',
  templateUrl: './test-definition-group-table.component.html',
  styleUrls: ['./test-definition-group-table.component.css']
})
export class TestDefinitionGroupTableComponent implements OnInit {
  triggerChanges: boolean = false;
  @ViewChild('child') child: TestDefinitionGroupFormComponent;

  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private toastService: ToastService
  ) { }

  public testDefinitionGroups: TestDefinitionGroup[] = this.toolsDefinitionService.testDefinitionGroups;

  public testDefinitionGroup: TestDefinitionGroup = null;

  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.testDefinitionGroups = this.toolsDefinitionService.testDefinitionGroups;
    });
  }

  changeTestDefinitionGroup(testDefinitionGroup: TestDefinitionGroup): void {
    this.testDefinitionGroup = testDefinitionGroup;
    if(this.testDefinitionGroup = testDefinitionGroup){
      this.triggerChanges = !this.triggerChanges;
    }
  }

}
