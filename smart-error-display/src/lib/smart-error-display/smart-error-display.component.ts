import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

import { getMergedStyles } from '@ngx-smart-forms/shared-utils';

/**
 * SmartErrorDisplayComponent
 *
 * A robust Angular component that displays validation errors for a given form control or form group.
 * This component offers advanced theming, localization, custom error formatting, accessibility features,
 * performance optimizations, and analytics integration, making it suitable for production use in any Angular application.
 */
@Component({
  selector: 'lib-smart-error-display',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div
      *ngIf="shouldDisplayError"
      [ngStyle]="mergedStyles"
      aria-live="assertive"
      role="alert"
      id="smart-error-display"
    >
      <div *ngFor="let error of errorMessages">
        {{ error }}
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartErrorDisplayComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  /**
   * The form control or form group whose errors will be displayed.
   * Supports both reactive form controls (AbstractControl) and template-driven form controls (NgControl).
   */
  @Input() control: AbstractControl | null = null;

  /**
   * Custom error messages to override default messages.
   * The key represents the error type (e.g., 'required'), and the value is the custom message.
   */
  @Input() customMessages: { [key: string]: string } | null = null;

  /**
   * Inline styles to apply to the error message container, allowing for custom theming.
   */
  @Input() themeStyles: { [key: string]: string } = {};

  /**
   * CSS class to apply to the error message container for additional styling or theming.
   */
  @Input() themeClass: string | null = null;

  /**
   * Predefined theme option for the error messages ('light', 'dark', or 'compact').
   * Accepted values: 'light', 'dark', 'compact'.
   */
  @Input() theme: 'light' | 'dark' | 'compact' = 'light';

  /**
   * Custom formatter function to format error messages dynamically based on the error key and value.
   */
  @Input() errorFormatter: (
    errorKey: string,
    errorValue: unknown,
    controlName?: string
  ) => string | null = () => null;

  /**
   * Controls when the error messages are displayed: on value change, focus, blur, or hover.
   * Accepted values: 'change', 'focus', 'blur', 'hover'.
   */
  @Input() displayOn: 'change' | 'focus' | 'blur' | 'hover' = 'change';

  /**
   * Configurable debounce time for value changes in milliseconds. Default is 300ms.
   */
  @Input() debounceTime = 300;

  /**
   * Optional translation service for localizing error messages.
   * Should implement a `translate()` method that takes a message string and returns the translated version.
   */
  @Input() translationService: {
    translate: (message: string) => string;
  } | null = null;

  /**
   * Optional analytics service for logging errors, useful for tracking user behavior and form issues.
   * Should implement a `logEvent()` method that logs the error event.
   */
  @Input() analyticsService: {
    logEvent?: (eventName: string, eventData: unknown) => void;
  } | null = null;

  /**
   * Hook to customize how logging is handled. Allows integration with various analytics services.
   * Defaults to using `analyticsService.logEvent`.
   */
  @Input() logError: (errorKey: string, controlName?: string) => void =
    this.defaultLogError;

  /**
   * Default messages used when custom messages are not provided.
   */
  @Input() defaultMessages: { [key: string]: string } = {
    required: 'This field is required.',
    minlength: 'The value is too short.',
    maxlength: 'The value is too long.',
    email: 'Please enter a valid email address.',
    pattern: 'The value does not match the required pattern.',
    min: 'The value is too low.',
    max: 'The value is too high.',
  };

  /**
   * Template reference for the associated input element.
   */
  @Input() inputRef!: ElementRef;

  /**
   * Merged styles applied to the error display container.
   * Combines the styles from the selected theme and any custom styles provided via `themeStyles`.
   * This object uses an index signature to allow flexible CSS property-value pairs.
   */
  mergedStyles: { [key: string]: string } = {};

  /**
   * Flag to determine if errors should be displayed based on the control's state and the display trigger.
   */
  shouldDisplayError = false;

  /**
   * Internal state variables to track focus.
   */
  private _focused = false;

  /**
   * Internal state variables to track hover.
   */
  private _hovered = false;

  /**
   * Subscription management to handle clean up.
   */
  private valueChangeSubscription: Subscription | null = null;

  constructor(
    @Optional() @Self() private ngControl: NgControl,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputRef'] && this.inputRef) {
      // Attach input listeners when inputRef is set
      this.attachInputListeners();
    }
  }

  /**
   * Initializes the component and sets up subscriptions to form control value changes.
   * Automatically detects whether the control is provided via reactive forms or template-driven forms.
   */
  ngOnInit() {
    // Use the injected NgControl if control input is not provided (for template-driven forms)
    if (!this.control && this.ngControl) {
      this.control = this.ngControl.control;
    }

    // Validate inputs
    this.validateInputs();

    if (this.control) {
      // Subscribe to value changes with configurable debounce time
      this.valueChangeSubscription = this.control.valueChanges
        .pipe(debounceTime(this.debounceTime), distinctUntilChanged())
        .subscribe({
          next: () => {
            this.updateDisplayErrorState();
            this.cdr.detectChanges();
          },
          error: (err) => this.handleComponentError(err),
        });
    }
  }

  /**
   * Lifecycle hook that is called after Angular has fully initialized the component's view.
   * It is used to attach input listeners.
   */
  ngAfterViewInit() {
    this.mergedStyles = getMergedStyles(
      this.theme,
      this.themeClass,
      this.themeStyles
    );
  }

  /**
   * Returns a list of formatted error messages based on the control's current errors.
   * It uses custom messages, default messages, or a provided error formatter function.
   */
  get errorMessages(): string[] {
    if (!this.control || !this.control.errors) {
      return [];
    }

    const errors = Object.entries(this.control.errors);
    return errors.map(([errorKey, errorValue]) => {
      const controlName = this.control?.parent
        ? this.control.parent.getError(errorKey)
        : undefined;
      const message =
        (this.errorFormatter &&
          this.errorFormatter(errorKey, errorValue, controlName)) ||
        this.customMessages?.[errorKey] ||
        this.getDefaultMessage(errorKey);

      this.logError(errorKey);
      return message;
    });
  }

  /**
   * Provides default error messages for common validation errors.
   * Supports localization through an optional translation service.
   *
   * @param errorKey - The key representing the type of error (e.g., 'required').
   * @returns The default error message or a translated message if a translation service is provided.
   */
  private getDefaultMessage(errorKey: string): string {
    const message = this.defaultMessages[errorKey] || 'Invalid input.';
    return this.translationService
      ? this.translationService.translate(message)
      : message;
  }

  /**
   * Default logging function that uses the provided analytics service if available.
   *
   * @param errorKey - The key representing the type of error (e.g., 'required').
   */
  private defaultLogError(errorKey: string) {
    if (this.analyticsService?.logEvent) {
      this.analyticsService.logEvent('form_error', { error: errorKey });
    }
  }

  /**
   * Attaches input listeners directly to the provided input reference.
   */
  private attachInputListeners() {
    const inputElement = this.inputRef.nativeElement;

    // Ensure listeners are correctly attached
    this.renderer.listen(inputElement, 'focus', this.handleFocus.bind(this));
    this.renderer.listen(inputElement, 'blur', this.handleBlur.bind(this));
    this.renderer.listen(
      inputElement,
      'mouseenter',
      this.handleMouseEnter.bind(this)
    );
    this.renderer.listen(
      inputElement,
      'mouseleave',
      this.handleMouseLeave.bind(this)
    );
  }
  /**
   * Updates the state of whether errors should be displayed based on the control's status and user interactions.
   */
  private updateDisplayErrorState() {
    if (!this.control) {
      this.shouldDisplayError = false;
      return;
    }

    // Update error display state based on current interaction mode
    const isInvalidAndTouched = this.control.invalid && this.control.touched;

    switch (this.displayOn) {
      case 'change':
        this.shouldDisplayError = isInvalidAndTouched || this.control.dirty;
        break;
      case 'focus':
        this.shouldDisplayError = this.control.invalid && this._focused;
        break;
      case 'blur':
        this.shouldDisplayError = isInvalidAndTouched && !this._focused;
        break;
      case 'hover':
        this.shouldDisplayError = this.control.invalid && this._hovered;
        break;
      default:
        this.shouldDisplayError = isInvalidAndTouched;
    }
    this.cdr.detectChanges();
  }

  /**
   * Handles the focus event of the error display container.
   * Sets the internal state variable `_focused` to true and updates the display error state.
   */
  @HostListener('focus', ['$event.target'])
  handleFocus() {
    this._focused = true;
    this.updateDisplayErrorState();
  }

  /**
   * Handles the blur event of the error display container.
   * Sets the internal state variable `_focused` to false and updates the display error state.
   */
  @HostListener('blur', ['$event.target'])
  handleBlur() {
    this._focused = false;
    this.updateDisplayErrorState();
  }

  /**
   * Handles the mouse enter event of the error display container.
   * Sets the internal state variable `_hovered` to true and updates the display error state.
   */
  @HostListener('mouseenter', ['$event.target'])
  handleMouseEnter() {
    this._hovered = true;
    this.updateDisplayErrorState();
  }

  /**
   * Handles the mouse leave event of the error display container.
   * Sets the internal state variable `_hovered` to false and updates the display error state.
   */
  @HostListener('mouseleave', ['$event.target'])
  handleMouseLeave() {
    this._hovered = false;
    this.updateDisplayErrorState();
  }

  /**
   * Cleanup logic to prevent memory leaks by unsubscribing from value changes.
   */
  ngOnDestroy() {
    this.valueChangeSubscription?.unsubscribe();
  }

  /**
   * Validates inputs to ensure they are within expected ranges and types.
   */
  private validateInputs() {
    // Validate theme input
    const validThemes = ['light', 'dark', 'compact'];
    if (!validThemes.includes(this.theme)) {
      console.warn(`Invalid theme '${this.theme}'. Defaulting to 'light'.`);
      this.theme = 'light';
    }

    // Validate displayOn input
    const validDisplayOn = ['change', 'focus', 'blur', 'hover'];
    if (!validDisplayOn.includes(this.displayOn)) {
      console.warn(
        `Invalid displayOn value '${this.displayOn}'. Defaulting to 'change'.`
      );
      this.displayOn = 'change';
    }

    // Validate debounceTime input
    if (this.debounceTime < 0) {
      console.warn(
        `Invalid debounceTime '${this.debounceTime}'. Defaulting to 300ms.`
      );
      this.debounceTime = 300;
    }
  }

  /**
   * Handles component errors and provides a fallback mechanism.
   *
   * @param error - The error object caught during the execution of the component.
   */
  private handleComponentError(error: unknown) {
    console.error('Error detected in SmartErrorDisplayComponent:', error);
    // Display generic error message or highlight the affected input field
    this.shouldDisplayError = true;
    this.mergedStyles = { ...this.mergedStyles, border: '1px solid red' };
    this.cdr.markForCheck();
  }
}
