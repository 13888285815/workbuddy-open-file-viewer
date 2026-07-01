<script setup lang="ts">
import { computed } from "vue";
import {
  ZoomInIcon,
  ZoomOutIcon,
  RotateCwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  SaveIcon,
  PrinterIcon,
  ShareIcon,
  DownloadIcon,
  MaximizeIcon,
  MinimizeIcon,
  InfoIcon,
  SettingsIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
} from "lucide-vue-next";
import type { TreeNode } from "../stores/fileStore";

const props = defineProps<{
  file: TreeNode | null;
  currentPage?: number;
  totalPages?: number;
  scale?: number;
  rotation?: number;
  isFullscreen?: boolean;
}>();

const emit = defineEmits<{
  (e: "zoom-in"): void;
  (e: "zoom-out"): void;
  (e: "rotate-cw"): void;
  (e: "prev-page"): void;
  (e: "next-page"): void;
  (e: "edit"): void;
  (e: "save-as"): void;
  (e: "print"): void;
  (e: "share"): void;
  (e: "download"): void;
  (e: "fullscreen"): void;
  (e: "info"): void;
  (e: "settings"): void;
  (e: "search"): void;
}>();

const canZoomIn = computed(() => !props.scale || props.scale < 3);
const canZoomOut = computed(() => !props.scale || props.scale > 0.1);
const canPrevPage = computed(() => props.currentPage && props.currentPage > 1);
const canNextPage = computed(
  () => props.currentPage && props.totalPages && props.currentPage < props.totalPages
);
</script>

<template>
  <div class="preview-toolbar" role="toolbar" aria-label="预览工具栏">
    <!-- Left: File info -->
    <div class="toolbar-left">
      <span v-if="file" class="toolbar-filename" :title="file.name">
        {{ file.name }}
      </span>
      <span v-else class="toolbar-placeholder">未选择文件</span>
    </div>

    <!-- Center: Navigation & Zoom -->
    <div class="toolbar-center">
      <!-- Zoom controls -->
      <div class="toolbar-group">
        <button
          class="toolbar-btn"
          title="缩小 (Ctrl+-)"
          :disabled="!canZoomOut"
          @click="emit('zoom-out')"
        >
          <ZoomOutIcon :size="16" />
        </button>
        <span class="toolbar-scale">{{ scale ? Math.round(scale * 100) + "%" : "100%" }}</span>
        <button
          class="toolbar-btn"
          title="放大 (Ctrl++)"
          :disabled="!canZoomIn"
          @click="emit('zoom-in')"
        >
          <ZoomInIcon :size="16" />
        </button>
      </div>

      <!-- Rotation -->
      <div class="toolbar-group">
        <button
          class="toolbar-btn"
          title="旋转 (Ctrl+R)"
          :disabled="!file"
          @click="emit('rotate-cw')"
        >
          <RotateCwIcon :size="16" />
        </button>
      </div>

      <!-- Page navigation (for PDF, Office docs) -->
      <div v-if="totalPages && totalPages > 1" class="toolbar-group">
        <button
          class="toolbar-btn"
          title="上一页 (←)"
          :disabled="!canPrevPage"
          @click="emit('prev-page')"
        >
          <ChevronLeftIcon :size="16" />
        </button>
        <span class="toolbar-page">
          {{ currentPage || 1 }} / {{ totalPages }}
        </span>
        <button
          class="toolbar-btn"
          title="下一页 (→)"
          :disabled="!canNextPage"
          @click="emit('next-page')"
        >
          <ChevronRightIcon :size="16" />
        </button>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="toolbar-right">
      <button
        class="toolbar-btn"
        title="编辑 (Ctrl+E)"
        :disabled="!file"
        @click="emit('edit')"
      >
        <EditIcon :size="16" />
        <span class="toolbar-label">编辑</span>
      </button>

      <button
        class="toolbar-btn"
        title="另存为 (Ctrl+Shift+S)"
        :disabled="!file"
        @click="emit('save-as')"
      >
        <SaveIcon :size="16" />
        <span class="toolbar-label">另存</span>
      </button>

      <button
        class="toolbar-btn"
        title="打印 (Ctrl+P)"
        :disabled="!file"
        @click="emit('print')"
      >
        <PrinterIcon :size="16" />
        <span class="toolbar-label">打印</span>
      </button>

      <button
        class="toolbar-btn"
        title="分享"
        :disabled="!file"
        @click="emit('share')"
      >
        <ShareIcon :size="16" />
        <span class="toolbar-label">分享</span>
      </button>

      <button
        class="toolbar-btn"
        title="下载 (Ctrl+D)"
        :disabled="!file"
        @click="emit('download')"
      >
        <DownloadIcon :size="16" />
        <span class="toolbar-label">下载</span>
      </button>

      <div class="toolbar-divider"></div>

      <button
        class="toolbar-btn"
        title="详情 (Ctrl+I)"
        :disabled="!file"
        @click="emit('info')"
      >
        <InfoIcon :size="16" />
      </button>

      <button
        class="toolbar-btn"
        title="设置"
        @click="emit('settings')"
      >
        <SettingsIcon :size="16" />
      </button>

      <button
        class="toolbar-btn"
        :title="isFullscreen ? '退出全屏' : '全屏 (F11)'"
        :disabled="!file"
        @click="emit('fullscreen')"
      >
        <MaximizeIcon v-if="!isFullscreen" :size="16" />
        <MinimizeIcon v-else :size="16" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 12px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  gap: 8px;
  user-select: none;
}

.toolbar-left {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

.toolbar-filename {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.toolbar-placeholder {
  font-size: 13px;
  color: var(--text-muted);
}

.toolbar-center {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  border-right: 1px solid var(--border-color);
}

.toolbar-group:last-child {
  border-right: none;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  font-size: 13px;
}

.toolbar-btn:hover:not(:disabled) {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.toolbar-btn:active:not(:disabled) {
  background: var(--bg-active);
}

.toolbar-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.toolbar-label {
  font-size: 12px;
}

.toolbar-scale,
.toolbar-page {
  font-size: 12px;
  color: var(--text-secondary);
  min-width: 48px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.toolbar-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: var(--border-color);
  margin: 0 4px;
}

/* Responsive */
@media (max-width: 1024px) {
  .toolbar-label {
    display: none;
  }

  .toolbar-filename {
    max-width: 200px;
  }
}

@media (max-width: 768px) {
  .preview-toolbar {
    padding: 0 8px;
    height: 44px;
  }

  .toolbar-center {
    gap: 8px;
  }

  .toolbar-group {
    padding: 0 4px;
  }

  .toolbar-filename {
    max-width: 120px;
  }
}
</style>
