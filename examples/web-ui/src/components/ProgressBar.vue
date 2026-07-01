<script setup lang="ts">
/**
 * 进度条组件
 * 支持文件上传、文件转换、下载进度等场景
 */
import { computed, ref, watch } from 'vue';
import { CheckIcon, XIcon } from 'lucide-vue-next';

// Props
const props = withDefaults(defineProps<{
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  showPercentage?: boolean;
  status?: 'loading' | 'success' | 'error' | 'paused';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
  animated?: boolean;
  striped?: boolean;
  fileName?: string;
  fileSize?: string;
  speed?: string; // 如 "2.5 MB/s"
  timeRemaining?: string; // 如 "预计 30 秒"
  error?: string;
  retry?: () => void;
  cancel?: () => void;
}>(), {
  showValue: true,
  showPercentage: true,
  status: 'loading',
  variant: 'primary',
  size: 'md',
  indeterminate: false,
  animated: true,
  striped: true,
});

// 格式化数值
const displayValue = computed(() => {
  return Math.min(100, Math.max(0, Math.round(props.value)));
});

// 进度条宽度
const progressWidth = computed(() => {
  if (props.indeterminate) return '100%';
  return `${displayValue.value}%`;
});

// 状态图标
const statusIcon = computed(() => {
  switch (props.status) {
    case 'success': return CheckIcon;
    case 'error': return XIcon;
    default: return null;
  }
});

// 样式类
const wrapperClass = computed(() => [
  'progress-wrapper',
  `progress-${props.size}`,
  `progress-${props.variant}`,
  {
    'progress-indeterminate': props.indeterminate,
    'progress-animated': props.animated && !props.indeterminate,
    'progress-striped': props.striped && !props.indeterminate,
    'progress-success': props.status === 'success',
    'progress-error': props.status === 'error',
  }
]);

// 副标签（速度/剩余时间）
const subtitle = computed(() => {
  if (props.status === 'success') return '完成';
  if (props.status === 'error') return props.error || '失败';
  return props.timeRemaining || props.speed;
});
</script>

<template>
  <div :class="wrapperClass" role="progressbar" :aria-valuenow="displayValue" aria-valuemin="0" aria-valuemax="100">
    <!-- 头部信息 -->
    <div v-if="label || showValue || statusIcon" class="progress-header">
      <div class="progress-info">
        <span v-if="label" class="progress-label">{{ label }}</span>
        <span v-if="fileName" class="progress-filename">{{ fileName }}</span>
      </div>
      <div class="progress-status">
        <component v-if="statusIcon" :is="statusIcon" :size="14" class="status-icon" />
        <span v-if="showValue && !indeterminate" class="progress-value">
          {{ showPercentage ? `${displayValue}%` : displayValue }}
        </span>
      </div>
    </div>

    <!-- 进度条主体 -->
    <div class="progress-track">
      <div class="progress-bar" :style="{ width: progressWidth }">
        <!-- 动画条纹 -->
        <div v-if="!indeterminate && striped" class="progress-stripes"></div>
      </div>
      
      <!-- 不确定状态动画 -->
      <div v-if="indeterminate" class="progress-indeterminate-bar"></div>
    </div>

    <!-- 底部信息 -->
    <div v-if="fileSize || subtitle || error || retry || cancel" class="progress-footer">
      <div class="progress-meta">
        <span v-if="fileSize" class="progress-filesize">{{ fileSize }}</span>
        <span v-if="subtitle" class="progress-subtitle">{{ subtitle }}</span>
      </div>
      <div class="progress-actions">
        <button v-if="cancel && status !== 'success' && status !== 'error'" 
                class="progress-action-btn" 
                @click="cancel"
                aria-label="取消">
          <XIcon :size="14" />
        </button>
        <button v-if="retry && status === 'error'" 
                class="progress-action-btn progress-retry" 
                @click="retry"
                aria-label="重试">
          <span class="retry-icon">↻</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-wrapper {
  width: 100%;
  font-family: inherit;
}

/* 尺寸 */
.progress-sm {
  --progress-height: 4px;
  --progress-font-size: 11px;
}

.progress-md {
  --progress-height: 8px;
  --progress-font-size: 12px;
}

.progress-lg {
  --progress-height: 12px;
  --progress-font-size: 14px;
}

/* 头部 */
.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.progress-label {
  font-size: var(--font-size-sm, 12px);
  font-weight: 500;
  color: var(--text-primary, #1e293b);
}

.progress-filename {
  font-size: 11px;
  color: var(--text-muted, #94a3b8);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.progress-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-icon {
  color: var(--success, #22c55e);
}

.progress-error .status-icon {
  color: var(--danger, #ef4444);
}

.progress-value {
  font-size: var(--font-size-sm, 12px);
  font-weight: 600;
  color: var(--text-secondary, #64748b);
}

/* 进度条轨道 */
.progress-track {
  position: relative;
  width: 100%;
  height: 4px;
  background: var(--bg-tertiary, #e5e7eb);
  border-radius: 2px;
  overflow: hidden;
}

/* 进度条 */
.progress-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
  overflow: hidden;
}

/* 条纹效果 */
.progress-stripes {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

/* 动画 */
.progress-animated .progress-stripes {
  animation: progress-stripes 1s linear infinite;
}

@keyframes progress-stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}

/* 不确定状态 */
.progress-indeterminate .progress-bar {
  width: 30% !important;
}

.progress-indeterminate-bar {
  position: absolute;
  top: 0;
  left: -30%;
  width: 30%;
  height: 100%;
  background: inherit;
  border-radius: inherit;
  animation: indeterminate 1.5s ease-in-out infinite;
}

@keyframes indeterminate {
  0% {
    left: -30%;
  }
  100% {
    left: 100%;
  }
}

/* 颜色变体 */
.progress-primary .progress-bar,
.progress-default .progress-bar {
  background: var(--primary, #3b82f6);
}

.progress-success .progress-bar,
.progress-wrapper.progress-success .progress-bar {
  background: var(--success, #22c55e);
}

.progress-warning .progress-bar {
  background: var(--warning, #f59e0b);
}

.progress-danger .progress-bar,
.progress-wrapper.progress-error .progress-bar {
  background: var(--danger, #ef4444);
}

/* 底部 */
.progress-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.progress-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--text-muted, #94a3b8);
}

.progress-filesize,
.progress-subtitle {
  color: var(--text-muted, #94a3b8);
}

.progress-wrapper.progress-error .progress-subtitle {
  color: var(--danger, #ef4444);
}

.progress-actions {
  display: flex;
  gap: 4px;
}

.progress-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: var(--bg-tertiary, #e5e7eb);
  color: var(--text-muted, #94a3b8);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.progress-action-btn:hover {
  background: var(--bg-secondary, #f1f5f9);
  color: var(--text-primary, #1e293b);
}

.progress-retry .retry-icon {
  font-size: 14px;
  animation: none;
}

.progress-retry:hover .retry-icon {
  animation: spin 0.5s linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 减少动画 (无障碍) */
@media (prefers-reduced-motion: reduce) {
  .progress-stripes,
  .progress-indeterminate-bar,
  .progress-retry:hover .retry-icon {
    animation: none;
  }
}

/* 暗色模式 */
[data-theme="dark"] .progress-track {
  background: var(--bg-tertiary, #334155);
}

[data-theme="dark"] .progress-action-btn {
  background: var(--bg-secondary, #1e293b);
}

[data-theme="dark"] .progress-action-btn:hover {
  background: var(--bg-tertiary, #475569);
}
</style>
