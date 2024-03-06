import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'angular-toastify';
import { ConfirmDialogComponent } from 'src/app/components/dashboard/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from 'src/app/models/confirm-dialog';
import { MeasurementUnit } from 'src/app/models/toolDefinitionModels/measurement-unit';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-measurement-unit-form',
  templateUrl: './measurement-unit-form.component.html',
  styleUrls: ['./measurement-unit-form.component.css']
})
export class MeasurementUnitFormComponent implements OnChanges {
  @Input() MeasurementUnit: MeasurementUnit = null;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  
  constructor(
    private toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private dialog: MatDialog,
    private toastService: ToastService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
      this.MeasurementUnitForm.setValue({
        Symbol: this.MeasurementUnit?.Symbol || '',
        MeasurementUnitID: this.MeasurementUnit?.MeasurementUnitID
      });
  }

  MeasurementUnitForm = this.formBuilder.group({
    Symbol: ['', [Validators.required, Validators.minLength(1)]],
    MeasurementUnitID: [0]
  });

  onSubmit() {
    const newMeasurementUnit = new MeasurementUnit(this.MeasurementUnitForm.value.Symbol, this.MeasurementUnitForm.value.MeasurementUnitID);
    if(this.MeasurementUnit){
      this.toolsDefinitionService.updateToolDefinition(newMeasurementUnit, this.MeasurementUnit.MeasurementUnitID)
      .then(() => {
        this.toastService.success('היחידה עודכנה בהצלחה');
        this.MeasurementUnit = null;
        this.resetForm();
      })
      .catch((error: any) => {
        this.toastService.error('שגיאה בעדכון יחידת מדידה');
      });
    } else {
      this.toolsDefinitionService.createToolDefinition(newMeasurementUnit)
      .then(() => {
        this.toastService.success('היחידה נוצרה בהצלחה');
        this.resetForm();
      })
      .catch((error: any) => {
        this.toastService.error('שגיאה ביצירת יחידת מדידה ');
      });
    }
  }

  resetForm() {
    this.formDirective.resetForm();
    this.MeasurementUnitForm.reset();
  }

  deleteMeasurementUnit() {
    
    const dialogData = new ConfirmDialogModel('מחיקת יחידת מדידה', 'האם אתה בטוח שברצונך למחוק את היחידה?');
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if(result){
        this.toolsDefinitionService.deleteToolDefinition("MeasurementUnit", this.MeasurementUnit.MeasurementUnitID)
        .then(() => {
          this.toastService.success('היחידה נמחקה בהצלחה');
          this.toolsDefinitionService.MeasurementUnit = this.toolsDefinitionService.MeasurementUnit.filter(mu => mu.MeasurementUnitID !== this.MeasurementUnit.MeasurementUnitID);
          this.toolsDefinitionService.linkTheData();
          this.MeasurementUnit = null;
          this.resetForm();
        })
        .catch((error: any) => {
          this.toastService.error('שגיאה במחיקת יחידת מדידה');
        });
      }
    });


  }

}
