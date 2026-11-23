import { defineConfig } from 'astro/config';
import readingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTimeResult = readingTime(textOnPage);
    if (!data.astro) data.astro = {};
    if (!data.astro.frontmatter) data.astro.frontmatter = {};
    data.astro.frontmatter.readingTime = readingTimeResult.text;
  };
}

export default defineConfig({
  site: 'https://www.michellevision.com',
  integrations: [sitemap()],
  output: 'static',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkReadingTime],
    }),
  },
});
