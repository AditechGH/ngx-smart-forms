# @ngx-smart-forms/smart-input-type

The `SmartInputType` directive enhances the native HTML input element by providing additional validation and formatting capabilities. It allows developers to define a specific input behavior, such as allowing only alphanumeric characters, enforcing email format, or creating custom validation patterns, while supporting native HTML input types like `text`, `email`, `url`, etc.

## Table of contents

- [Key Features](#key-features)
- [Installation](#installation)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Basic Example](#basic-example)
  - [Combine with Native HTML Input Types](#combine-with-native-html-input-types)
  - [Accept Spaces](#accept-spaces)
  - [Case Transformation](#case-transformation)
  - [Language Set Filtering](#language-set-filtering)
  - [Custom Pattern Validation](#custom-pattern-validation)
  - [Debounce Time](#debounce-time)
- [Input Types and Validation](#input-types-and-validation)
- [Custom Validation and Error Handling](#custom-validation-and-error-handling)
- [Properties](#properties)
- [Handling Edge Cases](#handling-edge-cases)
- [Visual Feedback](#visual-feedback)
- [Support](#support)
- [Contributing](#contributing)
- [License](#license)

## Key Features

- **Smart Type Validation**: Enforce various input types such as `alphanumeric`, `numeric`, `alpha`, `email`, `url`, `tel` and custom patterns.
- **Supports Native HTML Types**: Works seamlessly with native HTML input types (e.g., `text`, `email`, `password`), allowing for flexibility when combining `smartType` with standard HTML types.
- **Case Transformation**: Automatically converts input to uppercase or lowercase if specified.
- **Language Set Filtering**: Restricts input to specific character sets based on language (e.g., English, Spanish, French).
- **Debounce Time**: Debounces input events, reducing the frequency of validations for better performance.
- **Pattern Matching**: Supports the use of a custom regex pattern for advanced input validation.
- **Form Control Integration**: Works seamlessly with Angular's reactive forms to provide error feedback directly on form controls.
- **Visual Feedback**: Automatically applies CSS classes to indicate errors (e.g., .has-error).

## Live Demo

Check out a live interactive demo of the `@ngx-smart-forms/smart-input-type` library on StackBlitz:

[![Edit @ngx-smart-forms/smart-input Example](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/stackblitz-starters-xlgvbh)

You can also click [here](https://stackblitz.com/edit/stackblitz-starters-xlgvbh) to open the project in a new tab.

## Installation

To install the library, use npm:

```bash
npm install @ngx-smart-forms/smart-input-type
```

Or use Yarn:

```bash
yarn add @ngx-smart-forms/smart-input-type
```

## Getting Started

To use `@ngx-smart-forms/smart-input-type`, import the `SmartInputType` into your Angular application

```typescript
import { Component } from '@angular/core';
import { SmartInputType } from '@ngx-smart-forms/smart-input-type';

@Component({
  standalone: true, // Indicate that this is a standalone component
  imports: [SmartInputType], // Import necessary modules
  ...
})
export class MyFormComponent { }
```

## Usage

### Basic Example

```html
<input smartType="alphanumeric" />
```

This input will only allow alphanumeric characters (letters and numbers).

### Combine with Native HTML Input Types

You can use `smartType` in conjunction with native HTML types:

```html
<input type="text" smartType="alpha" />
```

The input will only allow alphabetic characters but will still behave as a text input type.

Alternatively, you can apply `smartType` directly to a native HTML type, like a password field:

```html
<input smartType="password" />
```

This will function as a password field but maintain its native behavior.

### Accept Spaces

```html
<input smartType="alphanumeric" [acceptSpace]="true" />
```

Allows alphanumeric characters along with spaces.

### Case Transformation

```html
<input smartType="alpha" case="uppercase" />
```

Automatically converts the input to uppercase.

### Language Set Filtering

```html
<input smartType="text" languageSet="es" />
```

Restricts the input to Spanish alphabet characters (a-zA-Záéíóúñ).

Alternatively, you can apply the language character set directly to the `languageSet` attribute:

```html
<input smartType="text" [languageSet]="'٠١٢٣٤٥٦٧٨٩'" />
```

This will restricts the input to arabic numerals.

### Custom Pattern Validation

```html
<input smartType="pattern" [pattern]="[a-zA-Z0-9]" />
```

Applies a custom regex pattern for validation.

### Debounce Time

```html
<input smartType="alphanumeric" [debounceTime]="300" />
```

Debounces input events by 300 milliseconds, improving performance during rapid input changes.

## Input Types and Validation

The `SmartInputType` directive supports several predefined smart types:

- `alphanumeric`: Allows letters and numbers. Spaces can be optionally allowed using `[acceptSpace]="true"`.
- `alpha`: Allows only letters. Optionally allow spaces with `[acceptSpace]="true"`.
- `numeric`: Allows only numbers. Spaces can be allowed using `[acceptSpace]="true"`.
- `email`: Enforces strict email validation.
- `url`: Enforces strict URL validation.
- `tel`: Enforces strict telephone number validation.
- `pattern`: Allows custom regex patterns to be applied.
- **Native Types**: Supports native HTML types like `text`, `password`, `number`, `email`, etc.

## Custom Validation and Error Handling

The directive integrates with Angular’s form controls to provide error feedback. If validation fails, the directive will set appropriate errors on the form control.

For example, errors like `strictEmail`, `strictUrl`, and `strictTel` can be applied, depending on the validation type.

You can access these errors in your component to provide user feedback:

```typescript
if (myForm.get('email').hasError('strictEmail')) {
  // Handle email validation error
}
```

## Properties

| Property | Type | Default | Description |
|---|---|---|----|
| `smartType` | `string` | '' | Specifies the type of input validation (e.g., `alphanumeric`, `numeric`, `alpha`, etc.). |
| `acceptSpace` | `boolean` | `false` | Whether to accept spaces in the input (only for `alphanumeric`, `numeric` and `alpha`). |
| `case`| `'uppercase'` `'lowercase'` `null`| `null` | Transforms the input value to uppercase or lowercase. |
| `languageSet` | `string` | null | Defines the language set for allowed characters (e.g., en, es, fr). |
| `debounceTime` | `number` | `0` | Delay in milliseconds before applying the validation (useful for handling input events efficiently). |
| `pattern` | `string` `null` | `null` | Custom regex pattern for validation (applies only when `smartType="pattern"`). |

## Handling Edge Cases

- **Unsupported smartType Values**: If an invalid `smartType` is provided, a warning will be displayed in the console.
- **Compatibility with Native Input Types**: If the `smartType` is incompatible with the native input element’s type (e.g., trying to apply `numeric` on a `tel` input), a warning will be issued.
- **Dynamic Changes to Inputs**: The directive reacts to changes in the `smartType` or other properties, re-validating the input when the values change.

## Visual Feedback

When validation fails, the directive applies the `.has-error` class to the input element, allowing for easy styling of invalid fields. You can style the error state in your CSS as follows:

```css
input.has-error {
  border-color: red;
}
```

## Support

If you encounter an issue, you can [create a ticket](https://github.com/AditechGH/ngx-smart-forms/issues)

## Contributing

We welcome contributions! Please see the [CONTRIBUTING.md](../../CONTRIBUTING.md) file for more information on how to get involved.

## License

This library is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
