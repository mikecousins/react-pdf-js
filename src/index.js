import PdfJsLib from 'pdfjs-dist';
import { useState, useEffect, useRef } from 'react';

const usePdf = ({
  canvasEl,
  file,
  onDocumentComplete = () => {},
  scale = 1,
  rotate = 0,
  page = 1,
  cMapUrl = '../node_modules/pdfjs-dist/cmaps/',
  cMapPacked = false,
  workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.js',
}) => {
  const [pdf, setPdf] = useState(null);

  // do our initial setup
  useEffect(() => {
    PdfJsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    const loadingTask = PdfJsLib.getDocument({ url: file, cMapUrl, cMapPacked });
    loadingTask.promise.then((doc) => {
      setPdf(doc);
      onDocumentComplete(doc._pdfInfo.numPages);
    });
  }, [file, cMapUrl, cMapPacked, workerSrc]);

  // handle changes
  useEffect(() => {
    if (pdf) {
      pdf.getPage(page).then(p => drawPDF(p));
    }
  }, [pdf, page, scale, rotate]);

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

  return null;
};

export default usePdf;
