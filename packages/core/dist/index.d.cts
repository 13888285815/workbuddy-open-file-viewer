import * as pdfjs_dist from 'pdfjs-dist';

type PreviewSource = File | Blob | string | ArrayBuffer;
type PreviewFit = "contain" | "cover" | "width" | "height" | "actual" | "scale-down";
type PreviewWatermarkPosition = "top-left" | "top-center" | "top-right" | "center-left" | "center" | "center-right" | "bottom-left" | "bottom-center" | "bottom-right";
interface PreviewWatermarkText {
    type: "text";
    text: string;
    font?: string;
    fontSize?: number;
    color?: string;
    opacity?: number;
    position?: PreviewWatermarkPosition;
}
interface PreviewWatermarkImage {
    type: "image";
    src: string;
    width?: number;
    height?: number;
    opacity?: number;
    position?: PreviewWatermarkPosition;
}
type PreviewWatermark = PreviewWatermarkText | PreviewWatermarkImage;
type PreviewFallback = "inline" | "download" | "custom";
type PreviewTheme = "light" | "dark" | "auto";
type PreviewLocale = "zh-CN" | "en-US";
type PreviewToolbarBuiltInAction = "previous" | "next" | "queue" | "zoom-out" | "zoom-in" | "zoom-reset" | "rotate-right" | "download" | "fullscreen" | "print" | "search";
type PreviewToolbarActionId = PreviewToolbarBuiltInAction | (string & {});
interface PreviewFile {
    source: PreviewSource;
    name: string;
    extension: string;
    mimeType: string;
    size?: number;
    url?: string;
    blob?: Blob;
}
interface PreviewItem {
    file: PreviewSource;
    fileName?: string;
    mimeType?: string;
}
interface PreviewSize {
    width: number;
    height: number;
}
interface PreviewToolbarOptions {
    zoom?: boolean;
    rotate?: boolean;
    download?: boolean;
    fullscreen?: boolean;
    print?: boolean;
    search?: boolean;
    order?: PreviewToolbarActionId[];
    labels?: Partial<Record<PreviewToolbarBuiltInAction, string>>;
    titles?: Partial<Record<PreviewToolbarBuiltInAction, string>>;
    icons?: Partial<Record<PreviewToolbarBuiltInAction, string | HTMLElement | SVGElement>>;
    actions?: PreviewToolbarCustomAction[];
    render?: (ctx: PreviewToolbarRenderContext) => HTMLElement | void;
}
interface PreviewToolbarCustomAction {
    id: string;
    label: string;
    title?: string;
    icon?: string | HTMLElement | SVGElement;
    order?: number;
    disabled?: boolean | ((ctx: PreviewToolbarRenderContext) => boolean);
    hidden?: boolean | ((ctx: PreviewToolbarRenderContext) => boolean);
    className?: string;
    onClick: (ctx: PreviewToolbarRenderContext) => void | Promise<void>;
}
interface PreviewToolbarRenderContext {
    file?: PreviewFile;
    index: number;
    length: number;
    viewport: HTMLElement;
    canPrevious: boolean;
    canNext: boolean;
    zoom?: number;
    zoomLabel?: string;
    previous: () => Promise<void>;
    next: () => Promise<void>;
    command: (command: PreviewCommand) => void | boolean | undefined;
    canCommand: (command: PreviewCommand) => boolean;
    refreshCommandSupport: () => void;
    setZoom: (zoom?: number) => void;
    download: () => void;
    fullscreen: () => void;
    print: () => void;
    search: (query: string) => number;
    clearSearch: () => void;
}
interface PreviewOptions {
    container: HTMLElement | string;
    file?: PreviewSource;
    files?: Array<PreviewSource | PreviewItem>;
    initialIndex?: number;
    fileName?: string;
    mimeType?: string;
    width?: number | string;
    height?: number | string;
    zoom?: number;
    fit?: PreviewFit;
    plugins?: PreviewPlugin[];
    fallback?: PreviewFallback;
    locale?: PreviewLocale;
    messages?: Partial<PreviewMessages>;
    renderFallback?: (ctx: PreviewContext) => Promise<PreviewInstance> | PreviewInstance;
    toolbar?: boolean | PreviewToolbarOptions;
    theme?: PreviewTheme;
    watermark?: PreviewWatermark | PreviewWatermark[];
    className?: string;
    onLoad?: (file: PreviewFile) => void;
    onError?: (error: Error, file?: PreviewFile) => void;
    onUnsupported?: (file: PreviewFile) => void;
}
interface PreviewMessages {
    loading: string;
    unsupportedTitle: string;
    downloadTitle: string;
    downloadFile: string;
    file: string;
    unnamedFile: string;
    format: string;
    unknown: string;
    mime: string;
    undeclared: string;
    size: string;
    source: string;
    remoteUrl: string;
    localFile: string;
}
interface PreviewContext {
    host: HTMLElement;
    viewport: HTMLElement;
    file: PreviewFile;
    size: PreviewSize;
    options: Omit<PreviewOptions, "messages"> & Required<Pick<PreviewOptions, "fit" | "fallback" | "zoom">> & {
        messages: PreviewMessages;
    };
    toolbar?: PreviewToolbarRenderContext;
    setLoading: (loading: boolean) => void;
    setError: (error: Error | string) => void;
}
interface PreviewInstance {
    resize?: (size: PreviewSize) => void;
    command?: (command: PreviewCommand) => void | boolean;
    canCommand?: (command: PreviewCommand) => boolean;
    destroy: () => void;
}
type PreviewCommand = "zoom-in" | "zoom-out" | "zoom-reset" | "rotate-right" | "rotate-left";
interface PreviewPlugin {
    name: string;
    match: (file: PreviewFile) => boolean | Promise<boolean>;
    render: (ctx: PreviewContext) => Promise<PreviewInstance> | PreviewInstance;
}
interface FileViewer {
    reload: (file?: PreviewSource) => Promise<void>;
    next: () => Promise<void>;
    previous: () => Promise<void>;
    goTo: (index: number) => Promise<void>;
    getCurrentIndex: () => number;
    resize: () => void;
    destroy: () => void;
}

declare function createViewer(options: PreviewOptions): FileViewer;

declare function imagePlugin(): PreviewPlugin;

declare function videoPlugin(): PreviewPlugin;

declare function audioPlugin(): PreviewPlugin;

declare function textPlugin(): PreviewPlugin;

type PdfJsModule = typeof pdfjs_dist;
interface PdfPluginOptions {
    pdfjs?: PdfJsModule;
    workerSrc?: string;
    cMapUrl?: string;
    cMapPacked?: boolean;
    standardFontDataUrl?: string;
    useSystemFonts?: boolean;
    disableStream?: boolean;
    disableAutoFetch?: boolean;
    disableRange?: boolean;
    rangeChunkSize?: number;
    useFetchData?: boolean;
}
declare function pdfPlugin(options?: PdfJsModule | PdfPluginOptions): PreviewPlugin;

declare function epubPlugin(): PreviewPlugin;

declare function xpsPlugin(): PreviewPlugin;

interface OfficeConversionContext {
    file: PreviewContext["file"];
    arrayBuffer: ArrayBuffer;
    extension: string;
    detectedFormat?: "docx" | "xlsx" | "pptx";
    reason: "complex-docx" | "legacy-office" | "manual";
}
type OfficeConversionResult = Blob | ArrayBuffer | string | {
    blob?: Blob;
    data?: Blob | ArrayBuffer;
    url?: string;
    fileName?: string;
    mimeType?: string;
};
interface OfficePluginOptions {
    convert?: (ctx: OfficeConversionContext) => Promise<OfficeConversionResult | null | undefined> | OfficeConversionResult | null | undefined;
    preferConversion?: boolean | ((ctx: OfficeConversionContext) => boolean | Promise<boolean>);
    pdf?: PdfPluginOptions;
}
declare function officePlugin(options?: OfficePluginOptions): PreviewPlugin;

declare function ofdPlugin(): PreviewPlugin;

declare function archivePlugin(): PreviewPlugin;

declare function emailPlugin(): PreviewPlugin;

declare function drawingPlugin(): PreviewPlugin;

interface LibreDwgPreviewOptions {
    /**
     * Enable the built-in LibreDWG WASM preview for DWG files.
     *
     * It is best-effort and intentionally lower priority than `binaryRenderer`.
     */
    enabled?: boolean;
    /**
     * Public URL that contains libredwg-web.wasm.
     *
     * Example: `/vendor/libredwg-web`
     */
    wasmBaseUrl?: string;
}

interface CadBinaryPreviewContext {
    panel: HTMLElement;
    fileName: string;
    extension: "dwg" | "dwf";
    arrayBuffer: ArrayBuffer;
    bytes: Uint8Array;
    preview: PreviewContext;
}
interface CadPluginOptions {
    /**
     * Optional high-fidelity renderer for proprietary binary CAD files. When it
     * returns a preview instance, it takes over DWG/DWF rendering completely.
     *
     * Use it for custom front-end engines or server-side CAD conversion services.
     */
    binaryRenderer?: (ctx: CadBinaryPreviewContext) => Promise<PreviewInstance | void> | PreviewInstance | void;
    /**
     * Built-in best-effort DWG preview powered by LibreDWG WASM.
     *
     * Pass `false` to keep the old metadata-only DWG behavior. Pass an object to
     * configure the public WASM asset path.
     */
    libreDwg?: false | LibreDwgPreviewOptions;
}
declare function cadPlugin(options?: CadPluginOptions): PreviewPlugin;

declare function model3dPlugin(): PreviewPlugin;

declare function gisPlugin(): PreviewPlugin;

declare function assetPlugin(): PreviewPlugin;

declare function fallbackPlugin(): PreviewPlugin;

export { type CadBinaryPreviewContext, type CadPluginOptions, type FileViewer, type LibreDwgPreviewOptions, type OfficeConversionContext, type OfficeConversionResult, type OfficePluginOptions, type PreviewCommand, type PreviewContext, type PreviewFallback, type PreviewFile, type PreviewFit, type PreviewInstance, type PreviewItem, type PreviewLocale, type PreviewMessages, type PreviewOptions, type PreviewPlugin, type PreviewSize, type PreviewSource, type PreviewTheme, type PreviewToolbarActionId, type PreviewToolbarBuiltInAction, type PreviewToolbarCustomAction, type PreviewToolbarOptions, type PreviewToolbarRenderContext, archivePlugin, assetPlugin, audioPlugin, cadPlugin, createViewer, drawingPlugin, emailPlugin, epubPlugin, fallbackPlugin, gisPlugin, imagePlugin, model3dPlugin, ofdPlugin, officePlugin, pdfPlugin, textPlugin, videoPlugin, xpsPlugin };
