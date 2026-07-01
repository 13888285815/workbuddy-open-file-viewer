<script setup lang="ts">
import { ref, computed } from "vue";
import {
  SparklesIcon,
  FileTextIcon,
  LanguagesIcon,
  MessageCircleIcon,
  SearchIcon,
  InfoIcon,
  XIcon,
  ChevronRightIcon,
  LoaderIcon
} from "lucide-vue-next";
import AISummary from "./AISummary.vue";
import AITranslate from "./AITranslate.vue";
import AIQA from "./AIQA.vue";
import SmartSearch from "./SmartSearch.vue";
import FileInfo from "./FileInfo.vue";

export interface AIPanelFile {
  name: string;
  type: string;
  mimeType?: string;
  size?: number;
  modified?: Date;
  path: string;
  previewUrl?: string;
  file?: File;
}

type TabType = "summary" | "translate" | "qa" | "search" | "info";

const props = defineProps<{
  file: AIPanelFile | null;
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const activeTab = ref<TabType>("summary");

const tabs: { id: TabType; label: string; icon: typeof SparklesIcon }[] = [
  { id: "summary", label: "摘要", icon: FileTextIcon },
  { id: "translate", label: "翻译", icon: LanguagesIcon },
  { id: "qa", label: "问答", icon: MessageCircleIcon },
  { id: "search", label: "搜索", icon: SearchIcon },
  { id: "info", label: "详情", icon: InfoIcon }
];

const activeTabData = computed(() => tabs.find((t) => t.id === activeTab.value));

const selectTab = (id: TabType) => {
  activeTab.value = id;
};
</script>

<template>
  <div v-if="visible" class="ai-panel">
    <!-- Header -->
    <div class="ai-panel-header">
      <div class="ai-panel-title">
        <SparklesIcon :size="18" />
        <span>AI 智能助手</span>
      </div>
      <button class="ai-panel-close" @click="emit('close')">
        <XIcon :size="18" />
      </button>
    </div>

    <!-- Tab Navigation -->
    <div class="ai-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['ai-tab', { active: activeTab === tab.id }]"
        :title="tab.label"
        @click="selectTab(tab.id)"
      >
        <component :is="tab.icon" :size="16" />
        <span class="ai-tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Content -->
    <div class="ai-panel-content">
      <template v-if="file">
        <AISummary v-if="activeTab === 'summary'" :file="file" />
        <AITranslate v-else-if="activeTab === 'translate'" :file="file" />
        <AIQA v-else-if="activeTab === 'qa'" :file="file" />
        <SmartSearch v-else-if="activeTab === 'search'" :file="file" />
        <FileInfo v-else-if="activeTab === 'info'" :file="file" />
      </template>
      <div v-else class="ai-empty">
        <SparklesIcon :size="40" />
        <p>选择文件后开启 AI 智能功能</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-panel {
  width: 360px;
  height: 100%;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}

.ai-panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-primary);
  flex-shrink: 0;
}

.ai-panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.ai-panel-title svg {
  color: var(--primary);
}

.ai-panel-close {
  width: 28px;
  height: 28px;
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

.ai-panel-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Tabs */
.ai-tabs {
  display: flex;
  padding: 6px 8px;
  gap: 2px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  overflow-x: auto;
}

.ai-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 4px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 11px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
  min-width: 0;
}

.ai-tab:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.ai-tab.active {
  background: var(--selected-bg);
  color: var(--primary);
}

.ai-tab-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Content */
.ai-panel-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Empty State */
.ai-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 12px;
  padding: 32px;
  text-align: center;
}

.ai-empty svg {
  opacity: 0.4;
}

.ai-empty p {
  font-size: 13px;
  line-height: 1.5;
}
</style>
