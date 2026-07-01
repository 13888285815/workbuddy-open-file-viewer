/**
 * 图片懒加载指令
 * 
 * 使用方式:
 * <img v-lazy-image src="xxx" data-src="xxx" />
 * 
 * 或在元素上使用:
 * <div v-lazy-image="{ src: 'xxx', loading: 'xxx' }"></div>
 */

import type { Directive, DirectiveBinding } from 'vue';

interface LazyImageOptions {
  src: string;
  loading?: string;
  error?: string;
  rootMargin?: string;
  threshold?: number;
}

const lazyImageDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<LazyImageOptions | string>) {
    const options = typeof binding.value === 'string' 
      ? { src: binding.value } 
      : binding.value;

    const {
      src,
      loading = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',
      error,
      rootMargin = '50px',
      threshold = 0.1,
    } = options || {};

    // 添加加载中的占位符
    if (el.tagName === 'IMG') {
      const imgEl = el as HTMLImageElement;
      imgEl.src = loading;
      imgEl.classList.add('lazy-image');
    } else {
      el.style.backgroundImage = `url(${loading})`;
      el.classList.add('lazy-image-background');
    }

    // 创建 Intersection Observer
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement;
            
            if (target.tagName === 'IMG') {
              // 创建新图片加载
              const tempImg = new Image();
              tempImg.onload = () => {
                target.src = src;
                target.classList.remove('lazy-image');
                target.classList.add('lazy-image-loaded');
              };
              tempImg.onerror = () => {
                if (error) {
                  target.src = error;
                }
                target.classList.remove('lazy-image');
                target.classList.add('lazy-image-error');
              };
              tempImg.src = src;
            } else {
              // 背景图片
              const tempImg = new Image();
              tempImg.onload = () => {
                el.style.backgroundImage = `url(${src})`;
                el.classList.remove('lazy-image-background');
                el.classList.add('lazy-image-loaded');
              };
              tempImg.onerror = () => {
                if (error) {
                  el.style.backgroundImage = `url(${error})`;
                }
                el.classList.remove('lazy-image-background');
                el.classList.add('lazy-image-error');
              };
              tempImg.src = src;
            }

            // 停止观察
            obs.unobserve(target);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    // 开始观察
    observer.observe(el);

    // 存储 observer 引用以便后续清理
    (el as any)._lazyImageObserver = observer;
  },

  unmounted(el: HTMLElement) {
    const observer = (el as any)._lazyImageObserver;
    if (observer) {
      observer.disconnect();
      delete (el as any)._lazyImageObserver;
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding<LazyImageOptions | string>) {
    // 如果值发生变化，重新加载
    if (binding.value !== binding.oldValue) {
      const options = typeof binding.value === 'string'
        ? { src: binding.value }
        : binding.value;
      
      if (options?.src && el.tagName === 'IMG') {
        const imgEl = el as HTMLImageElement;
        imgEl.src = options.src;
      }
    }
  },
};

export default lazyImageDirective;

// 懒加载样式（可选择性添加到全局样式中）
export const lazyImageStyles = `
.lazy-image,
.lazy-image-background {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lazy-image-loaded,
.lazy-image-background.lazy-image-loaded {
  opacity: 1;
}

.lazy-image-error,
.lazy-image-background.lazy-image-error {
  opacity: 0.5;
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .lazy-image,
  .lazy-image-background {
    transition: none;
  }
}
`;

/**
 * 预加载图片
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 批量预加载图片
 */
export async function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage));
}

/**
 * 检查图片是否已缓存
 */
export function isImageCached(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}
