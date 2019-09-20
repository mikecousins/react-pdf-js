import React, { useRef } from 'react';
import { render } from '@testing-library/react';

import { usePdf } from '../src/index';

describe('Pdf', () => {
  it('renders without crashing', () => {
    const canvasEl = useRef(null);

    usePdf({
      file: 'basic.33e35a62.pdf',
      page: 1,
      canvasEl,
    });

    const { container } = render(<canvas ref={canvasEl} />);

    expect(container).toBeDefined();
  });
});
