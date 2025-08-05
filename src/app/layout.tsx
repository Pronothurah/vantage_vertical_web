import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Navbar, Footer } from '@/components/layout';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Vantage Vertical - Professional Drone Services in Kenya',
    template: '%s | Vantage Vertical',
  },
  description: 'Leading drone services company in Kenya offering aerial mapping, surveillance, agritech solutions, commercial photography, and drone training programs. KCAA certified pilots with advanced technology.',
  keywords: [
    'drone services Kenya',
    'aerial mapping Kenya',
    'drone surveillance company Kenya',
    'agritech drone solutions',
    'precision agriculture Kenya',
    'commercial drone photography',
    'drone training Kenya',
    'NDVI crop health scans',
    'buy drones Kenya',
    'drone crop spraying',
    'KCAA certified drone pilots',
    'aerial intelligence Kenya',
    'construction drone surveys',
    'real estate drone photography',
    'security drone surveillance'
  ],
  authors: [{ name: 'Vantage Vertical' }],
  creator: 'Vantage Vertical',
  publisher: 'Vantage Vertical',
  category: 'Technology',
  classification: 'Drone Services',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vantagevertical.co.ke'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://vantagevertical.co.ke',
    title: 'Vantage Vertical - Professional Drone Services in Kenya',
    description: 'Leading drone services company in Kenya offering aerial mapping, surveillance, agritech solutions, commercial photography, and drone training programs. KCAA certified pilots with advanced technology.',
    siteName: 'Vantage Vertical',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vantage Vertical - Professional Drone Services in Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vantagevertical',
    creator: '@vantagevertical',
    title: 'Vantage Vertical - Professional Drone Services in Kenya',
    description: 'Leading drone services company in Kenya offering aerial mapping, surveillance, agritech solutions, commercial photography, and drone training programs.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 pt-16 lg:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}