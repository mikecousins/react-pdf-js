# react-pdf-js

`react-pdf-js` provides a component for rendering PDF documents using [PDF.js](http://mozilla.github.io/pdf.js/).

---
[![NPM Version](https://img.shields.io/npm/v/react-pdf-js.svg?style=flat-square)](https://www.npmjs.com/package/react-pdf-js)
[![NPM Downloads](https://img.shields.io/npm/dm/react-pdf-js.svg?style=flat-square)](https://www.npmjs.com/package/react-pdf-js)
[![Build Status](https://travis-ci.com/mikecousins/react-pdf-js.svg?branch=master)](https://travis-ci.com/mikecousins/react-pdf-js)
[![Dependency Status](https://david-dm.org/mikecousins/react-pdf-js.svg)](https://david-dm.org/mikecousins/react-pdf-js)
[![devDependency Status](https://david-dm.org/mikecousins/react-pdf-js/dev-status.svg)](https://david-dm.org/mikecousins/react-pdf-js#info=devDependencies)
[![Netlify Status](https://api.netlify.com/api/v1/badges/4ce8e5b5-16ca-4942-8c47-095debbc4693/deploy-status)](https://app.netlify.com/sites/pdf/deploys)

# Demo

https://pdf.netlify.com

# Usage

Install with `yarn add react-pdf-js` or `npm install react-pdf-js`

Use it in your app (showing some basic pagination as well):

```js
import React, { useState, useEffect, useRef } from 'react';
import { usePdf } from 'react-pdf-js';

const MyPdfViewer = () => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(null);

  const renderPagination = (page, pages) => {
    if (!pages) {
      return null;
    }
    let previousButton = <li className="previous" onClick={() => setPage(page - 1)}><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
    if (page === 1) {
      previousButton = <li className="previous disabled"><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
    }
    let nextButton = <li className="next" onClick={() => setPage(page + 1)}><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
    if (page === pages) {
      nextButton = <li className="next disabled"><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
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

  const [loading, numPages] = usePdf({
    file: 'test.pdf',
    onDocumentComplete,
    page,
    canvasEl
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
}

export default MyPdfViewer;
```

# Props

When you call usePdf you'll want to pass in a subset of these props, like this:

> `const [loading, numPages] = usePdf({ canvasEl, file: 'https://example.com/test.pdf', page });`

## canvasEl

A reference to the canvas element. Create with:

> `const canvasEl = useRef(null);`

and then render it like:

> `<canvas ref={canvasEl} />`

and then pass it into usePdf.

## file

URL of the PDF file.

## page

Specify the page that you want to display. Default = 1,

## scale

Allows you to scale the PDF. Default = 1.

## rotate

Allows you to rotate the PDF. Number is in degrees. Default = 0.

## cMapUrl

Allows you to specify a cmap url. Default = '../node_modules/pdfjs-dist/cmaps/'.

## cMapPacked

Allows you to specify  whether the cmaps are packed or not. Default = false.

## workerSrc

Allows you to specify a custom pdf worker url. Default = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.js'.

## withCredentials

Allows you to add the withCredentials flag. Default = false.

# Known Issues

When using Create React App 3.0 you'll get some warnings about:
> ./node_modules/pdfjs-dist/build/pdf.js
Critical dependency: require function is used in a way in which dependencies cannot be statically extracted

Issues have been logged with create-react-app and pdf.js about this issue.

# License

MIT © [mikecousins](https://github.com/mikecousins)
