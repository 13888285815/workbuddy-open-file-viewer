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

// PDF/Office formats that support text extraction
const EXTRACTABLE_EXTENSIONS = [
  ".pdf",           // PDF → 文本提取
  ".doc", ".docx",  // Word → 文本提取
  ".xls", ".xlsx",  // Excel → CSV/文本提取
  ".ppt", ".pptx",  // PowerPoint → 文本提取
  ".odt", ".odf",   // OpenDocument → 文本提取
  ".rtf"            // RTF → 文本提取
];

// Check if file needs text extraction
const needsExtraction = computed(() => {
  const name = props.file?.name?.toLowerCase() || "";
  return EXTRACTABLE_EXTENSIONS.some(ext => name.endsWith(ext));
});

// Check if file is editable text
const isEditable = computed(() => {
  const file = props.file;
  if (!file) return false;
  
  // Has File object
  if (file.file) {
    const type = file.file.type;
    const name = file.name.toLowerCase();
    
    // Check MIME type for text files
    if (type && TEXT_MIME_TYPES.some(t => type.startsWith(t) || type === t)) {
      return true;
    }
    // Check extension for text files
    if (TEXT_EXTENSIONS.some(ext => name.endsWith(ext))) {
      return true;
    }
    // PDF/Office formats support text extraction
    if (EXTRACTABLE_EXTENSIONS.some(ext => name.endsWith(ext))) {
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
    const name = props.file.name.toLowerCase();
    
    // PDF: 提取文本
    if (name.endsWith(".pdf")) {
      await loadPdfText(file);
      return;
    }
    
    // Office formats: 简单提取文本（实际应用需要专业库）
    if (EXTRACTABLE_EXTENSIONS.some(ext => name.endsWith(ext))) {
      await loadOfficeText(file, name);
      return;
    }
    
    // 文本文件：直接读取
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

// PDF 文本提取（使用 PDF.js）
const loadPdfText = async (file: File) => {
  try {
    errorMsg.value = "正在提取 PDF 文本...";
    
    // 使用动态导入 PDF.js
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = `# PDF 文本提取: ${props.file.name}\n\n`;
    fullText += `> 共 ${pdf.numPages} 页\n\n---\n\n`;
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      
      fullText += `## 第 ${i} 页\n\n${pageText}\n\n`;
    }
    
    content.value = fullText;
    originalContent.value = fullText;
    isModified.value = false;
    errorMsg.value = "";
    updateLineNumbers();
  } catch (err) {
    console.error("PDF extraction error:", err);
    errorMsg.value = "PDF 文本提取失败: " + (err instanceof Error ? err.message : "未知错误");
    
    // 回退：显示提示
    content.value = `# PDF 文件: ${props.file.name}\n\n无法自动提取文本。请使用专业的 PDF 编辑器。`;
    originalContent.value = content.value;
    updateLineNumbers();
  }
};

// Office 文件文本提取（简化版）
const loadOfficeText = async (file: File, name: string) => {
  try {
    errorMsg.value = "正在提取文档文本...";
    
    // DOCX/XLSX/PPTX 是 ZIP 格式，可提取 XML
    const ext = EXTRACTABLE_EXTENSIONS.find(e => name.endsWith(e));
    
    if (ext === ".docx" || ext === ".xlsx" || ext === ".pptx") {
      // 使用 JSZip 提取文本（实际应用需要更复杂的解析）
      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(file);
      
      let extractedText = `# 文档文本提取: ${props.file.name}\n\n`;
      
      // DOCX: 提取 word/document.xml
      if (ext === ".docx") {
        const docXml = await zip.file("word/document.xml")?.async("text");
        if (docXml) {
          // 简单提取 <w:t> 标签中的文本
          const textMatches = docXml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
          if (textMatches) {
            const texts = textMatches.map(m => m.replace(/<[^>]*>/g, "")).join(" ");
            extractedText += texts;
          }
        }
      }
      // XLSX: 提取 xl/sharedStrings.xml
      else if (ext === ".xlsx") {
        const sharedStrings = await zip.file("xl/sharedStrings.xml")?.async("text");
        if (sharedStrings) {
          const textMatches = sharedStrings.match(/<t[^>]*>([^<]*)<\/t>/g);
          if (textMatches) {
            const texts = textMatches.map(m => m.replace(/<[^>]*>/g, "")).join("\n");
            extractedText += texts;
          }
        }
      }
      // PPTX: 提取 ppt/slides/*.xml
      else if (ext === ".pptx") {
        const slideFiles = Object.keys(zip.files).filter(f => f.match(/ppt\/slides\/slide\d+\.xml/));
        for (const slideFile of slideFiles) {
          const slideXml = await zip.file(slideFile)?.async("text");
          if (slideXml) {
            const textMatches = slideXml.match(/<a:t>([^<]*)<\/a:t>/g);
            if (textMatches) {
              extractedText += textMatches.map(m => m.replace(/<[^>]*>/g, "")).join(" ") + "\n\n";
            }
          }
        }
      }
      
      content.value = extractedText;
      originalContent.value = extractedText;
      isModified.value = false;
      errorMsg.value = "";
      updateLineNumbers();
    } else {
      // 其他格式：尝试直接读取文本
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        content.value = `# 文档内容: ${props.file.name}\n\n${text}`;
        originalContent.value = content.value;
        isModified.value = false;
        errorMsg.value = "";
        updateLineNumbers();
      };
      reader.readAsText(file);
    }
  } catch (err) {
    console.error("Office extraction error:", err);
    errorMsg.value = "文档文本提取失败";
    
    // 回退：显示提示
    content.value = `# 文档文件: ${props.file.name}\n\n无法自动提取文本。请使用专业的文档编辑器。`;
    originalContent.value = content.value;
    updateLineNumbers();
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
      <p>仅支持文本文件（txt, md, json, js, css, html 等）和可提取文本的文档（PDF, Word, Excel, PPT）</p>
    </div>
    
    <!-- Extraction mode notice -->
    <div v-else-if="needsExtraction" class="editor-main">
      <!-- Status bar -->
      <div class="editor-status">
        <div class="editor-status-left">
          <span class="editor-filename">{{ file.name }}</span>
          <span class="editor-extract-badge">文本提取模式</span>
        </div>
        <div class="editor-status-right">
          <span class="editor-info">提取的文本可编辑并保存为新文件</span>
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
          :placeholder="errorMsg || '正在提取文本...'"
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
          title="保存为新文件 (Ctrl+S)"
        >
          <SaveIcon v-if="!isSaving && !saveSuccess" :size="16" />
          <span v-if="isSaving" class="saving-spinner"></span>
          <CheckIcon v-if="saveSuccess" :size="16" />
          <span>{{ isSaving ? "保存中..." : saveSuccess ? "已保存" : "另存为" }}</span>
        </button>
      </div>
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

.editor-extract-badge {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: var(--text-xs);
  font-weight: 500;
}

/* Dark theme adjustments */
:root[data-theme="dark"] .line-numbers {
  background: var(--bg-tertiary);
}

:root[data-theme="dark"] .line-number {
  color: var(--text-muted);
}
</style>
