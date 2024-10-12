import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Renderer2,
  Self,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

import { fromEvent, debounceTime } from 'rxjs';

/**
 * SmartInputType
 *
 * A directive that enhances native input fields with additional validation and customization options
 * such as alphanumeric, numeric, and email validation. This directive supports spaces, case transformation,
 * and language-specific filtering, making it versatile for various input scenarios.
 */

@Directive({
  selector: '[smartType]',
  standalone: true,
})
export class SmartInputType implements OnInit, OnChanges {
  /**
   * Defines the smart input type. Supported types are:
   * 'alphanumeric', 'numeric', 'alpha', 'email', 'url', 'tel', and 'pattern'.
   * Can also be set to a valid HTML input type (e.g., 'password', 'text').
   */
  @Input() smartType = '';

  /**
   * Allows spaces in the input when set to true.
   */
  @Input() acceptSpace = false;

  /**
   * Transforms the input to uppercase or lowercase. Supports 'uppercase' and 'lowercase'.
   */
  @Input() case: 'uppercase' | 'lowercase' | null = null;

  /**
   * Sets the language set for input filtering. Supported languages are 'en', 'es', 'fr'. or custom patterns.
   */
  @Input() languageSet = '';

  /**
   * Debounce time in milliseconds to delay input validation
   * (e.g., 300ms to wait for user input before validating).
   * Set to 0 to disable debounce.
   * Default is 0.
   */
  @Input() debounceTime = 0;

  /**
   * Custom regex pattern for input validation.
   */
  @Input() pattern?: string;

  // Form control instance
  private formControl: AbstractControl | null = null;

  // Language map for filtering
  private languageMap: { [key: string]: string } = {
    en: 'a-zA-Z0-9',
    es: 'a-zA-Z0-9áéíóúñ',
    fr: 'a-zA-Z0-9àâäçéèêëîïôùûüÿ',
  };

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Optional() @Self() private ngControl: NgControl
  ) {}

  /**
   * Initializes validation logic and handles input changes.
   */
  ngOnInit(): void {
    this.initValidation();
    this.handleInputChanges();
  }

  /**
   * Detects input changes and revalidates the input.
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['smartType']) {
      this.validateInput();
    }
  }

  /**
   * Initializes the validation mechanism by setting up form control and running the first validation.
   */
  private initValidation(): void {
    this.formControl = this.ngControl?.control;
    this.validateInput();
  }

  /**
   * Handles input changes and applies validation based on the smartType.
   * If debounceTime is set, it will debounce the input event.
   * If debounceTime is 0, it will validate the input on every input event.
   */
  private handleInputChanges(): void {
    if (this.debounceTime > 0) {
      fromEvent(this.el.nativeElement, 'input')
        .pipe(debounceTime(this.debounceTime))
        .subscribe(() => this.validateInput());
    } else {
      this.el.nativeElement.addEventListener('input', () =>
        this.validateInput()
      );
    }
  }

  /**
   * Validates the input value based on the smartType and other parameters like case and languageSet.
   * Applies appropriate visual feedback and form control errors if necessary.
   */
  private validateInput(): void {
    if (!this.isSmartTypeValid() && !this.isValidHtmlType(this.smartType)) {
      console.warn(
        `Invalid smartType "${this.smartType}". Allowed types are: alphanumeric, numeric, alpha, email, url, tel, pattern, or valid HTML input types.`
      );
    }

    if (!this.isCompatibleWithNativeInput()) {
      console.warn(
        `smartType "${this.smartType}" is not compatible with native input type "${this.el.nativeElement.type}".`
      );
      return;
    }

    if (this.isValidHtmlType(this.smartType) && !this.isSmartTypeValid()) {
      this.el.nativeElement.type = this.smartType;
      if (this.smartType !== 'text') {
        return;
      }
    }

    let value: string = this.el.nativeElement.value;
    const errors: { [key: string]: boolean } = {};

    // Handle case transformation
    if (this.case) {
      value =
        this.case === 'uppercase' ? value.toUpperCase() : value.toLowerCase();
    }
    // Apply language set filtering
    if (this.languageSet) {
      value = this.filterByLanguageSet(value);
    }

    // Process multiple smartTypes if present
    value = this.applySmartTypeValidation(this.smartType, value, errors);

    // Update the native input element's value
    this.el.nativeElement.value = value;

    // Sync with FormControl if exists
    if (this.formControl) {
      this.formControl.setValue(value, { emitEvent: false });
      this.applyFormErrors(errors);
    }

    // Apply user-friendly visual feedback
    this.applyVisualFeedback(errors);
  }

  /**
   * Applies validation logic based on the specified smartType (e.g., alphanumeric, email).
   * Returns the sanitized input value.
   * @param type string
   * @param value string
   * @param errors object
   * @returns string
   */
  private applySmartTypeValidation(
    type: string,
    value: string,
    errors: { [key: string]: boolean }
  ): string {
    switch (type) {
      case 'alphanumeric':
        value = this.acceptSpace
          ? value.replace(/[^a-zA-Z0-9 ]/g, '')
          : value.replace(/[^a-zA-Z0-9]/g, '');
        break;
      case 'alpha':
        value = this.acceptSpace
          ? value.replace(/[^a-zA-Z ]/g, '')
          : value.replace(/[^a-zA-Z]/g, '');
        break;
      case 'numeric':
        value = this.acceptSpace
          ? value.replace(/[^0-9 ]/g, '')
          : value.replace(/[^0-9]/g, '');
        break;
      case 'email': {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(value) && value !== '') {
          errors['strictEmail'] = true;
        }
        break;
      }
      case 'url': {
        const urlPattern =
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!urlPattern.test(value) && value !== '') {
          errors['strictUrl'] = true;
        }
        break;
      }
      case 'tel': {
        const telPattern =
          /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
        if (!telPattern.test(value) && value !== '') {
          errors['strictTel'] = true;
        }
        break;
      }
      case 'pattern':
        if (this.pattern) {
          value = value.replace(new RegExp(`[^${this.pattern}]`, 'g'), '');
        }
        break;
      default:
        break;
    }
    return value;
  }

  /**
   * Filters the input value based on the allowed character set of the specified language.
   * Returns the filtered input value.
   * @param value string
   * @returns string
   */
  private filterByLanguageSet(value: string): string {
    const languagePattern = new RegExp(
      `[^${this.languageMap[this.languageSet] ?? this.languageSet}]`,
      'g'
    );
    return value.replace(languagePattern, '');
  }

  /**
   * Updates the form control with validation errors, or removes errors if none exist.
   * @param errors object
   * @returns void
   */
  private applyFormErrors(errors: { [key: string]: boolean }): void {
    if (this.formControl) {
      const currentErrors = this.formControl.errors || {};
      const newErrors = Object.assign({}, currentErrors, errors);
      this.formControl.setErrors(
        Object.keys(newErrors).length ? newErrors : null
      );
    }
  }

  /**
   * Adds or removes CSS classes based on validation errors to provide visual feedback.
   * If there are no errors, the 'has-error' class is removed.
   * @param errors object
   * @returns void
   */
  private applyVisualFeedback(errors: { [key: string]: boolean }): void {
    if (Object.keys(errors).length) {
      this.renderer.addClass(this.el.nativeElement, 'has-error');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'has-error');
    }
  }

  /**
   * Checks if the specified smartType is a valid HTML input type.
   * Returns true if the type is valid, false otherwise.
   * @param type string
   * @returns boolean
   */
  private isValidHtmlType(type: string): boolean {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    return input.type === type;
  }

  /**
   * Checks if the specified smartType is a valid smart type (e.g., alphanumeric, numeric).
   * Returns true if the type is valid, false otherwise.
   * @returns boolean
   */
  private isSmartTypeValid(): boolean {
    const validSmartTypes = [
      'alphanumeric',
      'numeric',
      'alpha',
      'email',
      'url',
      'tel',
      'pattern',
    ];

    return validSmartTypes.includes(this.smartType);
  }

  /**
   * Checks if the smartType is compatible with the native input type.
   * Returns true if the smartType is compatible, false otherwise.
   * @returns boolean
   */
  private isCompatibleWithNativeInput(): boolean {
    const nativeType = this.el.nativeElement.type;

    const smartTypeCompatibility: { [key: string]: string[] } = {
      alphanumeric: ['text'],
      alpha: ['text'],
      numeric: ['number', 'text'],
      email: ['email', 'text'],
      url: ['url', 'text'],
      tel: ['tel', 'text'],
    };

    return smartTypeCompatibility[this.smartType]?.includes(nativeType) ?? true;
  }
}
