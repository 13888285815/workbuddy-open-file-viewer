<template>
  <div class="dynamic-sidebar">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索功能..."
        class="search-input"
      />
      <span class="search-icon">🔍</span>
    </div>

    <!-- 树形结构 -->
    <div class="tree-container">
      <div
        v-for="module in filteredModules"
        :key="module.id"
        class="module-item"
      >
        <!-- 模块标题 -->
        <div
          class="module-header"
          @click="toggleModule(module.id)"
        >
          <span class="module-icon">{{ module.icon }}</span>
          <span class="module-label">{{ module.label }}</span>
          <span class="module-toggle">
            {{ module.expanded ? '▼' : '▶' }}
          </span>
        </div>

        <!-- 模块子项 -->
        <div v-if="module.expanded" class="module-children">
          <div
            v-for="child in module.children"
            :key="child.id"
            class="tree-item"
            :class="{ active: activeItem === child.id }"
            @click="selectItem(child)"
          >
            <span class="item-icon">{{ child.icon || '📄' }}</span>
            <span class="item-label">{{ child.label }}</span>
            <span v-if="child.count !== undefined" class="item-count">
              {{ child.count }}
            </span>
            <span v-if="child.badge" class="item-badge">
              {{ child.badge }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="sidebar-footer">
      <div class="version">v{{ config?.version }}</div>
      <div class="update-time">
        更新: {{ formatDate(config?.lastUpdate) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SidebarModule, SidebarItem } from './types'

const props = defineProps<{
  activeItem?: string
}>()

const emit = defineEmits<{
  (e: 'select', item: SidebarItem): void
}>()

const searchQuery = ref('')
const config = ref<{ modules: SidebarModule[] } | null>(null)
const activeItem = ref(props.activeItem || '')

// 加载配置
onMounted(async () => {
  try {
    const response = await fetch('/src/config/sidebarTree.json')
    config.value = await response.json()
  } catch (error) {
    console.error('Failed to load sidebar config:', error)
  }
})

// 切换模块展开状态
const toggleModule = (moduleId: string) => {
  if (!config.value) return
  const module = config.value.modules.find(m => m.id === moduleId)
  if (module) {
    module.expanded = !module.expanded
  }
}

// 选择项目
const selectItem = (item: SidebarItem) => {
  activeItem.value = item.id
  emit('select', item)
}

// 过滤模块（搜索功能）
const filteredModules = computed(() => {
  if (!config.value) return []
  if (!searchQuery.value) return config.value.modules

  const query = searchQuery.value.toLowerCase()
  return config.value.modules
    .map(module => ({
      ...module,
      children: module.children?.filter(child =>
        child.label.toLowerCase().includes(query) ||
        child.id.toLowerCase().includes(query)
      )
    }))
    .filter(module => module.children && module.children.length > 0)
})

// 格式化日期
const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.dynamic-sidebar {
  width: 280px;
  height: 100%;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-box {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 32px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.module-item {
  margin-bottom: 4px;
}

.module-header {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s;
  user-select: none;
}

.module-header:hover {
  background: var(--bg-hover);
}

.module-icon {
  font-size: 18px;
  margin-right: 8px;
}

.module-label {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.module-toggle {
  font-size: 12px;
  color: var(--text-secondary);
}

.module-children {
  padding-left: 12px;
}

.tree-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-left: 3px solid transparent;
}

.tree-item:hover {
  background: var(--bg-hover);
}

.tree-item.active {
  background: var(--bg-active);
  border-left-color: var(--primary-color);
}

.item-icon {
  font-size: 16px;
  margin-right: 8px;
}

.item-label {
  flex: 1;
  font-size: 13px;
  color: var(--text-primary);
}

.item-count {
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 10px;
}

.item-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.item-badge:contains('NEW') {
  background: #4caf50;
  color: white;
}

.item-badge:contains('HOT') {
  background: #f44336;
  color: white;
}

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}

.version {
  font-weight: 600;
  margin-bottom: 4px;
}

.update-time {
  font-size: 11px;
}
</style>
