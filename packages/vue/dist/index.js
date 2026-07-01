// src/index.ts
import { createViewer } from "@open-file-viewer/core";
import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  Teleport,
  watch
} from "vue";
var OpenFileViewer = defineComponent({
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
    const containerRef = ref(null);
    const toolbarTarget = ref(null);
    const toolbarContext = ref(null);
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
      viewer = createViewer({
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
    watch(
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
    onMounted(mount);
    onBeforeUnmount(() => {
      if (toolbarMount) {
        toolbarMount = null;
      }
      toolbarTarget.value = null;
      toolbarContext.value = null;
      viewer?.destroy();
      viewer = null;
    });
    return () => [
      h("div", { ref: containerRef, class: props.className }),
      toolbarTarget.value && toolbarContext.value ? h(Teleport, { to: toolbarTarget.value }, [
        h("div", { class: "ofv-vue-toolbar-content" }, slots.toolbar?.(toolbarContext.value))
      ]) : null
    ];
  }
});
export {
  OpenFileViewer
};
//# sourceMappingURL=index.js.map