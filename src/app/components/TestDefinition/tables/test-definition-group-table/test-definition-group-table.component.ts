import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { TestDefinitionGroup } from 'src/app/models/TestDefinition/test-definition-group';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';
import { TestDefinitionGroupFormComponent } from '../../forms/test-definition-group-form/test-definition-group-form.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test-definition-group-table',
  templateUrl: './test-definition-group-table.component.html',
  styleUrls: ['./test-definition-group-table.component.css']
})
export class TestDefinitionGroupTableComponent implements OnInit {
  @ViewChild('child') child: TestDefinitionGroupFormComponent;

  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) { }


  public testDefinitionGroup: TestDefinitionGroup = null;

  public toolTopId: number = null;
  public testDefinitionGroups: TestDefinitionGroup[] = this.toolsDefinitionService.testDefinitionGroups;

  ngOnInit(): void {
    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.setTestDefinitionGroups();
    });
    this.route.params.subscribe(params => {
      this.toolTopId = +params['id'];
      this.setTestDefinitionGroups();
    });
    this.setTestDefinitionGroups();
  }

  setTestDefinitionGroups(): void {
    if(this.toolTopId ){
      this.testDefinitionGroups = this.toolsDefinitionService.testDefinitionGroups?.filter(x => x.ToolTopLevelDefinitionID == this.toolTopId);
    } else {
      this.testDefinitionGroups = this.toolsDefinitionService.testDefinitionGroups;
    }
  }

  changeTestDefinitionGroup(testDefinitionGroup: TestDefinitionGroup): void {
    this.testDefinitionGroup = testDefinitionGroup;
  }

}
