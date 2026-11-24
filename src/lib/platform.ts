// src/lib/platforms.ts

export const LAUNCH_TEXT = 'Launching Q1 2027';
export const LAUNCH_LABEL = 'COMING_Q1_2027';

export interface Platform {
  id: string;
  name: string;
  role: 'FLAGSHIP' | 'CLIENT_PLATFORM' | 'SELECTIVE';
  summary: string;
  bestFor: string[];
  watchOut: string;
}

export const platforms: Platform[] = [
  {
    id: 'astro',
    name: 'Astro',
    role: 'FLAGSHIP',
    summary:
      'Best for new marketing sites and migrations where speed, SEO, and clean tracking matter most.',
    bestFor: [
      'New marketing and lead-gen sites',
      'Migrating slow legacy sites',
      'Content-heavy sites and blogs',
      'A fast front end for Headless CMS',
    ],
    watchOut:
      'Editors who want to drag and drop pages need a headless CMS set up first.',
  }, 
  {
    id: 'nextjs',
    name: 'Next.js',
    role: 'SELECTIVE',
    summary:
      'Best for app-like experiences, personalization, and large or highly dynamic commerce sites.',
    bestFor: [
      'Headless storefronts and large catalogs',
      'Personalized or logged-in experiences',
      'Teams that already work in React',
      'Dashboards and customer portals',
    ],
    watchOut:
      'It has more moving parts than a marketing site usually needs, so I only recommend it when the project requires it.',
  },
];

// The MarTech layer that stays the same whichever platform a site runs on.
export const sharedLayer = [
  'GA4 and server-side GTM',
  'CRM sync (HubSpot)',
  'CDP events (Segment)',
  'Email automation (HubSpot, Mailchimp)',
  'Ad conversion APIs (Google, Meta)',
  'Workflow automation (Make, Zapier)',
];

export interface SampleBuild {
  id: string;
  platform: string;
  title: string;
  desc: string;
  steps: { label: string; text: string }[];
  status: 'COMING' | 'LIVE';
  url?: string;
}

export const samples: SampleBuild[] = [
  {
    id: 'SAMPLE_01_ASTRO',
    platform: 'Astro',
    title: 'Lead-Gen Marketing Site',
    desc: 'A fast marketing site with a planned event schema, consent-aware tracking, CRM-synced forms, and server-side ad conversions.',
    steps: [
      { label: 'BUILD', text: 'Astro site with Sanity and reusable landing page components.' },
      { label: 'TRACK', text: 'GA4 and server-side GTM with one shared event plan and UTM capture.' },
      { label: 'CONNECT', text: 'Forms create HubSpot contacts and deals, and an Make workflow alerts on new leads and failed syncs.' },
    ],
    status: 'COMING',
  },
  {
    id: 'SAMPLE_02_NEXTJS',
    platform: 'Next.js',
    title: 'Headless Storefront',
    desc: 'A small headless storefront that sends purchase events to a CDP and to ad platforms.',
    steps: [
      { label: 'BUILD', text: 'Next.js storefront on Shopify or Stripe with product and cart pages.' },
      { label: 'TRACK', text: 'Purchase events sent to a CDP, then to Google and Meta as server-side conversions.' },
      { label: 'CONNECT', text: 'Segments synced for cart and post-purchase flows.' },
    ],
    status: 'COMING',
  },
];
