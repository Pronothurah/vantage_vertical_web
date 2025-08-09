# Vantage Vertical - Professional Drone Services Website

Professional drone services website featuring aerial photography, mapping, surveillance, and training programs. Built as a modern, unified Next.js application with static site generation for optimal performance and SEO.

## 🚀 Technology Stack

- **Framework**: Next.js 14 with App Router and Static Export
- **Language**: TypeScript for full type safety
- **Styling**: Tailwind CSS with custom brand configuration
- **Fonts**: Inter (body text) and Poppins (headings)
- **Image Optimization**: Next.js Image component with static optimization
- **Email**: Nodemailer for contact form functionality
- **Testing**: Jest with React Testing Library
- **Deployment**: Netlify with static site hosting

## 🎨 Brand Colors

- **Primary Red**: #D72638 - CTAs and highlights
- **Black**: #000000 - Text and headers
- **White**: #FFFFFF - Main background
- **Steel Gray**: #343A40 - Secondary text
- **Charcoal**: #212529 - Dark backgrounds and footers
- **Golden Accent**: #DCCA87 - Special highlights

## 📁 Project Structure

```
vantage_vertical_web/
├── src/                    # Source code
│   ├── app/               # Next.js App Router (Pages & API)
│   │   ├── layout.tsx     # Root layout with navbar/footer
│   │   ├── page.tsx       # Home page
│   │   ├── about/         # About page
│   │   ├── portfolio/     # Portfolio page
│   │   ├── technology/    # Technology/drones page
│   │   ├── training/      # Training programs page
│   │   ├── blog/          # Blog section with dynamic routes
│   │   ├── contact/       # Contact page
│   │   ├── admin/         # Admin interface
│   │   └── api/           # API routes for forms
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (buttons, inputs)
│   │   ├── layout/       # Layout components (header, footer)
│   │   ├── sections/     # Page sections (hero, cards)
│   │   ├── forms/        # Form components with validation
│   │   └── analytics/    # Performance monitoring
│   ├── lib/              # Utilities and configurations
│   │   ├── email/        # Email service and templates
│   │   ├── utils.ts      # Common utilities
│   │   ├── seo.ts        # SEO helpers
│   │   └── blog.ts       # Blog management
│   ├── types/            # TypeScript type definitions
│   ├── data/             # Static data and content
│   └── __tests__/        # Test files
├── public/               # Static assets (images, icons)
├── out/                  # Static export output (generated)
└── .next/                # Next.js build cache (generated)
```

## 🛠️ Development

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Pronothurah/vantage_vertical_web.git
cd vantage_vertical_web

# Run the setup script (recommended)
./setup.sh

# Or install manually
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Create optimized production build
npm run start        # Start production server (after build)

# Code Quality
npm run lint         # Run ESLint for code quality
npm run type-check   # Run TypeScript type checking
npm test             # Run Jest test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Deployment
npm run netlify-build # Build for Netlify deployment
```

### Development Server

The development server will be available at [http://localhost:3000](http://localhost:3000) with:
- Hot module replacement for instant updates
- TypeScript compilation
- Tailwind CSS processing
- API routes for contact forms

## 🎯 Features

### Core Features
- **Unified Codebase**: Single Next.js application replacing previous backend/frontend separation
- **Static Site Generation**: Pre-rendered pages for optimal performance and SEO
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Clean, professional design with brand consistency

### Performance & SEO
- **SEO Optimized**: Built-in SEO with Next.js metadata API and static generation
- **Performance**: Optimized images, fonts, and code splitting
- **Accessibility**: WCAG 2.1 AA compliant design system
- **Fast Loading**: Static export with CDN delivery via Netlify

### Development Experience
- **Hot Reload**: Instant updates during development
- **Type Safety**: Comprehensive TypeScript coverage
- **Testing**: Jest and React Testing Library integration
- **Code Quality**: ESLint and automated formatting

## 📄 Pages

- **Home**: Hero section with services overview
- **About**: Company information and team
- **Portfolio**: Project showcases and case studies
- **Technology**: Service details and drone specifications
- **Training**: Drone training programs
- **Blog**: Industry insights and company updates
- **Contact**: Contact forms and company information

## 🚀 Deployment

The application is configured for static site deployment on Netlify:

### Netlify Deployment

```bash
# Build for production (static export)
npm run build

# The static files will be generated in the 'out' directory
# Netlify will automatically deploy from this directory
```

### Deployment Configuration

- **Build Command**: `npm run build`
- **Publish Directory**: `out`
- **Node Version**: 18
- **Static Export**: Enabled for optimal performance

### Environment Variables

For production deployment, configure these environment variables in Netlify:

```bash
# Required for contact forms
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
CONTACT_EMAIL=your-contact-email

# Optional analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Custom Domain Setup

1. Configure your custom domain in Netlify dashboard
2. Update DNS settings to point to Netlify
3. SSL certificates are automatically provisioned

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

---

**Vantage Vertical** - See More. Do More. From Above.