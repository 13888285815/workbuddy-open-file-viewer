/**
 * 通知系统 Composable
 * 支持成功/警告/错误通知、自动消失、通知队列、声音提醒
 */

import { ref, computed, watch } from 'vue';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface NotificationOptions {
  type?: NotificationType;
  title: string;
  message?: string;
  duration?: number; // 0 = 不自动消失
  persistent?: boolean;
  sound?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
  onClose?: () => void;
}

export interface Notification extends NotificationOptions {
  id: string;
  createdAt: number;
  visible: boolean;
}

const DEFAULT_DURATION = 4000;
const MAX_NOTIFICATIONS = 5;
const SOUND_URLS: Record<NotificationType, string> = {
  success: 'data:audio/wav;base64,UklGRl9vT19teleWVBGT18AABB8A',
  warning: 'data:audio/wav;base64,UklGRl9vT19teleWVBGT18AABB8A',
  error: 'data:audio/wav;base64,UklGRl9vT19teleWVBGT18AABB8A',
  info: 'data:audio/wav;base64,UklGRl9vT19teleWVBGT18AABB8A',
};

let notificationIdCounter = 0;

// 创建音频元素（延迟创建以避免加载问题）
let audioElement: HTMLAudioElement | null = null;

const getAudioElement = (): HTMLAudioElement => {
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.volume = 0.3;
  }
  return audioElement;
};

// 播放通知声音
const playSound = (type: NotificationType, enabled: boolean) => {
  if (!enabled || type === 'info') return;
  
  try {
    const audio = getAudioElement();
    // 使用简单的蜂鸣声
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = type === 'success' ? 880 : type === 'error' ? 440 : 660;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // 静默失败
  }
};

export function useNotifications() {
  const notifications = ref<Notification[]>([]);
  const soundEnabled = ref(true);
  const queue = ref<Notification[]>([]);

  // 计算可见的通知（最多 MAX_NOTIFICATIONS）
  const visibleNotifications = computed(() => {
    return notifications.value
      .filter(n => n.visible)
      .slice(0, MAX_NOTIFICATIONS);
  });

  // 添加通知
  const add = (options: NotificationOptions): string => {
    const id = `notification-${++notificationIdCounter}`;
    const notification: Notification = {
      id,
      type: 'info',
      duration: DEFAULT_DURATION,
      sound: true,
      ...options,
      createdAt: Date.now(),
      visible: true,
    };

    // 如果超过最大数量，加入队列
    if (notifications.value.filter(n => n.visible).length >= MAX_NOTIFICATIONS) {
      queue.value.push(notification);
    } else {
      notifications.value.push(notification);
    }

    // 播放声音
    if (notification.sound) {
      playSound(notification.type || 'info', soundEnabled.value);
    }

    // 设置自动消失
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        remove(id);
      }, notification.duration);
    }

    return id;
  };

  // 便捷方法
  const success = (title: string, message?: string, options?: Partial<NotificationOptions>) => {
    return add({ type: 'success', title, message, ...options });
  };

  const error = (title: string, message?: string, options?: Partial<NotificationOptions>) => {
    return add({ type: 'error', title, message, duration: options?.duration ?? 6000, ...options });
  };

  const warning = (title: string, message?: string, options?: Partial<NotificationOptions>) => {
    return add({ type: 'warning', title, message, ...options });
  };

  const info = (title: string, message?: string, options?: Partial<NotificationOptions>) => {
    return add({ type: 'info', title, message, ...options });
  };

  // 移除通知
  const remove = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      const notification = notifications.value[index];
      notification.visible = false;
      notification.onClose?.();
      
      // 延迟移除以支持动画
      setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id);
        
        // 处理队列
        if (queue.value.length > 0) {
          const next = queue.value.shift()!;
          notifications.value.push({ ...next, visible: true });
        }
      }, 300);
    }
  };

  // 清除所有通知
  const clear = () => {
    for (const notification of notifications.value) {
      notification.onClose?.();
    }
    notifications.value = [];
    queue.value = [];
  };

  // 切换声音
  const toggleSound = () => {
    soundEnabled.value = !soundEnabled.value;
  };

  // 等待队列中的下一个通知
  watch(
    () => notifications.value.filter(n => n.visible).length,
    (count) => {
      if (count < MAX_NOTIFICATIONS && queue.value.length > 0) {
        const next = queue.value.shift()!;
        notifications.value.push({ ...next, visible: true });
      }
    }
  );

  return {
    notifications: visibleNotifications,
    allNotifications: notifications,
    soundEnabled,
    add,
    success,
    error,
    warning,
    info,
    remove,
    clear,
    toggleSound,
  };
}

// 创建全局通知实例
let globalNotifications: ReturnType<typeof useNotifications> | null = null;

export function useGlobalNotifications() {
  if (!globalNotifications) {
    globalNotifications = useNotifications();
  }
  return globalNotifications;
}
