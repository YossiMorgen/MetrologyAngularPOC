import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { ToolsDefinitionComponent } from './components/pages/tools-definition/tools-definition.component';
import { TechnologyComponent } from './components/ToolsDefinition/tables/technology/technology.component';
import { SubTechnologyComponent } from './components/ToolsDefinition/tables/sub-technology/sub-technology.component';
import { ToolTopLevelDefinitionComponent } from './components/ToolsDefinition/tables/tool-top-level-definition/tool-top-level-definition.component';
import { MeasurementUnitComponent } from './components/ToolsDefinition/tables/measurement-units/measurement-units.component';
import { ToolLowLevelDefinitionComponent } from './components/ToolsDefinition/tables/tool-low-level-definition/tool-low-level-definition.component';
import { ToolMeasurementLevelDefinitionComponent } from './components/ToolsDefinition/tables/tool-measurement-level-definition/tool-measurement-level-definition.component';
import { TestsDefinitionsComponent } from './components/pages/tests-definitions/tests-definitions.component';
import { TestDefinitionGroupTableComponent } from './components/TestDefinition/tables/test-definition-group-table/test-definition-group-table.component';
import { TestTemplateFormComponent } from './components/TestTemplates/forms/test-template-form/TestTemplateFormComponent';
import { TestTemplatTableComponent } from './components/TestTemplates/tables/test-templat-table/test-templat-table.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {
    path: 'tool_definitions', 
    component: ToolsDefinitionComponent,
    children: [
      {path: '', redirectTo: 'technology', pathMatch: 'full'},
      {path: 'technology', component: TechnologyComponent},
      {path: 'sub_technology', component: SubTechnologyComponent},
      {path: 'tool_top_level_definition', component: ToolTopLevelDefinitionComponent},
      {path: 'measurement_units', component: MeasurementUnitComponent},
      {path: 'tool_low_level_definition', component: ToolLowLevelDefinitionComponent},
      {path: 'tool_measurement_level_definition', component: ToolMeasurementLevelDefinitionComponent}
    ]
  },
  {
    path: 'test_definition',
    component: TestsDefinitionsComponent,
    children: [
      {path: '', redirectTo: 'test_definition_group', pathMatch: 'full'},
      {path: 'test_definition_group', component: TestDefinitionGroupTableComponent},
      {path: 'test_template_form', component: TestTemplatTableComponent},
    ]
  },
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
