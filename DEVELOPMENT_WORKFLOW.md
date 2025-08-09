# Development Workflow Guide - Vantage Vertical

This comprehensive guide covers the complete development workflow for the Vantage Vertical Next.js application, from initial setup to production deployment.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Development Environment Setup](#development-environment-setup)
3. [Development Workflow](#development-workflow)
4. [Code Quality Guidelines](#code-quality-guidelines)
5. [Testing Workflow](#testing-workflow)
6. [Build and Deployment Process](#build-and-deployment-process)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Best Practices](#best-practices)

## Quick Start

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended with TypeScript support

### One-Command Setup

```bash
# Clone and setup (for new contributors)
git clone https://github.com/Pronothurah/vantage_vertical_web.git
cd vantage_vertical_web
./setup.sh

# Start development
npm run dev
```

### Manual Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run type checking
npm run type-check

# Start development server
npm run dev
```

## Development Environment Setup

### Automated Setup Script

The `setup.sh` script automates the entire setup process:

**What it does:**
- ✅ Checks Node.js and npm versions
- ✅ Installs all dependencies
- ✅ Runs security audit and fixes
- ✅ Creates `.env` file from template
- ✅ Validates TypeScript configuration
- ✅ Runs initial tests
- ✅ Provides next steps guidance

**Usage:**
```bash
chmod +x setup.sh
./setup.sh
```

### Environment Configuration

#### Development Environment Variables

Create a `.env` file in the project root:

```env
# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Vantage Vertical"
NEXT_PUBLIC_CONTACT_EMAIL=vantagevarticalltd@gmail.com
NEXT_PUBLIC_PHONE_NUMBER=+254704277687

# Email Configuration (Optional - for contact forms)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@vantagevertical.co.ke

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

#### Environment File Hierarchy

Next.js loads environment variables in this order:
1. `.env.local` (always loaded, ignored by git)
2. `.env.development` (development only)
3. `.env.production` (production only)
4. `.env` (default, committed to git)

### IDE Configuration

#### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## Development Workflow

### Daily Development Process

#### 1. Start Development Session

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Start development server
npm run dev
```

#### 2. Development Server Features

- **Hot Module Replacement**: Instant updates without page refresh
- **TypeScript Compilation**: Real-time type checking
- **Tailwind CSS Processing**: Live style updates
- **API Routes**: Server-side functionality at `/api/*`
- **Static Asset Serving**: Images and files from `/public`

#### 3. Making Changes

**File Structure:**
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── portfolio/         # Portfolio page
│   ├── technology/        # Technology page
│   ├── training/          # Training page
│   ├── blog/              # Blog section
│   ├── contact/           # Contact page
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   └── forms/            # Form components
├── lib/                  # Utilities and configurations
├── types/                # TypeScript definitions
└── data/                 # Static data
```

#### 4. Component Development

**Creating a New Component:**

```typescript
// src/components/ui/NewComponent.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface NewComponentProps {
  title: string;
  description?: string;
  className?: string;
}

export default function NewComponent({ 
  title, 
  description, 
  className 
}: NewComponentProps) {
  return (
    <div className={cn('p-4 rounded-lg', className)}>
      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}
```

**Export from Index:**

```typescript
// src/components/ui/index.ts
export { default as NewComponent } from './NewComponent';
```

#### 5. Page Development

**Creating a New Page:**

```typescript
// src/app/new-page/page.tsx
import { Metadata } from 'next';
import { NewComponent } from '@/components/ui';

export const metadata: Metadata = {
  title: 'New Page - Vantage Vertical',
  description: 'Description of the new page',
};

export default function NewPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <NewComponent 
          title="Welcome to New Page"
          description="This is a new page in the application"
        />
      </div>
    </main>
  );
}
```

### Git Workflow

#### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/new-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature description"

# Push to remote
git push origin feature/new-feature-name

# Create pull request on GitHub
```

#### Commit Message Convention

```
type(scope): brief description

Detailed explanation of changes made.

- List specific changes
- Reference issue numbers if applicable
- Note any breaking changes

Fixes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Code Quality Guidelines

### TypeScript Standards

#### Type Definitions

```typescript
// Define interfaces for props
interface ComponentProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

// Use proper return types
function processData(data: string[]): ProcessedData {
  return data.map(item => ({ id: generateId(), value: item }));
}

// Avoid 'any' type - use specific types
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}
```

#### Component Patterns

```typescript
// Functional component with TypeScript
import React, { useState, useEffect } from 'react';

interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export default function UserProfile({ userId, onUpdate }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <div className="user-profile">
      {/* Component content */}
    </div>
  );
}
```

### Styling Guidelines

#### Tailwind CSS Best Practices

```typescript
// Use utility classes for styling
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
    Action
  </button>
</div>

// Use the cn utility for conditional classes
import { cn } from '@/lib/utils';

<button 
  className={cn(
    'px-4 py-2 rounded transition-colors',
    variant === 'primary' && 'bg-primary text-white',
    variant === 'secondary' && 'bg-gray-200 text-gray-900',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
  Button
</button>
```

#### Responsive Design

```typescript
// Mobile-first responsive design
<div className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2 sm:gap-6
  md:grid-cols-3 md:gap-8
  lg:grid-cols-4
">
  {/* Grid items */}
</div>

// Responsive text sizing
<h1 className="
  text-2xl font-bold
  sm:text-3xl
  md:text-4xl
  lg:text-5xl
">
  Responsive Heading
</h1>
```

### Code Organization

#### File Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Pages**: lowercase (`page.tsx`, `layout.tsx`)
- **Utilities**: camelCase (`utils.ts`, `emailService.ts`)
- **Types**: camelCase (`types.ts`, `forms.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

#### Import Organization

```typescript
// 1. React and Next.js imports
import React, { useState, useEffect } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';

// 2. Third-party libraries
import { clsx } from 'clsx';

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui';
import { validateEmail } from '@/lib/utils';
import { User } from '@/types/user';

// 4. Relative imports
import './component.css';
```

### Linting and Formatting

#### ESLint Configuration

The project uses Next.js ESLint configuration with custom rules:

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

#### Type Checking

```bash
# Run TypeScript type checking
npm run type-check

# Watch mode for continuous checking
npx tsc --noEmit --watch
```

## Testing Workflow

### Testing Strategy

The project uses **Jest** with **React Testing Library** for comprehensive testing:

- **Unit Tests**: Individual components and utilities
- **Integration Tests**: Component interactions and user flows
- **API Tests**: API route functionality

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- ContactForm.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"
```

### Writing Tests

#### Component Testing

```typescript
// src/components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### API Route Testing

```typescript
// src/__tests__/api/contact.test.ts
import { POST } from '@/app/api/contact/route';

describe('/api/contact', () => {
  it('should handle valid contact form submission', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should reject invalid email addresses', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message'
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

#### Integration Testing

```typescript
// src/__tests__/integration/contact-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '@/components/forms/ContactForm';

// Mock the API route
jest.mock('@/app/api/contact/route');

describe('Contact Form Integration', () => {
  it('should submit form successfully', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Fill out the form
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
    });
  });
});
```

### Test Coverage

The project maintains high test coverage standards:

- **Branches**: 70% minimum
- **Functions**: 70% minimum
- **Lines**: 70% minimum
- **Statements**: 70% minimum

```bash
# Generate coverage report
npm run test:coverage

# View coverage report in browser
open coverage/lcov-report/index.html
```

### Testing Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Descriptive Test Names**: Test names should clearly describe the expected behavior
3. **Arrange-Act-Assert Pattern**: Structure tests with clear setup, action, and verification phases
4. **Mock External Dependencies**: Mock API calls, external services, and complex dependencies
5. **Test Edge Cases**: Include tests for error states, empty data, and boundary conditions

## Build and Deployment Process

### Static Site Generation

The application uses Next.js static export for optimal performance:

```bash
# Create production build
npm run build

# The static files are generated in the 'out' directory
ls out/
```

### Build Process Details

1. **TypeScript Compilation**: All TypeScript files are compiled to JavaScript
2. **Asset Optimization**: Images, CSS, and JavaScript are optimized and minified
3. **Static Generation**: All pages are pre-rendered as static HTML
4. **Bundle Analysis**: Code is split and optimized for loading performance

### Build Validation

```bash
# Run full build validation
npm run build && npm run type-check && npm test

# Test the built application locally
npx serve out
```

### Deployment to Netlify

#### Automatic Deployment (Recommended)

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: `18`

3. **Environment Variables**: Set production environment variables in Netlify dashboard

#### Manual Deployment

```bash
# Build the application
npm run build

# Deploy using Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=out
```

### Deployment Checklist

- [ ] All tests pass (`npm test`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Build completes successfully (`npm run build`)
- [ ] Environment variables are configured
- [ ] Custom domain is set up (if applicable)
- [ ] SSL certificate is active
- [ ] Analytics are configured

## Troubleshooting Guide

### Common Development Issues

#### Node.js Version Issues

**Problem**: Build fails with Node.js version errors

**Solution**:
```bash
# Check current version
node --version

# Install correct version using nvm
nvm install 18
nvm use 18

# Or update Node.js directly
# Download from https://nodejs.org/
```

#### Dependency Issues

**Problem**: Package installation fails or modules not found

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for conflicting global packages
npm list -g --depth=0
```

#### TypeScript Errors

**Problem**: Type checking fails or IDE shows type errors

**Solution**:
```bash
# Run type checking
npm run type-check

# Restart TypeScript server in VS Code
# Command Palette > "TypeScript: Restart TS Server"

# Check tsconfig.json configuration
cat tsconfig.json
```

#### Build Failures

**Problem**: `npm run build` fails

**Common Causes and Solutions**:

1. **TypeScript Errors**:
   ```bash
   npm run type-check
   # Fix reported type errors
   ```

2. **Missing Environment Variables**:
   ```bash
   # Check .env file exists and has required variables
   cat .env
   ```

3. **Import/Export Issues**:
   ```bash
   # Check for circular dependencies
   # Verify all imports use correct paths
   ```

4. **Static Export Issues**:
   ```bash
   # Ensure no server-side only features are used inappropriately
   # Check next.config.js has output: 'export'
   ```

### Performance Issues

#### Slow Development Server

**Problem**: `npm run dev` is slow to start or reload

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Restart development server
npm run dev

# Check for large files in src/ directory
find src -type f -size +1M

# Optimize imports (avoid importing entire libraries)
# Use specific imports: import { Button } from '@/components/ui'
```

#### Large Bundle Size

**Problem**: Build output is too large

**Solution**:
```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build

# Check for unused dependencies
npm install -g depcheck
depcheck

# Optimize images
# Use Next.js Image component
# Compress images before adding to public/
```

### Testing Issues

#### Tests Failing

**Problem**: Tests fail unexpectedly

**Solution**:
```bash
# Run tests with verbose output
npm test -- --verbose

# Clear Jest cache
npm test -- --clearCache

# Check Jest configuration
cat jest.config.js

# Update test snapshots if needed
npm test -- --updateSnapshot
```

#### Mock Issues

**Problem**: Mocks not working correctly

**Solution**:
```bash
# Check mock setup in jest.setup.js
cat jest.setup.js

# Verify mock paths are correct
# Ensure mocks are defined before imports
```

### Deployment Issues

#### Build Fails on Netlify

**Problem**: Deployment fails during build

**Solution**:
1. Check build logs in Netlify dashboard
2. Verify Node.js version is set to 18
3. Ensure all environment variables are set
4. Test build locally: `npm run build`

#### 404 Errors After Deployment

**Problem**: Pages return 404 errors

**Solution**:
1. Verify publish directory is set to `out`
2. Check that static export is working: `ls out/`
3. Ensure all routes are properly generated
4. Check for trailing slash issues

#### Environment Variables Not Working

**Problem**: Environment variables are undefined in production

**Solution**:
1. Verify variables are set in Netlify dashboard
2. Check variable names (case-sensitive)
3. Ensure `NEXT_PUBLIC_` prefix for client-side variables
4. Redeploy after setting variables

### Getting Help

#### Internal Resources

1. **Documentation**: Check README.md, CONTRIBUTING.md, DEPLOYMENT.md
2. **Code Comments**: Look for JSDoc comments in complex functions
3. **Test Files**: Check existing tests for usage examples

#### External Resources

1. **Next.js Documentation**: https://nextjs.org/docs
2. **React Documentation**: https://react.dev/
3. **Tailwind CSS Documentation**: https://tailwindcss.com/docs
4. **TypeScript Documentation**: https://www.typescriptlang.org/docs/

#### Community Support

1. **Next.js Discussions**: https://github.com/vercel/next.js/discussions
2. **Stack Overflow**: Tag questions with `next.js`, `react`, `typescript`
3. **Discord Communities**: Next.js, React, TypeScript communities

## Best Practices

### Performance Optimization

#### Image Optimization

```typescript
// Use Next.js Image component for automatic optimization
import Image from 'next/image';

<Image
  src="/drone-photo.jpg"
  alt="Professional drone photography"
  width={800}
  height={600}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### Code Splitting

```typescript
// Use dynamic imports for large components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false // If component doesn't need server-side rendering
});
```

#### Bundle Optimization

```typescript
// Import only what you need
import { debounce } from 'lodash/debounce'; // ✅ Good
import _ from 'lodash'; // ❌ Imports entire library

// Use tree-shaking friendly imports
import { Button, Input } from '@/components/ui'; // ✅ Good
import * as UI from '@/components/ui'; // ❌ Less optimal
```

### Security Best Practices

#### Environment Variables

```bash
# Never commit sensitive data
# Use .env.local for local secrets (ignored by git)
# Use Netlify environment variables for production

# ✅ Good - public variables
NEXT_PUBLIC_SITE_URL=https://vantagevertical.co.ke

# ✅ Good - server-only variables
SMTP_PASSWORD=secret-password

# ❌ Bad - sensitive data in public variables
NEXT_PUBLIC_API_KEY=secret-key
```

#### Input Validation

```typescript
// Always validate user input
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);
    // Process validated data
  } catch (error) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }
}
```

### Accessibility Guidelines

#### Semantic HTML

```typescript
// Use proper semantic elements
<main>
  <section aria-labelledby="services-heading">
    <h2 id="services-heading">Our Services</h2>
    <article>
      <h3>Aerial Photography</h3>
      <p>Professional drone photography services...</p>
    </article>
  </section>
</main>
```

#### ARIA Labels

```typescript
// Provide accessible labels
<button 
  aria-label="Close dialog"
  onClick={closeDialog}
>
  <CloseIcon aria-hidden="true" />
</button>

<input
  type="email"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
{hasError && (
  <div id="email-error" role="alert">
    Please enter a valid email address
  </div>
)}
```

#### Keyboard Navigation

```typescript
// Ensure keyboard accessibility
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  onClick={handleClick}
>
  Custom Button
</div>
```

### Maintenance Guidelines

#### Regular Updates

```bash
# Weekly dependency updates
npm outdated
npm update

# Monthly security audits
npm audit
npm audit fix

# Quarterly major version updates
# Review breaking changes before updating
```

#### Code Reviews

**Review Checklist:**
- [ ] Code follows TypeScript and React best practices
- [ ] Components are properly typed
- [ ] Tests are included for new functionality
- [ ] Accessibility guidelines are followed
- [ ] Performance considerations are addressed
- [ ] Security best practices are implemented

#### Documentation Updates

- Keep README.md current with project changes
- Update API documentation when routes change
- Document new environment variables
- Update deployment instructions for infrastructure changes

---

This development workflow guide should be updated as the project evolves. For questions or suggestions, please create an issue or reach out to the development team.