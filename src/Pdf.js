import React, {Component, PropTypes} from 'react';

class Pdf extends Component {
  constructor(props) {
    super(props);
    this.onDocumentComplete = this.onDocumentComplete.bind(this);
    this.onPageComplete = this.onPageComplete.bind(this);
  }

  state = {};

  componentDidMount() {
    this.loadPDFDocument(this.props);
    this.renderPdf();
  }

  componentWillReceiveProps(newProps) {
    const {pdf} = this.state;
    if ((newProps.file && newProps.file !== this.props.file) ||
      (newProps.content && newProps.content !== this.props.content)) {
      this.loadPDFDocument(newProps);
    }
    if (pdf && newProps.page && newProps.page !== this.props.page) {
      this.setState({page: null});
      pdf.getPage(newProps.page).then(this.onPageComplete);
    }
  }

  onDocumentComplete(pdf) {
    this.setState({pdf: pdf});
    const {onDocumentComplete} = this.props;
    if (typeof onDocumentComplete === 'function') {
      onDocumentComplete(pdf.numPages);
    }
    pdf.getPage(this.props.page).then(this.onPageComplete);
  }

  onPageComplete(page) {
    this.setState({page: page});
    this.renderPdf();
    const {onPageComplete} = this.props;
    if (typeof onPageComplete === 'function') {
      onPageComplete(page.pageIndex + 1);
    }
  }

  loadByteArray(byteArray) {
    window.PDFJS.getDocument(byteArray).then(this.onDocumentComplete);
  }

  loadPDFDocument(props) {
    if (!!props.file) {
      if (typeof props.file === 'string') {
        return window.PDFJS.getDocument(props.file)
          .then(this.onDocumentComplete);
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

  renderPdf() {
    const {page} = this.state;
    if (page) {
      let {canvas} = this.refs;
      if (canvas.getDOMNode) { // compatible with react 0.13
        canvas = canvas.getDOMNode();
      }
      const canvasContext = canvas.getContext('2d');
      const {scale} = this.props;
      const viewport = page.getViewport(scale);
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      page.render({canvasContext, viewport});
    }
  }

  render() {
    const {loading} = this.props;
    const {page} = this.state;
    return page ? <canvas ref="canvas"/> : loading || <div>Loading PDF...</div>;
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
