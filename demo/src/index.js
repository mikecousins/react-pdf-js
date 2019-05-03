import React, { useState, useRef } from 'react';
import { render } from 'react-dom'
import usePdf from '../../src';

const App = () => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(null);

  const onDocumentComplete = (pages) => {
    setPage(1);
    setPages(pages);
  }

  const renderPagination = (page, pages) => {
    if (!pages) {
      return null;
    }
    let previousButton = (
      <li className="previous">
        <button onClick={() => setPage(page - 1)}>
          Previous
        </button>
      </li>
    );
    if (page === 1) {
      previousButton = (
        <li className="disabled">
          <button>
            Previous
          </button>
        </li>
      );
    }
    let nextButton = (
      <li className="next">
        <button onClick={() => setPage(page + 1)}>
          Next
        </button>
      </li>
    );
    if (page === pages) {
      nextButton = (
        <li>
          <button>
            Next
          </button>
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
  }

  const canvasEl = useRef(null);

  usePdf({
    file: 'test.pdf',
    onDocumentComplete,
    page,
    canvasEl
  });

  return (
    <div>
      <canvas ref={canvasEl} />
      {renderPagination(page, pages)}
    </div>
  );
};

render(<App />, document.querySelector('#demo'));
