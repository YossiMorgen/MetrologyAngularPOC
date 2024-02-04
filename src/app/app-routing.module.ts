import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { ToolsDefinitionComponent } from './components/pages/tools-definition/tools-definition.component';
import { TechnologyComponent } from './components/ToolsDefinition/tables/technology/technology.component';
import { SubTechnologyComponent } from './components/ToolsDefinition/tables/sub-technology/sub-technology.component';
import { ToolTopLevelDefinitionComponent } from './components/ToolsDefinition/tables/tool-top-level-definition/tool-top-level-definition.component';
import { ToolMeasurementLevelDefinition } from './models/toolDefinitionModels/tool-measurement-level-definition';
import { MeasurementUnitsComponent } from './components/ToolsDefinition/tables/measurement-units/measurement-units.component';
import { ToolLowLevelDefinitionComponent } from './components/ToolsDefinition/tables/tool-low-level-definition/tool-low-level-definition.component';
import { IsoProcedureComponent } from './components/ToolsDefinition/tables/iso-procedure/iso-procedure.component';
import { ToolMeasurementLevelDefinitionComponent } from './components/ToolsDefinition/tables/tool-measurement-level-definition/tool-measurement-level-definition.component';

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
      {path: 'iso_procedure', component: IsoProcedureComponent},
      {path: 'tool_top_level_definition', component: ToolTopLevelDefinitionComponent},
      {path: 'measurement_units', component: MeasurementUnitsComponent},
      {path: 'tool_low_level_definition', component: ToolLowLevelDefinitionComponent},
      {path: 'tool_measurement_level_definition', component: ToolMeasurementLevelDefinitionComponent}
    ]
  },
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
