import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SmartSelector,
  SmartSelectorOption,
  SmartToggleSelection,
} from '@ngx-smart-forms/smart-selector';

@Component({
  selector: 'app-smart-selector-demo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SmartSelector,
    SmartToggleSelection,
  ],
  templateUrl: './smart-selector-demo.component.html',
  styleUrls: ['./smart-selector-demo.component.scss'],
})
export class SmartSelectorDemoComponent implements OnInit {
  form: FormGroup;
  loading = true;

  // Example data with complex objects
  options: SmartSelectorOption[] = [
    { id: 'strength', label: 'Strength' },
    { id: 'endurance', label: 'Endurance' },
    { id: 'flexibility', label: 'Flexibility' },
    { id: 'cardio', label: 'Cardio' },
    { id: 'power', label: 'Power' },
  ];

  largeDataset = [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' },
    { id: '3', label: 'Option 3' },
    { id: '4', label: 'Option 4' },
    { id: '5', label: 'Option 5' },
    { id: '6', label: 'Option 6' },
    { id: '7', label: 'Option 7' },
    { id: '8', label: 'Option 8' },
    { id: '9', label: 'Option 9' },
    { id: '10', label: 'Option 10' },
  ];

  imageOptions: SmartSelectorOption[] = [
    {
      id: 'asanas',
      label: 'Asanas',
      image: 'yoga-pose1.svg',
    },
    {
      id: 'meditation',
      label: 'Meditation',
      image: 'yoga-pose2.svg',
    },
    {
      id: 'chair-pose',
      label: 'Chair',
      image: 'yoga-pose3.svg',
    },
  ];

  filteredOptions = [...this.options];
  currentTheme = 'light-theme';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      singleSelection: [this.options[0]],
      multiSelection: [[this.options[1], this.options[2]]],
      themedSelection: [this.options[3]],
      requiredSelection: [[], Validators.required],
      gridSelection: [this.options[0]],
      customSelection: [[]],
      selectedOptions: [[], Validators.required],
      keyboardSelection: [],
      disabledSelection: [{ value: this.options[0], disabled: true }],
      dynamicSelection: [[]],
      lazySelection: [[]],
    });
  }

  ngOnInit(): void {
    this.form.get('multiSelection')?.valueChanges.subscribe((value) => {
      console.log('Multi-Selection changed:', value);
    });
    this.reload();
  }

  // Custom label and image for advanced options
  getLabel(option: SmartSelectorOption): string {
    return option.label;
  }

  getImage(option: SmartSelectorOption): string | null {
    return option.image || null;
  }

  onOptionChange(event: SmartSelectorOption | SmartSelectorOption[]): void {
    console.log('Option changed:', event);
  }

  toggleDisabledState(): void {
    const control = this.form.get('disabledSelection');
    console.log(control?.disabled);
    if (control?.disabled) {
      control.enable();
    } else {
      control?.disable();
    }
  }

  applyTheme(theme: string) {
    this.currentTheme = `${theme}-theme`;
  }

  filterOptions(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input?.value.toLowerCase() || '';
    this.filteredOptions = this.options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }

  reload() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 3000); // Simulate API call
  }
}
