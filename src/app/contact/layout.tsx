import type { Metadata } from 'next';
import { generateMetadata, pageConfigs } from '@/lib/seo';

export const metadata: Metadata = generateMetadata(pageConfigs.contact);

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}