import { useState, useEffect, useRef } from 'react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import type { DocumentInitParameters } from 'pdfjs-dist/types/src/display/api';

function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

type PDFRenderTask = ReturnType<PDFPageProxy['render']>;

type HookProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  file: string;
  onDocumentLoadSuccess?: (document: PDFDocumentProxy) => void;
  onDocumentLoadFail?: () => void;
  onPageLoadSuccess?: (page: PDFPageProxy) => void;
  onPageLoadFail?: () => void;
  onPageRenderSuccess?: (page: PDFPageProxy) => void;
  onPageRenderFail?: () => void;
  scale?: number;
  rotate?: number;
  page?: number;
  cMapUrl?: string;
  cMapPacked?: boolean;
  workerSrc?: string;
  withCredentials?: boolean;
};

type HookReturnValues = {
  pdfDocument: PDFDocumentProxy | undefined;
  pdfPage: PDFPageProxy | undefined;
};

export const usePdf = ({
  canvasRef,
  file,
  onDocumentLoadSuccess,
  onDocumentLoadFail,
  onPageLoadSuccess,
  onPageLoadFail,
  onPageRenderSuccess,
  onPageRenderFail,
  scale = 1,
  rotate = 0,
  page = 1,
  cMapUrl,
  cMapPacked,
  workerSrc,
  withCredentials = false,
}: HookProps): HookReturnValues => {
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy>();
  const [pdfPage, setPdfPage] = useState<PDFPageProxy>();
  const renderTask = useRef<PDFRenderTask | null>(null);
  const lastPageRequestedRenderRef = useRef<PDFPageProxy | null>(null);
  const onDocumentLoadSuccessRef = useRef(onDocumentLoadSuccess);
  const onDocumentLoadFailRef = useRef(onDocumentLoadFail);
  const onPageLoadSuccessRef = useRef(onPageLoadSuccess);
  const onPageLoadFailRef = useRef(onPageLoadFail);
  const onPageRenderSuccessRef = useRef(onPageRenderSuccess);
  const onPageRenderFailRef = useRef(onPageRenderFail);

  // assign callbacks to refs to avoid redrawing
  useEffect(() => {
    onDocumentLoadSuccessRef.current = onDocumentLoadSuccess;
  }, [onDocumentLoadSuccess]);

  useEffect(() => {
    onDocumentLoadFailRef.current = onDocumentLoadFail;
  }, [onDocumentLoadFail]);

  useEffect(() => {
    onPageLoadSuccessRef.current = onPageLoadSuccess;
  }, [onPageLoadSuccess]);

  useEffect(() => {
    onPageLoadFailRef.current = onPageLoadFail;
  }, [onPageLoadFail]);

  useEffect(() => {
    onPageRenderSuccessRef.current = onPageRenderSuccess;
  }, [onPageRenderSuccess]);

  useEffect(() => {
    onPageRenderFailRef.current = onPageRenderFail;
  }, [onPageRenderFail]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('pdfjs-dist').then(({ GlobalWorkerOptions, version }) => {
      GlobalWorkerOptions.workerSrc =
        workerSrc ||
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.mjs`;
    });
  }, [workerSrc]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const config: DocumentInitParameters = { url: file, withCredentials };
    if (cMapUrl) {
      config.cMapUrl = cMapUrl;
      config.cMapPacked = cMapPacked;
    }

    import('pdfjs-dist').then(({ getDocument }) => {
      getDocument(config).promise.then(
        (loadedPdfDocument) => {
          setPdfDocument(loadedPdfDocument);

          if (isFunction(onDocumentLoadSuccessRef.current)) {
            onDocumentLoadSuccessRef.current(loadedPdfDocument);
          }
        },
        () => {
          if (isFunction(onDocumentLoadFailRef.current)) {
            onDocumentLoadFailRef.current();
          }
        }
      );
    });
  }, [file, withCredentials, cMapUrl, cMapPacked]);

  useEffect(() => {
    // draw a page of the pdf
    const drawPDF = (page: PDFPageProxy) => {
      // Because this page's rotation option overwrites pdf default rotation value,
      // calculating page rotation option value from pdf default and this component prop rotate.
      const rotation = rotate === 0 ? page.rotate : page.rotate + rotate;
      const viewport = page.getViewport({ scale, rotation });
      const canvasEl = canvasRef!.current;
      if (!canvasEl) {
        return;
      }

      const canvasContext = canvasEl.getContext('2d');
      if (!canvasContext) {
        return;
      }

      const devicePixelRatio =
        typeof window !== 'undefined' ? window.devicePixelRatio : 1;

      canvasEl.height = viewport.height * devicePixelRatio;
      canvasEl.width = viewport.width * devicePixelRatio;

      canvasContext.scale(devicePixelRatio, devicePixelRatio);

      // if previous render isn't done yet, we cancel it
      if (renderTask.current) {
        lastPageRequestedRenderRef.current = page;
        renderTask.current.cancel();
        return;
      }

      renderTask.current = page.render({
        canvasContext,
        canvas: canvasEl,
        viewport,
      });

      return renderTask.current.promise.then(
        () => {
          renderTask.current = null;

          if (isFunction(onPageRenderSuccessRef.current)) {
            onPageRenderSuccessRef.current(page);
          }
        },
        (reason: Error) => {
          renderTask.current = null;

          if (reason && reason.name === 'RenderingCancelledException') {
            const lastPageRequestedRender =
              lastPageRequestedRenderRef.current ?? page;
            lastPageRequestedRenderRef.current = null;
            drawPDF(lastPageRequestedRender);
          } else if (isFunction(onPageRenderFailRef.current)) {
            onPageRenderFailRef.current();
          }
        }
      );
    };

    if (pdfDocument) {
      pdfDocument.getPage(page).then(
        (loadedPdfPage) => {
          setPdfPage(loadedPdfPage);

          if (isFunction(onPageLoadSuccessRef.current)) {
            onPageLoadSuccessRef.current(loadedPdfPage);
          }

          drawPDF(loadedPdfPage);
        },
        () => {
          if (isFunction(onPageLoadFailRef.current)) {
            onPageLoadFailRef.current();
          }
        }
      );
    }
  }, [canvasRef, page, pdfDocument, rotate, scale]);

  return { pdfDocument, pdfPage };
};
