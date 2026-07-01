/**
 * Open File Viewer Web UI - 主入口
 *
 * 功能:
 * - Vue 3 应用启动
 * - 指令注册
 * - 全局样式
 */

import { createApp, type App } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import '@open-file-viewer/core/style.css';
import './style.css';

// 导入组件
import lazyImageDirective from './directives/lazyImage';

// 创建应用实例
const app: App<Element> = createApp(App);

// 注册 Pinia
app.use(createPinia());

// 注册全局指令
app.directive('lazy-image', lazyImageDirective);

// 挂载应用
app.mount('#app');

// 开发模式提示
if (import.meta.env.DEV) {
  console.log(
    '%c Open File Viewer %c Web UI ',
    'background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px 0 0 4px;',
    'background: #1e293b; color: white; padding: 4px 8px; border-radius: 0 4px 4px 0;'
  );
}

// 注册 service worker（可选，用于 PWA）
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker 注册失败，静默处理
    });
  });
}
