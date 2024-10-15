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
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';

export interface SmartSelectorOption {
  id: string;
  label: string;
  image?: string; // Optional, in case some options don't have images
}

export const SMART_SELECTOR_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SmartSelector),
  multi: true,
};

@Component({
  selector: 'smart-selector',
  providers: [SMART_SELECTOR_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgTemplateOutlet,
    NgClass,
    NgStyle,
    CdkVirtualScrollViewport,
    ScrollingModule,
  ],
  templateUrl: './smart-selector.component.html',
  styleUrls: ['./smart-selector.component.scss'],
})
export class SmartSelector implements ControlValueAccessor {
  @Input() options: SmartSelectorOption[] = []; // Type-safe options array
  @Input() optionLabel: (option: SmartSelectorOption) => string = (option) =>
    option.label;
  @Input() optionImage: (option: SmartSelectorOption) => string | null = (
    option
  ) => option.image || null;
  @Input() template?: TemplateRef<{ $implicit: SmartSelectorOption }>;
  @Input() theme: 'light' | 'dark' | 'custom' = 'light';
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Input() layout: 'grid' | 'list' | 'custom' = 'list'; // Grid, list, or custom layouts
  @Input() multiSelect = false;
  @Output() optionChanged = new EventEmitter<
    SmartSelectorOption | SmartSelectorOption[]
  >();
  @Output() onSelect = new EventEmitter<SmartSelectorOption>();
  @Output() onDeselect = new EventEmitter<SmartSelectorOption>();

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  @ViewChild('selectorContainer', { static: true }) container!: ElementRef;

  value: SmartSelectorOption[] = [];
  private activeOptionIndex = 0;
  private onTouch: () => void = () => {};
  private onModelChange: (
    value: SmartSelectorOption[] | SmartSelectorOption
  ) => void = () => {};

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
  }

  selectOption(option: SmartSelectorOption) {
    if (!option) {
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
      this.value = [option];
      this.onSelect.emit(option);
    }
    this.onModelChange(this.multiSelect ? this.value : this.value[0]);
    this.onTouch();
    this.optionChanged.emit(this.multiSelect ? this.value : this.value[0]);
  }

  isSelected(option: SmartSelectorOption): boolean {
    if (!option) {
      return false;
    }
    return this.value.some((v) => v.id === option.id);
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
}
