<script setup lang="ts">
import { ref, computed } from "vue";
import {
  RepeatIcon,
  DownloadIcon,
  SettingsIcon,
  FileIcon,
  CheckIcon,
  AlertCircleIcon,
} from "lucide-vue-next";
import type { TreeNode } from "../stores/fileStore";

const props = defineProps<{
  file: TreeNode | null;
}>();

const emit = defineEmits<{
  (e: "convert", targetFormat: string): void;
}>();

// Supported conversion formats
const conversionFormats = [
  {
    category: "文档格式",
    formats: [
      { id: "pdf", label: "PDF", ext: ".pdf", icon: "📕" },
      { id: "docx", label: "Word (DOCX)", ext: ".docx", icon: "📘" },
      { id: "xlsx", label: "Excel (XLSX)", ext: ".xlsx", icon: "📗" },
      { id: "pptx", label: "PowerPoint (PPTX)", ext: ".pptx", icon: "📙" },
      { id: "odt", label: "ODF 文本", ext: ".odt", icon: "📄" },
      { id: "html", label: "HTML", ext: ".html", icon: "🌐" },
      { id: "markdown", label: "Markdown", ext: ".md", icon: "📝" },
      { id: "txt", label: "纯文本", ext: ".txt", icon: "📃" },
    ],
  },
  {
    category: "图片格式",
    formats: [
      { id: "jpg", label: "JPEG", ext: ".jpg", icon: "🖼️" },
      { id: "png", label: "PNG", ext: ".png", icon: "🖼️" },
      { id: "webp", label: "WebP", ext: ".webp", icon: "🖼️" },
      { id: "gif", label: "GIF", ext: ".gif", icon: "🖼️" },
      { id: "svg", label: "SVG", ext: ".svg", icon: "🎨" },
      { id: "ico", label: "ICO", ext: ".ico", icon: "🖼️" },
    ],
  },
  {
    category: "视频格式",
    formats: [
      { id: "mp4", label: "MP4", ext: ".mp4", icon: "🎬" },
      { id: "webm", label: "WebM", ext: ".webm", icon: "🎬" },
      { id: "avi", label: "AVI", ext: ".avi", icon: "🎬" },
      { id: "mov", label: "MOV", ext: ".mov", icon: "🎬" },
    ],
  },
  {
    category: "音频格式",
    formats: [
      { id: "mp3", label: "MP3", ext: ".mp3", icon: "🎵" },
      { id: "wav", label: "WAV", ext: ".wav", icon: "🎵" },
      { id: "ogg", label: "OGG", ext: ".ogg", icon: "🎵" },
      { id: "flac", label: "FLAC", ext: ".flac", icon: "🎵" },
    ],
  },
];

const selectedFormat = ref<string>("");
const isConverting = ref(false);
const convertProgress = ref(0);
const convertError = ref("");
const convertSuccess = ref(false);

const currentExt = computed(() => {
  if (!props.file) return "";
  const parts = props.file.name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
});

const availableFormats = computed(() => {
  if (!props.file) return [];
  const allFormats: Array<{ id: string; label: string; ext: string; icon: string }> = [];
  conversionFormats.forEach((cat) => {
    cat.formats.forEach((fmt) => {
      allFormats.push(fmt);
    });
  });
  return allFormats.filter((fmt) => fmt.ext.slice(1) !== currentExt.value);
});

const handleConvert = async () => {
  if (!props.file || !selectedFormat.value) return;
  isConverting.value = true;
  convertProgress.value = 0;
  convertError.value = "";
  convertSuccess.value = false;

  try {
    // Simulate conversion progress
    for (let i = 0; i <= 100; i += 10) {
      convertProgress.value = i;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Emit convert event
    emit("convert", selectedFormat.value);
    convertSuccess.value = true;
  } catch (err: any) {
    convertError.value = err.message || "转换失败";
  } finally {
    isConverting.value = false;
  }
};
</script>

<template>
  <div class="converter-panel" role="dialog" aria-label="文件转换">
    <div class="converter-header">
      <h3 class="converter-title">
        <RepeatIcon :size="18" />
        文件转换
      </h3>
    </div>

    <div v-if="!file" class="converter-empty">
      <FileIcon :size="48" />
      <p>请先选择一个文件</p>
    </div>

    <div v-else class="converter-body">
      <!-- Source file info -->
      <div class="converter-source">
        <div class="source-icon">{{ file.name.split(".").pop()?.toLowerCase() === "pdf" ? "📕" : "📄" }}</div>
        <div class="source-info">
          <div class="source-name">{{ file.name }}</div>
          <div class="source-meta">
            {{ file.size ? Math.round(file.size / 1024) + " KB" : "未知大小" }}
          </div>
        </div>
      </div>

      <!-- Format selection -->
      <div class="converter-formats">
        <div class="format-search">
          <input
            type="text"
            class="format-search-input"
            placeholder="搜索目标格式..."
            v-model="selectedFormat"
          />
        </div>

        <div class="format-categories">
          <div
            v-for="category in conversionFormats"
            :key="category.category"
            class="format-category"
          >
            <div class="category-label">{{ category.category }}</div>
            <div class="format-grid">
              <button
                v-for="fmt in category.formats"
                :key="fmt.id"
                class="format-btn"
                :class="{ active: selectedFormat === fmt.id }"
                :disabled="isConverting"
                @click="selectedFormat = fmt.id"
              >
                <span class="format-icon">{{ fmt.icon }}</span>
                <span class="format-label">{{ fmt.label }}</span>
                <span class="format-ext">{{ fmt.ext }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Conversion progress -->
      <div v-if="isConverting" class="converter-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: convertProgress + '%' }"></div>
        </div>
        <div class="progress-text">转换中... {{ convertProgress }}%</div>
      </div>

      <!-- Error message -->
      <div v-if="convertError" class="converter-error">
        <AlertCircleIcon :size="16" />
        {{ convertError }}
      </div>

      <!-- Success message -->
      <div v-if="convertSuccess" class="converter-success">
        <CheckIcon :size="16" />
        转换完成！
      </div>

      <!-- Actions -->
      <div class="converter-actions">
        <button
          class="btn btn-primary"
          :disabled="!selectedFormat || isConverting"
          @click="handleConvert"
        >
          <RepeatIcon :size="16" />
          {{ isConverting ? "转换中..." : "开始转换" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.converter-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-primary);
  border-left: 1px solid var(--border-color);
}

.converter-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.converter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.converter-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 12px;
  color: var(--text-tertiary);
}

.converter-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.converter-source {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 16px;
}

.source-icon {
  font-size: 32px;
}

.source-info {
  flex: 1;
  min-width: 0;
}

.source-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.source-meta {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.converter-formats {
  margin-bottom: 16px;
}

.format-search {
  margin-bottom: 12px;
}

.format-search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 13px;
}

.format-categories {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.format-category {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

.format-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s;
}

.format-btn:hover:not(:disabled) {
  border-color: var(--primary);
  background: var(--bg-hover);
}

.format-btn.active {
  border-color: var(--primary);
  background: var(--primary-light);
  color: var(--primary);
}

.format-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.format-icon {
  font-size: 24px;
}

.format-label {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.format-ext {
  font-size: 10px;
  color: var(--text-tertiary);
}

.converter-progress {
  margin-bottom: 16px;
}

.progress-bar {
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}

.converter-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--danger-light);
  color: var(--danger);
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 13px;
}

.converter-success {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--success-light);
  color: var(--success);
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 13px;
}

.converter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

/* Dark theme */
:global(.theme-dark) .converter-panel {
  background: #1e1e1e;
}

/* Responsive */
@media (max-width: 768px) {
  .format-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
