<script setup lang="ts">
import { ref, watch } from "vue";
import { LanguagesIcon, LoaderIcon, ArrowRightIcon, CheckCircleIcon, AlertCircleIcon, CopyIcon } from "lucide-vue-next";
import type { AIPanelFile } from "./AIPanel.vue";

const props = defineProps<{
  file: AIPanelFile;
}>();

type TranslateState = "idle" | "loading" | "done" | "error";

const targetLang = ref("中文");
const translateState = ref<TranslateState>("idle");
const originalText = ref("");
const translatedText = ref("");
const progress = ref(0);
const charCount = ref(0);
const copied = ref(false);

const languages = [
  "中文",
  "English",
  "日本語",
  "한국어",
  "Français",
  "Deutsch",
  "Español",
  "Русский",
  "العربية",
  "Português"
];

const doTranslate = async () => {
  if (!props.file.file) return;

  translateState.value = "loading";
  progress.value = 0;

  try {
    const content = await props.file.file.text();
    originalText.value = content;
    charCount.value = content.length;

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      progress.value = i;
      await new Promise((r) => setTimeout(r, 120));
    }

    // Mock translated text
    translatedText.value = `[${targetLang.value} 翻译]\n\n${content
      .split("\n")
      .map((line) => `【译】${line}`)
      .join("\n")}`;

    translateState.value = "done";
  } catch {
    translateState.value = "error";
  }
};

const copyTranslation = async () => {
  await navigator.clipboard.writeText(translatedText.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};

watch(
  () => props.file,
  () => {
    translateState.value = "idle";
    originalText.value = "";
    translatedText.value = "";
    progress.value = 0;
    charCount.value = 0;
  }
);
</script>

<template>
  <div class="ai-translate">
    <!-- Header -->
    <div class="translate-header">
      <div class="translate-title">
        <LanguagesIcon :size="16" />
        <span>文档翻译</span>
      </div>
    </div>

    <!-- Language Selector -->
    <div class="translate-lang-section">
      <label class="translate-lang-label">目标语言</label>
      <div class="translate-lang-grid">
        <button
          v-for="lang in languages"
          :key="lang"
          :class="['lang-btn', { active: targetLang === lang }]"
          @click="targetLang = lang"
        >
          {{ lang }}
        </button>
      </div>
    </div>

    <!-- Idle state -->
    <div v-if="translateState === 'idle'" class="translate-idle">
      <div class="translate-icon-wrap">
        <LanguagesIcon :size="32" />
      </div>
      <p class="translate-idle-title">AI 智能翻译</p>
      <p class="translate-idle-desc">支持 10+ 语言实时翻译</p>
      <button class="btn btn-primary translate-btn" @click="doTranslate">
        <ArrowRightIcon :size="14" />
        开始翻译为 {{ targetLang }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-else-if="translateState === 'loading'" class="translate-loading">
      <div class="translate-progress-wrap">
        <div class="translate-progress-bar">
          <div class="translate-progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="translate-progress-text">{{ progress }}%</span>
      </div>
      <div class="translate-loading-info">
        <LoaderIcon :size="20" class="spin" />
        <p>正在翻译为「{{ targetLang }}」...</p>
        <p class="translate-char-count">{{ charCount > 0 ? charCount + ' 字符' : '读取文档中...' }}</p>
      </div>
    </div>

    <!-- Done state -->
    <div v-else-if="translateState === 'done'" class="translate-done">
      <!-- Action bar -->
      <div class="translate-actions">
        <span class="translate-done-badge">
          <CheckCircleIcon :size="12" />
          翻译完成
        </span>
        <button class="translate-copy-btn" @click="copyTranslation">
          <CopyIcon :size="13" />
          {{ copied ? "已复制" : "复制译文" }}
        </button>
      </div>

      <!-- Comparison view -->
      <div class="translate-comparison">
        <!-- Original -->
        <details class="translate-panel" open>
          <summary class="translate-panel-header">
            <span>原文 ({{ charCount }} 字符)</span>
          </summary>
          <div class="translate-panel-content">{{ originalText }}</div>
        </details>

        <!-- Translated -->
        <details class="translate-panel translated-panel" open>
          <summary class="translate-panel-header">
            <span>译文 ({{ targetLang }})</span>
          </summary>
          <div class="translate-panel-content translated-content">{{ translatedText }}</div>
        </details>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="translateState === 'error'" class="translate-error">
      <AlertCircleIcon :size="32" />
      <p>翻译失败</p>
      <p class="translate-error-hint">请确保文件为文本格式</p>
      <button class="btn btn-secondary" @click="translateState = 'idle'">重试</button>
    </div>
  </div>
</template>

<style scoped>
.ai-translate {
  height: 100%;
}

.translate-header {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}

.translate-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

/* Language selector */
.translate-lang-section {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
}

.translate-lang-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.translate-lang-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.lang-btn {
  padding: 4px 10px;
  border: 1px solid var(--border);
  background: var(--bg-primary);
  border-radius: 20px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.lang-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.lang-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

/* Idle */
.translate-idle {
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.translate-icon-wrap {
  width: 60px;
  height: 60px;
  background: var(--selected-bg);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  margin-bottom: 4px;
}

.translate-idle-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.translate-idle-desc {
  font-size: 12px;
  color: var(--text-muted);
}

.translate-btn {
  margin-top: 8px;
  padding: 8px 20px;
  font-size: 13px;
}

/* Loading */
.translate-loading {
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.translate-progress-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}

.translate-progress-bar {
  flex: 1;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.translate-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #60a5fa);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.translate-progress-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  min-width: 36px;
  text-align: right;
}

.translate-loading-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
}

.translate-loading-info svg {
  color: var(--primary);
}

.translate-loading-info p {
  font-size: 13px;
  color: var(--text-secondary);
}

.translate-char-count {
  font-size: 11px !important;
  color: var(--text-muted) !important;
}

/* Done */
.translate-done {
  display: flex;
  flex-direction: column;
  height: calc(100% - 80px);
}

.translate-actions {
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

.translate-done-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--success);
  font-weight: 500;
}

.translate-copy-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.translate-copy-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Comparison */
.translate-comparison {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.translate-panel {
  border-bottom: 1px solid var(--border);
}

.translate-panel-header {
  padding: 8px 14px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  list-style: none;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.translate-panel-content {
  padding: 10px 14px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.7;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
  background: var(--bg-primary);
}

.translated-panel .translate-panel-header {
  background: var(--selected-bg);
  color: var(--primary);
}

.translated-content {
  color: var(--text-primary);
  background: rgba(59, 130, 246, 0.03);
}

/* Error */
.translate-error {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  color: var(--danger);
}

.translate-error p {
  font-size: 14px;
  font-weight: 500;
}

.translate-error-hint {
  font-size: 12px;
  color: var(--text-muted);
}

/* Shared */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}
</style>
