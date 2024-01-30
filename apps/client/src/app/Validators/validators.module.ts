import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomEmailValidatorDirective } from './custom-email-validator.directive';
import { HandleValidatorDirective } from './handle-validator.directive';



@NgModule({
  declarations: [
    CustomEmailValidatorDirective,
    HandleValidatorDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomEmailValidatorDirective,
    HandleValidatorDirective
  ]
})
export class ValidatorsModule { }
