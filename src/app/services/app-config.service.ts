import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private baseURL = environment.serverApiUrl;
  public toolDefinitionURL = this.baseURL + 'ToolsDefinition';
  public ToolTopLevelDefinitionURL = this.toolDefinitionURL + '/ToolTopLevelDefinition';
  public TestDefinitionGroupURL = this.toolDefinitionURL + '/TestDefinitionGroup';
  public TestDefinitionURL = this.toolDefinitionURL + '/TestDefinition';
  public TestTemplateURL = this.toolDefinitionURL + '/TestTemplate';
}

export enum ToolDefinitionURLs {
  toolDefinitionURL,
  TestDefinitionGroupURL,
  TestDefinitionURL
}