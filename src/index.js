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
    scale: PropTypes.number,
    className: PropTypes.string,
  }

  static defaultProps = {
    page: 1,
    onDocumentComplete: null,
    scale: 1,
  }

  state = {
    pdf: null,
  };

  componentDidMount() {
    const {
      file,
      onDocumentComplete,
      page,
    } = this.props;
    PdfJsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js';
    PdfJsLib.getDocument(file).then((pdf) => {
      this.setState({ pdf });
      if (onDocumentComplete) {
        onDocumentComplete(pdf._pdfInfo.numPages); // eslint-disable-line
      }
      pdf.getPage(page).then(p => this.drawPDF(p));
    });
  }

  componentWillReceiveProps(newProps) {
    const { page, scale } = this.props;
    const { pdf } = this.state;
    if (newProps.page !== page) {
      pdf.getPage(newProps.page).then(p => this.drawPDF(p));
    }
    if (newProps.scale !== scale) {
      pdf.getPage(newProps.page).then(p => this.drawPDF(p));
    }
  }

  drawPDF = (page) => {
    const { scale } = this.props;
    const viewport = page.getViewport(scale);
    const { canvas } = this;
    const canvasContext = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext,
      viewport,
    };
    page.render(renderContext);
  }

  render() {
    const { className } = this.props;
    return <canvas ref={(canvas) => { this.canvas = canvas; }} className={className} />;
  }
}
