"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  FileViewer: () => FileViewer
});
module.exports = __toCommonJS(index_exports);
var import_core = require("@open-file-viewer/core");
var import_client = require("react-dom/client");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function FileViewer({
  className,
  style,
  width = "100%",
  height = "600px",
  renderToolbar,
  ...options
}) {
  const containerRef = (0, import_react.useRef)(null);
  const viewerRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!containerRef.current) {
      return;
    }
    let toolbarRoot = null;
    let toolbarMount = null;
    const toolbar = renderToolbar === void 0 ? options.toolbar : {
      ...typeof options.toolbar === "object" ? options.toolbar : {},
      render(ctx) {
        if (!toolbarMount) {
          toolbarMount = document.createElement("div");
          toolbarMount.className = "ofv-react-toolbar";
          toolbarRoot = (0, import_client.createRoot)(toolbarMount);
        }
        toolbarRoot?.render(renderToolbar(ctx));
        return toolbarMount;
      }
    };
    viewerRef.current?.destroy();
    viewerRef.current = (0, import_core.createViewer)({
      ...options,
      container: containerRef.current,
      width,
      height,
      className,
      toolbar
    });
    return () => {
      const root = toolbarRoot;
      toolbarRoot = null;
      toolbarMount = null;
      viewerRef.current?.destroy();
      viewerRef.current = null;
      if (root) {
        queueMicrotask(() => root.unmount());
      }
    };
  }, [
    options.file,
    options.files,
    options.fileName,
    options.mimeType,
    options.fit,
    options.plugins,
    options.fallback,
    options.locale,
    options.messages,
    options.renderFallback,
    options.toolbar,
    renderToolbar,
    options.theme,
    options.onLoad,
    options.onError,
    options.onUnsupported,
    className,
    width,
    height
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: containerRef, className, style });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FileViewer
});
//# sourceMappingURL=index.cjs.map