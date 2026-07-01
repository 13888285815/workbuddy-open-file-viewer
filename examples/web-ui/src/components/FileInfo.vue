<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
  InfoIcon,
  FileIcon,
  ImageIcon,
  VideoIcon,
  MusicIcon,
  CalendarIcon,
  HardDriveIcon,
  HashIcon,
  CopyIcon,
  CheckIcon,
  LoaderIcon,
  FileTextIcon
} from "lucide-vue-next";
import type { AIPanelFile } from "./AIPanel.vue";

const props = defineProps<{
  file: AIPanelFile;
}>();

interface FileMeta {
  name: string;
  type: string;
  mimeType: string;
  size: number;
  sizeFormatted: string;
  modified: string;
  path: string;
  extension: string;
  md5: string;
  sha256: string;
  isText: boolean;
  isImage: boolean;
  isVideo: boolean;
  isAudio: boolean;
}

type InfoState = "idle" | "loading" | "done" | "error";

const state = ref<InfoState>("idle");
const md5Loading = ref(false);
const sha256Loading = ref(false);
const md5Done = ref(false);
const sha256Done = ref(false);
const md5 = ref("");
const sha256 = ref("");
const copiedField = ref("");
const thumbnail = ref("");
const exifData = ref<Record<string, string>>({});

const formatSize = (bytes?: number) => {
  if (!bytes) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
};

const formatDate = (d?: Date) => {
  if (!d) return "-";
  return d.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};

const getExtension = (name: string) => {
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx + 1).toUpperCase() : "-";
};

const computeMD5 = async () => {
  if (!props.file.file) return;
  md5Loading.value = true;
  await new Promise((r) => setTimeout(r, 800));
  // Simulate MD5
  md5.value = Array.from({ length: 32 }, (_, i) =>
    ((i * 7 + 13) % 16).toString(16)
  ).join("");
  md5Loading.value = false;
  md5Done.value = true;
};

const computeSHA256 = async () => {
  if (!props.file.file) return;
  sha256Loading.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  // Simulate SHA256
  sha256.value = Array.from({ length: 64 }, (_, i) =>
    ((i * 11 + 17) % 16).toString(16)
  ).join("");
  sha256Loading.value = false;
  sha256Done.value = true;
};

const copyField = async (value: string, field: string) => {
  await navigator.clipboard.writeText(value);
  copiedField.value = field;
  setTimeout(() => (copiedField.value = ""), 2000);
};

const fileMeta = computed<FileMeta>(() => {
  const f = props.file;
  return {
    name: f.name,
    type: f.type === "folder" ? "文件夹" : getExtension(f.name),
    mimeType: f.mimeType || "-",
    size: f.size || 0,
    sizeFormatted: formatSize(f.size),
    modified: formatDate(f.modified),
    path: f.path,
    extension: getExtension(f.name),
    md5: md5.value,
    sha256: sha256.value,
    isText: !!(f.mimeType?.startsWith("text/") || f.mimeType === "application/json"),
    isImage: !!(f.mimeType?.startsWith("image/")),
    isVideo: !!(f.mimeType?.startsWith("video/")),
    isAudio: !!(f.mimeType?.startsWith("audio/"))
  };
});

const loadThumbnail = async () => {
  if (fileMeta.value.isImage && props.file.previewUrl) {
    thumbnail.value = props.file.previewUrl;
  } else if (fileMeta.value.isImage && props.file.file) {
    thumbnail.value = URL.createObjectURL(props.file.file);
  }
};

const loadExif = async () => {
  if (!fileMeta.value.isImage || !props.file.file) return;
  // Simulate EXIF extraction
  exifData.value = {
    "图片格式": fileMeta.value.mimeType,
    "文件大小": fileMeta.value.sizeFormatted,
    "创建日期": fileMeta.value.modified,
    "相机型号": "模拟相机",
    "拍摄参数": "f/1.8, ISO 100, 1/125s"
  };
};

watch(
  () => props.file,
  async () => {
    state.value = "idle";
    md5Done.value = false;
    sha256Done.value = false;
    md5.value = "";
    sha256.value = "";
    thumbnail.value = "";
    exifData.value = {};
    await loadThumbnail();
    await loadExif();
    state.value = "done";
  },
  { immediate: true }
);
</script>

<template>
  <div class="file-info">
    <!-- Header -->
    <div class="info-header">
      <div class="info-title">
        <InfoIcon :size="16" />
        <span>文件详情</span>
      </div>
    </div>

    <div class="info-content">
      <!-- Thumbnail -->
      <div v-if="thumbnail" class="info-thumbnail">
        <img :src="thumbnail" :alt="file.name" class="info-thumbnail-img" />
      </div>
      <div v-else class="info-thumbnail-placeholder">
        <FileTextIcon :size="32" />
      </div>

      <!-- Basic Info -->
      <div class="info-section">
        <p class="info-section-title">基本信息</p>
        <div class="info-row">
          <span class="info-label">文件名</span>
          <span class="info-value info-value-wrap">{{ fileMeta.name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">文件类型</span>
          <span class="info-value">
            <span class="info-type-badge">{{ fileMeta.type }}</span>
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">MIME类型</span>
          <span class="info-value">{{ fileMeta.mimeType }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">文件大小</span>
          <span class="info-value info-value-primary">{{ fileMeta.sizeFormatted }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">修改时间</span>
          <span class="info-value">{{ fileMeta.modified }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">文件路径</span>
          <span class="info-value info-value-wrap info-value-mono">{{ fileMeta.path }}</span>
        </div>
      </div>

      <!-- EXIF (Images) -->
      <div v-if="fileMeta.isImage && Object.keys(exifData).length > 0" class="info-section">
        <p class="info-section-title">
          <ImageIcon :size="13" />
          EXIF 信息
        </p>
        <div v-for="(val, key) in exifData" :key="key" class="info-row">
          <span class="info-label">{{ key }}</span>
          <span class="info-value">{{ val }}</span>
        </div>
      </div>

      <!-- Hash -->
      <div class="info-section">
        <p class="info-section-title">
          <HashIcon :size="13" />
          哈希校验
        </p>

        <!-- MD5 -->
        <div class="info-row">
          <span class="info-label">MD5</span>
          <div class="info-hash-row">
            <span v-if="md5Loading" class="info-hash-loading">
              <LoaderIcon :size="12" class="spin" />
              计算中...
            </span>
            <span v-else-if="md5" class="info-hash-value info-value-mono">{{ md5 }}</span>
            <span v-else class="info-hash-empty">-</span>
            <div class="info-hash-actions">
              <button
                v-if="md5 && !md5Loading"
                class="info-hash-btn"
                @click="copyField(md5, 'md5')"
              >
                <CheckIcon v-if="copiedField === 'md5'" :size="12" />
                <CopyIcon v-else :size="12" />
              </button>
              <button
                v-if="!md5 && !md5Loading"
                class="info-hash-btn info-hash-btn-action"
                @click="computeMD5"
              >
                计算
              </button>
            </div>
          </div>
        </div>

        <!-- SHA256 -->
        <div class="info-row">
          <span class="info-label">SHA256</span>
          <div class="info-hash-row">
            <span v-if="sha256Loading" class="info-hash-loading">
              <LoaderIcon :size="12" class="spin" />
              计算中...
            </span>
            <span v-else-if="sha256" class="info-hash-value info-value-mono">{{ sha256 }}</span>
            <span v-else class="info-hash-empty">-</span>
            <div class="info-hash-actions">
              <button
                v-if="sha256 && !sha256Loading"
                class="info-hash-btn"
                @click="copyField(sha256, 'sha256')"
              >
                <CheckIcon v-if="copiedField === 'sha256'" :size="12" />
                <CopyIcon v-else :size="12" />
              </button>
              <button
                v-if="!sha256 && !sha256Loading"
                class="info-hash-btn info-hash-btn-action"
                @click="computeSHA256"
              >
                计算
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-info {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-header {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.info-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 0 16px;
}

/* Thumbnail */
.info-thumbnail {
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  overflow: hidden;
}

.info-thumbnail-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.info-thumbnail-placeholder {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  color: var(--text-muted);
}

/* Sections */
.info-section {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}

.info-section:last-child {
  border-bottom: none;
}

.info-section-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

/* Rows */
.info-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  width: 70px;
  flex-shrink: 0;
  font-size: 11px;
  color: var(--text-muted);
  padding-top: 2px;
}

.info-value {
  flex: 1;
  font-size: 12px;
  color: var(--text-secondary);
  word-break: break-all;
}

.info-value-primary {
  font-weight: 600;
  color: var(--primary);
}

.info-value-wrap {
  word-break: break-all;
  line-height: 1.4;
}

.info-value-mono {
  font-family: "SF Mono", "Fira Code", "Consolas", monospace;
  font-size: 10px;
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: 4px;
  word-break: break-all;
}

/* Type badge */
.info-type-badge {
  display: inline-flex;
  padding: 2px 8px;
  background: var(--selected-bg);
  color: var(--primary);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

/* Hash */
.info-hash-row {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.info-hash-loading {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-muted);
}

.info-hash-value {
  flex: 1;
  font-size: 10px;
  font-family: "SF Mono", "Fira Code", "Consolas", monospace;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: 4px;
  word-break: break-all;
  min-width: 0;
}

.info-hash-empty {
  font-size: 12px;
  color: var(--text-muted);
}

.info-hash-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.info-hash-btn {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  background: var(--bg-primary);
  color: var(--text-muted);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.15s;
  padding: 0;
}

.info-hash-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.info-hash-btn-action {
  width: auto;
  padding: 2px 7px;
  font-size: 10px;
  color: var(--primary);
  border-color: var(--primary);
  background: var(--selected-bg);
}

/* Spin */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
