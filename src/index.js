/**
 * @class ReactPdfJs
 */
import PdfJsLib from 'pdfjs-dist';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const ReactPdfJs = ({
  file,
  onDocumentComplete,
  scale,
  rotate,
  page,
  cMapUrl,
  cMapPacked,
  className,
  workerSrc,
}) => {
  const [pdf, setPdf] = useState(null);

  const canvasEl = useRef(null);

  // do our initial setup
  useEffect(() => {
    PdfJsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    const loadingTask = PdfJsLib.getDocument({ url: file, cMapUrl, cMapPacked });
    loadingTask.promise.then((document) => {
      setPdf(document);
      if (onDocumentComplete) {
        onDocumentComplete(document._pdfInfo.numPages); // eslint-disable-line
      }
      document.getPage(page).then(p => drawPDF(p));
    });
  }, []);

  // see if anything has changed
  const oldPage = usePrevious(page);
  const oldScale= usePrevious(scale);
  const oldRotate = usePrevious(rotate);
  useEffect(() => {
    if (pdf && (oldPage !== page || oldScale !== scale || oldRotate !== rotate)) {
      pdf.getPage(page).then(p => drawPDF(p));
    }
  }, [page, scale, rotate]);

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

  return <canvas ref={canvasEl} className={className} />;
}

ReactPdfJs.propTypes = {
  file: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  page: PropTypes.number,
  onDocumentComplete: PropTypes.func,
  scale: PropTypes.number,
  rotate: PropTypes.oneOf([0, 90, 180, 270]),
  cMapUrl: PropTypes.string,
  cMapPacked: PropTypes.bool,
  className: PropTypes.string,
  workerSrc: PropTypes.string,
}

ReactPdfJs.defaultProps = {
  page: 1,
  onDocumentComplete: null,
  scale: 1,
  rotate: 0,
  cMapUrl: '../node_modules/pdfjs-dist/cmaps/',
  cMapPacked: false,
  className: '',
  workerSrc: '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.js',
}

export default ReactPdfJs;
