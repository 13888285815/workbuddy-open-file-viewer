<script setup lang="ts">
import { computed } from "vue";
import {
  SearchIcon,
  XIcon,
  UploadIcon,
  ImageIcon,
  FileTextIcon,
  VideoIcon,
  MusicIcon,
  ArchiveIcon,
  EyeIcon,
  SettingsIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  UserIcon,
} from "lucide-vue-next";
import { useFileStore } from "../stores/fileStore";
import type { FilterType, PreviewTheme } from "@open-file-viewer/core";

const store = useFileStore();

const themeOptions: { value: PreviewTheme; label: string; icon: any }[] = [
  { value: "light", label: "浅色", icon: SunIcon },
  { value: "dark", label: "深色", icon: MoonIcon },
  { value: "auto", label: "自动", icon: MonitorIcon },
];

const filterButtons: { value: FilterType; label: string; icon: any }[] = [
  { value: "all", label: "全部", icon: null },
  { value: "image", label: "图片", icon: ImageIcon },
  { value: "document", label: "文档", icon: FileTextIcon },
  { value: "video", label: "视频", icon: VideoIcon },
  { value: "audio", label: "音频", icon: MusicIcon },
  { value: "archive", label: "压缩", icon: ArchiveIcon },
];

const emit = defineEmits<{
  "open-file-picker": [];
}>();

const currentThemeLabel = computed(
  () => themeOptions.find((t) => t.value === store.theme)?.label ?? "浅色"
);

const handleThemeChange = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value as PreviewTheme;
  store.theme = val;
  store.applyTheme();
};
</script>

<template>
  <header class="app-header">
    <!-- Logo -->
    <div class="app-logo">
      <EyeIcon :size="22" />
      <span class="logo-text">文件管理器</span>
    </div>

    <!-- Search -->
    <div class="search-container">
      <div class="search-box">
        <SearchIcon :size="16" class="search-icon" />
        <input
          v-model="store.searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索文件... (Ctrl+F)"
        />
        <button
          v-if="store.searchQuery"
          class="search-clear"
          @click="store.searchQuery = ''"
        >
          <XIcon :size="14" />
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <nav class="filter-tabs" role="tablist" aria-label="文件类型筛选">
      <button
        v-for="btn in filterButtons"
        :key="btn.value"
        role="tab"
        :class="['filter-tab', { active: store.activeFilter === btn.value }]"
        :aria-selected="store.activeFilter === btn.value"
        @click="store.activeFilter = btn.value"
      >
        <component :is="btn.icon" v-if="btn.icon" :size="13" />
        {{ btn.label }}
      </button>
    </nav>

    <!-- Header Actions -->
    <div class="header-actions">
      <!-- Theme Selector -->
      <div class="theme-selector" title="切换主题">
        <MonitorIcon :size="15" />
        <select
          :value="store.theme"
          class="theme-select"
          @change="handleThemeChange"
          aria-label="主题选择"
        >
          <option v-for="opt in themeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- Upload Button -->
      <button class="btn btn-primary" @click="emit('open-file-picker')">
        <UploadIcon :size="15" />
        上传
      </button>

      <!-- User Avatar -->
      <button class="user-avatar" title="用户设置" aria-label="用户设置">
        <UserIcon :size="16" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: var(--header-height);
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  flex-shrink: 0;
  z-index: 100;
  position: relative;
}

/* Logo */
.app-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  color: var(--primary);
}

.logo-text {
  font-weight: 700;
  font-size: 15px;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

/* Search */
.search-container {
  flex: 1;
  max-width: 380px;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0 10px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 7px 8px;
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  min-width: 0;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
}

.search-clear:hover {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 2px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  padding: 3px;
  flex-shrink: 0;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.filter-tab:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.filter-tab.active {
  background: var(--bg-primary);
  color: var(--primary);
  box-shadow: var(--shadow-sm);
  font-weight: 500;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: auto;
}

/* Theme Selector */
.theme-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-secondary);
  cursor: pointer;
  transition: border-color 0.15s;
}

.theme-selector:hover {
  border-color: var(--primary);
}

.theme-select {
  border: none;
  background: transparent;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  outline: none;
  padding: 0;
  appearance: none;
  -webkit-appearance: none;
}

/* User Avatar */
.user-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.user-avatar:hover {
  background: var(--bg-tertiary);
  color: var(--primary);
}

/* Buttons */
.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: none;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

/* Responsive */
@media (max-width: 900px) {
  .logo-text {
    display: none;
  }

  .filter-tabs {
    display: none;
  }
}
</style>
