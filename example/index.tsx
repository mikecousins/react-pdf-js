import 'react-app-polyfill/ie11';
import React, { useRef, useState, useEffect } from 'react';
import { render } from 'react-dom';
import { usePdf } from '../.';
import './pdfs/basic.pdf';

const App = () => {
  const [page, setPage] = useState(1);
  const canvasEl = useRef(null);

  const [loading, pages] = usePdf({
    file: 'basic.33e35a62.pdf',
    page,
    canvasEl,
  });

  return (
    <div>
      {loading && <span>Loading...</span>}
      <canvas ref={canvasEl} />
      {Boolean(pages) && (
        <nav>
          <ul className="pager">
            <li className="previous">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
            </li>
            <li className="next">
              <button
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

render(<App />, document.getElementById('root'));
