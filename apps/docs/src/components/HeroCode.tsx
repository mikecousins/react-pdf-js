import { Fragment } from 'react';
import { Highlight } from 'prism-react-renderer';
import clsx from 'clsx';

const codeLanguage = 'typescript';
const code = `  const { pdfDocument, pdfPage } = usePdf({
    file: 'test.pdf',
    page,
    canvasRef,
  });`;

const tabs = [
  { name: 'pdf-viewer.tsx', isActive: true },
  { name: 'package.json', isActive: false },
];

function TrafficLightsIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 42 10" fill="none" {...props}>
      <circle cx="5" cy="5" r="4.5" />
      <circle cx="21" cy="5" r="4.5" />
      <circle cx="37" cy="5" r="4.5" />
    </svg>
  );
}

export function HeroCode() {
  return (
    <div className="pt-4 pl-4">
      <TrafficLightsIcon className="h-2.5 w-auto stroke-slate-500/30" />
      <div className="mt-4 flex space-x-2 text-xs">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            className={clsx(
              'flex h-6 rounded-full',
              tab.isActive
                ? 'bg-linear-to-r from-sky-400/30 via-sky-400 to-sky-400/30 p-px font-medium text-sky-300'
                : 'text-slate-500'
            )}
          >
            <div
              className={clsx(
                'flex items-center rounded-full px-2.5',
                tab.isActive && 'bg-slate-800'
              )}
            >
              {tab.name}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-start px-1 text-sm">
        <div
          aria-hidden="true"
          className="border-r border-slate-300/5 pr-4 font-mono text-slate-600 select-none"
        >
          {Array.from({ length: code.split('\n').length }).map((_, index) => (
            <Fragment key={index}>
              {(index + 1).toString().padStart(2, '0')}
              <br />
            </Fragment>
          ))}
        </div>
        <Highlight
          code={code}
          language={codeLanguage}
          theme={{ plain: {}, styles: [] }}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={clsx(className, 'flex overflow-x-auto pb-6')}
              style={style}
            >
              <code className="px-4">
                {tokens.map((line, lineIndex) => (
                  <div key={lineIndex} {...getLineProps({ line })}>
                    {line.map((token, tokenIndex) => (
                      <span key={tokenIndex} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
