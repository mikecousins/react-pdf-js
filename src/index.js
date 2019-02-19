/**
 * @class ReactPdfJs
 */
import PdfJsLib from 'pdfjs-dist';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class ReactPdfJs extends Component {
  static propTypes = {
    file: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
    page: PropTypes.number,
    onDocumentComplete: PropTypes.func,
    onChangePage: PropTypes.func,
    scale: PropTypes.number,
    cMapUrl: PropTypes.string,
    cMapPacked: PropTypes.bool,
    className: PropTypes.string,
  }

  static defaultProps = {
    page: 1,
    onDocumentComplete: null,
    onChangePage: null,
    scale: 1,
    cMapUrl: '../node_modules/pdfjs-dist/cmaps/',
    cMapPacked: false,
    className: '',
  }

  state = {
    pdf: null,
    numPages: 0,
  };

  componentDidMount() {
    const {
      file,
      page,
      cMapUrl,
      cMapPacked,
    } = this.props;
    PdfJsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js';
    PdfJsLib.getDocument({ url: file, cMapUrl, cMapPacked }).then((pdf) => {
      this.setState({ pdf, numPages: pdf._pdfInfo.numPages }); // eslint-disable-line

      pdf.getPage(page).then(p => this.drawPDF(p));
    });
  }

  componentWillReceiveProps(newProps) {
    const { page, scale, onChangePage } = this.props;
    const { pdf } = this.state;
    if (newProps.page !== page) {
      pdf.getPage(newProps.page).then((p) => {
        this.drawPDF(p);

        if (onChangePage) onChangePage(p.pageNumber);
      });
    }
    if (newProps.scale !== scale) {
      pdf.getPage(newProps.page).then((p) => {
        this.drawPDF(p);

        if (onChangePage) onChangePage(p.pageNumber);
      });
    }
  }

  drawPDF = (page) => {
    const { scale, onDocumentComplete } = this.props;
    const { numPages } = this.state;
    const viewport = page.getViewport(scale);
    const { canvas } = this;
    const canvasContext = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext,
      viewport,
    };

    const renderTask = page.render(renderContext);
    renderTask.promise.then(() => {
      if (onDocumentComplete) {
        onDocumentComplete(numPages, page.pageNumber);
      }
    });
  }

  render() {
    const { className } = this.props;
    return <canvas ref={(canvas) => { this.canvas = canvas; }} className={className} />;
  }
}
