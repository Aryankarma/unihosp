/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'uni-createprofile',
  templateUrl: './createprofile.component.html',
  styleUrls: [
    './createprofile.component.scss',
    '../auth/common-styles/password-field.component.scss',
  ],
  standalone: true,
  imports: [RouterModule, CommonModule, LoadingComponent, ReactiveFormsModule],
})
export class CreateprofileComponent implements OnInit, OnDestroy {
  predefinedSuffix = '@unihosp';

  createProfileForm!: FormGroup;

  bloodTypes = ['A', 'B', 'AB', 'O'];

  focused = [false, false, false, false, false];

  maxDate = new Date();

  loading = false;

  trySubmit = false;

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}
  subscription!: Subscription;

  platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.title = 'Profile - UniHosp';
    }
    this.createProfileForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      handle: '',
      dateOfBirth: ['', [Validators.required]],
      bloodGroup: ['', Validators.maxLength(2)],
    });

    this.subscription = this.createProfileForm.valueChanges.subscribe(() =>
      console.log(this.createProfileForm.valid)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFocus(index: number) {
    this.focused[index] = true;
  }

  onBlur(index: number) {
    this.focused[index] = false;
  }

  get handle() {
    return this.createProfileForm.get('handle');
  }

  handleFormSubmission($event: any) {
    $event.preventDefault();
    this.trySubmit = true;
    const value = this.createProfileForm.value;
    if (this.createProfileForm.valid) {
      this.loading = true;
      const subscription = this.profileService
        .createPatientProfile({
          ...value,
          handle: value['handle'],
          fName: value['firstname'],
          lName: value['lastname'],
        })
        .subscribe(() => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
          subscription.unsubscribe();
        });
    }
  }
}
