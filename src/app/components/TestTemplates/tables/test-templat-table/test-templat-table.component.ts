import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { TestTemplate } from 'src/app/models/TestDefinition/test-template';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-test-templat-table',
  templateUrl: './test-templat-table.component.html',
  styleUrls: ['./test-templat-table.component.css']
})
export class TestTemplatTableComponent implements OnInit {
  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private route: ActivatedRoute,
  ) { }

  public testTemplate: TestTemplate = null;

  public toolLowLevelId: number = null;
  public testTemplates: TestTemplate[] = [];
  
  ngOnInit(): void {
    this.filterTestTemplates();
    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.filterTestTemplates();
    });

    this.route.queryParams.subscribe(params => {
      this.toolLowLevelId = params['toolLowLevelId'];
      this.filterTestTemplates();
    });
  }

  filterTestTemplates(){
    if(this.toolLowLevelId == null){
      this.testTemplates = this.toolsDefinitionService?.testTemplates;
    } else {
      this.testTemplates = this.toolsDefinitionService?.testTemplates?.filter(test => test.ToolLowLevelDefinitionID == this.toolLowLevelId);
    }
  }

  changeTestTemplate(testTemplate: TestTemplate): void {
    this.testTemplate = testTemplate;
  }

  testTemplateDefinitionsToolTip(testTemplate: TestTemplate): string {
    return testTemplate.TestDefinitions.map(test => test.ValueRequired).join(', ');
  }
}
