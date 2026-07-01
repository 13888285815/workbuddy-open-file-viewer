<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  FolderIcon,
  FolderOpenIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  VideoIcon,
  MusicIcon,
  ArchiveIcon,
  FileCodeIcon,
  ChevronRightIcon,
  StarIcon,
  ClockIcon,
  StarOffIcon,
} from "lucide-vue-next";
import { useFileStore } from "../stores/fileStore";
import type { TreeNode } from "../stores/fileStore";

// ─── Store ────────────────────────────────────────────────────────────────────

const store = useFileStore();

// ─── Props / Emits ───────────────────────────────────────────────────────────

const props = defineProps<{
  node: TreeNode;
  depth?: number;
}>();

const emit = defineEmits<{
  select: [node: TreeNode];
  contextmenu: [e: MouseEvent, node: TreeNode];
}>();

const depth = computed(() => props.depth ?? 0);

// ─── Drag state ──────────────────────────────────────────────────────────────

const isDragOver = ref(false);
const dragOverChild = ref<string | null>(null);

const handleDragOver = (e: DragEvent) => {
  if (props.node.type !== "folder") return;
  e.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
  dragOverChild.value = null;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
  if (props.node.type !== "folder") return;

  const files = e.dataTransfer?.files;
  if (files?.length) {
    // Add files under this folder by temporarily updating currentPath
    const savedPath = store.currentPath;
    store.currentPath = props.node.path;
    store.addFilesToTree(Array.from(files));
    store.currentPath = savedPath;
    // Expand this folder
    store.expandedFolders.add(props.node.id);
    store.expandedFolders = new Set(store.expandedFolders);
  }
};

// ─── File type helpers ───────────────────────────────────────────────────────

const getIcon = (node: TreeNode) => {
  if (node.type === "folder") return node.expanded ? FolderOpenIcon : FolderIcon;
  const mime = node.mimeType || "";
  if (mime.startsWith("image/")) return ImageIcon;
  if (mime.startsWith("video/")) return VideoIcon;
  if (mime.startsWith("audio/")) return MusicIcon;
  if (mime === "application/pdf") return FileIcon;
  if (mime.includes("document") || mime.includes("word") || mime.includes("text")) return FileTextIcon;
  if (mime.includes("archive") || mime.includes("zip") || mime.includes("rar")) return ArchiveIcon;
  if (mime.includes("code") || mime.includes("javascript") || mime.includes("json")) return FileCodeIcon;
  return FileIcon;
};

const getIconClass = (node: TreeNode) => {
  if (node.type === "folder") return "folder";
  const mime = node.mimeType || "";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf") return "pdf";
  if (mime.includes("document") || mime.includes("word") || mime.includes("text") || mime.includes("sheet") || mime.includes("presentation")) return "document";
  if (mime.includes("archive") || mime.includes("zip") || mime.includes("rar")) return "archive";
  return "file";
};

const isSelected = computed(() =>
  store.selectedIds.has(props.node.id) || store.selectedFile?.id === props.node.id
);

const isFav = computed(() => store.isFavorite(props.node.id));
const isExpanded = computed(() => store.expandedFolders.has(props.node.id));

// ─── Actions ─────────────────────────────────────────────────────────────────

const handleClick = (e: MouseEvent) => {
  if (e.ctrlKey || e.metaKey || e.shiftKey) {
    store.toggleSelection(props.node, e);
  } else {
    emit("select", props.node);
  }
};

const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  emit("contextmenu", e, props.node);
};

const toggleExpand = (e: Event) => {
  e.stopPropagation();
  if (props.node.type !== "folder") return;
  if (isExpanded.value) {
    store.expandedFolders.delete(props.node.id);
  } else {
    store.expandedFolders.add(props.node.id);
  }
  store.expandedFolders = new Set(store.expandedFolders);
  props.node.expanded = isExpanded.value;
};

const handleFavToggle = (e: Event) => {
  e.stopPropagation();
  store.toggleFavorite(props.node.id);
};

// ─── Format helpers ───────────────────────────────────────────────────────────

const formatSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + "MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(0) + "KB";
  return bytes + "B";
};
</script>

<template>
  <div
    class="tree-node"
    :class="{ 'drag-over': isDragOver }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Node row -->
    <div
      :class="['tree-node-content', { selected: isSelected, 'drag-over': isDragOver }]"
      :style="{ paddingLeft: `${10 + depth * 18}px` }"
      @click="handleClick"
      @contextmenu="handleContextMenu"
    >
      <!-- Expand chevron -->
      <span
        :class="['tree-expand', { expanded: isExpanded, hidden: node.type !== 'folder' || !node.children?.length }]"
        @click="toggleExpand"
      >
        <ChevronRightIcon :size="13" />
      </span>

      <!-- File icon -->
      <span :class="['tree-icon', getIconClass(node)]">
        <component :is="getIcon(node)" :size="15" />
      </span>

      <!-- Name -->
      <span class="tree-name" :title="node.name">{{ node.name }}</span>

      <!-- Size (files only) -->
      <span v-if="node.type === 'file' && node.size" class="tree-size">
        {{ formatSize(node.size) }}
      </span>

      <!-- Favorite star -->
      <button
        v-if="node.type === 'file'"
        :class="['tree-fav', { active: isFav }]"
        :title="isFav ? '取消收藏' : '收藏'"
        @click="handleFavToggle"
      >
        <StarIcon v-if="isFav" :size="12" />
        <StarOffIcon v-else :size="12" />
      </button>
    </div>

    <!-- Children -->
    <div v-if="node.children?.length && isExpanded" class="tree-children">
      <FileTree
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        @select="emit('select', $event)"
        @contextmenu="emit('contextmenu', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.tree-node {
  user-select: none;
}

.tree-node-content {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;
  transition: background 0.1s;
  gap: 6px;
  border-radius: 4px;
  margin: 1px 6px;
  position: relative;
}

.tree-node-content:hover {
  background: var(--hover-bg);
}

.tree-node-content.selected {
  background: var(--selected-bg);
  border-right: 2px solid var(--selected-border);
}

.tree-node-content.drag-over {
  background: rgba(59, 130, 246, 0.15);
  outline: 2px dashed var(--primary);
  outline-offset: -2px;
}

/* Expand */
.tree-expand {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: transform 0.15s;
  border-radius: 3px;
}

.tree-expand:hover {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.tree-expand.expanded {
  transform: rotate(90deg);
}

.tree-expand.hidden {
  visibility: hidden;
}

/* Icons */
.tree-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tree-icon.folder { color: #fbbf24; }
.tree-icon.file   { color: var(--text-muted); }
.tree-icon.image  { color: #22c55e; }
.tree-icon.video  { color: #a855f7; }
.tree-icon.audio  { color: #ec4899; }
.tree-icon.pdf    { color: #ef4444; }
.tree-icon.document { color: #3b82f6; }
.tree-icon.archive { color: #f97316; }

/* Name */
.tree-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: var(--text-primary);
}

/* Size */
.tree-size {
  font-size: 11px;
  color: var(--text-muted);
  flex-shrink: 0;
}

/* Favorite */
.tree-fav {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 3px;
  opacity: 0;
  transition: opacity 0.15s, color 0.15s;
  flex-shrink: 0;
}

.tree-node-content:hover .tree-fav {
  opacity: 1;
}

.tree-fav.active {
  color: #f59e0b;
  opacity: 1;
}

.tree-fav:hover {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}
</style>
