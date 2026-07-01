<script setup lang="ts">
/**
 * InlineEditor.vue — 意念文件管理器原位编辑器
 * 
 * 功能：
 * - 在浏览区原位编辑文本文件（无弹窗）
 * - 支持多种文本格式：txt, md, json, js, ts, css, html, xml, yaml, toml, csv, log, ini, cfg, sh, py, c, cpp, h, hpp, go, rs, java, kt, swift, rb, php, sql 等
 * - 自动语法高亮
 * - 行号显示
 * - 自动保存指示
 * - Ctrl+S 保存快捷键
 * - 修改后高亮标题栏
 */
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { SaveIcon, RotateCcwIcon, CheckIcon, AlertCircleIcon } from "lucide-vue-next";
import type { TreeNode } from "../stores/fileStore";

// Props
const props = defineProps<{
  file: TreeNode;
}>();

const emit = defineEmits<{
  (e: "save", content: string): void;
  (e: "cancel"): void;
}>();

// State
const content = ref("");
const originalContent = ref("");
const isModified = ref(false);
const isSaving = ref(false);
const saveSuccess = ref(false);
const errorMsg = ref("");
const lineNumbers = ref<string[]>([]);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Supported text MIME types
const TEXT_MIME_TYPES = [
  "text/plain",
  "text/html",
  "text/css",
  "text/javascript",
  "text/typescript",
  "text/markdown",
  "text/xml",
  "text/csv",
  "text/yaml",
  "application/json",
  "application/javascript",
  "application/typescript",
  "application/xml",
  "application/x-yaml",
];

// Supported extensions for text editing
const TEXT_EXTENSIONS = [
  ".txt", ".md", ".markdown", ".json", ".js", ".jsx", ".ts", ".tsx",
  ".css", ".scss", ".sass", ".less", ".html", ".htm", ".xml", ".svg",
  ".yaml", ".yml", ".toml", ".ini", ".cfg", ".conf", ".env", ".sh",
  ".bash", ".zsh", ".py", ".pyw", ".rb", ".php", ".java", ".kt",
  ".swift", ".c", ".cpp", ".h", ".hpp", ".go", ".rs", ".sql",
  ".log", ".gitignore", ".dockerignore", ".editorconfig", ".prettierrc",
  ".eslintrc", ".babelrc", ".webpack", ".graphql", ".vue", ".svelte"
];

// Check if file is editable text
const isEditable = computed(() => {
  const file = props.file;
  if (!file) return false;
  
  // Has File object
  if (file.file) {
    const type = file.file.type;
    const name = file.name.toLowerCase();
    
    // Check MIME type
    if (type && TEXT_MIME_TYPES.some(t => type.startsWith(t) || type === t)) {
      return true;
    }
    // Check extension
    if (TEXT_EXTENSIONS.some(ext => name.endsWith(ext))) {
      return true;
    }
    // Empty MIME type usually means text
    if (!type && !name.includes(".")) {
      return true;
    }
  }
  
  return false;
});

// Get file extension for syntax highlighting hint
const fileExtension = computed(() => {
  const name = props.file?.name || "";
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
});

// Load file content
const loadFile = async () => {
  if (!props.file?.file) return;
  
  try {
    const file = props.file.file;
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      content.value = text;
      originalContent.value = text;
      isModified.value = false;
      errorMsg.value = "";
      updateLineNumbers();
    };
    
    reader.onerror = () => {
      errorMsg.value = "读取文件失败";
      content.value = "";
      originalContent.value = "";
    };
    
    reader.readAsText(file);
  } catch (err) {
    errorMsg.value = "加载文件内容失败";
    console.error("Load file error:", err);
  }
};

// Update line numbers
const updateLineNumbers = () => {
  const lines = content.value.split("\n");
  lineNumbers.value = lines.map((_, i) => String(i + 1));
};

// Watch for file changes
watch(() => props.file, (newFile, oldFile) => {
  if (newFile?.id !== oldFile?.id) {
    isModified.value = false;
    saveSuccess.value = false;
    loadFile();
  }
}, { immediate: true });

// Watch content changes
watch(content, () => {
  isModified.value = content.value !== originalContent.value;
  updateLineNumbers();
});

// Save handler
const handleSave = async () => {
  if (!isModified.value) return;
  
  isSaving.value = true;
  saveSuccess.value = false;
  
  try {
    // Create new file with updated content
    const blob = new Blob([content.value], { type: props.file.file?.type || "text/plain" });
    const newFile = new File([blob], props.file.name, { 
      type: props.file.file?.type || "text/plain" 
    });
    
    // Update the file in the node
    const updatedNode: TreeNode = {
      ...props.file,
      file: newFile,
      size: newFile.size,
    };
    
    emit("save", content.value);
    
    // Simulate save delay for feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    
    originalContent.value = content.value;
    isModified.value = false;
    saveSuccess.value = true;
    
    // Auto-hide success indicator
    setTimeout(() => {
      saveSuccess.value = false;
    }, 2000);
    
  } catch (err) {
    errorMsg.value = "保存失败: " + (err instanceof Error ? err.message : "未知错误");
  } finally {
    isSaving.value = false;
  }
};

// Cancel handler
const handleCancel = () => {
  if (isModified.value) {
    if (confirm("有未保存的修改，确定要放弃吗？")) {
      content.value = originalContent.value;
      isModified.value = false;
      emit("cancel");
    }
  } else {
    emit("cancel");
  }
};

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl+S / Cmd+S to save
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    handleSave();
  }
  // Escape to cancel
  if (e.key === "Escape") {
    handleCancel();
  }
};

// Focus textarea on mount
onMounted(() => {
  nextTick(() => {
    textareaRef.value?.focus();
  });
});

// Expose for parent
defineExpose({
  handleSave,
  handleCancel,
  isModified,
});
</script>

<template>
  <div class="inline-editor" @keydown="handleKeydown">
    <!-- Error state -->
    <div v-if="errorMsg" class="editor-error">
      <AlertCircleIcon :size="18" />
      <span>{{ errorMsg }}</span>
    </div>

    <!-- Not editable -->
    <div v-else-if="!isEditable" class="editor-not-editable">
      <AlertCircleIcon :size="24" />
      <h4>此文件类型不支持编辑</h4>
      <p>仅支持文本文件（txt, md, json, js, css, html 等）</p>
    </div>

    <!-- Editor -->
    <div v-else class="editor-main">
      <!-- Status bar -->
      <div class="editor-status">
        <div class="editor-status-left">
          <span class="editor-filename">{{ file.name }}</span>
          <span v-if="isModified" class="editor-modified">● 已修改</span>
          <span v-if="saveSuccess" class="editor-saved">
            <CheckIcon :size="14" /> 已保存
          </span>
        </div>
        <div class="editor-status-right">
          <span class="editor-info">{{ lineNumbers.length }} 行</span>
          <span class="editor-info">{{ content.length }} 字符</span>
        </div>
      </div>

      <!-- Editor area with line numbers -->
      <div class="editor-content">
        <!-- Line numbers -->
        <div class="line-numbers" aria-hidden="true">
          <div
            v-for="num in lineNumbers"
            :key="num"
            class="line-number"
          >{{ num }}</div>
        </div>

        <!-- Textarea -->
        <textarea
          ref="textareaRef"
          v-model="content"
          class="editor-textarea"
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          :placeholder="'输入内容...'"
        ></textarea>
      </div>

      <!-- Action bar -->
      <div class="editor-actions">
        <button
          class="editor-btn secondary"
          @click="handleCancel"
          title="放弃修改 (Esc)"
        >
          <RotateCcwIcon :size="16" />
          <span>取消</span>
        </button>
        <button
          class="editor-btn primary"
          :class="{ saving: isSaving, success: saveSuccess }"
          :disabled="!isModified || isSaving"
          @click="handleSave"
          title="保存 (Ctrl+S)"
        >
          <SaveIcon v-if="!isSaving && !saveSuccess" :size="16" />
          <span v-if="isSaving" class="saving-spinner"></span>
          <CheckIcon v-if="saveSuccess" :size="16" />
          <span>{{ isSaving ? "保存中..." : saveSuccess ? "已保存" : "保存" }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inline-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
}

/* Error state */
.editor-error {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
  margin: var(--spacing-md);
}

/* Not editable */
.editor-not-editable {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  text-align: center;
  padding: var(--spacing-xl);
}

.editor-not-editable h4 {
  margin: 0;
  font-size: var(--text-lg);
  color: var(--text-primary);
}

.editor-not-editable p {
  margin: 0;
  font-size: var(--text-sm);
}

/* Main editor */
.editor-main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Status bar */
.editor-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-light);
  font-size: var(--text-sm);
}

.editor-status-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.editor-filename {
  font-weight: 500;
  color: var(--text-primary);
}

.editor-modified {
  color: var(--warning);
  font-size: var(--text-xs);
}

.editor-saved {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--success);
  font-size: var(--text-xs);
}

.editor-status-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.editor-info {
  color: var(--text-muted);
  font-size: var(--text-xs);
}

/* Editor content */
.editor-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Line numbers */
.line-numbers {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md) 0;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-light);
  user-select: none;
  overflow-y: auto;
  scrollbar-width: none;
  min-width: 50px;
  text-align: right;
}

.line-numbers::-webkit-scrollbar {
  display: none;
}

.line-number {
  padding: 0 var(--spacing-sm);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--text-muted);
}

/* Textarea */
.editor-textarea {
  flex: 1;
  padding: var(--spacing-md);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--bg-primary);
  border: none;
  outline: none;
  resize: none;
  overflow-y: auto;
  white-space: pre;
  tab-size: 2;
}

.editor-textarea::placeholder {
  color: var(--text-muted);
}

/* Actions */
.editor-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-light);
}

.editor-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: none;
}

.editor-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.editor-btn.secondary:hover:not(:disabled) {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.editor-btn.primary {
  background: var(--primary);
  color: white;
}

.editor-btn.primary:hover:not(:disabled) {
  filter: brightness(1.1);
}

.editor-btn.primary.saving {
  background: var(--primary);
}

.editor-btn.primary.success {
  background: var(--success);
}

.saving-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Dark theme adjustments */
:root[data-theme="dark"] .line-numbers {
  background: var(--bg-tertiary);
}

:root[data-theme="dark"] .line-number {
  color: var(--text-muted);
}
</style>
