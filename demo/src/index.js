import React, { Component } from 'react';
import { render } from 'react-dom'
import Pdf from '../../src';

export default class App extends Component {
  state = { page: 1, rotate: 0 };

  onDocumentComplete = (pages) => {
    this.setState({ page: 1, pages });
  }

  handlePrevious = () => {
    this.setState({ page: this.state.page - 1 });
  }

  handleNext = () => {
    this.setState({ page: this.state.page + 1 });
  }

  renderPagination = (page, pages) => {
    let previousButton = (
      <li className="previous">
        <button onClick={this.handlePrevious} className="btn btn-link">
          Previous
        </button>
      </li>
    );
    if (page === 1) {
      previousButton = (
        <li className="previous disabled">
          <button className="btn btn-link">
            Previous
          </button>
        </li>
      );
    }
    let nextButton = (
      <li className="next">
        <button onClick={this.handleNext} className="btn btn-link">
          Next
        </button>
      </li>
    );
    if (page === pages) {
      nextButton = (
        <li className="next disabled">
          <button className="btn btn-link">
            Next
          </button>
        </li>
      );
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

  render () {
    let pagination = null;
    if (this.state.pages) {
      pagination = this.renderPagination(this.state.page, this.state.pages);
    }
    return (
      <div>
        <div className="pdf-preview">
          <Pdf
            file="test.pdf"
            onDocumentComplete={this.onDocumentComplete}
            page={this.state.page}
            scale={0.5}
            rotate={this.state.rotate}
          />
        </div>
        {pagination}
        <nav>
          <span>rotate</span>
          <button
            onClick={
              (e) => { this.setState({ rotate: 0 }); }
            }
            disabled={this.state.rotate === 0}
          >0</button>
          <button
            onClick={
              (e) => { this.setState({ rotate: 90 }); }
            }
            disabled={this.state.rotate === 90}
          >90</button>
          <button
            onClick={
              (e) => { this.setState({ rotate: 180 }); }
            }
            disabled={this.state.rotate === 180}
          >180</button>
          <button
            onClick={
              (e) => { this.setState({ rotate: 270 }); }
            }
            disabled={this.state.rotate === 270}
          >270</button>
        </nav>
      </div>
    );
  }
}

render(<App />, document.querySelector('#demo'));