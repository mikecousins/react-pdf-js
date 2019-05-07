import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import Pdf from '../src';

describe('Pdf', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    render(<Pdf file="test.pdf" />, div);
    unmountComponentAtNode(div);
  });
});
