# ngx-smart-forms Library Collection

`ngx-smart-forms` is a collection of Angular libraries designed to enhance form handling and validation in Angular applications. Each library in this workspace offers specific functionality aimed at simplifying form creation, validation, and error display, while providing advanced customization and performance optimizations.

## Table of Contents

- [About the Project](#about-the-project)
- [Libraries](#libraries)
  - [@ngx-smart-forms/smart-input-type](#ngx-smart-formssmart-input-type)
  - [@ngx-smart-forms/smart-error-display](#ngx-smart-formssmart-error-display)
  - [@ngx-smart-forms/smart-file-upload](#ngx-smart-formssmart-file-upload)
  - [@ngx-smart-forms/smart-selector](#ngx-smart-formssmart-selector)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Building the Libraries](#building-the-libraries)
  - [Running Tests](#running-tests)
  - [Running the Demo App](#running-the-demo-app)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## About the Project

The `ngx-smart-forms` project is a unified workspace containing multiple Angular libraries that provide tools for creating efficient, user-friendly forms. These libraries cover everything from error display components, customizable inputs, to dynamic form builders and advanced file upload capabilities.

The main goal of this project is to deliver reusable and easily customizable form components that work well in real-world production environments.

## Libraries

### @ngx-smart-forms/smart-input-type

The `@ngx-smart-forms/smart-input-type` is a powerful Angular directive that enhances native HTML input elements with advanced validation and formatting capabilities.

- **Key Features:**
  - Enforces various input types and custom regex patterns.
  - Integrates with native HTML input types and reactive forms.
  - Supports case transformation and language-specific character sets.
  - Provides clear error visibility through automatic CSS class application.

For more details, see the full [README](./libs/smart-input-type/README.md).

### @ngx-smart-forms/smart-error-display

The `@ngx-smart-forms/smart-error-display` is a robust Angular component for displaying form validation errors. It supports both reactive and template-driven forms, offering localization, theming, and custom error handling.

- **Key Features:**
  - Works with reactive and template-driven forms.
  - Customizable error messages and themes.
  - Supports translation services for i18n.
  - Integrates with analytics for error logging.

For more details, see the full [README](./libs/smart-error-display/README.md).

### @ngx-smart-forms/smart-file-upload

The `@ngx-smart-forms/smart-file-upload` is an Angular component that simplifies file uploading in forms. It provides a customizable file upload interface with support for file previews, validation, drag-and-drop functionality, and customizable themes.

- **Key Features:**
  - Supports drag-and-drop file uploads.
  - Validates file types, sizes, and image dimensions.
  - Offers customizable previews and lazy loading for images.
  - Fully customizable styles and themes (light, dark, custom).
  - Works seamlessly with Angular reactive and template-driven forms.

For more details, see the full [README](./libs/smart-file-upload/README.md).

### @ngx-smart-forms/smart-selector

The `@ngx-smart-forms/smart-selector` is a dynamic Angular component for selecting options from lists or grids. It offers multiple selection modes, keyboard navigation, accessibility support, and customizable templates.

- **Key Features:**
  - Supports both single and multi-select modes.
  - Keyboard navigation with arrow keys and Enter key selection.
  - Fully customizable option templates.
  - Provides ARIA support for accessibility.
  - Integrates seamlessly with Angular reactive and template-driven forms.
  - Allows list or grid layout with flexible theming.

For more details, see the full [README](./libs/smart-selector/README.md).

## Getting Started

This section explains how to get started with the `ngx-smart-forms` libraries in your Angular projects.

### Installation

You can install any of the libraries from the `ngx-smart-forms` workspace using npm or yarn.

For example, to install the `smart-selector` library:

```bash
npm install @ngx-smart-forms/smart-error-display
```

Or using Yarn:

```bash
yarn add @ngx-smart-forms/smart-error-display
```

### Usage

After installing the libraries, you can import and use them in your Angular components. Below is an example of how to use the `smart-error-display` component in a form.

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SmartErrorDisplay } from '@ngx-smart-forms/smart-error-display';

@Component({
  standalone: true,
  imports: [SmartErrorDisplay],
  templateUrl: './my-form.component.html',
})
export class MyFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
```

```html
<form [formGroup]="form">
  <input formControlName="username" placeholder="Username" />
  <smart-error-display [control]="form.get('username')"></smart-error-display>

  <input formControlName="email" placeholder="Email" />
  <smart-error-display [control]="form.get('email')"></smart-error-display>
</form>
</form>
```

For detailed usage instructions for each library, see their individual `README.md` files inside the respective `libs/` directories.

## Development

### Project Structure

This project follows the Nx monorepo structure for managing multiple libraries. The main components of the workspace are:

- **apps/**: Contains the demo applications that showcase the usage of the libraries.
- **libs/**: Contains the individual libraries (e.g., smart-error-display).
- **node_modules/**: Standard Node.js dependencies.
- **package.json**: Central package manager configuration for the workspace.
- **nx.json**: Nx configuration for the workspace.

### Building the Libraries

To build all the libraries in the workspace, run the following command:

```bash
npm run build
```

To build a specific library (e.g., smart-error-display):

```bash
npm run build:smart-error-display
```

### Running Tests

To run the unit tests for all libraries:

```bash
npm run test
```

To run tests for a specific library (e.g., smart-error-display):

```bash
npm run test:smart-error-display
```

### Running the Demo App

There is a demo application located in the `apps/ngx-smart-forms/` directory that showcases how to use the libraries. You can run this app to see the libraries in action:

```bash
npm run start
```

## Contributing

We welcome contributions from the community! If you're interested in contributing to the project, please check out the [CONTRIBUTING.md](./CONTRIBUTING.md) file in the root of the repository.

**How to Contribute:**

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and commit with meaningful messages.
4. Open a pull request with a description of your changes.

## Support

If you encounter any issues or have questions, feel free to [create an issue](https://github.com/AditechGH/ngx-smart-forms/issues) on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
