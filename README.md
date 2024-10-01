# ngx-smart-forms Monorepo

ngx-smart-forms is a collection of Angular libraries designed to enhance form handling and validation in Angular applications. Each library in this monorepo offers specific functionality aimed at simplifying form creation, validation, and error display, while providing advanced customization and performance optimizations.

## Table of Contents

- [About the Project](#about-the-project)
- [Libraries](#libraries)
  - [@ngx-smart-forms/smart-error-display](#ngx-smart-formssmart-error-display)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Development](#development)
  - [Monorepo Structure](#monorepo-structure)
  - [Building the Libraries](#building-the-libraries)
  - [Running Tests](#running-tests)
  - [Running the Demo App](#running-the-demo-app)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## About the Project

The ngx-smart-forms monorepo is a unified workspace containing multiple Angular libraries that provide tools for creating efficient, user-friendly forms. These libraries cover everything from error display components, customizable inputs, to dynamic form builders.

The main goal of this project is to deliver reusable and easily customizable form components that work well in real-world production environments.

## Libraries

### @ngx-smart-forms/smart-error-display

The `@ngx-smart-forms/smart-error-display` is a robust Angular component for displaying form validation errors. It supports both reactive and template-driven forms, offering localization, theming, and custom error handling.

- Key Features:
  - Works with reactive and template-driven forms.
  - Customizable error messages and themes.
  - Supports translation services for i18n.
  - Integrates with analytics for error logging.

For more details, see the full [README](./libs/smart-error-display/README.md).

## Getting Started

This section explains how to get started with the ngx-smart-forms libraries in your Angular projects.

### Installation

You can install any of the libraries from the ngx-smart-forms monorepo using npm or yarn.

For example, to install the smart-error-display library:

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
import { SmartErrorDisplayComponent } from '@ngx-smart-forms/smart-error-display';

@Component({
  standalone: true,
  imports: [SmartErrorDisplayComponent],
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
````

```html
<form [formGroup]="form">
  <input formControlName="username" placeholder="Username" />
  <smart-error-display [control]="form.get('username')"></smart-error-display>

  <input formControlName="email" placeholder="Email" />
  <smart-error-display [control]="form.get('email')"></smart-error-display>
</form>
```

For detailed usage instructions for each library, see their individual `README.md` files inside the respective `libs/` directories.

## Development

### Monorepo Structure

This monorepo follows the Nx workspace structure for managing multiple libraries. The main components of the monorepo are:

- **apps/**: Contains the demo applications that showcase the usage of the libraries.
- **libs/**: Contains the individual libraries (e.g., smart-error-display).
- **node_modules/**: Standard Node.js dependencies.
- **package.json**: Central package manager configuration for the monorepo.
- **nx.json**: Nx configuration for the workspace.

### Building the Libraries

To build all the libraries in the monorepo, run the following command:

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
npm run smart-error-display
```

### Running the Demo App

There is a demo application located in the `apps/ngx-smart-forms/` directory that showcases how to use the libraries. You can run this app to see the libraries in action:

```bash
npm run start
```

## Contributing

We welcome contributions from the community! If you're interested in contributing to the project, please check out the [CONTRIBUTING.md](./CONTRIBUTING.md) file in the root of the repository.

### How to Contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and commit with meaningful messages.
4. Open a pull request with a description of your changes.

## Support

If you encounter any issues or have questions, feel free to [create an issue](https://github.com/AditechGH/ngx-smart-forms/issues) on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
