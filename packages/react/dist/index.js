// src/index.tsx
import { createViewer } from "@open-file-viewer/core";
import { createRoot } from "react-dom/client";
import { useEffect, useRef } from "react";
import { jsx } from "react/jsx-runtime";
function FileViewer({
  className,
  style,
  width = "100%",
  height = "600px",
  renderToolbar,
  ...options
}) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  useEffect(() => {
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
          toolbarRoot = createRoot(toolbarMount);
        }
        toolbarRoot?.render(renderToolbar(ctx));
        return toolbarMount;
      }
    };
    viewerRef.current?.destroy();
    viewerRef.current = createViewer({
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
  return /* @__PURE__ */ jsx("div", { ref: containerRef, className, style });
}
export {
  FileViewer
};
//# sourceMappingURL=index.js.map