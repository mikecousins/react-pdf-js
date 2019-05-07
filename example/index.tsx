import 'react-app-polyfill/ie11';
import React, { useRef, useState, useEffect } from 'react';
import { render } from 'react-dom';
import { usePdf } from '../.';
import './pdfs/basic.pdf';

const App = () => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(null);

  const renderPagination = (page, pages) => {
    if (!pages) {
      return null;
    }
    let previousButton = (
      <li className="previous">
        <button onClick={() => setPage(page - 1)}>Previous</button>
      </li>
    );
    if (page === 1) {
      previousButton = (
        <li className="disabled">
          <button>Previous</button>
        </li>
      );
    }
    let nextButton = (
      <li className="next">
        <button onClick={() => setPage(page + 1)}>Next</button>
      </li>
    );
    if (page === pages) {
      nextButton = (
        <li>
          <button>Next</button>
        </li>
      );
    }
    return (
      <nav>
        <ul className="pager">
          {previousButton}
          {nextButton}
        </ul>
      </nav>
    );
  };

  const canvasEl = useRef(null);

  const [loading, numPages] = usePdf({
    file: 'basic.0dbc8f27.pdf',
    page,
    canvasEl,
  });

  useEffect(() => {
    setPages(numPages);
  }, [numPages]);

  return (
    <div>
      {loading && <span>Loading...</span>}
      <canvas ref={canvasEl} />
      {renderPagination(page, pages)}
    </div>
  );
};

render(<App />, document.getElementById('root'));
