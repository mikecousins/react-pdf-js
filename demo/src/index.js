import React, { useState } from 'react';
import { render } from 'react-dom'
import Pdf from '../../src';

const App = () => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(null);
  const [rotate, setRotate] = useState(0);

  const onDocumentComplete = (pages) => {
    setPage(1);
    setPages(pages);
  }

  const renderPagination = (page, pages) => {
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

  let pagination = null;
  if (pages) {
    pagination = renderPagination(page, pages);
  }
  return (
    <div>
      <div className="pdf-preview">
        <Pdf
          file="test.pdf"
          onDocumentComplete={onDocumentComplete}
          page={page}
          scale={1}
          rotate={rotate}
        />
      </div>
      {pagination}
      <nav>
        <span>rotate</span>
        <button
          onClick={() => setRotate(0)}
          disabled={rotate === 0}
        >0</button>
        <button
          onClick={() => setRotate(90)}
          disabled={rotate === 90}
        >90</button>
        <button
          onClick={() => setRotate(180)}
          disabled={rotate === 180}
        >180</button>
        <button
          onClick={() => setRotate(270)}
          disabled={rotate === 270}
        >270</button>
      </nav>
    </div>
  );
};

render(<App />, document.querySelector('#demo'));
