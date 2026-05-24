import { defineMarkdocConfig, component, nodes } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  nodes: {
    heading: {
      ...nodes.heading,
      render: component('./src/components/Heading.astro'),
    },
    fence: {
      attributes: {
        language: { type: String },
        content: { type: String },
      },
      render: component('./src/components/Fence.astro'),
    },
  },
  tags: {
    callout: {
      attributes: {
        title: { type: String },
        type: {
          type: String,
          default: 'note',
          matches: ['note', 'warning'],
          errorLevel: 'critical',
        },
      },
      render: component('./src/components/Callout.astro'),
    },
    figure: {
      selfClosing: true,
      attributes: {
        src: { type: String },
        alt: { type: String },
        caption: { type: String },
      },
      render: component('./src/components/Figure.astro'),
    },
    'quick-links': {
      render: component('./src/components/QuickLinks.astro'),
    },
    'quick-link': {
      selfClosing: true,
      attributes: {
        title: { type: String },
        description: { type: String },
        icon: { type: String },
        href: { type: String },
      },
      render: component('./src/components/QuickLink.astro'),
    },
  },
});
