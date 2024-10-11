import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SmartFileUpload } from '@ngx-smart-forms/smart-file-upload';

@Component({
  selector: 'app-smart-file-upload-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SmartFileUpload],
  templateUrl: './smart-file-upload-demo.component.html',
  styleUrl: './smart-file-upload-demo.component.css',
})
export class SmartFileUploadDemoComponent implements OnInit {
  basicForm!: FormGroup;
  multipleFilesForm!: FormGroup;
  validationForm!: FormGroup;
  imageForm!: FormGroup;
  debouncedForm!: FormGroup;
  lazyLoadForm!: FormGroup;
  themeForm!: FormGroup;
  dragDropForm!: FormGroup;
  previewForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.basicForm = this.fb.group({
      singleFile: [null, Validators.required],
    });

    this.multipleFilesForm = this.fb.group({
      multipleFiles: [null, Validators.required],
    });

    this.validationForm = this.fb.group({
      validatedFile: [null, Validators.required],
    });

    this.imageForm = this.fb.group({
      imageFile: [null, Validators.required],
    });

    this.debouncedForm = this.fb.group({
      debouncedFile: [null, Validators.required],
    });

    this.lazyLoadForm = this.fb.group({
      lazyLoadedFile: [null, Validators.required],
    });

    this.themeForm = this.fb.group({
      themedFile: [null, Validators.required],
    });

    this.dragDropForm = this.fb.group({
      dragDropFile: [null, Validators.required],
    });

    this.previewForm = this.fb.group({
      imagePreviewFile: [null, Validators.required],
    });
  }

  handleFileSelected(event: Event): void {
    console.log('File selected:', event);
  }

  handleDragOver(event: DragEvent): void {
    console.log('Drag over:', event);
  }

  handleFileDrop(event: DragEvent): void {
    console.log('File dropped:', event);
  }
}
