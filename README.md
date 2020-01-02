# react-pdf-js

`react-pdf-js` provides a component for rendering PDF documents using [PDF.js](http://mozilla.github.io/pdf.js/).

---

[![NPM Version](https://img.shields.io/npm/v/@mikecousins/react-pdf.svg?style=flat-square)](https://www.npmjs.com/package/@mikecousins/react-pdf)
[![NPM Downloads](https://img.shields.io/npm/dm/@mikecousins/react-pdf.svg?style=flat-square)](https://www.npmjs.com/package/@mikecousins/react-pdf)
[![Dependency Status](https://david-dm.org/mikecousins/react-pdf-js.svg)](https://david-dm.org/mikecousins/react-pdf-js)
[![devDependency Status](https://david-dm.org/mikecousins/react-pdf-js/dev-status.svg)](https://david-dm.org/mikecousins/react-pdf-js#info=devDependencies)
[![Netlify Status](https://api.netlify.com/api/v1/badges/4ce8e5b5-16ca-4942-8c47-095debbc4693/deploy-status)](https://app.netlify.com/sites/pdf/deploys)
[![codecov](https://codecov.io/gh/mikecousins/react-pdf-js/branch/master/graph/badge.svg)](https://codecov.io/gh/mikecousins/react-pdf-js)

# Demo

https://pdf.netlify.com

# Usage

Install with `yarn add @mikecousins/react-pdf` or `npm install @mikecousins/react-pdf`

## `usePdf` hook

Use the hook in your app (showing some basic pagination as well):

```js
import React, { useState, useRef } from 'react';
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

## Props

When you call usePdf you'll want to pass in a subset of these props, like this:

> `const { pdfDocument, pdfPage } = usePdf({ canvasRef, file: 'https://example.com/test.pdf', page });`

### canvasRef

A reference to the canvas element. Create with:

> `const canvasRef = useRef(null);`

and then render it like:

> `<canvas ref={canvasRef} />`

and then pass it into usePdf.

### file

URL of the PDF file.

### onDocumentLoadSuccess

Allows you to specify a callback that is called when the PDF document data will be fully loaded.
Callback is called with [PDFDocumentProxy](https://github.com/mozilla/pdf.js/blob/master/src/display/api.js#L579)
as an only argument.

### onDocumentLoadFail

Allows you to specify a callback that is called after an error occurred during PDF document data loading.

### onPageLoadSuccess

Allows you to specify a callback that is called when the PDF page data will be fully loaded.
Callback is called with [PDFPageProxy](https://github.com/mozilla/pdf.js/blob/master/src/display/api.js#L897)
as an only argument.

### onPageLoadFail

Allows you to specify a callback that is called after an error occurred during PDF page data loading.

### onPageRenderSuccess

Allows you to specify a callback that is called when the PDF page will be fully rendered into the DOM.
Callback is called with [PDFPageProxy](https://github.com/mozilla/pdf.js/blob/master/src/display/api.js#L897)
as an only argument.

### onPageRenderFail

Allows you to specify a callback that is called after an error occurred during PDF page rendering.

### page

Specify the page that you want to display. Default = 1,

### scale

Allows you to scale the PDF. Default = 1.

### rotate

Allows you to rotate the PDF. Number is in degrees. Default = 0.

### cMapUrl

Allows you to specify a cmap url. Default = '../node_modules/pdfjs-dist/cmaps/'.

### cMapPacked

Allows you to specify whether the cmaps are packed or not. Default = false.

### workerSrc

Allows you to specify a custom pdf worker url. Default = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/\${pdfjs.version}/pdf.worker.js'.

### withCredentials

Allows you to add the withCredentials flag. Default = false.

## Returned values

### pdfDocument

`pdfjs`'s `PDFDocumentProxy` [object](https://github.com/mozilla/pdf.js/blob/master/src/display/api.js#L579).
This can be undefined if document has not been loaded yet.

### pdfPage

`pdfjs`'s `PDFPageProxy` [object](https://github.com/mozilla/pdf.js/blob/master/src/display/api.js#L897)
This can be undefined if page has not been loaded yet.

## `Pdf` component

You can also use the `Pdf` component (which uses `usePdf` hook internally):

```js
import React, { useState } from 'react';
import Pdf from '@mikecousins/react-pdf';

const MyPdfViewer = () => {
  const [page, setPage] = useState(1);

  return <Pdf file="basic.33e35a62.pdf" page={page} />;
};
```

Or if you want to use pdf's data (e.g. to render pagination):

```js
import React, { useState } from 'react';
import Pdf from '@mikecousins/react-pdf';

const MyPdfViewer = () => {
  const [page, setPage] = useState(1);

  return (
    <Pdf file="basic.33e35a62.pdf" page={page}>
      {({ pdfDocument, pdfPage, canvas }) => (
        <>
          {!pdfDocument && <span>Loading...</span>}
          {canvas}
          {Boolean(pdfDocument && pdfDocument.numPages) && (
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
                    disabled={page === pdfDocument.numPages}
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
```

Notice that in the second example, you are responsible for rendering the canvas element into the DOM.

## Props

`Pdf` component accepts all the props that `usePdf` hook do, with exception of `canvasRef` (the component renders it by itself).

Additionaly, the component accepts:

### children

A function that receives data returned by `usePdf` hook with addition of canvas element. You are responsible for rendering that element into the DOM if you choose to pass children prop.

# License

MIT © [mikecousins](https://github.com/mikecousins)
