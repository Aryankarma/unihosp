import { Directive } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { ProfileService } from '../services/profile.service';

@Directive({
  selector: '[uniHandleValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useClass: HandleValidatorDirective,
      multi: true,
    },
  ],
})
export class HandleValidatorDirective implements AsyncValidator {
  constructor(private profile: ProfileService) {}
  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const handle: string = control.value + '@unihosp';
    if (/\w*@\w/.test(handle))
      return this.profile
        .checkHandle(handle)
        .pipe(
          map((val) =>
            val.handle ? { invalidHandle: 'Handle already exists' } : null
          )
        );
    return of(null);
  }
}
