<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  SearchIcon,
  XIcon,
  ClockIcon,
  FilterIcon,
  FileTextIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LoaderIcon,
  HashIcon,
  HighlighterIcon
} from "lucide-vue-next";
import type { AIPanelFile } from "./AIPanel.vue";

const props = defineProps<{
  file: AIPanelFile;
}>();

interface SearchResult {
  id: string;
  line: number;
  text: string;
  context: string;
  highlight: boolean;
}

interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
}

interface AdvancedFilters {
  dateFrom: string;
  dateTo: string;
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
}

const query = ref("");
const results = ref<SearchResult[]>([]);
const isSearching = ref(false);
const searched = ref(false);
const history = ref<SearchHistory[]>([]);
const showAdvanced = ref(false);
const filters = ref<AdvancedFilters>({
  dateFrom: "",
  dateTo: "",
  caseSensitive: false,
  wholeWord: false,
  regex: false
});
const matchedCount = ref(0);

const fileContent = ref("");

const loadContent = async () => {
  if (props.file.file) {
    fileContent.value = await props.file.file.text();
  }
};

const doSearch = async () => {
  if (!query.value.trim()) return;

  isSearching.value = true;
  searched.value = true;

  // Add to history
  const existing = history.value.findIndex((h) => h.query === query.value);
  if (existing >= 0) {
    history.value.splice(existing, 1);
  }
  history.value.unshift({
    id: `hist-${Date.now()}`,
    query: query.value,
    timestamp: new Date()
  });
  if (history.value.length > 10) history.value.pop();

  // Simulate search delay
  await new Promise((r) => setTimeout(r, 500));

  const q = query.value;
  const lines = fileContent.value.split("\n");
  const found: SearchResult[] = [];

  let idx = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = filters.value.caseSensitive
      ? line.includes(q)
      : line.toLowerCase().includes(q.toLowerCase());

    if (match) {
      idx++;
      found.push({
        id: `result-${i}`,
        line: i + 1,
        text: line.trim(),
        context: `第 ${i + 1} 行`,
        highlight: true
      });
    }
  }

  results.value = found;
  matchedCount.value = found.length;
  isSearching.value = false;
};

const clearSearch = () => {
  query.value = "";
  results.value = [];
  searched.value = false;
  matchedCount.value = 0;
};

const useHistory = (h: SearchHistory) => {
  query.value = h.query;
  doSearch();
};

const removeHistory = (h: SearchHistory) => {
  history.value = history.value.filter((item) => item.id !== h.id);
};

const highlightMatch = (text: string) => {
  if (!query.value) return text;
  const q = query.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${q})`, "gi");
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
};

watch(
  () => props.file,
  () => {
    results.value = [];
    searched.value = false;
    loadContent();
  },
  { immediate: true }
);
</script>

<template>
  <div class="smart-search">
    <!-- Header -->
    <div class="search-header">
      <div class="search-title">
        <SearchIcon :size="16" />
        <span>智能搜索</span>
      </div>
    </div>

    <!-- Search Box -->
    <div class="search-box-wrap">
      <div class="search-box">
        <SearchIcon :size="15" />
        <input
          v-model="query"
          type="text"
          class="search-input-inner"
          placeholder="搜索文档内容..."
          @keyup.enter="doSearch"
        />
        <button v-if="query" class="search-clear-btn" @click="clearSearch">
          <XIcon :size="14" />
        </button>
        <button class="search-go-btn" :disabled="!query.trim()" @click="doSearch">
          搜索
        </button>
      </div>

      <!-- Advanced toggle -->
      <button class="search-advanced-toggle" @click="showAdvanced = !showAdvanced">
        <FilterIcon :size="13" />
        高级筛选
        <ChevronDownIcon v-if="!showAdvanced" :size="13" />
        <ChevronUpIcon v-else :size="13" />
      </button>

      <!-- Advanced filters -->
      <div v-if="showAdvanced" class="search-advanced">
        <label class="search-filter-row">
          <input v-model="filters.caseSensitive" type="checkbox" class="search-checkbox" />
          <span>区分大小写</span>
        </label>
        <label class="search-filter-row">
          <input v-model="filters.wholeWord" type="checkbox" class="search-checkbox" />
          <span>全字匹配</span>
        </label>
        <label class="search-filter-row">
          <input v-model="filters.regex" type="checkbox" class="search-checkbox" />
          <span>正则表达式</span>
        </label>
        <div class="search-date-row">
          <CalendarIcon :size="12" />
          <input v-model="filters.dateFrom" type="date" class="search-date-input" />
          <span>至</span>
          <input v-model="filters.dateTo" type="date" class="search-date-input" />
        </div>
      </div>
    </div>

    <!-- Results area -->
    <div class="search-results-area">
      <!-- Idle state -->
      <div v-if="!searched && results.length === 0" class="search-idle">
        <div class="search-idle-icon">
          <HighlighterIcon :size="28" />
        </div>
        <p class="search-idle-title">全文搜索</p>
        <p class="search-idle-desc">输入关键词在当前文档中搜索</p>

        <!-- History -->
        <div v-if="history.length > 0" class="search-history">
          <p class="search-history-label">
            <ClockIcon :size="12" />
            搜索历史
          </p>
          <div class="search-history-list">
            <div
              v-for="h in history"
              :key="h.id"
              class="search-history-item"
              @click="useHistory(h)"
            >
              <ClockIcon :size="12" />
              <span>{{ h.query }}</span>
              <button class="history-remove" @click.stop="removeHistory(h)">
                <XIcon :size="11" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Searching -->
      <div v-else-if="isSearching" class="search-loading">
        <LoaderIcon :size="24" class="spin" />
        <p>正在搜索...</p>
      </div>

      <!-- Results -->
      <div v-else-if="results.length > 0" class="search-results">
        <div class="search-results-header">
          <span class="search-results-count">
            找到 {{ matchedCount }} 处匹配
          </span>
        </div>
        <div class="search-results-list">
          <div
            v-for="result in results"
            :key="result.id"
            class="search-result-item"
          >
            <div class="search-result-meta">
              <span class="search-result-line">
                <HashIcon :size="11" />
                第 {{ result.line }} 行
              </span>
            </div>
            <div class="search-result-text" v-html="highlightMatch(result.text)"></div>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div v-else-if="searched && results.length === 0" class="search-no-results">
        <SearchIcon :size="32" />
        <p>未找到「{{ query }}」的匹配项</p>
        <p class="search-no-hint">尝试其他关键词或调整筛选条件</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.smart-search {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-header {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.search-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

/* Search box */
.search-box-wrap {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0 8px;
  transition: all 0.2s;
}

.search-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-box svg {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input-inner {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px 4px;
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  min-width: 0;
}

.search-input-inner::placeholder {
  color: var(--text-muted);
}

.search-clear-btn {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--bg-tertiary);
  color: var(--text-muted);
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;
}

.search-clear-btn:hover {
  background: var(--border);
  color: var(--text-primary);
}

.search-go-btn {
  padding: 5px 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.search-go-btn:hover:not(:disabled) {
  background: var(--primary-hover);
}

.search-go-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Advanced toggle */
.search-advanced-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border: none;
  background: transparent;
  font-size: 11px;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  width: fit-content;
  transition: all 0.15s;
}

.search-advanced-toggle:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Advanced filters */
.search-advanced {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.search-filter-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
}

.search-checkbox {
  accent-color: var(--primary);
  width: 14px;
  height: 14px;
}

.search-date-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}

.search-date-input {
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 11px;
  background: var(--bg-secondary);
  color: var(--text-primary);
}

/* Results area */
.search-results-area {
  flex: 1;
  overflow-y: auto;
}

/* Idle */
.search-idle {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.search-idle-icon {
  width: 56px;
  height: 56px;
  background: var(--selected-bg);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  margin-bottom: 4px;
}

.search-idle-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.search-idle-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
}

/* History */
.search-history {
  width: 100%;
  text-align: left;
  margin-top: 8px;
}

.search-history-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.search-history-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.search-history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 7px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.search-history-item:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--selected-bg);
}

.search-history-item svg {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-history-item span {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-remove {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0;
  transition: all 0.15s;
}

.search-history-item:hover .history-remove {
  opacity: 1;
}

.history-remove:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

/* Loading */
.search-loading {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
}

.search-loading svg {
  color: var(--primary);
}

.search-loading p {
  font-size: 13px;
  color: var(--text-secondary);
}

/* Results */
.search-results {
  padding: 8px 12px;
}

.search-results-header {
  margin-bottom: 8px;
}

.search-results-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary);
  background: var(--selected-bg);
  padding: 3px 10px;
  border-radius: 10px;
}

.search-results-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.search-result-item {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  transition: all 0.15s;
  cursor: pointer;
}

.search-result-item:hover {
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.search-result-meta {
  margin-bottom: 4px;
}

.search-result-line {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 600;
  color: var(--primary);
  background: var(--selected-bg);
  padding: 2px 7px;
  border-radius: 8px;
}

.search-result-text {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  word-break: break-all;
}

/* Highlight */
:deep(.search-highlight) {
  background: rgba(251, 191, 36, 0.3);
  color: #d97706;
  border-radius: 2px;
  padding: 0 2px;
  font-weight: 600;
}

/* No results */
.search-no-results {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  color: var(--text-muted);
}

.search-no-results p {
  font-size: 14px;
  color: var(--text-secondary);
}

.search-no-hint {
  font-size: 12px !important;
  color: var(--text-muted) !important;
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
