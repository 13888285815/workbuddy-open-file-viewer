<script setup lang="ts">
/**
 * 加载状态组件 - 骨架屏、加载动画、错误重试
 */
import { ref, computed, watch } from 'vue';
import { RefreshCwIcon, AlertCircleIcon, LoaderIcon } from 'lucide-vue-next';

// Props
const props = withDefaults(defineProps<{
  type?: 'spinner' | 'skeleton' | 'progress';
  loading?: boolean;
  error?: string | null;
  skeletonRows?: number;
  skeletonHeight?: string;
  progress?: number;
  progressText?: string;
  fullscreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  retry?: () => void;
}>(), {
  type: 'spinner',
  loading: true,
  error: null,
  skeletonRows: 3,
  skeletonHeight: '16px',
  progress: 0,
  fullscreen: false,
  size: 'md',
});

// 骨架屏行数
const skeletonItems = computed(() => {
  return Array.from({ length: props.skeletonRows }, (_, i) => i);
});

// 进度百分比样式
const progressStyle = computed(() => ({
  width: `${Math.min(100, Math.max(0, props.progress))}%`
}));

// 加载尺寸映射
const sizeClasses = {
  sm: 'loading-spinner--sm',
  md: 'loading-spinner--md',
  lg: 'loading-spinner--lg',
};

// 显示内容
const showContent = computed(() => {
  return !props.loading && !props.error;
});
</script>

<template>
  <!-- 全屏加载 -->
  <Teleport v-if="fullscreen" to="body">
    <div class="loading-fullscreen" role="status" aria-live="polite">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-content">
        <div v-if="type === 'progress'" class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="progressStyle"></div>
          </div>
          <p v-if="progressText" class="progress-text">{{ progressText }}</p>
          <p v-else class="progress-text">{{ Math.round(progress) }}%</p>
        </div>
        <div v-else-if="type === 'skeleton'" class="skeleton-screen">
          <div v-for="item in skeletonItems" :key="item" class="skeleton-row">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-lines">
              <div class="skeleton-line" :style="{ width: `${60 + Math.random() * 30}%` }"></div>
              <div class="skeleton-line skeleton-line--sm" :style="{ width: `${40 + Math.random() * 20}%` }"></div>
            </div>
          </div>
        </div>
        <div v-else :class="['loading-spinner', sizeClasses[size]]">
          <LoaderIcon class="spinner-icon" />
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="loading-error">
        <AlertCircleIcon class="error-icon" />
        <p class="error-message">{{ error }}</p>
        <button v-if="retry" class="retry-button" @click="retry">
          <RefreshCwIcon :size="16" />
          重试
        </button>
      </div>
    </div>
  </Teleport>

  <!-- 内联加载 -->
  <div v-else class="loading-inline" role="status" aria-live="polite">
    <!-- 加载中 -->
    <div v-if="loading" class="loading-content">
      <div v-if="type === 'progress'" class="loading-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="progressStyle"></div>
        </div>
        <p v-if="progressText" class="progress-text">{{ progressText }}</p>
        <p v-else class="progress-text">{{ Math.round(progress) }}%</p>
      </div>
      <div v-else-if="type === 'skeleton'" class="skeleton-inline">
        <div v-for="item in skeletonItems" :key="item" class="skeleton-block" :style="{ height: skeletonHeight }"></div>
      </div>
      <div v-else :class="['loading-spinner', sizeClasses[size]]">
        <LoaderIcon class="spinner-icon" />
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="loading-error-inline">
      <AlertCircleIcon :size="16" class="error-icon-sm" />
      <span class="error-text">{{ error }}</span>
      <button v-if="retry" class="retry-btn" @click="retry">
        <RefreshCwIcon :size="14" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 全屏加载 */
.loading-fullscreen {
  position: fixed;
  inset: 0;
  background: var(--bg-primary, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* 加载动画 */
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner--sm {
  width: 24px;
  height: 24px;
}

.loading-spinner--md {
  width: 40px;
  height: 40px;
}

.loading-spinner--lg {
  width: 56px;
  height: 56px;
}

.spinner-icon {
  width: 100%;
  height: 100%;
  color: var(--primary, #3b82f6);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 进度条 */
.loading-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 200px;
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
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
}

/* 骨架屏 - 全屏 */
.skeleton-screen {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 400px;
}

.skeleton-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
}

.skeleton-line {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line--sm {
  height: 10px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 骨架屏 - 内联 */
.skeleton-inline {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-block {
  width: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* 错误状态 */
.loading-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: var(--danger, #ef4444);
}

.error-message {
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  text-align: center;
  max-width: 300px;
}

.retry-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--primary, #3b82f6);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-button:hover {
  background: var(--primary-hover, #2563eb);
}

.retry-button svg {
  animation: none;
}

/* 内联加载 */
.loading-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.loading-error-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  color: var(--danger, #ef4444);
}

.error-icon-sm {
  flex-shrink: 0;
}

.error-text {
  font-size: 13px;
}

.retry-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: none;
  border: none;
  color: var(--danger, #ef4444);
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* 减少动画 (无障碍) */
@media (prefers-reduced-motion: reduce) {
  .spinner-icon,
  .skeleton-avatar,
  .skeleton-line,
  .skeleton-block {
    animation: none;
    background: var(--bg-tertiary);
  }
  
  .progress-fill {
    transition: none;
  }
}

/* 暗色模式 */
[data-theme="dark"] .loading-fullscreen {
  background: var(--bg-primary, rgba(15, 23, 42, 0.95));
}

[data-theme="dark"] .skeleton-avatar,
[data-theme="dark"] .skeleton-line,
[data-theme="dark"] .skeleton-block {
  background: var(--bg-tertiary, #334155);
}
</style>
