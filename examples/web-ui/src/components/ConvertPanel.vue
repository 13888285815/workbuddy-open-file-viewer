<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  FileTextIcon, 
  ImageIcon, 
  DownloadIcon,
  SettingsIcon,
  LoaderIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XIcon
} from 'lucide-vue-next';
import { 
  type SourceFormat, 
  type TargetFormat,
  type ConversionTask,
  type ConversionOptions,
  getSupportedConversions,
  isConversionSupported,
  getFileFormat,
  getFormatDisplayName
} from '../utils/converters';
import { 
  pdfToImage, 
  imageToImage, 
  imagesToPdf,
  isPdfToImageSupported,
  isImageConversionSupported 
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
  file?: File | null;
  isVisible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  file: null,
  isVisible: false
});

const emit = defineEmits<{
  close: [];
}>();

// 当前转换任务
const currentTask = ref<ConversionTask | null>(null);
const isConverting = ref(false);

// 目标格式
const targetFormat = ref<TargetFormat>('pdf');

// 转换选项
const conversionOptions = ref<ConversionOptions>({
  quality: 0.92,
  scale: 2.0
});

// 获取源文件格式
const sourceFormat = computed<SourceFormat | null>(() => {
  if (!props.file) return null;
  return getFileFormat(props.file.name);
});

// 获取支持的目标格式
const supportedTargets = computed<TargetFormat[]>(() => {
  if (!sourceFormat.value) return [];
  
  const conversions = getSupportedConversions();
  const targets = conversions
    .filter(c => c.source === sourceFormat.value)
    .map(c => c.target);
  
  return targets;
});

// 检查是否支持转换
const isSupported = computed(() => {
  if (!sourceFormat.value) return false;
  return isConversionSupported(sourceFormat.value, targetFormat.value);
});

// 获取格式图标
const getFormatIcon = (format: string) => {
  if (format === 'pdf') return FileTextIcon;
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(format)) return ImageIcon;
  return FileTextIcon;
};

// 开始转换
const startConversion = async () => {
  if (!props.file || !sourceFormat.value || !isSupported.value) return;

  isConverting.value = true;

  // 创建转换任务
  currentTask.value = {
    id: `task_${Date.now()}`,
    sourceFile: props.file,
    sourceFormat: sourceFormat.value,
    targetFormat: targetFormat.value,
    status: 'processing',
    progress: 0,
    options: { ...conversionOptions.value },
    createdAt: new Date()
  };

  try {
    let resultBlob: Blob;

    // 根据格式调用相应的转换器
    if (sourceFormat.value === 'pdf' && ['jpg', 'jpeg', 'png', 'webp'].includes(targetFormat.value)) {
      // PDF 转图片
      if (!isPdfToImageSupported()) {
        throw new Error('当前浏览器不支持 PDF 转图片');
      }

      const results = await pdfToImage(
        props.file,
        targetFormat.value as 'jpg' | 'jpeg' | 'png' | 'webp',
        conversionOptions.value,
        (progress) => {
          if (currentTask.value) {
            currentTask.value.progress = progress;
          }
        }
      );

      // 如果多页，打包为 ZIP (简化：只取第一页)
      resultBlob = results[0];
    } else if (
      ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(sourceFormat.value) &&
      ['jpg', 'jpeg', 'png', 'webp'].includes(targetFormat.value)
    ) {
      // 图片格式互转
      resultBlob = await imageToImage(
        props.file,
        targetFormat.value as 'jpg' | 'jpeg' | 'png' | 'webp',
        conversionOptions.value,
        (progress) => {
          if (currentTask.value) {
            currentTask.value.progress = progress;
          }
        }
      );
    } else if (sourceFormat.value === 'md' || sourceFormat.value === 'markdown') {
      // Markdown 转 HTML
      if (!isMarkdownToHtmlSupported()) {
        throw new Error('不支持 Markdown 转 HTML');
      }

      resultBlob = await markdownToHtml(
        props.file,
        conversionOptions.value,
        (progress) => {
          if (currentTask.value) {
            currentTask.value.progress = progress;
          }
        }
      );
    } else if (
      (sourceFormat.value === 'html' || sourceFormat.value === 'htm') &&
      targetFormat.value === 'pdf'
    ) {
      // HTML 转 PDF
      if (!isHtmlToPdfSupported()) {
        throw new Error('当前浏览器不支持 HTML 转 PDF');
      }

      resultBlob = await htmlToPdf(
        props.file,
        conversionOptions.value,
        (progress, stage) => {
          if (currentTask.value) {
            currentTask.value.progress = progress;
          }
        }
      );
    } else {
      throw new Error(`不支持从 ${sourceFormat.value} 到 ${targetFormat.value} 的转换`);
    }

    // 更新任务状态
    if (currentTask.value) {
      currentTask.value.status = 'completed';
      currentTask.value.progress = 100;
      currentTask.value.result = resultBlob;
      currentTask.value.resultUrl = URL.createObjectURL(resultBlob);
    }
  } catch (error: any) {
    console.error('转换失败:', error);
    
    if (currentTask.value) {
      currentTask.value.status = 'failed';
      currentTask.value.error = error.message || '转换失败';
    }
  } finally {
    isConverting.value = false;
  }
};

// 下载转换后的文件
const downloadResult = () => {
  if (!currentTask.value?.resultUrl || !props.file) return;

  const link = document.createElement('a');
  link.href = currentTask.value.resultUrl;
  
  // 生成文件名
  const originalName = props.file.name.split('.')[0];
  const extension = currentTask.value.targetFormat;
  link.download = `${originalName}.${extension}`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 关闭面板
const close = () => {
  // 清理 URL
  if (currentTask.value?.resultUrl) {
    URL.revokeObjectURL(currentTask.value.resultUrl);
  }
  
  currentTask.value = null;
  emit('close');
};
</script>

<template>
  <div v-if="isVisible && file" class="convert-panel">
    <div class="panel-header">
      <h3>
        <SettingsIcon :size="18" />
        文件转换
      </h3>
      <button class="close-btn" @click="close">
        <XIcon :size="18" />
      </button>
    </div>

    <div class="panel-body">
      <!-- 源文件信息 -->
      <div class="source-file">
        <component :is="getFormatIcon(sourceFormat || '')" :size="20" />
        <div class="file-info">
          <span class="file-name">{{ file.name }}</span>
          <span class="file-format">格式: {{ getFormatDisplayName(sourceFormat || '') }}</span>
        </div>
      </div>

      <!-- 目标格式选择 -->
      <div class="target-format">
        <label>转换为:</label>
        <div class="format-options">
          <button
            v-for="format in supportedTargets"
            :key="format"
            :class="['format-btn', { active: targetFormat === format }]"
            @click="targetFormat = format"
            :disabled="isConverting"
          >
            <component :is="getFormatIcon(format)" :size="16" />
            {{ getFormatDisplayName(format) }}
          </button>
        </div>
      </div>

      <!-- 转换选项 -->
      <div v-if="targetFormat" class="conversion-options">
        <div class="option-group">
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

        <div class="option-group" v-if="sourceFormat === 'pdf'">
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
      </div>

      <!-- 转换按钮 -->
      <button 
        class="convert-btn"
        @click="startConversion"
        :disabled="!isSupported || isConverting"
      >
        <LoaderIcon v-if="isConverting" :size="16" class="spinner" />
        <span v-else>开始转换</span>
      </button>

      <!-- 转换进度 -->
      <div v-if="currentTask && isConverting" class="progress-section">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${currentTask.progress}%` }"
          ></div>
        </div>
        <span class="progress-text">{{ Math.round(currentTask.progress) }}%</span>
      </div>

      <!-- 转换结果 -->
      <div v-if="currentTask && currentTask.status === 'completed'" class="result-section">
        <CheckCircleIcon :size="48" class="success-icon" />
        <p>转换完成!</p>
        <button class="download-btn" @click="downloadResult">
          <DownloadIcon :size="16" />
          下载文件
        </button>
      </div>

      <!-- 转换失败 -->
      <div v-if="currentTask && currentTask.status === 'failed'" class="error-section">
        <AlertCircleIcon :size="48" class="error-icon" />
        <p class="error-message">{{ currentTask.error }}</p>
        <button class="retry-btn" @click="startConversion">重试</button>
      </div>

      <!-- 不支持的转换 -->
      <div v-if="!isSupported && sourceFormat" class="unsupported-message">
        不支持从 {{ getFormatDisplayName(sourceFormat) }} 到 {{ getFormatDisplayName(targetFormat) }} 的转换
      </div>
    </div>
  </div>
</template>

<style scoped>
.convert-panel {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 360px;
  background: var(--bg-primary, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
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

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-secondary, #f9fafb);
}

.panel-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #111827);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
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

.panel-body {
  padding: 16px;
}

.source-file {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary, #f9fafb);
  border-radius: 8px;
  margin-bottom: 16px;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #111827);
}

.file-format {
  font-size: 12px;
  color: var(--text-muted, #6b7280);
}

.target-format {
  margin-bottom: 16px;
}

.target-format label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary, #4b5563);
  margin-bottom: 8px;
}

.format-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.format-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-primary, #ffffff);
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary, #111827);
}

.format-btn:hover:not(:disabled) {
  border-color: var(--primary, #3b82f6);
  background: var(--primary-alpha, rgba(59, 130, 246, 0.1));
}

.format-btn.active {
  border-color: var(--primary, #3b82f6);
  background: var(--primary-alpha, rgba(59, 130, 246, 0.1));
  color: var(--primary, #3b82f6);
}

.format-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.conversion-options {
  margin-bottom: 16px;
}

.option-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.option-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary, #4b5563);
  min-width: 60px;
}

.option-group input[type="range"] {
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
  padding: 10px;
  border: none;
  background: var(--primary, #3b82f6);
  color: white;
  border-radius: 8px;
  font-size: 14px;
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
  margin-top: 16px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--bg-tertiary, #e5e7eb);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: var(--primary, #3b82f6);
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 13px;
  color: var(--text-muted, #6b7280);
}

.result-section {
  margin-top: 16px;
  text-align: center;
}

.success-icon {
  color: #10b981;
  margin-bottom: 8px;
}

.result-section p {
  font-size: 14px;
  color: var(--text-primary, #111827);
  margin-bottom: 12px;
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
  margin-top: 16px;
  text-align: center;
}

.error-icon {
  color: #ef4444;
  margin-bottom: 8px;
}

.error-message {
  font-size: 13px;
  color: #ef4444;
  margin-bottom: 12px;
}

.retry-btn {
  padding: 8px 16px;
  border: 1px solid #ef4444;
  background: transparent;
  color: #ef4444;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #ef4444;
  color: white;
}

.unsupported-message {
  margin-top: 12px;
  padding: 12px;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 6px;
  font-size: 13px;
  color: #92400e;
}
</style>
