import React, { useRef } from 'react';
import { render, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePdf } from '../src/index';

// Test component that uses the hook
const TestComponent = ({ 
  file, 
  onDocumentLoadSuccess,
  onDocumentLoadFail,
  onPageLoadSuccess,
  onPageLoadFail,
  onPageRenderSuccess,
  onPageRenderFail,
  scale = 1,
  rotate = 0,
  page = 1,
}: {
  file: string;
  onDocumentLoadSuccess?: (document: any) => void;
  onDocumentLoadFail?: () => void;
  onPageLoadSuccess?: (page: any) => void;
  onPageLoadFail?: () => void;
  onPageRenderSuccess?: (page: any) => void;
  onPageRenderFail?: () => void;
  scale?: number;
  rotate?: number;
  page?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { pdfDocument, pdfPage } = usePdf({
    canvasRef,
    file,
    onDocumentLoadSuccess,
    onDocumentLoadFail,
    onPageLoadSuccess,
    onPageLoadFail,
    onPageRenderSuccess,
    onPageRenderFail,
    scale,
    rotate,
    page,
  });

  return (
    <div>
      <canvas ref={canvasRef} data-testid="pdf-canvas" />
      <div data-testid="document-status">
        {pdfDocument ? 'document-loaded' : 'document-loading'}
      </div>
      <div data-testid="page-status">
        {pdfPage ? 'page-loaded' : 'page-loading'}
      </div>
    </div>
  );
};

describe('usePdf', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('loads PDF document and page successfully', async () => {
    const { getByTestId } = render(
      <TestComponent file="basic.pdf" />
    );

    const canvas = getByTestId('pdf-canvas');
    expect(canvas).toBeInTheDocument();

    await waitFor(() => {
      expect(getByTestId('document-status')).toHaveTextContent('document-loaded');
    });

    await waitFor(() => {
      expect(getByTestId('page-status')).toHaveTextContent('page-loaded');
    });
  });

  it('calls onDocumentLoadSuccess callback when document loads', async () => {
    const onDocumentLoadSuccess = vi.fn();
    
    render(
      <TestComponent 
        file="basic.pdf" 
        onDocumentLoadSuccess={onDocumentLoadSuccess}
      />
    );

    await waitFor(() => {
      expect(onDocumentLoadSuccess).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  it('calls onPageLoadSuccess callback when page loads', async () => {
    const onPageLoadSuccess = vi.fn();
    
    render(
      <TestComponent 
        file="basic.pdf" 
        onPageLoadSuccess={onPageLoadSuccess}
      />
    );

    await waitFor(() => {
      expect(onPageLoadSuccess).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  it('calls onPageRenderSuccess callback when page renders', async () => {
    const onPageRenderSuccess = vi.fn();
    
    render(
      <TestComponent 
        file="basic.pdf" 
        onPageRenderSuccess={onPageRenderSuccess}
      />
    );

    await waitFor(() => {
      expect(onPageRenderSuccess).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  it('handles document load failure', async () => {
    const onDocumentLoadFail = vi.fn();
    
    render(
      <TestComponent 
        file="fail_document" 
        onDocumentLoadFail={onDocumentLoadFail}
      />
    );

    await waitFor(() => {
      expect(onDocumentLoadFail).toHaveBeenCalled();
    });
  });

  it('handles page load failure', async () => {
    const onPageLoadFail = vi.fn();
    
    render(
      <TestComponent 
        file="fail_page" 
        onPageLoadFail={onPageLoadFail}
      />
    );

    await waitFor(() => {
      expect(onPageLoadFail).toHaveBeenCalled();
    });
  });

  it('handles page render failure', async () => {
    const onPageRenderFail = vi.fn();
    
    render(
      <TestComponent 
        file="fail_render" 
        onPageRenderFail={onPageRenderFail}
      />
    );

    await waitFor(() => {
      expect(onPageRenderFail).toHaveBeenCalled();
    });
  });

  it('respects scale parameter', async () => {
    const { getByTestId } = render(
      <TestComponent file="basic.pdf" scale={2} />
    );

    await waitFor(() => {
      expect(getByTestId('document-status')).toHaveTextContent('document-loaded');
    });

    await waitFor(() => {
      expect(getByTestId('page-status')).toHaveTextContent('page-loaded');
    });
  });

  it('respects rotate parameter', async () => {
    const { getByTestId } = render(
      <TestComponent file="basic.pdf" rotate={90} />
    );

    await waitFor(() => {
      expect(getByTestId('document-status')).toHaveTextContent('document-loaded');
    });

    await waitFor(() => {
      expect(getByTestId('page-status')).toHaveTextContent('page-loaded');
    });
  });

  it('respects page parameter', async () => {
    const { getByTestId } = render(
      <TestComponent file="basic.pdf" page={2} />
    );

    await waitFor(() => {
      expect(getByTestId('document-status')).toHaveTextContent('document-loaded');
    });

    await waitFor(() => {
      expect(getByTestId('page-status')).toHaveTextContent('page-loaded');
    });
  });
});