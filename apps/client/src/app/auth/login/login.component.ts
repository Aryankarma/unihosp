import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FieldType, HUIcon } from '../interfaces';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'uni-login',
  templateUrl: 'login.component.html',
  styleUrls: [
    'login.component.scss',
    '../common-styles/common.css',
    '../common-styles/password-field.component.scss',
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ReactiveFormsModule, LoadingComponent, CommonModule, RouterModule],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  fieldType: FieldType = 'password';
  classList: HUIcon = 'fa fa-eye';
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  hide() {
    const comparison = this.fieldType === 'password';
    this.classList = comparison ? 'fa fa-eye-slash' : 'fa fa-eye';
    this.fieldType = comparison ? 'text' : 'password';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login($event: any) {
    $event.preventDefault();
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      this.loading = true;
      const subscription = this.authService
        .login(formValue['email'], formValue['password'])
        .subscribe(() => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
          subscription.unsubscribe();
        });
    }
  }
}
