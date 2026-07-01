import * as react_jsx_runtime from 'react/jsx-runtime';
import { PreviewOptions, PreviewToolbarRenderContext } from '@open-file-viewer/core';
export { FileViewer as CoreFileViewer, PreviewOptions, PreviewTheme, PreviewToolbarRenderContext } from '@open-file-viewer/core';
import { CSSProperties, ReactNode } from 'react';

type FileViewerProps = Omit<PreviewOptions, "container"> & {
    className?: string;
    style?: CSSProperties;
    renderToolbar?: (ctx: PreviewToolbarRenderContext) => ReactNode;
};
declare function FileViewer({ className, style, width, height, renderToolbar, ...options }: FileViewerProps): react_jsx_runtime.JSX.Element;

export { FileViewer, type FileViewerProps };
