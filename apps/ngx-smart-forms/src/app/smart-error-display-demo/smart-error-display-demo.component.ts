import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SmartErrorDisplay } from '@ngx-smart-forms/smart-error-display';

@Component({
  selector: 'app-smart-error-display-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SmartErrorDisplay],
  templateUrl: './smart-error-display-demo.component.html',
  styleUrl: './smart-error-display-demo.component.css',
})
export class SmartErrorDisplayDemoComponent {
  basicForm!: FormGroup;
  templateForm!: FormGroup;
  customMessageForm!: FormGroup;
  themingForm!: FormGroup;
  customFormatterForm!: FormGroup;
  errorDisplayControlForm!: FormGroup;
  debounceForm!: FormGroup;
  localizationForm!: FormGroup;
  customLoggingForm!: FormGroup;

  tdUsername = '';
  tdEmail = '';

  @ViewChild('usernameRef', { static: true }) usernameElement!: ElementRef;
  @ViewChild('emailRef', { static: true }) emailElement!: ElementRef;
  @ViewChild('passwordRef', { static: true }) passwordElement!: ElementRef;

  constructor(private fb: FormBuilder) {
    this.basicForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.templateForm = this.fb.group({
      tdUsername: ['', [Validators.required, Validators.minLength(3)]],
      tdEmail: ['', [Validators.required, Validators.email]],
    });

    this.customMessageForm = this.fb.group({
      customUsername: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.themingForm = this.fb.group({
      themeUsername: ['', Validators.required],
      themePassword: ['', Validators.required],
      themeEmail: ['', [Validators.required, Validators.email]],
    });

    this.customFormatterForm = this.fb.group({
      customFormatterUsername: [
        '',
        [Validators.required, Validators.minLength(5)],
      ],
    });

    this.errorDisplayControlForm = this.fb.group({
      edcUsername: ['', Validators.required],
      edcEmail: ['', [Validators.required, Validators.email]],
      edcPassword: ['', Validators.required],
    });

    this.debounceForm = this.fb.group({
      debounceUsername: ['', Validators.required],
    });

    this.localizationForm = this.fb.group({
      localizationEmail: ['', [Validators.required, Validators.email]],
    });

    this.customLoggingForm = this.fb.group({
      customLoggingUsername: ['', Validators.required],
    });
  }

  customFormatter(errorKey: string, errorValue: unknown): string | null {
    if (errorKey === 'minlength') {
      const value = errorValue as { requiredLength: number };
      return `Minimum length is ${value.requiredLength} characters.`;
    }
    return null;
  }

  translationService: {
    translate: (message: string) => string;
  } = {
    translate: (message: string) => {
      // Mock translation service; replace with your actual translation logic
      const translations: { [key: string]: string } = {
        'This field is required.': 'Este campo es obligatorio.',
        'Please enter a valid email address.':
          'Por favor, introduce una dirección de correo electrónico válida.',
        'Minimum length is 3 characters.':
          'La longitud mínima es de 3 caracteres.',
        'Minimum length is 5 characters.':
          'La longitud mínima es de 5 caracteres.',
      };
      return translations[message] || message;
    },
  };

  customLogError = (errorKey: string, controlName?: string) => {
    console.log(`Logging error for ${controlName || 'a control'}: ${errorKey}`);
  };
}
