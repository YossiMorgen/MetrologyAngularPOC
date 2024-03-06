import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'angular-toastify';
import { ConfirmDialogComponent } from 'src/app/components/dashboard/confirm-dialog/confirm-dialog.component';
import { Endurance } from 'src/app/models/TestDefinition/endurance';
import { TestDefinition } from 'src/app/models/TestDefinition/test-definition';
import { TestDefinitionGroup } from 'src/app/models/TestDefinition/test-definition-group';
import { ConfirmDialogModel } from 'src/app/models/confirm-dialog';
import { ToolsDefinitionService } from 'src/app/services/tools-definition.service';

@Component({
  selector: 'app-test-definition-form',
  templateUrl: './test-definition-form.component.html',
  styleUrls: ['./test-definition-form.component.css']
})
export class TestDefinitionFormComponent implements OnChanges, OnInit {
  @Input() testDefinitionInput: TestDefinition = null;
  @Input() testDefinitionGroup: TestDefinitionGroup = null;
  @Input() testDefinitions: TestDefinition[] = null;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    public toolsDefinitionService: ToolsDefinitionService,
    private formBuilder : FormBuilder,
    private dialog: MatDialog,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.EnduranceForm.clear();
    this.testDefinitionForm.controls.ValueRequired.setValue(null);
    this.testDefinitionForm.controls.ValueUncertainty.setValue(null);

    this.addEnduranceForms();

    // listen to ValueRequired and fill the form as default from the closest value below the ValueRequired
    this.testDefinitionForm.controls.ValueRequired.valueChanges.subscribe((value: number) => {
      if(!value) return;
      
      if(this.testDefinitions.length === 0) {return}

      if(this.testDefinitions[this.testDefinitions.length - 1].ValueRequired < value){
        this.addEndurances(this.testDefinitions[this.testDefinitions.length - 1].Endurance);
        this.testDefinitionForm.controls.ValueUncertainty.setValue(this.testDefinitions[this.testDefinitions.length - 1].ValueUncertainty);
        this.testDefinitionForm.controls.IsIso17025.setValue(this.testDefinitions[this.testDefinitions.length - 1].IsIso17025);
        return;
      }

      if(this.testDefinitions[0].ValueRequired > value){
        this.addEndurances(this.testDefinitions[0].Endurance);
        this.testDefinitionForm.controls.ValueUncertainty.setValue(this.testDefinitions[0].ValueUncertainty);
        return;
      }

      for (let i = 0; i < this.testDefinitions.length; i++) {
        if(this.testDefinitions[i].ValueRequired > value){
          this.addEndurances(this.testDefinitions[i - 1].Endurance);
          this.testDefinitionForm.controls.ValueUncertainty.setValue(this.testDefinitions[i - 1].ValueUncertainty);
          this.testDefinitionForm.controls.IsIso17025.setValue(this.testDefinitions[i - 1].IsIso17025);
          console.log("IsIso17025");
          
          console.log(this.testDefinitions[i - 1].IsIso17025);
          console.log(this.testDefinitionForm.controls.IsIso17025.value);
          
          
          return;
        }
      }
    });

    // this.EnduranceForm.valueChanges.subscribe((value: any) => {
    //   console.log(value);
    //   console.log(this.EnduranceForm.value);
    //   console.log(this.EnduranceForm.valid);
    // });

    // this.testDefinitionForm.valueChanges.subscribe((value: any) => {
    //   console.log(this.testDefinitionForm.value);
    //   console.log(this.EnduranceForm.value);
    //   console.log(this.testDefinitionForm.valid);
    //   console.log(this.EnduranceForm.valid);
    //   // log the errors
    //   console.log(this.testDefinitionForm.errors);
    //   console.log(this.EnduranceForm.errors);
    // });
  }

  testDefinitionForm = this.formBuilder.group({
    TestDefinitionID: [0],
    ValueRequired: [0, [Validators.required]],
    ValueUncertainty: [0, [Validators.required]],
    IsIso17025: [true, [Validators.required]],
  });
  
  EnduranceForm = this.formBuilder.array([
    this.formBuilder.group({
      ValueEndurance: [0],
      EnduranceUp: [true],
      EnduranceDown: [true],
      Resolution_ToolTopLevelDefinitionID: [0],
      resValue: [0]
    })
  ]);

  ngOnChanges(changes: SimpleChanges): void { 
    console.log("changes");
    
    this.testDefinitionForm.controls.ValueRequired.setValue(null);
    this.testDefinitionForm.controls.ValueUncertainty.setValue(null);
    this.EnduranceForm.clear();
    this.addEnduranceForms();
    if(changes?.['testDefinitionInput'] && this.testDefinitionInput){
      console.log("testDefinitionInput changed");
      console.log(this.testDefinitionInput.ValueUncertainty);
      
      this.testDefinitionForm.setValue({
        TestDefinitionID: this.testDefinitionInput.TestDefinitionID,
        ValueRequired: this.testDefinitionInput.ValueRequired,
        ValueUncertainty: this.testDefinitionInput.ValueUncertainty,
        IsIso17025: this.testDefinitionInput.IsIso17025,
      });
      console.log(this.testDefinitionForm.value);
      // return;
      this.addEndurances(this.testDefinitionInput?.Endurance || []);

    } 
  }

  addEndurances(endurance: Endurance[]): void {
    // console.log(endurance);
    
    this.EnduranceForm.clear();
    for(let i = 0; i < this.testDefinitionGroup.ToolTopLevelDefinition?.Resolutions?.length; i++){
      const resolution = this.testDefinitionGroup.ToolTopLevelDefinition?.Resolutions[i];
      const end = endurance.find((endurance) => endurance.Resolution_ToolTopLevelDefinition?.ResolutionID === resolution.ResolutionID);
      this.addEndurance(
          end 
        || 
          new Endurance(
            0, 
            this.testDefinitionGroup.ToolTopLevelDefinition?.ResolutionToolTopLevelDefinition[i].Resolution_ToolTopLevelDefinitionID, 
            null, 
            null
          ), 
        resolution.Value
      );
    }
    // console.log(valueUncertainty);
    
  }

  addEnduranceForms(){
    this.EnduranceForm.clear();
    this.testDefinitionGroup?.ToolTopLevelDefinition?.Resolutions.forEach((resolution) => {
      const res_toolTop = this.testDefinitionGroup.ToolTopLevelDefinition?.ResolutionToolTopLevelDefinition.find((res) => res.ResolutionID === resolution.ResolutionID);
      this.addEndurance(new Endurance(0, res_toolTop.Resolution_ToolTopLevelDefinitionID, null, null), resolution.Value);
    });
  }

  addEndurance(endurance: Endurance, resValue: number): void {
    this.EnduranceForm.push(this.formBuilder.group({
      ValueEndurance: [endurance.ValueEnduranceUp || endurance.ValueEnduranceDown],
      EnduranceUp: [endurance.ValueEnduranceUp ? true : false],
      EnduranceDown: [endurance.ValueEnduranceDown ? true : false],
      Resolution_ToolTopLevelDefinitionID: [endurance.Resolution_ToolTopLevelDefinitionID],
      resValue: [resValue]
    }));
  }

  
  async onSubmit() {
    const newTestDefinition = new TestDefinition(
      " ",
      this.testDefinitionGroup.TestDefinitionGroupID,
      this.testDefinitionForm.value.ValueRequired,
      this.testDefinitionForm.value.ValueUncertainty,
      this.testDefinitionForm.value.IsIso17025,
      this.testDefinitionInput?.TestDefinitionID || 0,
    );

    // let enduranceArray = this.EnduranceForm.value.map((endurance: any) => {
    //   return new Endurance(
    //     0,
    //     endurance.Resolution_ToolTopLevelDefinitionID,
    //     endurance.ValueEnduranceUp,
    //     endurance.ValueEnduranceDown || 0
    //   );
    // });

    let enduranceArray: Endurance[] = [];
    for (let i = 0; i < this.EnduranceForm.length; i++) {
      const endurance = this.EnduranceForm.controls[i] as any;
      if(!endurance.controls.ValueEndurance.value) continue;
      enduranceArray.push(new Endurance(
        0,
        endurance.controls.Resolution_ToolTopLevelDefinitionID.value,
        endurance.controls.EnduranceUp && endurance.controls.ValueEndurance.value,
        endurance.controls.EnduranceDown && endurance.controls.ValueEndurance.value,
        ));
    }

    try {
      await this.toolsDefinitionService.uploadTestDefinition(newTestDefinition, enduranceArray);
      this.toastService.success('הבדיקה התווספה בהצלחה');
      this.resetForm();
      this.testDefinitionInput = null;
    } catch (error) {
      console.log(error);
      
      this.toastService.error('שגיאה בהעלאת הבדיקה');
    }    

    this.formDirective.resetForm();
    this.testDefinitionForm.reset();
    this.testDefinitionForm.controls.ValueRequired.setValue(null);
    // this.addEnduranceForms();
  }

  resetForm() {
    this.formDirective.resetForm();
    this.testDefinitionForm.reset();
    this.testDefinitionForm.controls.ValueRequired.setValue(null);
    this.addEnduranceForms();
  }

  async deleteTestDefinition(): Promise<void> {

    const dialogData = new ConfirmDialogModel(
      "מחיקת בדיקה",
      "האם אתה בטוח שברצונך למחוק את הבדיקה?"
    );
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(async (dialogResult) => {
      if(dialogResult){
        const testDefinitionId = this.testDefinitionInput.TestDefinitionID;
        try {
          await this.toolsDefinitionService.deleteToolDefinition("TestDefinition", testDefinitionId);
          this.toolsDefinitionService.testDefinitions = this.toolsDefinitionService.testDefinitions.filter(testDefinition => testDefinition.TestDefinitionID !== testDefinitionId);
          this.toolsDefinitionService.linkTheData();
          this.resetForm();
          this.testDefinitionInput = null;
          this.toastService.success('הבדיקה נמחקה בהצלחה');
        } catch (error: any) {
          this.toastService.error(error);
        }
      }
    });
  }

  divideEnduranceByTen(){
    const enduranceArray = this.EnduranceForm.controls as any;
    enduranceArray.forEach((endurance: any) => {
      endurance.controls.ValueEnduranceUp.setValue(endurance.controls.ValueEnduranceUp.value / 10);
      // endurance.controls.ValueEnduranceDown.setValue(endurance.controls.ValueEnduranceDown.value / 10);
    });
  }
  
}

