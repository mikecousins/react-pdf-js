import type { Route } from './+types/home';
import { useRef, useState } from 'react';
import { usePdf } from '@mikecousins/react-pdf';
import clsx from 'clsx';
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/solid';

export function meta({}: Route.MetaArgs) {
  return [
    { title: '@mikecousins/react-pdf' },
    {
      name: 'description',
      content:
        'The simplest PDF rendering library for modern websites. @mikecousins/react-pdf is super lightweight and will embed a PDF in your website easily.',
    },
  ];
}

export default function Home() {
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);

  const { pdfDocument } = usePdf({
    file: 'udm_se_ds.pdf',
    page,
    canvasRef,
    scale: 0.4,
  });

  const previousDisabled = page === 1;
  const nextDisabled = Boolean(page === pdfDocument?.numPages);

  return (
    <div className="w-full flex flex-col">
      <div className="bg-gradient-to-r from-sky-800 to-indigo-800">
        <div className="container text-center py-12 mx-auto">
          <div className="text-4xl font-bold text-white">
            @mikecousins/react-pdf
          </div>
          <div className="text-xl text-gray-200 mt-4">
            The easiest way to render PDFs in React.{' '}
            <a
              href="https://bundlephobia.com/package/@mikecousins/react-pdf"
              className="text-blue-400"
            >
              Under 1kB in size.
            </a>{' '}
            Modern React hook architecture.
          </div>
        </div>
      </div>
      <div className="bg-gray-100">
        <div className="container text-center py-12 mx-auto flex">
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center">
              <button
                disabled={previousDisabled}
                onClick={() => setPage(page - 1)}
                className={clsx(
                  previousDisabled ? 'text-gray-300' : 'text-gray-900'
                )}
              >
                <ArrowLeftCircleIcon className="h-12 w-12" />
              </button>
            </div>
          </div>
          <div>
            {!pdfDocument && <span>Loading...</span>}
            <canvas ref={canvasRef} />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center">
              <button
                disabled={nextDisabled}
                onClick={() => setPage(page + 1)}
                className={clsx(
                  nextDisabled ? 'text-gray-300' : 'text-gray-900'
                )}
              >
                <ArrowRightCircleIcon className="h-12 w-12" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-200">
        <div className="container text-center py-12 mx-auto">
          <div className="flex flex-row gap-4 px-4 justify-center">
            <a
              href="https://www.npmjs.com/package/@mikecousins/react-pdf"
              className="text-blue-400 underline"
            >
              NPM
            </a>
            <a
              href="https://github.com/mikecousins/react-pdf-js"
              className="text-blue-400 underline"
            >
              Github
            </a>
            <a
              href="https://bundlephobia.com/package/@mikecousins/react-pdf"
              className="text-blue-400 underline"
            >
              Bundlephobia
            </a>
            <a
              href="https://opencollective.com/react-pdf-js"
              className="text-blue-400 underline"
            >
              Open Collective
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
