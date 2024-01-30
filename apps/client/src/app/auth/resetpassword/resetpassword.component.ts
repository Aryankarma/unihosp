import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FieldType, HUIcon } from '../interfaces';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../loading/loading.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'uni-rsp',
  templateUrl: 'reset-password.component.html',
  standalone: true,
  styleUrls: [
    'reset-password.component.scss',
    '../common-styles/common.css',
    '../common-styles/password-field.component.scss',
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ReactiveFormsModule, LoadingComponent, CommonModule, RouterModule],
})
export class ResetPasswordComponent implements OnInit {
  passInputFields: {
    title: string;
    classList: HUIcon;
    fieldType: FieldType;
  }[] = [
    { title: 'New-Password', classList: 'fa fa-eye', fieldType: 'password' },
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

  constructor(private formBuilder: FormBuilder) {}

  resetForm!: FormGroup;

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      'new-password': ['', [Validators.minLength(8)]],
      'confirm-password': ['', [Validators.minLength(8)]],
    });
  }
}
