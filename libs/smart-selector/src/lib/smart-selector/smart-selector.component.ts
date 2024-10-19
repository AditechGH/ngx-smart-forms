/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  Validator,
  NG_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Interface for individual options in the SmartSelector.
 */
export interface SmartSelectorOption {
  id: string;
  label: string;
  image?: string;
}

/**
 * Provides NG_VALUE_ACCESSOR to integrate with Angular forms.
 */
export const SMART_SELECTOR_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SmartSelector),
  multi: true,
};

/**
 * Provides NG_VALIDATORS to allow validation with Angular forms.
 */
export const SMART_SELECTOR_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SmartSelector),
  multi: true,
};

/**
 * SmartSelector component offers advanced option selection with single or multi-select modes.
 *
 * @selector smart-selector
 * @standalone true
 * @imports [NgForOf, NgIf, NgTemplateOutlet, NgClass, NgStyle]
 * @providers [SMART_SELECTOR_ACCESSOR, SMART_SELECTOR_VALIDATORS]
 * @templateUrl ./smart-selector.component.html
 * @styleUrls ['./smart-selector.component.scss']
 * @changeDetection ChangeDetectionStrategy.OnPush
 *
 * @implements ControlValueAccessor, Validator, OnChanges, OnInit, OnDestroy
 *
 * @property {SmartSelectorOption[]} options - List of selectable options.
 * @property {string} layout - Determines layout style ('grid' or 'list').
 * @property {boolean} multiSelect - Enables multiple selections.
 * @property {number} maxSelection - Maximum number of allowed selections.
 * @property {TemplateRef} template - Custom template for rendering options.
 * @property {boolean} disabled - Disables the selector.
 * @property {EventEmitter} optionChanged - Emits selected option(s).
 */
@Component({
  selector: 'smart-selector',
  providers: [SMART_SELECTOR_ACCESSOR, SMART_SELECTOR_VALIDATORS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgForOf, NgIf, NgTemplateOutlet, NgClass, NgStyle],
  templateUrl: './smart-selector.component.html',
  styleUrls: ['./smart-selector.component.scss'],
})
export class SmartSelector
  implements ControlValueAccessor, Validator, OnChanges, OnInit, OnDestroy
{
  /**
   * List of selectable options for the SmartSelector.
   */
  @Input() options: SmartSelectorOption[] = [];

  /**
   * Function to extract option label.
   */
  @Input() optionLabel: (option: SmartSelectorOption) => string = (option) =>
    option.label;

  /**
   * Function to extract the image from each option, if available.
   */
  @Input() optionImage: (option: SmartSelectorOption) => string | null = (
    option
  ) => option.image || null;

  /**
   * Custom template for rendering options.
   */
  @Input() template?: TemplateRef<{
    $implicit: SmartSelectorOption;
    index: number;
    selected: boolean;
  }>;

  /**
   * Determines layout style ('grid' or 'list').
   */
  @Input() layout: 'grid' | 'list' = 'list';

  /**
   * Maximum height of the selector's scrollable area.
   */
  @Input() maxHeight = '300px';

  /**
   * Enables multiple selections.
   */
  @Input() multiSelect = false;

  /**
   * Maximum number of allowed selections.
   */
  @Input() maxSelection = Infinity;

  /**
   * Aria label for individual options.
   */
  @Input() ariaLabel = 'Option';

  /**
   * Placeholder text for the selector.
   */
  @Input() placeholder: string | null = null;

  /**
   * Text to display when no options are available.
   */
  @Input() noOptionsText = 'No options available';

  /**
   * Emits the selected option(s) when a change occurs.
   */
  @Output() optionChanged = new EventEmitter<
    SmartSelectorOption | SmartSelectorOption[]
  >();

  /**
   * Emits the selected option when it is selected.
   */
  @Output() onSelect = new EventEmitter<SmartSelectorOption>();

  /**
   * Emits the deselected option when it is deselected.
   */
  @Output() onDeselect = new EventEmitter<SmartSelectorOption>();

  /**
   * Emits validation errors, if any.
   */
  @Output() validationErrors = new EventEmitter<ValidationErrors | null>();

  /**
   * Reference to the container element of the selector.
   */
  @ViewChild('selectorContainer', { static: true }) container!: ElementRef;

  value: SmartSelectorOption[] = []; // Holds selected values
  disabled = false; // Indicates whether the selector is disabled
  private activeOptionIndex = 0; // Active option for keyboard navigation
  private onTouch: () => void = () => {}; // Touch event callback
  private onModelChange: (
    value: SmartSelectorOption[] | SmartSelectorOption
  ) => void = () => {}; // Model change callback
  private validatorChange = () => {}; // Validator change callback
  private formControl: FormControl | null = null; // Form control reference
  private valueChangesSubscription: Subscription = new Subscription(); // Subscription to option changes

  /**
   * Gets the ARIA active descendant for accessibility.
   */
  get ariaActiveDescendant(): string {
    return `option-${this.activeOptionIndex}`;
  }

  /**
   * Handles input changes, ensuring valid selected values.
   * @param {SimpleChanges} changes - Input property changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      // Revalidate selected values when options change
      this.value = this.value.filter((v) =>
        this.options.some((option) => option.id === v.id)
      );
      this.validate();
    }
  }

  /**
   * Initializes the component and subscribes to option changes.
   */
  ngOnInit(): void {
    this.valueChangesSubscription = this.optionChanged.subscribe(() => {
      this.validate();
    });
  }

  /**
   * Cleans up subscriptions on component destruction.
   */
  ngOnDestroy(): void {
    this.valueChangesSubscription.unsubscribe();
  }

  /**
   * Registers a function to be called on touch events.
   * @param {Function} fn - Callback function.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  /**
   * Registers a function to handle value changes.
   * @param {Function} fn - Callback function.
   */
  registerOnChange(
    fn: (value: SmartSelectorOption[] | SmartSelectorOption) => void
  ): void {
    this.onModelChange = fn;
  }

  /**
   * Updates the selected value.
   * @param {SmartSelectorOption[] | SmartSelectorOption} value - The new value.
   */
  writeValue(value: SmartSelectorOption[] | SmartSelectorOption): void {
    this.value = Array.isArray(value) ? value : [value];
    this.optionChanged.emit(this.multiSelect ? this.value : this.value[0]);
  }

  /**
   * Sets the disabled state of the component.
   * @param {boolean} isDisabled - Whether the component is disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Selects or deselects an option.
   * @param {SmartSelectorOption} option - The selected option.
   */
  selectOption(option: SmartSelectorOption) {
    if (!option || this.disabled) {
      return;
    }

    if (this.multiSelect) {
      if (this.isSelected(option)) {
        this.value = this.value.filter((v) => v.id !== option.id);
        this.onDeselect.emit(option);
      } else {
        this.value = [...this.value, option];
        this.onSelect.emit(option);
      }
    } else {
      this.value = this.isSelected(option) ? [] : [option];
      this.onSelect.emit(option);
    }
    const selectedValue = this.multiSelect ? this.value : this.value[0];
    this.onModelChange(selectedValue);
    this.onTouch();
    this.optionChanged.emit(selectedValue);
    this.validate();
  }

  /**
   * Validates the selected values.
   * @returns {ValidationErrors | null} - Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    const errors: ValidationErrors = {};

    if (this.multiSelect && this.value.length > this.maxSelection) {
      errors['maxSelection'] = {
        actual: this.value.length,
        maxAllowed: this.maxSelection,
      };
    }

    this.formControl?.setErrors(Object.keys(errors).length ? errors : null);
    this.validationErrors.emit(Object.keys(errors).length ? errors : null);
    return Object.keys(errors).length ? errors : null;
  }

  /**
   * Registers a function for validation changes.
   * @param {Function} fn - Callback function.
   */
  registerOnValidatorChange(fn: () => void): void {
    this.validatorChange = fn;
  }

  /**
   * Triggers validation on the form control.
   */
  triggerValidation(): void {
    this.validatorChange();
  }

  /**
   * Registers a form control for validation.
   * @param {FormControl} control - The form control to validate.
   */
  registerFormControl(control: FormControl): void {
    this.formControl = control;
    this.formControl.setValidators(() => this.validate());
    this.formControl.updateValueAndValidity();
  }

  /**
   * Handles keyboard navigation between options.
   * @param {number} index - Index to navigate to.
   */
  navigateOptions(index: number) {
    this.activeOptionIndex =
      (index + this.options.length) % this.options.length;
    const targetElement = this.container.nativeElement.querySelector(
      `#option-${this.activeOptionIndex}`
    );
    targetElement?.focus();
  }

  /**
   * Handles the keydown event for options to prevent default scrolling.
   * @param {SmartSelectorOption} option - The option to select.
   * @param {Event} event - The keydown event.
   */
  onOptionKeydown(option: SmartSelectorOption, event: Event): void {
    event.preventDefault(); // Prevents the page from scrolling
    this.selectOption(option);
  }

  /**
   * Checks if an option is selected.
   * @param {SmartSelectorOption} option - Option to check.
   * @returns {boolean} - Whether the option is selected.
   */
  isSelected(option: SmartSelectorOption): boolean {
    if (!option || this.disabled) {
      return false;
    }
    return this.value.some((v) => v?.id === option.id);
  }

  /**
   * Selects all available options.
   */
  selectAll(): void {
    this.value = [...this.options];
    this.optionChanged.emit(this.value);
  }

  /**
   * Deselects all selected options.
   */
  deselectAll(): void {
    this.value = [];
    this.optionChanged.emit(this.value);
  }

  /**
   * Toggles the selection state of all options.
   */
  areAllSelected(): boolean {
    return this.value.length === this.options.length;
  }

  /**
   * Gets the label for an option.
   * @param {SmartSelectorOption} option - The option to get the label for.
   * @returns {string} - The label of the option.
   */
  getAriaLabel(option: SmartSelectorOption): string {
    return `${this.ariaLabel}: ${this.optionLabel(option)}`;
  }

  /**
   * Gets the image for an option.
   * @param {SmartSelectorOption} option - The option to get the image for.
   * @returns {string} - The image URL of the option.
   */
  optionAltText(option: SmartSelectorOption): string {
    return `${this.optionLabel(option)} image`;
  }

  /**
   * Tracks options by their unique ID.
   * @param {number} index - Index of the option.
   * @param {SmartSelectorOption} option - The option to track.
   * @returns {string} - The unique ID of the option.
   */
  trackByFn(index: number, option: SmartSelectorOption) {
    return option.id;
  }
}
