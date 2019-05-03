import expect from 'expect';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import Pdf from 'src/';

describe('Pdf', () => {
  let node;

  beforeEach(() => {
    node = document.createElement('div');
  })

  afterEach(() => {
    unmountComponentAtNode(node);
  })

  it('renders without issue', () => {
    render(<Pdf file="test.pdf" />, node, () => expect(node.innerHTML).toContain('<canvas></canvas>'));
  })
})
