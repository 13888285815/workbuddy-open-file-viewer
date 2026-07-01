<script setup lang="ts">
import { ref, computed } from "vue";
import {
  XIcon,
  FileTextIcon,
  DownloadIcon,
  EditIcon,
  Share2Icon,
  EyeIcon,
  TrashIcon,
  CalendarIcon,
  UserIcon,
  FilterIcon,
  DownloadIcon as ExportIcon,
  SearchIcon,
  ArrowUpDownIcon
} from "lucide-vue-next";

interface AuditEntry {
  id: string;
  fileName: string;
  fileType: string;
  operation: "view" | "download" | "edit" | "share" | "delete";
  user: string;
  userId: string;
  timestamp: Date;
  ip?: string;
  device?: string;
  details?: string;
}

interface Props {
  visible: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "export", filters: any): void;
}>();

// State
const searchQuery = ref("");
const selectedUser = ref("");
const selectedOperation = ref("");
const dateRange = ref({ start: "", end: "" });
const sortField = ref<"timestamp" | "fileName" | "user">("timestamp");
const sortOrder = ref<"asc" | "desc">("desc");
const currentPage = ref(1);
const pageSize = 20;

// Mock data
const auditLogs = ref<AuditEntry[]>([
  {
    id: "1",
    fileName: "项目方案.pdf",
    fileType: "pdf",
    operation: "view",
    user: "张三",
    userId: "user001",
    timestamp: new Date("2024-06-30T10:30:00"),
    ip: "192.168.1.100",
    device: "Chrome / macOS",
    details: "查看了文件第1-5页"
  },
  {
    id: "2",
    fileName: "财务报表.xlsx",
    fileType: "xlsx",
    operation: "download",
    user: "李四",
    userId: "user002",
    timestamp: new Date("2024-06-30T09:15:00"),
    ip: "192.168.1.101",
    device: "Edge / Windows",
    details: "下载了完整文件"
  },
  {
    id: "3",
    fileName: "会议纪要.docx",
    fileType: "docx",
    operation: "edit",
    user: "王五",
    userId: "user003",
    timestamp: new Date("2024-06-29T16:45:00"),
    ip: "192.168.1.102",
    device: "Safari / iOS",
    details: "修改了第3段内容"
  },
  {
    id: "4",
    fileName: "产品设计图.png",
    fileType: "image",
    operation: "share",
    user: "赵六",
    userId: "user004",
    timestamp: new Date("2024-06-29T14:20:00"),
    ip: "192.168.1.103",
    device: "Firefox / Linux",
    details: "生成了分享链接（7天有效期）"
  },
  {
    id: "5",
    fileName: "旧版本备份.zip",
    fileType: "archive",
    operation: "delete",
    user: "张三",
    userId: "user001",
    timestamp: new Date("2024-06-28T11:00:00"),
    ip: "192.168.1.100",
    device: "Chrome / macOS",
    details: "移入了回收站"
  },
  {
    id: "6",
    fileName: "客户资料.pdf",
    fileType: "pdf",
    operation: "view",
    user: "李四",
    userId: "user002",
    timestamp: new Date("2024-06-28T09:30:00"),
    ip: "192.168.1.101",
    device: "Edge / Windows",
    details: "查看了文件第10-15页"
  },
  {
    id: "7",
    fileName: "合同模板.docx",
    fileType: "docx",
    operation: "download",
    user: "王五",
    userId: "user003",
    timestamp: new Date("2024-06-27T15:20:00"),
    ip: "192.168.1.102",
    device: "Safari / iOS",
    details: "下载了文件副本"
  },
  {
    id: "8",
    fileName: "市场分析.pptx",
    fileType: "pptx",
    operation: "view",
    user: "赵六",
    userId: "user004",
    timestamp: new Date("2024-06-27T10:10:00"),
    ip: "192.168.1.103",
    device: "Firefox / Linux",
    details: "查看了演示文稿"
  }
]);

// Unique users
const uniqueUsers = computed(() => {
  const users = new Set(auditLogs.value.map(log => log.user));
  return Array.from(users);
});

// Filtered logs
const filteredLogs = computed(() => {
  let logs = [...auditLogs.value];
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    logs = logs.filter(log => 
      log.fileName.toLowerCase().includes(query) ||
      log.user.toLowerCase().includes(query) ||
      (log.details && log.details.toLowerCase().includes(query))
    );
  }
  
  // User filter
  if (selectedUser.value) {
    logs = logs.filter(log => log.user === selectedUser.value);
  }
  
  // Operation filter
  if (selectedOperation.value) {
    logs = logs.filter(log => log.operation === selectedOperation.value);
  }
  
  // Date filter
  if (dateRange.value.start) {
    const start = new Date(dateRange.value.start);
    logs = logs.filter(log => log.timestamp >= start);
  }
  if (dateRange.value.end) {
    const end = new Date(dateRange.value.end);
    end.setHours(23, 59, 59, 999);
    logs = logs.filter(log => log.timestamp <= end);
  }
  
  // Sort
  logs.sort((a, b) => {
    let cmp = 0;
    switch (sortField.value) {
      case "timestamp":
        cmp = a.timestamp.getTime() - b.timestamp.getTime();
        break;
      case "fileName":
        cmp = a.fileName.localeCompare(b.fileName, "zh-CN");
        break;
      case "user":
        cmp = a.user.localeCompare(b.user, "zh-CN");
        break;
    }
    return sortOrder.value === "asc" ? cmp : -cmp;
  });
  
  return logs;
});

// Paginated logs
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredLogs.value.slice(start, start + pageSize);
});

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredLogs.value.length / pageSize);
});

// Operation options
const operationOptions = [
  { value: "", label: "全部操作" },
  { value: "view", label: "查看" },
  { value: "download", label: "下载" },
  { value: "edit", label: "编辑" },
  { value: "share", label: "分享" },
  { value: "delete", label: "删除" }
];

// Get operation icon
const getOperationIcon = (operation: string) => {
  switch (operation) {
    case "view": return EyeIcon;
    case "download": return DownloadIcon;
    case "edit": return EditIcon;
    case "share": return Share2Icon;
    case "delete": return TrashIcon;
    default: return FileTextIcon;
  }
};

// Get operation label
const getOperationLabel = (operation: string) => {
  switch (operation) {
    case "view": return "查看";
    case "download": return "下载";
    case "edit": return "编辑";
    case "share": return "分享";
    case "delete": return "删除";
    default: return operation;
  }
};

// Get operation color
const getOperationColor = (operation: string) => {
  switch (operation) {
    case "view": return "#3b82f6";
    case "download": return "#22c55e";
    case "edit": return "#a855f7";
    case "share": return "#f59e0b";
    case "delete": return "#ef4444";
    default: return "#6b7280";
  }
};

// Format date
const formatDateTime = (date: Date) => {
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};

// Format relative time
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return formatDateTime(date);
};

// Toggle sort
const toggleSort = (field: "timestamp" | "fileName" | "user") => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "desc";
  }
};

// Clear filters
const clearFilters = () => {
  searchQuery.value = "";
  selectedUser.value = "";
  selectedOperation.value = "";
  dateRange.value = { start: "", end: "" };
  currentPage.value = 1;
};

// Export logs
const exportLogs = () => {
  emit("export", {
    searchQuery: searchQuery.value,
    user: selectedUser.value,
    operation: selectedOperation.value,
    dateRange: dateRange.value
  });
};

// Close
const close = () => {
  emit("close");
};

// Change page
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="audit-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <FileTextIcon :size="20" />
          <h3>审计日志</h3>
          <span class="log-count">{{ filteredLogs.length }} 条记录</span>
        </div>
        <button class="close-btn" @click="close">
          <XIcon :size="20" />
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <!-- Search -->
        <div class="search-box">
          <SearchIcon :size="16" />
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜索文件名、用户、详情..."
          />
        </div>

        <!-- User Filter -->
        <select v-model="selectedUser" class="filter-select">
          <option value="">全部用户</option>
          <option v-for="user in uniqueUsers" :key="user" :value="user">
            {{ user }}
          </option>
        </select>

        <!-- Operation Filter -->
        <select v-model="selectedOperation" class="filter-select">
          <option v-for="opt in operationOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <!-- Date Range -->
        <div class="date-range">
          <input
            v-model="dateRange.start"
            type="date"
            class="date-input"
          />
          <span class="date-separator">至</span>
          <input
            v-model="dateRange.end"
            type="date"
            class="date-input"
          />
        </div>

        <!-- Actions -->
        <button class="clear-btn" @click="clearFilters">
          清除筛选
        </button>
        <button class="export-btn" @click="exportLogs">
          <ExportIcon :size="14" />
          导出日志
        </button>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="audit-table">
          <thead>
            <tr>
              <th class="sortable" @click="toggleSort('fileName')">
                <span>文件名</span>
                <ArrowUpDownIcon
                  v-if="sortField !== 'fileName'"
                  :size="14"
                  class="sort-icon"
                />
                <ArrowUpDownIcon
                  v-else
                  :size="14"
                  :class="['sort-icon', { active: sortField === 'fileName' }]"
                />
              </th>
              <th>操作</th>
              <th class="sortable" @click="toggleSort('user')">
                <span>用户</span>
                <ArrowUpDownIcon
                  v-if="sortField !== 'user'"
                  :size="14"
                  class="sort-icon"
                />
                <ArrowUpDownIcon
                  v-else
                  :size="14"
                  :class="['sort-icon', { active: sortField === 'user' }]"
                />
              </th>
              <th class="sortable" @click="toggleSort('timestamp')">
                <span>时间</span>
                <ArrowUpDownIcon
                  v-if="sortField !== 'timestamp'"
                  :size="14"
                  class="sort-icon"
                />
                <ArrowUpDownIcon
                  v-else
                  :size="14"
                  :class="['sort-icon', { active: sortField === 'timestamp' }]"
                />
              </th>
              <th>详情</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedLogs.length === 0">
              <td colspan="5" class="empty-row">
                <FileTextIcon :size="48" />
                <p>暂无审计记录</p>
              </td>
            </tr>
            <tr
              v-for="log in paginatedLogs"
              :key="log.id"
              class="audit-row"
            >
              <td class="file-cell">
                <div class="file-info">
                  <span class="file-name">{{ log.fileName }}</span>
                  <span class="file-type">{{ log.fileType }}</span>
                </div>
              </td>
              <td class="operation-cell">
                <div
                  class="operation-badge"
                  :style="{ color: getOperationColor(log.operation) }"
                >
                  <component :is="getOperationIcon(log.operation)" :size="14" />
                  <span>{{ getOperationLabel(log.operation) }}</span>
                </div>
              </td>
              <td class="user-cell">
                <div class="user-info">
                  <UserIcon :size="14" />
                  <span>{{ log.user }}</span>
                </div>
              </td>
              <td class="time-cell">
                <div class="time-info">
                  <span class="time-absolute">{{ formatDateTime(log.timestamp) }}</span>
                  <span class="time-relative">{{ formatRelativeTime(log.timestamp) }}</span>
                </div>
              </td>
              <td class="details-cell">
                <span class="details-text">{{ log.details || "-" }}</span>
                <div v-if="log.ip || log.device" class="meta-info">
                  <span v-if="log.ip" class="meta-item">IP: {{ log.ip }}</span>
                  <span v-if="log.device" class="meta-item">{{ log.device }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <div class="pagination-info">
          显示 {{(currentPage - 1) * pageSize + 1}} - {{Math.min(currentPage * pageSize, filteredLogs.length)}} 条，共 {{filteredLogs.length}} 条
        </div>
        <div class="pagination-controls">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            上一页
          </button>
          <button
            v-for="page in Math.min(totalPages, 5)"
            :key="page"
            :class="['page-btn', { active: currentPage === page }]"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset:0;
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

.audit-modal {
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
  color: var(--primary);
}

.log-count {
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

/* Filters */
.filters-section {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-secondary);
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

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  outline: none;
  transition: all 0.15s;
}

.filter-select:focus {
  border-color: var(--primary);
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
  transition: all 0.15s;
}

.date-input:focus {
  border-color: var(--primary);
}

.date-separator {
  color: var(--text-muted);
  font-size: 13px;
}

.clear-btn {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.clear-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.export-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: var(--primary);
  color: white;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}

.export-btn:hover {
  background: var(--primary-hover);
}

/* Table */
.table-container {
  flex: 1;
  overflow: auto;
  padding: 0 20px;
}

.audit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.audit-table thead {
  position: sticky;
  top: 0;
  background: var(--bg-secondary);
  z-index: 10;
}

.audit-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border);
  white-space: nowrap;
}

.audit-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.audit-table th.sortable:hover {
  color: var(--primary);
}

.sort-icon {
  vertical-align: middle;
  margin-left: 4px;
  color: var(--text-muted);
}

.sort-icon.active {
  color: var(--primary);
}

.audit-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
}

.audit-row {
  transition: all 0.15s;
}

.audit-row:hover {
  background: var(--hover-bg);
}

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
}

/* File Cell */
.file-cell {
  min-width: 200px;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-weight: 500;
  color: var(--text-primary);
}

.file-type {
  font-size: 11px;
  color: var(--text-muted);
}

/* Operation Cell */
.operation-cell {
  min-width: 100px;
}

.operation-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: currentColor + '10';
}

/* User Cell */
.user-cell {
  min-width: 100px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
}

.user-info svg {
  color: var(--text-muted);
}

/* Time Cell */
.time-cell {
  min-width: 180px;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-absolute {
  font-size: 12px;
  color: var(--text-primary);
}

.time-relative {
  font-size: 11px;
  color: var(--text-muted);
}

/* Details Cell */
.details-cell {
  min-width: 250px;
}

.details-text {
  display: block;
  margin-bottom: 4px;
  color: var(--text-secondary);
}

.meta-info {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 11px;
  color: var(--text-muted);
}

/* Pagination */
.pagination {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.pagination-info {
  font-size: 13px;
  color: var(--text-muted);
}

.pagination-controls {
  display: flex;
  gap: 4px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* Responsive */
@media (max-width: 768px) {
  .audit-modal {
    width: 98%;
    max-height: 95vh;
  }

  .filters-section {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }

  .table-container {
    overflow-x: auto;
  }

  .audit-table {
    min-width: 800px;
  }
}
</style>
