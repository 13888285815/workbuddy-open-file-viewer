<script setup lang="ts">
import { ref, computed } from "vue";
import {
  XIcon,
  TrashIcon,
  RotateCcwIcon,
  AlertTriangleIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  VideoIcon,
  MusicIcon,
  ArchiveIcon,
  FileCodeIcon,
  FolderIcon,
  SearchIcon,
  CalendarIcon,
  SortAscIcon,
  SortDescIcon,
  CheckIcon
} from "lucide-vue-next";

interface TrashItem {
  id: string;
  name: string;
  type: "file" | "folder";
  mimeType?: string;
  size?: number;
  deletedAt: Date;
  originalPath: string;
  thumbnail?: string;
}

interface Props {
  visible: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "restore", ids: string[]): void;
  (e: "permanent-delete", ids: string[]): void;
  (e: "empty"): void;
}>();

// State
const searchQuery = ref("");
const selectedIds = ref<Set<string>>(new Set());
const sortField = ref<"name" | "deletedAt" | "size">("deletedAt");
const sortOrder = ref<"asc" | "desc">("desc");

// Mock data
const trashItems = ref<TrashItem[]>([
  {
    id: "1",
    name: "旧项目备份.zip",
    type: "file",
    mimeType: "application/zip",
    size: 15728640,
    deletedAt: new Date("2024-06-28T10:30:00"),
    originalPath: "/项目/2024/旧项目备份.zip"
  },
  {
    id: "2",
    name: "会议记录_副本.docx",
    type: "file",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 524288,
    deletedAt: new Date("2024-06-27T14:20:00"),
    originalPath: "/文档/会议记录_副本.docx"
  },
  {
    id: "3",
    name: "产品设计草稿.pptx",
    type: "file",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 3145728,
    deletedAt: new Date("2024-06-26T09:15:00"),
    originalPath: "/设计/产品设计草稿.pptx"
  },
  {
    id: "4",
    name: "测试图片_删除.jpg",
    type: "file",
    mimeType: "image/jpeg",
    size: 1048576,
    deletedAt: new Date("2024-06-25T16:45:00"),
    originalPath: "/图片/测试/测试图片_删除.jpg"
  },
  {
    id: "5",
    name: "临时文件夹",
    type: "folder",
    deletedAt: new Date("2024-06-24T11:00:00"),
    originalPath: "/临时文件夹"
  }
]);

// Filtered items
const filteredItems = computed(() => {
  let items = [...trashItems.value];
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    items = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.originalPath.toLowerCase().includes(query)
    );
  }
  
  // Sort
  items.sort((a, b) => {
    let cmp = 0;
    switch (sortField.value) {
      case "name":
        cmp = a.name.localeCompare(b.name, "zh-CN");
        break;
      case "deletedAt":
        cmp = a.deletedAt.getTime() - b.deletedAt.getTime();
        break;
      case "size":
        cmp = (a.size || 0) - (b.size || 0);
        break;
    }
    return sortOrder.value === "asc" ? cmp : -cmp;
  });
  
  return items;
});

// Check if all selected
const isAllSelected = computed(() => {
  return filteredItems.value.length > 0 && selectedIds.value.size === filteredItems.value.length;
});

// Get file icon
const getFileIcon = (item: TrashItem) => {
  if (item.type === "folder") return FolderIcon;
  
  const mime = item.mimeType || "";
  
  if (mime.startsWith("image/")) return ImageIcon;
  if (mime.startsWith("video/")) return VideoIcon;
  if (mime.startsWith("audio/")) return MusicIcon;
  if (mime.includes("document") || mime.includes("word") || mime.includes("text")) return FileTextIcon;
  if (mime.includes("archive") || mime.includes("zip") || mime.includes("rar")) return ArchiveIcon;
  if (mime.includes("code") || mime.includes("javascript") || mime.includes("json")) return FileCodeIcon;
  
  return FileIcon;
};

// Format file size
const formatFileSize = (bytes?: number) => {
  if (!bytes) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
};

// Format date
const formatDateTime = (date: Date) => {
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// Format relative time
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 周前`;
  if (days < 365) return `${Math.floor(days / 30)} 个月前`;
  return `${Math.floor(days / 365)} 年前`;
};

// Toggle selection
const toggleSelection = (id: string) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
  selectedIds.value = new Set(selectedIds.value);
};

// Toggle all
const toggleAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = new Set();
  } else {
    selectedIds.value = new Set(filteredItems.value.map(item => item.id));
  }
  selectedIds.value = new Set(selectedIds.value);
};

// Restore selected
const restoreSelected = () => {
  const ids = Array.from(selectedIds.value);
  emit("restore", ids);
  
  // Remove from trash
  trashItems.value = trashItems.value.filter(item => !ids.includes(item.id));
  selectedIds.value.clear();
  selectedIds.value = new Set();
};

// Restore single
const restoreSingle = (id: string) => {
  emit("restore", [id]);
  trashItems.value = trashItems.value.filter(item => item.id !== id);
};

// Permanent delete selected
const permanentDeleteSelected = () => {
  const ids = Array.from(selectedIds.value);
  
  if (!confirm(`确定要永久删除选中的 ${ids.length} 项吗？此操作不可恢复！`)) {
    return;
  }
  
  emit("permanent-delete", ids);
  
  // Remove from trash
  trashItems.value = trashItems.value.filter(item => !ids.includes(item.id));
  selectedIds.value.clear();
  selectedIds.value = new Set();
};

// Permanent delete single
const permanentDeleteSingle = (id: string) => {
  if (!confirm("确定要永久删除此项吗？此操作不可恢复！")) {
    return;
  }
  
  emit("permanent-delete", [id]);
  trashItems.value = trashItems.value.filter(item => item.id !== id);
};

// Empty trash
const emptyTrash = () => {
  if (!confirm(`确定要清空回收站吗？共 ${trashItems.value.length} 项将被永久删除，此操作不可恢复！`)) {
    return;
  }
  
  emit("empty");
  trashItems.value = [];
  selectedIds.value.clear();
  selectedIds.value = new Set();
};

// Toggle sort
const toggleSort = (field: "name" | "deletedAt" | "size") => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "desc";
  }
};

// Close
const close = () => {
  emit("close");
};
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="trash-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <TrashIcon :size="20" />
          <h3>回收站</h3>
          <span class="item-count">{{ trashItems.length }} 项</span>
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
            placeholder="搜索文件..."
          />
        </div>

        <div class="toolbar-spacer"></div>

        <!-- Actions -->
        <div class="toolbar-actions">
          <button
            class="action-btn"
            :disabled="selectedIds.size === 0"
            @click="restoreSelected"
          >
            <RotateCcwIcon :size="16" />
            恢复选中
          </button>
          <button
            class="action-btn danger"
            :disabled="selectedIds.size === 0"
            @click="permanentDeleteSelected"
          >
            <AlertTriangleIcon :size="16" />
            永久删除
          </button>
          <button
            class="action-btn danger"
            :disabled="trashItems.length === 0"
            @click="emptyTrash"
          >
            <TrashIcon :size="16" />
            清空回收站
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="trash-table">
          <thead>
            <tr>
              <th class="checkbox-col">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleAll"
                />
              </th>
              <th
                class="sortable"
                @click="toggleSort('name')"
              >
                <span>文件名</span>
                <SortAscIcon
                  v-if="sortField === 'name' && sortOrder === 'asc'"
                  :size="14"
                  class="sort-icon"
                />
                <SortDescIcon
                  v-else-if="sortField === 'name' && sortOrder === 'desc'"
                  :size="14"
                  class="sort-icon"
                />
                <SortAscIcon
                  v-else
                  :size="14"
                  class="sort-icon inactive"
                />
              </th>
              <th>大小</th>
              <th
                class="sortable"
                @click="toggleSort('deletedAt')"
              >
                <span>删除时间</span>
                <SortAscIcon
                  v-if="sortField === 'deletedAt' && sortOrder === 'asc'"
                  :size="14"
                  class="sort-icon"
                />
                <SortDescIcon
                  v-else-if="sortField === 'deletedAt' && sortOrder === 'desc'"
                  :size="14"
                  class="sort-icon"
                />
                <SortAscIcon
                  v-else
                  :size="14"
                  class="sort-icon inactive"
                />
              </th>
              <th>原始路径</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredItems.length === 0">
              <td colspan="6" class="empty-row">
                <TrashIcon :size="48" />
                <p>回收站为空</p>
                <p class="empty-hint">删除的文件将显示在这里</p>
              </td>
            </tr>
            <tr
              v-for="item in filteredItems"
              :key="item.id"
              :class="['trash-row', { selected: selectedIds.has(item.id) }]"
            >
              <td class="checkbox-col">
                <input
                  type="checkbox"
                  :checked="selectedIds.has(item.id)"
                  @change="toggleSelection(item.id)"
                />
              </td>
              <td class="name-cell">
                <div class="file-info">
                  <div class="file-icon" :class="item.type">
                    <component :is="getFileIcon(item)" :size="18" />
                  </div>
                  <div class="file-details">
                    <span class="file-name">{{ item.name }}</span>
                    <span class="file-type">{{ item.type === "folder" ? "文件夹" : item.mimeType }}</span>
                  </div>
                </div>
              </td>
              <td class="size-cell">
                {{ formatFileSize(item.size) }}
              </td>
              <td class="time-cell">
                <div class="time-info">
                  <span class="time-relative">{{ formatRelativeTime(item.deletedAt) }}</span>
                  <span class="time-absolute">{{ formatDateTime(item.deletedAt) }}</span>
                </div>
              </td>
              <td class="path-cell">
                <span class="path-text">{{ item.originalPath }}</span>
              </td>
              <td class="actions-cell">
                <button
                  class="row-action-btn"
                  title="恢复"
                  @click="restoreSingle(item.id)"
                >
                  <RotateCcwIcon :size="16" />
                </button>
                <button
                  class="row-action-btn danger"
                  title="永久删除"
                  @click="permanentDeleteSingle(item.id)"
                >
                  <AlertTriangleIcon :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <div class="footer-info">
          <span>{{ selectedIds.size }} 项已选中</span>
        </div>
        <div class="footer-actions">
          <button
            class="text-btn"
            :disabled="selectedIds.size === 0"
            @click="restoreSelected"
          >
            <RotateCcwIcon :size="14" />
            恢复选中
          </button>
          <button
            class="text-btn danger"
            :disabled="trashItems.length === 0"
            @click="emptyTrash"
          >
            <TrashIcon :size="14" />
            清空回收站
          </button>
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

.trash-modal {
  background: var(--bg-primary);
  border-radius: 12px;
  width: 95%;
  max-width: 1200px;
  max-height: 90vh;
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
  color: var(--text-muted);
}

.item-count {
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

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}

.action-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.action-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.action-btn.danger {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.action-btn.danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

/* Table */
.table-container {
  flex: 1;
  overflow: auto;
  padding: 0 20px;
}

.trash-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.trash-table thead {
  position: sticky;
  top: 0;
  background: var(--bg-secondary);
  z-index: 10;
}

.trash-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border);
  white-space: nowrap;
}

.trash-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.trash-table th.sortable:hover {
  color: var(--primary);
}

.sort-icon {
  vertical-align: middle;
  margin-left: 4px;
  color: var(--primary);
}

.sort-icon.inactive {
  color: var(--text-muted);
  opacity: 0.3;
}

.trash-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
}

.trash-row {
  transition: all 0.15s;
}

.trash-row:hover {
  background: var(--hover-bg);
}

.trash-row.selected {
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

/* File Info */
.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  flex-shrink: 0;
}

.file-icon.folder {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
}

.file-icon.file {
  color: var(--text-muted);
  background: var(--bg-secondary);
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.file-name {
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-type {
  font-size: 11px;
  color: var(--text-muted);
}

/* Size Cell */
.size-cell {
  white-space: nowrap;
  color: var(--text-secondary);
}

/* Time Cell */
.time-cell {
  white-space: nowrap;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-relative {
  font-weight: 500;
  color: var(--text-primary);
}

.time-absolute {
  font-size: 11px;
  color: var(--text-muted);
}

/* Path Cell */
.path-cell {
  max-width: 250px;
}

.path-text {
  font-size: 12px;
  color: var(--text-muted);
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

/* Actions Cell */
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

/* Empty Row */
.empty-row {
  text-align: center;
  padding: 60px 20px !important;
  color: var(--text-muted);
}

.empty-row svg {
  margin: 0 auto 12px;
  display: block;
  opacity: 0.3;
}

.empty-row p {
  font-size: 14px;
  margin-bottom: 4px;
}

.empty-hint {
  font-size: 12px !important;
  color: var(--text-muted) !important;
}

/* Footer */
.modal-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.footer-info {
  font-size: 13px;
  color: var(--text-muted);
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.text-btn {
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: var(--primary);
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
  transition: all 0.15s;
}

.text-btn:hover:not(:disabled) {
  background: var(--selected-bg);
}

.text-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.text-btn.danger {
  color: #ef4444;
}

.text-btn.danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .trash-modal {
    width: 98%;
    max-height: 95vh;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: 100%;
  }

  .table-container {
    overflow-x: auto;
  }

  .trash-table {
    min-width: 800px;
  }
}
</style>
