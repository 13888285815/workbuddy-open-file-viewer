import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { PreviewTheme } from "@open-file-viewer/core";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  mimeType?: string;
  size?: number;
  modified?: Date;
  children?: TreeNode[];
  file?: File;
  expanded?: boolean;
  path: string;
  previewUrl?: string;
}

export type FilterType = "all" | "image" | "document" | "video" | "audio" | "archive";
export type ViewMode = "grid" | "list";
export type SortField = "name" | "size" | "modified";
export type SortOrder = "asc" | "desc";
export type ClipboardAction = "copy" | "cut" | null;

export interface RecentItem {
  path: string;
  name: string;
  type: "folder" | "file";
  mimeType?: string;
  timestamp: number;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useFileStore = defineStore("file", () => {
  // ── Core data ──
  const fileTree = ref<TreeNode[]>([]);

  // ── Selection ──
  const selectedFile = ref<TreeNode | null>(null);
  const selectedIds = ref<Set<string>>(new Set());
  const lastSelectedId = ref<string | null>(null);

  // ── Navigation ──
  const currentPath = ref("/");
  const historyStack = ref<string[]>(["/"]);
  const historyIndex = ref(0);
  const expandedFolders = ref<Set<string>>(new Set());

  // ── Clipboard ──
  const clipboardAction = ref<ClipboardAction>(null);
  const clipboardData = ref<TreeNode[]>([]);

  // ── Filters / Search / Sort ──
  const searchQuery = ref("");
  const activeFilter = ref<FilterType>("all");
  const sortField = ref<SortField>("name");
  const sortOrder = ref<SortOrder>("asc");
  const viewMode = ref<ViewMode>("grid");

  // ── Theme ──
  const theme = ref<PreviewTheme>("light");

  // ── Favorites ──
  const favorites = ref<string[]>([]); // array of node IDs

  // ── Recent ──
  const recentItems = ref<RecentItem[]>([]);
  const MAX_RECENT = 20;

  // ─────────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────────

  const generateId = (prefix = "node") =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

  const generatePreviewUrl = (file: File): string => {
    if (file.type.startsWith("image/")) return URL.createObjectURL(file);
    return "";
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "-";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
  };

  const formatDate = (date?: Date): string => {
    if (!date) return "-";
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMimeDescription = (mime?: string): string => {
    if (!mime) return "-";
    const descs: Record<string, string> = {
      "image/jpeg": "JPEG 图片",
      "image/png": "PNG 图片",
      "image/gif": "GIF 图片",
      "image/webp": "WebP 图片",
      "image/svg+xml": "SVG 图片",
      "video/mp4": "MP4 视频",
      "video/webm": "WebM 视频",
      "audio/mpeg": "MP3 音频",
      "audio/wav": "WAV 音频",
      "application/pdf": "PDF 文档",
      "text/plain": "文本文件",
      "application/json": "JSON 文件",
      "application/zip": "ZIP 压缩包",
      "application/x-rar-compressed": "RAR 压缩包",
    };
    return descs[mime] || mime;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Tree traversal helpers
  // ─────────────────────────────────────────────────────────────────────────

  const findNodeById = (id: string, nodes?: TreeNode[]): TreeNode | null => {
    const list = nodes ?? fileTree.value;
    for (const node of list) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(id, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const findFolderAtPath = (path: string, nodes?: TreeNode[]): TreeNode | null => {
    if (path === "/" || path === "") {
      return { id: "root", name: "root", type: "folder", children: fileTree.value, path: "/" } as TreeNode;
    }
    const list = nodes ?? fileTree.value;
    for (const node of list) {
      if (node.path === path && node.type === "folder") return node;
      if (node.children) {
        const found = findFolderAtPath(path, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Filtering & sorting
  // ─────────────────────────────────────────────────────────────────────────

  const filterNode = (node: TreeNode): boolean => {
    if (
      searchQuery.value &&
      !node.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    ) {
      if (node.type === "folder") return hasMatchingChild(node);
      return false;
    }
    if (activeFilter.value === "all") return true;
    if (node.type === "folder") return hasMatchingChild(node, activeFilter.value);
    const mime = node.mimeType || "";
    switch (activeFilter.value) {
      case "image": return mime.startsWith("image/");
      case "document": return mime.includes("document") || mime.includes("pdf") || mime.includes("text") || mime.includes("word") || mime.includes("sheet") || mime.includes("presentation");
      case "video": return mime.startsWith("video/");
      case "audio": return mime.startsWith("audio/");
      case "archive": return mime.includes("archive") || mime.includes("zip") || mime.includes("rar");
      default: return true;
    }
  };

  const hasMatchingChild = (node: TreeNode, filter?: FilterType): boolean => {
    if (!node.children) return false;
    return node.children.some((c) => filterNode(c) || hasMatchingChild(c, filter));
  };

  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    const sorted = [...nodes].sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      let cmp = 0;
      switch (sortField.value) {
        case "name": cmp = a.name.localeCompare(b.name, "zh-CN"); break;
        case "size": cmp = (a.size || 0) - (b.size || 0); break;
        case "modified": cmp = (a.modified?.getTime() || 0) - (b.modified?.getTime() || 0); break;
      }
      return sortOrder.value === "asc" ? cmp : -cmp;
    });
    for (const n of sorted) {
      if (n.children) n.children = sortNodes(n.children);
    }
    return sorted;
  };

  const filteredTree = computed(() => {
    const walk = (nodes: TreeNode[]): TreeNode[] =>
      nodes.filter(filterNode).map((n) => ({ ...n, children: n.children ? walk(n.children) : undefined }));
    return sortNodes(walk(fileTree.value));
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Navigation
  // ─────────────────────────────────────────────────────────────────────────

  const addToHistory = (path: string) => {
    if (historyStack.value[historyIndex.value] !== path) {
      historyStack.value = historyStack.value.slice(0, historyIndex.value + 1);
      historyStack.value.push(path);
      historyIndex.value = historyStack.value.length - 1;
    }
  };

  const goBack = () => {
    if (historyIndex.value > 0) {
      historyIndex.value--;
      return historyStack.value[historyIndex.value];
    }
    return null;
  };

  const goForward = () => {
    if (historyIndex.value < historyStack.value.length - 1) {
      historyIndex.value++;
      return historyStack.value[historyIndex.value];
    }
    return null;
  };

  const canGoBack = computed(() => historyIndex.value > 0);
  const canGoForward = computed(() => historyIndex.value < historyStack.value.length - 1);

  // ─────────────────────────────────────────────────────────────────────────
  // Recent items
  // ─────────────────────────────────────────────────────────────────────────

  const addToRecent = (node: TreeNode) => {
    const existing = recentItems.value.findIndex((r) => r.path === node.path);
    if (existing >= 0) recentItems.value.splice(existing, 1);
    recentItems.value.unshift({
      path: node.path,
      name: node.name,
      type: node.type,
      mimeType: node.mimeType,
      timestamp: Date.now(),
    });
    if (recentItems.value.length > MAX_RECENT) {
      recentItems.value = recentItems.value.slice(0, MAX_RECENT);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Favorites
  // ─────────────────────────────────────────────────────────────────────────

  const toggleFavorite = (nodeId: string) => {
    const idx = favorites.value.indexOf(nodeId);
    if (idx >= 0) favorites.value.splice(idx, 1);
    else favorites.value.push(nodeId);
  };

  const isFavorite = (nodeId: string) => favorites.value.includes(nodeId);
  const isFavorited = (nodeId: string) => favorites.value.includes(nodeId);

  const clearFavorites = () => {
    favorites.value = [];
  };

  const clearRecent = () => {
    recentItems.value = [];
  };

  const favoriteNodes = computed(() =>
    favorites.value.map((id) => findNodeById(id)).filter(Boolean) as TreeNode[]
  );

  // Flattened files and folders for sidebar list
  const allNodes = computed(() => flattenTree(fileTree.value));

  const files = computed(() =>
    allNodes.value.filter(n => n.type === 'file')
  );

  const folders = computed(() =>
    allNodes.value.filter(n => n.type === 'folder')
  );

  // Download file
  const downloadFile = (node: TreeNode) => {
    if (node.file) {
      const url = URL.createObjectURL(node.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = node.name;
      a.click();
      URL.revokeObjectURL(url);
    } else if (node.previewUrl) {
      const a = document.createElement('a');
      a.href = node.previewUrl;
      a.download = node.name;
      a.click();
    }
  };

  // Upload file (accepts FileItem-like object)
  const uploadFile = (fileData: { name: string; type: string; size: number; data: string }) => {
    const file = new File([dataURLtoBlob(fileData.data)], fileData.name, { type: fileData.type });
    addFilesToTree([file]);
  };

  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  // Delete file by path
  const deleteFile = (path: string) => {
    const node = allNodes.value.find(n => n.path === path);
    if (node) deleteNode(node);
  };

  // Rename file by path
  const renameFile = (path: string, newName: string) => {
    const node = allNodes.value.find(n => n.path === path);
    if (node) renameNode(node, newName);
  };

  // Set current file
  const setCurrentFile = (node: TreeNode | null) => {
    selectedFile.value = node;
  };

  // Open file (preview)
  const openFile = (node: TreeNode) => {
    setCurrentFile(node);
    addToRecent(node);
    if (node.file && node.type === 'file') {
      selectedFile.value = node;
    }
  };

  // Load files (refresh)
  const loadFiles = () => {
    // Just trigger a re-render
    fileTree.value = [...fileTree.value];
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Selection
  // ─────────────────────────────────────────────────────────────────────────

  const toggleSelection = (node: TreeNode, e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (selectedIds.value.has(node.id)) selectedIds.value.delete(node.id);
      else selectedIds.value.add(node.id);
      selectedIds.value = new Set(selectedIds.value);
    } else if (e.shiftKey && lastSelectedId.value) {
      // Range select
      const flat = flattenTree(filteredTree.value);
      const from = flat.findIndex((n) => n.id === lastSelectedId.value);
      const to = flat.findIndex((n) => n.id === node.id);
      if (from !== -1 && to !== -1) {
        const [start, end] = from < to ? [from, to] : [to, from];
        for (let i = start; i <= end; i++) selectedIds.value.add(flat[i].id);
        selectedIds.value = new Set(selectedIds.value);
      }
    } else {
      selectedIds.value.clear();
      selectedIds.value.add(node.id);
      selectedIds.value = new Set(selectedIds.value);
    }
    lastSelectedId.value = node.id;
  };

  const clearSelection = () => {
    selectedIds.value.clear();
    selectedIds.value = new Set(selectedIds.value);
  };

  const flattenTree = (nodes: TreeNode[]): TreeNode[] => {
    const result: TreeNode[] = [];
    for (const n of nodes) {
      result.push(n);
      if (n.children) result.push(...flattenTree(n.children));
    }
    return result;
  };

  const selectAll = () => {
    for (const n of flattenTree(filteredTree.value)) selectedIds.value.add(n.id);
    selectedIds.value = new Set(selectedIds.value);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // File operations
  // ─────────────────────────────────────────────────────────────────────────

  const addFilesToTree = (files: File[]) => {
    for (const file of files) {
      const pathParts = file.webkitRelativePath
        ? file.webkitRelativePath.split("/")
        : [file.name];
      const fileName = pathParts[pathParts.length - 1];

      let level = fileTree.value;
      let curPath = "";

      for (let i = 0; i < pathParts.length - 1; i++) {
        curPath += "/" + pathParts[i];
        let folder = level.find((n) => n.type === "folder" && n.name === pathParts[i]);
        if (!folder) {
          folder = {
            id: generateId("folder"),
            name: pathParts[i],
            type: "folder",
            children: [],
            path: curPath,
          };
          level.push(folder);
        }
        level = folder.children!;
      }

      const existingIdx = level.findIndex((n) => n.name === fileName);
      const fileNode: TreeNode = {
        id: generateId("file"),
        name: fileName,
        type: "file",
        mimeType: file.type,
        size: file.size,
        modified: new Date(file.lastModified),
        file,
        path: curPath + "/" + fileName,
        previewUrl: generatePreviewUrl(file),
      };

      if (existingIdx >= 0) level[existingIdx] = fileNode;
      else level.push(fileNode);
    }
    sortNodes(fileTree.value);
  };

  const deleteNode = (node: TreeNode) => {
    const remove = (nodes: TreeNode[]): boolean => {
      const idx = nodes.findIndex((n) => n.id === node.id);
      if (idx >= 0) {
        if (nodes[idx].previewUrl) URL.revokeObjectURL(nodes[idx].previewUrl!);
        nodes.splice(idx, 1);
        if (selectedFile.value?.id === node.id) selectedFile.value = null;
        return true;
      }
      for (const n of nodes) {
        if (n.children && remove(n.children)) return true;
      }
      return false;
    };
    remove(fileTree.value);
  };

  const deleteSelected = () => {
    for (const id of selectedIds.value) {
      const node = findNodeById(id);
      if (node) deleteNode(node);
    }
    clearSelection();
  };

  const renameNode = (node: TreeNode, newName: string) => {
    const oldPath = node.path;
    node.name = newName.trim();
    node.path = oldPath.replace(/\/[^/]+$/, "/" + newName.trim());

    const updateChildren = (children: TreeNode[], oldP: string, newP: string) => {
      for (const c of children) {
        c.path = c.path.replace(oldP, newP);
        if (c.children) updateChildren(c.children, oldP, newP);
      }
    };
    if (node.children) updateChildren(node.children, oldPath, node.path);
  };

  const createFolder = (name: string) => {
    const folder: TreeNode = {
      id: generateId("folder"),
      name: name.trim(),
      type: "folder",
      children: [],
      path: currentPath.value + "/" + name.trim(),
    };
    const target = findFolderAtPath(currentPath.value);
    if (target?.children) target.children.push(folder);
    else fileTree.value.push(folder);
    sortNodes(fileTree.value);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Clipboard
  // ─────────────────────────────────────────────────────────────────────────

  const copyNodes = (nodes: TreeNode[]) => {
    clipboardAction.value = "copy";
    clipboardData.value = nodes;
  };

  const cutNodes = (nodes: TreeNode[]) => {
    clipboardAction.value = "cut";
    clipboardData.value = nodes;
  };

  const pasteClipboard = () => {
    if (!clipboardData.value.length) return;

    for (const item of clipboardData.value) {
      if (clipboardAction.value === "cut") {
        const removeFromTree = (nodes: TreeNode[]): boolean => {
          const idx = nodes.findIndex((n) => n.id === item.id);
          if (idx >= 0) { nodes.splice(idx, 1); return true; }
          for (const n of nodes) {
            if (n.children && removeFromTree(n.children)) return true;
          }
          return false;
        };
        removeFromTree(fileTree.value);
      }

      const newNode: TreeNode = {
        ...item,
        id: generateId(item.type),
        path: currentPath.value + "/" + item.name,
      };
      if (item.type === "folder" && item.children) {
        newNode.children = JSON.parse(JSON.stringify(item.children));
        const updatePaths = (nodes: TreeNode[], parentPath: string) => {
          for (const n of nodes) {
            n.path = parentPath + "/" + n.name;
            if (n.children) updatePaths(n.children, n.path);
          }
        };
        updatePaths(newNode.children, newNode.path);
      }

      const target = findFolderAtPath(currentPath.value);
      if (target?.children) target.children.push(newNode);
      else fileTree.value.push(newNode);
    }

    if (clipboardAction.value === "cut") {
      clipboardData.value = [];
      clipboardAction.value = null;
    }
    sortNodes(fileTree.value);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Sort
  // ─────────────────────────────────────────────────────────────────────────

  const toggleSort = (field: SortField) => {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
      sortField.value = field;
      sortOrder.value = "asc";
    }
    sortNodes(fileTree.value);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Theme
  // ─────────────────────────────────────────────────────────────────────────

  const applyTheme = () => {
    const root = document.documentElement;
    if (theme.value === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      root.setAttribute("data-theme", theme.value);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Demo init
  // ─────────────────────────────────────────────────────────────────────────

    const initDemo = () => {
    const demoFolder: TreeNode = {
      id: "folder-demo",
      name: "示例文件夹",
      type: "folder",
      expanded: true,
      path: "/示例文件夹",
      children: [
        // 图片素材
        {
          id: "folder-images",
          name: "📷 图片素材",
          type: "folder",
          path: "/示例文件夹/图片素材",
          children: [
            { id: "file-jpg", name: "photo.jpg", type: "file", mimeType: "image/jpeg", size: 256000, modified: new Date("2024-01-15"), path: "/示例文件夹/图片素材/photo.jpg" },
            { id: "file-png", name: "logo.png", type: "file", mimeType: "image/png", size: 128000, modified: new Date("2024-01-16"), path: "/示例文件夹/图片素材/logo.png" },
            { id: "file-gif", name: "animation.gif", type: "file", mimeType: "image/gif", size: 512000, modified: new Date("2024-01-17"), path: "/示例文件夹/图片素材/animation.gif" },
            { id: "file-webp", name: "photo.webp", type: "file", mimeType: "image/webp", size: 89000, modified: new Date("2024-01-18"), path: "/示例文件夹/图片素材/photo.webp" },
          ],
        },
        // 视频文件
        {
          id: "folder-videos",
          name: "🎬 视频文件",
          type: "folder",
          path: "/示例文件夹/视频文件",
          children: [
            { id: "file-mp4", name: "demo.mp4", type: "file", mimeType: "video/mp4", size: 15728640, modified: new Date("2024-02-01"), path: "/示例文件夹/视频文件/demo.mp4" },
            { id: "file-webm", name: "presentation.webm", type: "file", mimeType: "video/webm", size: 8388608, modified: new Date("2024-02-02"), path: "/示例文件夹/视频文件/presentation.webm" },
          ],
        },
        // 音频文件
        {
          id: "folder-audio",
          name: "🎵 音频文件",
          type: "folder",
          path: "/示例文件夹/音频文件",
          children: [
            { id: "file-mp3", name: "music.mp3", type: "file", mimeType: "audio/mpeg", size: 3145728, modified: new Date("2024-02-10"), path: "/示例文件夹/音频文件/music.mp3" },
            { id: "file-wav", name: "recording.wav", type: "file", mimeType: "audio/wav", size: 10485760, modified: new Date("2024-02-11"), path: "/示例文件夹/音频文件/recording.wav" },
          ],
        },
        // Office 文档
        {
          id: "folder-office",
          name: "📄 Office 文档",
          type: "folder",
          path: "/示例文件夹/Office 文档",
          children: [
            { id: "file-docx", name: "报告.docx", type: "file", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 256000, modified: new Date("2024-03-01"), path: "/示例文件夹/Office 文档/报告.docx" },
            { id: "file-xlsx", name: "数据表.xlsx", type: "file", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", size: 512000, modified: new Date("2024-03-02"), path: "/示例文件夹/Office 文档/数据表.xlsx" },
            { id: "file-pptx", name: "演示文稿.pptx", type: "file", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", size: 2048000, modified: new Date("2024-03-03"), path: "/示例文件夹/Office 文档/演示文稿.pptx" },
          ],
        },
        // PDF 文档
        {
          id: "folder-pdf",
          name: "📕 PDF 文档",
          type: "folder",
          path: "/示例文件夹/PDF 文档",
          children: [
            { id: "file-pdf1", name: "用户手册.pdf", type: "file", mimeType: "application/pdf", size: 5120000, modified: new Date("2024-03-05"), path: "/示例文件夹/PDF 文档/用户手册.pdf" },
          ],
        },
        // 电子书
        {
          id: "folder-ebooks",
          name: "📚 电子书",
          type: "folder",
          path: "/示例文件夹/电子书",
          children: [
            { id: "file-epub", name: "novel.epub", type: "file", mimeType: "application/epub+zip", size: 2097152, modified: new Date("2024-03-15"), path: "/示例文件夹/电子书/novel.epub" },
          ],
        },
        // 压缩包
        {
          id: "folder-archives",
          name: "📦 压缩包",
          type: "folder",
          path: "/示例文件夹/压缩包",
          children: [
            { id: "file-zip", name: "source.zip", type: "file", mimeType: "application/zip", size: 1572864, modified: new Date("2024-03-20"), path: "/示例文件夹/压缩包/source.zip" },
            { id: "file-rar", name: "backup.rar", type: "file", mimeType: "application/x-rar-compressed", size: 3145728, modified: new Date("2024-03-21"), path: "/示例文件夹/压缩包/backup.rar" },
          ],
        },
        // 代码文件
        {
          id: "folder-code",
          name: "💻 代码文件",
          type: "folder",
          path: "/示例文件夹/代码文件",
          children: [
            { id: "file-js", name: "app.js", type: "file", mimeType: "application/javascript", size: 8192, modified: new Date("2024-04-01"), file: new File(['console.log("Hello World!");'], "app.js", { type: "application/javascript" }), path: "/示例文件夹/代码文件/app.js" },
            { id: "file-py", name: "script.py", type: "file", mimeType: "text/x-python", size: 4096, modified: new Date("2024-04-02"), file: new File(['print("Hello World!")'], "script.py", { type: "text/x-python" }), path: "/示例文件夹/代码文件/script.py" },
            { id: "file-html", name: "index.html", type: "file", mimeType: "text/html", size: 2048, modified: new Date("2024-04-03"), file: new File(['<h1>Hello World!</h1>'], "index.html", { type: "text/html" }), path: "/示例文件夹/代码文件/index.html" },
            { id: "file-json", name: "config.json", type: "file", mimeType: "application/json", size: 1024, modified: new Date("2024-04-05"), file: new File([JSON.stringify({port: 3000})], "config.json", { type: "application/json" }), path: "/示例文件夹/代码文件/config.json" },
          ],
        },
        // 3D 模型
        {
          id: "folder-3d",
          name: "🎲 3D 模型",
          type: "folder",
          path: "/示例文件夹/3D 模型",
          children: [
            { id: "file-gltf", name: "model.gltf", type: "file", mimeType: "model/gltf+json", size: 524288, modified: new Date("2024-04-10"), path: "/示例文件夹/3D 模型/model.gltf" },
          ],
        },
        // CAD 图纸
        {
          id: "folder-cad",
          name: "📐 CAD 图纸",
          type: "folder",
          path: "/示例文件夹/CAD 图纸",
          children: [
            { id: "file-dwg", name: "drawing.dwg", type: "file", mimeType: "application/acad", size: 2097152, modified: new Date("2024-04-15"), path: "/示例文件夹/CAD 图纸/drawing.dwg" },
          ],
        },
        // 欢迎文件
        {
          id: "file-welcome",
          name: "欢迎.txt",
          type: "file",
          mimeType: "text/plain",
          size: 1024,
          modified: new Date(),
          file: new File(["欢迎使用 Open File Viewer！\n支持 50+ 种文件格式预览。"], "欢迎.txt", { type: "text/plain" }),
          path: "/示例文件夹/欢迎.txt",
        },
      ],
    };
    fileTree.value.push(demoFolder);
  };;

  // ─────────────────────────────────────────────────────────────────────────
  // Cleanup
  // ─────────────────────────────────────────────────────────────────────────

  const revokeAllUrls = () => {
    const revoke = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        if (n.previewUrl) URL.revokeObjectURL(n.previewUrl);
        if (n.children) revoke(n.children);
      }
    };
    revoke(fileTree.value);
  };

  return {
    // State
    fileTree,
    selectedFile,
    selectedIds,
    currentPath,
    historyStack,
    historyIndex,
    expandedFolders,
    clipboardAction,
    clipboardData,
    searchQuery,
    activeFilter,
    sortField,
    sortOrder,
    viewMode,
    theme,
    favorites,
    recentItems,
    // Computed
    filteredTree,
    favoriteNodes,
    canGoBack,
    canGoForward,
    // Helpers
    formatFileSize,
    formatDate,
    getMimeDescription,
    generatePreviewUrl,
    // Tree operations
    findNodeById,
    findFolderAtPath,
    addFilesToTree,
    deleteNode,
    deleteSelected,
    renameNode,
    createFolder,
    toggleSelection,
    clearSelection,
    selectAll,
    flattenTree,
    // Navigation
    addToRecent,
    goBack,
    goForward,
    addToHistory,
    // Favorites
    toggleFavorite,
    isFavorite,
    isFavorited,
    clearFavorites,
    // Recent
    clearRecent,
    // Clipboard
    copyNodes,
    cutNodes,
    pasteClipboard,
    // Filter / Sort
    toggleSort,
    // Theme
    applyTheme,
    // File operations (sidebar)
    downloadFile,
    uploadFile,
    deleteFile,
    renameFile,
    setCurrentFile,
    openFile,
    loadFiles,
    // Computed
    files,
    folders,
    // Demo
    initDemo,
    revokeAllUrls,
  };
});
