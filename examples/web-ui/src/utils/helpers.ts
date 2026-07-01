/**
 * 辅助工具函数
 */

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string | number, locale: string = 'zh-CN'): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 相对时间格式化
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return '刚刚';
  if (diffMin < 60) return `${diffMin} 分钟前`;
  if (diffHour < 24) return `${diffHour} 小时前`;
  if (diffDay < 7) return `${diffDay} 天前`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} 周前`;
  if (diffDay < 365) return `${Math.floor(diffDay / 30)} 个月前`;
  return `${Math.floor(diffDay / 365)} 年前`;
}

/**
 * 生成唯一 ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 等待指定时间
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    backoff?: boolean;
    onError?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    onError,
  } = options;

  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      onError?.(lastError, attempt);
      
      if (attempt < maxAttempts) {
        const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;
        await sleep(waitTime);
      }
    }
  }
  
  throw lastError!;
}

/**
 * 缓存函数结果
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * 限制并发数
 */
export function pLimit(concurrency: number) {
  let running = 0;
  const queue: (() => void)[] = [];
  
  const next = () => {
    running--;
    if (queue.length > 0) {
      queue.shift()!();
    }
  };
  
  const run = async <T>(fn: () => Promise<T>, resolve: (value: T) => void): Promise<void> => {
    running++;
    fn()
      .then(resolve)
      .finally(() => next());
  };
  
  return async <T>(fn: () => Promise<T>): Promise<T> => {
    return new Promise<T>((resolve) => {
      if (running < concurrency) {
        run(fn, resolve);
      } else {
        queue.push(() => run(fn, resolve));
      }
    });
  };
}

/**
 * 安全地解析 JSON
 */
export function safeJsonParse<T = any>(str: string, fallback?: T): T | undefined {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

/**
 * 本地存储封装
 */
export const storage = {
  get<T>(key: string, fallback?: T): T | undefined {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return fallback;
      return safeJsonParse(item, fallback) ?? fallback;
    } catch {
      return fallback;
    }
  },
  
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove(key: string): void {
    localStorage.removeItem(key);
  },
  
  clear(): void {
    localStorage.clear();
  },
};

/**
 * 节流装饰器
 */
export function throttleDecorator<T extends (...args: any[]) => any>(
  delay: number
): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
  return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    let lastCall = 0;
    
    descriptor.value = function (...args: Parameters<T>) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return originalMethod.apply(this, args);
      }
    };
    
    return descriptor;
  };
}

/**
 * 防抖装饰器
 */
export function debounceDecorator<T extends (...args: any[]) => any>(
  delay: number
): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
  return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    let timeoutId: ReturnType<typeof setTimeout>;
    
    descriptor.value = function (...args: Parameters<T>) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };
    
    return descriptor;
  };
}

/**
 * 检测是否为移动设备
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 检测是否为触屏设备
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * 检测是否支持 WebP
 */
export async function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width > 0);
    img.onerror = () => resolve(false);
    img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQO3aVEQAAAABJRU5ErkJggg==';
  });
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * 下载文件
 */
export function downloadFile(url: string, filename: string): void;
export function downloadFile(blob: Blob, filename: string): void;
export function downloadFile(content: string, filename: string, mimeType: string): void;
export function downloadFile(
  content: string | Blob | URL,
  filename: string,
  mimeType?: string
): void {
  let blob: Blob;
  
  if (content instanceof Blob) {
    blob = content;
  } else if (content instanceof URL) {
    const a = document.createElement('a');
    a.href = content.toString();
    a.download = filename;
    a.click();
    return;
  } else {
    blob = new Blob([content], { type: mimeType || 'application/octet-stream' });
  }
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * 简化版本号比较
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  
  return 0;
}

/**
 * 计算字符串哈希值（简单版）
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
