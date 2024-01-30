import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '../../loading/loading.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'uni-otp',
  templateUrl: 'otp.component.html',
  styleUrls: [
    'otp.component.scss',
    '../common-styles/common.css',
    '../common-styles/password-field.component.scss',
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ReactiveFormsModule, LoadingComponent, CommonModule, RouterModule],
})
export class OtpComponent {
  formGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  handleOTPCheck() {}
}
