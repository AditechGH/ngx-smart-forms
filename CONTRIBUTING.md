# Contributing to ngx-smart-forms

We are excited that you are considering contributing to the ngx-smart-forms project! This document provides guidelines and instructions to help you contribute effectively to the monorepo. Contributions include bug reports, feature requests, documentation improvements, and code changes.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Contributing Code](#contributing-code)
- [Setting Up Your Development Environment](#setting-up-your-development-environment)
  - [Forking and Cloning the Repository](#forking-and-cloning-the-repository)
  - [Installing Dependencies](#installing-dependencies)
  - [Running the Demo App](#running-the-demo-app)
  - [Building Libraries](#building-libraries)
  - [Running Tests](#running-tests)
- [Coding Standards](#coding-standards)
  - [Linting](#linting)
  - [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [License](#license)

## Code of Conduct

We have adopted a Code of Conduct to maintain a welcoming and inclusive environment. Please review our [Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/) before contributing to the project.

## How to Contribute

### Reporting Bugs

If you encounter any bugs, please [create an issue](https://github.com/AditechGH/ngx-smart-forms/issues) in the GitHub repository. Include as much detail as possible to help us reproduce and fix the issue quickly.

When reporting bugs, please include:

- A detailed description of the problem.
- Steps to reproduce the issue.
- Screenshots or error logs, if applicable.
- Information about your environment (e.g., browser, Node.js version, Angular version, etc.).

### Suggesting Features

We are always open to suggestions for new features or improvements! To propose a new feature, please [create a feature request](https://github.com/AditechGH/ngx-smart-forms/issues/new?assignees=&labels=feature+request&template=feature_request.md&title=) in the repository and provide:

- A clear description of the feature.
- Use cases or examples of how the feature will improve the library.
- Any other relevant details or considerations.

### Contributing Code

If you would like to contribute code to the project, follow these steps:

1; Fork the repository and create a new feature branch.
2; Implement your changes, making sure to follow the coding standards outlined below.
3; Write tests to cover your changes.
4; Submit a pull request with a detailed description of your changes.

## Setting Up Your Development Environment

Follow these steps to set up your local development environment for contributing to ngx-smart-forms.

### Forking and Cloning the Repository

1. Fork the repository to your GitHub account by clicking the "Fork" button on the project page.
2. Clone your forked repository to your local machine:

    ```bash
    git clone https://github.com/YOUR_USERNAME/ngx-smart-forms.git
    cd ngx-smart-forms
    ```

3. Add the upstream repository to keep your fork up to date:

    ```bash
    git remote add upstream https://github.com/AditechGH/ngx-smart-forms.git
    ````

### Installing Dependencies

After cloning the repository, install the required dependencies:

```bash
npm install
````

or

```bash
yarn install
```

### Running the Demo App

The repository includes a demo app to showcase the libraries. You can run this app to test the libraries locally:

```bash
npm start
```

The app will be available at `http://localhost:4200/ngx-smart-forms`

### Building Libraries

To build all libraries in the monorepo, use:

```bash
npm build
```

To build a specific library, such as `smart-error-display`:

```bash
npm build:smart-error-display
```

### Running Tests

To ensure the quality of your contributions, all code should be thoroughly tested. Run tests across the entire workspace:

```bash
npm test
```

To run tests for a specific library:

```bash
npm test:smart-error-display
```

## Coding Standards

We follow specific coding standards to maintain consistency across the project. Please adhere to the following guidelines.

### Linting

Ensure your code passes lint checks before submitting a pull request. Linting helps catch stylistic and formatting errors:

```bash
npm lint
```

You can also lint a specific library:

```bash
npm lint:smart-error-display
```

### Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages to enforce consistency and automate versioning. Please follow these guidelines for your commit messages:

- **fix**: For bug fixes.
- **feat**: For new features.
- **docs**: For documentation changes.
- **style**: For code formatting changes (no code logic).
- **refactor**: For code restructuring (no feature or bug fix).
- **test**: For adding or improving tests.
- **chore**: For small tasks, such as updating dependencies.

Example:

```vbnet
feat: add custom validation to smart-error-display

- Added support for custom validators in smart-error-display.
- Updated README with usage examples.
- Wrote unit tests for the new feature.
```

## Pull Request Process

Once your changes are ready, submit a pull request (PR) to the main branch. The following checklist should be completed before creating the PR:

1. Ensure your code is thoroughly tested and passes all unit tests.
2. Run the linting tool and resolve any lint errors.
3. Make sure your code follows the project’s coding standards and guidelines.
4. If your change introduces a new feature or modifies existing functionality, update the relevant documentation.
5. Submit the pull request with a detailed description of the changes and a link to any related issues or feature requests.

Our team will review the PR and provide feedback or merge the changes. We strive to review pull requests as quickly as possible, but please be patient if it takes a little time.

## License

By contributing to ngx-smart-forms, you agree that your contributions will be licensed under the MIT License. For more information, see the [LICENSE](./LICENSE) file.
