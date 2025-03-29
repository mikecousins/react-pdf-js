---
title: Basic Usage
nextjs:
  metadata:
    title: Basic Usage
    description: How to quickly embed a PDF.
---

The library uses a headless philosophy and allows you to more easily customize the
embedding of your PDFs. You can draw your own canvas and then render to it by providing it's ref to
the `usePdf` hook.

---

## Basic Code

Here is a basic implementation of our library. It also has pagination built-in,
using simple back/next buttons. You can extend this however you want, you just need to set the page
variable that's passed to the hook.

```typescript
import { useState, useRef } from 'react';
import { usePdf } from '@mikecousins/react-pdf';

const MyPdfViewer = () => {
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);

  const { pdfDocument, pdfPage } = usePdf({
    file: 'test.pdf',
    page,
    canvasRef,
  });

  return (
    <div>
      {!pdfDocument && <span>Loading...</span>}
      <canvas ref={canvasRef} />
      {Boolean(pdfDocument && pdfDocument.numPages) && (
        <nav>
          <ul className="pager">
            <li className="previous">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
            </li>
            <li className="next">
              <button
                disabled={page === pdfDocument.numPages}
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
```
