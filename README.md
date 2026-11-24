# MichelleVision

[![Live site](https://img.shields.io/badge/live-michellevision.com-C9A96E?style=flat-square)](https://www.michellevision.com)
![Astro](https://img.shields.io/badge/Astro-0D0E11?style=flat-square&logo=astro&logoColor=C9A96E)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

Source code for [michellevision.com](https://www.michellevision.com), the portfolio and services site of Michelle Sadsad Luyenga, a marketing web developer. It is a fast, static Astro site with a typed content collection, technical SEO, analytics, and lead-capture forms.

This is a clean public version of the site's code. It contains no secrets, and nothing in it depends on private data.

<!-- Add a screenshot after you take one:
![Home page on desktop and phone](docs/home.png)
-->

## What it shows

- **Static-first Astro site:** pre-rendered pages and very little client-side JavaScript.
- **Typed content:** blog posts are Markdown files in an Astro content collection, validated by a Zod schema (title, description, dates, category, tags, draft status). A mistake in a post fails the build instead of reaching visitors.
- **Blog index:** keyword search, category filters, and load-more paging written in vanilla TypeScript, with button states and a live status message for screen readers.
- **Category pages and reading time:** a category page per topic, and a small custom remark plugin that calculates reading time.
- **Technical SEO:** canonical URLs, Open Graph and Twitter Card tags, an XML sitemap, structured data (JSON-LD), an `llms.txt` file, and IndexNow submission.
- **Build-time share images:** a 1200 by 630 Open Graph image is generated for every page and post with `@vercel/og`, using local font files.
- **Analytics:** GA4 (the ID comes from an environment variable) and Vercel Analytics.
- **Forms:** contact and newsletter forms through Formspree, with a honeypot spam field, submission without a page reload, and clear success and error states.
- **Accessibility basics:** visible keyboard focus, labeled form fields, readable contrast, and responsive layouts that work on phones.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Astro (static output) |
| Language | TypeScript, plus HTML and CSS |
| Content | Markdown content collections, Zod |
| SEO | `@astrojs/sitemap`, JSON-LD, IndexNow |
| Images | `@vercel/og` |
| Analytics | GA4, Vercel Analytics |
| Forms | Formspree |
| Hosting | Vercel |

## Project structure

```text
.
├── public/                 Static files (robots, llms.txt, favicon)
├── src/
│   ├── assets/fonts/       Font files used by the share-image generator
│   ├── components/         Header, footer, forms, SEO component, and more
│   ├── content/blog/       Blog posts in Markdown
│   ├── layouts/            BaseLayout (head tags, analytics, page frame)
│   ├── lib/                Small helpers (slugify, share-image URLs)
│   ├── pages/              Routes: home, services, cases, blog, legal, 404
│   │   └── og/             Build-time Open Graph image endpoint
│   └── content.config.ts   Content collection and schema
├── .github/
│   ├── dependabot.yml      Weekly dependency update pull requests
│   └── workflows/ci.yml    Builds the site on every pull request
├── astro.config.mjs        Site URL, sitemap, reading-time plugin
└── .env.example            Environment variables you need to set
```

## Getting started

You need Node.js (see the `engines` field in `package.json` for the supported version) and npm.

```bash
git clone https://github.com/michelleluyenga/MichelleVision.git
cd <repo-name>
npm install
cp .env.example .env
npm run dev
```

The site runs at `http://localhost:4321`.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server (drafts are visible) |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Preview the production build locally |

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement ID. Leave it empty to turn Google Analytics off. |

Set the same variables in your hosting dashboard. Do not commit a `.env` file.

## Adding a blog post

Create a Markdown file in `src/content/blog/`:

```md
---
title: "How to track a form submission in GA4"
description: "A short summary that also becomes the meta description."
pubDate: 2026-11-20
topics: "MarTech & Analytics"
tags: ["ga4", "google-tag-manager"]
draft: false
---

Your content here.
```

Posts with `draft: true` are hidden from production builds.

## Deploying

1. Push the repository to GitHub.
2. Import it into Vercel. The Astro preset works without extra settings.
3. Add the environment variables from the table above.
4. Every push builds a preview, and the default branch deploys to production.

## Maintenance

- **Dependabot** opens a pull request each Monday for npm and GitHub Actions updates. Astro and its integrations are grouped into one pull request.
- **CI** builds the site on every pull request and on pushes to the main branch, so a broken update is caught before it merges.
- Major version updates (for example a new Astro major) are reviewed by hand and tested in a preview before merging.

## Design decisions

- **Static output:** marketing pages should load fast and need no server. Dynamic work is limited to forms, which use a hosted service.
- **Typed content:** a schema is cheaper than finding broken posts after launch.
- **Share images at build time:** every page gets a unique preview card, and nothing runs when a visitor opens a link.
- **Plain TypeScript for the blog filters:** the interaction is small, so a UI framework was not worth the extra JavaScript.

## What I would improve next

- Add tag pages once a tag has at least three posts
- Add automated accessibility and link checks to the build
- Add sample projects that connect this front end to a headless CMS, a CRM, and analytics tools (see [the case studies](https://www.michellevision.com/cases))

## Development notes

I use AI assistants for drafting and review while I build. I read, test, and deploy every change myself.

## Contact

- Site: [michellevision.com](https://www.michellevision.com)
- LinkedIn: [linkedin.com/in/michelleluyenga](https://www.linkedin.com/in/michelleluyenga)
- GitHub: [github.com/michelleluyenga](https://github.com/michelleluyenga)

## License

The code is released under the MIT License (see `LICENSE`). The site's written content, brand assets, and articles are © Michelle Sadsad Luyenga and are not covered by that license.
