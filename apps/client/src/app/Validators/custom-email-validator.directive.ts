import { Directive } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { UserService } from '../services/user.service';

@Directive({
  selector: '[uniCustomEmailValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: CustomEmailValidatorDirective,
      multi: true,
    },
  ],
})
export class CustomEmailValidatorDirective implements AsyncValidator {
  constructor(private userService: UserService) {}

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const email: string = control.value;
    // console.log(email)
    if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      return this.userService
        .getUsersByMail(email)
        .pipe(
          map((val) =>
            val.email ? { invalidEmail: 'Email already exists' } : null
          )
        );
    return of(null);
  }
}
