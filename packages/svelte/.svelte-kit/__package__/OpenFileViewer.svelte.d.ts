import type { PreviewOptions, PreviewToolbarRenderContext } from "@open-file-viewer/core";
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const OpenFileViewer: $$__sveltets_2_IsomorphicComponent<{
    file?: PreviewOptions["file"];
    files?: PreviewOptions["files"];
    fileName?: PreviewOptions["fileName"];
    mimeType?: PreviewOptions["mimeType"];
    width?: PreviewOptions["width"];
    height?: PreviewOptions["height"];
    fit?: PreviewOptions["fit"];
    plugins?: PreviewOptions["plugins"];
    toolbar?: PreviewOptions["toolbar"];
    theme?: PreviewOptions["theme"];
    fallback?: PreviewOptions["fallback"];
    locale?: PreviewOptions["locale"];
    messages?: PreviewOptions["messages"];
    renderFallback?: PreviewOptions["renderFallback"];
    className?: string | undefined;
    onLoad?: PreviewOptions["onLoad"];
    onError?: PreviewOptions["onError"];
    onUnsupported?: PreviewOptions["onUnsupported"];
    renderToolbar?: ((ctx: PreviewToolbarRenderContext) => HTMLElement | void) | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    toolbar: {
        ctx: PreviewToolbarRenderContext | undefined;
    };
}, {}, string>;
type OpenFileViewer = InstanceType<typeof OpenFileViewer>;
export default OpenFileViewer;
//# sourceMappingURL=OpenFileViewer.svelte.d.ts.map