<script setup lang="ts">
import { ref, computed } from "vue";
import {
  XIcon,
  CopyIcon,
  QrCodeIcon,
  LinkIcon,
  ClockIcon,
  ShieldIcon,
  EyeIcon,
  DownloadIcon,
  EditIcon,
  HistoryIcon,
  CheckIcon
} from "lucide-vue-next";

interface ShareRecord {
  id: string;
  url: string;
  permission: "read" | "download" | "edit";
  expiresAt: Date;
  hasPassword: boolean;
  createdAt: Date;
  accessCount: number;
}

interface Props {
  visible: boolean;
  fileName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fileName: "未命名文件"
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "share", data: ShareData): void;
}>();

// State
const shareUrl = ref("");
const expiryDays = ref(7);
const hasPassword = ref(false);
const password = ref("");
const permission = ref<"read" | "download" | "edit">("read");
const showQrCode = ref(false);
const copied = ref(false);
const shareHistory = ref<ShareRecord[]>([
  {
    id: "1",
    url: "https://example.com/share/abc123",
    permission: "read",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    hasPassword: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    accessCount: 5
  },
  {
    id: "2",
    url: "https://example.com/share/def456",
    permission: "download",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    hasPassword: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    accessCount: 12
  }
]);

interface ShareData {
  url: string;
  permission: string;
  expiresIn: number;
  password?: string;
}

// Generate share link
const generateShareLink = () => {
  const token = Math.random().toString(36).substring(2, 15);
  shareUrl.value = `https://example.com/share/${token}`;
  
  const shareData: ShareData = {
    url: shareUrl.value,
    permission: permission.value,
    expiresIn: expiryDays.value * 24 * 60 * 60 * 1000
  };
  
  if (hasPassword.value && password.value) {
    shareData.password = password.value;
  }
  
  emit("share", shareData);
  
  // Add to history
  shareHistory.value.unshift({
    id: Date.now().toString(),
    url: shareUrl.value,
    permission: permission.value,
    expiresAt: new Date(Date.now() + expiryDays.value * 24 * 60 * 60 * 1000),
    hasPassword: hasPassword.value,
    createdAt: new Date(),
    accessCount: 0
  });
};

// Copy link
const copyLink = async () => {
  if (!shareUrl.value) return;
  
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

// Generate QR Code (simplified - in production use a QR library)
const generateQrCode = () => {
  showQrCode.value = !showQrCode.value;
};

// Format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};

// Format expiry
const formatExpiry = (days: number) => {
  if (days >= 365) return `${Math.floor(days / 365)} 年`;
  if (days >= 30) return `${Math.floor(days / 30)} 个月`;
  return `${days} 天`;
};

// Permission options
const permissionOptions = [
  { value: "read", label: "只读", icon: EyeIcon, desc: "只能查看文件" },
  { value: "download", label: "可下载", icon: DownloadIcon, desc: "可查看和下载" },
  { value: "edit", label: "可编辑", icon: EditIcon, desc: "可查看、下载和编辑" }
];

// Expiry options
const expiryOptions = [
  { value: 1, label: "1 天" },
  { value: 7, label: "7 天" },
  { value: 30, label: "30 天" },
  { value: 90, label: "90 天" },
  { value: 365, label: "1 年" }
];

// Close modal
const close = () => {
  emit("close");
};
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="share-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <LinkIcon :size="20" />
          <h3>分享文件</h3>
        </div>
        <button class="close-btn" @click="close">
          <XIcon :size="20" />
        </button>
      </div>

      <!-- File Info -->
      <div class="file-info">
        <div class="file-icon">
          <LinkIcon :size="24" />
        </div>
        <div class="file-details">
          <div class="file-name">{{ fileName }}</div>
          <div class="file-hint">创建分享链接以与他人协作</div>
        </div>
      </div>

      <!-- Share Configuration -->
      <div class="share-config">
        <!-- Permission -->
        <div class="config-section">
          <label class="config-label">
            <ShieldIcon :size="16" />
            访问权限
          </label>
          <div class="permission-options">
            <button
              v-for="opt in permissionOptions"
              :key="opt.value"
              :class="['permission-card', { active: permission === opt.value }]"
              @click="permission = opt.value as any"
            >
              <component :is="opt.icon" :size="20" />
              <div class="permission-info">
                <div class="permission-label">{{ opt.label }}</div>
                <div class="permission-desc">{{ opt.desc }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Expiry -->
        <div class="config-section">
          <label class="config-label">
            <ClockIcon :size="16" />
            链接有效期
          </label>
          <div class="expiry-options">
            <button
              v-for="opt in expiryOptions"
              :key="opt.value"
              :class="['expiry-btn', { active: expiryDays === opt.value }]"
              @click="expiryDays = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Password -->
        <div class="config-section">
          <label class="config-label">
            <ShieldIcon :size="16" />
            访问密码
          </label>
          <div class="password-toggle">
            <label class="toggle-label">
              <input
                v-model="hasPassword"
                type="checkbox"
                class="toggle-input"
              />
              <span class="toggle-switch"></span>
              <span>启用访问密码</span>
            </label>
          </div>
          <div v-if="hasPassword" class="password-input">
            <input
              v-model="password"
              type="text"
              class="form-input"
              placeholder="请输入 4-12 位密码"
              maxlength="12"
            />
          </div>
        </div>
      </div>

      <!-- Generate Button -->
      <div class="generate-section">
        <button
          :class="['generate-btn', { active: true }]"
          @click="generateShareLink"
        >
          <LinkIcon :size="18" />
          生成分享链接
        </button>
      </div>

      <!-- Share Result -->
      <div v-if="shareUrl" class="share-result">
        <div class="result-header">
          <CheckIcon :size="18" />
          <span>链接已生成</span>
        </div>
        
        <div class="link-box">
          <input
            :value="shareUrl"
            type="text"
            class="link-input"
            readonly
          />
          <button class="copy-btn" @click="copyLink">
            <CopyIcon v-if="!copied" :size="16" />
            <CheckIcon v-else :size="16" />
            {{ copied ? "已复制" : "复制" }}
          </button>
        </div>

        <div class="result-actions">
          <button class="action-btn" @click="generateQrCode">
            <QrCodeIcon :size="16" />
            {{ showQrCode ? "隐藏二维码" : "显示二维码" }}
          </button>
        </div>

        <!-- QR Code (Simplified) -->
        <div v-if="showQrCode" class="qr-code">
          <div class="qr-placeholder">
            <div class="qr-grid">
              <div v-for="i in 100" :key="i" :class="['qr-cell', { filled: Math.random() > 0.5 }]"></div>
            </div>
          </div>
          <p class="qr-hint">扫码访问文件</p>
        </div>
      </div>

      <!-- Share History -->
      <div class="share-history">
        <div class="history-header">
          <HistoryIcon :size="16" />
          <span>分享历史</span>
          <span class="history-count">{{ shareHistory.length }} 个链接</span>
        </div>
        
        <div class="history-list">
          <div
            v-for="record in shareHistory"
            :key="record.id"
            class="history-item"
          >
            <div class="history-info">
              <div class="history-url">{{ record.url }}</div>
              <div class="history-meta">
                <span :class="['permission-badge', record.permission]">
                  {{ record.permission === "read" ? "只读" : record.permission === "download" ? "可下载" : "可编辑" }}
                </span>
                <span class="meta-item">
                  <ClockIcon :size="12" />
                  {{ formatDate(record.expiresAt) }} 过期
                </span>
                <span class="meta-item">
                  访问 {{ record.accessCount }} 次
                </span>
              </div>
            </div>
            <button class="history-copy" @click="shareUrl = record.url; copyLink()">
              <CopyIcon :size="14" />
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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.share-modal {
  background: var(--bg-primary);
  border-radius: 12px;
  width: 90%;
  max-width: 560px;
  max-height: 85vh;
  overflow-y: auto;
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
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  z-index: 10;
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

/* File Info */
.file-info {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-secondary);
  margin: 16px;
  border-radius: 8px;
}

.file-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: white;
  border-radius: 8px;
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 500;
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.file-hint {
  font-size: 12px;
  color: var(--text-muted);
}

/* Share Config */
.share-config {
  padding: 0 20px;
}

.config-section {
  margin-bottom: 20px;
}

.config-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.config-label svg {
  color: var(--text-muted);
}

/* Permission Options */
.permission-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.permission-card {
  padding: 12px;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--bg-primary);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.permission-card:hover {
  border-color: var(--primary);
  background: var(--selected-bg);
}

.permission-card.active {
  border-color: var(--primary);
  background: var(--selected-bg);
  color: var(--primary);
}

.permission-card svg {
  color: inherit;
}

.permission-info {
  width: 100%;
}

.permission-label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.permission-desc {
  font-size: 11px;
  color: var(--text-muted);
}

/* Expiry Options */
.expiry-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.expiry-btn {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.expiry-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.expiry-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* Password */
.password-toggle {
  margin-bottom: 10px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
}

.toggle-input {
  display: none;
}

.toggle-switch {
  width: 40px;
  height: 22px;
  background: var(--bg-tertiary);
  border-radius: 11px;
  position: relative;
  transition: all 0.2s;
}

.toggle-switch::after {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: all 0.2s;
}

.toggle-input:checked + .toggle-switch {
  background: var(--primary);
}

.toggle-input:checked + .toggle-switch::after {
  left: 20px;
}

.password-input {
  margin-top: 10px;
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

/* Generate Button */
.generate-section {
  padding: 0 20px;
  margin-bottom: 20px;
}

.generate-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.generate-btn:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.generate-btn:active {
  transform: translateY(0);
}

/* Share Result */
.share-result {
  margin: 0 20px 20px;
  padding: 16px;
  background: var(--selected-bg);
  border: 1px solid var(--primary);
  border-radius: 8px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #22c55e;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.link-box {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.link-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 13px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: monospace;
}

.copy-btn {
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
  white-space: nowrap;
}

.copy-btn:hover {
  background: var(--primary-hover);
}

.result-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 12px;
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

.action-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* QR Code */
.qr-code {
  margin-top: 16px;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.qr-placeholder {
  width: 160px;
  height: 160px;
  margin: 0 auto 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  display: inline-block;
}

.qr-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 2px;
  width: 100%;
  height: 100%;
}

.qr-cell {
  background: #f0f0f0;
  border-radius: 1px;
}

.qr-cell.filled {
  background: #000;
}

.qr-hint {
  font-size: 12px;
  color: var(--text-muted);
}

/* Share History */
.share-history {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
}

.history-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.history-count {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-muted);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: var(--bg-secondary);
  border-radius: 6px;
  transition: all 0.15s;
}

.history-item:hover {
  background: var(--bg-tertiary);
}

.history-info {
  flex: 1;
  min-width: 0;
}

.history-url {
  font-size: 12px;
  color: var(--primary);
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.permission-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.permission-badge.read {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.permission-badge.download {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.permission-badge.edit {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-muted);
}

.history-copy {
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
  flex-shrink: 0;
}

.history-copy:hover {
  background: var(--bg-primary);
  color: var(--primary);
}

/* Responsive */
@media (max-width: 640px) {
  .share-modal {
    width: 95%;
    max-height: 90vh;
  }

  .permission-options {
    grid-template-columns: 1fr;
  }

  .expiry-options {
    gap: 4px;
  }

  .expiry-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
