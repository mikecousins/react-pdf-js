import PdfJsLib from 'pdfjs-dist';
import React, { useState, useEffect, useRef, useMemo } from 'react';

const Pdf = ({ file, onDocumentComplete }) => {
  const canvasEl = useRef();
  const [numPages] = usePdf({ canvasEl, file });

  useEffect(() => {
    onDocumentComplete(numPages)
  }, [numPages]);

  return <canvas ref={canvasEl} />;
};

Pdf.defaultProps = {
  onDocumentComplete: () => {},
};

export const usePdf = ({
  canvasEl,
  file,
  scale = 1,
  rotate = 0,
  page = 1,
  cMapUrl = '../node_modules/pdfjs-dist/cmaps/',
  cMapPacked = false,
  workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.js',
}) => {
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    PdfJsLib.GlobalWorkerOptions.workerSrc = workerSrc;
  }, []);

  useEffect(() => {
    PdfJsLib.getDocument({ url: file, cMapUrl, cMapPacked }).promise.then(setPdf);
  }, [file, cMapUrl, cMapPacked]);

  // handle changes
  useEffect(() => {
    if (pdf) {
      pdf.getPage(page).then(p => drawPDF(p));
    }
  }, [pdf, page, scale, rotate, canvasEl]);

  // draw a page of the pdf
  const drawPDF = (page) => {
    // Because this page's rotation option overwrites pdf default rotation value,
    // calculating page rotation option value from pdf default and this component prop rotate.
    const rotation = rotate === 0 ? page.rotate : page.rotate + rotate;
    const viewport = page.getViewport({ scale, rotation });
    const canvas = canvasEl.current;
    const canvasContext = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext,
      viewport,
    };
    page.render(renderContext);
  }

  const loading = useMemo(() => !pdf, [pdf]);
  const numPages = useMemo(() => pdf ? pdf._pdfInfo.numPages : null, [pdf]);

  return [loading, numPages];
};

export default Pdf;
