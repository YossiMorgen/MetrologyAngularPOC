import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ToolsDefinitionComponent } from './components/pages/tools-definition/tools-definition.component';
import { TechnologyComponent } from './components/ToolsDefinition/tables/technology/technology.component';
import { SubTechnologyComponent } from './components/ToolsDefinition/tables/sub-technology/sub-technology.component';
import { ToolTopLevelDefinitionComponent } from './components/ToolsDefinition/tables/tool-top-level-definition/tool-top-level-definition.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MeasurementUnitComponent } from './components/ToolsDefinition/tables/measurement-units/measurement-units.component';
import { ToolLowLevelDefinitionComponent } from './components/ToolsDefinition/tables/tool-low-level-definition/tool-low-level-definition.component';
import { ToolMeasurementLevelDefinitionComponent } from './components/ToolsDefinition/tables/tool-measurement-level-definition/tool-measurement-level-definition.component';
import { TechnologyFormComponent } from './components/ToolsDefinition/forms/technology-form/technology-form.component';
import { SubTechnologyFormComponent } from './components/ToolsDefinition/forms/sub-technology-form/sub-technology-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService, AngularToastifyModule } from 'angular-toastify';
import { ToolLowLevelDefinitionFormComponent } from './components/ToolsDefinition/forms/tool-low-level-definition-form/tool-low-level-definition-form.component';
import { ToolMeasurementLevelDefinitionFormComponent } from './components/ToolsDefinition/forms/tool-measurement-level-definition-form/tool-measurement-level-definition-form.component';
import { ToolTopLevelDefinitionAndIsoProcedureFormComponent } from './components/ToolsDefinition/forms/tool-top-level-definition-and-iso-procedure-form/tool-top-level-definition-and-iso-procedure-form.component';
import { TestDefinitionGroupTableComponent } from './components/TestDefinition/tables/test-definition-group-table/test-definition-group-table.component';
import { TestDefinitionTableComponent } from './components/TestDefinition/tables/test-definition-table/test-definition-table.component';
import { TestDefinitionFormComponent } from './components/TestDefinition/forms/test-definition-form/test-definition-form.component';
import { TestDefinitionGroupFormComponent } from './components/TestDefinition/forms/test-definition-group-form/test-definition-group-form.component';
import { TestsDefinitionsComponent } from './components/pages/tests-definitions/tests-definitions.component';
import { TestTemplatTableComponent } from './components/TestTemplates/tables/test-templat-table/test-templat-table.component';
import { TestTemplateFormComponent } from './components/TestTemplates/forms/test-template-form/TestTemplateFormComponent';
import { MeasurementUnitFormComponent } from './components/ToolsDefinition/forms/measurement-unit-form/measurement-unit-form.component';
import { ConfirmDialogComponent } from './components/dashboard/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ToolsDefinitionComponent,
    TechnologyComponent,
    SubTechnologyComponent,
    ToolTopLevelDefinitionComponent,
    MeasurementUnitComponent,
    ToolLowLevelDefinitionComponent,
    ToolMeasurementLevelDefinitionComponent,
    TechnologyFormComponent,
    SubTechnologyFormComponent,
    ToolLowLevelDefinitionFormComponent,
    ToolMeasurementLevelDefinitionFormComponent,
    ToolTopLevelDefinitionAndIsoProcedureFormComponent,
    TestDefinitionGroupTableComponent,
    TestDefinitionTableComponent,
    TestDefinitionFormComponent,
    TestDefinitionGroupFormComponent,
    TestsDefinitionsComponent,
    TestTemplateFormComponent,
    TestTemplatTableComponent,
    MeasurementUnitFormComponent,
    ConfirmDialogComponent,
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
    AngularToastifyModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatTooltipModule,
    MatCardModule,
    MatChipsModule,
    NgxMatSelectSearchModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDialogModule,
  ],
  providers: [
    ToastService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
