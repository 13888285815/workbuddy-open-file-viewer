<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  XIcon,
  DownloadIcon,
  FileTextIcon,
  ImageIcon,
  SettingsIcon,
  LoaderIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  HistoryIcon,
  TrashIcon,
  FileIcon
} from 'lucide-vue-next';
import {
  type SourceFormat,
  type TargetFormat,
  type ConversionTask,
  type ConversionOptions,
  type ConversionHistory,
  getSupportedConversions,
  isConversionSupported,
  getFileFormat,
  getFormatDisplayName
} from '../utils/converters';
import {
  pdfToImage,
  imageToImage,
  imagesToPdf,
  isPdfToImageSupported
} from '../utils/converters';
import {
  markdownToHtml,
  isMarkdownToHtmlSupported
} from '../utils/converters';
import {
  htmlToPdf,
  isHtmlToPdfSupported
} from '../utils/converters';

interface Props {
  isVisible: boolean;
  files?: File[];
}

const props = withDefaults(defineProps<Props>(), {
  files: () => []
});

const emit = defineEmits<{
  close: [];
  'conversion-complete': [task: ConversionTask];
}>();

// 状态
const selectedFiles = ref<File[]>([]);
const targetFormat = ref<TargetFormat>('pdf');
const currentTask = ref<ConversionTask | null>(null);
const isConverting = ref(false);
const activeTab = ref<'convert' | 'history'>('convert');

// 转换选项
const conversionOptions = ref<ConversionOptions>({
  quality: 0.92,
  scale: 2.0,
  batch: false
});

// 转换历史
const conversionHistory = ref<ConversionHistory[]>([]);

// 初始化
onMounted(() => {
  loadHistory();
  
  // 如果传入了文件，自动选择
  if (props.files && props.files.length > 0) {
    selectedFiles.value = [...props.files];
  }
});

// 获取支持的目标格式
const supportedTargets = computed<TargetFormat[]>(() => {
  if (selectedFiles.value.length === 0) return [];
  
  const firstFormat = getFileFormat(selectedFiles.value[0].name);
  if (!firstFormat) return [];
  
  const conversions = getSupportedConversions();
  const targets = conversions
    .filter(c => c.source === firstFormat)
    .map(c => c.target);
  
  return targets;
});

// 检查是否支持转换
const isSupported = computed(() => {
  if (selectedFiles.value.length === 0) return false;
  
  const firstFormat = getFileFormat(selectedFiles.value[0].name);
  if (!firstFormat) return false;
  
  return isConversionSupported(firstFormat, targetFormat.value);
});

// 添加文件
const addFiles = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;
  
  const newFiles = Array.from(input.files);
  selectedFiles.value = [...selectedFiles.value, ...newFiles];
};

// 移除文件
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

// 开始转换
const startConversion = async () => {
  if (selectedFiles.value.length === 0 || !isSupported.value) return;

  isConverting.value = true;

  for (let i = 0; i < selectedFiles.value.length; i++) {
    const file = selectedFiles.value[i];
    const sourceFormat = getFileFormat(file.name);
    
    if (!sourceFormat) continue;

    // 创建转换任务
    currentTask.value = {
      id: `task_${Date.now()}_${i}`,
      sourceFile: file,
      sourceFormat,
      targetFormat: targetFormat.value,
      status: 'processing',
      progress: 0,
      options: { ...conversionOptions.value },
      createdAt: new Date()
    };

    try {
      let resultBlob: Blob;

      // 根据格式调用相应的转换器
      if (sourceFormat === 'pdf' && ['jpg', 'jpeg', 'png', 'webp'].includes(targetFormat.value)) {
        resultBlob = (await pdfToImage(
          file,
          targetFormat.value as 'jpg' | 'jpeg' | 'png' | 'webp',
          conversionOptions.value,
          (progress) => {
            if (currentTask.value) {
              currentTask.value.progress = progress;
            }
          }
        ))[0];
      } else if (
        ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(sourceFormat) &&
        ['jpg', 'jpeg', 'png', 'webp'].includes(targetFormat.value)
      ) {
        resultBlob = await imageToImage(
          file,
          targetFormat.value as 'jpg' | 'jpeg' | 'png' | 'webp',
          conversionOptions.value
        );
      } else if (sourceFormat === 'md' || sourceFormat === 'markdown') {
        resultBlob = await markdownToHtml(file, conversionOptions.value);
      } else if (
        (sourceFormat === 'html' || sourceFormat === 'htm') &&
        targetFormat.value === 'pdf'
      ) {
        resultBlob = await htmlToPdf(file, conversionOptions.value);
      } else {
        throw new Error(`不支持从 ${sourceFormat} 到 ${targetFormat.value} 的转换`);
      }

      // 更新任务状态
      currentTask.value.status = 'completed';
      currentTask.value.progress = 100;
      currentTask.value.result = resultBlob;
      currentTask.value.resultUrl = URL.createObjectURL(resultBlob);

      // 保存到历史
      saveToHistory(currentTask.value);

      // 通知父组件
      emit('conversion-complete', currentTask.value);

      // 如果不是批量模式，只转换第一个文件
      if (!conversionOptions.value.batch) break;
    } catch (error: any) {
      console.error('转换失败:', error);
      
      if (currentTask.value) {
        currentTask.value.status = 'failed';
        currentTask.value.error = error.message || '转换失败';
      }

      // 如果不是批量模式，停止转换
      if (!conversionOptions.value.batch) break;
    }
  }

  isConverting.value = false;
};

// 保存到历史
const saveToHistory = (task: ConversionTask) => {
  if (!task.result) return;

  const historyItem: ConversionHistory = {
    id: `history_${Date.now()}`,
    sourceName: task.sourceFile.name,
    sourceFormat: task.sourceFormat,
    targetFormat: task.targetFormat,
    completedAt: new Date(),
    fileSize: task.result.size,
    downloadUrl: task.resultUrl || ''
  };

  conversionHistory.value.unshift(historyItem);

  // 限制历史记录数量
  if (conversionHistory.value.length > 20) {
    conversionHistory.value = conversionHistory.value.slice(0, 20);
  }

  // 保存到 localStorage
  localStorage.setItem(
    'conversion_history',
    JSON.stringify(conversionHistory.value)
  );
};

// 加载历史
const loadHistory = () => {
  try {
    const saved = localStorage.getItem('conversion_history');
    if (saved) {
      conversionHistory.value = JSON.parse(saved);
    }
  } catch (error) {
    console.error('加载历史记录失败:', error);
  }
};

// 清空历史
const clearHistory = () => {
  conversionHistory.value = [];
  localStorage.removeItem('conversion_history');
};

// 下载文件
const downloadFile = (task: ConversionTask | ConversionHistory) => {
  const url = 'resultUrl' in task ? task.resultUrl : '';
  const fileName = 'sourceName' in task 
    ? `${task.sourceName.split('.')[0]}.${task.targetFormat}`
    : `converted_${Date.now()}.${task.targetFormat}`;

  if (!url) return;

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 关闭弹窗
const close = () => {
  if (currentTask.value?.resultUrl) {
    URL.revokeObjectURL(currentTask.value.resultUrl);
  }
  
  currentTask.value = null;
  emit('close');
};

// 获取格式图标
const getFormatIcon = (format: string) => {
  if (format === 'pdf') return FileTextIcon;
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(format)) return ImageIcon;
  return FileIcon;
};
</script>

<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="close">
    <div class="convert-modal">
      <!-- 头部 -->
      <div class="modal-header">
        <h2>
          <SettingsIcon :size="20" />
          文件转换
        </h2>
        <button class="close-btn" @click="close">
          <XIcon :size="20" />
        </button>
      </div>

      <!-- 标签页 -->
      <div class="modal-tabs">
        <button
          :class="['tab-btn', { active: activeTab === 'convert' }]"
          @click="activeTab = 'convert'"
        >
          转换
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'history' }]"
          @click="activeTab = 'history'"
        >
          <HistoryIcon :size="16" />
          历史记录
        </button>
      </div>

      <!-- 转换标签页 -->
      <div v-if="activeTab === 'convert'" class="modal-body">
        <!-- 文件选择 -->
        <div class="section">
          <label class="section-label">选择文件:</label>
          <div class="file-list">
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="file-item"
            >
              <component :is="getFormatIcon(file.name.split('.').pop() || '')" :size="16" />
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ (file.size / 1024).toFixed(1) }} KB</span>
              <button class="remove-btn" @click="removeFile(index)">
                <XIcon :size="14" />
              </button>
            </div>
          </div>
          <label class="add-file-btn">
            <input
              type="file"
              multiple
              @change="addFiles"
              style="display: none;"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.md,.markdown,.html,.htm,.txt"
            />
            添加文件
          </label>
        </div>

        <!-- 目标格式 -->
        <div class="section" v-if="selectedFiles.length > 0">
          <label class="section-label">目标格式:</label>
          <div class="format-grid">
            <button
              v-for="format in supportedTargets"
              :key="format"
              :class="['format-card', { active: targetFormat === format }]"
              @click="targetFormat = format"
              :disabled="isConverting"
            >
              <component :is="getFormatIcon(format)" :size="24" />
              <span>{{ getFormatDisplayName(format) }}</span>
            </button>
          </div>
        </div>

        <!-- 转换选项 -->
        <div class="section" v-if="targetFormat">
          <label class="section-label">转换选项:</label>
          
          <div class="option-item">
            <label>质量:</label>
            <input
              type="range"
              v-model.number="conversionOptions.quality"
              min="0.1"
              max="1"
              step="0.1"
              :disabled="isConverting"
            />
            <span class="option-value">{{ Math.round(conversionOptions.quality * 100) }}%</span>
          </div>

          <div class="option-item" v-if="selectedFiles.length > 0 && getFileFormat(selectedFiles[0].name) === 'pdf'">
            <label>分辨率:</label>
            <input
              type="range"
              v-model.number="conversionOptions.scale"
              min="1"
              max="3"
              step="0.5"
              :disabled="isConverting"
            />
            <span class="option-value">{{ conversionOptions.scale }}x</span>
          </div>

          <div class="option-item" v-if="selectedFiles.length > 1">
            <label>
              <input
                type="checkbox"
                v-model="conversionOptions.batch"
                :disabled="isConverting"
              />
              批量转换
            </label>
          </div>
        </div>

        <!-- 转换按钮 -->
        <button
          class="convert-btn"
          @click="startConversion"
          :disabled="selectedFiles.length === 0 || !isSupported || isConverting"
        >
          <LoaderIcon v-if="isConverting" :size="16" class="spinner" />
          <span v-else>开始转换</span>
        </button>

        <!-- 进度 -->
        <div v-if="currentTask && isConverting" class="progress-section">
          <div class="progress-header">
            <span>正在转换: {{ currentTask.sourceFile.name }}</span>
            <span>{{ Math.round(currentTask.progress) }}%</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${currentTask.progress}%` }"
            ></div>
          </div>
        </div>

        <!-- 结果 -->
        <div v-if="currentTask && currentTask.status === 'completed'" class="result-section">
          <CheckCircleIcon :size="48" class="success-icon" />
          <p>转换完成!</p>
          <button class="download-btn" @click="downloadFile(currentTask)">
            <DownloadIcon :size="16" />
            下载文件
          </button>
        </div>

        <!-- 错误 -->
        <div v-if="currentTask && currentTask.status === 'failed'" class="error-section">
          <AlertCircleIcon :size="48" class="error-icon" />
          <p class="error-message">{{ currentTask.error }}</p>
        </div>
      </div>

      <!-- 历史记录标签页 -->
      <div v-if="activeTab === 'history'" class="modal-body history-body">
        <div v-if="conversionHistory.length === 0" class="empty-history">
          <HistoryIcon :size="48" />
          <p>暂无转换历史</p>
        </div>

        <div v-else>
          <div class="history-header">
            <span>共 {{ conversionHistory.length }} 条记录</span>
            <button class="clear-btn" @click="clearHistory">
              <TrashIcon :size="14" />
              清空
            </button>
          </div>

          <div
            v-for="item in conversionHistory"
            :key="item.id"
            class="history-item"
          >
            <div class="history-info">
              <FileTextIcon :size="16" />
              <div>
                <div class="history-name">{{ item.sourceName }}</div>
                <div class="history-meta">
                  {{ getFormatDisplayName(item.sourceFormat) }} → {{ getFormatDisplayName(item.targetFormat) }}
                  · {{ (item.fileSize / 1024).toFixed(1) }} KB
                  · {{ new Date(item.completedAt).toLocaleString() }}
                </div>
              </div>
            </div>
            <button class="download-btn" @click="downloadFile(item)">
              <DownloadIcon :size="14" />
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.convert-modal {
  width: 600px;
  max-height: 80vh;
  background: var(--bg-primary, #ffffff);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.modal-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #111827);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-muted, #6b7280);
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--hover-bg, #f3f4f6);
  color: var(--text-primary, #111827);
}

.modal-tabs {
  display: flex;
  padding: 0 20px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-muted, #6b7280);
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--text-primary, #111827);
}

.tab-btn.active {
  color: var(--primary, #3b82f6);
  border-bottom-color: var(--primary, #3b82f6);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(80vh - 120px);
}

.section {
  margin-bottom: 24px;
}

.section-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary, #4b5563);
  margin-bottom: 12px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-secondary, #f9fafb);
  border-radius: 6px;
  font-size: 13px;
}

.file-item .file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-item .file-size {
  color: var(--text-muted, #6b7280);
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-muted, #6b7280);
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fee2e2;
  color: #ef4444;
}

.add-file-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px dashed var(--border-color, #e5e7eb);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-muted, #6b7280);
  transition: all 0.2s;
}

.add-file-btn:hover {
  border-color: var(--primary, #3b82f6);
  color: var(--primary, #3b82f6);
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.format-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-primary, #ffffff);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  color: var(--text-primary, #111827);
}

.format-card:hover:not(:disabled) {
  border-color: var(--primary, #3b82f6);
  background: var(--primary-alpha, rgba(59, 130, 246, 0.1));
}

.format-card.active {
  border-color: var(--primary, #3b82f6);
  background: var(--primary-alpha, rgba(59, 130, 246, 0.1));
  color: var(--primary, #3b82f6);
}

.format-card:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.option-item label {
  font-size: 13px;
  color: var(--text-secondary, #4b5563);
  min-width: 60px;
}

.option-item input[type="range"] {
  flex: 1;
}

.option-value {
  font-size: 13px;
  color: var(--text-muted, #6b7280);
  min-width: 45px;
  text-align: right;
}

.convert-btn {
  width: 100%;
  padding: 12px;
  border: none;
  background: var(--primary, #3b82f6);
  color: white;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.convert-btn:hover:not(:disabled) {
  background: var(--primary-hover, #2563eb);
}

.convert-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.progress-section {
  margin-top: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary, #4b5563);
  margin-bottom: 8px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--bg-tertiary, #e5e7eb);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary, #3b82f6);
  border-radius: 4px;
  transition: width 0.3s;
}

.result-section {
  margin-top: 20px;
  text-align: center;
}

.success-icon {
  color: #10b981;
  margin-bottom: 12px;
}

.result-section p {
  font-size: 15px;
  color: var(--text-primary, #111827);
  margin-bottom: 16px;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: #10b981;
  color: white;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.download-btn:hover {
  background: #059669;
}

.error-section {
  margin-top: 20px;
  text-align: center;
}

.error-icon {
  color: #ef4444;
  margin-bottom: 12px;
}

.error-message {
  font-size: 13px;
  color: #ef4444;
}

/* 历史记录样式 */
.history-body {
  padding: 20px;
}

.empty-history {
  text-align: center;
  padding: 40px;
  color: var(--text-muted, #6b7280);
}

.empty-history p {
  margin-top: 12px;
  font-size: 14px;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--text-muted, #6b7280);
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: var(--text-muted, #6b7280);
  transition: all 0.2s;
}

.clear-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s;
}

.history-item:hover {
  background: var(--bg-secondary, #f9fafb);
}

.history-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.history-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #111827);
  margin-bottom: 4px;
}

.history-meta {
  font-size: 12px;
  color: var(--text-muted, #6b7280);
}
</style>
