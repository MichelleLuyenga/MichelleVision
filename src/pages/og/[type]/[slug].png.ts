// src/pages/og/[type]/[slug].png.ts
//
// Generates a 1200x630 PNG social card for every post/page at BUILD TIME
// (prerendered, no server adapter needed). Point og:image / twitter:image at
// the URLs built by src/lib/og.ts (ogHome / ogPost / ogWork).
//
//   npm install @vercel/og

import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { ImageResponse } from '@vercel/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { slugify } from '../../../lib/slugify';

type CardType = 'home' | 'post' | 'work' | 'topic';

interface CardProps {
  title: string;
  tag?: string;
  desc: string;
}

const ACCENT = '#C9A96E';
const BG = '#0D0E11';
const PANEL = '#111317';
const BORDER = '#1A1C23';
const TEXT = '#EDE9F0';
const MUTED = '#9CA3AF';

const DEFAULT_DESC =
  'Fast, measurable marketing websites on Next.js and Astro, connected to your CRM, analytics, and ad platforms.';

// Capability chips shown on the home and site-page cards.
const CHIPS = ['Next.js', 'Astro', 'CRM', 'Analytics', 'Automation'];

// One entry per non-post page that needs its own card. The slug must match
// what the page passes to ogWork(), in lowercase (e.g. ogWork('services')).
const WORK_PAGES: Array<{ slug: string } & CardProps> = [
  {
    slug: 'services',
    title: 'Marketing Web Development Packages',
    tag: 'TURNKEY_PACKAGES',
    desc: 'Builds, migrations, and optimization on Next.js and Astro, with CRM, analytics, and ad tracking.',
  },
  {
    slug: 'cases',
    title: 'Case Studies & Sample Builds',
    tag: 'CASE_STUDIES',
    desc: 'Portfolio case studies and sample builds on two platforms, launching Q1 2027.',
  },
  {
    slug: 'michellevision',
    title: 'How I Designed MichelleVision',
    tag: 'CASE_STUDY',
    desc: 'The goals, design system, key pages, and technical choices behind this portfolio site.',
  },
  {
    slug: 'advertise',
    title: 'Advertising & Sponsorships',
    tag: 'SPONSORS',
    desc: 'How ads and sponsorships work on michellevision.com, and the disclosure standards I follow.',
  },
  {
    slug: 'platforms',
    title: 'Which Platform Fits Your Project?',
    tag: 'PLATFORM_GUIDE',
    desc: 'Next.js or Astro: a plain-language guide to choosing for a marketing website.',
  },
];

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

// Step the title size down for long titles so they never overflow the card.
function titleSize(title: string, type: CardType) {
  if (type === 'home') return 64;
  if (title.length > 70) return 44;
  if (title.length > 45) return 50;
  return 56;
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Drafts are hidden in production builds but visible in `astro dev`.
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );

  const postPaths = posts.map((post) => ({
    params: { type: 'post', slug: post.id },
    props: {
      title: post.data.title,
      tag: post.data.topics,
      desc: post.data.description || DEFAULT_DESC,
    } satisfies CardProps,
  }));

  const workPaths = WORK_PAGES.map(({ slug, ...props }) => ({
    params: { type: 'work', slug },
    props,
  }));

  // One card per unique topic, matching src/pages/blog/topic/[topic].astro
  const uniqueTopics = [...new Set(posts.map((post) => post.data.topics))];
  const topicPaths = uniqueTopics.map((topicName) => {
    const count = posts.filter((post) => post.data.topics === topicName).length;
    return {
      params: { type: 'topic', slug: slugify(topicName) },
      props: {
        title: topicName,
        tag: topicName,
        desc: `${count} ${count === 1 ? 'post' : 'posts'} on ${topicName.toLowerCase()} from MichelleVision.`,
      } satisfies CardProps,
    };
  });

  const homePath = {
    params: { type: 'home', slug: 'index' },
    props: {
      title: 'Marketing Web Developer',
      tag: 'WP_ASTRO',
      desc: DEFAULT_DESC,
    } satisfies CardProps,
  };

  return [homePath, ...postPaths, ...workPaths, ...topicPaths];
};

// Satori needs real font bytes (TTF/OTF, not woff2). Paths resolve from the
// project root via process.cwd() because Vite bundles this route into
// dist/.prerender/chunks/, which breaks paths relative to import.meta.url.
const FONTS_DIR = join(process.cwd(), 'src', 'assets', 'fonts');

// Read the fonts once and reuse them for every card in the build.
let fontsPromise: Promise<Buffer[]> | undefined;
function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(join(FONTS_DIR, 'Inter-Regular.ttf')),
    readFile(join(FONTS_DIR, 'Inter-Bold.ttf')),
    readFile(join(FONTS_DIR, 'FiraCode-SemiBold.ttf')),
  ]);
  return fontsPromise;
}

// Satori's element tree is plain objects shaped like compiled JSX, so this
// works without a JSX runtime.
function el(type: string, props: Record<string, unknown> = {}, children?: unknown) {
  return { type, props: { ...props, children } };
}

export const GET: APIRoute = async ({ params, props }) => {
  const type = params.type as CardType;
  const { title, tag, desc } = props as CardProps;

  const fallbackTag: Record<CardType, string> = {
    home: 'MARKETING_WEB_DEV',
    post: 'BLOG_ENTRY',
    work: 'DEPLOYED_SYSTEM',
    topic: 'TOPIC_STREAM',
  };
  const tagLabel = (tag || fallbackTag[type]).toUpperCase();
  const showChips = type === 'home' || type === 'work';

  const [interRegular, interBold, firaCode] = await loadFonts();

  const chipRow = showChips
    ? el(
        'div',
        { style: { display: 'flex', flexWrap: 'wrap', gap: '10px' } },
        CHIPS.map((chip) =>
          el(
            'div',
            {
              style: {
                fontFamily: 'Fira Code',
                fontSize: '18px',
                color: TEXT,
                backgroundColor: PANEL,
                border: `1px solid ${BORDER}`,
                padding: '6px 14px',
                borderRadius: '6px',
              },
            },
            chip
          )
        )
      )
    : null;

  const card = el(
    'div',
    {
      style: {
        position: 'relative',
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: BG,
        padding: '64px',
      },
    },
    [
      // Gold bar along the top edge
      el('div', {
        style: { position: 'absolute', top: 0, left: 0, width: '1200px', height: '8px', backgroundColor: ACCENT },
      }),
      // Top row: wordmark + page-type badge
      el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
        el(
          'div',
          {
            style: {
              fontFamily: 'Fira Code',
              fontSize: '28px',
              fontWeight: 600,
              color: ACCENT,
              letterSpacing: '0.05em',
            },
          },
          'MICHELLEVISION //'
        ),
        el(
          'div',
          {
            style: {
              fontFamily: 'Fira Code',
              fontSize: '20px',
              color: ACCENT,
              border: `1px solid ${BORDER}`,
              backgroundColor: PANEL,
              padding: '8px 20px',
              borderRadius: '6px',
            },
          },
          `[ ${truncate(tagLabel, 28)} ]`
        ),
      ]),
      // Middle: title, description, and capability chips
      el('div', { style: { display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1040px' } }, [
        el(
          'div',
          {
            style: {
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: `${titleSize(title, type)}px`,
              lineHeight: 1.15,
              color: TEXT,
              letterSpacing: '-0.02em',
            },
          },
          truncate(title, 90)
        ),
        el(
          'div',
          {
            style: {
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '28px',
              lineHeight: 1.5,
              color: MUTED,
            },
          },
          truncate(desc, 150)
        ),
        ...(chipRow ? [chipRow] : []),
      ]),
      // Footer bar
      el(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${BORDER}`,
            paddingTop: '24px',
            fontFamily: 'Fira Code',
            fontSize: '20px',
            color: MUTED,
          },
        },
        [
          el('div', {}, 'michellevision.com'),
          el('div', { style: { color: ACCENT } }, 'MARKETING // WEB // INTEGRATION'),
        ]
      ),
    ]
  );

  return new ImageResponse(card as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
      { name: 'Fira Code', data: firaCode, weight: 600, style: 'normal' },
    ],
  });
};