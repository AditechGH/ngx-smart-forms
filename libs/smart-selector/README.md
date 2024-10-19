# @ngx-smart-forms/smart-selector

## Overview

`@ngx-smart-forms/smart-selector` is a comprehensive Angular library for building rich selection interfaces. It supports **single and multi-selection**, **grid and list layouts**, **custom templates**, and integrates seamlessly with Angular forms. The library is **highly customizable** with theming support, built-in validation, and event-driven workflows. Full accessibility (A11y) ensures your components are usable across all devices and assistive technologies.

## Table of Contents

- [Key Features](#key-features)  
- [Installation](#installation)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)  
- [Usage](#usage)  
  - [Single Selection](#1-single-selection)  
  - [Multi-Selection](#2-multi-selection)  
  - [Grid Layout](#3-custom-grid-layout)  
  - [Selection with Images](#4-selection-with-images)  
  - [Max Selection Validation](#5-max-selection-validation)  
  - [Custom Templates](#6-custom-template-rendering)  
  - [Custom Labels and Placeholders](#7-custom-labels-and-placeholders)  
  - [Select All / Deselect All](#8-select-all--deselect-all)  
- [Properties](#properties)  
- [Events](#events)  
- [Error Handling](#error-handling)  
- [Theming and Styling](#theming-and-styling)  
- [Accessibility (A11y)](#accessibility-a11y)  
- [Performance Considerations](#performance-considerations)  
- [Best Practices and Edge Cases](#best-practices-and-edge-cases)  
- [Support](#support)  
- [Contributing](#contributing)  
- [License](#license)  

## Key Features

- **Single and Multi-Selection**: Choose one or multiple items with ease.  
- **Grid and List Layouts**: Adapt to any UI requirement.  
- **Custom Templates**: Render options with images, icons, or advanced layouts.  
- **Validation Support**: Manage selections with built-in Angular form validators.  
- **Event-Driven**: Capture key events with dedicated callbacks.  
- **Theming**: Use CSS variables for full styling control.  
- **Accessibility**: Compliant with ARIA standards for keyboard and screen reader navigation.  

## Installation

```bash
npm install @ngx-smart-forms/smart-selector
```

Or:

```bash
yarn add @ngx-smart-forms/smart-selector
```

## Live Demo

Check out a live interactive demo of the `@ngx-smart-forms/smart-selector` library on StackBlitz:

[![Edit @ngx-smart-forms/smart-selector Example](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/stackblitz-starters-m8xw15)

You can also click [here](https://stackblitz.com/edit/stackblitz-starters-m8xw15) to open the project in a new tab.

## Getting Started

### Importing and Using `SmartSelector`

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SmartSelector, SmartSelectorOption } from '@ngx-smart-forms/smart-selector';

@Component({
  selector: 'app-selector-demo',
  standalone: true,
  imports: [ReactiveFormsModule, SmartSelector],
  templateUrl: './selector-demo.component.html',
})
export class SelectorDemoComponent {
  form: FormGroup;
  options: SmartSelectorOption[] = [
    { id: '1', label: 'Strength' },
    { id: '2', label: 'Endurance' },
    { id: '3', label: 'Flexibility' },
    { id: '4', label: 'Cardio' },
    { id: '5', label: 'Power' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selection: [null], // Single selection
      multiSelection: [[]], // Multi-selection
    });
  }

  onOptionChange(event: SmartSelectorOption | SmartSelectorOption[]) {
    console.log('Option changed:', event);
  }
}
```

## Usage

### 1. Single Selection

```html
<form [formGroup]="form">
  <smart-selector
    formControlName="selection"
    [options]="options"
    (optionChanged)="onOptionChange($event)"
  ></smart-selector>
</form>
```

### 2. Multi-Selection

```html
<smart-selector
  formControlName="multiSelection"
  [options]="options"
  [multiSelect]="true"
  (optionChanged)="onOptionChange($event)"
></smart-selector>
```

### 3. Custom Grid Layout

```html
<smart-selector
  [layout]="'grid'"
  [options]="options"
  (optionChanged)="onOptionChange($event)"
></smart-selector>
```

### 4. Selection with Images

```html
<smart-selector
  [options]="imageOptions"
  [optionImage]="getImage"
  (optionChanged)="onOptionChange($event)"
></smart-selector>
```

```typescript
  getImage(option: SmartSelectorOption): string | null {
    return option.image || null;
  }
```

### 5. Max Selection Validation

```html
<smart-selector
  [multiSelect]="true"
  [maxSelection]="3"
  [options]="options"
  formControlName="multiSelection"
></smart-selector>
<div *ngIf="form.get('multiSelection')?.errors as errors">
  <div *ngIf="errors['maxSelection']">
    You can only select {{ errors['maxSelection'].maxAllowed }} options.
  </div>
</div>
```

### 6. Custom Template Rendering

```html
<ng-template #customOption let-option let-selected="selected">
  <img [src]="option.image" alt="Option Image" />
  <p [class.selected]="selected">{{ option.label }}</p>
</ng-template>

<smart-selector
  [template]="customOption"
  [options]="options"
  [layout]="'grid'"
></smart-selector>
```

### 7. Custom Labels and Placeholders

```html
<smart-selector
  [placeholder]="'Select an item'"
  [noOptionsText]="'No options available'"
  [ariaLabel]="'Custom Selector'"
  [options]="options"
></smart-selector>
```

### 8. Select All / Deselect All

```html
<!-- Select All / Deselect All Checkbox -->
<label>
  <input type="checkbox" [smartToggleSelection]="selector" />
  Select/Deselect All
</label>

<!-- Smart Selector Component -->
<smart-selector
  #selector
  formControlName="multiSelection"
  [options]="options"
  [multiSelect]="true"
  (optionChanged)="onOptionChange($event)"
></smart-selector>
```

```typescript
import { SmartSelector, SmartToggleSelection } from '@ngx-smart-forms/smart-selector';

@Component({
  selector: 'app-smart-selector-demo',
  standalone: true,
  imports: [
    SmartSelector,
    SmartToggleSelection,
  ],
  templateUrl: './smart-selector-demo.component.html',
  styleUrls: ['./smart-selector-demo.component.scss'],
})
```

## Properties

| **Property**       | **Type**                     | **Default** | **Description**                        |
|--------------------|------------------------------|-------------|----------------------------------------|
| `options`          | `SmartSelectorOption[]`      | `[]`        | Array of selectable options.           |
| `multiSelect`      | `boolean`                    | `false`     | Enable multi-selection mode.           |
| `layout`           | `'list' \| 'grid'`           | `list`      | Layout type (list or grid).            |
| `maxSelection`     | `number`                     | `Infinity`  | Maximum number of selections allowed.  |
| `placeholder`      | `string`                     | `null`      | Placeholder text for empty selections. |
| `noOptionsText`    | `string`                     | `string`    | Message when no options are available. |
| `ariaLabel`        | `string`                     | `'Option'`  | Accessible label for screen readers.   |
| `optionLabel`      | `(option) => string`         | `string`    | Function to display custom labels.     |
| `optionImage`      | `(option) => string \| null` | `string`    | Function to display images for options.|

## Events

| **Event**         | **Description**                                     |
|-------------------|-----------------------------------------------------|
| `optionChanged`   | Triggered when an option is selected or deselected. |
| `onSelect`        | Fired when an option is selected.                   |
| `onDeselect`      | Fired when an option is deselected.                 |
| `validationErrors`| Emitted when validation errors occur.               |

## Error Handling

- **Max Selection Error**: Triggers when the number of selected options exceeds the limit.
- **FormControl Validation**: Integrates with Angular forms for validation and error handling.

## Theming and Styling

Customize the look and feel using the following CSS variables:

```css
smart-selector {
  --selector-background-color: #f5f9fd;
  --selector-text-color: #333;
  --selector-active-background-color: #007bff;
  --selector-active-text-color: #fff;
  --selector-hover-background-color: #e9ecef;
  --selector-hover-text-color: #000;
  --selector-item-spacing: 10px;
  --selector-item-padding: 15px;
  --selector-item-border-radius: 4px;
  --grid-columns: repeat(auto-fit, minmax(150px, 1fr));
}
```

## Accessibility (A11y)

- **ARIA Attributes**: Supports `role="listbox"` and `aria-multiselectable` attributes.
- **Keyboard Navigation**: Use arrow keys for option navigation.
- **Screen Reader Support**: Fully accessible with screen readers.

## Performance Considerations

- **OnPush Change Detection**: Improves rendering performance.
- **Lazy Rendering**: Recommended for large datasets.
- **Subscription Management**: Unsubscribe from event subscriptions to prevent memory leaks.

## Best Practices and Edge Cases

1. **No Options Available**: Use `noOptionsText` for better UX.  
2. **Grid Layout for Large Datasets**: Enhances scrolling performance.  
3. **Handle Validation in Multi-Select Mode**: Set `maxSelection` to avoid excessive selections.  
4. **Custom Templates**: Use templates for advanced UI needs.

## Support

If you encounter an issue, you can [create a ticket](https://github.com/AditechGH/ngx-smart-forms/issues)

## Contributing

We welcome contributions! Please see the [CONTRIBUTING.md](https://github.com/AditechGH/ngx-smart-forms/blob/main/CONTRIBUTING.md) file for more information on how to get involved.

## License

This library is licensed under the MIT License - see the [LICENSE](https://github.com/AditechGH/ngx-smart-forms/blob/main/LICENSE) file for details.
