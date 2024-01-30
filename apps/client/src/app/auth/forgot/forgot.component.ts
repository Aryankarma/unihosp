import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'uni-forget',
  templateUrl: 'forgot.component.html',
  standalone: true,
  styleUrls: [
    'forgot.component.scss',
    '../common-styles/common.css',
    '../common-styles/password-field.component.scss',
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ReactiveFormsModule, LoadingComponent, CommonModule, RouterModule],
})
export class ForgotComponent implements OnInit {
  formGroup!: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router) {}

  emailSent = false;

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      email: '',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleForgetMailSent($event: any) {
    $event.preventDefault();
  }
}
