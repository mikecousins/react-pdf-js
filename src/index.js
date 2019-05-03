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
    rotate: PropTypes.oneOf([0, 90, 180, 270]),
    cMapUrl: PropTypes.string,
    cMapPacked: PropTypes.bool,
    className: PropTypes.string,
  }

  static defaultProps = {
    page: 1,
    onDocumentComplete: null,
    scale: 1,
    rotate: 0,
    cMapUrl: '../node_modules/pdfjs-dist/cmaps/',
    cMapPacked: false,
  }

  state = {
    pdf: null,
  };

  componentDidMount() {
    const {
      file,
      onDocumentComplete,
      page,
      cMapUrl,
      cMapPacked,
    } = this.props;
    PdfJsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js';
    PdfJsLib.getDocument({ url: file, cMapUrl, cMapPacked }).then((pdf) => {
      this.setState({ pdf });
      if (onDocumentComplete) {
        onDocumentComplete(pdf._pdfInfo.numPages); // eslint-disable-line
      }
      pdf.getPage(page).then(p => this.drawPDF(p));
    });
  }

  componentWillReceiveProps(newProps) {
    const { page, scale, rotate } = this.props;
    const { pdf } = this.state;
    if (newProps.page !== page || newProps.scale !== scale || newProps.rotate !== rotate) {
      pdf.getPage(newProps.page).then(p => this.drawPDF(p));
    }
  }

  drawPDF = (page) => {
    const { scale, rotate } = this.props;
    // Because this page's rotation option overwrites pdf default rotation value,
    // calculating page rotation option value from pdf default and this component prop rotate.
    const rotation = rotate === 0 ? page.rotate : page.rotate + rotate;
    const viewport = page.getViewport(scale, rotation);
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
