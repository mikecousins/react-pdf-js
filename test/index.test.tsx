import React, { useRef } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { usePdf } from '../src/index';

describe('Pdf', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const canvasEl = useRef(null);

    usePdf({
      file: 'basic.33e35a62.pdf',
      page: 1,
      canvasEl,
    });
    render(<canvas ref={canvasEl} />, div);
    unmountComponentAtNode(div);
  });
});
