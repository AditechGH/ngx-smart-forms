# @ngx-smart-forms/smart-error-display

The `@ngx-smart-forms/smart-error-display` is an advanced Angular component that displays validation errors for form controls or form groups. It supports both reactive and template-driven forms, making it a versatile and unified solution for form validation message display. The component offers theming, localization, custom error formatting, accessibility features, performance optimizations, and optional analytics integration, making it suitable for production use in any Angular application.

## Table of Contents

- [Key Features](#key-features)
- [Live Demo](#live-demo)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Basic Usage with Reactive Forms](#basic-usage-with-reactive-forms)
  - [Usage with Template-Driven Forms](#usage-with-template-driven-forms)
- [Advanced Features](#advanced-features)
  - [Custom Error Messages](#custom-error-messages)
  - [Custom Logging Integration](#custom-logging-integration)
  - [Configurable Debounce Time](#configurable-debounce-time)
  - [Integration with Translation Service (i18n)](#integration-with-translation-service-i18n)
  - [Custom Error Formatter](#custom-error-formatter)
  - [Error Display Control (Change, Focus, Blur, Hover)](#error-display-control-change-focus-blur-hover)
- [Theming with Custom Styles and Classes](#theming-with-custom-styles-and-classes)
- [Predefined Themes](#predefined-themes)
- [Handling Edge Cases](#handling-edge-cases)
- [Support](#support)
- [Contributing](#contributing)
- [License](#license)

## Key Features

- **Support for Reactive and Template-Driven Forms**: Seamlessly works with both types of Angular forms without additional configuration.
- **Accessibility**: Uses ARIA attributes to announce errors to screen readers, ensuring accessibility compliance.
- **Localization (i18n)**: Supports integration with translation services to provide error messages in multiple languages.
- **Custom Error Formatting**: Allows custom functions to dynamically format error messages based on error type and context.
- **Flexible Error Display Control**: Controls when error messages are displayed (on value change, focus, blur, or hover).
- **Configurable Debounced Error Display**: Allows adjustable debounce time to minimize rapid updates to error messages, enhancing user experience.
- **Custom Logging Integration**: Offers custom logging hooks for analytics, enabling tracking of error patterns and user interactions..
- **Predefined Themes and Styling**: Offers customizable styles and predefined themes (light, dark, compact).
- **Performance Optimization**: Utilizes `OnPush` change detection strategy for optimal performance in large forms.
- **Error Handling**: Includes fallback mechanisms to handle and display errors gracefully, highlighting affected input fields when needed.

## Live Demo

Check out a live interactive demo of the `@ngx-smart-forms/smart-error-display` component on StackBlitz:

[![Edit @ngx-smart-forms/smart-error-display Example](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/stackblitz-starters-xlgvbh)

You can also click [here](https://stackblitz.com/edit/stackblitz-starters-xlgvbh) to open the project in a new tab.

## Installation

To install the library, use npm:

```bash
npm install @ngx-smart-forms/smart-error-display
```

Or use Yarn:

```bash
yarn add @ngx-smart-forms/smart-error-display
```

## Getting Started

To use `@ngx-smart-forms/smart-error-display`, import the `SmartErrorDisplay` component into your Angular application

```typescript
import { Component } from '@angular/core';
import { SmartErrorDisplay } from '@ngx-smart-forms/smart-error-display';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

@Component({
  standalone: true, // Indicate that this is a standalone component
  imports: [ReactiveFormsModule, SmartErrorDisplay], // Import necessary modules
  ...
})
export class MyFormComponent { }
```

### Basic Usage with Reactive Forms

The basic implementation of the `@ngx-smart-forms/smart-error-display` with reactive forms.

```html
<form [formGroup]="form">
  <label for="username">Username</label>
  <input id="username" formControlName="username" />
  <smart-error-display [control]="form.get('username')"></smart-error-display>

  <label for="password">Password</label>
  <input id="password" formControlName="password" type="password" />
  <smart-error-display
    [control]="form.get('password')"
    [customMessages]="{ minlength: 'Password is too short.' }"
  ></smart-error-display>

  <button type="submit" [disabled]="form.invalid">Submit</button>
</form>
```

### Usage with Template-Driven Forms

The `SmartErrorDisplay` component also supports template-driven forms by automatically detecting the form control when used with `ngModel`. However, for the component to display the correct validation messages, it is essential to bind the appropriate control using template reference variables.

```html
<form #form="ngForm">
  <label for="username">Username</label>
  <!-- Assigning #username as a reference variable -->
  <input
    id="username"
    name="username"
    ngModel
    required
    minlength="3"
    #username="ngModel"
  />
  <!-- Binding the control to the SmartErrorDisplay -->
  <smart-error-display
    [control]="username.control"
    [customMessages]="{ required: 'Username is required.' }"
  ></smart-error-display>

  <label for="email">Email</label>
  <!-- Assigning #email as a reference variable -->
  <input id="email" name="email" ngModel required email #email="ngModel" />
  <!-- Binding the control to the SmartErrorDisplay -->
  <smart-error-display
    [control]="email.control"
    [customMessages]="{ email: 'Invalid email format.' }"
  ></smart-error-display>

  <button type="submit" [disabled]="form.invalid">Submit</button>
</form>
```

## Advanced Features

### Custom Error Messages

Custom error messages can be provided using the `customMessages` input.

```html
<smart-error-display
  [control]="form.get('email')"
  [customMessages]="{
    required: 'Email is required.',
    email: 'Please provide a valid email address.'
  }"
></smart-error-display>
```

### Custom Logging Integration

Log form errors to an analytics service or custom logging function to track and improve user experience.

```typescript
// Custom Logging Function
customLogError = (controlName: string, errorKey: string) => {
  console.log(`Logging error for ${controlName}: ${errorKey}`);
};
```

```html
<smart-error-display
  [control]="form.get('username')"
  [analyticsService]="customLogError"
></smart-error-display>
```

### Configurable Debounce Time

Control the debounce time for value changes to adjust responsiveness.

```html
<smart-error-display
  [control]="form.get('username')"
  [debounceTime]="500"
></smart-error-display>
```

### Integration with Translation Service (i18n)

Integrate with a translation service to localize error messages.

```typescript
// app.component.ts
  @Input() translationService: {
     translate: (message: string) => string;
  } = {
    translate: (message: string) => {
      // Mock translation service; replace with your translation logic
      const translations: { [key: string]: string } = {
        'This field is required.': 'Este campo es obligatorio.',
      };
      return translations[message] || message;
    },
  };
```

```html
<smart-error-display
  [control]="form.get('email')"
  [translationService]="translationService"
></smart-error-display>
```

### Custom Error Formatter

Use the errorFormatter input to provide a custom function for formatting error messages.

```typescript
// app.component.ts
customFormatter(errorKey: string, errorValue: unknown): string | null {
  if (errorKey === 'minlength') {
    const value = errorValue as { requiredLength: number };
    return `Minimum length is ${value.requiredLength} characters.`;
  }
  return null;
}
```

```html
<smart-error-display
  [control]="form.get('username')"
  [errorFormatter]="customFormatter"
></smart-error-display>
```

### Error Display Control (Change, Focus, Blur, Hover)

Control when the error messages are displayed using the `displayOn` input.

```html
<form [formGroup]="form">
  <label for="username">Username</label>
  <input #usernameRef id="username" formControlName="username" />
    <!-- Display errors on blur -->
  <smart-error-display
    [control]="form.get('username')"
    [inputRef]="usernameElement"
    displayOn="blur"
  ></smart-error-display>


  <label for="email">Email</label>
  <input #emailRef id="email" formControlName="email" />
    <!-- Display errors on hover -->
  <smart-error-display
    [control]="form.get('email')"
    [inputRef]="emailElement"
    displayOn="hover"
  ></smart-error-display>

  <label for="password">Password</label>
  <input #passwordRef id="password" formControlName="password" />
   <!-- Display errors on input focus -->
  <smart-error-display
    [control]="form.get('password')"
    [inputRef]="passwordElement"
    displayOn="focus"
  ></smart-error-display>
</form>
```

```Typescript
  @ViewChild('usernameRef', {static: true }) usernameElement!: ElementRef;
  @ViewChild('emailRef', {static: true }) emailElement!: ElementRef;
  @ViewChild('passwordRef', {static: true }) passwordElement!: ElementRef;
```

### Theming with Custom Styles and Classes

You can style the error display using inline styles or custom classes.

```html
<!-- Using Inline Styles -->
<smart-error-display
  [control]="form.get('username')"
  [themeStyles]="{ color: 'blue', fontSize: '14px' }"
></smart-error-display>

<!-- Using Custom CSS Classes -->
<style>
  .custom-error {
    color: green;
    font-weight: bold;
    font-size: 14px;
  }
</style>

<smart-error-display
  [control]="form.get('email')"
  themeClass="custom-error"
></smart-error-display>
```

### Predefined Themes

The component supports predefined themes (`light`, `dark`, `compact`) that can be applied using the `theme` input. The logic ensures that custom class styles take precedence if specified, giving full control to the user.

```html
<smart-error-display [control]="form.get('age')" theme="dark"></smart-error-display>
```

### Handling Edge Cases

- **No Errors or Control**: The component handles cases where no control is provided or when there are no errors by not displaying any content.
- **Multiple errors on the same field**: You can handle multiple errors and display each error message separately by iterating through the errors.
- **Conditional error messages**: Customize error messages based on user actions or form conditions.

## Support

If you encounter an issue, you can [create a ticket](https://github.com/AditechGH/ngx-smart-forms/issues)

## Contributing

We welcome contributions! Please see the [CONTRIBUTING.md](https://github.com/AditechGH/ngx-smart-forms/blob/main/CONTRIBUTING.md) file for more information on how to get involved.

## License

This library is licensed under the MIT License - see the [LICENSE](https://github.com/AditechGH/ngx-smart-forms/blob/main/LICENSE) file for details.
