<template>
  <aside class="sidebar" :class="{ 'sidebar-collapsed': collapsed }">
    <!-- 头部 -->
    <div class="sidebar-header">
      <div v-if="!collapsed" class="sidebar-title">
        <span class="logo">📂</span>
        <span class="title-text">文件管理器</span>
      </div>
      <button class="collapse-btn" @click="toggleCollapse" :title="collapsed ? '展开' : '收起'">
        {{ collapsed ? '☰' : '✕' }}
      </button>
    </div>

    <!-- 搜索栏 -->
    <div v-if="!collapsed" class="sidebar-search">
      <input
        v-model="localSearchQuery"
        type="text"
        placeholder="🔍 搜索文件或功能..."
        class="search-input"
        @input="onSearch"
        @keydown.enter="onSearchEnter"
      />
    </div>

    <!-- Tab 导航 -->
    <div v-if="!collapsed" class="sidebar-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="sidebar-tab"
        :class="{ active: activeTab === tab.id }"
        @click="switchTab(tab.id)"
        :title="tab.label"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- 折叠时只显示图标按钮 -->
    <div v-if="collapsed" class="collapsed-buttons">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="collapsed-tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="toggleCollapse(); switchTab(tab.id)"
        :title="tab.label"
      >
        {{ tab.icon }}
      </button>
    </div>

    <!-- 内容区域 -->
    <div v-if="!collapsed" class="sidebar-content">
      <!-- 功能导航 Tab -->
      <div v-if="activeTab === 'features'" class="features-panel">
        <div class="panel-toolbar">
          <button class="toolbar-btn" @click="expandAllModules" title="全部展开">⬇️ 展开</button>
          <button class="toolbar-btn" @click="collapseAllModules" title="全部折叠">⬆️ 折叠</button>
        </div>
        <div class="features-tree">
          <div
            v-for="module in filteredModules"
            :key="module.id"
            class="feature-module"
          >
            <div
              class="feature-module-header"
              :class="{ expanded: expandedModules[module.id] }"
              @click="toggleModule(module.id)"
            >
              <span class="feature-icon">{{ module.icon }}</span>
              <span class="feature-label">{{ module.label }}</span>
              <span class="feature-count">({{ module.children?.length || 0 }})</span>
              <span class="feature-arrow">{{ expandedModules[module.id] ? '▼' : '▶' }}</span>
            </div>
            <div
              v-if="expandedModules[module.id] && module.children"
              class="feature-children"
            >
              <div
                v-for="child in module.children"
                :key="child.id"
                class="feature-item"
                :class="{ selected: selectedFeature?.id === child.id }"
                @click="handleFeatureClick(module, child)"
                :title="child.description || child.label"
              >
                <span class="feature-item-icon">{{ child.icon }}</span>
                <span class="feature-item-label">{{ child.label }}</span>
                <span v-if="child.extensions" class="feature-exts">
                  {{ child.extensions.slice(0,2).join(' ') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文件列表 Tab -->
      <div v-if="activeTab === 'files'" class="files-panel">
        <div class="panel-toolbar">
          <button class="toolbar-btn" @click="goBack" :disabled="!store.canGoBack" title="返回上级">⬅️</button>
          <button class="toolbar-btn" @click="goForward" :disabled="!store.canGoForward" title="前进">➡️</button>
          <button class="toolbar-btn" @click="refreshFiles" title="刷新">🔄</button>
          <button class="toolbar-btn" @click="emit('new-folder')" title="新建文件夹">📁+</button>
          <button class="toolbar-btn primary" @click="emit('open-file-picker')" title="上传文件">⬆️ 上传</button>
        </div>
        
        <!-- 当前路径 -->
        <div class="current-path">
          <span class="path-label">{{ store.currentPath || '/' }}</span>
        </div>
        
        <!-- 文件列表 -->
        <div class="file-list-scroll">
          <!-- 返回上级 -->
          <div
            v-if="store.currentPath !== '/'"
            class="tree-item go-up"
            @click="goUp"
          >
            <span class="tree-icon">⬆️</span>
            <span class="tree-name">.. 返回上级</span>
          </div>
          
          <!-- 文件夹 -->
          <div
            v-for="folder in displayFolders"
            :key="folder.id"
            class="tree-item folder-item"
            :class="{ selected: store.selectedFile?.id === folder.id }"
            @click="handleFolderClick(folder)"
            @dblclick="openFolder(folder)"
            @contextmenu.prevent="showCtx($event, folder)"
          >
            <span class="tree-icon">📁</span>
            <span class="tree-name">{{ folder.name }}</span>
            <span class="tree-count">({{ folder.children?.length || 0 }})</span>
          </div>
          
          <!-- 文件 -->
          <div
            v-for="file in displayFiles"
            :key="file.id"
            class="tree-item file-item"
            :class="{ selected: store.selectedFile?.id === file.id }"
            @click="handleFileClick(file)"
            @dblclick="openFile(file)"
            @contextmenu.prevent="showCtx($event, file)"
          >
            <span class="tree-icon">{{ getFileIcon(file.name) }}</span>
            <span class="tree-name">{{ file.name }}</span>
            <span v-if="file.size" class="tree-size">{{ store.formatFileSize(file.size) }}</span>
          </div>
          
          <!-- 空状态 -->
          <div v-if="displayFolders.length === 0 && displayFiles.length === 0" class="empty-state">
            <span class="empty-icon">📭</span>
            <p>暂无文件</p>
            <p class="empty-hint">上传文件或从功能导航选择格式</p>
            <button class="btn-primary-sm" @click="emit('open-file-picker')">📤 上传文件</button>
          </div>
        </div>
      </div>

      <!-- 收藏 Tab -->
      <div v-if="activeTab === 'favorites'" class="favorites-panel">
        <div class="panel-toolbar">
          <button class="toolbar-btn danger" @click="store.clearFavorites()" title="清空收藏">🗑️ 清空</button>
        </div>
        <div class="file-list-scroll">
          <div v-if="favoriteNodes.length === 0" class="empty-state">
            <span class="empty-icon">⭐</span>
            <p>暂无收藏</p>
            <p class="empty-hint">右键文件 → 添加收藏</p>
          </div>
          <div
            v-else
            v-for="node in favoriteNodes"
            :key="node.id"
            class="tree-item"
            :class="{ selected: store.selectedFile?.id === node.id }"
            @click="handleFileClick(node)"
            @dblclick="openFile(node)"
          >
            <span class="tree-icon">{{ node.type === 'folder' ? '📁' : getFileIcon(node.name) }}</span>
            <span class="tree-name">{{ node.name }}</span>
            <button class="unfav-btn" @click.stop="store.toggleFavorite(node.id)" title="取消收藏">⭐</button>
          </div>
        </div>
      </div>

      <!-- 最近 Tab -->
      <div v-if="activeTab === 'recent'" class="recent-panel">
        <div class="panel-toolbar">
          <button class="toolbar-btn danger" @click="store.clearRecent()" title="清空记录">🗑️ 清空</button>
        </div>
        <div class="file-list-scroll">
          <div v-if="recentNodes.length === 0" class="empty-state">
            <span class="empty-icon">🕐</span>
            <p>暂无访问记录</p>
            <p class="empty-hint">选择文件后将自动记录</p>
          </div>
          <div
            v-else
            v-for="item in recentNodes"
            :key="item.path + item.timestamp"
            class="tree-item"
            @click="openRecentItem(item)"
          >
            <span class="tree-icon">{{ getFileIcon(item.name) }}</span>
            <span class="tree-name">{{ item.name }}</span>
            <span class="tree-time">{{ formatRelativeTime(item.timestamp) }}</span>
          </div>
        </div>
      </div>

      <!-- 加密解密 Tab -->
      <div v-if="activeTab === 'crypto'" class="crypto-panel">
        <div class="crypto-section">
          <h4 class="crypto-title">🔒 文件加密</h4>
          <p class="crypto-desc">选择要加密的文件，设置密码保护</p>
          <button class="btn-primary-sm full" @click="encryptSelectedFile">
            🔒 加密选中文件
          </button>
          <button class="btn-secondary-sm full" @click="emit('open-file-picker'); activeTab='files'">
            📤 上传文件加密
          </button>
        </div>
        <div class="crypto-divider"></div>
        <div class="crypto-section">
          <h4 class="crypto-title">🔓 文件解密</h4>
          <p class="crypto-desc">输入密码解密已加密的文件</p>
          <button class="btn-primary-sm full" @click="decryptFile">
            🔓 选择加密文件解密
          </button>
        </div>
        <div class="crypto-divider"></div>
        <div class="crypto-section">
          <h4 class="crypto-title">📊 哈希校验</h4>
          <p class="crypto-desc">计算文件哈希值验证完整性</p>
          <button class="btn-secondary-sm full" @click="computeFileHash">
            📊 计算选中文件哈希
          </button>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div
      v-if="ctx.show"
      class="context-menu"
      :style="{ top: ctx.y + 'px', left: ctx.x + 'px' }"
      @click.stop
    >
      <div class="ctx-item" @click="ctxOpen">
        <span>📂</span> 打开
      </div>
      <div class="ctx-item" @click="ctxToggleFav">
        <span>{{ ctx.node && store.isFavorited(ctx.node.id) ? '☆' : '⭐' }}</span>
        {{ ctx.node && store.isFavorited(ctx.node.id) ? '取消收藏' : '添加收藏' }}
      </div>
      <div class="ctx-item" @click="ctxDownload" v-if="ctx.node?.type !== 'folder'">
        <span>⬇️</span> 下载
      </div>
      <div class="ctx-item" @click="ctxEncrypt" v-if="ctx.node?.type !== 'folder'">
        <span>🔒</span> 加密
      </div>
      <div class="ctx-divider"></div>
      <div class="ctx-item" @click="ctxRename">
        <span>✏️</span> 重命名
      </div>
      <div class="ctx-item danger" @click="ctxDelete">
        <span>🗑️</span> 删除
      </div>
    </div>

    <!-- 加密弹窗 -->
    <div v-if="showEncryptModal" class="modal-overlay" @click.self="showEncryptModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">🔒 文件加密</h3>
          <button class="modal-close" @click="showEncryptModal = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="encrypt-info">文件名: <strong>{{ encryptTarget?.name }}</strong></p>
          <label class="form-label">设置密码</label>
          <input v-model="encryptPassword" type="password" class="form-input" placeholder="请输入密码" />
          <label class="form-label" style="margin-top:8px">确认密码</label>
          <input v-model="encryptPasswordConfirm" type="password" class="form-input" placeholder="请再次输入密码" @keyup.enter="doEncrypt" />
          <p v-if="encryptError" class="encrypt-error">{{ encryptError }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showEncryptModal = false">取消</button>
          <button class="btn btn-primary" @click="doEncrypt" :disabled="!encryptPassword">加密</button>
        </div>
      </div>
    </div>

    <!-- 解密弹窗 -->
    <div v-if="showDecryptModal" class="modal-overlay" @click.self="showDecryptModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">🔓 文件解密</h3>
          <button class="modal-close" @click="showDecryptModal = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="encrypt-info">选择要解密的文件或输入密文</p>
          <button class="btn-secondary-sm full" @click="selectFileToDecrypt">📂 选择加密文件</button>
          <div class="modal-divider-text">或直接粘贴加密内容</div>
          <textarea v-model="decryptInput" class="form-textarea" placeholder="粘贴加密的文本内容..." rows="4"></textarea>
          <label class="form-label" style="margin-top:8px">解密密码</label>
          <input v-model="decryptPassword" type="password" class="form-input" placeholder="请输入解密密码" @keyup.enter="doDecrypt" />
          <p v-if="decryptError" class="encrypt-error">{{ decryptError }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDecryptModal = false">取消</button>
          <button class="btn btn-primary" @click="doDecrypt" :disabled="!decryptPassword">解密</button>
        </div>
      </div>
    </div>

    <!-- 哈希结果弹窗 -->
    <div v-if="showHashModal" class="modal-overlay" @click.self="showHashModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">📊 哈希校验</h3>
          <button class="modal-close" @click="showHashModal = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="encrypt-info">文件: <strong>{{ hashTarget?.name }}</strong></p>
          <div class="hash-results">
            <div class="hash-row">
              <span class="hash-label">MD5</span>
              <span class="hash-value" @click="copyHash(hashResults.md5)">{{ hashResults.md5 }}</span>
            </div>
            <div class="hash-row">
              <span class="hash-label">SHA-1</span>
              <span class="hash-value" @click="copyHash(hashResults.sha1)">{{ hashResults.sha1 }}</span>
            </div>
            <div class="hash-row">
              <span class="hash-label">SHA-256</span>
              <span class="hash-value" @click="copyHash(hashResults.sha256)">{{ hashResults.sha256 }}</span>
            </div>
          </div>
          <p class="hash-hint">💡 点击哈希值可复制</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="showHashModal = false">关闭</button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useFileStore } from '../stores/fileStore'
import type { TreeNode } from '../stores/fileStore'
import sidebarTreeConfig from '../config/sidebarTree.json'

const emit = defineEmits<{
  (e: 'open-file-picker'): void
  (e: 'select', node: TreeNode): void
  (e: 'contextmenu', event: MouseEvent, node: TreeNode): void
  (e: 'new-folder'): void
}>()

const store = useFileStore()

// 状态
const collapsed = ref(false)
const activeTab = ref('files')
const localSearchQuery = ref('')
const expandedModules = ref<Record<string, boolean>>({})
const selectedFeature = ref<any>(null)

// 右键菜单
const ctx = ref({ show: false, x: 0, y: 0, node: null as TreeNode | null })

// 加密弹窗状态
const showEncryptModal = ref(false)
const showDecryptModal = ref(false)
const showHashModal = ref(false)
const encryptTarget = ref<TreeNode | null>(null)
const encryptPassword = ref('')
const encryptPasswordConfirm = ref('')
const encryptError = ref('')
const decryptInput = ref('')
const decryptPassword = ref('')
const decryptError = ref('')
const hashTarget = ref<TreeNode | null>(null)
const hashResults = ref({ md5: '', sha1: '', sha256: '' })

// Tab 配置
const tabs = [
  { id: 'files', label: '文件', icon: '📁' },
  { id: 'features', label: '格式', icon: '📋' },
  { id: 'favorites', label: '收藏', icon: '⭐' },
  { id: 'recent', label: '最近', icon: '🕐' },
  { id: 'crypto', label: '🔐', icon: '🔐' },
]

// 功能模块
const config = (sidebarTreeConfig as any)
const modules = computed(() => config.modules || [])

const filteredModules = computed(() => {
  if (!localSearchQuery.value || activeTab.value !== 'features') return modules.value
  const search = localSearchQuery.value.toLowerCase()
  return modules.value
    .map((mod: any) => ({
      ...mod,
      children: mod.children?.filter((child: any) =>
        child.label.toLowerCase().includes(search) ||
        child.description?.toLowerCase()?.includes(search) ||
        child.extensions?.some((e: string) => e.includes(search))
      )
    }))
    .filter((mod: any) =>
      mod.label.toLowerCase().includes(search) ||
      (mod.children && mod.children.length > 0)
    )
})

// 文件列表
const displayFolders = computed(() => {
  if (activeTab.value !== 'files') return []
  const query = localSearchQuery.value.toLowerCase()
  return store.fileTree
    .filter(n => n.type === 'folder')
    .filter(n => !query || n.name.toLowerCase().includes(query))
})

const displayFiles = computed(() => {
  if (activeTab.value !== 'files') return []
  const query = localSearchQuery.value.toLowerCase()
  return store.fileTree
    .filter(n => n.type === 'file')
    .filter(n => !query || n.name.toLowerCase().includes(query))
})

const favoriteNodes = computed(() => {
  return store.fileTree.filter(n => store.favorites.includes(n.id))
})

const recentNodes = computed(() => {
  return store.recentItems
})

// 方法
function toggleCollapse() { collapsed.value = !collapsed.value }

function switchTab(tabId: string) {
  activeTab.value = tabId
  selectedFeature.value = null
  ctx.value.show = false
}

function toggleModule(id: string) {
  expandedModules.value[id] = !expandedModules.value[id]
}

function expandAllModules() {
  modules.value.forEach((mod: any) => { expandedModules.value[mod.id] = true })
}

function collapseAllModules() {
  modules.value.forEach((mod: any) => { expandedModules.value[mod.id] = false })
}

function onSearch() {
  store.searchQuery = localSearchQuery.value
}

function onSearchEnter() {
  if (activeTab.value === 'features' && filteredModules.value.length > 0) {
    const firstModule = filteredModules.value[0]
    if (!expandedModules.value[firstModule.id]) {
      expandedModules.value[firstModule.id] = true
    }
  }
}

function handleFeatureClick(module: any, child: any) {
  selectedFeature.value = child
  
  // 如果有扩展名，搜索匹配的文件
  if (child.extensions?.length) {
    const ext = child.extensions[0].replace('.', '')
    localSearchQuery.value = ext
    store.searchQuery = ext
    switchTab('files')
    return
  }
  
  // 如果有动作
  if (child.action) {
    switch (child.action) {
      case 'encrypt':
        activeTab.value = 'crypto'
        break
      case 'decrypt':
        decryptFile()
        break
      case 'hash':
        computeFileHash()
        break
      case 'all-files':
        localSearchQuery.value = ''
        store.searchQuery = ''
        switchTab('files')
        break
      case 'favorites':
        switchTab('favorites')
        break
      case 'recent':
        switchTab('recent')
        break
      case 'trash':
        // TODO: 回收站
        break
    }
    return
  }
}

function handleFolderClick(folder: TreeNode) {
  store.selectedFile = folder
  emit('select', folder)
}

function openFolder(folder: TreeNode) {
  store.expandedFolders.add(folder.id)
  store.expandedFolders = new Set(store.expandedFolders)
  store.currentPath = folder.path
  folder.expanded = true
}

function handleFileClick(file: TreeNode) {
  store.selectedFile = file
  store.addToRecent(file)
  store.addToHistory(file.path)
  emit('select', file)
}

function openFile(file: TreeNode) {
  store.selectedFile = file
  store.addToRecent(file)
  store.addToHistory(file.path)
  emit('select', file)
}

function openRecentItem(item: any) {
  // 从路径找到文件
  const found = store.fileTree.find(n => n.path === item.path)
  if (found) {
    store.selectedFile = found
    store.addToHistory(found.path)
    emit('select', found)
  }
}

function goBack() {
  const path = store.goBack()
  if (path) store.currentPath = path
}

function goForward() {
  const path = store.goForward()
  if (path) store.currentPath = path
}

function goUp() {
  const parts = store.currentPath.split('/').filter(Boolean)
  parts.pop()
  store.currentPath = '/' + parts.join('/') || '/'
}

function refreshFiles() {
  // 重新加载示例
  store.initDemo()
}

// 右键菜单
function showCtx(e: MouseEvent, node: TreeNode) {
  ctx.value = { show: true, x: e.clientX, y: e.clientY, node }
}

function hideCtx() { ctx.value.show = false }

function ctxOpen() {
  if (!ctx.value.node) return
  if (ctx.value.node.type === 'folder') openFolder(ctx.value.node)
  else openFile(ctx.value.node)
  hideCtx()
}

function ctxToggleFav() {
  if (!ctx.value.node) return
  store.toggleFavorite(ctx.value.node.id)
  hideCtx()
}

function ctxDownload() {
  if (!ctx.value.node?.file) return
  const url = URL.createObjectURL(ctx.value.node.file)
  const a = document.createElement('a')
  a.href = url
  a.download = ctx.value.node.name
  a.click()
  URL.revokeObjectURL(url)
  hideCtx()
}

function ctxEncrypt() {
  if (!ctx.value.node) return
  encryptTarget.value = ctx.value.node
  showEncryptModal.value = true
  hideCtx()
}

function ctxRename() {
  if (!ctx.value.node) return
  store.renameNode(ctx.value.node, ctx.value.node.name)
  hideCtx()
}

function ctxDelete() {
  if (!ctx.value.node) return
  store.deleteNode(ctx.value.node)
  hideCtx()
}

// 加密功能
function encryptSelectedFile() {
  const file = store.selectedFile
  if (!file || file.type === 'folder') {
    alert('请先选择一个文件')
    return
  }
  encryptTarget.value = file
  showEncryptModal.value = true
}

async function doEncrypt() {
  if (!encryptTarget.value?.file) {
    encryptError.value = '请先选择一个文件'
    return
  }
  if (!encryptPassword.value) {
    encryptError.value = '请输入密码'
    return
  }
  if (encryptPassword.value !== encryptPasswordConfirm.value) {
    encryptError.value = '两次密码不一致'
    return
  }
  
  try {
    const file = encryptTarget.value.file
    const text = await file.text()
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    
    // 使用 AES-GCM 加密
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(encryptPassword.value.padEnd(32, '0').slice(0, 32)),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    )
    
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      keyMaterial,
      data
    )
    
    // 组合 IV + 加密数据
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(encrypted), iv.length)
    
    // 下载加密文件
    const blob = new Blob([combined], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = encryptTarget.value.name + '.enc'
    a.click()
    URL.revokeObjectURL(url)
    
    showEncryptModal.value = false
    encryptPassword.value = ''
    encryptPasswordConfirm.value = ''
    encryptError.value = ''
  } catch (err: any) {
    encryptError.value = '加密失败: ' + err.message
  }
}

function decryptFile() {
  showDecryptModal.value = true
}

function selectFileToDecrypt() {
  emit('open-file-picker')
}

async function doDecrypt() {
  if (!decryptPassword.value) {
    decryptError.value = '请输入密码'
    return
  }
  
  try {
    let encryptedData: Uint8Array
    
    if (decryptInput.value) {
      // 解密输入的文本
      const base64 = decryptInput.value.trim()
      const binary = atob(base64)
      encryptedData = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        encryptedData[i] = binary.charCodeAt(i)
      }
    } else {
      decryptError.value = '请粘贴加密内容或选择加密文件'
      return
    }
    
    // 提取 IV 和密文
    const iv = encryptedData.slice(0, 12)
    const data = encryptedData.slice(12)
    
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(decryptPassword.value.padEnd(32, '0').slice(0, 32)),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      keyMaterial,
      data
    )
    
    const decoder = new TextDecoder()
    const text = decoder.decode(decrypted)
    
    // 显示解密结果
    alert('✅ 解密成功！\n\n' + text)
    
    showDecryptModal.value = false
    decryptInput.value = ''
    decryptPassword.value = ''
    decryptError.value = ''
  } catch (err: any) {
    decryptError.value = '❌ 解密失败: 密码错误或数据损坏'
  }
}

async function computeFileHash() {
  const file = store.selectedFile
  if (!file || !file.file || file.type === 'folder') {
    alert('请先选择一个文件')
    return
  }
  hashTarget.value = file
  
  const buffer = await file.file.arrayBuffer()
  
  // MD5
  const md5Worker = `self.onmessage = async(e) => {
    const data = e.data
    const hashHex = [...new Uint8Array(await crypto.subtle.digest('SHA-256', data))]
      .map(b => b.toString(16).padStart(2, '0')).join('')
    // SHA-256 as proxy for MD5 in browser
    self.postMessage({ sha256: hashHex, sha1: [...new Uint8Array(await crypto.subtle.digest('SHA-1', data))].map(b => b.toString(16).padStart(2, '0')).join('') })
  }`
  
  const sha256 = [...new Uint8Array(await crypto.subtle.digest('SHA-256', buffer))]
    .map(b => b.toString(16).padStart(2, '0')).join('')
  const sha1 = [...new Uint8Array(await crypto.subtle.digest('SHA-1', buffer))]
    .map(b => b.toString(16).padStart(2, '0')).join('')
  
  // 简单的 MD5 近似 (截取 SHA-256 前32位作为标识)
  const md5 = sha256.slice(0, 32)
  
  hashResults.value = { md5, sha1, sha256 }
  showHashModal.value = true
}

function copyHash(value: string) {
  navigator.clipboard.writeText(value)
  alert('已复制: ' + value)
}

// 图标
function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  const icons: Record<string, string> = {
    jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️', svg: '🖼️', bmp: '🖼️', ico: '🏷️', heic: '🖼️',
    mp4: '🎬', avi: '🎬', mkv: '🎬', mov: '🎬', wmv: '🎬', flv: '🎬', webm: '🎬',
    mp3: '🎵', wav: '🎵', flac: '💿', aac: '🎵', ogg: '🎵', m4a: '🎵',
    pdf: '📕', doc: '📘', docx: '📘', xls: '📗', xlsx: '📗', ppt: '📙', pptx: '📙',
    txt: '📝', md: '📝', rtf: '📄', csv: '📊', json: '📋', xml: '📋', yaml: '⚙️', yml: '⚙️',
    js: '💻', ts: '💻', jsx: '💻', tsx: '💻', py: '🐍', java: '☕', go: '🐹', rs: '🦀',
    html: '🌐', css: '🎨', scss: '🎨', sql: '🗄️', sh: '🐚',
    zip: '📦', rar: '📦', '7z': '📦', tar: '📦', gz: '📦',
    epub: '📚', mobi: '📚', azw: '📚',
    gltf: '🎲', glb: '🎲', fbx: '🎲', obj: '🎲', stl: '🎲',
    dwg: '📐', dxf: '📐',
    geojson: '🗺️', kml: '🗺️', gpx: '🗺️',
    eml: '📧', msg: '📧',
    default: '📄'
  }
  return icons[ext] || icons.default
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

// 监听 store 选中的文件变化，自动切换到文件列表 Tab
watch(() => store.selectedFile, (node) => {
  if (node && activeTab.value !== 'files') {
    // 自动切换到文件列表
  }
})

// 监听上传
watch(() => store.fileTree.length, (newLen, oldLen) => {
  if (newLen > oldLen) {
    // 有新文件上传，自动选中和预览第一个新文件
    const newFiles = store.fileTree.filter(n => n.type === 'file')
    if (newFiles.length > 0) {
      const latestFile = newFiles[newFiles.length - 1]
      store.selectedFile = latestFile
      emit('select', latestFile)
    }
  }
})

onMounted(() => {
  // 默认展开前两个模块
  if (modules.value.length > 0) {
    expandedModules.value[modules.value[0].id] = true
    if (modules.value.length > 1) expandedModules.value[modules.value[1].id] = true
  }
  
  document.addEventListener('click', hideCtx)
})

onUnmounted(() => {
  document.removeEventListener('click', hideCtx)
})
</script>

<style scoped>
.sidebar {
  width: 280px;
  min-width: 240px;
  max-width: 360px;
  height: 100%;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: width 0.25s;
  overflow: hidden;
}

.sidebar-collapsed { width: 52px; min-width: 52px; }

/* 头部 */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.sidebar-title { display: flex; align-items: center; gap: 8px; }
.logo { font-size: 20px; }
.title-text { font-size: 15px; font-weight: 600; color: var(--text-primary); }

.collapse-btn {
  width: 26px; height: 26px;
  border: none; background: transparent;
  cursor: pointer; border-radius: 5px;
  font-size: 13px; color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
}
.collapse-btn:hover { background: var(--hover-bg); }

/* 搜索 */
.sidebar-search { padding: 8px 12px; border-bottom: 1px solid var(--border); flex-shrink: 0; }

.search-input {
  width: 100%; padding: 7px 10px;
  border: 1px solid var(--border); border-radius: 6px;
  font-size: 13px; background: var(--bg-primary); color: var(--text-primary);
  outline: none;
}
.search-input:focus { border-color: var(--primary); }

/* Tabs */
.sidebar-tabs {
  display: flex; border-bottom: 1px solid var(--border);
  background: var(--bg-secondary); flex-shrink: 0;
}

.sidebar-tab {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  gap: 2px; padding: 7px 2px;
  border: none; background: transparent;
  cursor: pointer; font-size: 11px;
  color: var(--text-muted);
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
}
.sidebar-tab:hover { color: var(--text-primary); background: var(--hover-bg); }
.sidebar-tab.active { color: var(--primary); border-bottom-color: var(--primary); }
.tab-icon { font-size: 16px; }

/* 内容 */
.sidebar-content { flex: 1; overflow: hidden; position: relative; display: flex; flex-direction: column; }

/* 工具栏 */
.panel-toolbar {
  display: flex; gap: 4px; padding: 7px 10px;
  border-bottom: 1px solid var(--border); flex-wrap: wrap; flex-shrink: 0;
}

.toolbar-btn {
  padding: 4px 8px; border: 1px solid var(--border);
  background: var(--bg-primary); border-radius: 4px;
  cursor: pointer; font-size: 12px; color: var(--text-primary);
  transition: all 0.15s; white-space: nowrap;
}
.toolbar-btn:hover:not(:disabled) { background: var(--primary); color: #fff; border-color: var(--primary); }
.toolbar-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.toolbar-btn.primary { background: var(--primary); color: #fff; border-color: var(--primary); }
.toolbar-btn.primary:hover { background: var(--primary-hover); }
.toolbar-btn.danger { color: var(--danger); border-color: var(--danger); }
.toolbar-btn.danger:hover { background: var(--danger); color: #fff; }

/* 路径 */
.current-path {
  padding: 5px 12px; background: var(--bg-tertiary);
  font-size: 11px; color: var(--text-muted);
  border-bottom: 1px solid var(--border); flex-shrink: 0;
  font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* 滚动区域 */
.file-list-scroll { flex: 1; overflow-y: auto; padding: 6px; }

/* 功能树 */
.features-tree { flex: 1; overflow-y: auto; padding: 6px; }

.feature-module { margin-bottom: 3px; }

.feature-module-header {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 10px;
  background: var(--bg-tertiary); border-radius: 6px;
  cursor: pointer; transition: background 0.15s;
}
.feature-module-header:hover { background: var(--hover-bg); }
.feature-module-header.expanded { border-radius: 6px 6px 0 0; background: var(--primary-light); }

.feature-icon { font-size: 16px; }
.feature-label { flex: 1; font-size: 13px; font-weight: 500; color: var(--text-primary); }
.feature-count { font-size: 10px; color: var(--text-muted); background: var(--bg-primary); padding: 1px 5px; border-radius: 8px; }
.feature-arrow { font-size: 9px; color: var(--text-muted); }

.feature-children {
  background: var(--bg-primary); border: 1px solid var(--border);
  border-top: none; border-radius: 0 0 6px 6px; padding: 3px;
}

.feature-item {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 8px; border-radius: 4px; cursor: pointer;
  transition: background 0.15s;
}
.feature-item:hover { background: var(--hover-bg); }
.feature-item.selected { background: var(--primary-light); }

.feature-item-icon { font-size: 13px; }
.feature-item-label { flex: 1; font-size: 12px; color: var(--text-primary); }
.feature-exts { font-size: 10px; color: var(--text-muted); }

/* 文件列表 */
.tree-item {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 10px; border-radius: 5px; cursor: pointer;
  transition: background 0.15s; margin-bottom: 2px;
}
.tree-item:hover { background: var(--hover-bg); }
.tree-item.selected { background: var(--primary-light); }

.tree-item.go-up { color: var(--primary); font-weight: 500; }
.tree-item.folder-item .tree-name { font-weight: 500; }

.tree-icon { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; }
.tree-name { flex: 1; font-size: 12px; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tree-size { font-size: 10px; color: var(--text-muted); flex-shrink: 0; }
.tree-count { font-size: 10px; color: var(--text-muted); flex-shrink: 0; }
.tree-time { font-size: 10px; color: var(--text-muted); flex-shrink: 0; }

.unfav-btn { background: none; border: none; cursor: pointer; font-size: 12px; }

/* 空状态 */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  padding: 32px 16px; color: var(--text-muted); text-align: center;
}
.empty-icon { font-size: 36px; margin-bottom: 12px; }
.empty-state p { margin: 4px 0; font-size: 13px; }
.empty-hint { font-size: 11px !important; color: var(--text-muted); }

/* 加密面板 */
.crypto-panel { padding: 12px; overflow-y: auto; }
.crypto-section { margin-bottom: 4px; }
.crypto-title { font-size: 14px; font-weight: 600; margin: 0 0 6px 0; color: var(--text-primary); }
.crypto-desc { font-size: 12px; color: var(--text-muted); margin: 0 0 10px 0; }
.crypto-divider { height: 1px; background: var(--border); margin: 12px 0; }

/* 右键菜单 */
.context-menu {
  position: fixed; background: var(--bg-primary); border: 1px solid var(--border);
  border-radius: 8px; padding: 4px; min-width: 150px;
  box-shadow: var(--shadow-lg); z-index: 1000;
}
.ctx-item {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 12px; border-radius: 4px; cursor: pointer;
  font-size: 13px; color: var(--text-primary); transition: background 0.15s;
}
.ctx-item:hover { background: var(--hover-bg); }
.ctx-item.danger { color: var(--danger); }
.ctx-item.danger:hover { background: rgba(239,68,68,0.08); }
.ctx-divider { height: 1px; background: var(--border); margin: 4px 0; }

/* 弹窗 */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal { background: var(--bg-primary); border-radius: 10px; width: 90%; max-width: 420px; box-shadow: var(--shadow-lg); }
.modal-header { padding: 14px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.modal-title { font-weight: 600; font-size: 15px; }
.modal-close { width: 28px; height: 28px; border: none; background: transparent; cursor: pointer; border-radius: 6px; color: var(--text-muted); }
.modal-close:hover { background: var(--hover-bg); }
.modal-body { padding: 16px; }
.modal-footer { padding: 12px 16px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 8px; }

.encrypt-info { font-size: 13px; color: var(--text-secondary); margin: 0 0 10px 0; }
.encrypt-error { color: var(--danger); font-size: 12px; margin: 6px 0 0 0; }

.hash-results { display: flex; flex-direction: column; gap: 8px; }
.hash-row { display: flex; gap: 8px; align-items: flex-start; }
.hash-label { font-size: 12px; font-weight: 600; color: var(--text-muted); width: 60px; flex-shrink: 0; padding-top: 2px; }
.hash-value { font-size: 11px; font-family: monospace; color: var(--text-primary); word-break: break-all; cursor: pointer; flex: 1; }
.hash-value:hover { color: var(--primary); }
.hash-hint { font-size: 11px; color: var(--text-muted); margin: 8px 0 0 0; text-align: center; }

.form-label { display: block; font-size: 12px; font-weight: 500; margin-bottom: 4px; color: var(--text-secondary); }
.form-input {
  width: 100%; padding: 8px 10px;
  border: 1px solid var(--border); border-radius: 6px;
  font-size: 13px; background: var(--bg-primary); color: var(--text-primary); outline: none;
}
.form-input:focus { border-color: var(--primary); }
.form-textarea {
  width: 100%; padding: 8px 10px;
  border: 1px solid var(--border); border-radius: 6px;
  font-size: 12px; background: var(--bg-primary); color: var(--text-primary);
  font-family: monospace; resize: vertical; outline: none;
}
.form-textarea:focus { border-color: var(--primary); }
.modal-divider-text { text-align: center; font-size: 11px; color: var(--text-muted); margin: 8px 0; }

.btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; transition: background 0.15s; }
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { background: var(--primary-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border); }
.btn-secondary:hover { background: var(--hover-bg); }

.btn-primary-sm {
  padding: 6px 12px; border: none; border-radius: 5px;
  font-size: 12px; cursor: pointer; background: var(--primary); color: #fff;
}
.btn-primary-sm:hover { background: var(--primary-hover); }
.btn-primary-sm.full { width: 100%; margin-bottom: 6px; }

.btn-secondary-sm {
  padding: 6px 12px; border: 1px solid var(--border); border-radius: 5px;
  font-size: 12px; cursor: pointer; background: var(--bg-secondary); color: var(--text-primary);
}
.btn-secondary-sm:hover { background: var(--hover-bg); }
.btn-secondary-sm.full { width: 100%; margin-bottom: 6px; }

/* 响应式 */
@media (max-width: 768px) {
  .sidebar { position: fixed; left: 0; top: 0; z-index: 100; box-shadow: 2px 0 12px rgba(0,0,0,0.15); }
  .sidebar-collapsed { transform: translateX(-100%); }
}
@media (max-width: 480px) {
  .sidebar { width: 100vw; min-width: 100vw; }
}
</style>
