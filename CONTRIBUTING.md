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

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git
- Code editor (VS Code recommended with TypeScript support)

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

1. Run the automated setup script (recommended):
   ```bash
   ./setup.sh
   ```

   Or set up manually:
   ```bash
   # Install dependencies
   npm install
   
   # Set up environment variables
   cp .env.example .env
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

The development server includes:
- Hot module replacement for instant updates
- TypeScript compilation and type checking
- Tailwind CSS processing
- API routes for contact forms

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

### TypeScript/React

- Use TypeScript for all new code with proper type definitions
- Follow React Hooks patterns and Next.js best practices
- Use functional components with TypeScript interfaces
- Implement proper error boundaries and loading states
- Use meaningful variable and function names with type annotations
- Add JSDoc comments for complex functions and components
- Follow Next.js App Router conventions for routing and layouts

### Styling

- Use Tailwind CSS utility classes for styling
- Follow the existing design system and brand colors
- Ensure responsive design with mobile-first approach
- Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
- Optimize for performance and accessibility
- Follow WCAG 2.1 AA compliance guidelines

### API Routes (Next.js)

- Use Next.js API routes for server-side functionality
- Implement proper error handling and status codes
- Add input validation and sanitization
- Use TypeScript for request/response types
- Follow RESTful conventions where applicable
- Handle CORS and security headers appropriately

### File Organization

- Follow Next.js App Router structure (src/app/)
- Keep components small, focused, and reusable
- Use TypeScript interfaces in src/types/
- Organize components by feature in src/components/
- Use index.ts files for clean exports
- Keep utilities in src/lib/ with proper typing

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Testing Guidelines

- Write unit tests for utility functions and components
- Add integration tests for complex user interactions
- Test form submissions and API route functionality
- Ensure accessibility compliance with testing-library
- Use TypeScript for test files with proper typing
- Mock external dependencies and API calls
- Test responsive behavior and mobile interactions

### Test Structure

- Place tests in `src/__tests__/` or alongside components as `*.test.tsx`
- Use Jest and React Testing Library for component testing
- Follow the Arrange-Act-Assert pattern
- Use descriptive test names that explain the expected behavior
- Group related tests using `describe` blocks

### Manual Testing

Before submitting:
- Test on different screen sizes and devices
- Verify form submissions work correctly
- Check navigation and routing functionality
- Test with different browsers (Chrome, Firefox, Safari)
- Validate static site generation with `npm run build`
- Test deployment build locally

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
# Development
npm run dev          # Start development server with hot reload
npm run build        # Create optimized production build (static export)
npm run start        # Start production server (after build)

# Code Quality
npm run lint         # Run ESLint for code quality
npm run type-check   # Run TypeScript type checking
npm test             # Run Jest test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Deployment
npm run netlify-build # Build for Netlify deployment

# Maintenance
npm outdated         # Check for outdated packages
npm audit            # Check for security vulnerabilities
```

### Debugging

- Use React Developer Tools for component debugging
- Use Next.js built-in debugging features
- Check browser console for JavaScript/TypeScript errors
- Monitor network requests in browser dev tools
- Use TypeScript compiler for type checking issues
- Inspect static site generation output in the `out/` directory
- Use Next.js development error overlay for detailed error information

## Questions?

If you have questions about contributing:

- Check existing issues and discussions
- Create a new issue with the "question" label
- Reach out to maintainers
- Join our community discussions

Thank you for contributing to Vantage Vertical! 🚁