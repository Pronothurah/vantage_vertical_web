'use client';

import { useSearchParams } from 'next/navigation';
import ContactForm from './ContactForm';
import DroneInquiryForm from './DroneInquiryForm';

interface ContactFormSelectorProps {
  variant?: 'full' | 'inline' | 'modal';
}

export default function ContactFormSelector({ variant = 'full' }: ContactFormSelectorProps) {
  const searchParams = useSearchParams();
  const service = searchParams.get('service');
  const product = searchParams.get('product');

  // Show drone inquiry form if service is drone-sales or if product is specified
  const showDroneForm = service === 'drone-sales' || product;

  if (showDroneForm) {
    return <DroneInquiryForm preselectedDroneId={product || ''} />;
  }

  return <ContactForm variant={variant} />;
}