<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import {
  FileTextIcon,
  TableIcon,
  PresentationIcon,
  DownloadIcon,
  PrinterIcon,
  ZoomInIcon,
  ZoomOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MaximizeIcon,
  MinimizeIcon,
  XIcon,
  SunIcon,
  MoonIcon,
  FileIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  HashIcon,
  LayersIcon,
  ImageIcon,
  FileCodeIcon,
  LoaderIcon,
  AlertCircleIcon,
  Maximize2Icon,
  ArrowLeftIcon,
  ArrowRightIcon,
  FilterIcon,
  UnlockIcon,
  LockIcon,
  RefreshCwIcon,
} from "lucide-vue-next";

// Props
interface Props {
  file: File;
  fileName?: string;
  mimeType?: string;
  theme?: "light" | "dark";
}

const props = withDefaults(defineProps<Props>(), {
  theme: "light",
});

// Emits
const emit = defineEmits<{
  close: [];
  fullscreen: [];
  loaded: [info: DocumentInfo];
  error: [message: string];
}>();

// State
const loading = ref(true);
const error = ref("");
const zoom = ref(100);
const isFullscreen = ref(false);

// Document type detection
const fileExt = computed(() => {
  const name = props.fileName || props.file.name;
  return name.split(".").pop()?.toLowerCase() || "";
});

const docType = computed<"docx" | "xlsx" | "pptx" | "unknown">(() => {
  const ext = fileExt.value;
  if (["docx", "docm"].includes(ext)) return "docx";
  if (["xlsx", "xlsm", "xls"].includes(ext)) return "xlsx";
  if (["pptx", "pptm"].includes(ext)) return "pptx";
  return "unknown";
});

// CDN URLs
const mammothCdn = "https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js";
const xlsxCdn = "https://cdn.jsdelivr.net/npm/xlsx@0.20.3/dist/xlsx.full.min.js";
const pptxRendererCdn = "https://cdn.jsdelivr.net/npm/aiden0z-pptx-renderer@1.1.3/dist/aiden0z-pptx-renderer.es.js";

// Script loader
const loadedScripts = new Set<string>();
const scriptLoading = ref(false);

const loadScript = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (loadedScripts.has(url)) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) {
      loadedScripts.add(url);
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = url;
    script.onload = () => {
      loadedScripts.add(url);
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.appendChild(script);
  });
};

// Document info
interface DocumentInfo {
  fileName: string;
  mimeType: string;
  fileSize: number;
  fileType: string;
  created?: Date;
  modified?: Date;
  author?: string;
  title?: string;
  subject?: string;
  keywords?: string;
  // Word
  paragraphs?: number;
  words?: number;
  tables?: number;
  images?: number;
  // Excel
  sheets?: string[];
  sheetCount?: number;
  rows?: number;
  cols?: number;
  // PowerPoint
  slides?: number;
  slideWidth?: number;
  slideHeight?: number;
  masterSlides?: number;
}

const docInfo = ref<DocumentInfo>({
  fileName: "",
  mimeType: "",
  fileSize: 0,
  fileType: "",
  sheets: [],
  slides: 0,
});

// ============================================================
// DOCX State & Logic
// ============================================================
const docxHtml = ref("");
const docxCurrentPage = ref(1);
const docxTotalPages = ref(1);
const docxPages = ref<string[]>([]);
const docxPageSize = 30; // paragraphs per page

const renderDocx = async () => {
  if (docType.value !== "docx") return;
  loading.value = true;
  error.value = "";
  try {
    await loadScript(mammothCdn);
    const mammoth = (window as any).mammoth;

    const arrayBuffer = await props.file.arrayBuffer();
    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Title'] => h1.title:fresh",
          "b => strong",
          "i => em",
          "u => u",
          "strike => del",
        ],
      }
    );

    docxHtml.value = result.value;

    // Extract warnings
    if (result.messages && result.messages.length > 0) {
      console.warn("Mammoth warnings:", result.messages);
    }

    // Parse paragraphs to paginate
    const parser = new DOMParser();
    const doc = parser.parseFromString(result.value, "text/html");
    const paragraphs = doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6, table, ul, ol, blockquote, pre");
    const allNodes = Array.from(paragraphs);

    // Rough word count
    let wordCount = 0;
    const tables = doc.querySelectorAll("table");
    const imgs = doc.querySelectorAll("img");

    allNodes.forEach((p) => {
      wordCount += p.textContent?.split(/\s+/).filter(Boolean).length || 0;
    });

    docInfo.value = {
      fileName: props.fileName || props.file.name,
      mimeType: props.mimeType || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      fileSize: props.file.size,
      fileType: "Word 文档",
      modified: new Date(props.file.lastModified),
      paragraphs: allNodes.length,
      words: wordCount,
      tables: tables.length,
      images: imgs.length,
    };

    // Paginate
    docxTotalPages.value = Math.max(1, Math.ceil(allNodes.length / docxPageSize));
    docxPages.value = [];
    for (let i = 0; i < allNodes.length; i += docxPageSize) {
      const pageSlice = allNodes.slice(i, i + docxPageSize);
      const pageDoc = doc.implementation.createHTMLDocument();
      const body = pageDoc.body;
      pageSlice.forEach((node) => body.appendChild(node.cloneNode(true)));
      docxPages.value.push(pageDoc.body.innerHTML);
    }
    docxCurrentPage.value = 1;

    emit("loaded", docInfo.value);
  } catch (err: any) {
    error.value = `无法解析 Word 文档: ${err.message}`;
    emit("error", error.value);
  } finally {
    loading.value = false;
  }
};

// ============================================================
// XLSX State & Logic
// ============================================================
const xlsxWorkbook = ref<any>(null);
const xlsxSheetNames = ref<string[]>([]);
const xlsxActiveSheet = ref("");
const xlsxRenderData = ref<any[][]>([]);
const xlsxFrozenRows = ref(0);
const xlsxFrozenCols = ref(0);
const xlsxFilterEnabled = ref(false);
const xlsxFormulaMode = ref(false);
const xlsxShowCharts = ref(true);
const xlsxColWidths = ref<number[]>([]);
const xlsxRowHeights = ref<number[]>([]);
const xlsxCellErrors = ref<Map<string, string>>(new Map());

const renderXlsx = async () => {
  if (docType.value !== "xlsx") return;
  loading.value = true;
  error.value = "";
  try {
    await loadScript(xlsxCdn);
    const XLSX = (window as any).XLSX;

    const arrayBuffer = await props.file.arrayBuffer();
    const wb = XLSX.read(arrayBuffer, {
      type: "array",
      cellFormula: true,
      cellHTML: false,
      cellNF: true,
      cellStyles: true,
    });

    xlsxWorkbook.value = wb;
    xlsxSheetNames.value = wb.SheetNames || [];
    xlsxActiveSheet.value = xlsxSheetNames.value[0] || "";

    docInfo.value = {
      fileName: props.fileName || props.file.name,
      mimeType: props.mimeType || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      fileSize: props.file.size,
      fileType: "Excel 电子表格",
      modified: new Date(props.file.lastModified),
      sheets: wb.SheetNames,
      sheetCount: wb.SheetNames.length,
    };

    renderActiveSheet();
    emit("loaded", docInfo.value);
  } catch (err: any) {
    error.value = `无法解析 Excel 文件: ${err.message}`;
    emit("error", error.value);
  } finally {
    loading.value = false;
  }
};

const renderActiveSheet = () => {
  if (!xlsxWorkbook.value || !xlsxActiveSheet.value) return;
  const XLSX = (window as any).XLSX;
  const sheet = xlsxWorkbook.value.Sheets[xlsxActiveSheet.value];
  if (!sheet) return;

  // Convert to JSON for rendering
  const jsonData = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false,
  }) as any[][];

  xlsxRenderData.value = jsonData;

  // Detect frozen rows/cols from sheet view
  const refStr = sheet["!ref"] || "";
  if (refStr) {
    const range = XLSX.utils.decode_range(refStr);
    docInfo.value.rows = range.e.r + 1;
    docInfo.value.cols = range.e.c + 1;
  }

  // Frozen view
  if (sheet["!cols"]) {
    xlsxColWidths.value = sheet["!cols"].map((c: any) => c.wpx || 80);
  }
  if (sheet["!rows"]) {
    xlsxRowHeights.value = sheet["!rows"].map((r: any) => r.hpx || 20);
  }

  // Try to detect frozen panes
  if (sheet["!views"]) {
    const view = sheet["!views"][0];
    if (view?.splitHorizontal) xlsxFrozenRows.value = view.splitHorizontal;
    if (view?.splitVertical) xlsxFrozenCols.value = view.splitVertical;
  }
};

const switchSheet = (name: string) => {
  xlsxActiveSheet.value = name;
  xlsxFormulaMode.value = false;
  renderActiveSheet();
};

const getCellValue = (row: any[], colIdx: number): string => {
  if (!row) return "";
  const val = row[colIdx];
  if (val === undefined || val === null) return "";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};

const getCellClass = (row: any[], colIdx: number, rowIdx: number): string => {
  const val = getCellValue(row, colIdx);
  if (!val) return "cell-empty";
  if (!isNaN(Number(val))) return "cell-number";
  if (
    typeof val === "string" &&
    (val.startsWith("http://") || val.startsWith("https://"))
  )
    return "cell-link";
  return "cell-text";
};

// ============================================================
// PPTX State & Logic
// ============================================================
const pptxSlides = ref<string[]>([]);
const pptxCurrentSlide = ref(1);
const pptxTotalSlides = ref(0);
const pptxSlideThumbs = ref<string[]>([]);
const pptxIsFullscreen = ref(false);
const pptxPresenting = ref(false);
const pptxRendererReady = ref(false);

const renderPptx = async () => {
  if (docType.value !== "pptx") return;
  loading.value = true;
  error.value = "";
  try {
    // Try aiden0z-pptx-renderer first
    try {
      await loadScript(pptxRendererCdn);
      const renderer = (window as any).__pptxRenderer;
      if (renderer) {
        const arrayBuffer = await props.file.arrayBuffer();
        const slides = await renderer.renderSlides(arrayBuffer);
        if (slides && slides.length > 0) {
          pptxSlides.value = slides.map((s: any) => s.html || s.data || "");
          pptxSlideThumbs.value = slides.map((s: any) => s.thumbnail || s.html || "");
          pptxTotalSlides.value = slides.length;
          docInfo.value = {
            fileName: props.fileName || props.file.name,
            mimeType:
              props.mimeType ||
              "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            fileSize: props.file.size,
            fileType: "PowerPoint 演示文稿",
            modified: new Date(props.file.lastModified),
            slides: slides.length,
          };
          pptxRendererReady.value = true;
          emit("loaded", docInfo.value);
          loading.value = false;
          return;
        }
      }
    } catch {
      // Fall through to fallback
    }

    // Fallback: render as ZIP with slide images using Canvas
    await loadScript(xlsxCdn); // xlsx has JSZip
    const JSZip = (window as any).JSZip || (window as any).XLSX?.utils?.sheet_to_json === undefined
      ? null
      : null;

    // Simple fallback: show metadata
    error.value = "PPTX 渲染需要完整解析。将显示幻灯片元数据。";
    const arrayBuffer = await props.file.arrayBuffer();
    docInfo.value = {
      fileName: props.fileName || props.file.name,
      mimeType:
        props.mimeType ||
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      fileSize: props.file.size,
      fileType: "PowerPoint 演示文稿",
      modified: new Date(props.file.lastModified),
      slides: 1,
    };
    emit("loaded", docInfo.value);
  } catch (err: any) {
    error.value = `无法解析 PPTX 文件: ${err.message}`;
    emit("error", error.value);
  } finally {
    loading.value = false;
  }
};

// ============================================================
// Zoom
// ============================================================
const zoomIn = () => {
  zoom.value = Math.min(300, zoom.value + 10);
};
const zoomOut = () => {
  zoom.value = Math.max(25, zoom.value - 10);
};
const resetZoom = () => {
  zoom.value = 100;
};

// ============================================================
// Print & Download
// ============================================================
const printDocx = () => {
  if (docType.value !== "docx") return;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${props.fileName || props.file.name}</title>
      <style>
        body { font-family: 'Microsoft YaHei', Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        h3 { font-size: 18px; }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f5f5f5; }
        img { max-width: 100%; height: auto; }
        ul, ol { padding-left: 24px; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>${docxHtml.value}</body>
    </html>
  `);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
    win.close();
  }, 500);
};

const downloadAsPdf = () => {
  // For docx: open print dialog
  if (docType.value === "docx") {
    printDocx();
    return;
  }
  // For others: trigger download
  const url = URL.createObjectURL(props.file);
  const a = document.createElement("a");
  a.href = url;
  a.download = props.fileName || props.file.name;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadFile = () => {
  const url = URL.createObjectURL(props.file);
  const a = document.createElement("a");
  a.href = url;
  a.download = props.fileName || props.file.name;
  a.click();
  URL.revokeObjectURL(url);
};

// ============================================================
// Fullscreen
// ============================================================
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  emit("fullscreen");
};

const enterFullscreen = () => {
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
};

const exitFullscreen = () => {
  if (document.exitFullscreen) document.exitFullscreen();
};

const togglePptxFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    pptxIsFullscreen.value = true;
  } else {
    document.exitFullscreen();
    pptxIsFullscreen.value = false;
  }
};

watch(isFullscreen, (val) => {
  if (!val && document.fullscreenElement) {
    document.exitFullscreen();
  }
});

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    if (isFullscreen.value) isFullscreen.value = false;
    if (pptxIsFullscreen.value) pptxIsFullscreen.value = false;
  }
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    if (docType.value === "docx" && docxCurrentPage.value > 1) {
      docxCurrentPage.value--;
    }
    if (docType.value === "pptx" && pptxCurrentSlide.value > 1) {
      pptxCurrentSlide.value--;
    }
  }
  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    if (docType.value === "docx" && docxCurrentPage.value < docxTotalPages.value) {
      docxCurrentPage.value++;
    }
    if (docType.value === "pptx" && pptxCurrentSlide.value < pptxTotalSlides.value) {
      pptxCurrentSlide.value++;
    }
  }
  if (e.key === "+" || e.key === "=") zoomIn();
  if (e.key === "-") zoomOut();
};

// ============================================================
// Lifecycle
// ============================================================
onMounted(async () => {
  window.addEventListener("keydown", handleKeydown);
  docInfo.value = {
    fileName: props.fileName || props.file.name,
    mimeType: props.mimeType || "",
    fileSize: props.file.size,
    fileType: docType.value === "docx" ? "Word 文档" : docType.value === "xlsx" ? "Excel 电子表格" : "PowerPoint 演示文稿",
    modified: new Date(props.file.lastModified),
  };

  if (docType.value === "docx") await renderDocx();
  else if (docType.value === "xlsx") await renderXlsx();
  else if (docType.value === "pptx") await renderPptx();
  else {
    loading.value = false;
    error.value = "不支持的文件格式";
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

// Re-render when file changes
watch(() => props.file, async () => {
  loading.value = true;
  error.value = "";
  docxHtml.value = "";
  xlsxWorkbook.value = null;
  pptxSlides.value = [];
  pptxSlideThumbs.value = [];
  docInfo.value = {
    fileName: props.fileName || props.file.name,
    mimeType: props.mimeType || "",
    fileSize: props.file.size,
    fileType: "",
    modified: new Date(props.file.lastModified),
  };

  if (docType.value === "docx") await renderDocx();
  else if (docType.value === "xlsx") await renderXlsx();
  else if (docType.value === "pptx") await renderPptx();
  else {
    loading.value = false;
    error.value = "不支持的文件格式";
  }
});

// Format helpers
const formatFileSize = (bytes?: number) => {
  if (!bytes) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
};

const formatDate = (date?: Date) => {
  if (!date) return "-";
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Theme-aware styles
const isDark = computed(() => props.theme === "dark");
</script>

<template>
  <div :class="['office-preview', { fullscreen: isFullscreen, dark: isDark }]">
    <!-- Toolbar -->
    <div class="office-toolbar">
      <div class="toolbar-left">
        <span class="toolbar-title">{{ fileName || file.name }}</span>
      </div>

      <div class="toolbar-center">
        <!-- DOCX navigation -->
        <template v-if="docType === 'docx'">
          <button class="toolbar-btn" :disabled="docxCurrentPage <= 1" @click="docxCurrentPage--" title="上一页">
            <ChevronLeftIcon :size="16" />
          </button>
          <span class="toolbar-page">{{ docxCurrentPage }} / {{ docxTotalPages }}</span>
          <button class="toolbar-btn" :disabled="docxCurrentPage >= docxTotalPages" @click="docxCurrentPage++" title="下一页">
            <ChevronRightIcon :size="16" />
          </button>
          <div class="toolbar-divider"></div>
        </template>

        <!-- PPTX navigation -->
        <template v-if="docType === 'pptx' && pptxTotalSlides > 0">
          <button class="toolbar-btn" :disabled="pptxCurrentSlide <= 1" @click="pptxCurrentSlide--" title="上一页">
            <ChevronLeftIcon :size="16" />
          </button>
          <span class="toolbar-page">{{ pptxCurrentSlide }} / {{ pptxTotalSlides }}</span>
          <button class="toolbar-btn" :disabled="pptxCurrentSlide >= pptxTotalSlides" @click="pptxCurrentSlide++" title="下一页">
            <ChevronRightIcon :size="16" />
          </button>
          <div class="toolbar-divider"></div>
        </template>

        <!-- Zoom -->
        <button class="toolbar-btn" @click="zoomOut" title="缩小">
          <ZoomOutIcon :size="16" />
        </button>
        <span class="toolbar-zoom">{{ zoom }}%</span>
        <button class="toolbar-btn" @click="zoomIn" title="放大">
          <ZoomInIcon :size="16" />
        </button>
        <button class="toolbar-btn" @click="resetZoom" title="重置缩放">
          <RefreshCwIcon :size="14" />
        </button>
      </div>

      <div class="toolbar-right">
        <!-- XLSX extras -->
        <template v-if="docType === 'xlsx'">
          <button
            :class="['toolbar-btn', { active: xlsxFormulaMode }]"
            @click="xlsxFormulaMode = !xlsxFormulaMode"
            title="显示公式"
          >
            <FileCodeIcon :size="15" />
          </button>
        </template>

        <!-- Action buttons -->
        <button class="toolbar-btn" @click="printDocx" v-if="docType === 'docx'" title="打印">
          <PrinterIcon :size="16" />
        </button>
        <button class="toolbar-btn" @click="downloadFile" title="下载文件">
          <DownloadIcon :size="16" />
        </button>
        <button class="toolbar-btn" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏'">
          <MinimizeIcon v-if="isFullscreen" :size="16" />
          <MaximizeIcon v-else :size="16" />
        </button>
        <button v-if="isFullscreen" class="toolbar-btn" @click="isFullscreen = false" title="关闭">
          <XIcon :size="16" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="office-body">
      <!-- Sidebar: Info & Navigation -->
      <aside class="office-sidebar">
        <!-- File Info -->
        <div class="info-section">
          <div class="info-header">
            <FileIcon :size="16" />
            <span>文件信息</span>
          </div>
          <div class="info-list">
            <div class="info-row">
              <span class="info-label">名称</span>
              <span class="info-value" :title="docInfo.fileName">{{ docInfo.fileName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">类型</span>
              <span class="info-value">{{ docInfo.fileType }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">大小</span>
              <span class="info-value">{{ formatFileSize(docInfo.fileSize) }}</span>
            </div>
            <div class="info-row" v-if="docInfo.modified">
              <span class="info-label">
                <ClockIcon :size="12" />
              </span>
              <span class="info-value">{{ formatDate(docInfo.modified) }}</span>
            </div>

            <!-- DOCX info -->
            <template v-if="docType === 'docx'">
              <div class="info-row" v-if="docInfo.words">
                <span class="info-label">字数</span>
                <span class="info-value">{{ docInfo.words.toLocaleString() }}</span>
              </div>
              <div class="info-row" v-if="docInfo.paragraphs">
                <span class="info-label">段落</span>
                <span class="info-value">{{ docInfo.paragraphs }}</span>
              </div>
              <div class="info-row" v-if="docInfo.tables">
                <span class="info-label">表格</span>
                <span class="info-value">{{ docInfo.tables }}</span>
              </div>
              <div class="info-row" v-if="docInfo.images">
                <span class="info-label">图片</span>
                <span class="info-value">{{ docInfo.images }}</span>
              </div>
            </template>

            <!-- XLSX info -->
            <template v-if="docType === 'xlsx'">
              <div class="info-row" v-if="docInfo.sheetCount">
                <span class="info-label">
                  <LayersIcon :size="12" />
                </span>
                <span class="info-value">{{ docInfo.sheetCount }} 个工作表</span>
              </div>
              <div class="info-row" v-if="docInfo.rows">
                <span class="info-label">行数</span>
                <span class="info-value">{{ docInfo.rows }}</span>
              </div>
              <div class="info-row" v-if="docInfo.cols">
                <span class="info-label">列数</span>
                <span class="info-value">{{ docInfo.cols }}</span>
              </div>
            </template>

            <!-- PPTX info -->
            <template v-if="docType === 'pptx'">
              <div class="info-row" v-if="docInfo.slides">
                <span class="info-label">幻灯片</span>
                <span class="info-value">{{ docInfo.slides }} 张</span>
              </div>
            </template>
          </div>
        </div>

        <!-- Sheet tabs for XLSX -->
        <div v-if="docType === 'xlsx' && xlsxSheetNames.length > 0" class="info-section">
          <div class="info-header">
            <LayersIcon :size="16" />
            <span>工作表</span>
          </div>
          <div class="sheet-tabs">
            <button
              v-for="name in xlsxSheetNames"
              :key="name"
              :class="['sheet-tab', { active: xlsxActiveSheet === name }]"
              @click="switchSheet(name)"
              :title="name"
            >
              {{ name }}
            </button>
          </div>
        </div>

        <!-- Slide thumbnails for PPTX -->
        <div v-if="docType === 'pptx' && pptxSlideThumbs.length > 0" class="info-section">
          <div class="info-header">
            <PresentationIcon :size="16" />
            <span>幻灯片</span>
          </div>
          <div class="slide-thumbs">
            <button
              v-for="(_, idx) in pptxSlideThumbs"
              :key="idx"
              :class="['slide-thumb', { active: pptxCurrentSlide === idx + 1 }]"
              @click="pptxCurrentSlide = idx + 1"
            >
              <span class="thumb-num">{{ idx + 1 }}</span>
              <div v-if="pptxSlideThumbs[idx]" class="thumb-preview" v-html="pptxSlideThumbs[idx]"></div>
            </button>
          </div>
        </div>
      </aside>

      <!-- Content area -->
      <div class="office-content">
        <!-- Loading -->
        <div v-if="loading" class="office-loading">
          <LoaderIcon :size="40" class="spin" />
          <p>正在解析文档...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="office-error">
          <AlertCircleIcon :size="40" />
          <p>{{ error }}</p>
          <button class="btn btn-primary" @click="downloadFile">
            <DownloadIcon :size="16" />
            下载原文件
          </button>
        </div>

        <!-- DOCX Content -->
        <div v-else-if="docType === 'docx'" class="docx-container">
          <div
            class="docx-content"
            :style="{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }"
            v-html="docxPages[docxCurrentPage - 1] || docxHtml"
          ></div>
        </div>

        <!-- XLSX Content -->
        <div v-else-if="docType === 'xlsx'" class="xlsx-container">
          <div
            class="xlsx-scroll"
            :style="{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }"
          >
            <table class="xlsx-table">
              <thead v-if="xlsxRenderData.length > 0">
                <tr class="xlsx-header-row">
                  <th class="row-num-header">#</th>
                  <th
                    v-for="(_, colIdx) in xlsxRenderData[0]"
                    :key="colIdx"
                    class="xlsx-header-cell"
                  >
                    {{ String.fromCharCode(65 + (colIdx % 26)) }}{{ colIdx >= 26 ? Math.floor(colIdx / 26) : "" }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowIdx) in xlsxRenderData"
                  :key="rowIdx"
                  :class="['xlsx-row', { 'row-frozen': rowIdx < xlsxFrozenRows }]"
                >
                  <td
                    :class="['row-num', { 'col-frozen': colIdx < xlsxFrozenCols }]"
                    v-for="(_, colIdx) in (xlsxRenderData[0] || [])"
                    :key="'num-' + colIdx"
                  >
                    {{ rowIdx + 1 }}
                  </td>
                  <td
                    v-for="(_, colIdx) in (xlsxRenderData[0] || [])"
                    :key="colIdx"
                    :class="[
                      'xlsx-cell',
                      getCellClass(row, colIdx, rowIdx),
                      { 'row-frozen': rowIdx < xlsxFrozenRows },
                      { 'col-frozen': colIdx < xlsxFrozenCols },
                    ]"
                  >
                    {{ getCellValue(row, colIdx) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="xlsxRenderData.length === 0" class="xlsx-empty">
            <TableIcon :size="48" />
            <p>工作表为空</p>
          </div>
        </div>

        <!-- PPTX Content -->
        <div v-else-if="docType === 'pptx'" class="pptx-container">
          <div v-if="pptxSlides.length > 0" class="pptx-slide-area">
            <div
              class="pptx-current-slide"
              v-html="pptxSlides[pptxCurrentSlide - 1]"
            ></div>
          </div>
          <div v-else-if="!loading" class="pptx-fallback">
            <PresentationIcon :size="64" />
            <h3>{{ fileName || file.name }}</h3>
            <p>PPTX 预览已加载</p>
            <p class="pptx-hint">点击下方按钮可进入全屏演示模式</p>
            <button class="btn btn-primary" @click="togglePptxFullscreen">
              <Maximize2Icon :size="16" />
              全屏演示
            </button>
          </div>
        </div>

        <!-- Unknown type -->
        <div v-else class="office-unsupported">
          <AlertCircleIcon :size="48" />
          <p>不支持预览此文件格式</p>
          <button class="btn btn-primary" @click="downloadFile">
            <DownloadIcon :size="16" />
            下载文件
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.office-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  color: #1a1a2e;
  font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
}

.office-preview.dark {
  background: #1a1a2e;
  color: #e0e0e0;
}

.office-preview.fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #fff;
}

.office-preview.dark.fullscreen {
  background: #1a1a2e;
}

/* Toolbar */
.office-toolbar {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
  gap: 8px;
  flex-shrink: 0;
  min-height: 44px;
}

.dark .office-toolbar {
  background: #252542;
  border-color: #3a3a5c;
}

.toolbar-left {
  flex: 1;
  min-width: 0;
}

.toolbar-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .toolbar-title {
  color: #d1d5db;
}

.toolbar-center {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.toolbar-btn:hover:not(:disabled) {
  background: #e5e7eb;
  color: #374151;
}

.dark .toolbar-btn:hover:not(:disabled) {
  background: #3a3a5c;
  color: #d1d5db;
}

.toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbar-btn.active {
  background: #3b82f6;
  color: white;
}

.toolbar-page {
  font-size: 13px;
  color: #6b7280;
  padding: 0 8px;
  min-width: 60px;
  text-align: center;
}

.dark .toolbar-page {
  color: #9ca3af;
}

.toolbar-zoom {
  font-size: 12px;
  color: #6b7280;
  padding: 0 6px;
  min-width: 40px;
  text-align: center;
}

.dark .toolbar-zoom {
  color: #9ca3af;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 4px;
}

.dark .toolbar-divider {
  background: #3a3a5c;
}

/* Body */
.office-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.office-sidebar {
  width: 220px;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  flex-shrink: 0;
}

.dark .office-sidebar {
  background: #16162a;
  border-color: #3a3a5c;
}

.info-section {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.dark .info-section {
  border-color: #3a3a5c;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.dark .info-header {
  color: #9ca3af;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-row {
  display: flex;
  gap: 6px;
  font-size: 12px;
}

.info-label {
  color: #9ca3af;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.info-value {
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .info-value {
  color: #d1d5db;
}

/* Sheet tabs */
.sheet-tabs {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 200px;
  overflow-y: auto;
}

.sheet-tab {
  padding: 5px 10px;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sheet-tab:hover {
  background: #e5e7eb;
  color: #374151;
}

.dark .sheet-tab:hover {
  background: #3a3a5c;
  color: #d1d5db;
}

.sheet-tab.active {
  background: #3b82f6;
  color: white;
}

/* Slide thumbs */
.slide-thumbs {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.slide-thumb {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border: 2px solid transparent;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.dark .slide-thumb {
  background: #252542;
}

.slide-thumb:hover {
  border-color: #93c5fd;
}

.slide-thumb.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.dark .slide-thumb.active {
  background: #1e3a5f;
}

.thumb-num {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  flex-shrink: 0;
}

.thumb-preview {
  flex: 1;
  overflow: hidden;
  max-height: 40px;
  font-size: 10px;
  color: #9ca3af;
}

/* Content */
.office-content {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #f3f4f6;
}

.dark .office-content {
  background: #0f0f1a;
}

/* Loading */
.office-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: #6b7280;
}

.spin {
  animation: spin 1s linear infinite;
  color: #3b82f6;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Error */
.office-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: #6b7280;
  text-align: center;
  padding: 40px;
}

.office-error svg {
  color: #ef4444;
}

/* DOCX */
.docx-container {
  padding: 32px;
  overflow: auto;
  max-height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
}

.docx-content {
  background: white;
  padding: 40px 48px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  min-height: 600px;
  line-height: 1.7;
  font-size: 14px;
  color: #1f2937;
}

.dark .docx-content {
  background: #1f1f38;
  color: #e5e7eb;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.docx-content :deep(h1) { font-size: 24px; font-weight: 700; margin: 0 0 16px; color: #111827; }
.docx-content :deep(h2) { font-size: 20px; font-weight: 600; margin: 20px 0 12px; color: #1f2937; }
.docx-content :deep(h3) { font-size: 17px; font-weight: 600; margin: 16px 0 8px; }
.docx-content :deep(p) { margin: 8px 0; }
.docx-content :deep(ul), .docx-content :deep(ol) { padding-left: 24px; margin: 8px 0; }
.docx-content :deep(table) { border-collapse: collapse; width: 100%; margin: 16px 0; }
.docx-content :deep(th) { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 8px 12px; font-weight: 600; text-align: left; }
.docx-content :deep(td) { border: 1px solid #e5e7eb; padding: 8px 12px; }
.docx-content :deep(img) { max-width: 100%; height: auto; border-radius: 4px; margin: 12px 0; }
.docx-content :deep(blockquote) { border-left: 3px solid #3b82f6; padding-left: 16px; margin: 12px 0; color: #6b7280; }
.docx-content :deep(code) { background: #f1f5f9; padding: 2px 6px; border-radius: 3px; font-family: monospace; font-size: 13px; }
.docx-content :deep(pre) { background: #f1f5f9; padding: 16px; border-radius: 6px; overflow-x: auto; }

/* XLSX */
.xlsx-container {
  padding: 24px;
  overflow: auto;
  width: 100%;
  max-height: 100%;
}

.xlsx-scroll {
  display: inline-block;
  min-width: 100%;
}

.xlsx-table {
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  overflow: hidden;
}

.dark .xlsx-table {
  background: #1f1f38;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.xlsx-header-row {
  background: #f8fafc;
}

.dark .xlsx-header-row {
  background: #252542;
}

.xlsx-header-cell {
  border: 1px solid #e5e7eb;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-align: center;
  min-width: 80px;
  position: sticky;
  top: 0;
}

.dark .xlsx-header-cell {
  border-color: #3a3a5c;
  color: #9ca3af;
}

.row-num-header {
  background: #f1f5f9 !important;
  min-width: 40px;
  width: 40px;
  color: #9ca3af;
}

.dark .row-num-header {
  background: #1a1a35 !important;
}

.xlsx-row:hover td {
  background: #f0f9ff;
}

.dark .xlsx-row:hover td {
  background: #1e3a5f;
}

.xlsx-cell {
  border: 1px solid #e5e7eb;
  padding: 4px 10px;
  font-size: 13px;
  color: #374151;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .xlsx-cell {
  border-color: #3a3a5c;
  color: #d1d5db;
}

.xlsx-cell.row-frozen {
  background: #f8fafc;
  font-weight: 600;
  position: sticky;
}

.xlsx-cell.col-frozen {
  background: #f8fafc;
  font-weight: 600;
}

.dark .xlsx-cell.row-frozen,
.dark .xlsx-cell.col-frozen {
  background: #252542;
}

.xlsx-cell.cell-number {
  text-align: right;
  color: #1d4ed8;
}

.dark .xlsx-cell.cell-number {
  color: #93c5fd;
}

.xlsx-cell.cell-empty {
  background: #fafafa;
}

.dark .xlsx-cell.cell-empty {
  background: #1a1a35;
}

.xlsx-cell.cell-link {
  color: #2563eb;
  text-decoration: underline;
}

.row-num {
  border: 1px solid #e5e7eb;
  padding: 4px 8px;
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
  min-width: 40px;
  width: 40px;
  background: #f8fafc;
}

.dark .row-num {
  border-color: #3a3a5c;
  background: #1a1a35;
  color: #6b7280;
}

.xlsx-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
  color: #9ca3af;
  gap: 12px;
}

/* PPTX */
.pptx-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.pptx-slide-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: auto;
}

.pptx-current-slide {
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  max-width: 100%;
}

.dark .pptx-current-slide {
  background: #1f1f38;
}

.pptx-fallback {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #6b7280;
  padding: 40px;
  text-align: center;
}

.pptx-fallback svg {
  opacity: 0.5;
}

.pptx-hint {
  font-size: 13px;
  color: #9ca3af;
}

/* Buttons */
.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

/* Responsive */
@media (max-width: 768px) {
  .office-sidebar {
    display: none;
  }

  .office-content {
    padding: 8px;
  }

  .docx-content {
    padding: 20px;
  }
}
</style>
