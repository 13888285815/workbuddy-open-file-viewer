<template>
  <div class="ebook-preview" :style="{ background: bgColor }">
    <div class="preview-header">
      <h3>📚 电子书预览</h3>
      <div class="book-info">
        <span class="book-title">{{ bookTitle }}</span>
        <span class="chapter-info" v-if="currentChapter">
          {{ currentChapter }}
        </span>
      </div>
    </div>

    <div class="preview-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在加载电子书...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error">
        <p>❌ {{ error }}</p>
      </div>

      <!-- 电子书阅读器 -->
      <div v-else class="reader-container">
        <!-- 侧边栏 - 目录 -->
        <div class="sidebar" :class="{ open: sidebarOpen }">
          <div class="sidebar-header">
            <h4>目录</h4>
            <button @click="toggleSidebar" class="close-btn">&times;</button>
          </div>
          <div class="toc-list">
            <div
              v-for="(chapter, index) in toc"
              :key="index"
              class="toc-item"
              :class="{ active: currentChapterIndex === index }"
              @click="goToChapter(index)"
            >
              {{ chapter.label }}
            </div>
          </div>
        </div>

        <!-- 主阅读区域 -->
        <div class="reader-main">
          <!-- 工具栏 -->
          <div class="toolbar">
            <button @click="toggleSidebar" class="btn" title="目录">
              📑
            </button>
            <button @click="prevPage" class="btn" :disabled="!canGoPrev">
              ⬅️ 上一页
            </button>
            <span class="page-info">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button @click="nextPage" class="btn" :disabled="!canGoNext">
              下一页 ➡️
            </button>
            <div class="separator"></div>
            <button @click="decreaseFont" class="btn" title="减小字体">
              A-
            </button>
            <span class="font-size">{{ fontSize }}px</span>
            <button @click="increaseFont" class="btn" title="增大字体">
              A+
            </button>
            <div class="separator"></div>
            <button
              @click="toggleBookmark"
              class="btn"
              :class="{ active: isBookmarked }"
              title="书签"
            >
              🔖
            </button>
            <button @click="showBookmarks" class="btn" title="书签列表">
              📖
            </button>
            <div class="separator"></div>
            <select v-model="bgColor" class="bg-select">
              <option value="#ffffff">白色</option>
              <option value="#f5f5f5">灰色</option>
              <option value="#fff8dc">护眼</option>
              <option value="#1a1a1a">黑夜</option>
            </select>
          </div>

          <!-- 阅读区域 -->
          <div
            class="reader-view"
            ref="readerView"
            @click="handleClick"
            :style="{
              fontSize: fontSize + 'px',
              color: bgColor === '#1a1a1a' ? '#e0e0e0' : '#333'
            }"
          >
            <div v-if="rendering" class="rendering-overlay">
              <div class="spinner"></div>
            </div>
            <iframe
              v-if="currentContent"
              :srcdoc="currentContent"
              class="content-frame"
              ref="contentFrame"
              sandbox="allow-same-origin"
            ></iframe>
          </div>

          <!-- 进度条 -->
          <div class="progress-bar">
            <input
              type="range"
              v-model="progress"
              @input="seekToProgress"
              min="0"
              max="100"
              step="0.1"
              class="progress-slider"
            />
            <span class="progress-text">{{ progress.toFixed(1) }}%</span>
          </div>
        </div>

        <!-- 书签列表弹窗 -->
        <div v-if="showBookmarkList" class="bookmark-modal">
          <div class="modal-content">
            <div class="modal-header">
              <h4>书签列表</h4>
              <button @click="showBookmarks" class="close-btn">&times;</button>
            </div>
            <div class="bookmark-list">
              <div
                v-for="(bookmark, index) in bookmarks"
                :key="index"
                class="bookmark-item"
                @click="goToBookmark(bookmark)"
              >
                <span class="bookmark-icon">🔖</span>
                <div class="bookmark-info">
                  <span class="bookmark-chapter">{{ bookmark.chapter }}</span>
                  <span class="bookmark-time">{{ bookmark.time }}</span>
                </div>
                <button @click.stop="removeBookmark(index)" class="remove-btn">
                  ×
                </button>
              </div>
              <div v-if="bookmarks.length === 0" class="no-bookmarks">
                暂无书签
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface TocItem {
  label: string
  href: string
  index: number
}

interface Bookmark {
  chapter: string
  cfi: string
  progress: number
  time: string
}

const props = defineProps<{
  fileUrl: string
  fileName: string
}>()

const loading = ref(false)
const error = ref('')
const bookTitle = ref('')
const toc = ref<TocItem[]>([])
const currentChapter = ref('')
const currentChapterIndex = ref(0)
const currentContent = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const progress = ref(0)
const fontSize = ref(16)
const bgColor = ref('#ffffff')
const sidebarOpen = ref(false)
const rendering = ref(false)
const isBookmarked = ref(false)
const showBookmarkList = ref(false)
const bookmarks = ref<Bookmark[]>([])

const canGoPrev = computed(() => currentPage.value > 1)
const canGoNext = computed(() => currentPage.value < totalPages.value)

async function loadEbook() {
  loading.value = true
  error.value = ''

  try {
    // 动态加载epub.js库
    if (!(window as any).ePub) {
      await loadScript('https://cdn.jsdelivr.net/npm/epubjs@0.3.88/dist/epub.min.js')
    }

    // 加载epub文件
    const book = (window as any).ePub(props.fileUrl)

    // 获取元数据
    const metadata = await book.loaded.metadata
    bookTitle.value = metadata.title || props.fileName

    // 获取目录
    const navigation = await book.loaded.navigation
    toc.value = navigation.toc.map((item: any, index: number) => ({
      label: item.label,
      href: item.href,
      index
    }))

    // 渲染第一章
    if (toc.value.length > 0) {
      await renderChapter(0)
    }

    // 监听翻页
    book.rendition.on('relocated', (location: any) => {
      currentPage.value = location.start.displayed.page
      totalPages.value = location.start.displayed.total
      progress.value = location.start.percentage * 100
      updateCurrentChapter(location.start.cfi)
    })
  } catch (err: any) {
    error.value = '加载电子书失败: ' + err.message
  } finally {
    loading.value = false
  }
}

async function renderChapter(index: number) {
  rendering.value = true
  currentChapterIndex.value = index

  try {
    const chapter = toc.value[index]
    currentChapter.value = chapter.label

    // 使用epub.js渲染
    const book = (window as any).ePub(props.fileUrl)
    const rendition = book.renderTo('viewer', {
      width: '100%',
      height: '100%'
    })

    await rendition.display(chapter.href)

    // 获取渲染的内容
    const iframe = document.querySelector('#viewer iframe') as HTMLIFrameElement
    if (iframe?.contentDocument) {
      currentContent.value = iframe.contentDocument.documentElement.outerHTML
    }
  } catch (err: any) {
    error.value = '渲染章节失败: ' + err.message
  } finally {
    rendering.value = false
  }
}

function prevPage() {
  if (canGoPrev.value) {
    currentPage.value--
    // 实际应该使用epub.js的prev方法
    updateProgress()
  }
}

function nextPage() {
  if (canGoNext.value) {
    currentPage.value++
    // 实际应该使用epub.js的next方法
    updateProgress()
  }
}

function goToChapter(index: number) {
  renderChapter(index)
  toggleSidebar()
}

function updateCurrentChapter(cfi: string) {
  // 根据CFI更新当前章节
  const chapter = toc.value.find((t) => cfi.includes(t.href))
  if (chapter) {
    currentChapter.value = chapter.label
    currentChapterIndex.value = chapter.index
  }
}

function updateProgress() {
  progress.value = (currentPage.value / totalPages.value) * 100
}

function seekToProgress() {
  // 根据进度跳转到对应位置
  // 实际应该使用epub.js的display方法
  console.log('Seek to progress:', progress.value)
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function increaseFont() {
  fontSize.value = Math.min(fontSize.value + 2, 32)
}

function decreaseFont() {
  fontSize.value = Math.max(fontSize.value - 2, 12)
}

function toggleBookmark() {
  if (isBookmarked.value) {
    removeCurrentBookmark()
  } else {
    addBookmark()
  }
}

function addBookmark() {
  const bookmark: Bookmark = {
    chapter: currentChapter.value,
    cfi: '', // 应该从epub.js获取当前CFI
    progress: progress.value,
    time: new Date().toLocaleString('zh-CN')
  }

  bookmarks.value.push(bookmark)
  isBookmarked.value = true
  saveBookmarks()
}

function removeCurrentBookmark() {
  const index = bookmarks.value.findIndex(
    (b) => b.chapter === currentChapter.value
  )
  if (index !== -1) {
    bookmarks.value.splice(index, 1)
  }
  isBookmarked.value = false
  saveBookmarks()
}

function removeBookmark(index: number) {
  bookmarks.value.splice(index, 1)
  saveBookmarks()
}

function showBookmarks() {
  showBookmarkList.value = !showBookmarkList.value
}

function goToBookmark(bookmark: Bookmark) {
  // 根据bookmark.cfi跳转到对应位置
  console.log('Go to bookmark:', bookmark)
  showBookmarkList.value = false
}

function saveBookmarks() {
  localStorage.setItem(
    `ebook-bookmarks-${props.fileName}`,
    JSON.stringify(bookmarks.value)
  )
}

function loadBookmarks() {
  const saved = localStorage.getItem(`ebook-bookmarks-${props.fileName}`)
  if (saved) {
    bookmarks.value = JSON.parse(saved)
  }
}

function handleClick(event: MouseEvent) {
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left

  // 点击左侧1/3区域 -> 上一页
  if (x < rect.width / 3) {
    prevPage()
  }
  // 点击右侧1/3区域 -> 下一页
  else if (x > (rect.width * 2) / 3) {
    nextPage()
  }
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
  loadEbook()
  loadBookmarks()
})
</script>

<style scoped>
.ebook-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: background 0.3s;
}

.preview-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.preview-header h3 {
  margin: 0 0 10px 0;
}

.book-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 14px;
  opacity: 0.9;
}

.preview-content {
  flex: 1;
  overflow: hidden;
  position: relative;
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

.reader-container {
  display: flex;
  height: 100%;
}

.sidebar {
  width: 300px;
  background: white;
  border-right: 1px solid #e0e0e0;
  transform: translateX(-100%);
  transition: transform 0.3s;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-header h4 {
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

.toc-list {
  overflow: auto;
  height: calc(100% - 60px);
  padding: 10px;
}

.toc-item {
  padding: 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 5px;
  transition: background 0.2s;
}

.toc-item:hover {
  background: #f5f5f5;
}

.toc-item.active {
  background: #667eea;
  color: white;
}

.reader-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
}

.btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  background: #f0f0f0;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.separator {
  width: 1px;
  height: 24px;
  background: #ddd;
}

.page-info {
  font-size: 14px;
  color: #666;
  min-width: 80px;
  text-align: center;
}

.font-size {
  font-size: 14px;
  color: #666;
  min-width: 40px;
  text-align: center;
}

.bg-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.reader-view {
  flex: 1;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.rendering-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.content-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: #f9f9f9;
  border-top: 1px solid #e0e0e0;
}

.progress-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: #ddd;
  border-radius: 2px;
  outline: none;
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
}

.progress-text {
  font-size: 12px;
  color: #999;
  min-width: 50px;
}

.bookmark-modal {
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
  width: 400px;
  max-height: 80%;
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

.bookmark-list {
  overflow: auto;
  padding: 10px;
}

.bookmark-item {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 5px;
  transition: background 0.2s;
}

.bookmark-item:hover {
  background: #f5f5f5;
}

.bookmark-icon {
  font-size: 20px;
  margin-right: 10px;
}

.bookmark-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bookmark-chapter {
  font-weight: 500;
  color: #333;
}

.bookmark-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.remove-btn {
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 4px 8px;
}

.remove-btn:hover {
  color: #f44336;
}

.no-bookmarks {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>
