# @ngx-smart-forms/smart-file-upload

The `SmartFileUpload` component is an Angular library that simplifies file uploads with advanced validation, theming, and customization capabilities. It supports multiple file uploads, drag-and-drop functionality, and image previews, while integrating seamlessly with Angular forms. This component is designed to be highly customizable and can handle various file types, sizes, and image dimensions, all while letting the form control handle error messaging just like native Angular form validators.

## Table of Contents

- [Key Features](#key-features)
- [Installation](#installation)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Basic Example](#basic-example)
  - [Template-Driven Forms Example](#template-driven-forms-example)
  - [Multiple File Uploads](#multiple-file-uploads)
  - [File Type and Size Validation](#file-type-and-size-validation)
  - [Image Dimension Validation](#image-dimension-validation)
  - [Custom Preview Support](#custom-preview-support)
  - [Debounce Validation](#debounce-validation)
  - [Lazy Loading Previews](#lazy-loading-previews)
  - [Theming Support](#theming-support)
- [Accessibility (A11y)](#accessibility-a11y)
- [Event Callbacks](#event-callbacks)
- [Properties](#properties)
- [Custom Validators](#custom-validators)
- [Error Handling](#error-handling)
- [Handling Edge Cases](#handling-edge-cases)
- [Performance Considerations](#performance-considerations)
- [Support](#support)
- [Contributing](#contributing)
- [License](#license)

## Key Features

- **Multiple File Uploads**: Supports single or multiple file uploads with type, size, and count restrictions.
- **File Type Validation**: Restrict file uploads by MIME type (e.g., images, PDFs) using the `accept` attribute.
- **File Size Validation**: Enforce maximum file size limits for each uploaded file.
- **Image Dimension Validation**: Optionally validate image dimensions (max width and height).
- **Drag-and-Drop Support**: Allows drag-and-drop file uploads, enhancing user experience.
- **File Preview Support**: Displays image previews for uploaded files, with lazy loading for performance.
- **Customizable Error Handling**: Developers can define custom error messages in the form control based on validation results.
- **Debounce Validation**: Control the frequency of file input validation using the `debounceTime` property.
- **Lazy Loading Previews**: Automatically load image previews only when they are in view, improving performance for large images.
- **Theming Support**: Supports light, dark, and custom themes with flexible CSS variable overrides.
- **Seamless Form Control Integration**: Integrates with Angular reactive and template-driven forms, allowing validation errors to be managed by the form control.

## Installation

Install the `@ngx-smart-forms/smart-file-upload` library using npm or yarn:

```bash
npm install @ngx-smart-forms/smart-file-upload
```

Or using Yarn:

```bash
yarn add @ngx-smart-forms/smart-file-upload
```

## Live Demo

Check out a live interactive demo of the `@ngx-smart-forms/smart-file-upload` library on StackBlitz:

[![Edit @ngx-smart-forms/smart-file-upload Example](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/stackblitz-starters-xwwoqh)

You can also click [here](https://stackblitz.com/edit/stackblitz-starters-xwwoqh) to open the project in a new tab.

## Getting Started

To start using the `SmartFileUpload` library in your Angular project, follow these steps:

## Import the Component

```typescript
import { SmartFileUpload } from '@ngx-smart-forms/smart-file-upload';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, SmartFileUpload],
  templateUrl: './your-component.html',
})
export class YourComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fileUpload: [null, []], // Add custom validators if needed
    });
  }
}
```

## Usage

### Basic Example

Here’s how you can use the `SmartFileUpload` component in a form:

```html
<form [formGroup]="form">
  <smart-file-upload formControlName="fileUpload"></smart-file-upload>

  <!-- Display errors -->
  <div *ngIf="form.get('fileUpload')?.errors as errors">
    <div *ngIf="errors['maxSize']">File size should not exceed {{ errors['maxSize'].maxSize / 1024 / 1024 }} MB.</div>
    <div *ngIf="errors['invalidType']">Invalid file type. Allowed: {{ errors['invalidType'].allowedTypes }}.</div>
  </div>
</form>
```

### Template-Driven Forms Example

```html
<form #uploadForm="ngForm">
  <smart-file-upload
    name="fileUpload"
    [(ngModel)]="uploadedFiles"
    accept="image/*,application/pdf"
    [multiple]="true"
    [maxFileSize]="5 * 1024 * 1024"
    [maxFiles]="5"
    [showPreview]="true"
  ></smart-file-upload>

  <!-- Display errors -->
  <div *ngIf="uploadForm.controls['fileUpload']?.errors as errors">
    <div *ngIf="errors['maxFiles']">You can upload up to {{ errors['maxFiles'].maxFiles }} files.</div>
    <div *ngIf="errors['invalidType']">Invalid file type. Allowed: {{ errors['invalidType'].allowedTypes }}.</div>
    <div *ngIf="errors['maxWidth']">Image width should not exceed {{ errors['maxWidth'].maxWidth }}px.</div>
    <div *ngIf="errors['maxHeight']">Image height should not exceed {{ errors['maxHeight'].maxHeight }}px.</div>
  </div>
</form>

```

### Multiple File Uploads

To allow multiple file uploads, enable the `multiple` attribute:

```html
<smart-file-upload formControlName="fileUpload" [multiple]="true"></smart-file-upload>
```

### File Type and Size Validation

You can restrict file types using the `accept` attribute and limit file sizes using `maxFileSize`:

```html
<smart-file-upload 
  formControlName="fileUpload" 
  accept="image/*,application/pdf" 
  [maxFileSize]="5 * 1024 * 1024" 
></smart-file-upload>
```

This restricts uploads to images and PDFs and enforces a maximum file size of 5 MB.

### Image Dimension Validation

To enforce maximum image dimensions, use the `maxWidth` and `maxHeight` properties:

```html
<smart-file-upload 
  formControlName="fileUpload" 
  [maxWidth]="1920" 
  [maxHeight]="1080"
></smart-file-upload>
```

### Custom Preview Support

To display image previews for uploaded files, enable the `showPreview` option:

```html
<smart-file-upload formControlName="fileUpload" [showPreview]="true"></smart-file-upload>
```

### Debounce Validation

To avoid performing validation checks too frequently, especially useful when uploading large files or multiple files, you can control the debounce time using the `debounceTime` property.

```html
<smart-file-upload
  formControlName="fileUpload"
  [multiple]="true"
  [debounceTime]="300"
  [maxFileSize]="5 * 1024 * 1024"
  [showPreview]="true"
></smart-file-upload>
```

### Lazy Loading Previews

To improve performance for large images, the component supports lazy loading of image previews. Previews are only loaded when the image enters the viewport. This is enabled by default.

```html
<smart-file-upload
  formControlName="fileUpload"
  [multiple]="true"
  accept="image/*"
  [showPreview]="true"
  [lazyLoadPreviews]="true"
></smart-file-upload>
```

### Theming Support

The `SmartFileUpload` component supports light, dark, and custom themes using CSS variables for flexible styling. You can apply predefined themes or customize the component’s look by overriding CSS variables.

Example: Dark Theme

```html
<smart-file-upload formControlName="fileUpload" theme="dark"></smart-file-upload>
```

Custom Theme Example

You can override CSS variables to create a custom theme:

```html
<smart-file-upload formControlName="fileUpload" theme="custom"></smart-file-upload>
```

```css
smart-file-upload {
  --file-upload-border-color: #007bff;
  --file-upload-background-color: #e9f7fd;
  --file-upload-text-color: #007bff;
}
```

Customizable CSS Variables

- `--file-upload-border-color`
- `--file-upload-border-hover-color`
- `--file-upload-background-color`
- `--file-preview-background-color`
- `--file-preview-border-color`
- `--file-upload-text-color`
- `--file-thumbnail-width`
- `--file-thumbnail-height`
- `--file-upload-file-name-color`
- `--file-upload-file-size-color`
- `--remove-btn-color`
- `--remove-btn-hover-color`

## Accessibility (A11y)

The `SmartFileUpload` component is designed with accessibility in mind:

- **Keyboard Accessibility**: Users can interact with the file upload area using the keyboard. Pressing Enter or Space triggers the file input dialog.
- **ARIA Attributes**: The component uses ARIA attributes such as aria-invalid when there are validation errors. You can extend this by adding more ARIA attributes as needed for screen readers.

## Event Callbacks

To capture events when files are selected or dragged into the component, you can use Angular event bindings:

```html
<smart-file-upload 
  formControlName="fileUpload"
  (fileSelected)="onFileSelected($event)"
  (dragOver)="onDragOver($event)"
  (fileDrop)="onDrop($event)"
></smart-file-upload>
```

## Properties

Here are the main properties available for configuration:

| Property | Type | Default Value | Description |
|---|---|---|----|
| `accept` | `string` | `'image/*'` | Defines the allowed MIME types for file uploads (e.g., `image/*,application/pdf`). |
| `multiple` | `boolean` | `false` | Allows multiple files to be selected. |
| `maxFileSize` | `number` | `5 * 1024 * 1024` | Maximum file size (in bytes) for each uploaded file. |
| `maxFiles` | `number` | `10` | Maximum number of files allowed for upload when `multiple` is enabled. |
| `maxWidth` | `number` | `null` | Maximum width for image files (optional). |
| `maxHeight` | `number` | `null` | Maximum height for image files (optional). |
| `showPreview` | `boolean` | `false` | Enables image previews for uploaded files. |
| `debounceTime` | `number` | `0` | Time in milliseconds to debounce the file input validation. |
| `lazyLoadPreviews` | `boolean` | `true` | Lazy load image previews for large image files. |
| `theme` | `'light' \| 'dark' \| 'custom'` | `'light'` | Theming support for light, dark, or custom themes. |

## Custom Validators

You can define custom validators in your form group and apply them to the `fileUpload` control:

```typescript
this.form = this.fb.group({
  fileUpload: [null, [Validators.required]], // Require at least one file to be uploaded
});
```

## Error Handling

The `SmartFileUpload` library passes validation errors to the form control, allowing developers to define their own error messages in the template. The following error types are available:

- `maxFiles`: When the number of selected files exceeds the `maxFiles` limit.
- `maxSize`: When a file exceeds the `maxFileSize` limit.
- `invalidType`: When a file type doesn't match the `accept` MIME types.
- `maxWidth`: When an image exceeds the `maxWidth` limit.
- `maxHeight`: When an image exceeds the `maxHeight` limit.
- `invalidImage`: When the image is invalid or cannot be loaded.

## Handling Edge Cases

- **Invalid Files**: The library will automatically reject files that do not match the allowed types, size, or dimension limits.
- **No Errors Displayed**: If the form control is valid, no errors will be displayed, just like with other Angular form fields.

## Performance Considerations

When uploading large files or multiple files, consider the following performance tips:

- **Debounce Validation**: Use the `debounceTime` property to avoid running validation too frequently.
- **Lazy Load Previews**: For large images, consider lazy loading previews to reduce memory and rendering overhead.
- **Memory Management**: The component automatically revokes object URLs for image previews to manage memory efficiently.

## Support

If you encounter any issues or have questions, feel free to [open an issue](https://github.com/AditechGH/ngx-smart-forms/issues) on GitHub.

## Contributing

We welcome contributions from the community! Please see the [CONTRIBUTING.md](https://github.com/AditechGH/ngx-smart-forms/blob/main/CONTRIBUTING.md) for guidelines on how to contribute to the project.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/AditechGH/ngx-smart-forms/blob/main/LICENSE) file for more information.
