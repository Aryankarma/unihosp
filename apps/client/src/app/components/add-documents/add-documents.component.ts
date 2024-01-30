import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UniDirectivesModule } from '../../directives/unidirectives.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uni-add-documents',
  templateUrl: './add-documents.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [UniDirectivesModule, CommonModule],
  styleUrls: [
    './add-documents.component.scss',
    '../../auth/common-styles/password-field.component.scss',
  ],
})
export class AddDocumentsComponent implements OnInit {
  addDocumentForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  open = true;

  close() {}

  ngOnInit(): void {
    this.addDocumentForm = this.formBuilder.group({
      filename: ['', [Validators.required]],
      file: ['', [Validators.required]],
    });
  }
}
