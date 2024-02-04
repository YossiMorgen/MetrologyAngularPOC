import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ToolsDefinitionComponent } from './components/pages/tools-definition/tools-definition.component';
import { TechnologyComponent } from './components/ToolsDefinition/tables/technology/technology.component';
import { SubTechnologyComponent } from './components/ToolsDefinition/tables/sub-technology/sub-technology.component';
import { ToolTopLevelDefinitionComponent } from './components/ToolsDefinition/tables/tool-top-level-definition/tool-top-level-definition.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MeasurementUnitsComponent } from './components/ToolsDefinition/tables/measurement-units/measurement-units.component';
import { ToolLowLevelDefinitionComponent } from './components/ToolsDefinition/tables/tool-low-level-definition/tool-low-level-definition.component';
import { ToolMeasurementLevelDefinitionComponent } from './components/ToolsDefinition/tables/tool-measurement-level-definition/tool-measurement-level-definition.component';
import { IsoProcedureComponent } from './components/ToolsDefinition/tables/iso-procedure/iso-procedure.component';
import { TechnologyFormComponent } from './components/ToolsDefinition/forms/technology-form/technology-form.component';
import { SubTechnologyFormComponent } from './components/ToolsDefinition/forms/sub-technology-form/sub-technology-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService, AngularToastifyModule } from 'angular-toastify';
import { IsoProcedureFormComponent } from './components/ToolsDefinition/forms/iso-procedure-form/iso-procedure-form.component';
import { MeasurementUnitsFormComponent } from './components/ToolsDefinition/forms/measurement-units-form/measurement-units-form.component';
import { ToolLowLevelDefinitionFormComponent } from './components/ToolsDefinition/forms/tool-low-level-definition-form/tool-low-level-definition-form.component';
import { ToolMeasurementLevelDefinitionFormComponent } from './components/ToolsDefinition/forms/tool-measurement-level-definition-form/tool-measurement-level-definition-form.component';
import { ToolTopLevelDefinitionFormComponent } from './components/ToolsDefinition/forms/tool-top-level-definition-form/tool-top-level-definition-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ToolsDefinitionComponent,
    TechnologyComponent,
    SubTechnologyComponent,
    IsoProcedureComponent,
    ToolTopLevelDefinitionComponent,
    MeasurementUnitsComponent,
    ToolLowLevelDefinitionComponent,
    ToolMeasurementLevelDefinitionComponent,
    TechnologyFormComponent,
    SubTechnologyFormComponent,
    IsoProcedureFormComponent,
    MeasurementUnitsFormComponent,
    ToolLowLevelDefinitionFormComponent,
    ToolMeasurementLevelDefinitionFormComponent,
    ToolTopLevelDefinitionFormComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AngularToastifyModule
  ],
  providers: [
    ToastService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
