import { Component, OnInit } from '@angular/core';
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
    private toastService: ToastService
  ) { }

  public testTemplate: TestTemplate = null;
  public testTemplates: TestTemplate[] = [];
  
  ngOnInit(): void {
    this.testTemplates = this.toolsDefinitionService.testTemplates?.filter(test => test.TestDefinitions.length > 0);
    this.toolsDefinitionService.dataSubject.subscribe(() => {
      this.testTemplates = this.toolsDefinitionService.testTemplates.filter(test => test.TestDefinitions.length > 0);
    });
  }

  changeTestTemplate(testTemplate: TestTemplate): void {
    this.testTemplate = testTemplate;
  }

  testTemplateDefinitionsToolTip(testTemplate: TestTemplate): string {
    return testTemplate.TestDefinitions.map(test => test.ValueRequired).join(', ');
  }
  

  // async deleteTestTemplate(testTemplate: TestTemplate): Promise<void> {
  //   try {
  //     await this.toolsDefinitionService.deleteToolDefinition("testTemplate", testTemplate.TestTemplateID);
  //     this.toolsDefinitionService.testTemplates = this.toolsDefinitionService.testTemplates.filter(testTemplate => testTemplate.TestTemplateID !== testTemplate.TestTemplateID);
  //     this.toolsDefinitionService.dataSubject.next(true);
  //     this.toastService.success('הטמפלייט נמחק בהצלחה');        
  //   } catch (error: any) {
  //     this.toastService.error(error);
  //   }
  // }
}
