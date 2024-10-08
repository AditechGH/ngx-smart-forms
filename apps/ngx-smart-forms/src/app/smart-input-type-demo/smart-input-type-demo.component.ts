import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SmartInputType } from '@ngx-smart-forms/smart-input-type';

@Component({
  selector: 'app-smart-input-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SmartInputType],
  templateUrl: './smart-input-type-demo.component.html',
  styleUrls: ['./smart-input-type-demo.component.css'],
})
export class SmartInputTypeDemoComponent {
  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required]],
      url: ['', [Validators.required]],
      tel: ['', [Validators.required]],
    });
  }
}
