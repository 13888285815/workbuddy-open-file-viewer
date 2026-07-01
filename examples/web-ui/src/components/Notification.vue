<script setup lang="ts">
/**
 * 通知组件
 * 成功/警告/错误通知，自动消失，通知队列，声音提醒
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { 
  CheckCircleIcon, 
  AlertCircleIcon, 
  AlertTriangleIcon, 
  InfoIcon, 
  XIcon,
  Volume2Icon,
  VolumeXIcon
} from 'lucide-vue-next';
import type { Notification, NotificationType } from '../composables/useNotifications';

// Props
const props = defineProps<{
  notifications: Notification[];
  soundEnabled: boolean;
}>();

// Emits
const emit = defineEmits<{
  close: [id: string];
  'toggle-sound': [];
}>();

// 图标映射
const icons: Record<NotificationType, any> = {
  success: CheckCircleIcon,
  error: AlertCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoIcon,
};

// 获取图标
const getIcon = (type: NotificationType) => icons[type] || InfoIcon;

// 计算通知样式
const getNotificationClass = (notification: Notification) => [
  'notification',
  `notification-${notification.type || 'info'}`,
  { 'notification-entering': notification.visible }
];

// 处理关闭
const handleClose = (id: string) => {
  emit('close', id);
};

// 处理声音切换
const handleToggleSound = () => {
  emit('toggle-sound');
};

// 键盘支持
const handleKeydown = (e: KeyboardEvent, id: string) => {
  if (e.key === 'Escape') {
    handleClose(id);
  }
};

// 动画状态追踪
const animatingIds = ref<Set<string>>(new Set());

// 监听通知变化，添加进入动画
watch(
  () => props.notifications.map(n => n.id),
  (newIds, oldIds) => {
    if (oldIds) {
      const newIdSet = new Set(newIds);
      const oldIdSet = new Set(oldIds || []);
      for (const id of newIdSet) {
        if (!oldIdSet.has(id)) {
          animatingIds.value.add(id);
          setTimeout(() => {
            animatingIds.value.delete(id);
          }, 300);
        }
      }
    }
  }
);
</script>

<template>
  <Teleport to="body">
    <div class="notification-container" role="region" aria-label="通知">
      <!-- 声音控制 -->
      <button 
        class="notification-sound-toggle"
        :class="{ 'sound-disabled': !soundEnabled }"
        @click="handleToggleSound"
        :aria-label="soundEnabled ? '关闭声音' : '开启声音'"
      >
        <Volume2Icon v-if="soundEnabled" :size="18" />
        <VolumeXIcon v-else :size="18" />
      </button>

      <!-- 通知列表 -->
      <TransitionGroup name="notification" tag="div" class="notification-list">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[...getNotificationClass(notification), { 'is-entering': animatingIds.has(notification.id) }]"
          role="alert"
          :aria-live="notification.type === 'error' ? 'assertive' : 'polite'"
          @keydown="handleKeydown($event, notification.id)"
        >
          <!-- 图标 -->
          <div class="notification-icon">
            <component :is="getIcon(notification.type || 'info')" :size="20" />
          </div>

          <!-- 内容 -->
          <div class="notification-content">
            <p class="notification-title">{{ notification.title }}</p>
            <p v-if="notification.message" class="notification-message">
              {{ notification.message }}
            </p>

            <!-- 操作按钮 -->
            <div v-if="notification.action" class="notification-actions">
              <button 
                class="notification-action-btn"
                @click="notification.action?.handler"
              >
                {{ notification.action.label }}
              </button>
            </div>
          </div>

          <!-- 关闭按钮 -->
          <button 
            class="notification-close"
            @click="handleClose(notification.id)"
            aria-label="关闭通知"
          >
            <XIcon :size="16" />
          </button>

          <!-- 进度条（如果有持续时间） -->
          <div 
            v-if="notification.duration && notification.duration > 0 && !notification.persistent"
            class="notification-progress"
            :style="{ animationDuration: `${notification.duration}ms` }"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  pointer-events: none;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: auto;
}

/* 声音控制按钮 */
.notification-sound-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--border, #e2e8f0);
  background: var(--bg-primary, #ffffff);
  color: var(--text-secondary, #64748b);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  pointer-events: auto;
}

.notification-sound-toggle:hover {
  background: var(--bg-secondary, #f8fafc);
  color: var(--text-primary, #1e293b);
}

.sound-disabled {
  color: var(--danger, #ef4444);
}

/* 通知卡片 */
.notification {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 320px;
  max-width: 420px;
  padding: 14px 16px;
  background: var(--bg-primary, #ffffff);
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 10px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  pointer-events: auto;
}

.notification-entering {
  animation: slideIn 0.3s ease-out forwards;
}

.is-entering {
  animation: slideIn 0.3s ease-out forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 颜色变体 */
.notification-success {
  border-left: 4px solid var(--success, #22c55e);
}

.notification-success .notification-icon {
  color: var(--success, #22c55e);
}

.notification-error {
  border-left: 4px solid var(--danger, #ef4444);
}

.notification-error .notification-icon {
  color: var(--danger, #ef4444);
}

.notification-warning {
  border-left: 4px solid var(--warning, #f59e0b);
}

.notification-warning .notification-icon {
  color: var(--warning, #f59e0b);
}

.notification-info {
  border-left: 4px solid var(--primary, #3b82f6);
}

.notification-info .notification-icon {
  color: var(--primary, #3b82f6);
}

/* 图标 */
.notification-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

/* 内容 */
.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin: 0;
  line-height: 1.4;
}

.notification-message {
  font-size: 13px;
  color: var(--text-secondary, #64748b);
  margin: 4px 0 0;
  line-height: 1.4;
}

/* 操作按钮 */
.notification-actions {
  margin-top: 10px;
}

.notification-action-btn {
  padding: 6px 12px;
  background: var(--bg-secondary, #f8fafc);
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary, #1e293b);
  cursor: pointer;
  transition: all 0.2s;
}

.notification-action-btn:hover {
  background: var(--bg-tertiary, #f1f5f9);
}

/* 关闭按钮 */
.notification-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text-muted, #94a3b8);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  margin: -2px -4px 0 0;
}

.notification-close:hover {
  background: var(--bg-tertiary, #f1f5f9);
  color: var(--text-secondary, #64748b);
}

/* 进度条 */
.notification-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--primary, #3b82f6);
  opacity: 0.3;
  animation: progress linear forwards;
}

.notification-success .notification-progress {
  background: var(--success, #22c55e);
}

.notification-error .notification-progress {
  background: var(--danger, #ef4444);
}

.notification-warning .notification-progress {
  background: var(--warning, #f59e0b);
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* 过渡动画 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* 响应式 */
@media (max-width: 480px) {
  .notification-container {
    top: 8px;
    right: 8px;
    left: 8px;
  }

  .notification {
    min-width: auto;
    max-width: none;
    width: 100%;
  }

  .notification-sound-toggle {
    top: 8px;
    right: 8px;
  }
}

/* 减少动画 (无障碍) */
@media (prefers-reduced-motion: reduce) {
  .notification-entering,
  .is-entering {
    animation: none;
    opacity: 1;
    transform: translateX(0);
  }

  .notification-progress {
    animation: none;
    width: 0;
  }

  .notification-enter-active,
  .notification-leave-active {
    transition: opacity 0.2s ease;
  }

  .notification-enter-from,
  .notification-leave-to {
    opacity: 0;
    transform: none;
  }
}

/* 暗色模式 */
[data-theme="dark"] .notification {
  background: var(--bg-primary, #0f172a);
  border-color: var(--border, #334155);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .notification-action-btn {
  background: var(--bg-secondary, #1e293b);
  border-color: var(--border, #334155);
}

[data-theme="dark"] .notification-action-btn:hover {
  background: var(--bg-tertiary, #334155);
}

[data-theme="dark"] .notification-close:hover {
  background: var(--bg-tertiary, #334155);
}
</style>
