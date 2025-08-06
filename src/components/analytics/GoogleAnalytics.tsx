'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
}

// Event tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Conversion tracking for forms
export const trackFormSubmission = (formType: string, service?: string) => {
  trackEvent('form_submit', {
    form_type: formType,
    service_type: service,
  });
};

// Conversion tracking for phone calls
export const trackPhoneCall = () => {
  trackEvent('phone_call', {
    event_category: 'engagement',
    event_label: 'header_phone_click',
  });
};

// Conversion tracking for email clicks
export const trackEmailClick = () => {
  trackEvent('email_click', {
    event_category: 'engagement',
    event_label: 'contact_email_click',
  });
};

// Service inquiry tracking
export const trackServiceInquiry = (service: string) => {
  trackEvent('service_inquiry', {
    event_category: 'lead_generation',
    service_type: service,
  });
};

// Blog engagement tracking
export const trackBlogEngagement = (action: string, postSlug: string) => {
  trackEvent('blog_engagement', {
    event_category: 'content',
    action: action,
    post_slug: postSlug,
  });
};

// Drone product interest tracking
export const trackDroneInterest = (droneId: string, action: string) => {
  trackEvent('drone_interest', {
    event_category: 'product',
    drone_id: droneId,
    action: action,
  });
};

// Training program interest tracking
export const trackTrainingInterest = (programId: string) => {
  trackEvent('training_interest', {
    event_category: 'education',
    program_id: programId,
  });
};

// Download tracking
export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent('file_download', {
    event_category: 'engagement',
    file_name: fileName,
    file_type: fileType,
  });
};

// External link tracking
export const trackExternalLink = (url: string, linkText: string) => {
  trackEvent('external_link_click', {
    event_category: 'engagement',
    link_url: url,
    link_text: linkText,
  });
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void;
  }
}