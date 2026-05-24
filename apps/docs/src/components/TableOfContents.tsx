import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

export type Subsection = {
  id: string;
  title: string;
};

export type Section = {
  id: string;
  title: string;
  children: Array<Subsection>;
};

export function TableOfContents({
  tableOfContents,
}: {
  tableOfContents: Array<Section>;
}) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id);

  let getHeadings = useCallback((sections: Array<Section>) => {
    return sections
      .flatMap((node) => [node.id, ...node.children.map((child) => child.id)])
      .map((id) => {
        let el = document.getElementById(id);
        if (!el) return null;

        let style = window.getComputedStyle(el);
        let scrollMt = parseFloat(style.scrollMarginTop);

        let top = window.scrollY + el.getBoundingClientRect().top - scrollMt;
        return { id, top };
      })
      .filter((x): x is { id: string; top: number } => x !== null);
  }, []);

  useEffect(() => {
    if (tableOfContents.length === 0) return;
    let headings = getHeadings(tableOfContents);
    function onScroll() {
      let top = window.scrollY;
      let current = headings[0]?.id;
      for (let heading of headings) {
        if (top >= heading.top - 10) {
          current = heading.id;
        } else {
          break;
        }
      }
      if (current) setCurrentSection(current);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [getHeadings, tableOfContents]);

  function isActive(section: Section | Subsection): boolean {
    if (section.id === currentSection) {
      return true;
    }
    if (!('children' in section) || !section.children) {
      return false;
    }
    return section.children.findIndex(isActive) > -1;
  }

  return (
    <div className="hidden xl:sticky xl:top-[4.75rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
      <nav aria-labelledby="on-this-page-title" className="w-56">
        {tableOfContents.length > 0 && (
          <>
            <h2
              id="on-this-page-title"
              className="font-display text-sm font-medium text-slate-900 dark:text-white"
            >
              On this page
            </h2>
            <ol role="list" className="mt-4 space-y-3 text-sm">
              {tableOfContents.map((section) => (
                <li key={section.id}>
                  <h3>
                    <a
                      href={`#${section.id}`}
                      className={clsx(
                        isActive(section)
                          ? 'text-sky-500'
                          : 'font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                      )}
                    >
                      {section.title}
                    </a>
                  </h3>
                  {section.children.length > 0 && (
                    <ol
                      role="list"
                      className="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400"
                    >
                      {section.children.map((subSection) => (
                        <li key={subSection.id}>
                          <a
                            href={`#${subSection.id}`}
                            className={
                              isActive(subSection)
                                ? 'text-sky-500'
                                : 'hover:text-slate-600 dark:hover:text-slate-300'
                            }
                          >
                            {subSection.title}
                          </a>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ol>
          </>
        )}
      </nav>
    </div>
  );
}
