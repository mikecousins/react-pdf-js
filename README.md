# react-pdf-js
---
[![NPM Version](https://img.shields.io/npm/v/react-pdf-js.svg?style=flat-square)](https://www.npmjs.com/package/react-pdf-js)
[![NPM Downloads](https://img.shields.io/npm/dm/react-pdf-js.svg?style=flat-square)](https://www.npmjs.com/package/react-pdf-js)
[![Build Status](https://img.shields.io/travis/mikecousins/react-pdf-js/master.svg?style=flat-square)](https://travis-ci.org/mikecousins/react-pdf-js)
[![Dependency Status](https://david-dm.org/mikecousins/react-pdf-js.svg)](https://david-dm.org/mikecousins/react-pdf-js)
[![devDependency Status](https://david-dm.org/mikecousins/react-pdf-js/dev-status.svg)](https://david-dm.org/mikecousins/react-pdf-js#info=devDependencies)

`react-pdf-js` provides a component for rendering PDF documents using [PDF.js](http://mozilla.github.io/pdf.js/). Written for React 15/16 and ES2015 using the Airbnb style guide.

---

Usage
-----

Install with `npm install react-pdf-js`

Use in your app (showing some basic pagination as well):

```js
import React from 'react';
import PDF from 'react-pdf-js';

class MyPdfViewer extends React.Component {
  state = {};

  onDocumentComplete = (pages) => {
    this.setState({ page: 1, pages });
  }

  onPageComplete = (page) => {
    this.setState({ page });
  }

  handlePrevious = () => {
    this.setState({ page: this.state.page - 1 });
  }

  handleNext = () => {
    this.setState({ page: this.state.page + 1 });
  }

  renderPagination = (page, pages) => {
    let previousButton = <li className="previous" onClick={this.handlePrevious}><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
    if (page === 1) {
      previousButton = <li className="previous disabled"><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
    }
    let nextButton = <li className="next" onClick={this.handleNext}><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
    if (page === pages) {
      nextButton = <li className="next disabled"><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
    }
    return (
      <nav>
        <ul className="pager">
          {previousButton}
          {nextButton}
        </ul>
      </nav>
      );
  }

  render() {
    let pagination = null;
    if (this.state.pages) {
      pagination = this.renderPagination(this.state.page, this.state.pages);
    }
    return (
      <div>
        <PDF
          file="somefile.pdf"
          onDocumentComplete={this.onDocumentComplete}
          onPageComplete={this.onPageComplete}
          page={this.state.page}
        />
        {pagination}
      </div>
    )
  }
}

module.exports = MyPdfViewer;
```

## Scaling

The PDF can be scaled in a couple of different ways.

### Stretch to fill width/height

Use the prop `fillWidth` to make the PDF stretch to the width of the parent element (generally speaking, this will be the enclosing `<div>`), or use `fillHeight` to do the same for the height of the PDF. The PDF will be scaled proportionately.

Both `fillWidth` and `fillHeight` default to `false`.

Note: `fillWidth` has precedence over `fillHeight`. So if you use both, the PDF will stretch to fill the width.

Example:

```js
<div className="parentDivWhoseWidthAndHeightAreUsedToStretchThePdf">
  <PDF
    file="somefile.pdf"
    fillWidth
    fillHeight // this will be ignored because fillWidth is also passed
  />
</div>
```

### Set scale directly

You can also set the scale manually by passing the `scale` prop. A `scale` between `0` and `1` shrinks the PDF, and a `scale` greater than `1` enlarges it.

`scale` defaults to `1`.

Note: the value of `scale` will be ignored if you also use `fillWidth` or `fillHeight`.

Example:

```js
<div>
  <PDF
    file="somefile.pdf"
    scale={1.5}
  />
</div>
```

## Credit

This project is a fork of [react-pdfjs](https://github.com/erikras/react-pdfjs) which itself was a port of [react-pdf](https://github.com/nnarhinen/react-pdf), so thank you to
the original authours.
