import { vi, expect } from 'vitest';
import { DocumentInitParameters } from 'pdfjs-dist/types/src/display/api';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock canvas context
HTMLCanvasElement.prototype.getContext = vi.fn((contextType: string) => {
  if (contextType === '2d') {
    return {
      scale: vi.fn(),
    };
  }
  return null;
});

// Mock devicePixelRatio
Object.defineProperty(window, 'devicePixelRatio', {
  writable: true,
  value: 1,
});

// Mock pdfjs-dist
vi.mock('pdfjs-dist', () => ({
  version: '1.0',
  GlobalWorkerOptions: {
    workerSrc: '',
  },
  getDocument: vi.fn((config: DocumentInitParameters) => ({
    promise: config.url?.includes('fail_document')
      ? Promise.reject(new Error('Document load failed'))
      : Promise.resolve({
          getPage: vi.fn((pageNum: number) =>
            config.url?.includes('fail_page')
              ? Promise.reject(new Error('Page load failed'))
              : Promise.resolve({
                  rotate: 0,
                  getViewport: vi.fn(() => ({ width: 100, height: 100 })),
                  render: vi.fn(() => ({
                    promise: config.url?.includes('fail_render')
                      ? Promise.reject(new Error('Render failed'))
                      : Promise.resolve(),
                    cancel: vi.fn(),
                  })),
                })
          ),
        }),
  })),
}));