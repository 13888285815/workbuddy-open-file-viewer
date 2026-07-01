<script setup lang="ts">
import { ref, watch } from "vue";
import { FileTextIcon, RefreshCwIcon, CheckCircleIcon, LoaderIcon, AlertCircleIcon } from "lucide-vue-next";
import type { AIPanelFile } from "./AIPanel.vue";

const props = defineProps<{
  file: AIPanelFile;
}>();

type SummaryState = "idle" | "loading" | "done" | "error";

const state = ref<SummaryState>("idle");
const summary = ref("");
const keyPoints = ref<string[]>([]);
const oneLiner = ref("");
const wordCount = ref(0);
const readingTime = ref("");

// Simulate AI analysis
const analyzeFile = async () => {
  if (!props.file.file) {
    state.value = "error";
    return;
  }

  state.value = "loading";

  try {
    const content = await props.file.file.text();
    wordCount.value = content.split(/\s+/).filter(Boolean).length;
    readingTime.value = Math.ceil(wordCount.value / 200) + " 分钟";

    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 1500));

    // Mock AI response based on content
    if (content.length > 100) {
      const sentences = content.split(/[.。!！?？\n]/).filter((s) => s.trim().length > 10);
      const topSentences = sentences.slice(0, 5);

      oneLiner.value = `该文档共 ${wordCount.value} 字，${sentences.length} 个句子，涵盖主要内容。`;
      keyPoints.value = topSentences.map((s, i) => `要点 ${i + 1}：${s.trim().slice(0, 80)}${s.trim().length > 80 ? "..." : ""}`);
      summary.value = `本文档为「${props.file.name}」，${oneLiner.value}\n\n【详细内容】\n${topSentences.join("\n\n")}`;
    } else {
      oneLiner.value = "文档内容较少，无法提取详细摘要。";
      keyPoints.value = ["文档内容简短"];
      summary.value = `「${props.file.name}」是一个短文档，内容简洁直接。`;
    }

    state.value = "done";
  } catch {
    state.value = "error";
  }
};

const reload = () => {
  state.value = "idle";
  summary.value = "";
  keyPoints.value = [];
  oneLiner.value = "";
  analyzeFile();
};

watch(
  () => props.file,
  () => {
    state.value = "idle";
    summary.value = "";
    keyPoints.value = [];
    oneLiner.value = "";
    wordCount.value = 0;
    readingTime.value = "";
  }
);
</script>

<template>
  <div class="ai-summary">
    <!-- Header -->
    <div class="summary-header">
      <div class="summary-title">
        <FileTextIcon :size="16" />
        <span>文档摘要</span>
      </div>
      <button v-if="state !== 'loading'" class="summary-reload" @click="reload">
        <RefreshCwIcon :size="14" />
      </button>
    </div>

    <!-- File Badge -->
    <div class="summary-file-badge">
      <FileTextIcon :size="12" />
      <span>{{ file.name }}</span>
    </div>

    <!-- Idle state -->
    <div v-if="state === 'idle'" class="summary-idle">
      <div class="summary-icon-wrap">
        <FileTextIcon :size="32" />
      </div>
      <p class="summary-idle-title">AI 智能摘要</p>
      <p class="summary-idle-desc">自动分析文档内容，提取关键信息和要点</p>
      <button class="btn btn-primary summary-btn" @click="analyzeFile">
        开始分析
      </button>
    </div>

    <!-- Loading state -->
    <div v-else-if="state === 'loading'" class="summary-loading">
      <div class="summary-spinner">
        <LoaderIcon :size="28" class="spin" />
      </div>
      <p class="summary-loading-text">正在分析文档内容...</p>
      <p class="summary-loading-hint">提取摘要、关键点和统计信息</p>
    </div>

    <!-- Done state -->
    <div v-else-if="state === 'done'" class="summary-done">
      <!-- Stats -->
      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-value">{{ wordCount }}</span>
          <span class="stat-label">字数</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ readingTime }}</span>
          <span class="stat-label">阅读时间</span>
        </div>
      </div>

      <!-- One-liner -->
      <div class="summary-one-liner">
        <div class="one-liner-label">一句话总结</div>
        <p class="one-liner-text">{{ oneLiner }}</p>
      </div>

      <!-- Key Points -->
      <div class="summary-key-points">
        <div class="key-points-label">
          <CheckCircleIcon :size="14" />
          关键要点
        </div>
        <ul class="key-points-list">
          <li v-for="(point, i) in keyPoints" :key="i" class="key-point-item">
            {{ point }}
          </li>
        </ul>
      </div>

      <!-- Full Summary -->
      <details class="summary-full">
        <summary class="summary-full-toggle">展开完整摘要</summary>
        <div class="summary-full-content">{{ summary }}</div>
      </details>
    </div>

    <!-- Error state -->
    <div v-else-if="state === 'error'" class="summary-error">
      <AlertCircleIcon :size="32" />
      <p>无法分析此文件</p>
      <p class="summary-error-hint">仅支持文本类文件</p>
      <button class="btn btn-secondary" @click="reload">重试</button>
    </div>
  </div>
</template>

<style scoped>
.ai-summary {
  padding: 0;
  height: 100%;
}

.summary-header {
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.summary-reload {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.summary-reload:hover {
  background: var(--bg-tertiary);
  color: var(--primary);
}

.summary-file-badge {
  margin: 10px 14px 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: var(--selected-bg);
  border-radius: 20px;
  font-size: 11px;
  color: var(--primary);
  max-width: 100%;
  overflow: hidden;
}

.summary-file-badge span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Idle */
.summary-idle {
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.summary-icon-wrap {
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

.summary-idle-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.summary-idle-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
}

.summary-btn {
  margin-top: 8px;
  padding: 8px 20px;
  font-size: 13px;
}

/* Loading */
.summary-loading {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.summary-spinner {
  color: var(--primary);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.summary-loading-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.summary-loading-hint {
  font-size: 12px;
  color: var(--text-muted);
}

/* Done */
.summary-done {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Stats */
.summary-stats {
  display: flex;
  align-items: center;
  background: var(--bg-primary);
  border-radius: 10px;
  padding: 12px;
  gap: 0;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border);
}

/* One-liner */
.summary-one-liner {
  background: linear-gradient(135deg, var(--selected-bg), rgba(59, 130, 246, 0.05));
  border-radius: 10px;
  padding: 12px;
  border: 1px solid rgba(59, 130, 246, 0.15);
}

.one-liner-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.one-liner-text {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.6;
}

/* Key Points */
.summary-key-points {
  background: var(--bg-primary);
  border-radius: 10px;
  padding: 12px;
}

.key-points-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.key-points-label svg {
  color: var(--success);
}

.key-points-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.key-point-item {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  padding: 6px 10px;
  background: var(--bg-secondary);
  border-radius: 6px;
  border-left: 3px solid var(--primary);
}

/* Full Summary */
.summary-full {
  background: var(--bg-primary);
  border-radius: 10px;
  overflow: hidden;
}

.summary-full-toggle {
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 6px;
}

.summary-full-toggle::before {
  content: "▶";
  font-size: 9px;
  transition: transform 0.2s;
}

details[open] .summary-full-toggle::before {
  transform: rotate(90deg);
}

.summary-full-content {
  padding: 0 14px 14px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.7;
  white-space: pre-wrap;
  border-top: 1px solid var(--border);
  padding-top: 10px;
}

/* Error */
.summary-error {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  color: var(--danger);
}

.summary-error p:first-of-type {
  font-size: 14px;
  font-weight: 500;
}

.summary-error-hint {
  font-size: 12px;
  color: var(--text-muted);
}

/* Shared btn */
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
