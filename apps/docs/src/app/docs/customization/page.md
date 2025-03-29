---
title: Customization
nextjs:
  metadata:
    title: Customization
    description: Take your PDFs to the next level with the rich customization of our library.
---

We expose most of the inner workings of our library for easy customization. See below for all of the props you can pass in and the return values you get out of our hook.

---

## Props

When you call usePdf you'll want to pass in a subset of these props, like this:

```typescript
const { pdfDocument, pdfPage } = usePdf({
  canvasRef,
  file: 'https://example.com/test.pdf',
  page,
});
```

### canvasRef
A reference to the canvas element. Create with:

const canvasRef = useRef(null);

and then render it like:

```typescript
<canvas ref={canvasRef} />
```

and then pass it into usePdf.

### file
URL of the PDF file.

### onDocumentLoadSuccess
Allows you to specify a callback that is called when the PDF document data will be fully loaded. Callback is called with PDFDocumentProxy as an only argument.

### onDocumentLoadFail
Allows you to specify a callback that is called after an error occurred during PDF document data loading.

### onPageLoadSuccess
Allows you to specify a callback that is called when the PDF page data will be fully loaded. Callback is called with PDFPageProxy as an only argument.

### onPageLoadFail
Allows you to specify a callback that is called after an error occurred during PDF page data loading.

### onPageRenderSuccess
Allows you to specify a callback that is called when the PDF page will be fully rendered into the DOM. Callback is called with PDFPageProxy as an only argument.

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
Allows you to specify a custom pdf worker url. Default = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js'.

### withCredentials
Allows you to add the withCredentials flag. Default = false.

## Returned values
### pdfDocument
pdfjs's PDFDocumentProxy object. This can be undefined if the document has not been loaded yet.

### pdfPage
pdfjs's PDFPageProxy object This can be undefined if the page has not been loaded yet.
