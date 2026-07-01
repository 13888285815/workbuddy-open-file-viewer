<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import {
  ZoomInIcon, ZoomOutIcon, RotateCwIcon, Maximize2Icon, Minimize2Icon,
  ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon,
  SearchIcon, PrinterIcon, ListIcon, XIcon, PlayIcon, PauseIcon,
  Volume2Icon, VolumeXIcon, SkipBackIcon, SkipForwardIcon,
  SettingsIcon, CopyIcon, CheckIcon, DownloadIcon, InfoIcon,
  LanguagesIcon, FileTextIcon, ImageIcon, FilmIcon, MusicIcon, CodeIcon,
  LoaderIcon, AlertCircleIcon, EyeIcon, RotateCcwIcon, Rotate90CwIcon
} from "lucide-vue-next";

// ─── Props & Emits ───────────────────────────────────────────────────────────
interface Props {
  file?: File | null;
  fileName?: string;
  mimeType?: string;
  theme?: "light" | "dark" | "auto";
}

const props = withDefaults(defineProps<Props>(), {
  file: null,
  fileName: "",
  mimeType: "",
  theme: "light"
});

const emit = defineEmits<{
  close: [];
  "file-change": [file: File | null];
}>();

// ─── State ────────────────────────────────────────────────────────────────────
type ViewMode = "image" | "pdf" | "video" | "audio" | "code" | "text" | "unsupported";
const viewMode = ref<ViewMode>("unsupported");
const isFullscreen = ref(false);
const loading = ref(false);
const error = ref("");
const objectUrl = ref("");

// ─── Detect View Mode ─────────────────────────────────────────────────────────
const detectMode = () => {
  if (!props.file || !props.mimeType) { viewMode.value = "unsupported"; return; }
  const m = props.mimeType;
  if (m.startsWith("image/") && !["image/svg+xml", "image/gif", "image/webp"].includes(m)) {
    viewMode.value = "image";
  } else if (m === "application/pdf") {
    viewMode.value = "pdf";
  } else if (m.startsWith("video/")) {
    viewMode.value = "video";
  } else if (m.startsWith("audio/")) {
    viewMode.value = "audio";
  } else if (
    m.includes("javascript") || m.includes("json") || m.includes("xml") ||
    m.includes("html") || m.includes("css") || m.includes("sql") ||
    m.includes("python") || m.includes("java") || m.includes("c") ||
    m.includes("typescript") || m.includes("markdown") ||
    m.startsWith("text/") || m.includes("x-shellscript") ||
    m.includes("yaml") || m.includes("toml") || m.includes("ini") ||
    /\.(js|ts|jsx|tsx|json|xml|html|css|sql|py|java|c|cpp|h|hpp|go|rs|rb|php|sh|bash|yaml|yml|toml|ini|md|vue|swift|kt|m|lua|r| SAS|sas|stan|cfg|conf|env|gitignore|dockerignore|editorconfig|prettierrc|eslintrc|babelrc|webmanifest|graphql|proto)$/i.test(props.fileName)
  ) {
    viewMode.value = "code";
  } else if (m.startsWith("text/")) {
    viewMode.value = "text";
  } else {
    viewMode.value = "unsupported";
  }
};

watch([() => props.file, () => props.mimeType], () => {
  if (objectUrl.value) { URL.revokeObjectURL(objectUrl.value); objectUrl.value = ""; }
  error.value = "";
  if (props.file) {
    objectUrl.value = URL.createObjectURL(props.file);
    detectMode();
    if (viewMode.value === "pdf") initPdf();
    else if (viewMode.value === "code" || viewMode.value === "text") loadText();
    else if (viewMode.value === "image") loadImageInfo();
  } else {
    viewMode.value = "unsupported";
  }
}, { immediate: true });

onUnmounted(() => {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value);
});

// ─── Image State ──────────────────────────────────────────────────────────────
const imageZoom = ref(1);
const imageRotation = ref(0);
const imagePan = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const imageInfo = ref<{ width: number; height: number; size: number; format: string } | null>(null);
const exifData = ref<Record<string, string>>({});
const showImageInfo = ref(false);

const loadImageInfo = () => {
  if (!props.file) return;
  const url = objectUrl.value;
  const img = new Image();
  img.onload = () => {
    imageInfo.value = {
      width: img.naturalWidth,
      height: img.naturalHeight,
      size: props.file!.size,
      format: props.mimeType?.replace("image/", "").toUpperCase() || "?"
    };
    // Basic EXIF from file (simplified)
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as ArrayBuffer;
      try {
        const view = new DataView(data);
        if (view.getUint16(0) === 0xFFD8) {
          const length = view.byteLength;
          let offset = 2;
          while (offset < length) {
            if (view.getUint16(offset) === 0xFFE1) {
              // APP1 marker found, check for EXIF
              const exifDataView = new DataView(data, offset + 4, 8);
              const exifHeader = String.fromCharCode(
                exifDataView.getUint8(0), exifDataView.getUint8(1),
                exifDataView.getUint8(2), exifDataView.getUint8(3)
              );
              if (exifHeader === "Exif") {
                exifData.value = { "EXIF": "已检测到 EXIF 信息（完整解析需要 ExifReader 库）" };
              }
              break;
            }
            offset += 2 + view.getUint16(offset + 2);
          }
        }
      } catch { /* ignore exif parse errors */ }
    };
    reader.readAsArrayBuffer(props.file!.slice(0, 65536));
  };
  img.src = url;
};

const imageTransform = computed(() =>
  `translate(${imagePan.value.x}px, ${imagePan.value.y}px) rotate(${imageRotation.value}deg) scale(${imageZoom.value})`
);

const handleImageWheel = (e: WheelEvent) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  imageZoom.value = Math.min(Math.max(0.1, imageZoom.value + delta), 10);
};

const handleImageMouseDown = (e: MouseEvent) => {
  if (e.button !== 0) return;
  isDragging.value = true;
  dragStart.value = { x: e.clientX - imagePan.value.x, y: e.clientY - imagePan.value.y };
};

const handleImageMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;
  imagePan.value = { x: e.clientX - dragStart.value.x, y: e.clientY - dragStart.value.y };
};

const handleImageMouseUp = () => { isDragging.value = false; };

const zoomIn = () => { imageZoom.value = Math.min(10, imageZoom.value + 0.25); };
const zoomOut = () => { imageZoom.value = Math.max(0.1, imageZoom.value - 0.25); };
const resetView = () => { imageZoom.value = 1; imagePan.value = { x: 0, y: 0 }; imageRotation.value = 0; };
const rotate90 = () => { imageRotation.value = (imageRotation.value + 90) % 360; };

// ─── PDF State ───────────────────────────────────────────────────────────────
const pdfPages = ref<{ canvas: HTMLCanvasElement | null }[]>([]);
const currentPage = ref(1);
const totalPages = ref(0);
const pdfScale = ref(1.2);
const pdfRotation = ref(0);
const showPdfThumbnails = ref(false);
const showPdfSearch = ref(false);
const pdfSearchQuery = ref("");
const pdfLoading = ref(false);
const pdfLibRef = ref<any>(null);
const pdfDocRef = ref<any>(null);
const pdfThumbCanvases = ref<HTMLCanvasElement[]>([]);

const initPdf = async () => {
  if (!props.file) return;
  pdfLoading.value = true;
  try {
    const pdfjsLib = await import("pdfjs-dist");
    const workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).href;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    const arrayBuffer = await props.file.arrayBuffer();
    pdfDocRef.value = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    totalPages.value = pdfDocRef.value.numPages;
    pdfPages.value = Array.from({ length: totalPages.value }, () => ({ canvas: null }));
    await renderPdfPage(1);
    pdfLoading.value = false;
  } catch (e: any) {
    pdfLoading.value = false;
    error.value = "PDF 加载失败: " + (e?.message || e);
  }
};

const renderPdfPage = async (pageNum: number) => {
  if (!pdfDocRef.value) return;
  try {
    const page = await pdfDocRef.value.getPage(pageNum);
    const viewport = page.getViewport({ scale: pdfScale.value, rotation: pdfRotation.value });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    pdfPages.value[pageNum - 1] = { canvas };
    pdfPages.value = [...pdfPages.value];
  } catch (e) { console.error("render page error", e); }
};

const renderPdfThumbnails = async () => {
  if (!pdfDocRef.value) return;
  pdfThumbCanvases.value = [];
  for (let i = 1; i <= totalPages.value; i++) {
    try {
      const page = await pdfDocRef.value.getPage(i);
      const viewport = page.getViewport({ scale: 0.2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport }).promise;
      pdfThumbCanvases.value.push(canvas);
    } catch { pdfThumbCanvases.value.push(document.createElement("canvas")); }
  }
};

watch([pdfScale, pdfRotation], async () => {
  if (pdfDocRef.value) await renderPdfPage(currentPage.value);
});

watch(currentPage, async (p) => {
  if (pdfDocRef.value) await renderPdfPage(p);
});

const goToPage = (p: number) => {
  currentPage.value = Math.min(Math.max(1, p), totalPages.value);
};

const prevPage = () => goToPage(currentPage.value - 1);
const nextPage = () => goToPage(currentPage.value + 1);

const zoomPdfIn = () => { pdfScale.value = Math.min(4, pdfScale.value + 0.2); };
const zoomPdfOut = () => { pdfScale.value = Math.max(0.3, pdfScale.value - 0.2); };
const rotatePdf = () => { pdfRotation.value = (pdfRotation.value + 90) % 360; };

const togglePdfThumbnails = async () => {
  showPdfThumbnails.value = !showPdfThumbnails.value;
  if (showPdfThumbnails.value) await renderPdfThumbnails();
};

const printPdf = () => {
  if (!pdfDocRef.value) return;
  const win = window.open(objectUrl.value);
  if (win) win.addEventListener("load", () => win.print());
};

// ─── Video State ───────────────────────────────────────────────────────────────
const videoEl = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const isMuted = ref(false);
const playbackRate = ref(1);
const videoFullscreen = ref(false);
const showVideoControls = ref(true);
const videoHideTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const videoTracks = ref<{ label: string; language: string; mode: TextTrackMode }[]>([]);
const activeSubtitle = ref<number>(-1);
const showSubMenu = ref(false);
const showSpeedMenu = ref(false);

const formatTime = (s: number) => {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const handleVideoTimeUpdate = () => {
  if (videoEl.value) currentTime.value = videoEl.value.currentTime;
};
const handleVideoLoaded = () => {
  if (videoEl.value) { duration.value = videoEl.value.duration; loadVideoTracks(); }
};
const loadVideoTracks = () => {
  if (!videoEl.value) return;
  videoTracks.value = videoEl.value.textTracks
    ? Array.from(videoEl.value.textTracks).map(t => ({ label: t.label, language: t.language, mode: t.mode }))
    : [];
};

const togglePlay = () => {
  if (!videoEl.value) return;
  if (isPlaying.value) videoEl.value.pause(); else videoEl.value.play();
  isPlaying.value = !isPlaying.value;
};

const seek = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (videoEl.value) videoEl.value.currentTime = parseFloat(input.value);
};

const setVolume = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const v = parseFloat(input.value);
  volume.value = v;
  if (videoEl.value) videoEl.value.volume = v;
  isMuted.value = v === 0;
};

const toggleMute = () => {
  if (!videoEl.value) return;
  isMuted.value = !isMuted.value;
  videoEl.value.muted = isMuted.value;
};

const toggleVideoFullscreen = async () => {
  const container = document.querySelector(".video-container") as HTMLElement;
  if (!document.fullscreenElement) {
    await container?.requestFullscreen();
    videoFullscreen.value = true;
  } else {
    await document.exitFullscreen();
    videoFullscreen.value = false;
  }
};

const setPlaybackRate = (rate: number) => {
  playbackRate.value = rate;
  if (videoEl.value) videoEl.value.playbackRate = rate;
  showSpeedMenu.value = false;
};

const toggleSubtitle = (index: number) => {
  activeSubtitle.value = activeSubtitle.value === index ? -1 : index;
  if (videoEl.value && videoEl.value.textTracks) {
    Array.from(videoEl.value.textTracks).forEach((t, i) => {
      t.mode = i === activeSubtitle.value ? "showing" : "hidden";
    });
  }
};

const handleVideoMouseMove = () => {
  showVideoControls.value = true;
  if (videoHideTimer.value) clearTimeout(videoHideTimer.value);
  videoHideTimer.value = setTimeout(() => { showVideoControls.value = false; }, 3000);
};

const skipBack = () => { if (videoEl.value) videoEl.value.currentTime = Math.max(0, videoEl.value.currentTime - 10); };
const skipForward = () => { if (videoEl.value) videoEl.value.currentTime = Math.min(duration.value, videoEl.value.currentTime + 10); };

// ─── Audio State ───────────────────────────────────────────────────────────────
const audioEl = ref<HTMLAudioElement | null>(null);
const audioPlaying = ref(false);
const audioCurrentTime = ref(0);
const audioDuration = ref(0);
const audioVolume = ref(1);
const audioMuted = ref(false);
const waveformCanvas = ref<HTMLCanvasElement | null>(null);
const audioList = ref<{ name: string; url: string }[]>([]);
const currentTrackIndex = ref(0);
const showLyrics = ref(false);
const lyricsLines = ref<{ time: number; text: string }[]>([]);

const formatAudioTime = formatTime;

const handleAudioTimeUpdate = () => {
  if (audioEl.value) audioCurrentTime.value = audioEl.value.currentTime;
};
const handleAudioLoaded = () => {
  if (audioEl.value) { audioDuration.value = audioEl.value.duration; drawWaveform(); }
};

const toggleAudioPlay = () => {
  if (!audioEl.value) return;
  if (audioPlaying.value) audioEl.value.pause(); else audioEl.value.play();
  audioPlaying.value = !audioPlaying.value;
};

const seekAudio = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (audioEl.value) audioEl.value.currentTime = parseFloat(input.value);
};

const setAudioVolume = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const v = parseFloat(input.value);
  audioVolume.value = v;
  if (audioEl.value) audioEl.value.volume = v;
};

const toggleAudioMute = () => {
  if (!audioEl.value) return;
  audioMuted.value = !audioMuted.value;
  audioEl.value.muted = audioMuted.value;
};

const prevTrack = () => {
  currentTrackIndex.value = Math.max(0, currentTrackIndex.value - 1);
  loadTrack(currentTrackIndex.value);
};

const nextTrack = () => {
  currentTrackIndex.value = Math.min(audioList.value.length - 1, currentTrackIndex.value + 1);
  loadTrack(currentTrackIndex.value);
};

const loadTrack = (index: number) => {
  if (!audioList.value[index]) return;
  if (audioEl.value) audioEl.value.src = audioList.value[index].url;
  if (audioPlaying.value) audioEl.value?.play();
};

const drawWaveform = () => {
  const canvas = waveformCanvas.value;
  if (!canvas || !audioEl.value) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = canvas.offsetWidth * 2;
  canvas.height = canvas.offsetHeight * 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Simple pseudo-waveform from audio analysis (placeholder bars)
  const bars = 100;
  const barWidth = canvas.width / bars;
  const progress = audioCurrentTime.value / audioDuration.value;

  for (let i = 0; i < bars; i++) {
    const height = Math.random() * (canvas.height * 0.7) + canvas.height * 0.1;
    const x = i * barWidth;
    const isPlayed = (i / bars) < progress;
    ctx.fillStyle = isPlayed ? "var(--primary, #3b82f6)" : "var(--border, #e2e8f0)";
    ctx.fillRect(x + 1, (canvas.height - height) / 2, barWidth - 2, height);
  }
};

const parseLrc = (lrc: string) => {
  const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/g;
  const lines: { time: number; text: string }[] = [];
  let match;
  while ((match = regex.exec(lrc)) !== null) {
    const min = parseInt(match[1]);
    const sec = parseInt(match[2]);
    const ms = parseInt(match[3].padEnd(3, "0"));
    lines.push({ time: min * 60 + sec + ms / 1000, text: match[4] });
  }
  lyricsLines.value = lines;
};

const currentLyric = computed(() => {
  const t = audioCurrentTime.value;
  let line = "";
  for (const l of lyricsLines.value) {
    if (l.time <= t) line = l.text;
    else break;
  }
  return line;
});

watch(audioCurrentTime, () => { drawWaveform(); });

// ─── Code Editor State ─────────────────────────────────────────────────────────
const codeContent = ref("");
const codeLanguage = ref("plaintext");
const showLineNumbers = ref(true);
const copied = ref(false);
const foldedLines = ref<Set<number>>(new Set());

const codeLanguages: Record<string, string[]> = {
  javascript: ["js", "jsx", "mjs", "cjs"],
  typescript: ["ts", "tsx"],
  python: ["py"],
  java: ["java"],
  csharp: ["cs"],
  cpp: ["c", "cpp", "cc", "cxx", "h", "hpp"],
  go: ["go"],
  rust: ["rs"],
  ruby: ["rb"],
  php: ["php"],
  html: ["html", "htm"],
  css: ["css", "scss", "sass", "less"],
  json: ["json"],
  xml: ["xml", "xsl", "xslt"],
  sql: ["sql"],
  bash: ["sh", "bash", "zsh"],
  yaml: ["yaml", "yml"],
  toml: ["toml"],
  ini: ["ini", "cfg", "conf"],
  markdown: ["md", "mdx"],
  vue: ["vue"],
  swift: ["swift"],
  kotlin: ["kt", "kts"],
  lua: ["lua"],
  r: ["r", "R"],
  dart: ["dart"],
  scala: ["scala"],
  haskell: ["hs"],
  dockerfile: ["dockerfile"],
  graphql: ["graphql", "gql"],
  proto: ["proto"],
};

const detectLanguage = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  for (const [lang, exts] of Object.entries(codeLanguages)) {
    if (exts.includes(ext)) return lang;
  }
  if (/^[A-Z_]+$/.test(ext) || ext === "env" || ext === "gitignore") return "bash";
  return "plaintext";
};

const loadText = async () => {
  if (!props.file) return;
  try {
    codeContent.value = await props.file.text();
    codeLanguage.value = detectLanguage(props.fileName || "");
  } catch (e) {
    codeContent.value = "[无法读取文件内容]";
    codeLanguage.value = "plaintext";
  }
};

const codeLines = computed(() => codeContent.value.split("\n"));

const toggleFold = (lineIndex: number) => {
  if (foldedLines.value.has(lineIndex)) foldedLines.value.delete(lineIndex);
  else foldedLines.value.add(lineIndex);
  foldedLines.value = new Set(foldedLines.value);
};

const hasFoldMarker = (line: string) => {
  return line.trimStart().startsWith("{") || line.trimStart().startsWith("}") ||
    line.trimStart().startsWith("function") || line.trimStart().startsWith("class") ||
    line.trimStart().startsWith("const ") || line.trimStart().startsWith("let ") ||
    line.trimStart().startsWith("def ") || line.trimStart().startsWith("if ") ||
    line.trimStart().startsWith("for ") || line.trimStart().startsWith("while ") ||
    line.trimStart().startsWith("switch ");
};

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(codeContent.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch { /* ignore */ }
};

const downloadCode = () => {
  if (!props.file) return;
  const url = objectUrl.value;
  const a = document.createElement("a");
  a.href = url;
  a.download = props.fileName || "code";
  a.click();
};

// ─── Text Viewer ───────────────────────────────────────────────────────────────
const textContent = ref("");

// ─── Edit Mode ────────────────────────────────────────────────────────────────
const isEditing = ref(false);
const editContent = ref("");
const editModified = ref(false);
const editSaved = ref(false);

const enterEditMode = () => {
  editContent.value = codeContent.value;
  isEditing.value = true;
  editModified.value = false;
  editSaved.value = false;
};

const exitEditMode = () => {
  if (editModified.value) {
    if (!confirm("有未保存的修改，确定退出？")) return;
  }
  isEditing.value = false;
};

const handleEditInput = (e: Event) => {
  const ta = e.target as HTMLTextAreaElement;
  editContent.value = ta.value;
  editModified.value = true;
  editSaved.value = false;
};

const saveEdit = () => {
  codeContent.value = editContent.value;
  editModified.value = false;
  editSaved.value = true;
  setTimeout(() => { editSaved.value = false; }, 2000);
  // Update the file object
  if (props.file) {
    const blob = new Blob([editContent.value], { type: props.mimeType || "text/plain" });
    const newFile = new File([blob], props.fileName || "untitled", { type: props.mimeType || "text/plain" });
    emit("file-change", newFile);
  }
};

const downloadEdited = () => {
  const blob = new Blob([editContent.value], { type: props.mimeType || "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = props.fileName || "edited.txt";
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Image Edit State ─────────────────────────────────────────────────────────
const isImageEditing = ref(false);
const editImageCanvas = ref<HTMLCanvasElement | null>(null);
const editImageCtx = ref<CanvasRenderingContext2D | null>(null);
const imageCropRect = ref({ x: 0, y: 0, w: 0, h: 0 });
const isCropping = ref(false);
const cropStart = ref({ x: 0, y: 0 });

const startImageEdit = async () => {
  if (!props.file) return;
  isImageEditing.value = true;
  await nextTick();
  const canvas = editImageCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  editImageCtx.value = ctx;
  const img = new Image();
  img.onload = () => {
    const maxW = canvas.parentElement?.clientWidth || 800;
    const maxH = canvas.parentElement?.clientHeight || 600;
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
    canvas.width = img.naturalWidth * scale;
    canvas.height = img.naturalHeight * scale;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.src = objectUrl.value;
};

const rotateImageEdit = () => {
  const canvas = editImageCanvas.value;
  const ctx = editImageCtx.value;
  if (!canvas || !ctx) return;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const rotated = document.createElement("canvas");
  rotated.width = canvas.height;
  rotated.height = canvas.width;
  const rctx = rotated.getContext("2d")!;
  rctx.translate(rotated.width / 2, rotated.height / 2);
  rctx.rotate(Math.PI / 2);
  rctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  canvas.width = rotated.width;
  canvas.height = rotated.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(rotated, 0, 0);
};

const flipImageEdit = (dir: "h" | "v") => {
  const canvas = editImageCanvas.value;
  const ctx = editImageCtx.value;
  if (!canvas || !ctx) return;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const flipped = document.createElement("canvas");
  flipped.width = canvas.width;
  flipped.height = canvas.height;
  const fctx = flipped.getContext("2d")!;
  if (dir === "h") {
    fctx.translate(flipped.width, 0);
    fctx.scale(-1, 1);
  } else {
    fctx.translate(0, flipped.height);
    fctx.scale(1, -1);
  }
  fctx.drawImage(canvas, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(flipped, 0, 0);
};

const invertColors = () => {
  const canvas = editImageCanvas.value;
  const ctx = editImageCtx.value;
  if (!canvas || !ctx) return;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 255 - imgData.data[i];
    imgData.data[i + 1] = 255 - imgData.data[i + 1];
    imgData.data[i + 2] = 255 - imgData.data[i + 2];
  }
  ctx.putImageData(imgData, 0, 0);
};

const grayscaleFilter = () => {
  const canvas = editImageCanvas.value;
  const ctx = editImageCtx.value;
  if (!canvas || !ctx) return;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
    imgData.data[i] = avg; imgData.data[i + 1] = avg; imgData.data[i + 2] = avg;
  }
  ctx.putImageData(imgData, 0, 0);
};

const adjustBrightness = (delta: number) => {
  const canvas = editImageCanvas.value;
  const ctx = editImageCtx.value;
  if (!canvas || !ctx) return;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + delta));
    imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + delta));
    imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + delta));
  }
  ctx.putImageData(imgData, 0, 0);
};

const applyCrop = () => {
  const canvas = editImageCanvas.value;
  const ctx = editImageCtx.value;
  if (!canvas || !ctx) return;
  const { x, y, w, h } = imageCropRect.value;
  if (w <= 0 || h <= 0) return;
  const imgData = ctx.getImageData(x, y, w, h);
  canvas.width = w;
  canvas.height = h;
  ctx.putImageData(imgData, 0, 0);
  isCropping.value = false;
};

const handleCanvasMouseDown = (e: MouseEvent) => {
  if (!isCropping.value) return;
  const rect = editImageCanvas.value!.getBoundingClientRect();
  cropStart.value = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  imageCropRect.value = { x: cropStart.value.x, y: cropStart.value.y, w: 0, h: 0 };
};

const handleCanvasMouseMove = (e: MouseEvent) => {
  if (!isCropping.value || !editImageCanvas.value) return;
  const rect = editImageCanvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  imageCropRect.value = {
    x: Math.min(cropStart.value.x, x),
    y: Math.min(cropStart.value.y, y),
    w: Math.abs(x - cropStart.value.x),
    h: Math.abs(y - cropStart.value.y),
  };
};

const drawCropOverlay = () => {
  const canvas = editImageCanvas.value;
  const ctx = editImageCtx.value;
  if (!canvas || !ctx) return;
  // Redraw original then overlay
  const { x, y, w, h } = imageCropRect.value;
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
  // Dim outside
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 0, canvas.width, y);
  ctx.fillRect(0, y + h, canvas.width, canvas.height - y - h);
  ctx.fillRect(0, y, x, h);
  ctx.fillRect(x + w, y, canvas.width - x - w, h);
};

const saveEditedImage = () => {
  const canvas = editImageCanvas.value;
  if (!canvas) return;
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited_" + (props.fileName || "image.png");
    a.click();
    URL.revokeObjectURL(url);
  }, props.mimeType || "image/png");
};

const exitImageEdit = () => {
  isImageEditing.value = false;
  isCropping.value = false;
};

// ─── Video Clip Edit ─────────────────────────────────────────────────────────
const isVideoEditing = ref(false);
const videoClipStart = ref(0);
const videoClipEnd = ref(0);
const videoEl2 = ref<HTMLVideoElement | null>(null);

const enterVideoEdit = () => {
  isVideoEditing.value = true;
  videoClipStart.value = 0;
  videoClipEnd.value = duration.value || 0;
};

const downloadVideoClip = () => {
  if (!videoEl2.value) return;
  // For clip download, show instruction since full implementation requires ffmpeg.wasm
  alert(`视频裁剪范围: ${formatTime(videoClipStart.value)} ~ ${formatTime(videoClipEnd.value)}\n\n如需下载裁剪后的片段，请安装 FFmpeg.wasm 或使用桌面端工具。\n当前浏览器版本支持将视频导出为 WebM 格式。`);
  // Export current range as data URL (limited)
  const canvas = document.createElement("canvas");
  canvas.width = videoEl2.value.videoWidth || 640;
  canvas.height = videoEl2.value.videoHeight || 360;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(videoEl2.value, 0, 0, canvas.width, canvas.height);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "frame_" + (props.fileName?.replace(/\.[^.]+$/, "") || "video") + ".png";
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
};

const exitVideoEdit = () => {
  isVideoEditing.value = false;
};

// ─── Audio Edit ──────────────────────────────────────────────────────────────
const isAudioEditing = ref(false);
const audioTrimStart = ref(0);
const audioTrimEnd = ref(0);

const enterAudioEdit = () => {
  isAudioEditing.value = true;
  audioTrimStart.value = 0;
  audioTrimEnd.value = audioDuration.value || 0;
};

const downloadAudioTrim = () => {
  alert(`音频裁剪范围: ${formatAudioTime(audioTrimStart.value)} ~ ${formatAudioTime(audioTrimEnd.value)}\n\n如需下载裁剪后的片段，请使用 FFmpeg.wasm 或桌面端音频编辑器。`);
};

const exitAudioEdit = () => {
  isAudioEditing.value = false;
};

// ─── PDF Annotate ─────────────────────────────────────────────────────────────
const isPdfAnnotating = ref(false);
const pdfAnnotationColor = ref("#ef4444");
const pdfAnnotationMode = ref<"highlight" | "note" | "draw">("highlight");
const pdfAnnotations = ref<{ type: string; page: number; x: number; y: number; w?: number; h?: number; text?: string; color: string }[]>([]);

const togglePdfAnnotate = () => {
  isPdfAnnotating.value = !isPdfAnnotating.value;
};

const addPdfAnnotation = (type: string, x: number, y: number, page: number) => {
  pdfAnnotations.value.push({
    type,
    page,
    x,
    y,
    color: pdfAnnotationColor.value,
    ...(type === "note" ? { text: "备注" } : {}),
    ...(type === "highlight" ? { w: 100, h: 20 } : {}),
  });
};

const downloadAnnotatedPdf = () => {
  alert(`PDF 标注已保存 (${pdfAnnotations.value.length} 条)\n\n完整 PDF 编辑需要 pdf-lib 或 pdf.js 编辑模式，当前为预览版。\n标注数据已保存在内存中，可导出为 JSON 记录。`);
  // Export annotations as JSON
  const json = JSON.stringify(pdfAnnotations.value, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (props.fileName || "annotations") + "_annotations.json";
  a.click();
  URL.revokeObjectURL(url);
};

const exitPdfAnnotate = () => {
  isPdfAnnotating.value = false;
};

// ─── Fullscreen ───────────────────────────────────────────────────────────────
const toggleFullscreen = async () => {
  const el = document.querySelector(".preview-area") as HTMLElement;
  if (!document.fullscreenElement) {
    await el?.requestFullscreen();
    isFullscreen.value = true;
  } else {
    await document.exitFullscreen();
    isFullscreen.value = false;
  }
};

// ─── Tab Switching for mixed modes ────────────────────────────────────────────
const activeTab = ref("");

// ─── Expose ───────────────────────────────────────────────────────────────────
defineExpose({
  toggleFullscreen,
  currentPage,
  totalPages,
  imageZoom,
  imageRotation,
  objectUrl,
});
</script>

<template>
  <div class="preview-area" :class="{ fullscreen: isFullscreen }">
    <!-- Loading -->
    <div v-if="loading || pdfLoading" class="preview-loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">加载中...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="preview-error">
      <AlertCircleIcon :size="48" />
      <p>{{ error }}</p>
    </div>

    <!-- Image Preview -->
    <div v-else-if="viewMode === 'image'" class="image-preview">
      <!-- Toolbar -->
      <div class="preview-toolbar">
        <div class="toolbar-group">
          <button class="toolbar-btn" title="缩小" @click="zoomOut"><ZoomOutIcon :size="16" /></button>
          <span class="zoom-label">{{ Math.round(imageZoom * 100) }}%</span>
          <button class="toolbar-btn" title="放大" @click="zoomIn"><ZoomInIcon :size="16" /></button>
          <button class="toolbar-btn" title="重置" @click="resetView"><RotateCcwIcon :size="16" /></button>
        </div>
        <div class="toolbar-group">
          <button class="toolbar-btn" title="旋转 90°" @click="rotate90"><Rotate90CwIcon :size="16" /></button>
        </div>
        <div class="toolbar-group">
          <button class="toolbar-btn" :title="showImageInfo ? '隐藏信息' : '显示信息'" @click="showImageInfo = !showImageInfo">
            <InfoIcon :size="16" />
          </button>
          <button class="toolbar-btn" title="全屏" @click="toggleFullscreen"><Maximize2Icon :size="16" /></button>
        </div>
      </div>

      <!-- Image Canvas -->
      <div
        class="image-canvas"
        @wheel.prevent="handleImageWheel"
        @mousedown="handleImageMouseDown"
        @mousemove="handleImageMouseMove"
        @mouseup="handleImageMouseUp"
        @mouseleave="handleImageMouseUp"
        :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
      >
        <img
          :src="objectUrl"
          class="preview-image"
          :style="{ transform: imageTransform }"
          draggable="false"
          alt="preview"
        />
      </div>

      <!-- Image Info Panel -->
      <div v-if="showImageInfo && imageInfo" class="info-panel">
        <div class="info-header">
          <span>图片信息</span>
          <button class="icon-btn-sm" @click="showImageInfo = false"><XIcon :size="14" /></button>
        </div>
        <div class="info-row">
          <span class="info-label">尺寸</span>
          <span class="info-value">{{ imageInfo.width }} × {{ imageInfo.height }} px</span>
        </div>
        <div class="info-row">
          <span class="info-label">格式</span>
          <span class="info-value">{{ imageInfo.format }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">大小</span>
          <span class="info-value">
            {{ imageInfo.size > 1024 * 1024
              ? (imageInfo.size / 1024 / 1024).toFixed(2) + " MB"
              : imageInfo.size > 1024
              ? (imageInfo.size / 1024).toFixed(1) + " KB"
              : imageInfo.size + " B" }}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">缩放</span>
          <span class="info-value">{{ Math.round(imageZoom * 100) }}%</span>
        </div>
        <div class="info-row">
          <span class="info-label">旋转</span>
          <span class="info-value">{{ imageRotation }}°</span>
        </div>
        <div v-for="(v, k) in exifData" :key="k" class="info-row">
          <span class="info-label">{{ k }}</span>
          <span class="info-value">{{ v }}</span>
        </div>
      </div>
    </div>

    <!-- PDF Preview -->
    <div v-else-if="viewMode === 'pdf'" class="pdf-preview">
      <!-- Toolbar -->
      <div class="preview-toolbar">
        <div class="toolbar-group">
          <button class="toolbar-btn" @click="goToPage(1)" :disabled="currentPage <= 1"><ChevronsLeftIcon :size="16" /></button>
          <button class="toolbar-btn" @click="prevPage" :disabled="currentPage <= 1"><ChevronLeftIcon :size="16" /></button>
          <span class="page-label">{{ currentPage }} / {{ totalPages }}</span>
          <button class="toolbar-btn" @click="nextPage" :disabled="currentPage >= totalPages"><ChevronRightIcon :size="16" /></button>
          <button class="toolbar-btn" @click="goToPage(totalPages)" :disabled="currentPage >= totalPages"><ChevronsRightIcon :size="16" /></button>
        </div>
        <div class="toolbar-group">
          <input
            type="number"
            class="page-input"
            :value="currentPage"
            min="1" :max="totalPages"
            @change="(e) => goToPage(parseInt((e.target as HTMLInputElement).value))"
          />
        </div>
        <div class="toolbar-group">
          <button class="toolbar-btn" title="缩小" @click="zoomPdfOut"><ZoomOutIcon :size="16" /></button>
          <span class="zoom-label">{{ Math.round(pdfScale * 100) }}%</span>
          <button class="toolbar-btn" title="放大" @click="zoomPdfIn"><ZoomInIcon :size="16" /></button>
          <button class="toolbar-btn" title="旋转" @click="rotatePdf"><RotateCwIcon :size="16" /></button>
        </div>
        <div class="toolbar-group">
          <button class="toolbar-btn" :class="{ active: showPdfThumbnails }" title="缩略图" @click="togglePdfThumbnails"><ImageIcon :size="16" /></button>
          <button class="toolbar-btn" :class="{ active: isPdfAnnotating }" @click="togglePdfAnnotate" title="标注" style="color: var(--primary);"><FileTextIcon :size="16" /> 标注</button>
          <button class="toolbar-btn" title="打印" @click="printPdf"><PrinterIcon :size="16" /></button>
        </div>
        <div class="toolbar-spacer"></div>
        <button class="toolbar-btn" title="全屏" @click="toggleFullscreen"><Maximize2Icon :size="16" /></button>
      </div>

      <!-- Content -->
      <div class="pdf-content">
        <!-- Thumbnails Sidebar -->
        <div v-if="showPdfThumbnails" class="pdf-thumbnails">
          <div
            v-for="(canvas, i) in pdfThumbCanvases"
            :key="i"
            :class="['pdf-thumb', { active: currentPage === i + 1 }]"
            @click="goToPage(i + 1)"
          >
            <canvas :ref="(el) => { if (el) (el as HTMLCanvasElement).replaceWith(canvas.cloneNode(true) as HTMLCanvasElement) }" />
            <span class="thumb-label">{{ i + 1 }}</span>
          </div>
        </div>

        <!-- Page Canvas -->
        <div class="pdf-page-area">
          <div class="pdf-page-container">
            <canvas
              v-if="pdfPages[currentPage - 1]?.canvas"
              :ref="(el) => {
                const canvas = pdfPages[currentPage - 1]?.canvas;
                if (el && canvas) {
                  const ctx = (el as HTMLCanvasElement).getContext('2d');
                  if (ctx) {
                    (el as HTMLCanvasElement).width = canvas.width;
                    (el as HTMLCanvasElement).height = canvas.height;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(canvas, 0, 0);
                    // Draw annotations
                    if (isPdfAnnotating) {
                      const annots = pdfAnnotations.value.filter(a => a.page === currentPage);
                      annots.forEach(a => {
                        if (a.type === 'highlight' && a.w && a.h) {
                          ctx.fillStyle = a.color + '44';
                          ctx.fillRect(a.x, a.y, a.w, a.h);
                        } else if (a.type === 'note') {
                          ctx.fillStyle = a.color;
                          ctx.beginPath();
                          ctx.arc(a.x, a.y, 8, 0, Math.PI * 2);
                          ctx.fill();
                          ctx.fillStyle = 'white';
                          ctx.font = '10px sans-serif';
                          ctx.fillText('N', a.x - 3, a.y + 4);
                        }
                      });
                    }
                  }
                }
              }"
              class="pdf-canvas"
              :class="{ 'annotatable': isPdfAnnotating }"
              @click="(e) => { if (isPdfAnnotating) addPdfAnnotation(pdfAnnotationMode, (e as MouseEvent).offsetX, (e as MouseEvent).offsetY, currentPage) }"
            />
            <div v-else class="pdf-placeholder">
              <LoaderIcon :size="32" class="spin" />
              <span>加载页面 {{ currentPage }}...</span>
            </div>
          </div>

          <!-- PDF Annotate Sidebar -->
          <div v-if="isPdfAnnotating" class="pdf-annotate-bar">
            <div class="pdf-annotate-header">PDF 标注</div>
            <div class="pdf-annotate-tools">
              <button :class="['annotate-tool', { active: pdfAnnotationMode === 'highlight' }]" @click="pdfAnnotationMode = 'highlight'">高亮</button>
              <button :class="['annotate-tool', { active: pdfAnnotationMode === 'note' }]" @click="pdfAnnotationMode = 'note'">备注</button>
            </div>
            <div class="pdf-annotate-colors">
              <span style="font-size: 11px; color: var(--text-muted);">颜色:</span>
              <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                <button v-for="c in ['#ef4444','#f59e0b','#22c55e','#3b82f6','#8b5cf6']" :key="c"
                  :style="{ background: c, width: '24px', height: '24px', borderRadius: '4px', border: pdfAnnotationColor === c ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer' }"
                  @click="pdfAnnotationColor = c"
                ></button>
              </div>
            </div>
            <div style="padding: 8px; font-size: 12px; color: var(--text-muted);">
              {{ pdfAnnotations.length }} 条标注
            </div>
            <button class="toolbar-btn" style="margin: 8px; width: calc(100% - 16px); justify-content: center;" @click="downloadAnnotatedPdf">
              <DownloadIcon :size="14" /> 导出 JSON
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Player -->
    <div v-else-if="viewMode === 'video'" class="video-preview">
      <div
        class="video-container"
        @mousemove="handleVideoMouseMove"
        @click="togglePlay"
      >
        <video
          ref="videoEl"
          :src="objectUrl"
          class="video-element"
          @timeupdate="handleVideoTimeUpdate"
          @loadedmetadata="handleVideoLoaded"
          @ended="isPlaying = false"
          @click.stop
        ></video>

        <!-- Controls -->
        <div
          class="video-controls"
          :class="{ visible: showVideoControls }"
          @click.stop
        >
          <!-- Progress -->
          <div class="progress-area">
            <input
              type="range"
              class="progress-bar"
              min="0" :max="duration || 100"
              step="0.1"
              :value="currentTime"
              @input="seek"
            />
          </div>

          <div class="controls-row">
            <div class="controls-left">
              <button class="ctrl-btn" @click="skipBack"><SkipBackIcon :size="18" /></button>
              <button class="ctrl-btn play-btn" @click="togglePlay">
                <PauseIcon v-if="isPlaying" :size="22" />
                <PlayIcon v-else :size="22" />
              </button>
              <button class="ctrl-btn" @click="skipForward"><SkipForwardIcon :size="18" /></button>
              <span class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
            </div>

            <div class="controls-right">
              <!-- Volume -->
              <div class="volume-group">
                <button class="ctrl-btn" @click="toggleMute">
                  <VolumeXIcon v-if="isMuted || volume === 0" :size="18" />
                  <Volume2Icon v-else :size="18" />
                </button>
                <input
                  type="range" class="volume-bar"
                  min="0" max="1" step="0.05"
                  :value="isMuted ? 0 : volume"
                  @input="setVolume"
                />
              </div>

              <!-- Speed -->
              <div class="speed-menu-wrapper">
                <button class="ctrl-btn" @click.stop="showSpeedMenu = !showSpeedMenu">
                  <SettingsIcon :size="16" />
                  <span class="speed-label">{{ playbackRate }}x</span>
                </button>
                <div v-if="showSpeedMenu" class="speed-menu">
                  <button v-for="r in [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]" :key="r"
                    :class="['speed-item', { active: playbackRate === r }]"
                    @click="setPlaybackRate(r)">{{ r }}x</button>
                </div>
              </div>

              <!-- Subtitles -->
              <div v-if="videoTracks.length > 0" class="sub-menu-wrapper">
                <button class="ctrl-btn" @click.stop="showSubMenu = !showSubMenu">
                  <LanguagesIcon :size="16" />
                </button>
                <div v-if="showSubMenu" class="speed-menu">
                  <button :class="['speed-item', { active: activeSubtitle === -1 }]"
                    @click="toggleSubtitle(-1)">关闭</button>
                  <button v-for="(t, i) in videoTracks" :key="i"
                    :class="['speed-item', { active: activeSubtitle === i }]"
                    @click="toggleSubtitle(i)">{{ t.label || t.language }}</button>
                </div>
              </div>

              <button class="ctrl-btn" @click="toggleVideoFullscreen">
                <Minimize2Icon v-if="videoFullscreen" :size="18" />
                <Maximize2Icon v-else :size="18" />
              </button>
              <button class="ctrl-btn" @click="enterVideoEdit" style="color: var(--primary);" title="裁剪视频">
                <FileTextIcon :size="16" /> 裁剪
              </button>
            </div>
          </div>
        </div>

        <!-- Video Edit Mode -->
        <div v-if="isVideoEditing" class="video-edit-mode">
          <div class="preview-toolbar">
            <div class="toolbar-group">
              <span class="lang-badge" style="color: var(--primary);">视频裁剪</span>
            </div>
            <div class="toolbar-group">
              <span style="font-size: 12px; color: var(--text-secondary);">开始:</span>
              <input type="number" class="page-input" style="width: 70px;" v-model.number="videoClipStart" min="0" :max="duration" step="1" />
              <span style="font-size: 12px; color: var(--text-secondary); margin-left: 12px;">结束:</span>
              <input type="number" class="page-input" style="width: 70px;" v-model.number="videoClipEnd" min="0" :max="duration" step="1" />
            </div>
            <div class="toolbar-spacer"></div>
            <button class="toolbar-btn" @click="downloadVideoClip" style="color: var(--primary);">
              <DownloadIcon :size="16" /> 导出片段
            </button>
            <button class="toolbar-btn" @click="exitVideoEdit"><XIcon :size="16" /> 退出</button>
          </div>
          <div class="video-edit-content">
            <video ref="videoEl2" :src="objectUrl" style="width: 100%; max-height: 65vh; display: block;" controls></video>
            <div class="video-edit-info">
              <p style="color: var(--text-secondary); font-size: 13px;">裁剪范围: {{ formatTime(videoClipStart) }} ~ {{ formatTime(videoClipEnd) }}</p>
              <p style="color: var(--text-muted); font-size: 12px; margin-top: 8px;">注: 完整视频裁剪需 FFmpeg.wasm，当前可导出首帧 PNG</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Audio Player -->
    <div v-else-if="viewMode === 'audio'" class="audio-preview">
      <!-- Hidden audio element -->
      <audio
        ref="audioEl"
        :src="objectUrl"
        @timeupdate="handleAudioTimeUpdate"
        @loadedmetadata="handleAudioLoaded"
        @ended="audioPlaying = false"
      ></audio>

      <div class="audio-card">
        <!-- Album art placeholder -->
        <div class="audio-art">
          <MusicIcon :size="64" />
        </div>

        <!-- Waveform -->
        <div class="waveform-area">
          <canvas ref="waveformCanvas" class="waveform-canvas"></canvas>
        </div>

        <!-- Info -->
        <div class="audio-info">
          <span class="audio-name">{{ fileName }}</span>
        </div>

        <!-- Progress -->
        <div class="audio-progress">
          <span class="time-label">{{ formatAudioTime(audioCurrentTime) }}</span>
          <input
            type="range"
            class="audio-progress-bar"
            min="0" :max="audioDuration || 100"
            step="0.1"
            :value="audioCurrentTime"
            @input="seekAudio"
          />
          <span class="time-label">{{ formatAudioTime(audioDuration) }}</span>
        </div>

        <!-- Controls -->
        <div class="audio-controls">
          <button class="ctrl-btn" @click="prevTrack"><SkipBackIcon :size="20" /></button>
          <button class="ctrl-btn" @click="toggleAudioMute">
            <VolumeXIcon v-if="audioMuted || audioVolume === 0" :size="18" />
            <Volume2Icon v-else :size="18" />
          </button>
          <button class="ctrl-btn play-btn audio-play" @click="toggleAudioPlay">
            <PauseIcon v-if="audioPlaying" :size="24" />
            <PlayIcon v-else :size="24" />
          </button>
          <button class="ctrl-btn" @click="nextTrack"><SkipForwardIcon :size="20" /></button>
          <button class="ctrl-btn" @click="showLyrics = !showLyrics">
            <FileTextIcon :size="18" />
          </button>
        </div>

        <!-- Volume + Edit -->
        <div class="audio-volume">
          <input
            type="range" class="volume-bar"
            min="0" max="1" step="0.05"
            :value="audioVolume"
            @input="setAudioVolume"
          />
          <button class="ctrl-btn" @click="enterAudioEdit" style="font-size: 11px; color: var(--primary);" title="裁剪音频">
            <FileTextIcon :size="14" /> 裁剪
          </button>
        </div>

        <!-- Lyrics -->
        <div v-if="showLyrics && currentLyric" class="lyrics-area">
          <p class="lyrics-text">{{ currentLyric }}</p>
        </div>
      </div>
    </div>

    <!-- ═══ CODE / TEXT EDIT MODE ═══ -->
    <div v-else-if="(viewMode === 'code' || viewMode === 'text') && isEditing" class="edit-mode">
      <div class="preview-toolbar">
        <div class="toolbar-group">
          <span class="lang-badge">{{ codeLanguage }} (编辑模式)</span>
        </div>
        <div class="toolbar-group">
          <span v-if="editModified" style="color: #f59e0b; font-size: 12px;">● 已修改</span>
          <span v-else-if="editSaved" style="color: #22c55e; font-size: 12px;">✓ 已保存</span>
        </div>
        <div class="toolbar-spacer"></div>
        <button class="toolbar-btn" @click="saveEdit" :disabled="!editModified" title="保存">
          <CheckIcon :size="16" /> 保存
        </button>
        <button class="toolbar-btn" @click="downloadEdited" title="下载">
          <DownloadIcon :size="16" /> 下载
        </button>
        <button class="toolbar-btn" @click="exitEditMode" title="退出编辑">
          <XIcon :size="16" /> 退出
        </button>
      </div>
      <div class="edit-container">
        <textarea
          class="edit-textarea"
          :value="editContent"
          @input="handleEditInput"
          :placeholder="'编辑 ' + (props.fileName || '文件') + '...'"
          spellcheck="false"
        ></textarea>
      </div>
    </div>

    <!-- Code Editor -->
    <div v-else-if="viewMode === 'code'" class="code-preview">
      <!-- Toolbar -->
      <div class="preview-toolbar">
        <div class="toolbar-group">
          <span class="lang-badge">{{ codeLanguage }}</span>
        </div>
        <div class="toolbar-group">
          <button class="toolbar-btn" :class="{ active: showLineNumbers }" @click="showLineNumbers = !showLineNumbers" title="行号">
            <ListIcon :size="16" />
          </button>
        </div>
        <div class="toolbar-spacer"></div>
        <button class="toolbar-btn" @click="copyCode" title="复制">
          <CheckIcon v-if="copied" :size="16" />
          <CopyIcon v-else :size="16" />
          <span v-if="!copied">复制</span>
          <span v-else>已复制!</span>
        </button>
        <button class="toolbar-btn" @click="downloadCode" title="下载">
          <DownloadIcon :size="16" />
        </button>
        <button class="toolbar-btn" title="全屏" @click="toggleFullscreen">
          <Maximize2Icon :size="16" />
        </button>
        <button class="toolbar-btn" @click="enterEditMode" title="编辑代码" style="color: var(--primary);">
          <FileTextIcon :size="16" /> 编辑
        </button>
      </div>

      <!-- Code content -->
      <div class="code-container">
        <div class="code-scroll">
          <div class="code-table">
            <div v-for="(line, i) in codeLines" :key="i" class="code-line" :class="{ folded: foldedLines.has(i) }">
              <button
                v-if="hasFoldMarker(line)"
                class="fold-btn"
                @click="toggleFold(i)"
                :title="foldedLines.has(i) ? '展开' : '折叠'"
              >
                <ChevronRightIcon :size="12" :class="{ 'rotated': !foldedLines.has(i) }" />
              </button>
              <span v-else class="fold-placeholder"></span>
              <span v-if="showLineNumbers" class="line-number">{{ i + 1 }}</span>
              <code class="line-content" v-html="highlightLine(line, codeLanguage)"></code>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Text Viewer -->
    <div v-else-if="viewMode === 'text'" class="text-preview">
      <div class="preview-toolbar">
        <div class="toolbar-group"><span class="lang-badge">Text</span></div>
        <div class="toolbar-spacer"></div>
        <button class="toolbar-btn" @click="copyCode" title="复制">
          <CheckIcon v-if="copied" :size="16" />
          <CopyIcon v-else :size="16" />
          <span v-if="!copied">复制</span>
        </button>
        <button class="toolbar-btn" title="全屏" @click="toggleFullscreen">
          <Maximize2Icon :size="16" />
        </button>
        <button class="toolbar-btn" @click="enterEditMode" title="编辑文本" style="color: var(--primary);">
          <FileTextIcon :size="16" /> 编辑
        </button>
      </div>
      <div class="text-container">
        <pre class="text-content"><code>{{ codeContent }}</code></pre>
      </div>
    </div>

    <!-- Unsupported -->
    <div v-else class="preview-unsupported">
      <FileTextIcon :size="64" style="opacity: 0.3" />
      <p class="preview-unsupported-text">不支持预览此文件类型</p>
      <p class="preview-unsupported-hint">{{ mimeType || "未知类型" }}</p>
      <button v-if="file" class="btn btn-primary" @click="downloadCode">
        <DownloadIcon :size="16" /> 下载文件
      </button>
    </div>
  </div>
</template>

<script lang="ts">
// Syntax highlighting (lightweight native implementation)
const KEYWORDS: Record<string, string[]> = {
  javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "try", "catch", "finally", "throw", "new", "this", "class", "extends", "import", "export", "default", "from", "async", "await", "typeof", "instanceof", "in", "of", "true", "false", "null", "undefined", "void", "yield", "static", "get", "set", "super", "with", "debugger", "delete", "constructor", "module", "require", "exports", "async", "then", "catch"],
  typescript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "try", "catch", "finally", "throw", "new", "this", "class", "extends", "import", "export", "default", "from", "async", "await", "typeof", "instanceof", "in", "of", "true", "false", "null", "undefined", "void", "yield", "static", "get", "set", "super", "interface", "type", "enum", "namespace", "module", "declare", "readonly", "private", "public", "protected", "abstract", "implements", "keyof", "infer", "never", "unknown", "any", "as", "is"],
  python: ["def", "class", "return", "if", "elif", "else", "for", "while", "break", "continue", "pass", "import", "from", "as", "try", "except", "finally", "raise", "with", "lambda", "yield", "global", "nonlocal", "assert", "del", "in", "not", "and", "or", "is", "None", "True", "False", "self", "async", "await", "print", "range", "len", "str", "int", "float", "list", "dict", "tuple", "set", "open", "super", "property", "staticmethod", "classmethod", "abstract", "pass"],
  java: ["public", "private", "protected", "class", "interface", "extends", "implements", "static", "final", "void", "int", "long", "double", "float", "boolean", "char", "byte", "short", "new", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "try", "catch", "finally", "throw", "throws", "import", "package", "this", "super", "null", "true", "false", "abstract", "synchronized", "volatile", "transient", "native", "instanceof", "enum", "assert", "var", "record", "sealed", "permits", "yield"],
  cpp: ["int", "long", "double", "float", "char", "bool", "void", "auto", "const", "static", "class", "struct", "enum", "union", "public", "private", "protected", "virtual", "override", "final", "new", "delete", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "try", "catch", "throw", "namespace", "using", "template", "typename", "sizeof", "typedef", "nullptr", "true", "false", "this", "include", "define", "ifdef", "endif", "pragma", "extern", "volatile", "register", "inline", "explicit", "friend", "operator", "const_cast", "static_cast", "dynamic_cast", "reinterpret_cast"],
  go: ["func", "var", "const", "type", "struct", "interface", "map", "chan", "return", "if", "else", "for", "range", "switch", "case", "default", "break", "continue", "fallthrough", "goto", "defer", "go", "select", "package", "import", "nil", "true", "false", "iota", "len", "cap", "append", "make", "new", "copy", "delete", "close", "panic", "recover", "print", "println", "error", "string", "int", "int8", "int16", "int32", "int64", "uint", "uint8", "uint16", "uint32", "uint64", "float32", "float64", "bool", "byte", "rune"],
  rust: ["fn", "let", "mut", "const", "static", "struct", "enum", "trait", "impl", "type", "where", "for", "loop", "while", "if", "else", "match", "return", "break", "continue", "use", "mod", "pub", "crate", "self", "super", "as", "in", "ref", "move", "async", "await", "unsafe", "extern", "dyn", "true", "false", "Some", "None", "Ok", "Err", "vec", "string", "str", "i8", "i16", "i32", "i64", "i128", "isize", "u8", "u16", "u32", "u64", "u128", "usize", "f32", "f64", "bool", "char", "Self"],
  html: ["html", "head", "body", "div", "span", "p", "a", "img", "script", "style", "link", "meta", "title", "header", "footer", "nav", "main", "section", "article", "aside", "ul", "ol", "li", "table", "tr", "td", "th", "thead", "tbody", "form", "input", "button", "textarea", "select", "option", "label", "h1", "h2", "h3", "h4", "h5", "h6", "br", "hr", "pre", "code", "iframe", "canvas", "svg", "path", "rect", "circle", "line", "polyline", "polygon", "text", "g", "defs", "use", "symbol", "clippath", "mask", "pattern", "linearGradient", "radialGradient", "stop", "animate", "animateTransform", "animateMotion", "feGaussianBlur", "feColorMatrix", "feBlend", "feMerge", "feOffset", "feFlood", "feComposite", "feFuncR", "feFuncG", "feFuncB", "feFuncA", "feMorphology", "feTurbulence", "feDisplacementMap", "feImage", "feDistantLight", "fePointLight", "feSpotLight"],
  css: ["@import", "@media", "@keyframes", "@font-face", "@charset", "@supports", "@namespace", "@page", "@viewport", "@counter-style", "@layer", "important", "inherit", "initial", "unset", "revert", "var", "calc", "url", "rgb", "rgba", "hsl", "hsla", "linear-gradient", "radial-gradient", "conic-gradient", "from", "to", "deg", "turn", "rad", "grad"],
  sql: ["SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "DROP", "ALTER", "ADD", "INDEX", "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "AND", "OR", "NOT", "NULL", "IS", "IN", "LIKE", "BETWEEN", "EXISTS", "HAVING", "GROUP", "BY", "ORDER", "ASC", "DESC", "LIMIT", "OFFSET", "UNION", "ALL", "DISTINCT", "AS", "CASE", "WHEN", "THEN", "ELSE", "END", "COUNT", "SUM", "AVG", "MIN", "MAX", "COALESCE", "CAST", "CONVERT", "VARCHAR", "INT", "INTEGER", "BIGINT", "DECIMAL", "FLOAT", "DOUBLE", "DATE", "DATETIME", "TIMESTAMP", "BOOLEAN", "TEXT", "BLOB", "CONSTRAINT", "DEFAULT", "AUTO_INCREMENT", "SERIAL", "CASCADE", "RESTRICT"],
  json: [],
  bash: ["if", "then", "else", "elif", "fi", "for", "while", "do", "done", "case", "esac", "in", "function", "return", "exit", "export", "local", "readonly", "declare", "typeset", "unset", "shift", "set", "source", "alias", "unalias", "echo", "printf", "read", "cd", "pwd", "ls", "cp", "mv", "rm", "mkdir", "rmdir", "touch", "cat", "grep", "sed", "awk", "find", "xargs", "sort", "uniq", "wc", "head", "tail", "cut", "tr", "tee", "test", "true", "false", "sleep", "wait", "kill", "ps", "jobs", "fg", "bg", "nohup", "exec", "eval", "trap", "getopts", "select"],
  yaml: ["true", "false", "null", "~"],
  graphql: ["query", "mutation", "subscription", "fragment", "on", "interface", "union", "enum", "input", "scalar", "type", "extend", "schema", "directive", "implements", "enum"],
};

const ESCAPE_HTML: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
};
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPE_HTML[c]);

function highlightLine(line: string, lang: string): string {
  const kw = KEYWORDS[lang] || [];
  const escaped = escapeHtml(line);

  // Comments
  if (/^\s*(\/\/|#|--|<!--|\/\*)/.test(escaped)) {
    return `<span class="hl-comment">${escaped}</span>`;
  }
  // Strings
  const stringRe = /(&#39;|&quot;|`)(?:(?!\1)[^\\]|\\.)*?\1/g;
  let result = escaped.replace(stringRe, (m) => `<span class="hl-string">${m}</span>`);
  // Numbers
  result = result.replace(/\b(\d[\d._]*[a-zA-Z]*|\d+)\b/g, (m) => `<span class="hl-number">${m}</span>`);
  // Keywords
  if (kw.length > 0) {
    const kwRe = new RegExp(`\\b(${kw.join("|")})\\b`, "g");
    result = result.replace(kwRe, (m) => `<span class="hl-keyword">${m}</span>`);
  }
  // HTML tags
  if (lang === "html") {
    result = result.replace(/(&lt;\/?[\w-]+)/g, (m) => `<span class="hl-tag">${m}</span>`);
    result = result.replace(/([\w-]+)(=)/g, (_, a, b) => `<span class="hl-attr">${a}</span>${b}`);
  }
  // CSS properties
  if (lang === "css") {
    result = result.replace(/([\w-]+)(:)/g, (_, a, b) => `<span class="hl-attr">${a}</span>${b}`);
  }
  // Decorators (@)
  result = result.replace(/@(\w+)/g, (_, m) => `<span class="hl-decorator">@${m}</span>`);
  // Function calls
  result = result.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, (_, m) => `<span class="hl-function">${m}</span>`);
  return result;
}

function getCurrentInstance() { return null; }
</script>

<style scoped>
.preview-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-primary);
  position: relative;
}

/* ─── Edit Mode ───────────────────────────────────────────────────── */
.edit-mode {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.edit-container {
  flex: 1;
  overflow: hidden;
  display: flex;
}

.edit-textarea {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  padding: 20px;
  font-family: "SF Mono", "Cascadia Code", "Fira Code", monospace;
  font-size: 13px;
  line-height: 1.7;
  background: var(--bg-primary);
  color: var(--text-primary);
  tab-size: 2;
}

/* ─── Image Edit Mode ────────────────────────────────────────────── */
.image-edit-mode {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.image-edit-canvas-area {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: repeating-conic-gradient(#e5e5e5 0% 25%, #fff 0% 50%) 50% / 20px 20px;
  position: relative;
  cursor: crosshair;
}

[data-theme="dark"] .image-edit-canvas-area {
  background: repeating-conic-gradient(#333 0% 25%, #1a1a1a 0% 50%) 50% / 20px 20px;
}

.edit-image-canvas {
  max-width: 100%;
  max-height: 100%;
  display: block;
}

.edit-image-canvas.cropping { cursor: crosshair; }

.crop-overlay {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.7);
  padding: 6px 16px;
  border-radius: 6px;
}

/* ─── Video Edit Mode ────────────────────────────────────────────── */
.video-edit-mode {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.video-edit-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  background: #000;
  overflow: auto;
}

.video-edit-info {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

/* ─── Audio Edit Mode ────────────────────────────────────────────── */
.audio-edit-mode {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.audio-edit-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px;
  background: var(--bg-secondary);
  overflow: auto;
}

/* ─── PDF Annotate Bar ───────────────────────────────────────────── */
.pdf-annotate-bar {
  width: 160px;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 8px;
}

.pdf-annotate-header {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.pdf-annotate-tools {
  display: flex;
  gap: 4px;
}

.annotate-tool {
  flex: 1;
  padding: 5px 4px;
  border: 1px solid var(--border);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}

.annotate-tool.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.pdf-annotate-colors {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.pdf-canvas.annotatable { cursor: crosshair; }

.preview-area.fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
}

/* ─── Loading / Error ─────────────────────────────────────────────── */
.preview-loading, .preview-error {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-muted);
}

.loading-spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.spin { animation: spin 1s linear infinite; }

/* ─── Toolbar ─────────────────────────────────────────────────────── */
.preview-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-spacer { flex: 1; }

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
  white-space: nowrap;
}

.toolbar-btn:hover:not(:disabled) {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbar-btn.active {
  background: var(--selected-bg);
  color: var(--primary);
}

.icon-btn-sm {
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: transparent;
  color: var(--text-muted); border-radius: 4px;
  cursor: pointer;
}

.icon-btn-sm:hover { background: var(--bg-tertiary); color: var(--text-primary); }

.zoom-label, .page-label, .lang-badge {
  font-size: 12px;
  color: var(--text-secondary);
  min-width: 40px;
  text-align: center;
  padding: 0 4px;
}

.lang-badge {
  background: var(--bg-tertiary);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  text-transform: capitalize;
}

.page-input {
  width: 50px;
  padding: 4px 6px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* ─── Image Preview ──────────────────────────────────────────────── */
.image-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.image-canvas {
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: repeating-conic-gradient(#e5e5e5 0% 25%, #fff 0% 50%) 50% / 20px 20px;
  user-select: none;
}

[data-theme="dark"] .image-canvas {
  background: repeating-conic-gradient(#333 0% 25%, #1a1a1a 0% 50%) 50% / 20px 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.05s;
  transform-origin: center center;
  will-change: transform;
  pointer-events: none;
}

.info-panel {
  position: absolute;
  right: 0;
  top: 48px;
  width: 220px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  z-index: 10;
  overflow: hidden;
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  font-weight: 600;
}

.info-row {
  display: flex;
  gap: 8px;
  padding: 7px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
}

.info-row:last-child { border-bottom: none; }

.info-label { color: var(--text-muted); min-width: 50px; }
.info-value { color: var(--text-primary); }

/* ─── PDF Preview ─────────────────────────────────────────────────── */
.pdf-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pdf-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.pdf-thumbnails {
  width: 120px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  flex-shrink: 0;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pdf-thumb {
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.15s;
  background: white;
}

[data-theme="dark"] .pdf-thumb { background: #1a1a1a; }

.pdf-thumb:hover { border-color: var(--border); }
.pdf-thumb.active { border-color: var(--primary); }

.pdf-thumb canvas { width: 100%; height: auto; display: block; }

.thumb-label {
  display: block;
  text-align: center;
  font-size: 11px;
  padding: 4px;
  color: var(--text-muted);
  background: var(--bg-tertiary);
}

.pdf-page-area {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  background: var(--bg-tertiary);
}

.pdf-page-container {
  box-shadow: var(--shadow-md);
  background: white;
}

[data-theme="dark"] .pdf-page-container { background: #1a1a1a; }

.pdf-canvas { display: block; max-width: 100%; }

.pdf-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: var(--text-muted);
}

/* ─── Video Preview ───────────────────────────────────────────────── */
.video-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #000;
}

.video-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  padding: 32px 12px 12px;
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.video-controls.visible { opacity: 1; }

.progress-area { width: 100%; }

.progress-bar, .audio-progress-bar {
  width: 100%;
  height: 4px;
  appearance: none;
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  accent-color: var(--primary);
}

.progress-bar:hover, .audio-progress-bar:hover { height: 6px; }

.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.controls-left, .controls-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ctrl-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 6px 8px;
  border: none;
  background: transparent;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.ctrl-btn:hover { background: rgba(255,255,255,0.1); }

.play-btn { background: rgba(255,255,255,0.2); }
.play-btn:hover { background: rgba(255,255,255,0.3); }

.time-display {
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  font-variant-numeric: tabular-nums;
  margin-left: 8px;
}

.volume-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.volume-bar {
  width: 70px;
  height: 3px;
  appearance: none;
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  accent-color: white;
}

.speed-menu-wrapper, .sub-menu-wrapper { position: relative; }

.speed-label { font-size: 11px; }

.speed-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  min-width: 100px;
  margin-bottom: 4px;
}

.speed-item {
  width: 100%;
  padding: 7px 12px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 12px;
  cursor: pointer;
  text-align: left;
}

.speed-item:hover { background: var(--hover-bg); }
.speed-item.active { color: var(--primary); background: var(--selected-bg); }

/* ─── Audio Preview ──────────────────────────────────────────────── */
.audio-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  overflow: hidden;
}

.audio-card {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 24px;
}

.audio-art {
  width: 160px; height: 160px;
  background: var(--bg-tertiary);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  box-shadow: var(--shadow-md);
}

.waveform-area {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
}

.waveform-canvas {
  width: 100%;
  height: 80px;
}

.audio-info {
  text-align: center;
}

.audio-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.audio-progress {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-label {
  font-size: 11px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  min-width: 36px;
}

.audio-progress-bar {
  flex: 1;
  height: 4px;
  appearance: none;
  background: var(--border);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  accent-color: var(--primary);
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.audio-play {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.audio-volume {
  width: 200px;
}

.lyrics-area {
  text-align: center;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 8px;
  width: 100%;
  max-height: 120px;
  overflow-y: auto;
}

.lyrics-text {
  font-size: 14px;
  color: var(--text-secondary);
}

/* ─── Code Preview ──────────────────────────────────────────────── */
.code-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.code-container {
  flex: 1;
  overflow: auto;
  background: var(--bg-primary);
}

.code-scroll {
  min-width: 100%;
}

.code-table {
  min-width: 100%;
  border-collapse: collapse;
  font-family: "SF Mono", "Cascadia Code", "Fira Code", "JetBrains Mono", "Menlo", "Monaco", monospace;
  font-size: 13px;
  line-height: 1.6;
}

.code-line {
  display: flex;
  align-items: flex-start;
  min-height: 1.6em;
  border-bottom: 1px solid transparent;
}

.code-line:hover { background: var(--hover-bg); }
.code-line.folded { display: none; }

.fold-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 3px;
}

.fold-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }
.fold-btn .rotated { transform: rotate(90deg); }

.fold-placeholder { width: 20px; flex-shrink: 0; }

.line-number {
  min-width: 48px;
  padding: 0 12px;
  text-align: right;
  color: var(--text-muted);
  font-size: 12px;
  user-select: none;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
}

.line-content {
  flex: 1;
  padding: 0 16px;
  white-space: pre;
  color: var(--text-primary);
}

/* Syntax highlight classes */
:global(.hl-keyword) { color: #c678dd; }
:global(.hl-string) { color: #98c379; }
:global(.hl-number) { color: #d19a66; }
:global(.hl-comment) { color: #5c6370; font-style: italic; }
:global(.hl-function) { color: #61afef; }
:global(.hl-tag) { color: #e06c75; }
:global(.hl-attr) { color: #d19a66; }
:global(.hl-decorator) { color: #c678dd; }

/* ─── Text Preview ──────────────────────────────────────────────── */
.text-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.text-container {
  flex: 1;
  overflow: auto;
  background: var(--bg-primary);
}

.text-content {
  margin: 0;
  padding: 20px;
  font-family: "SF Mono", "Cascadia Code", "Fira Code", monospace;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-all;
}

/* ─── Unsupported ──────────────────────────────────────────────── */
.preview-unsupported {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-muted);
}

.preview-unsupported-text {
  font-size: 16px;
  font-weight: 500;
}

.preview-unsupported-hint {
  font-size: 12px;
  color: var(--text-muted);
}

/* ─── Responsive ────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .info-panel { width: 180px; }
  .volume-bar { width: 50px; }
  .audio-card { padding: 16px; }
  .audio-art { width: 120px; height: 120px; }
}
</style>
