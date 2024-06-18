import { FormGroup } from "@angular/forms";

export class BetterFormGroup extends FormGroup {
  resetWithoutErrors() {
    this.reset();
    for (const control of Object.values(this.controls)) {
      control.setErrors(null);
    }
  }
}