import React from 'react';
declare type ComponentProps = {
    file: string;
    onDocumentComplete: (numPages: number) => void;
    page: number;
    scale: number;
    rotate: number;
    cMapUrl: string;
    cMapPacked: boolean;
    workerSrc: string;
    withCredentials: boolean;
};
declare const Pdf: {
    ({ file, onDocumentComplete, page, scale, rotate, cMapUrl, cMapPacked, workerSrc, withCredentials, }: ComponentProps): JSX.Element;
    defaultProps: {
        onDocumentComplete: () => void;
    };
};
declare type HookProps = {
    canvasEl: React.RefObject<HTMLCanvasElement>;
    file: string;
    scale: number;
    rotate: number;
    page: number;
    cMapUrl: string;
    cMapPacked: boolean;
    workerSrc: string;
    withCredentials: boolean;
};
export declare const usePdf: ({ canvasEl, file, scale, rotate, page, cMapUrl, cMapPacked, workerSrc, withCredentials, }: HookProps) => any[];
export default Pdf;
