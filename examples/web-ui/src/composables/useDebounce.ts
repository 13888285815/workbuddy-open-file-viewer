/**
 * 防抖和节流 Composable
 */

import { ref, onUnmounted } from 'vue';

// 防抖 Hook
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  }) as T;

  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  return debouncedFn;
}

// 节流 Hook
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  options: { leading?: boolean; trailing?: boolean } = { leading: true, trailing: true }
): T {
  let lastTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const throttledFn = ((...args: Parameters<T>) => {
    const now = Date.now();
    lastArgs = args;

    if (options.leading && lastTime === 0) {
      fn(...args);
      lastTime = now;
    } else if (options.leading || (options.trailing && !timeoutId)) {
      const remaining = delay - (now - lastTime);
      
      if (remaining <= 0 || remaining > delay) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        fn(...args);
        lastTime = now;
      } else if (options.trailing && !timeoutId) {
        timeoutId = setTimeout(() => {
          if (options.trailing && lastArgs) {
            fn(...lastArgs);
          }
          lastTime = options.leading ? Date.now() : 0;
          lastArgs = null;
          timeoutId = null;
        }, remaining);
      }

      lastTime = options.leading ? now : lastTime;
    }
  }) as T;

  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  return throttledFn;
}

// 带取消功能的防抖
export function useDebouncedRef<T>(initialValue: T, delay: number = 300) {
  const value = ref<T>(initialValue) as any;
  const debouncedValue = ref<T>(initialValue);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const update = (newValue: T) => {
    value.value = newValue;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue;
      timeoutId = null;
    }, delay);
  };

  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  return {
    value,
    debouncedValue,
    update,
    cancel: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },
  };
}

// 立即执行的防抖（只在第一次调用时执行）
export function useImmediateDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debouncedFn = ((...args: Parameters<T>) => {
    lastArgs = args;
    fn(...args); // 立即执行

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
    }, delay);
  }) as T;

  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  return debouncedFn;
}

// RAF 节流（基于 requestAnimationFrame）
export function useRAFThrottle<T extends (...args: any[]) => any>(fn: T): T {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  const throttledFn = ((...args: Parameters<T>) => {
    lastArgs = args;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          fn(...lastArgs);
        }
        rafId = null;
      });
    }
  }) as T;

  onUnmounted(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  });

  return throttledFn;
}
