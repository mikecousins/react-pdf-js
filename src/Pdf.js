import React, {Component, PropTypes} from 'react';

require('pdfjs-dist/build/pdf.combined');

class Pdf extends Component {
  state = {};

  componentDidMount() {
    this.loadPDFDocument(this.props);
  }

  componentWillReceiveProps(newProps) {
    if ((newProps.file && newProps.file !== this.props.file) ||
      (newProps.content && newProps.content !== this.props.content)) {
      this.loadPDFDocument(newProps);
    }
    if (!!this.state.pdf && !!newProps.page && newProps.page !== this.props.page) {
      this.setState({page: null});
      this.state.pdf.getPage(newProps.page).then(this.onPageComplete);
    }
  }

  onDocumentComplete(pdf) {
    if (!this.isMounted()) return;
    this.setState({pdf: pdf});
    if (!!this.props.onDocumentComplete && typeof this.props.onDocumentComplete === 'function') {
      this.props.onDocumentComplete(pdf.numPages);
    }
    pdf.getPage(this.props.page).then(this._onPageComplete);
  }

  onPageComplete(page) {
    if (!this.isMounted()) return;
    this.setState({page: page});
    if (!!this.props.onPageComplete && typeof this.props.onPageComplete === 'function') {
      this.props.onPageComplete(page.pageIndex + 1);
    }
  }

  loadByteArray(byteArray) {
    window.PDFJS.getDocument(byteArray).then(this._onDocumentComplete);
  }

  loadPDFDocument(props) {
    if (!!props.file) {
      if (typeof props.file === 'string') {
        return window.PDFJS.getDocument(props.file)
          .then(this._onDocumentComplete);
      }
      // Is a File object
      const reader = new FileReader();
      reader.onloadend = () =>
        this.loadByteArray(new Uint8Array(reader.result));
      reader.readAsArrayBuffer(props.file);
    } else if (!!props.content) {
      const bytes = window.atob(props.content);
      const byteLength = bytes.length;
      const byteArray = new Uint8Array(new ArrayBuffer(byteLength));
      for (let index = 0; index < byteLength; index++) {
        byteArray[index] = bytes.charCodeAt(index);
      }
      this.loadByteArray(byteArray);
    } else {
      throw new Error('React-PDFjs works with a file(URL) or (base64)content. At least one needs to be provided!');
    }
  }

  render() {
    if (this.state.page) {
      setTimeout(() => {
        if (this.isMounted()) {
          const {canvas} = this.refs;
          const canvasContext = canvas.getContext('2d');
          const {scale} = this.props;
          const viewport = this.state.page.getViewport(scale);
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          this.state.page.render({canvasContext, viewport});
        }
      });
      return <canvas ref="canvas"/>;
    }
    return this.props.loading || <div>Loading PDF...</div>;
  }
}
Pdf.displayName = 'React-PDFjs';
Pdf.propTypes = {
  content: PropTypes.string,
  file: PropTypes.string,
  loading: PropTypes.any,
  page: PropTypes.number,
  scale: PropTypes.number,
  onDocumentComplete: PropTypes.func,
  onPageComplete: PropTypes.func
};
Pdf.defaultProps = {page: 1, scale: 1.0};

export default Pdf;
