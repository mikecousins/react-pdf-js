import { slugifyWithCounter } from '@sindresorhus/slugify';
import type { Section, Subsection } from '@/components/TableOfContents';

type AnyNode = {
  type?: string;
  attributes?: Record<string, unknown> & { level?: number; content?: string; id?: string };
  children?: AnyNode[];
};

function getNodeText(node: AnyNode): string {
  let text = '';
  for (const child of node.children ?? []) {
    if (child.type === 'text' && typeof child.attributes?.content === 'string') {
      text += child.attributes.content;
    }
    text += getNodeText(child);
  }
  return text;
}

export function collectSections(
  nodes: AnyNode[],
  slugify = slugifyWithCounter()
): Section[] {
  const sections: Section[] = [];

  for (const node of nodes) {
    if (node.type === 'heading' && (node.attributes?.level === 2 || node.attributes?.level === 3)) {
      const title = getNodeText(node);
      if (title) {
        const id = (node.attributes.id as string | undefined) ?? slugify(title);
        if (node.attributes.level === 3) {
          const parent = sections[sections.length - 1];
          if (!parent) {
            throw new Error('Cannot add `h3` to table of contents without a preceding `h2`');
          }
          parent.children.push({ id, title } satisfies Subsection);
        } else {
          sections.push({ id, title, children: [] });
        }
      }
    }

    sections.push(...collectSections(node.children ?? [], slugify));
  }

  return sections;
}

export type { Section, Subsection };
