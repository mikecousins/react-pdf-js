import pdfjs from 'pdfjs-dist';
import React, { useState, useEffect, useRef } from 'react';

type ComponentProps = {
  file: string;
  onDocumentComplete: (numPages: number) => void;
  onPageLoaded: () => void;
  page?: number;
  scale?: number;
  rotate?: number;
  cMapUrl?: string;
  cMapPacked?: boolean;
  workerSrc?: string;
  withCredentials?: boolean;
};

const Pdf = ({
  file,
  onDocumentComplete,
  onPageLoaded,
  page,
  scale,
  rotate,
  cMapUrl,
  cMapPacked,
  workerSrc,
  withCredentials,
}: ComponentProps) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const [, numPages] = usePdf({
    canvasEl,
    file,
    page,
    scale,
    rotate,
    cMapUrl,
    cMapPacked,
    workerSrc,
    withCredentials,
    onPageLoaded,
  });

  useEffect(() => {
    onDocumentComplete(numPages);
  }, [numPages, onDocumentComplete]);

  return <canvas ref={canvasEl} />;
};

Pdf.defaultProps = {
  onDocumentComplete: () => {},
  onPageLoaded: () => {},
};

type HookProps = {
  canvasEl: React.RefObject<HTMLCanvasElement>;
  file: string;
  onPageLoaded?: () => void;
  scale?: number;
  rotate?: number;
  page?: number;
  cMapUrl?: string;
  cMapPacked?: boolean;
  workerSrc?: string;
  withCredentials?: boolean;
};

type HookReturnValues = [boolean, number];

export const usePdf = ({
  canvasEl,
  file,
  onPageLoaded = undefined,
  scale = 1,
  rotate = 0,
  page = 1,
  cMapUrl,
  cMapPacked,
  workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`,
  withCredentials = false,
}: HookProps): HookReturnValues => {
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy>();
  const renderTask = useRef<pdfjs.PDFRenderTask | null>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  }, [workerSrc]);

  useEffect(() => {
    const config: pdfjs.PDFSource = { url: file, withCredentials };
    if (cMapUrl) {
      config.cMapUrl = cMapUrl;
      config.cMapPacked = cMapPacked;
    }
    pdfjs.getDocument(config).promise.then(setPdf);
  }, [file, withCredentials, cMapUrl, cMapPacked]);

  // handle changes
  useEffect(() => {
    // draw a page of the pdf
    const drawPDF = (page: pdfjs.PDFPageProxy) => {
      // Because this page's rotation option overwrites pdf default rotation value,
      // calculating page rotation option value from pdf default and this component prop rotate.
      const rotation = rotate === 0 ? page.rotate : page.rotate + rotate;
      const dpRatio = window.devicePixelRatio;
      const adjustedScale = scale * dpRatio;
      const viewport = page.getViewport({ scale: adjustedScale, rotation });
      const canvas = canvasEl.current;
      if (!canvas) {
        return;
      }

      const canvasContext = canvas.getContext('2d');
      if (!canvasContext) {
        return;
      }

      canvas.style.width = `${viewport.width / dpRatio}px`;
      canvas.style.height = `${viewport.height / dpRatio}px`;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // if previous render isn't done yet, we cancel it
      if (renderTask.current) {
        renderTask.current.cancel();
        return;
      }

      renderTask.current = page.render({
        canvasContext,
        viewport,
      });

      return renderTask.current.promise.then(
        () => {
          renderTask.current = null;

          if (typeof onPageLoaded === 'function') {
            onPageLoaded();
          }
        },
        err => {
          renderTask.current = null;

          // @ts-ignore typings are outdated
          if (err.name === 'RenderingCancelledException') {
            drawPDF(page);
          }
        }
      );
    };

    if (pdf) {
      pdf.getPage(page).then(drawPDF);
    }
  }, [pdf, page, scale, rotate, canvasEl, onPageLoaded]);

  const loading = !pdf;
  const numPages = pdf ? pdf.numPages : 0;

  return [loading, numPages];
};

export default Pdf;
