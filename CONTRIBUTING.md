# Contributing to Vantage Vertical

Thank you for your interest in contributing to Vantage Vertical! This document provides guidelines and information for contributors.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Coding Standards](#coding-standards)
6. [Testing](#testing)
7. [Submitting Changes](#submitting-changes)
8. [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professionalism in all interactions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Git
- Code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vantage_vertical_web.git
   cd vantage_vertical_web
   ```

3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/Pronothurah/vantage_vertical_web.git
   ```

## Development Setup

1. Install all dependencies:
   ```bash
   npm run install-all
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

3. Start MongoDB service

4. Run the development servers:
   ```bash
   npm start
   ```

## Making Changes

### Branch Naming Convention

Create descriptive branch names:
- `feature/add-user-authentication`
- `bugfix/fix-contact-form-validation`
- `docs/update-api-documentation`
- `refactor/optimize-image-loading`

### Commit Message Format

Use clear, descriptive commit messages:

```
type(scope): brief description

Detailed explanation of what was changed and why.

- List any breaking changes
- Reference issue numbers if applicable
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(contact): add email validation to contact form

- Added regex validation for email format
- Added error message display
- Updated form styling for error states

Fixes #123
```

## Coding Standards

### JavaScript/React

- Use ES6+ features
- Follow React Hooks patterns
- Use functional components over class components
- Implement proper error boundaries
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### CSS

- Use the existing CSS custom properties system
- Follow BEM naming convention for new classes
- Ensure responsive design principles
- Optimize for performance (avoid unnecessary reflows)

### Backend (Node.js/Express)

- Use async/await over callbacks
- Implement proper error handling
- Follow RESTful API conventions
- Add input validation and sanitization
- Use middleware appropriately

### File Organization

- Keep components small and focused
- Use index.js files for clean imports
- Organize files by feature, not by type
- Keep assets organized in appropriate folders

## Testing

### Frontend Testing

```bash
cd frontend
npm test
```

- Write unit tests for utility functions
- Add integration tests for complex components
- Test user interactions and form submissions
- Ensure accessibility compliance

### Backend Testing

```bash
cd backend
npm test
```

- Test API endpoints
- Validate database operations
- Test error handling scenarios
- Mock external dependencies

### Manual Testing

Before submitting:
- Test on different screen sizes
- Verify form submissions work
- Check navigation and routing
- Test with different browsers
- Validate MongoDB connections

## Submitting Changes

### Pull Request Process

1. Update your fork:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: your descriptive message"
   ```

4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request on GitHub

### Pull Request Guidelines

- Provide a clear title and description
- Reference related issues
- Include screenshots for UI changes
- List any breaking changes
- Ensure all tests pass
- Update documentation if needed

### Review Process

- Maintainers will review your PR
- Address any requested changes
- Keep discussions constructive
- Be patient during the review process

## Reporting Issues

### Bug Reports

Include the following information:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, browser, Node.js version, etc.
- **Screenshots**: If applicable
- **Additional Context**: Any other relevant information

### Feature Requests

Include the following information:

- **Description**: Clear description of the feature
- **Use Case**: Why this feature would be useful
- **Proposed Solution**: How you think it should work
- **Alternatives**: Any alternative solutions considered
- **Additional Context**: Any other relevant information

### Security Issues

For security-related issues:
- Do NOT create a public issue
- Email the maintainers directly
- Provide detailed information about the vulnerability
- Allow time for the issue to be addressed before disclosure

## Development Tips

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

### Useful Commands

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm start

# Build for production
npm run build

# Run tests
npm test

# Check for outdated packages
npm outdated
```

### Debugging

- Use React Developer Tools for frontend debugging
- Use Node.js debugger for backend issues
- Check browser console for JavaScript errors
- Monitor network requests in browser dev tools
- Use MongoDB Compass for database inspection

## Questions?

If you have questions about contributing:

- Check existing issues and discussions
- Create a new issue with the "question" label
- Reach out to maintainers
- Join our community discussions

Thank you for contributing to Vantage Vertical! 🚁