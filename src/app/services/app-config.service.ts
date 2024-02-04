import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private baseURL = 'https://localhost:44301/api/';
  public toolDefinitionURL = this.baseURL + 'ToolsDefinition';
}
