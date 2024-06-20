import { Component, Inject, inject } from '@angular/core';
import { BetterFormGroup } from 'src/app/utils/helpers/form';
import { CreateStrategyParams } from 'src/app/utils/types';
import { ErrorStateMatcher } from '@angular/material/core';
import { tokens } from 'src/app/utils/tokens/info';

import {
  ReactiveFormsModule,
  FormControl,
  Validators,
  AbstractControl,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';


const minRequired = (control: AbstractControl) => {
  const value: number = control.value;
  return value <= 0 ? { minRequired: true } : null;
}

const diffToken = (control: AbstractControl) => {
  const { baseToken, quoteToken } = control.value;
  return baseToken !== quoteToken ? { diffToken: true } : null;
}

const priceOrder = (control: AbstractControl) => {
  const { buyMin, buyMax, sellMin, sellMax } = control.value;
  const errors: Record<string, boolean> = {};
  if (buyMin >= buyMax) errors['buyMin'] = true;
  if (buyMax >= sellMin) errors['buyMax'] = true;
  if (sellMin >= sellMax) errors['sellMin'] = true;
  return errors;
}

const formValueToString = (obj: Record<string, string | number>) => {
  const res: Partial<CreateStrategyParams> = {};
  for (const [key, value] of Object.entries(obj)) {
    res[key as keyof CreateStrategyParams] = value.toString();
  }
  return res as CreateStrategyParams;
}

class ParentStateMatcher implements ErrorStateMatcher {
  constructor(private parentError: string) { }
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (!control || control.untouched) return false;
    if (form?.getError(this.parentError)) return true;
    if (control?.invalid) return true;
    return false;
  }
}

const imports = [
  ReactiveFormsModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
]

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports,
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  private dialogData = inject(MAT_DIALOG_DATA);
  updatingStrategy = { update: false, index: 0 };
  buyMaxMatcher = new ParentStateMatcher('buyMin');
  sellMinMatcher = new ParentStateMatcher('buyMax');
  sellMaxMatcher = new ParentStateMatcher('sellMin');
  tokens = tokens;
  form = new BetterFormGroup({
    baseTokenAddress: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    buyMin: new FormControl(0, { nonNullable: true, validators: [Validators.required, minRequired] }),
    buyMax: new FormControl(0, { nonNullable: true, validators: [Validators.required, minRequired] }),
    sellBudget: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
    quoteTokenAddress: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    sellMin: new FormControl(0, { nonNullable: true, validators: [Validators.required, minRequired] }),
    sellMax: new FormControl(0, { nonNullable: true, validators: [Validators.required, minRequired] }),
    buyBudget: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
  }, { validators: [diffToken, priceOrder] });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateStrategyParams,
    public dialogRef: MatDialogRef<any>
  ) { }

  ngOnInit() {
    if (this.data) {
      this.form.reset(this.data);
    }
  }

  submit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const createStrategyParams = formValueToString(this.form.value);
    this.form.resetWithoutErrors();
    this.dialogRef.close(createStrategyParams);
  }

  reset() {
    if (this.form.pristine) return this.dialogRef.close();
    if (this.data) return this.form.reset(this.data);
    this.form.resetWithoutErrors();
  }

}
