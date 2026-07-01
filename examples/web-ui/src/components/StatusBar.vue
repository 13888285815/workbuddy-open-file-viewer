<script setup lang="ts">
import { computed } from "vue";
import {
  FileIcon,
  FolderIcon,
  HardDriveIcon,
  ClockIcon,
  HashIcon,
} from "lucide-vue-next";
import type { TreeNode } from "../stores/fileStore";

const props = defineProps<{
  file: TreeNode | null;
  totalFiles: number;
  totalFolders: number;
  totalSize: number;
  selectedCount: number;
}>();

const emit = defineEmits<{
  (e: "clear-selection"): void;
}>();

const fileType = computed(() => {
  if (!props.file) return "";
  if (props.file.type === "folder") return "文件夹";
  const ext = props.file.name.split(".").pop()?.toLowerCase();
  const typeMap: Record<string, string> = {
    jpg: "JPEG 图片",
    jpeg: "JPEG 图片",
    png: "PNG 图片",
    gif: "GIF 图片",
    webp: "WebP 图片",
    svg: "SVG 矢量图",
    mp4: "MP4 视频",
    webm: "WebM 视频",
    mp3: "MP3 音频",
    wav: "WAV 音频",
    pdf: "PDF 文档",
    docx: "Word 文档",
    xlsx: "Excel 表格",
    pptx: "PowerPoint 演示",
    epub: "电子书",
    zip: "ZIP 压缩包",
    rar: "RAR 压缩包",
    "7z": "7Z 压缩包",
    js: "JavaScript",
    ts: "TypeScript",
    py: "Python",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    gltf: "GLTF 3D模型",
    glb: "GLB 3D模型",
    obj: "OBJ 3D模型",
    dwg: "DWG CAD图纸",
    dxf: "DXF CAD图纸",
    eml: "邮件文件",
    msg: "Outlook邮件",
  };
  return typeMap[ext || ""] || ext?.toUpperCase() + " 文件" || "未知格式";
});

const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <div class="status-bar" role="status" aria-label="状态栏">
    <!-- Left: Selection info -->
    <div class="status-left">
      <span v-if="selectedCount > 0" class="status-selection">
       已选择 {{ selectedCount }} 项
        <button class="status-clear" @click="emit('clear-selection')">清除</button>
      </span>
      <span v-else class="status-total">
        <FolderIcon :size="14" />
        {{ totalFolders }} 个文件夹,
        {{ totalFiles }} 个文件
      </span>
    </div>

    <!-- Center: Current file info -->
    <div class="status-center">
      <template v-if="file">
        <span class="status-item" title="文件名">
          <FileIcon :size="12" />
          {{ file.name }}
        </span>
        <span class="status-sep">|</span>
        <span class="status-item" :title="fileType">
          {{ fileType }}
        </span>
        <span v-if="file.size" class="status-sep">|</span>
        <span v-if="file.size" class="status-item" title="文件大小">
          <HardDriveIcon :size="12" />
          {{ formatSize(file.size) }}
        </span>
        <span v-if="file.modified" class="status-sep">|</span>
        <span v-if="file.modified" class="status-item" title="修改时间">
          <ClockIcon :size="12" />
          {{ formatDate(file.modified) }}
        </span>
        <span v-if="file.hash" class="status-sep">|</span>
        <span v-if="file.hash" class="status-item" title="文件哈希">
          <HashIcon :size="12" />
          {{ file.hash.slice(0, 8) }}...
        </span>
      </template>
      <span v-else class="status-ready">就绪</span>
    </div>

    <!-- Right: Total size -->
    <div class="status-right">
      <span class="status-size">
        总大小: {{ formatSize(totalSize) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 28px;
  padding: 0 12px;
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-secondary);
  user-select: none;
  gap: 8px;
}

.status-left,
.status-center,
.status-right {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
}

.status-left {
  flex: 0 0 auto;
  min-width: 200px;
}

.status-center {
  flex: 1;
  justify-content: center;
  min-width: 0;
}

.status-right {
  flex: 0 0 auto;
  min-width: 120px;
  justify-content: flex-end;
}

.status-selection {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--primary);
}

.status-clear {
  padding: 1px 6px;
  border: none;
  border-radius: 3px;
  background: var(--primary);
  color: white;
  font-size: 11px;
  cursor: pointer;
}

.status-total {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 3px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-sep {
  color: var(--border-color);
  flex-shrink: 0;
}

.status-ready {
  color: var(--text-tertiary);
}

.status-size {
  font-variant-numeric: tabular-nums;
}

/* Dark theme */
:global(.theme-dark) .status-bar {
  background: #1e1e1e;
}

/* Responsive */
@media (max-width: 768px) {
  .status-bar {
    padding: 0 8px;
    font-size: 11px;
  }

  .status-left {
    min-width: 120px;
  }

  .status-right {
    min-width: 80px;
  }

  .status-item {
    max-width: 120px;
  }
}
</style>
