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

export interface SmartSelectorOption {
  id: string;
  label: string;
  image?: string;
}

export const SMART_SELECTOR_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SmartSelector),
  multi: true,
};

export const SMART_SELECTOR_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SmartSelector),
  multi: true,
};

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
  @Input() options: SmartSelectorOption[] = [];
  @Input() optionLabel: (option: SmartSelectorOption) => string = (option) =>
    option.label;
  @Input() optionImage: (option: SmartSelectorOption) => string | null = (
    option
  ) => option.image || null;
  @Input() template?: TemplateRef<{
    $implicit: SmartSelectorOption;
    index: number;
    selected: boolean;
  }>;
  @Input() layout: 'grid' | 'list' = 'list';
  @Input() maxHeight = '300px';
  @Input() multiSelect = false;
  @Input() maxSelection = Infinity;
  @Input() ariaLabel = 'Option';
  @Input() placeholder: string | null = null;
  @Input() noOptionsText = 'No options available';

  @Output() optionChanged = new EventEmitter<
    SmartSelectorOption | SmartSelectorOption[]
  >();
  @Output() onSelect = new EventEmitter<SmartSelectorOption>();
  @Output() onDeselect = new EventEmitter<SmartSelectorOption>();
  @Output() validationErrors = new EventEmitter<ValidationErrors | null>();

  @ViewChild('selectorContainer', { static: true }) container!: ElementRef;

  value: SmartSelectorOption[] = [];
  disabled = false;
  private activeOptionIndex = 0;
  private onTouch: () => void = () => {};
  private onModelChange: (
    value: SmartSelectorOption[] | SmartSelectorOption
  ) => void = () => {};
  private validatorChange = () => {};
  private formControl: FormControl | null = null;
  private valueChangesSubscription: Subscription = new Subscription();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      // Revalidate selected values when options change
      this.value = this.value.filter((v) =>
        this.options.some((option) => option.id === v.id)
      );
      this.validate();
    }
  }

  ngOnInit(): void {
    this.valueChangesSubscription = this.optionChanged.subscribe(() => {
      this.validate();
    });
  }

  ngOnDestroy(): void {
    this.valueChangesSubscription.unsubscribe();
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  registerOnChange(
    fn: (value: SmartSelectorOption[] | SmartSelectorOption) => void
  ): void {
    this.onModelChange = fn;
  }

  writeValue(value: SmartSelectorOption[] | SmartSelectorOption): void {
    this.value = Array.isArray(value) ? value : [value];
    this.optionChanged.emit(this.multiSelect ? this.value : this.value[0]);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

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
      if (this.isSelected(option)) {
        this.value = [];
      } else {
        this.value = [option];
        this.onSelect.emit(option);
      }
    }
    const selectedValue = this.multiSelect ? this.value : this.value[0];
    this.onModelChange(selectedValue);
    this.onTouch();
    this.optionChanged.emit(selectedValue);
    this.validate();
  }

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

  registerOnValidatorChange(fn: () => void): void {
    this.validatorChange = fn;
  }

  triggerValidation(): void {
    this.validatorChange();
  }

  registerFormControl(control: FormControl): void {
    this.formControl = control;
    this.formControl.setValidators(() => this.validate());
    this.formControl.updateValueAndValidity();
  }

  navigateOptions(index: number) {
    if (index < 0) {
      this.activeOptionIndex = this.options.length - 1;
    } else if (index >= this.options.length) {
      this.activeOptionIndex = 0;
    } else {
      this.activeOptionIndex = index;
    }
    const targetElement = this.container.nativeElement.querySelector(
      `#option-${this.activeOptionIndex}`
    );
    targetElement?.focus();
  }

  get ariaActiveDescendant(): string {
    return `option-${this.activeOptionIndex}`;
  }

  isSelected(option: SmartSelectorOption): boolean {
    if (!option || this.disabled) {
      return false;
    }
    return this.value.some((v) => v?.id === option.id);
  }

  selectAll(): void {
    this.value = [...this.options];
    this.optionChanged.emit(this.value);
  }

  deselectAll(): void {
    this.value = [];
    this.optionChanged.emit(this.value);
  }

  areAllSelected(): boolean {
    return this.value.length === this.options.length;
  }

  getAriaLabel(option: SmartSelectorOption): string {
    return `${this.ariaLabel}: ${this.optionLabel(option)}`;
  }

  optionAltText(option: SmartSelectorOption): string {
    return `${this.optionLabel(option)} image`;
  }

  trackByFn(index: number, option: SmartSelectorOption) {
    return option.id;
  }
}
