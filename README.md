#react-pdf-js
---
[![NPM Version](https://img.shields.io/npm/v/react-pdf-js.svg?style=flat-square)](https://www.npmjs.com/package/react-pdf-js)
[![NPM Downloads](https://img.shields.io/npm/dm/react-pdf-js.svg?style=flat-square)](https://www.npmjs.com/package/react-pdf-js)
[![Build Status](https://img.shields.io/travis/mikecousins/react-pdfjs/master.svg?style=flat-square)](https://travis-ci.org/mikecousins/react-pdfjs)
[![devDependency Status](https://david-dm.org/mikecousins/react-pdfjs/dev-status.svg)](https://david-dm.org/mikecousins/react-pdfjs#info=devDependencies)

`react-pdf-js` provides a component for rendering PDF documents using [PDF.js](http://mozilla.github.io/pdf.js/). Written for React 15 and ES2015 using the Airbnb style guide.

---

Usage
-----

Install with `npm install react-pdf-js`

Use in your app (showing some basic pagination as well):

```js
import React from 'react';
import PDF from 'react-pdf-js';

class MyPdfViewer extends React.Component {
  constructor(props) {
    super(props);
    this.onDocumentComplete = this.onDocumentComplete.bind(this);
    this.onPageCompleted = this.onPageCompleted.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  onDocumentComplete(pages) {
    this.setState({ page: 1, pages });
  }

  onPageCompleted(page) {
    this.setState({ page });
  }

  handlePrevious() {
    this.setState({ page: this.state.page - 1 });
  }

  handleNext() {
    this.setState({ page: this.state.page + 1 });
  }

  renderPagination(page, pages) {
    let previousButton = <button type="button" className="btn btn-default" onClick={this.handlePrevious}><i className="fa fa-arrow-left"></i> Previous</button>;
    if (page === 1) {
      previousButton = <button type="button" className="btn btn-default" disabled><i className="fa fa-arrow-left"></i> Previous</button>;
    }
    let nextButton = <button type="button" className="btn btn-default" onClick={this.handleNext}>Next <i className="fa fa-arrow-right"></i></button>;
    if (page === pages) {
      nextButton = <button type="button" className="btn btn-default" disabled>Next <i className="fa fa-arrow-right"></i></button>;
    }
    return <div>{previousButton} {nextButton}</div>;
  }

  render() {
    let pagination = null;
    if (this.state.pages) {
      pagination = this.renderPagination(this.state.page, this.state.pages);
    }
    return (
      <div>
        <PDF file="somefile.pdf" onDocumentComplete={this.onDocumentComplete} onPageCompleted={this.onPageCompleted} page={this.state.page} />
        {pagination}
      </div>
  }
}

module.exports = MyPdfViewer;
```


## Credit

This project is a fork of [react-pdfjs](https://github.com/erikras/react-pdfjs) which itself was a port of [react-pdf](https://github.com/nnarhinen/react-pdf), so thank you to
the original authours.
