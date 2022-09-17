import { useRef, useState } from 'react';
import { usePdf } from '@mikecousins/react-pdf';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import './index.css';

function App() {
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);

  const { pdfDocument } = usePdf({
    file: 'udm_se_ds.pdf',
    page,
    canvasRef,
    scale: 0.6,
  });

  return (
    <div className="w-full flex flex-col">
      <div className="bg-gradient-to-r from-sky-800 to-indigo-800 container text-center py-12">
        <div className="text-4xl font-bold text-white">@mikecousins/react-pdf</div>
        <div className="text-xl text-gray-200 mt-4">The easiest way to render PDFs in React</div>
      </div>
      <div className="bg-gray-100 container text-center py-12">
        <div className="flex">
          <div className="flex-1">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ArrowLeftCircleIcon className="h-16 w-16" />
            </button>
          </div>
          <div>
            {!pdfDocument && <span>Loading...</span>}
            <canvas ref={canvasRef} />
          </div>
          <div className="flex-1">
            <button
              disabled={page === pdfDocument?.numPages}
              onClick={() => setPage(page + 1)}
            >
              <ArrowRightCircleIcon className="h-16 w-16" />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 container text-center py-12">Code example coming soon!</div>
    </div>
  );
}

export default App;
