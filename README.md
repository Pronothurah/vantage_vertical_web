# Vantage Vertical - Professional Drone Services Website

Professional drone services website featuring aerial photography, mapping, surveillance, and training programs. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom brand configuration
- **Fonts**: Inter (body text) and Poppins (headings)
- **Image Optimization**: Next.js Image component
- **Deployment**: Vercel (recommended)

## 🎨 Brand Colors

- **Primary Red**: #D72638 - CTAs and highlights
- **Black**: #000000 - Text and headers
- **White**: #FFFFFF - Main background
- **Steel Gray**: #343A40 - Secondary text
- **Charcoal**: #212529 - Dark backgrounds and footers
- **Golden Accent**: #DCCA87 - Special highlights

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with navbar/footer
│   ├── page.tsx           # Home page
│   ├── about/page.tsx     # About page
│   ├── portfolio/page.tsx # Portfolio page
│   ├── technology/page.tsx# Technology page
│   ├── training/page.tsx  # Training page
│   ├── blog/              # Blog section
│   ├── contact/page.tsx   # Contact page
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   └── forms/            # Form components
├── lib/                  # Utilities and configurations
└── data/                 # Static data and content
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Development Server

The development server will be available at [http://localhost:3000](http://localhost:3000).

## 🎯 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Built-in SEO with Next.js metadata API
- **Performance**: Optimized images, fonts, and code splitting
- **Accessibility**: WCAG 2.1 AA compliant design system
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Clean, professional design with brand consistency

## 📄 Pages

- **Home**: Hero section with services overview
- **About**: Company information and team
- **Portfolio**: Project showcases and case studies
- **Technology**: Service details and drone specifications
- **Training**: Drone training programs
- **Blog**: Industry insights and company updates
- **Contact**: Contact forms and company information

## 🚀 Deployment

The application is optimized for deployment on Vercel:

```bash
# Deploy to Vercel
vercel --prod
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

---

**Vantage Vertical** - See More. Do More. From Above.