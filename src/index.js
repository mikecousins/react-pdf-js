/**
 * @class ReactPdfJs
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PdfJsLib from 'pdfjs-dist';

export default class ReactPdfJs extends Component {
  static propTypes = {
    file: PropTypes.string
  }

  componentDidMount() {
    PdfJsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.550/pdf.worker.js';
    PdfJsLib.getDocument(this.props.file).then((pdf) => {
      pdf.getPage(1).then((page) => {
        var scale = 1.5;
        var viewport = page.getViewport(scale);
        
        var canvas = document.getElementById('pdf-canvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
    });
  }

  render() {
    return <canvas id="pdf-canvas" />;
  }
}
