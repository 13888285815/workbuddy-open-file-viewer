/**
 * 虚拟滚动 Composable
 * 用于长列表的高性能渲染
 */

import { ref, computed, onMounted, onUnmounted, watch, type Ref } from 'vue';

export interface VirtualScrollOptions {
  itemHeight: number | ((index: number) => number); // 固定高度或动态高度
  buffer?: number; // 缓冲区大小（预渲染的项目数）
  horizontal?: boolean; // 水平滚动模式
}

export interface VirtualScrollReturn<T> {
  containerRef: Ref<HTMLElement | null>;
  visibleItems: Ref<{ item: T; index: number; style: Record<string, string | number> }[]>;
  totalHeight: Ref<number>;
  scrollTop: Ref<number>;
  scrollTo: (index: number) => void;
  scrollToItem: (index: number, align: 'start' | 'center' | 'end' | 'auto') => void;
  getItemOffset: (index: number) => number;
  getItemSize: (index: number) => number;
  updateItems: (items: T[]) => void;
  resetScroll: () => void;
}

export function useVirtualScroll<T>(
  items: Ref<T[]>,
  options: VirtualScrollOptions
): VirtualScrollReturn<T> {
  const {
    itemHeight,
    buffer = 5,
    horizontal = false,
  } = options;

  const containerRef = ref<HTMLElement | null>(null);
  const scrollTop = ref(0);
  const containerHeight = ref(0);

  // 获取单个项目高度
  const getItemSize = (index: number): number => {
    if (typeof itemHeight === 'function') {
      return itemHeight(index);
    }
    return itemHeight;
  };

  // 计算累积高度（获取某个索引之前的总高度）
  const getItemOffset = (index: number): number => {
    if (index <= 0) return 0;
    
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemSize(i);
    }
    return offset;
  };

  // 总高度
  const totalHeight = computed(() => {
    let height = 0;
    for (let i = 0; i < items.value.length; i++) {
      height += getItemSize(i);
    }
    return height;
  });

  // 滚动方向
  const isHorizontal = horizontal;

  // 可见区域大小
  const viewportSize = computed(() => {
    if (isHorizontal) {
      return containerRef.value?.clientWidth || 0;
    }
    return containerHeight.value;
  });

  // 计算可见的起始和结束索引
  const visibleRange = computed(() => {
    const size = viewportSize.value;
    if (size === 0) return { start: 0, end: 0 };

    // 计算起始索引（二分查找优化）
    let start = 0;
    let end = items.value.length - 1;
    
    // 找到第一个 offset > scrollTop 的项
    while (start < end) {
      const mid = Math.floor((start + end) / 2);
      if (getItemOffset(mid) < scrollTop.value) {
        start = mid + 1;
      } else {
        end = mid;
      }
    }

    const startIndex = Math.max(0, start - buffer);

    // 从起始位置向下查找直到超出可见区域
    let offset = getItemOffset(startIndex);
    let endIndex = startIndex;
    
    while (endIndex < items.value.length && offset < scrollTop.value + size) {
      offset += getItemSize(endIndex);
      endIndex++;
    }

    const endIndexAdjusted = Math.min(items.value.length, endIndex + buffer);

    return { start: startIndex, end: endIndexAdjusted };
  });

  // 可见项目列表
  const visibleItems = computed(() => {
    const { start, end } = visibleRange.value;
    const result: { item: T; index: number; style: Record<string, string | number> }[] = [];

    for (let i = start; i < end && i < items.value.length; i++) {
      const offset = getItemOffset(i);
      const size = getItemSize(i);

      if (isHorizontal) {
        result.push({
          item: items.value[i],
          index: i,
          style: {
            position: 'absolute',
            left: `${offset}px`,
            top: 0,
            height: '100%',
            width: `${size}px`,
          },
        });
      } else {
        result.push({
          item: items.value[i],
          index: i,
          style: {
            position: 'absolute',
            top: `${offset}px`,
            left: 0,
            width: '100%',
            height: `${size}px`,
          },
        });
      }
    }

    return result;
  });

  // 滚动事件处理
  const handleScroll = () => {
    if (containerRef.value) {
      if (isHorizontal) {
        scrollTop.value = containerRef.value.scrollLeft;
      } else {
        scrollTop.value = containerRef.value.scrollTop;
      }
    }
  };

  // 滚动到指定位置
  const scrollTo = (offset: number) => {
    if (containerRef.value) {
      if (isHorizontal) {
        containerRef.value.scrollLeft = offset;
      } else {
        containerRef.value.scrollTop = offset;
      }
    }
  };

  // 滚动到指定项
  const scrollToItem = (index: number, align: 'start' | 'center' | 'end' | 'auto' = 'auto') => {
    const offset = getItemOffset(index);
    const size = getItemSize(index);
    const viewportSize = isHorizontal
      ? containerRef.value?.clientWidth || 0
      : containerHeight.value;

    let targetOffset = offset;

    switch (align) {
      case 'center':
        targetOffset = offset - viewportSize / 2 + size / 2;
        break;
      case 'end':
        targetOffset = offset - viewportSize + size;
        break;
      case 'auto':
        // 如果当前可见，自动对齐
        if (offset < scrollTop.value) {
          targetOffset = offset;
        } else if (offset + size > scrollTop.value + viewportSize) {
          targetOffset = offset - viewportSize + size;
        }
        break;
    }

    scrollTo(Math.max(0, targetOffset));
  };

  // 重置滚动位置
  const resetScroll = () => {
    scrollTo(0);
  };

  // 更新项（用于外部传入新的 items）
  const updateItems = (newItems: T[]) => {
    items.value = newItems;
  };

  // 监听容器大小变化
  let resizeObserver: ResizeObserver | null = null;

  onMounted(() => {
    if (containerRef.value) {
      // 获取初始高度
      if (isHorizontal) {
        containerHeight.value = containerRef.value.clientWidth;
      } else {
        containerHeight.value = containerRef.value.clientHeight;
      }

      // 添加滚动监听
      containerRef.value.addEventListener('scroll', handleScroll, { passive: true });

      // 监听容器大小变化
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (isHorizontal) {
            containerHeight.value = entry.contentRect.width;
          } else {
            containerHeight.value = entry.contentRect.height;
          }
        }
      });
      resizeObserver.observe(containerRef.value);
    }
  });

  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', handleScroll);
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });

  return {
    containerRef,
    visibleItems,
    totalHeight,
    scrollTop,
    scrollTo,
    scrollToItem,
    getItemOffset,
    getItemSize,
    updateItems,
    resetScroll,
  };
}

// 简化的虚拟列表（固定高度）
export function useSimpleVirtualScroll<T>(
  itemCount: Ref<number>,
  itemHeight: number,
  containerHeight: Ref<number>,
  overscan: number = 3
) {
  const scrollTop = ref(0);

  const startIndex = computed(() => {
    return Math.max(0, Math.floor(scrollTop.value / itemHeight) - overscan);
  });

  const endIndex = computed(() => {
    const visibleCount = Math.ceil(containerHeight.value / itemHeight);
    return Math.min(itemCount.value - 1, startIndex.value + visibleCount + overscan * 2);
  });

  const visibleRange = computed(() => {
    const items: { index: number; style: Record<string, string | number> }[] = [];
    for (let i = startIndex.value; i <= endIndex.value; i++) {
      items.push({
        index: i,
        style: {
          position: 'absolute' as const,
          top: `${i * itemHeight}px`,
          left: 0,
          right: 0,
          height: `${itemHeight}px`,
        },
      });
    }
    return items;
  });

  const totalHeight = computed(() => itemCount.value * itemHeight);

  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    scrollTop.value = target.scrollTop;
  };

  return {
    scrollTop,
    startIndex,
    endIndex,
    visibleRange,
    totalHeight,
    handleScroll,
  };
}
