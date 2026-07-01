<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { createPinia } from "pinia";
import {
  XIcon,
  DownloadIcon,
  InfoIcon,
  TrashIcon,
  MaximizeIcon,
  MinimizeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  GridIcon,
  ListIcon,
  EyeIcon,
  UploadIcon,
  EditIcon,
  CopyIcon,
  ClipboardIcon,
  FolderPlusIcon,
  FolderIcon,
  FileTextIcon,
  SaveIcon,
  RefreshCwIcon,
  ChevronRightIcon,
  PanelRightOpenIcon,
  PanelRightCloseIcon,
  ExternalLinkIcon,
  PrinterIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  SearchIcon,
  FileIcon,
} from "lucide-vue-next";
import {
  archivePlugin,
  assetPlugin,
  audioPlugin,
  cadPlugin,
  drawingPlugin,
  emailPlugin,
  epubPlugin,
  imagePlugin,
  model3dPlugin,
  gisPlugin,
  officePlugin,
  ofdPlugin,
  pdfPlugin,
  textPlugin,
  videoPlugin,
  xpsPlugin,
} from "@open-file-viewer/core";
import { OpenFileViewer } from "@open-file-viewer/vue";
import type { PreviewTheme, PreviewPlugin } from "@open-file-viewer/core";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";
import { useFileStore } from "./stores/fileStore";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import StatusBar from "./components/StatusBar.vue";
import PreviewToolbar from "./components/PreviewToolbar.vue";
import FileConverter from "./components/FileConverter.vue";
import InlineEditor from "./components/InlineEditor.vue";
import type { TreeNode } from "./stores/fileStore";

// ─── Store ────────────────────────────────────────────────────────────────────

const store = useFileStore();

// ─── Plugins ─────────────────────────────────────────────────────────────────

const plugins: PreviewPlugin[] = [
  imagePlugin(),
  videoPlugin(),
  audioPlugin(),
  pdfPlugin({ workerSrc: pdfWorkerSrc }),
  epubPlugin(),
  xpsPlugin(),
  officePlugin(),
  ofdPlugin(),
  archivePlugin(),
  emailPlugin(),
  drawingPlugin(),
  cadPlugin(),
  model3dPlugin(),
  gisPlugin(),
  assetPlugin(),
  textPlugin(),
];

// ─── UI State ─────────────────────────────────────────────────────────────────

const isDragging = ref(false);
const showNewFolderModal = ref(false);
const newFolderName = ref("");
const showRenameModal = ref(false);
const renameName = ref("");
const renameTarget = ref<TreeNode | null>(null);
const showDetailModal = ref(false);
const detailTarget = ref<TreeNode | null>(null);
const showPreviewModal = ref(false);
const previewFile = ref<TreeNode | null>(null);
const isFullscreen = ref(false);
const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuTarget = ref<TreeNode | null>(null);

// ─── Preview State ──────────────────────────────────────────────────────────────

const previewScale = ref(1);
const previewRotation = ref(0);
const previewCurrentPage = ref(1);
const previewTotalPages = ref(0);
const showConverter = ref(false);

// ─── Edit Mode State ──────────────────────────────────────────────────────────
type ViewMode = "preview" | "edit";
const currentViewMode = ref<ViewMode>("preview");
const isFileModified = ref(false);

// ─── File inputs ──────────────────────────────────────────────────────────────

const fileInputRef = ref<HTMLInputElement | null>(null);
const folderInputRef = ref<HTMLInputElement | null>(null);

// ─── Computed preview ──────────────────────────────────────────────────────────

const previewNode = ref<TreeNode | null>(null);

// ─── Actions ──────────────────────────────────────────────────────────────────

const handleSelect = (node: TreeNode) => {
  if (node.type === "folder") {
    if (store.expandedFolders.has(node.id)) {
      store.expandedFolders.delete(node.id);
    } else {
      store.expandedFolders.add(node.id);
    }
    store.expandedFolders = new Set(store.expandedFolders);
    node.expanded = store.expandedFolders.has(node.id);
    store.currentPath = node.path;
  } else {
    store.selectedFile = node;
    store.addToRecent(node);
    previewNode.value = node;
    store.addToHistory(node.path);
  }
};

const handleContextMenu = (e: MouseEvent, node: TreeNode) => {
  e.preventDefault();
  contextMenuPosition.value = { x: e.clientX, y: e.clientY };
  contextMenuTarget.value = node;
  store.selectedFile = node;
  showContextMenu.value = true;
};

const closeContextMenu = () => {
  showContextMenu.value = false;
  contextMenuTarget.value = null;
};

const openFilePicker = () => fileInputRef.value?.click();
const openFolderPicker = () => folderInputRef.value?.click();

const handleFileInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files?.length) store.addFilesToTree(Array.from(input.files));
  input.value = "";
};

const handleFolderInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files?.length) store.addFilesToTree(Array.from(input.files));
  input.value = "";
};

// ─── Drag & Drop ───────────────────────────────────────────────────────────────

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
  if (e.dataTransfer?.files?.length) {
    store.addFilesToTree(Array.from(e.dataTransfer.files));
  }
};

// ─── New Folder ───────────────────────────────────────────────────────────────

const openNewFolderModal = () => {
  newFolderName.value = "";
  showNewFolderModal.value = true;
};

const createNewFolder = () => {
  if (!newFolderName.value.trim()) return;
  store.createFolder(newFolderName.value);
  showNewFolderModal.value = false;
};

// ─── Rename ───────────────────────────────────────────────────────────────────

const openRenameModal = (node?: TreeNode) => {
  const target = node || contextMenuTarget.value || store.selectedFile;
  if (!target) return;
  renameTarget.value = target;
  renameName.value = target.name;
  showRenameModal.value = true;
  closeContextMenu();
};

const executeRename = () => {
  if (!renameTarget.value || !renameName.value.trim()) return;
  store.renameNode(renameTarget.value, renameName.value);
  showRenameModal.value = false;
  renameTarget.value = null;
};

// ─── Delete ───────────────────────────────────────────────────────────────────

const deleteNode = (node?: TreeNode) => {
  const target = node || contextMenuTarget.value || store.selectedFile;
  if (!target) return;
  store.deleteNode(target);
  closeContextMenu();
  if (previewNode.value?.id === target.id) {
    previewNode.value = null;
    showPreviewModal.value = false;
  }
};

// ─── Download ─────────────────────────────────────────────────────────────────

const downloadFile = (node?: TreeNode) => {
  const target = node || store.selectedFile;
  if (!target?.file) return;
  const url = URL.createObjectURL(target.file);
  const a = document.createElement("a");
  a.href = url;
  a.download = target.name;
  a.click();
  URL.revokeObjectURL(url);
  closeContextMenu();
};

// ─── Clipboard ─────────────────────────────────────────────────────────────────

const copySelected = () => {
  const nodes = contextMenuTarget.value
    ? [contextMenuTarget.value]
    : store.selectedIds.size
    ? Array.from(store.selectedIds.values()).map((id) => store.findNodeById(id)).filter(Boolean) as TreeNode[]
    : store.selectedFile ? [store.selectedFile] : [];
  store.copyNodes(nodes);
  closeContextMenu();
};

const cutSelected = () => {
  const nodes = contextMenuTarget.value
    ? [contextMenuTarget.value]
    : store.selectedIds.size
    ? Array.from(store.selectedIds.values()).map((id) => store.findNodeById(id)).filter(Boolean) as TreeNode[]
    : store.selectedFile ? [store.selectedFile] : [];
  store.cutNodes(nodes);
  closeContextMenu();
};

// ─── Detail ───────────────────────────────────────────────────────────────────

const showDetail = (node?: TreeNode) => {
  const target = node || store.selectedFile;
  if (!target) return;
  detailTarget.value = target;
  showDetailModal.value = true;
  closeContextMenu();
};

// ─── Preview ──────────────────────────────────────────────────────────────────

const openFullscreenPreview = () => {
  if (!store.selectedFile) return;
  previewFile.value = store.selectedFile;
  showPreviewModal.value = true;
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
};

// ─── Navigation ───────────────────────────────────────────────────────────────

const goBack = () => {
  const path = store.goBack();
  if (path) store.currentPath = path;
};

const goForward = () => {
  const path = store.goForward();
  if (path) store.currentPath = path;
};

// ─── Preview Toolbar Handlers ─────────────────────────────────────────────────

const handleZoomIn = () => {
  previewScale.value = Math.min(previewScale.value + 0.1, 3);
};

const handleZoomOut = () => {
  previewScale.value = Math.max(previewScale.value - 0.1, 0.1);
};

const handleRotateCW = () => {
  previewRotation.value = (previewRotation.value + 90) % 360;
};

const handlePrevPage = () => {
  if (previewCurrentPage.value > 1) {
    previewCurrentPage.value--;
  }
};

const handleNextPage = () => {
  if (previewCurrentPage.value < previewTotalPages.value) {
    previewCurrentPage.value++;
  }
};

const handleEdit = () => {
  // Switch to edit mode if file is selected
  if (previewNode.value?.type === "file") {
    currentViewMode.value = "edit";
    isFileModified.value = false;
  }
};

// Handle file save from editor
const handleFileSave = (content: string) => {
  console.log("File saved:", previewNode.value?.name, "Content length:", content.length);
  isFileModified.value = false;
  // File is already updated in InlineEditor component
};

// Handle cancel/close editor
const handleEditorClose = () => {
  currentViewMode.value = "preview";
};

// Check if file is editable
const isFileEditable = computed(() => {
  if (!previewNode.value?.file) return false;
  const name = previewNode.value.name.toLowerCase();
  const editableExts = [
    ".txt", ".md", ".markdown", ".json", ".js", ".jsx", ".ts", ".tsx",
    ".css", ".scss", ".html", ".htm", ".xml", ".svg", ".yaml", ".yml",
    ".toml", ".ini", ".cfg", ".conf", ".env", ".sh", ".py", ".rb",
    ".java", ".kt", ".swift", ".c", ".cpp", ".go", ".rs", ".sql",
    ".log", ".gitignore", ".vue", ".svelte"
  ];
  return editableExts.some(ext => name.endsWith(ext));
});

const handleSaveAs = () => {
  // TODO: Implement save as functionality
  console.log("Save as:", previewNode.value?.name);
};

const handlePrint = () => {
  window.print();
};

const handleShare = () => {
  // TODO: Implement share functionality
  console.log("Share file:", previewNode.value?.name);
};

const handleDownload = () => {
  downloadFile();
};

const handleInfo = () => {
  showDetail();
};

const handleSettings = () => {
  // TODO: Implement settings panel
  console.log("Open settings");
};

const handleSearch = () => {
  const searchInput = document.querySelector(".search-input") as HTMLInputElement;
  if (searchInput) searchInput.focus();
};

const handleConvert = () => {
  showConverter.value = !showConverter.value;
};

// ─── Theme Cycle ──────────────────────────────────────────────────────

const themeCycle: PreviewTheme[] = ['light', 'dark', 'auto'];

const themeOptions = [
  { value: 'light' as PreviewTheme, label: '浅色', icon: SunIcon },
  { value: 'dark' as PreviewTheme, label: '深色', icon: MoonIcon },
  { value: 'auto' as PreviewTheme, label: '自动', icon: MonitorIcon },
];

const cycleTheme = () => {
  const currentIndex = themeCycle.indexOf(store.theme);
  const nextIndex = (currentIndex + 1) % themeCycle.length;
  store.theme = themeCycle[nextIndex];
  store.applyTheme();
};

const themeIcon = computed(() => {
  const option = themeOptions.find(t => t.value === store.theme);
  return option?.icon || SunIcon;
});

// ─── Status Bar Handlers ───────────────────────────────────────────────────────

const handleClearSelection = () => {
  store.clearSelection();
};

// ─── File Converter Handler ───────────────────────────────────────────────────

const handleFileConvert = (targetFormat: string) => {
  console.log("Convert to:", targetFormat);
  // TODO: Implement actual file conversion
  // This would typically involve:
  // 1. Reading the source file
  // 2. Converting to target format
  // 3. Triggering download of converted file
};

// ─── Computed Properties for StatusBar ────────────────────────────────────────

const totalFiles = computed(() => {
  let count = 0;
  const countFiles = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      if (node.type === "file") count++;
      if (node.children) countFiles(node.children);
    });
  };
  countFiles(store.fileTree);
  return count;
});

const totalFolders = computed(() => {
  let count = 0;
  const countFolders = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      if (node.type === "folder") count++;
      if (node.children) countFolders(node.children);
    });
  };
  countFolders(store.fileTree);
  return count;
});

const totalSize = computed(() => {
  let size = 0;
  const sumSizes = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      if (node.size) size += node.size;
      if (node.children) sumSizes(node.children);
    });
  };
  sumSizes(store.fileTree);
  return size;
});

// ─── Keyboard Shortcuts ───────────────────────────────────────────────────────

const handleKeydown = (e: KeyboardEvent) => {
  const ctrl = e.ctrlKey || e.metaKey;

  if (ctrl) {
    switch (e.key.toLowerCase()) {
      case "c": copySelected(); break;
      case "x": cutSelected(); break;
      case "v": store.pasteClipboard(); break;
      case "a": store.selectAll(); break;
      case "f":
        e.preventDefault();
        (document.querySelector(".search-input") as HTMLInputElement)?.focus();
        break;
      case "z":
        e.shiftKey ? goForward() : goBack();
        break;
    }
  }

  if (e.key === "Delete" && store.selectedFile) deleteNode();

  if (e.key === "F2" && store.selectedFile) openRenameModal();

  if (e.key === "Escape") {
    showPreviewModal.value = false;
    showRenameModal.value = false;
    showDetailModal.value = false;
    showNewFolderModal.value = false;
    closeContextMenu();
    store.clearSelection();
  }

  if (e.key === "Enter" && store.selectedFile) openFullscreenPreview();
  if (e.key === "ArrowLeft") goBack();
  if (e.key === "ArrowRight") goForward();
};

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  store.initDemo();
  store.applyTheme();
  window.addEventListener("keydown", handleKeydown);
  document.addEventListener("click", closeContextMenu);

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", () => {
    if (store.theme === "auto") store.applyTheme();
  });
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("click", closeContextMenu);
  store.revokeAllUrls();
});

// Watch preview node changes
watch(
  () => store.selectedFile,
  (node) => {
    previewNode.value = node;
    // Reset preview state when file changes
    previewScale.value = 1;
    previewRotation.value = 0;
    previewCurrentPage.value = 1;
    previewTotalPages.value = 0;
    // Always switch back to preview mode when file changes
    currentViewMode.value = "preview";
    isFileModified.value = false;
  }
);
</script>

<template>
  <div
    class="app-container"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Hidden inputs -->
    <input ref="fileInputRef" type="file" multiple style="display: none" @change="handleFileInput" />
    <input ref="folderInputRef" type="file" multiple webkitdirectory style="display: none" @change="handleFolderInput" />

    <!-- Header -->
    <Header @open-file-picker="openFilePicker" @toggle-converter="handleConvert" />

    <!-- Main Layout -->
    <main class="app-main">
      <!-- Sidebar -->
      <Sidebar
        @open-file-picker="openFilePicker"
        @select="handleSelect"
        @contextmenu="handleContextMenu"
        @new-folder="openNewFolderModal"
      />

      <!-- Content Area -->
      <section class="content-area">
        <!-- Preview Toolbar -->
        <PreviewToolbar
          :file="previewNode"
          :current-page="previewCurrentPage"
          :total-pages="previewTotalPages"
          :scale="previewScale"
          :rotation="previewRotation"
          :is-fullscreen="isFullscreen"
          @zoom-in="handleZoomIn"
          @zoom-out="handleZoomOut"
          @rotate-cw="handleRotateCW"
          @prev-page="handlePrevPage"
          @next-page="handleNextPage"
          @edit="handleEdit"
          @save-as="handleSaveAs"
          @print="handlePrint"
          @share="handleShare"
          @download="handleDownload"
          @fullscreen="toggleFullscreen"
          @info="handleInfo"
          @settings="handleSettings"
          @search="handleSearch"
        />

        <!-- Navigation & Breadcrumb Bar -->
        <div class="nav-breadcrumb-bar">
          <!-- Navigation -->
          <div class="nav-group">
            <button class="icon-btn" title="后退 (←)" :disabled="!store.canGoBack" @click="goBack">
              <ArrowLeftIcon :size="17" />
            </button>
            <button class="icon-btn" title="前进 (→)" :disabled="!store.canGoForward" @click="goForward">
              <ArrowRightIcon :size="17" />
            </button>
          </div>

          <!-- Breadcrumb -->
          <nav class="breadcrumb" aria-label="当前路径">
            <span class="breadcrumb-item" @click="store.currentPath = '/'">
              <HomeIcon :size="14" />
            </span>
            <template v-for="(part, i) in store.currentPath.split('/').filter(Boolean)" :key="i">
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-item">{{ part }}</span>
            </template>
            <span v-if="!store.currentPath || store.currentPath === '/'" class="breadcrumb-item current">全部文件</span>
          </nav>

          <!-- View mode toggle -->
          <div class="view-toggle" role="group" aria-label="视图切换">
            <button
              :class="['view-toggle-btn', { active: store.viewMode === 'grid' }]"
              title="网格视图"
              @click="store.viewMode = 'grid'"
            >
              <GridIcon :size="15" />
            </button>
            <button
              :class="['view-toggle-btn', { active: store.viewMode === 'list' }]"
              title="列表视图"
              @click="store.viewMode = 'list'"
            >
              <ListIcon :size="15" />
            </button>
          </div>
        </div>

        <!-- File info bar -->
        <div v-if="store.selectedFile" class="file-info-bar">
          <span class="file-info-name">{{ store.selectedFile.name }}</span>
          <span v-if="isFileModified" class="file-info-modified">●</span>
          <span class="file-info-sep">·</span>
          <span class="file-info-meta">{{ store.getMimeDescription(store.selectedFile.mimeType) }}</span>
          <span v-if="store.selectedFile.size" class="file-info-sep">·</span>
          <span v-if="store.selectedFile.size" class="file-info-meta">{{ store.formatFileSize(store.selectedFile.size) }}</span>
          <span v-if="store.selectedFile.modified" class="file-info-sep">·</span>
          <span v-if="store.selectedFile.modified" class="file-info-meta">{{ store.formatDate(store.selectedFile.modified) }}</span>
        </div>

        <!-- View Mode Tab Bar (only show for files) -->
        <div v-if="previewNode?.type === 'file' && previewNode.file" class="view-mode-tabs">
          <button
            :class="['view-tab', { active: currentViewMode === 'preview' }]"
            @click="currentViewMode = 'preview'"
          >
            <EyeIcon :size="15" />
            <span>预览</span>
          </button>
          <button
            :class="['view-tab', { active: currentViewMode === 'edit' }]"
            :disabled="!isFileEditable"
            :title="isFileEditable ? '编辑文件' : '此文件类型不支持编辑'"
            @click="handleEdit"
          >
            <EditIcon :size="15" />
            <span>编辑</span>
          </button>
        </div>

        <!-- Main Content with Converter Panel -->
        <div class="content-with-converter">
          <!-- Preview container -->
          <div class="viewer-container">
            <!-- Drop overlay -->
            <div v-if="isDragging" class="drop-overlay" aria-hidden="true">
              <div class="drop-box">
                <UploadIcon :size="44" />
                <h3>释放文件</h3>
                <p>将文件拖放到此处上传</p>
              </div>
            </div>

            <!-- Empty state -->
            <div v-if="!previewNode" class="viewer-empty">
              <EyeIcon :size="60" style="opacity: 0.2" />
              <p class="empty-text">选择文件预览</p>
              <p class="empty-hint">从左侧文件列表选择一个文件，或拖放文件到此处</p>
            </div>

            <!-- Inline Editor (编辑模式) -->
            <InlineEditor
              v-else-if="currentViewMode === 'edit' && previewNode.file"
              :file="previewNode"
              @save="handleFileSave"
              @cancel="handleEditorClose"
            />

            <!-- OpenFileViewer (预览模式) -->
            <OpenFileViewer
              v-else-if="previewNode.file && currentViewMode === 'preview'"
              :file="previewNode.file"
              :file-name="previewNode.name"
              :mime-type="previewNode.mimeType"
              :plugins="plugins"
              :theme="store.theme"
              height="100%"
              toolbar
            />

            <!-- Folder placeholder -->
            <div v-else-if="previewNode.type === 'folder'" class="folder-placeholder">
              <FolderIcon :size="60" style="opacity: 0.2" />
              <p class="empty-text">{{ previewNode.name }}</p>
              <p class="empty-hint">{{ previewNode.children?.length ?? 0 }} 个项目</p>
              <button
                class="btn btn-primary"
                @click="store.expandedFolders.add(previewNode.id); store.expandedFolders = new Set(store.expandedFolders)"
              >
                展开文件夹
              </button>
            </div>
          </div>

          <!-- File Converter Panel (collapsible) -->
          <FileConverter
            v-if="showConverter"
            :file="previewNode"
            @convert="handleFileConvert"
          />
        </div>

        <!-- Status Bar -->
        <StatusBar
          :file="previewNode"
          :total-files="totalFiles"
          :total-folders="totalFolders"
          :total-size="totalSize"
          :selected-count="store.selectedIds.size"
          @clear-selection="handleClearSelection"
        />
      </section>
    </main>

    <!-- Context Menu -->
    <div
      v-if="showContextMenu"
      class="context-menu"
      :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }"
      role="menu"
    >
      <button class="ctx-item" role="menuitem" @click="openRenameModal()">
        <EditIcon :size="14" />
        <span>重命名</span>
        <span class="ctx-shortcut">F2</span>
      </button>
      <button class="ctx-item" role="menuitem" @click="copySelected">
        <CopyIcon :size="14" />
        <span>复制</span>
        <span class="ctx-shortcut">Ctrl+C</span>
      </button>
      <button class="ctx-item" role="menuitem" @click="cutSelected">
        <ClipboardIcon :size="14" />
        <span>剪切</span>
        <span class="ctx-shortcut">Ctrl+X</span>
      </button>
      <button class="ctx-item" :disabled="!store.clipboardData.length" role="menuitem" @click="store.pasteClipboard()">
        <ClipboardIcon :size="14" />
        <span>粘贴</span>
        <span class="ctx-shortcut">Ctrl+V</span>
      </button>
      <div class="ctx-divider"></div>
      <button class="ctx-item" role="menuitem" @click="downloadFile()">
        <DownloadIcon :size="14" />
        <span>下载</span>
      </button>
      <button class="ctx-item" role="menuitem" @click="showDetail()">
        <InfoIcon :size="14" />
        <span>详情</span>
      </button>
      <div class="ctx-divider"></div>
      <button class="ctx-item danger" role="menuitem" @click="deleteNode()">
        <TrashIcon :size="14" />
        <span>删除</span>
        <span class="ctx-shortcut">Del</span>
      </button>
    </div>

    <!-- New Folder Modal -->
    <div v-if="showNewFolderModal" class="modal-overlay" @click.self="showNewFolderModal = false">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="newfolder-title">
        <div class="modal-header">
          <h3 id="newfolder-title" class="modal-title">新建文件夹</h3>
          <button class="modal-close" @click="showNewFolderModal = false" aria-label="关闭">
            <XIcon :size="18" />
          </button>
        </div>
        <div class="modal-body">
          <label class="form-label" for="folder-name">文件夹名称</label>
          <input
            id="folder-name"
            v-model="newFolderName"
            type="text"
            class="form-input"
            placeholder="请输入文件夹名称"
            @keyup.enter="createNewFolder"
          />
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showNewFolderModal = false">取消</button>
          <button class="btn btn-primary" @click="createNewFolder">创建</button>
        </div>
      </div>
    </div>

    <!-- Rename Modal -->
    <div v-if="showRenameModal" class="modal-overlay" @click.self="showRenameModal = false">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="rename-title">
        <div class="modal-header">
          <h3 id="rename-title" class="modal-title">重命名</h3>
          <button class="modal-close" @click="showRenameModal = false" aria-label="关闭">
            <XIcon :size="18" />
          </button>
        </div>
        <div class="modal-body">
          <label class="form-label" for="rename-input">新名称</label>
          <input
            id="rename-input"
            v-model="renameName"
            type="text"
            class="form-input"
            placeholder="请输入新名称"
            @keyup.enter="executeRename"
          />
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showRenameModal = false">取消</button>
          <button class="btn btn-primary" @click="executeRename">确定</button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal && detailTarget" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal modal-lg" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div class="modal-header">
          <h3 id="detail-title" class="modal-title">文件详情</h3>
          <button class="modal-close" @click="showDetailModal = false" aria-label="关闭">
            <XIcon :size="18" />
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-preview">
            <img
              v-if="detailTarget.previewUrl"
              :src="detailTarget.previewUrl"
              :alt="detailTarget.name"
              class="detail-image"
            />
            <div v-else class="detail-icon">
              <component :is="store.findNodeById(detailTarget.id) ? (store.findNodeById(detailTarget.id)!.type === 'folder' ? FolderIcon : EyeIcon) : EyeIcon" :size="52" />
            </div>
          </div>
          <div class="detail-grid">
            <div class="detail-row">
              <span class="detail-label">名称</span>
              <span class="detail-value">{{ detailTarget.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">类型</span>
              <span class="detail-value">
                {{ detailTarget.type === "folder" ? "文件夹" : store.getMimeDescription(detailTarget.mimeType) }}
              </span>
            </div>
            <div v-if="detailTarget.size" class="detail-row">
              <span class="detail-label">大小</span>
              <span class="detail-value">{{ store.formatFileSize(detailTarget.size) }}</span>
            </div>
            <div v-if="detailTarget.modified" class="detail-row">
              <span class="detail-label">修改时间</span>
              <span class="detail-value">{{ store.formatDate(detailTarget.modified) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">路径</span>
              <span class="detail-value path">{{ detailTarget.path }}</span>
            </div>
            <div v-if="detailTarget.mimeType" class="detail-row">
              <span class="detail-label">MIME</span>
              <span class="detail-value">{{ detailTarget.mimeType }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="openRenameModal(detailTarget)">
            <EditIcon :size="14" />
            重命名
          </button>
          <button
            v-if="detailTarget.file"
            class="btn btn-primary"
            @click="downloadFile(detailTarget)"
          >
            <DownloadIcon :size="14" />
            下载
          </button>
        </div>
      </div>
    </div>

    <!-- Fullscreen Preview -->
    <div
      v-if="showPreviewModal && previewFile"
      class="preview-overlay"
      @click="showPreviewModal = false"
    >
      <button class="preview-close" aria-label="关闭" @click="showPreviewModal = false">
        <XIcon :size="22" />
      </button>
      <button
        class="preview-fullscreen"
        aria-label="全屏"
        @click.stop="toggleFullscreen"
      >
        <MaximizeIcon v-if="!isFullscreen" :size="18" />
        <MinimizeIcon v-else :size="18" />
      </button>
      <div class="preview-content" @click.stop>
        <OpenFileViewer
          v-if="previewFile.file"
          :file="previewFile.file"
          :file-name="previewFile.name"
          :mime-type="previewFile.mimeType"
          :plugins="plugins"
          :theme="store.theme"
          height="100%"
          toolbar
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Main */
.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Content Area */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-primary);
}

/* Toolbar */
.content-toolbar {
  height: 44px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.nav-group {
  display: flex;
  gap: 2px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-secondary);
  flex: 1;
  overflow: hidden;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.breadcrumb-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.breadcrumb-item.current {
  color: var(--text-primary);
  font-weight: 500;
  cursor: default;
}

.breadcrumb-sep {
  color: var(--text-muted);
}

.viewer-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.view-toggle {
  display: flex;
  background: var(--bg-primary);
  border-radius: 6px;
  padding: 2px;
  border: 1px solid var(--border);
  margin-left: 6px;
}

.view-toggle-btn {
  padding: 4px 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: background 0.15s, color 0.15s;
}

.view-toggle-btn:hover { color: var(--text-primary); }
.view-toggle-btn.active { background: var(--primary); color: white; }

/* File info bar */
.file-info-bar {
  padding: 5px 12px;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  flex-shrink: 0;
}

.file-info-name {
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.file-info-modified {
  color: var(--color-warning);
  font-size: 10px;
}

.file-info-sep { color: var(--text-muted); }
.file-info-meta { color: var(--text-muted); }

/* View Mode Tabs */
.view-mode-tabs {
  display: flex;
  padding: 6px 12px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  gap: 4px;
  flex-shrink: 0;
}

.view-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.view-tab:hover:not(:disabled) {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.view-tab.active {
  background: var(--primary);
  color: white;
}

.view-tab:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Viewer container */
.viewer-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.viewer-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-muted);
}

.empty-text { font-size: 16px; }
.empty-hint { font-size: 13px; }

.folder-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-muted);
}

/* Drop overlay */
.drop-overlay {
  position: absolute;
  inset: 0;
  background: rgba(59, 130, 246, 0.08);
  border: 3px dashed var(--primary);
  border-radius: 12px;
  margin: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  pointer-events: none;
}

.drop-box {
  background: var(--bg-primary);
  padding: 28px 44px;
  border-radius: var(--radius);
  text-align: center;
  box-shadow: var(--shadow);
}

.drop-box svg { color: var(--primary); margin-bottom: 10px; }
.drop-box h3 { font-size: 17px; margin-bottom: 6px; }
.drop-box p { color: var(--text-secondary); }

/* Icon button */
.icon-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.icon-btn:hover:not(:disabled) {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: none;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover { background: var(--primary-hover); }
.btn-secondary { background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border); }
.btn-secondary:hover { background: var(--bg-tertiary); }

/* Context menu */
.context-menu {
  position: fixed;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  min-width: 175px;
  z-index: 1000;
  padding: 4px;
}

.ctx-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 4px;
}

.ctx-item:hover:not(:disabled) { background: var(--hover-bg); }
.ctx-item:disabled { opacity: 0.45; cursor: not-allowed; }
.ctx-item.danger { color: var(--danger); }
.ctx-item.danger:hover { background: rgba(239, 68, 68, 0.08); }

.ctx-shortcut {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-muted);
}

.ctx-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--bg-primary);
  border-radius: var(--radius);
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.modal-lg { max-width: 560px; }

.modal-header {
  padding: 13px 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title { font-weight: 600; font-size: 15px; }

.modal-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s;
}

.modal-close:hover { background: var(--bg-tertiary); color: var(--text-primary); }

.modal-body { padding: 16px; }

.modal-footer {
  padding: 11px 16px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Detail */
.detail-preview {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  margin-bottom: 14px;
  overflow: hidden;
}

.detail-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.detail-icon { color: var(--text-muted); }

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row {
  display: flex;
  gap: 12px;
}

.detail-label {
  width: 80px;
  flex-shrink: 0;
  font-size: 12px;
  color: var(--text-muted);
}

.detail-value {
  flex: 1;
  font-size: 13px;
  color: var(--text-primary);
  word-break: break-all;
}

.detail-value.path {
  font-family: monospace;
  font-size: 11px;
  color: var(--text-secondary);
}

/* Form */
.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--text-secondary);
}

.form-input {
  width: 100%;
  padding: 9px 11px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 14px;
  transition: border-color 0.15s;
  background: var(--bg-primary);
  color: var(--text-primary);
  outline: none;
}

.form-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Preview overlay */
.preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2001;
  transition: background 0.15s;
}

.preview-close:hover { background: rgba(255, 255, 255, 0.2); }

.preview-fullscreen {
  position: absolute;
  top: 14px;
  right: 64px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2001;
  transition: background 0.15s;
}

.preview-fullscreen:hover { background: rgba(255, 255, 255, 0.2); }

.preview-content {
  width: 90%;
  height: 90%;
}

/* Navigation & Breadcrumb Bar */
.nav-breadcrumb-bar {
  height: 40px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  background: var(--bg-secondary);
  flex-shrink: 0;
}

/* Content with Converter Panel */
.content-with-converter {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.content-with-converter > .viewer-container {
  flex: 1;
  overflow: hidden;
}

.content-with-converter > .converter-panel {
  width: 320px;
  flex-shrink: 0;
  border-left: 1px solid var(--border);
  overflow-y: auto;
}
</style>
