<template>
  <div class="archive-preview">
    <div class="preview-header">
      <h3>📦 压缩包预览</h3>
      <div class="archive-info">
        <span class="file-name">{{ fileName }}</span>
        <span class="file-size">{{ formatSize(totalSize) }}</span>
        <span class="file-count">{{ fileCount }} 个文件</span>
      </div>
    </div>

    <div class="preview-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在解析压缩包...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error">
        <p>❌ {{ error }}</p>
      </div>

      <!-- 文件列表 -->
      <div v-else class="archive-container">
        <!-- 工具栏 -->
        <div class="toolbar">
          <button @click="expandAll" class="btn">展开全部</button>
          <button @click="collapseAll" class="btn">折叠全部</button>
          <button @click="downloadAll" class="btn btn-primary">下载全部</button>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文件..."
            class="search-input"
          />
        </div>

        <!-- 文件树 -->
        <div class="file-tree">
          <div
            v-for="item in filteredItems"
            :key="item.path"
            class="tree-item"
            :style="{ paddingLeft: item.depth * 20 + 'px' }"
            @click="item.isDirectory ? toggleFolder(item) : previewFile(item)"
          >
            <span class="item-icon">
              {{ item.isDirectory ? (item.expanded ? '📂' : '📁') : getFileIcon(item.name) }}
            </span>
            <span class="item-name">{{ item.name }}</span>
            <span class="item-size" v-if="!item.isDirectory">
              {{ formatSize(item.size) }}
            </span>
            <span class="item-date" v-if="item.date">
              {{ formatDate(item.date) }}
            </span>
            <div class="item-actions" v-if="!item.isDirectory">
              <button @click.stop="previewFile(item)" class="btn-small">预览</button>
              <button @click.stop="downloadFile(item)" class="btn-small">下载</button>
            </div>
          </div>
        </div>

        <!-- 文件预览弹窗 -->
        <div v-if="previewingFile" class="preview-modal" @click="closePreview">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h4>{{ previewingFile.name }}</h4>
              <button @click="closePreview" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <iframe
                v-if="previewUrl"
                :src="previewUrl"
                class="preview-frame"
              ></iframe>
              <pre v-else-if="previewContent" class="preview-text">{{
                previewContent
              }}</pre>
              <p v-else class="unsupported">
                此文件类型不支持预览，请下载后查看
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface ArchiveItem {
  name: string
  path: string
  size: number
  date?: Date
  isDirectory: boolean
  depth: number
  expanded?: boolean
  children?: ArchiveItem[]
}

const props = defineProps<{
  fileUrl: string
  fileName: string
}>()

const loading = ref(false)
const error = ref('')
const items = ref<ArchiveItem[]>([])
const searchQuery = ref('')
const previewingFile = ref<ArchiveItem | null>(null)
const previewUrl = ref('')
const previewContent = ref('')

const totalSize = computed(() => {
  return items.value.reduce((sum, item) => sum + (item.size || 0), 0)
})

const fileCount = computed(() => {
  return items.value.filter((item) => !item.isDirectory).length
})

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value

  const query = searchQuery.value.toLowerCase()
  return items.value.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.path.toLowerCase().includes(query)
  )
})

async function loadArchive() {
  loading.value = true
  error.value = ''

  try {
    // 动态加载JSZip库
    if (!(window as any).JSZip) {
      await loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js')
    }

    const response = await fetch(props.fileUrl)
    const blob = await response.blob()
    const zip = await (window as any).JSZip.loadAsync(blob)

    const allItems: ArchiveItem[] = []
    zip.forEach((relativePath: string, zipEntry: any) => {
      const parts = relativePath.split('/').filter(Boolean)
      allItems.push({
        name: parts[parts.length - 1] || relativePath,
        path: relativePath,
        size: zipEntry._data ? zipEntry._data.uncompressedSize : 0,
        date: zipEntry.date,
        isDirectory: zipEntry.dir,
        depth: parts.length - 1,
        expanded: false
      })
    })

    items.value = buildTree(allItems)
  } catch (err: any) {
    error.value = '解析压缩包失败: ' + err.message
  } finally {
    loading.value = false
  }
}

function buildTree(flatItems: ArchiveItem[]): ArchiveItem[] {
  const root: ArchiveItem[] = []
  const map = new Map<string, ArchiveItem>()

  flatItems.forEach((item) => {
    const parentPath = item.path.substring(0, item.path.lastIndexOf('/'))
    if (item.isDirectory) {
      map.set(item.path, item)
    }

    if (parentPath && map.has(parentPath)) {
      const parent = map.get(parentPath)!
      if (!parent.children) parent.children = []
      parent.children.push(item)
    } else {
      root.push(item)
    }
  })

  return root
}

function toggleFolder(item: ArchiveItem) {
  item.expanded = !item.expanded
}

function expandAll() {
  items.value.forEach((item) => setExpanded(item, true))
}

function collapseAll() {
  items.value.forEach((item) => setExpanded(item, false))
}

function setExpanded(item: ArchiveItem, expanded: boolean) {
  item.expanded = expanded
  if (item.children) {
    item.children.forEach((child) => setExpanded(child, expanded))
  }
}

async function previewFile(item: ArchiveItem) {
  previewingFile.value = item

  try {
    const response = await fetch(props.fileUrl)
    const blob = await response.blob()
    const zip = await (window as any).JSZip.loadAsync(blob)
    const file = zip.file(item.path)

    if (!file) throw new Error('文件不存在')

    const content = await file.async('blob')
    const type = getFileType(item.name)

    if (['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt', 'html'].includes(type)) {
      previewUrl.value = URL.createObjectURL(content)
    } else if (type === 'txt' || type === 'md' || type === 'json') {
      previewContent.value = await file.async('string')
    } else {
      previewUrl.value = ''
      previewContent.value = ''
    }
  } catch (err: any) {
    error.value = '预览失败: ' + err.message
  }
}

function closePreview() {
  previewingFile.value = null
  previewUrl.value = ''
  previewContent.value = ''
}

async function downloadFile(item: ArchiveItem) {
  try {
    const response = await fetch(props.fileUrl)
    const blob = await response.blob()
    const zip = await (window as any).JSZip.loadAsync(blob)
    const file = zip.file(item.path)

    if (!file) throw new Error('文件不存在')

    const content = await file.async('blob')
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = item.name
    a.click()
    URL.revokeObjectURL(url)
  } catch (err: any) {
    alert('下载失败: ' + err.message)
  }
}

async function downloadAll() {
  try {
    const response = await fetch(props.fileUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = props.fileName
    a.click()
    URL.revokeObjectURL(url)
  } catch (err: any) {
    alert('下载失败: ' + err.message)
  }
}

function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase()
  const iconMap: Record<string, string> = {
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    pdf: '📄',
    txt: '📝',
    md: '📝',
    js: '📜',
    ts: '📜',
    vue: '📜',
    html: '🌐',
    css: '🎨',
    json: '📋',
    xml: '📋',
    zip: '📦',
    rar: '📦',
    '7z': '📦'
  }
  return iconMap[ext || ''] || '📄'
}

function getFileType(name: string): string {
  return name.split('.').pop()?.toLowerCase() || ''
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN')
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load script'))
    document.head.appendChild(script)
  })
}

onMounted(() => {
  loadArchive()
})
</script>

<style scoped>
.archive-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.preview-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.preview-header h3 {
  margin: 0 0 10px 0;
}

.archive-info {
  display: flex;
  gap: 20px;
  font-size: 14px;
  opacity: 0.9;
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn:hover {
  background: #f0f0f0;
}

.btn-primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-primary:hover {
  background: #5568d3;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.file-tree {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: auto;
  max-height: 600px;
}

.tree-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.tree-item:hover {
  background: #f5f5f5;
}

.item-icon {
  margin-right: 8px;
  font-size: 18px;
}

.item-name {
  flex: 1;
  font-size: 14px;
}

.item-size,
.item-date {
  margin-left: 10px;
  font-size: 12px;
  color: #999;
}

.item-actions {
  display: flex;
  gap: 5px;
  margin-left: 10px;
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 3px;
  cursor: pointer;
}

.btn-small:hover {
  background: #f0f0f0;
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h4 {
  margin: 0;
}

.close-btn {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.preview-text {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow: auto;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.5;
}

.unsupported {
  text-align: center;
  color: #999;
  padding: 40px;
}
</style>
