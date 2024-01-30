import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PassInputField } from '../interfaces/passInputField';
import { LoadingComponent } from '../../loading/loading.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: `uni-signup`,
  templateUrl: './signup.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ReactiveFormsModule, LoadingComponent, CommonModule, RouterModule],
  styleUrls: [
    './signup.component.scss',
    '../common-styles/common.css',
    '../common-styles/password-field.component.scss',
  ],
})
export class SignupComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  trySubmit = false;

  loading = false;

  signupForm!: FormGroup;

  passMatch = true;

  passInputFields: PassInputField[] = [
    { title: 'Password', classList: 'fa fa-eye', fieldType: 'password' },
    {
      title: 'Confirm-Password',
      classList: 'fa fa-eye',
      fieldType: 'password',
    },
  ];

  hide(index: number) {
    const comparison = this.passInputFields[index].fieldType === 'password';
    this.passInputFields[index].classList = comparison
      ? 'fa fa-eye-slash'
      : 'fa fa-eye';
    this.passInputFields[index].fieldType = comparison ? 'text' : 'password';
  }

  passwordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  confirmPasswordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  ngOnInit() {
    document.title = 'Signup - UniHosp';
    this.signupForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', [Validators.required]),
      password: this.passwordControl,
      'confirm-password': this.confirmPasswordControl,
      userType: new FormControl(),
    });
  }

  get email() {
    return this.signupForm.get('email');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userTypeChange(event: any) {
    event.target.value = event.target.checked ? 'Doctor' : 'Patient';
  }

  navigate(email: string, contact: string) {
    this.router
      .navigate(['/auth/login'], {
        state: {
          authData: {
            email,
            contact,
          },
        },
      })
      .then(console.log);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleRegistration($event: any) {
    $event.preventDefault();

    // console.log(this.signupForm.value);
    const values = this.signupForm.value;
    console.log(
      this.signupForm,
      this.validatePass(values.password, values['confirm-password'])
    );
    if (
      this.validatePass(values.password, values['confirm-password']) &&
      this.signupForm.valid
    ) {
      this.loading = true;
      const subscription = this.authService
        .signup(values.email, values.password, values.contact)
        .subscribe(() => {
          this.loading = false;
          this.navigate(values.email, values.contact);
          subscription.unsubscribe();
        });
    } else {
      console.log('Something Went Wrong');
    }
  }

  validatePass(prev: string, curr: string) {
    return prev === curr;
  }
}
