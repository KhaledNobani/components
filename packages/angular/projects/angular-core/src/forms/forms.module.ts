import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CheckboxDirective} from './checkbox/checkbox.directive';
import { InputDirective } from './input/input.directive';
import { TextareaDirective } from './textarea/textarea.directive';
import { RadioGroupDirective } from "./radio-group/radio-group.directive";
import { RadioDirective } from "./radio-group/radio.directive";



@NgModule({
  declarations: [
    CheckboxDirective,
    InputDirective,
    TextareaDirective,
    RadioGroupDirective,
    RadioDirective
  ],
  imports: [
  ],
  exports: [
    CheckboxDirective,
    InputDirective,
    TextareaDirective,
    RadioGroupDirective,
    RadioDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormsModule { }