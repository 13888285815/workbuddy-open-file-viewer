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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  OpenFileViewer: () => OpenFileViewer
});
module.exports = __toCommonJS(index_exports);
var import_core = require("@open-file-viewer/core");
var import_vue = require("vue");
var OpenFileViewer = (0, import_vue.defineComponent)({
  name: "OpenFileViewer",
  props: {
    file: {
      type: [String, Blob, ArrayBuffer, File],
      required: false
    },
    files: {
      type: Array,
      default: void 0
    },
    fileName: String,
    mimeType: String,
    width: {
      type: [String, Number],
      default: "100%"
    },
    height: {
      type: [String, Number],
      default: "600px"
    },
    fit: {
      type: String,
      default: "contain"
    },
    plugins: {
      type: Array,
      default: () => []
    },
    toolbar: {
      type: [Boolean, Object],
      default: false
    },
    theme: {
      type: String,
      default: "light"
    },
    fallback: {
      type: String,
      default: "inline"
    },
    locale: String,
    messages: Object,
    renderFallback: Function,
    className: String,
    onLoad: Function,
    onError: Function,
    onUnsupported: Function
  },
  emits: {
    load: (_file) => true,
    error: (_error, _file) => true,
    unsupported: (_file) => true
  },
  setup(props, { emit, slots }) {
    const containerRef = (0, import_vue.ref)(null);
    const toolbarTarget = (0, import_vue.ref)(null);
    const toolbarContext = (0, import_vue.ref)(null);
    let viewer = null;
    let toolbarMount = null;
    const mount = () => {
      if (!containerRef.value) {
        return;
      }
      if (toolbarMount) {
        toolbarMount = null;
      }
      toolbarTarget.value = null;
      toolbarContext.value = null;
      viewer?.destroy();
      viewer = (0, import_core.createViewer)({
        container: containerRef.value,
        file: props.file,
        files: props.files,
        fileName: props.fileName,
        mimeType: props.mimeType,
        width: props.width,
        height: props.height,
        fit: props.fit,
        plugins: props.plugins,
        toolbar: slots.toolbar ? {
          ...typeof props.toolbar === "object" ? props.toolbar : {},
          render(ctx) {
            toolbarContext.value = ctx;
            if (toolbarMount) {
              return toolbarMount;
            }
            toolbarMount = document.createElement("div");
            toolbarMount.className = "ofv-vue-toolbar";
            toolbarTarget.value = toolbarMount;
            return toolbarMount;
          }
        } : props.toolbar,
        theme: props.theme,
        fallback: props.fallback,
        locale: props.locale,
        messages: props.messages,
        renderFallback: props.renderFallback,
        className: props.className,
        onLoad(file) {
          props.onLoad?.(file);
          if (!props.onLoad) {
            emit("load", file);
          }
        },
        onError(error, file) {
          props.onError?.(error, file);
          if (!props.onError) {
            emit("error", error, file);
          }
        },
        onUnsupported(file) {
          props.onUnsupported?.(file);
          if (!props.onUnsupported) {
            emit("unsupported", file);
          }
        }
      });
    };
    (0, import_vue.watch)(
      () => [
        props.file,
        props.files,
        props.fileName,
        props.mimeType,
        props.width,
        props.height,
        props.fit,
        props.plugins,
        props.fallback,
        props.locale,
        props.messages,
        props.renderFallback,
        props.toolbar,
        props.theme,
        props.className,
        props.onLoad,
        props.onError,
        props.onUnsupported
      ],
      mount,
      { immediate: false }
    );
    (0, import_vue.onMounted)(mount);
    (0, import_vue.onBeforeUnmount)(() => {
      if (toolbarMount) {
        toolbarMount = null;
      }
      toolbarTarget.value = null;
      toolbarContext.value = null;
      viewer?.destroy();
      viewer = null;
    });
    return () => [
      (0, import_vue.h)("div", { ref: containerRef, class: props.className }),
      toolbarTarget.value && toolbarContext.value ? (0, import_vue.h)(import_vue.Teleport, { to: toolbarTarget.value }, [
        (0, import_vue.h)("div", { class: "ofv-vue-toolbar-content" }, slots.toolbar?.(toolbarContext.value))
      ]) : null
    ];
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OpenFileViewer
});
//# sourceMappingURL=index.cjs.map