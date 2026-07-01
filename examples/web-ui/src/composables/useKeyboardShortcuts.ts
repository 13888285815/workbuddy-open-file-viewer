/**
 * 键盘快捷键管理 Composable
 * 支持快捷键注册、冲突检测、提示显示
 */

import { ref, onMounted, onUnmounted } from 'vue';

export interface KeyboardShortcut {
  key: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  description: string;
  descriptionZh?: string;
  action: () => void;
  global?: boolean;
  inputFields?: string[]; // 忽略快捷键的输入字段选择器
}

export interface ShortcutGroup {
  name: string;
  nameZh: string;
  shortcuts: KeyboardShortcut[];
}

// 默认快捷键定义
export const defaultShortcutGroups: ShortcutGroup[] = [
  {
    name: 'File Operations',
    nameZh: '文件操作',
    shortcuts: [
      { key: 'o', modifiers: ['ctrl'], description: 'Open file', descriptionZh: '打开文件', action: () => {} },
      { key: 's', modifiers: ['ctrl'], description: 'Save', descriptionZh: '保存', action: () => {} },
      { key: 'Delete', description: 'Delete selected', descriptionZh: '删除选中项', action: () => {} },
      { key: 'F2', description: 'Rename', descriptionZh: '重命名', action: () => {} },
    ]
  },
  {
    name: 'Navigation',
    nameZh: '导航',
    shortcuts: [
      { key: 'ArrowLeft', description: 'Go back', descriptionZh: '后退', action: () => {} },
      { key: 'ArrowRight', description: 'Go forward', descriptionZh: '前进', action: () => {} },
      { key: 'Home', description: 'Go to root', descriptionZh: '返回根目录', action: () => {} },
      { key: 'f', modifiers: ['ctrl'], description: 'Focus search', descriptionZh: '聚焦搜索', action: () => {} },
    ]
  },
  {
    name: 'Selection',
    nameZh: '选择',
    shortcuts: [
      { key: 'a', modifiers: ['ctrl'], description: 'Select all', descriptionZh: '全选', action: () => {} },
      { key: 'Escape', description: 'Clear selection', descriptionZh: '取消选择', action: () => {} },
    ]
  },
  {
    name: 'Clipboard',
    nameZh: '剪贴板',
    shortcuts: [
      { key: 'c', modifiers: ['ctrl'], description: 'Copy', descriptionZh: '复制', action: () => {} },
      { key: 'x', modifiers: ['ctrl'], description: 'Cut', descriptionZh: '剪切', action: () => {} },
      { key: 'v', modifiers: ['ctrl'], description: 'Paste', descriptionZh: '粘贴', action: () => {} },
    ]
  },
  {
    name: 'View',
    nameZh: '视图',
    shortcuts: [
      { key: 'Enter', description: 'Preview file', descriptionZh: '预览文件', action: () => {} },
      { key: 'F11', description: 'Toggle fullscreen', descriptionZh: '切换全屏', action: () => {} },
      { key: 'z', modifiers: ['ctrl'], description: 'Undo', descriptionZh: '撤销', action: () => {} },
      { key: 'z', modifiers: ['ctrl', 'shift'], description: 'Redo', descriptionZh: '重做', action: () => {} },
    ]
  }
];

// 快捷键到显示名称的映射
const keyDisplayNames: Record<string, string> = {
  'ctrl': 'Ctrl',
  'alt': 'Alt',
  'shift': 'Shift',
  'meta': '⌘',
  'ArrowLeft': '←',
  'ArrowRight': '→',
  'ArrowUp': '↑',
  'ArrowDown': '↓',
  'Enter': 'Enter',
  'Escape': 'Esc',
  'Delete': 'Del',
  'Backspace': 'Backspace',
  'Tab': 'Tab',
  'Space': 'Space',
  'Home': 'Home',
  'End': 'End',
  'PageUp': 'Page Up',
  'PageDown': 'Page Down',
  'F1': 'F1',
  'F2': 'F2',
  'F3': 'F3',
  'F4': 'F4',
  'F5': 'F5',
  'F6': 'F6',
  'F7': 'F7',
  'F8': 'F8',
  'F9': 'F9',
  'F10': 'F10',
  'F11': 'F11',
  'F12': 'F12',
};

export function getKeyDisplayName(key: string): string {
  return keyDisplayNames[key] || key.toUpperCase();
}

export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  if (shortcut.modifiers) {
    for (const mod of shortcut.modifiers) {
      parts.push(getKeyDisplayName(mod));
    }
  }
  parts.push(getKeyDisplayName(shortcut.key));
  return parts.join('+');
}

export function useKeyboardShortcuts() {
  const shortcuts = ref<KeyboardShortcut[]>([]);
  const conflictMap = ref<Map<string, string[]>>(new Map());
  const isEnabled = ref(true);

  // 解析快捷键字符串为事件格式
  const parseShortcut = (shortcut: KeyboardShortcut) => {
    const modifiers: string[] = [];
    let key = shortcut.key;

    if (shortcut.modifiers) {
      for (const mod of shortcut.modifiers) {
        if (mod === 'ctrl') modifiers.push('ctrlKey');
        else if (mod === 'alt') modifiers.push('altKey');
        else if (mod === 'shift') modifiers.push('shiftKey');
        else if (mod === 'meta') modifiers.push('metaKey');
      }
    }

    return { modifiers, key: key.toLowerCase() };
  };

  // 检测冲突
  const detectConflicts = (): Map<string, string[]> => {
    const conflicts = new Map<string, string[]>();
    const signatureMap = new Map<string, string[]>();

    for (const shortcut of shortcuts.value) {
      const { modifiers, key } = parseShortcut(shortcut);
      const signature = [...modifiers.sort(), key.toLowerCase()].join('+');

      if (signatureMap.has(signature)) {
        const existing = signatureMap.get(signature)!;
        existing.push(shortcut.description);
        signatureMap.set(signature, existing);
      } else {
        signatureMap.set(signature, [shortcut.description]);
      }
    }

    for (const [signature, descriptions] of signatureMap) {
      if (descriptions.length > 1) {
        conflicts.set(signature, descriptions);
      }
    }

    conflictMap.value = conflicts;
    return conflicts;
  };

  // 格式化冲突信息
  const getConflictMessage = (shortcut: KeyboardShortcut): string | null => {
    const { modifiers, key } = parseShortcut(shortcut);
    const signature = [...modifiers.sort(), key.toLowerCase()].join('+');
    const conflicts = conflictMap.value.get(signature);
    
    if (conflicts && conflicts.length > 1) {
      return `快捷键冲突: ${conflicts.join(', ')}`;
    }
    return null;
  };

  // 注册快捷键
  const registerShortcut = (shortcut: KeyboardShortcut) => {
    // 检查冲突
    const conflict = getConflictMessage(shortcut);
    if (conflict) {
      console.warn(conflict);
    }
    
    shortcuts.value.push(shortcut);
    return detectConflicts().size === 0;
  };

  // 批量注册快捷键
  const registerShortcuts = (newShortcuts: KeyboardShortcut[]) => {
    for (const shortcut of newShortcuts) {
      shortcuts.value.push(shortcut);
    }
    return detectConflicts().size === 0;
  };

  // 移除快捷键
  const unregisterShortcut = (description: string) => {
    const index = shortcuts.value.findIndex(s => s.description === description);
    if (index !== -1) {
      shortcuts.value.splice(index, 1);
    }
  };

  // 处理键盘事件
  const handleKeydown = (e: KeyboardEvent) => {
    if (!isEnabled.value) return;

    // 检查是否在输入字段中
    const target = e.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || 
                         target.tagName === 'TEXTAREA' || 
                         target.isContentEditable;

    for (const shortcut of shortcuts.value) {
      // 如果是全局快捷键或在非输入字段中
      if (shortcut.global || !isInputField) {
        // 检查修饰键
        const ctrlMatch = shortcut.modifiers?.includes('ctrl') ? e.ctrlKey : !e.ctrlKey;
        const altMatch = shortcut.modifiers?.includes('alt') ? e.altKey : !e.altKey;
        const shiftMatch = shortcut.modifiers?.includes('shift') ? e.shiftKey : !e.shiftKey;
        const metaMatch = shortcut.modifiers?.includes('meta') ? e.metaKey : !e.metaKey;

        if (ctrlMatch && altMatch && shiftMatch && metaMatch &&
            e.key.toLowerCase() === shortcut.key.toLowerCase()) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    }
  };

  // 启用/禁用
  const enable = () => { isEnabled.value = true; };
  const disable = () => { isEnabled.value = false; };

  // 生命周期
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });

  return {
    shortcuts,
    conflictMap,
    isEnabled,
    registerShortcut,
    registerShortcuts,
    unregisterShortcut,
    detectConflicts,
    getConflictMessage,
    formatShortcut,
    enable,
    disable,
    defaultShortcutGroups,
  };
}

// 导出快捷键工具函数
export { formatShortcut as formatShortcutKey };
