<script setup lang="ts">
import { ref, computed } from "vue";
import {
  XIcon,
  TagIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  FilterIcon,
  CheckIcon,
  PaletteIcon
} from "lucide-vue-next";

interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
  createdAt: Date;
}

interface FileTag {
  fileId: string;
  tagId: string;
}

interface Props {
  visible: boolean;
  fileId?: string;
  fileName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fileId: "",
  fileName: ""
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "add-tag", fileId: string, tagId: string): void;
  (e: "remove-tag", fileId: string, tagId: string): void;
  (e: "create-tag", tag: Omit<Tag, "id" | "count" | "createdAt">): void;
  (e: "update-tag", tagId: string, updates: Partial<Tag>): void;
  (e: "delete-tag", tagId: string): void;
  (e: "filter-by-tag", tagId: string): void;
}>();

// State
const searchQuery = ref("");
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingTag = ref<Tag | null>(null);
const newTagName = ref("");
const newTagColor = ref("#3b82f6");
const selectedTagIds = ref<Set<string>>(new Set());

// Mock data - Tags
const tags = ref<Tag[]>([
  {
    id: "tag1",
    name: "重要",
    color: "#ef4444",
    count: 15,
    createdAt: new Date("2024-01-15")
  },
  {
    id: "tag2",
    name: "工作",
    color: "#3b82f6",
    count: 42,
    createdAt: new Date("2024-01-20")
  },
  {
    id: "tag3",
    name: "个人",
    color: "#22c55e",
    count: 28,
    createdAt: new Date("2024-02-05")
  },
  {
    id: "tag4",
    name: "待审核",
    color: "#f59e0b",
    count: 8,
    createdAt: new Date("2024-03-10")
  },
  {
    id: "tag5",
    name: "已归档",
    color: "#6b7280",
    count: 35,
    createdAt: new Date("2024-03-25")
  },
  {
    id: "tag6",
    name: "紧急",
    color: "#dc2626",
    count: 5,
    createdAt: new Date("2024-04-01")
  },
  {
    id: "tag7",
    name: "项目A",
    color: "#8b5cf6",
    count: 12,
    createdAt: new Date("2024-04-15")
  },
  {
    id: "tag8",
    name: "参考资料",
    color: "#06b6d4",
    count: 20,
    createdAt: new Date("2024-05-01")
  }
]);

// Mock data - File-Tag relationships
const fileTags = ref<FileTag[]>([
  { fileId: "file1", tagId: "tag1" },
  { fileId: "file1", tagId: "tag2" },
  { fileId: "file2", tagId: "tag3" },
  { fileId: "file3", tagId: "tag2" },
  { fileId: "file3", tagId: "tag4" }
]);

// Color presets
const colorPresets = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16",
  "#22c55e", "#06b6d4", "#3b82f6", "#6366f1",
  "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
  "#6b7280", "#374151", "#1f2937", "#000000"
];

// Filtered tags
const filteredTags = computed(() => {
  let result = [...tags.value];
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(tag => 
      tag.name.toLowerCase().includes(query)
    );
  }
  
  // Sort by count (descending)
  result.sort((a, b) => b.count - a.count);
  
  return result;
});

// Tags for current file
const currentFileTags = computed(() => {
  if (!props.fileId) return [];
  
  const tagIds = fileTags.value
    .filter(ft => ft.fileId === props.fileId)
    .map(ft => ft.tagId);
  
  return tags.value.filter(tag => tagIds.includes(tag.id));
});

// Available tags (not added to current file)
const availableTags = computed(() => {
  if (!props.fileId) return tags.value;
  
  const currentTagIds = new Set(currentFileTags.value.map(t => t.id));
  return tags.value.filter(tag => !currentTagIds.has(tag.id));
});

// Create tag
const createTag = () => {
  if (!newTagName.value.trim()) return;
  
  const newTag: Omit<Tag, "id" | "count" | "createdAt"> = {
    name: newTagName.value.trim(),
    color: newTagColor.value
  };
  
  emit("create-tag", newTag);
  
  // Add to local state (in production this would come from the backend)
  const tag: Tag = {
    id: `tag${Date.now()}`,
    name: newTagName.value.trim(),
    color: newTagColor.value,
    count: 0,
    createdAt: new Date()
  };
  tags.value.push(tag);
  
  // Reset form
  newTagName.value = "";
  newTagColor.value = "#3b82f6";
  showCreateModal.value = false;
};

// Edit tag
const openEditModal = (tag: Tag) => {
  editingTag.value = { ...tag };
  showEditModal.value = true;
};

const updateTag = () => {
  if (!editingTag.value || !editingTag.value.name.trim()) return;
  
  emit("update-tag", editingTag.value.id, {
    name: editingTag.value.name.trim(),
    color: editingTag.value.color
  });
  
  // Update local state
  const index = tags.value.findIndex(t => t.id === editingTag.value!.id);
  if (index >= 0) {
    tags.value[index].name = editingTag.value.name.trim();
    tags.value[index].color = editingTag.value.color;
  }
  
  showEditModal.value = false;
  editingTag.value = null;
};

// Delete tag
const deleteTag = (tagId: string) => {
  if (!confirm("确定要删除这个标签吗？")) return;
  
  emit("delete-tag", tagId);
  
  // Remove from local state
  tags.value = tags.value.filter(t => t.id !== tagId);
  fileTags.value = fileTags.value.filter(ft => ft.tagId !== tagId);
};

// Add tag to file
const addTagToFile = (tagId: string) => {
  if (!props.fileId) return;
  
  emit("add-tag", props.fileId, tagId);
  
  // Update local state
  fileTags.value.push({
    fileId: props.fileId,
    tagId: tagId
  });
  
  const tag = tags.value.find(t => t.id === tagId);
  if (tag) {
    tag.count++;
  }
};

// Remove tag from file
const removeTagFromFile = (tagId: string) => {
  if (!props.fileId) return;
  
  emit("remove-tag", props.fileId, tagId);
  
  // Update local state
  fileTags.value = fileTags.value.filter(
    ft => !(ft.fileId === props.fileId && ft.tagId === tagId)
  );
  
  const tag = tags.value.find(t => t.id === tagId);
  if (tag) {
    tag.count--;
  }
};

// Toggle tag selection
const toggleTagSelection = (tagId: string) => {
  if (selectedTagIds.value.has(tagId)) {
    selectedTagIds.value.delete(tagId);
  } else {
    selectedTagIds.value.add(tagId);
  }
  selectedTagIds.value = new Set(selectedTagIds.value);
};

// Bulk delete
const bulkDelete = () => {
  if (selectedTagIds.value.size === 0) return;
  
  if (!confirm(`确定要删除选中的 ${selectedTagIds.value.size} 个标签吗？`)) return;
  
  for (const tagId of selectedTagIds.value) {
    emit("delete-tag", tagId);
  }
  
  // Update local state
  tags.value = tags.value.filter(t => !selectedTagIds.value.has(t.id));
  fileTags.value = fileTags.value.filter(ft => !selectedTagIds.value.has(ft.tagId));
  
  selectedTagIds.value.clear();
  selectedTagIds.value = new Set();
};

// Filter files by tag
const filterByTag = (tagId: string) => {
  emit("filter-by-tag", tagId);
};

// Close
const close = () => {
  emit("close");
};

// Format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="tags-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <TagIcon :size="20" />
          <h3>标签管理</h3>
          <span v-if="fileName" class="file-indicator">{{ fileName }}</span>
        </div>
        <button class="close-btn" @click="close">
          <XIcon :size="20" />
        </button>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <!-- Search -->
        <div class="search-box">
          <SearchIcon :size="16" />
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜索标签..."
          />
        </div>

        <div class="toolbar-spacer"></div>

        <!-- Actions -->
        <button class="primary-btn" @click="showCreateModal = true">
          <PlusIcon :size="16" />
          新建标签
        </button>
        <button
          class="danger-btn"
          :disabled="selectedTagIds.size === 0"
          @click="bulkDelete"
        >
          <TrashIcon :size="16" />
          删除选中
        </button>
      </div>

      <!-- Current File Tags (if fileId is provided) -->
      <div v-if="fileId && currentFileTags.length > 0" class="current-tags-section">
        <div class="section-header">
          <span>当前文件标签</span>
        </div>
        <div class="current-tags">
          <span
            v-for="tag in currentFileTags"
            :key="tag.id"
            class="tag-badge"
            :style="{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color }"
          >
            <TagIcon :size="12" />
            {{ tag.name }}
            <button
              class="tag-remove"
              @click="removeTagFromFile(tag.id)"
            >
              <XIcon :size="12" />
            </button>
          </span>
        </div>
      </div>

      <!-- Add Tag to File (if fileId is provided) -->
      <div v-if="fileId && availableTags.length > 0" class="add-tag-section">
        <div class="section-header">
          <span>添加标签</span>
        </div>
        <div class="available-tags">
          <button
            v-for="tag in availableTags"
            :key="tag.id"
            class="add-tag-btn"
            :style="{ borderColor: tag.color, color: tag.color }"
            @click="addTagToFile(tag.id)"
          >
            <TagIcon :size="14" />
            {{ tag.name }}
          </button>
        </div>
      </div>

      <!-- Tags List -->
      <div class="tags-list-section">
        <div class="section-header">
          <span>所有标签</span>
          <span class="tag-count">{{ filteredTags.length }} 个标签</span>
        </div>

        <!-- Tag Cloud View -->
        <div class="tag-cloud">
          <button
            v-for="tag in filteredTags"
            :key="tag.id"
            :class="['cloud-tag', { selected: selectedTagIds.has(tag.id) }]"
            :style="{
              backgroundColor: tag.color + '20',
              color: tag.color,
              borderColor: tag.color,
              fontSize: Math.max(12, Math.min(20, 12 + tag.count / 5)) + 'px'
            }"
            @click="toggleTagSelection(tag.id)"
            @dblclick="filterByTag(tag.id)"
          >
            <TagIcon :size="14" />
            {{ tag.name }}
            <span class="tag-count-badge">{{ tag.count }}</span>
          </button>
        </div>

        <!-- Tag Table View -->
        <div class="tag-table-container">
          <table class="tag-table">
            <thead>
              <tr>
                <th class="checkbox-col">
                  <input
                    type="checkbox"
                    :checked="selectedTagIds.size === filteredTags.length && filteredTags.length > 0"
                    @change="selectedTagIds = new Set(selectedTagIds.size === filteredTags.length ? [] : filteredTags.map(t => t.id))"
                  />
                </th>
                <th>标签名称</th>
                <th>颜色</th>
                <th>使用次数</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tag in filteredTags"
                :key="tag.id"
                :class="['tag-row', { selected: selectedTagIds.has(tag.id) }]"
                @click="toggleTagSelection(tag.id)"
              >
                <td class="checkbox-col">
                  <input
                    type="checkbox"
                    :checked="selectedTagIds.has(tag.id)"
                    @click.stop
                    @change="toggleTagSelection(tag.id)"
                  />
                </td>
                <td class="name-cell">
                  <div class="tag-name">
                    <span
                      class="tag-dot"
                      :style="{ backgroundColor: tag.color }"
                    ></span>
                    <span>{{ tag.name }}</span>
                  </div>
                </td>
                <td class="color-cell">
                  <div class="color-preview">
                    <div
                      class="color-swatch"
                      :style="{ backgroundColor: tag.color }"
                    ></div>
                    <span class="color-value">{{ tag.color }}</span>
                  </div>
                </td>
                <td class="count-cell">
                  <span class="count-badge">{{ tag.count }}</span>
                </td>
                <td class="date-cell">
                  {{ formatDate(tag.createdAt) }}
                </td>
                <td class="actions-cell" @click.stop>
                  <button
                    class="row-action-btn"
                    title="编辑"
                    @click="openEditModal(tag)"
                  >
                    <EditIcon :size="16" />
                  </button>
                  <button
                    class="row-action-btn danger"
                    title="删除"
                    @click="deleteTag(tag.id)"
                  >
                    <TrashIcon :size="16" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Tag Modal -->
      <div v-if="showCreateModal" class="sub-modal-overlay" @click.self="showCreateModal = false">
        <div class="sub-modal">
          <div class="sub-modal-header">
            <h4>新建标签</h4>
            <button class="close-btn" @click="showCreateModal = false">
              <XIcon :size="18" />
            </button>
          </div>
          <div class="sub-modal-body">
            <div class="form-group">
              <label class="form-label">标签名称</label>
              <input
                v-model="newTagName"
                type="text"
                class="form-input"
                placeholder="请输入标签名称"
                @keyup.enter="createTag"
              />
            </div>
            <div class="form-group">
              <label class="form-label">标签颜色</label>
              <div class="color-picker">
                <input
                  v-model="newTagColor"
                  type="color"
                  class="color-input"
                />
                <div class="color-presets">
                  <button
                    v-for="color in colorPresets"
                    :key="color"
                    :class="['color-preset-btn', { active: newTagColor === color }]"
                    :style="{ backgroundColor: color }"
                    @click="newTagColor = color"
                  ></button>
                </div>
              </div>
            </div>
          </div>
          <div class="sub-modal-footer">
            <button class="btn-secondary" @click="showCreateModal = false">取消</button>
            <button
              class="btn-primary"
              :disabled="!newTagName.trim()"
              @click="createTag"
            >
              创建
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Tag Modal -->
      <div v-if="showEditModal && editingTag" class="sub-modal-overlay" @click.self="showEditModal = false">
        <div class="sub-modal">
          <div class="sub-modal-header">
            <h4>编辑标签</h4>
            <button class="close-btn" @click="showEditModal = false">
              <XIcon :size="18" />
            </button>
          </div>
          <div class="sub-modal-body">
            <div class="form-group">
              <label class="form-label">标签名称</label>
              <input
                v-model="editingTag.name"
                type="text"
                class="form-input"
                placeholder="请输入标签名称"
                @keyup.enter="updateTag"
              />
            </div>
            <div class="form-group">
              <label class="form-label">标签颜色</label>
              <div class="color-picker">
                <input
                  v-model="editingTag.color"
                  type="color"
                  class="color-input"
                />
                <div class="color-presets">
                  <button
                    v-for="color in colorPresets"
                    :key="color"
                    :class="['color-preset-btn', { active: editingTag.color === color }]"
                    :style="{ backgroundColor: color }"
                    @click="editingTag!.color = color"
                  ></button>
                </div>
              </div>
            </div>
          </div>
          <div class="sub-modal-footer">
            <button class="btn-secondary" @click="showEditModal = false">取消</button>
            <button
              class="btn-primary"
              :disabled="!editingTag.name.trim()"
              @click="updateTag"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.tags-modal {
  background: var(--bg-primary);
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-title svg {
  color: var(--primary);
}

.file-indicator {
  font-size: 12px;
  color: var(--text-muted);
  padding: 4px 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
}

.close-btn {
  width: 32px;
  height: 32px;
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

.close-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Toolbar */
.toolbar {
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-secondary);
  min-width: 250px;
  transition: all 0.15s;
}

.search-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-box svg {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
}

.toolbar-spacer {
  flex: 1;
}

.primary-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: var(--primary);
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}

.primary-btn:hover {
  background: var(--primary-hover);
}

.primary-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.danger-btn {
  padding: 8px 16px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  background: transparent;
  color: #ef4444;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}

.danger-btn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.danger-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Current Tags Section */
.current-tags-section,
.add-tag-section,
.tags-list-section {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.tag-count {
  font-size: 12px;
  color: var(--text-muted);
}

.current-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}

.tag-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tag-remove {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.15s;
}

.tag-remove:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* Available Tags */
.available-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.add-tag-btn {
  padding: 6px 12px;
  border: 1px dashed;
  border-radius: 20px;
  background: transparent;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}

.add-tag-btn:hover {
  background: currentColor + '10';
  transform: translateY(-1px);
}

/* Tag Cloud */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  justify-content: center;
}

.cloud-tag {
  padding: 6px 12px;
  border: 1px solid;
  border-radius: 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
  font-weight: 500;
}

.cloud-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cloud-tag.selected {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.tag-count-badge {
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

/* Tag Table */
.tag-table-container {
  overflow-x: auto;
}

.tag-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.tag-table thead {
  background: var(--bg-secondary);
}

.tag-table th {
  padding: 10px 12px;
  text-align: left;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border);
  white-space: nowrap;
}

.tag-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
}

.tag-row {
  cursor: pointer;
  transition: all 0.15s;
}

.tag-row:hover {
  background: var(--hover-bg);
}

.tag-row.selected {
  background: var(--selected-bg);
}

.checkbox-col {
  width: 40px;
  text-align: center !important;
}

.checkbox-col input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.tag-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.color-preview {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.color-value {
  font-family: monospace;
  font-size: 12px;
  color: var(--text-muted);
}

.count-badge {
  display: inline-block;
  padding: 2px 8px;
  background: var(--bg-tertiary);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
}

.actions-cell {
  white-space: nowrap;
}

.row-action-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.row-action-btn:hover {
  background: var(--bg-tertiary);
  color: var(--primary);
}

.row-action-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Sub Modals */
.sub-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  animation: fadeIn 0.2s ease;
}

.sub-modal {
  background: var(--bg-primary);
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.sub-modal-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sub-modal-header h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.sub-modal-body {
  padding: 16px;
}

.sub-modal-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Form */
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.15s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Color Picker */
.color-picker {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-input {
  width: 48px;
  height: 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
}

.color-presets {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.color-preset-btn {
  width: 28px;
  height: 28px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.color-preset-btn:hover {
  transform: scale(1.2);
}

.color-preset-btn.active {
  border-color: var(--text-primary);
  box-shadow: 0 0 0 2px var(--bg-primary);
}

/* Buttons */
.btn-primary {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: var(--primary);
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-primary:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Responsive */
@media (max-width: 768px) {
  .tags-modal {
    width: 95%;
    max-height: 90vh;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: 100%;
  }

  .tag-cloud {
    justify-content: flex-start;
  }

  .tag-table {
    min-width: 600px;
  }
}
</style>
