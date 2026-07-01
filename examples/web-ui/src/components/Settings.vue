<script setup lang="ts">
/**
 * 设置面板组件
 * 主题设置、语言设置、快捷键设置、存储设置、缓存管理、关于页面
 */
import { ref, computed, watch, onMounted } from 'vue';
import {
  XIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  GlobeIcon,
  KeyboardIcon,
  DatabaseIcon,
  TrashIcon,
  InfoIcon,
  ChevronRightIcon,
  CheckIcon,
  AlertTriangleIcon,
} from 'lucide-vue-next';
import { useKeyboardShortcuts, formatShortcut, defaultShortcutGroups } from '../composables/useKeyboardShortcuts';
import { storage } from '../utils/helpers';
import type { PreviewTheme } from '@open-file-viewer/core';

// Props
const props = defineProps<{
  visible: boolean;
  currentTheme: PreviewTheme;
  currentLanguage?: string;
}>();

// Emits
const emit = defineEmits<{
  close: [];
  'update:theme': [theme: PreviewTheme];
  'update:language': [lang: string];
}>();

// 快捷键
const { formatShortcut: formatKey, defaultShortcutGroups } = useKeyboardShortcuts();

// 当前激活的标签页
const activeTab = ref<'appearance' | 'shortcuts' | 'storage' | 'about'>('appearance');

// 主题选项
const themeOptions = [
  { value: 'light', label: '浅色模式', icon: SunIcon },
  { value: 'dark', label: '深色模式', icon: MoonIcon },
  { value: 'auto', label: '跟随系统', icon: MonitorIcon },
];

// 语言选项
const languageOptions = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en-US', label: 'English' },
  { value: 'ja-JP', label: '日本語' },
  { value: 'ko-KR', label: '한국어' },
];

// 存储使用情况
const storageInfo = ref({
  used: 0,
  total: 5 * 1024 * 1024, // 5MB 估算
  files: 0,
});

// 缓存大小
const cacheSize = ref('0 KB');

// 计算存储使用百分比
const storagePercentage = computed(() => {
  return Math.round((storageInfo.value.used / storageInfo.value.total) * 100);
});

// 格式化存储大小
const formatStorageSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

// 应用信息
const appInfo = {
  name: '文件浏览器',
  version: '1.0.0',
  description: '基于 Open File Viewer 的 Web 文件浏览器',
  author: 'Open File Viewer Team',
  homepage: 'https://github.com/open-file-viewer',
};

// 快捷键提示（悬停显示）
const showShortcutHint = ref(false);
const shortcutHintPosition = ref({ x: 0, y: 0 });
const hoveredShortcut = ref<string | null>(null);

// 处理主题变更
const handleThemeChange = (theme: PreviewTheme) => {
  emit('update:theme', theme);
};

// 处理语言变更
const handleLanguageChange = (lang: string) => {
  emit('update:language', lang);
};

// 清除缓存
const clearCache = async () => {
  try {
    // 清除 localStorage 中的缓存数据
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('cache_') || key?.startsWith('preview_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // 清除 URL.revokeObjectURL 创建的 URL
    // 注意：这需要应用层配合追踪创建的 URL
    
    cacheSize.value = '0 KB';
  } catch (error) {
    console.error('Clear cache failed:', error);
  }
};

// 清除所有数据
const clearAllData = () => {
  if (confirm('确定要清除所有数据吗？这将删除所有存储的文件和设置。')) {
    localStorage.clear();
    sessionStorage.clear();
    storageInfo.value = { used: 0, total: 5 * 1024 * 1024, files: 0 };
    cacheSize.value = '0 KB';
  }
};

// 导出设置
const exportSettings = () => {
  const settings = {
    theme: props.currentTheme,
    language: props.currentLanguage,
    shortcuts: [], // 可以导出自定义快捷键
    exportDate: new Date().toISOString(),
  };
  
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `file-viewer-settings-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// 导入设置
const importSettings = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const settings = JSON.parse(text);
      
      if (settings.theme) {
        emit('update:theme', settings.theme);
      }
      if (settings.language) {
        emit('update:language', settings.language);
      }
    } catch (error) {
      console.error('Import settings failed:', error);
    }
  };
  input.click();
};

// 显示快捷键提示
const handleShortcutHover = (shortcut: string, event: MouseEvent) => {
  hoveredShortcut.value = shortcut;
  shortcutHintPosition.value = { x: event.clientX, y: event.clientY + 24 };
  showShortcutHint.value = true;
};

// 隐藏快捷键提示
const hideShortcutHint = () => {
  showShortcutHint.value = false;
  hoveredShortcut.value = null;
};

// 监听标签页变化，重置滚动位置
watch(activeTab, () => {
  const content = document.querySelector('.settings-content');
  if (content) {
    content.scrollTop = 0;
  }
});

// 计算存储使用情况
onMounted(() => {
  try {
    let totalSize = 0;
    const fileKeys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
          if (key.startsWith('file_')) {
            fileKeys.push(key);
          }
        }
      }
    }
    
    storageInfo.value = {
      used: totalSize,
      total: 5 * 1024 * 1024,
      files: fileKeys.length,
    };
  } catch (error) {
    console.error('Get storage info failed:', error);
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="settings-overlay" @click.self="emit('close')">
        <div class="settings-modal" role="dialog" aria-labelledby="settings-title">
          <!-- 头部 -->
          <header class="settings-header">
            <h2 id="settings-title" class="settings-title">设置</h2>
            <button class="settings-close" @click="emit('close')" aria-label="关闭">
              <XIcon :size="20" />
            </button>
          </header>

          <!-- 内容 -->
          <div class="settings-body">
            <!-- 侧边栏 -->
            <nav class="settings-nav">
              <button
                :class="['nav-item', { active: activeTab === 'appearance' }]"
                @click="activeTab = 'appearance'"
              >
                <SunIcon :size="18" />
                <span>外观</span>
              </button>
              <button
                :class="['nav-item', { active: activeTab === 'shortcuts' }]"
                @click="activeTab = 'shortcuts'"
              >
                <KeyboardIcon :size="18" />
                <span>快捷键</span>
              </button>
              <button
                :class="['nav-item', { active: activeTab === 'storage' }]"
                @click="activeTab = 'storage'"
              >
                <DatabaseIcon :size="18" />
                <span>存储</span>
              </button>
              <button
                :class="['nav-item', { active: activeTab === 'about' }]"
                @click="activeTab = 'about'"
              >
                <InfoIcon :size="18" />
                <span>关于</span>
              </button>
            </nav>

            <!-- 内容区 -->
            <div class="settings-content">
              <!-- 外观设置 -->
              <section v-if="activeTab === 'appearance'" class="settings-section">
                <h3 class="section-title">主题</h3>
                <div class="theme-options">
                  <button
                    v-for="option in themeOptions"
                    :key="option.value"
                    :class="['theme-option', { active: currentTheme === option.value }]"
                    @click="handleThemeChange(option.value as PreviewTheme)"
                  >
                    <component :is="option.icon" :size="24" class="theme-icon" />
                    <span class="theme-label">{{ option.label }}</span>
                    <CheckIcon v-if="currentTheme === option.value" :size="16" class="theme-check" />
                  </button>
                </div>

                <h3 class="section-title">语言</h3>
                <div class="language-options">
                  <button
                    v-for="option in languageOptions"
                    :key="option.value"
                    :class="['language-option', { active: currentLanguage === option.value }]"
                    @click="handleLanguageChange(option.value)"
                  >
                    <GlobeIcon :size="16" />
                    <span>{{ option.label }}</span>
                    <CheckIcon v-if="currentLanguage === option.value" :size="16" class="check-icon" />
                  </button>
                </div>
              </section>

              <!-- 快捷键设置 -->
              <section v-if="activeTab === 'shortcuts'" class="settings-section">
                <h3 class="section-title">键盘快捷键</h3>
                <div class="shortcuts-intro">
                  <p>使用快捷键可以提高操作效率。以下是所有可用的快捷键：</p>
                  <p class="shortcut-hint">
                    <kbd>Ctrl</kbd> 在 macOS 上对应 <kbd>⌘</kbd>
                  </p>
                </div>

                <div v-for="group in defaultShortcutGroups" :key="group.name" class="shortcut-group">
                  <h4 class="group-title">{{ group.nameZh }}</h4>
                  <div class="shortcut-list">
                    <div
                      v-for="shortcut in group.shortcuts"
                      :key="shortcut.description"
                      class="shortcut-item"
                      @mouseenter="handleShortcutHover(shortcut.descriptionZh || shortcut.description, $event)"
                      @mouseleave="hideShortcutHint"
                    >
                      <span class="shortcut-desc">
                        {{ shortcut.descriptionZh || shortcut.description }}
                      </span>
                      <kbd class="shortcut-key">
                        {{ formatKey(shortcut) }}
                      </kbd>
                    </div>
                  </div>
                </div>
              </section>

              <!-- 存储设置 -->
              <section v-if="activeTab === 'storage'" class="settings-section">
                <h3 class="section-title">存储使用</h3>
                <div class="storage-overview">
                  <div class="storage-bar">
                    <div class="storage-used" :style="{ width: `${storagePercentage}%` }"></div>
                  </div>
                  <p class="storage-text">
                    已使用 {{ formatStorageSize(storageInfo.used) }} / {{ formatStorageSize(storageInfo.total) }}
                    <span v-if="storageInfo.files > 0"> ({{ storageInfo.files }} 个文件)</span>
                  </p>
                </div>

                <div class="storage-actions">
                  <button class="action-btn" @click="clearCache">
                    <TrashIcon :size="16" />
                    <span>清除缓存</span>
                    <span class="action-desc">{{ cacheSize }}</span>
                  </button>
                  <button class="action-btn action-btn--danger" @click="clearAllData">
                    <TrashIcon :size="16" />
                    <span>清除所有数据</span>
                    <AlertTriangleIcon :size="14" class="danger-icon" />
                  </button>
                </div>

                <h3 class="section-title">导入/导出</h3>
                <div class="import-export">
                  <button class="action-btn" @click="exportSettings">
                    <span>导出设置</span>
                  </button>
                  <button class="action-btn" @click="importSettings">
                    <span>导入设置</span>
                  </button>
                </div>
              </section>

              <!-- 关于页面 -->
              <section v-if="activeTab === 'about'" class="settings-section">
                <div class="about-header">
                  <div class="about-logo">
                    <MonitorIcon :size="48" />
                  </div>
                  <h3 class="about-name">{{ appInfo.name }}</h3>
                  <p class="about-version">版本 {{ appInfo.version }}</p>
                </div>

                <p class="about-desc">{{ appInfo.description }}</p>

                <div class="about-links">
                  <a :href="appInfo.homepage" target="_blank" rel="noopener noreferrer" class="about-link">
                    <span>访问主页</span>
                    <ChevronRightIcon :size="16" />
                  </a>
                </div>

                <div class="about-credits">
                  <p>由 {{ appInfo.author }} 开发</p>
                  <p class="copyright">© {{ new Date().getFullYear() }} Open File Viewer</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 遮罩层 */
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

/* 弹窗 */
.settings-modal {
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  background: var(--bg-primary, #ffffff);
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 头部 */
.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, #e2e8f0);
}

.settings-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin: 0;
}

.settings-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text-muted, #94a3b8);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.settings-close:hover {
  background: var(--bg-tertiary, #f1f5f9);
  color: var(--text-primary, #1e293b);
}

/* 主体 */
.settings-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 侧边栏 */
.settings-nav {
  width: 180px;
  padding: 12px;
  background: var(--bg-secondary, #f8fafc);
  border-right: 1px solid var(--border, #e2e8f0);
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  color: var(--text-secondary, #64748b);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.nav-item:hover {
  background: var(--bg-tertiary, #f1f5f9);
  color: var(--text-primary, #1e293b);
}

.nav-item.active {
  background: var(--primary, #3b82f6);
  color: white;
}

/* 内容区 */
.settings-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.settings-section {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin: 0 0 16px;
}

/* 主题选项 */
.theme-options {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.theme-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 2px solid var(--border, #e2e8f0);
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.theme-option:hover {
  border-color: var(--primary, #3b82f6);
  background: var(--bg-secondary, #f8fafc);
}

.theme-option.active {
  border-color: var(--primary, #3b82f6);
  background: var(--selected-bg, #dbeafe);
}

.theme-icon {
  color: var(--text-secondary, #64748b);
}

.theme-option.active .theme-icon {
  color: var(--primary, #3b82f6);
}

.theme-label {
  font-size: 13px;
  color: var(--text-primary, #1e293b);
}

.theme-check {
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--primary, #3b82f6);
}

/* 语言选项 */
.language-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 8px;
  background: transparent;
  color: var(--text-primary, #1e293b);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.language-option:hover {
  background: var(--bg-secondary, #f8fafc);
  border-color: var(--primary, #3b82f6);
}

.language-option.active {
  background: var(--selected-bg, #dbeafe);
  border-color: var(--primary, #3b82f6);
}

.language-option .check-icon {
  margin-left: auto;
  color: var(--primary, #3b82f6);
}

/* 快捷键 */
.shortcuts-intro {
  margin-bottom: 20px;
  color: var(--text-secondary, #64748b);
  font-size: 13px;
  line-height: 1.6;
}

.shortcut-hint {
  margin-top: 8px;
  font-size: 12px;
}

.shortcut-hint kbd {
  padding: 2px 6px;
  background: var(--bg-secondary, #f8fafc);
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 4px;
  font-family: inherit;
  font-size: 11px;
}

.shortcut-group {
  margin-bottom: 24px;
}

.group-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted, #94a3b8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px;
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--bg-secondary, #f8fafc);
  border-radius: 8px;
}

.shortcut-desc {
  font-size: 13px;
  color: var(--text-primary, #1e293b);
}

.shortcut-key {
  padding: 4px 8px;
  background: var(--bg-primary, #ffffff);
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 4px;
  font-family: inherit;
  font-size: 12px;
  color: var(--text-secondary, #64748b);
}

/* 存储 */
.storage-overview {
  margin-bottom: 24px;
}

.storage-bar {
  height: 8px;
  background: var(--bg-tertiary, #e5e7eb);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.storage-used {
  height: 100%;
  background: var(--primary, #3b82f6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.storage-text {
  font-size: 12px;
  color: var(--text-muted, #94a3b8);
}

.storage-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 8px;
  background: var(--bg-primary, #ffffff);
  color: var(--text-primary, #1e293b);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.action-btn:hover {
  background: var(--bg-secondary, #f8fafc);
  border-color: var(--primary, #3b82f6);
}

.action-btn--danger {
  color: var(--danger, #ef4444);
}

.action-btn--danger:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--danger, #ef4444);
}

.action-desc {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-muted, #94a3b8);
}

.danger-icon {
  margin-left: auto;
  color: var(--danger, #ef4444);
}

.import-export {
  display: flex;
  gap: 12px;
}

.import-export .action-btn {
  flex: 1;
  justify-content: center;
}

/* 关于 */
.about-header {
  text-align: center;
  margin-bottom: 24px;
}

.about-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: var(--bg-secondary, #f8fafc);
  border-radius: 20px;
  margin-bottom: 16px;
  color: var(--primary, #3b82f6);
}

.about-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin: 0 0 4px;
}

.about-version {
  font-size: 14px;
  color: var(--text-muted, #94a3b8);
  margin: 0;
}

.about-desc {
  text-align: center;
  color: var(--text-secondary, #64748b);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.about-links {
  margin-bottom: 24px;
}

.about-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: var(--bg-secondary, #f8fafc);
  border-radius: 8px;
  color: var(--primary, #3b82f6);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
}

.about-link:hover {
  background: var(--selected-bg, #dbeafe);
}

.about-credits {
  text-align: center;
  font-size: 12px;
  color: var(--text-muted, #94a3b8);
}

.copyright {
  margin-top: 4px;
}

/* 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .settings-modal,
.modal-leave-active .settings-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .settings-modal,
.modal-leave-to .settings-modal {
  transform: scale(0.95);
  opacity: 0;
}

/* 响应式 */
@media (max-width: 640px) {
  .settings-body {
    flex-direction: column;
  }

  .settings-nav {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--border, #e2e8f0);
  }

  .nav-item {
    flex-shrink: 0;
  }

  .theme-options {
    flex-direction: column;
  }
}

/* 暗色模式 */
[data-theme="dark"] .settings-nav {
  background: var(--bg-secondary, #1e293b);
}

[data-theme="dark"] .nav-item:hover {
  background: var(--bg-tertiary, #334155);
}

[data-theme="dark"] .theme-option:hover,
[data-theme="dark"] .action-btn:hover {
  background: var(--bg-tertiary, #334155);
}

[data-theme="dark"] .storage-bar {
  background: var(--bg-tertiary, #334155);
}

[data-theme="dark"] .about-logo,
[data-theme="dark"] .about-link {
  background: var(--bg-secondary, #1e293b);
}

[data-theme="dark"] .about-link:hover {
  background: var(--bg-tertiary, #334155);
}

[data-theme="dark"] .shortcut-item {
  background: var(--bg-secondary, #1e293b);
}

[data-theme="dark"] .shortcut-key {
  background: var(--bg-tertiary, #334155);
  border-color: var(--border, #475569);
}
</style>
