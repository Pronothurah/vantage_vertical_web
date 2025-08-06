import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import './globals.css';
import { Navbar, Footer } from '@/components/layout';
import SkipLinks from '@/components/layout/SkipLinks';
import { generateMetadata, pageConfigs, generateOrganizationSchema } from '@/lib/seo';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import PerformanceMonitor from '@/components/analytics/PerformanceMonitor';
import PerformanceDashboard from '@/components/analytics/PerformanceDashboard';

const urbanist = Urbanist({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-urbanist',
  display: 'swap',
});

export const metadata: Metadata = {
  ...generateMetadata(pageConfigs.home),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vantagevertical.co.ke'),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en" className={urbanist.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={`${urbanist.className} antialiased min-h-screen flex flex-col`}>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <PerformanceMonitor enabled={process.env.NODE_ENV === 'production'} />
        <SkipLinks />
        <header id="navigation">
          <Navbar />
        </header>
        <main id="main-content" className="flex-1 pt-16 lg:pt-20" tabIndex={-1}>
          {children}
        </main>
        <footer id="footer">
          <Footer />
        </footer>
        <PerformanceDashboard />
      </body>
    </html>
  );
}