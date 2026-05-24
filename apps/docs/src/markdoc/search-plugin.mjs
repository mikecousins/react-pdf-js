import Markdoc from '@markdoc/markdoc';
import { slugifyWithCounter } from '@sindresorhus/slugify';
import glob from 'fast-glob';
import * as fs from 'node:fs';
import * as path from 'node:path';

const VIRTUAL_ID = 'virtual:search';
const RESOLVED_ID = '\0' + VIRTUAL_ID;
const slugify = slugifyWithCounter();

function toString(node) {
  let str =
    node.type === 'text' && typeof node.attributes?.content === 'string'
      ? node.attributes.content
      : '';
  if ('children' in node) {
    for (let child of node.children) {
      str += toString(child);
    }
  }
  return str;
}

function extractSections(node, sections, isRoot = true) {
  if (isRoot) {
    slugify.reset();
  }
  if (node.type === 'heading' || node.type === 'paragraph') {
    let content = toString(node).trim();
    if (node.type === 'heading' && node.attributes.level <= 2) {
      let hash = node.attributes?.id ?? slugify(content);
      sections.push([content, hash, []]);
    } else {
      sections.at(-1)[2].push(content);
    }
  } else if ('children' in node) {
    for (let child of node.children) {
      extractSections(child, sections, false);
    }
  }
}

function buildIndex(contentDir) {
  let files = glob.sync('**/*.mdoc', { cwd: contentDir });
  return files.map((file) => {
    let slug = file.replace(/\.mdoc$/, '');
    let url = slug === 'index' ? '/' : `/docs/${slug}`;
    let md = fs.readFileSync(path.join(contentDir, file), 'utf8');

    let ast = Markdoc.parse(md);
    let title =
      ast.attributes?.frontmatter?.match(/^title:\s*(.*?)\s*$/m)?.[1];
    let sections = [[title, null, []]];
    extractSections(ast, sections);

    return { url, sections };
  });
}

export default function searchIndex() {
  const contentDir = path.resolve('./src/content/docs');

  return {
    name: 'react-pdf-docs-search',
    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_ID;
      }
    },
    load(id) {
      if (id !== RESOLVED_ID) return;

      const data = buildIndex(contentDir);

      return `
import FlexSearch from 'flexsearch';

let sectionIndex = new FlexSearch.Document({
  tokenize: 'full',
  document: {
    id: 'url',
    index: 'content',
    store: ['title', 'pageTitle'],
  },
  context: {
    resolution: 9,
    depth: 2,
    bidirectional: true,
  },
});

let data = ${JSON.stringify(data)};

for (let { url, sections } of data) {
  for (let [title, hash, content] of sections) {
    sectionIndex.add({
      url: url + (hash ? '#' + hash : ''),
      title,
      content: [title, ...content].join('\\n'),
      pageTitle: hash ? sections[0][0] : undefined,
    });
  }
}

export function search(query, options = {}) {
  let result = sectionIndex.search(query, { ...options, enrich: true });
  if (result.length === 0) {
    return [];
  }
  return result[0].result.map((item) => ({
    url: item.id,
    title: item.doc.title,
    pageTitle: item.doc.pageTitle,
  }));
}
`;
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(contentDir)) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: 'full-reload' });
        }
      }
    },
  };
}
