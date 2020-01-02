import 'react-app-polyfill/ie11';
import React, { useState } from 'react';
import { render } from 'react-dom';

import Pdf from '../.';
import './pdfs/basic.pdf';

const App = () => {
  const [page, setPage] = useState(1);

  return (
    <Pdf file="basic.33e35a62.pdf" page={page}>
      {({ pdfDocument, canvas }) => (
        <>
          {!pdfDocument && <span>Loading...</span>}
          {canvas}
          {Boolean(pdfDocument?.numPages) && (
            <nav>
              <ul className="pager">
                <li className="previous">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                </li>
                <li className="next">
                  <button
                    disabled={page === pdfDocument?.numPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </Pdf>
  );
};

render(<App />, document.getElementById('root'));
