import * as _open_file_viewer_core from '@open-file-viewer/core';
import { PreviewSource, PreviewOptions, PreviewPlugin, PreviewTheme } from '@open-file-viewer/core';
export { FileViewer, PreviewOptions, PreviewPlugin, PreviewSource, PreviewTheme, PreviewToolbarRenderContext } from '@open-file-viewer/core';
import * as vue from 'vue';
import { PropType } from 'vue';

declare const OpenFileViewer: vue.DefineComponent<vue.ExtractPropTypes<{
    file: {
        type: PropType<PreviewSource>;
        required: false;
    };
    files: {
        type: PropType<PreviewOptions["files"]>;
        default: undefined;
    };
    fileName: StringConstructor;
    mimeType: StringConstructor;
    width: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    height: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    fit: {
        type: () => PreviewOptions["fit"];
        default: string;
    };
    plugins: {
        type: () => PreviewPlugin[];
        default: () => never[];
    };
    toolbar: {
        type: PropType<PreviewOptions["toolbar"]>;
        default: boolean;
    };
    theme: {
        type: PropType<PreviewOptions["theme"]>;
        default: string;
    };
    fallback: {
        type: PropType<PreviewOptions["fallback"]>;
        default: string;
    };
    locale: PropType<PreviewOptions["locale"]>;
    messages: PropType<PreviewOptions["messages"]>;
    renderFallback: PropType<PreviewOptions["renderFallback"]>;
    className: StringConstructor;
    onLoad: PropType<PreviewOptions["onLoad"]>;
    onError: PropType<PreviewOptions["onError"]>;
    onUnsupported: PropType<PreviewOptions["onUnsupported"]>;
}>, () => (vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}> | null)[], {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {
    load: (_file: unknown) => true;
    error: (_error: Error, _file?: unknown) => true;
    unsupported: (_file: unknown) => true;
}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    file: {
        type: PropType<PreviewSource>;
        required: false;
    };
    files: {
        type: PropType<PreviewOptions["files"]>;
        default: undefined;
    };
    fileName: StringConstructor;
    mimeType: StringConstructor;
    width: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    height: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    fit: {
        type: () => PreviewOptions["fit"];
        default: string;
    };
    plugins: {
        type: () => PreviewPlugin[];
        default: () => never[];
    };
    toolbar: {
        type: PropType<PreviewOptions["toolbar"]>;
        default: boolean;
    };
    theme: {
        type: PropType<PreviewOptions["theme"]>;
        default: string;
    };
    fallback: {
        type: PropType<PreviewOptions["fallback"]>;
        default: string;
    };
    locale: PropType<PreviewOptions["locale"]>;
    messages: PropType<PreviewOptions["messages"]>;
    renderFallback: PropType<PreviewOptions["renderFallback"]>;
    className: StringConstructor;
    onLoad: PropType<PreviewOptions["onLoad"]>;
    onError: PropType<PreviewOptions["onError"]>;
    onUnsupported: PropType<PreviewOptions["onUnsupported"]>;
}>> & Readonly<{
    onLoad?: ((_file: unknown) => any) | undefined;
    onError?: ((_error: Error, _file?: unknown) => any) | undefined;
    onUnsupported?: ((_file: unknown) => any) | undefined;
}>, {
    files: (PreviewSource | _open_file_viewer_core.PreviewItem)[] | undefined;
    fit: _open_file_viewer_core.PreviewFit | undefined;
    width: string | number;
    height: string | number;
    toolbar: boolean | _open_file_viewer_core.PreviewToolbarOptions | undefined;
    theme: PreviewTheme | undefined;
    fallback: _open_file_viewer_core.PreviewFallback | undefined;
    plugins: PreviewPlugin[];
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

export { OpenFileViewer };
