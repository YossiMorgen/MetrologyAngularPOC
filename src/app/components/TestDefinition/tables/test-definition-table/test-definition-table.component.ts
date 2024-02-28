import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { Endurance } from 'src/app/models/TestDefinition/endurance';
import { TestDefinition } from 'src/app/models/TestDefinition/test-definition';
import { TestDefinitionGroup } from 'src/app/models/TestDefinition/test-definition-group';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-test-definition-table',
  templateUrl: './test-definition-table.component.html',
  styleUrls: ['./test-definition-table.component.css']
})
export class TestDefinitionTableComponent implements OnInit, OnChanges{
  @Input() testDefinitionGroup: TestDefinitionGroup;
  public testDefinition: TestDefinition = null;
  public testDefinitions: TestDefinition[];

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private toastService: ToastService
  ) { }


  ngOnInit(): void {
    this.sortTestDefinitions();
    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.sortTestDefinitions();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('testDefinitionGroup form changes');
    
    this.sortTestDefinitions();
  }

  sortTestDefinitions(): void {
    this.testDefinitions = this.toolsDefinitionService.testDefinitions
    .filter(testDefinition => testDefinition.TestDefinitionGroupID === this.testDefinitionGroup.TestDefinitionGroupID)
    .sort((a, b) => a.ValueRequired - b.ValueRequired);
  }

  changeTestDefinitionID(testDefinition: TestDefinition): void {
    this.testDefinition = testDefinition;
  }

  getEnduranceByResolution(resolution: number, Endurance: Endurance[]): number | string {
    console.log('Endurance', Endurance);
    console.log('resolution', resolution);
    
    
    return Endurance.find(endurance => endurance?.Resolution_ToolTopLevelDefinition?.Resolution?.Value === resolution)?.ValueEnduranceUp || '0';
  }


}
