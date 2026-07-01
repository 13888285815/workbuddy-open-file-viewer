<template>
  <div class="markdown-preview">
    <div class="preview-header">
      <h3>📝 Markdown 预览</h3>
      <div class="file-info">
        <span class="file-name">{{ fileName }}</span>
      </div>
    </div>

    <div class="preview-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在加载...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error">
        <p>❌ {{ error }}</p>
      </div>

      <!-- Markdown编辑器 -->
      <div v-else class="editor-container">
        <!-- 工具栏 -->
        <div class="toolbar">
          <button @click="toggleView('split')" class="btn" :class="{ active: viewMode === 'split' }">
            分屏
          </button>
          <button @click="toggleView('edit')" class="btn" :class="{ active: viewMode === 'edit' }">
            编辑
          </button>
          <button @click="toggleView('preview')" class="btn" :class="{ active: viewMode === 'preview' }">
            预览
          </button>
          <div class="separator"></div>
          <button @click="exportHTML" class="btn">导出 HTML</button>
          <button @click="exportPDF" class="btn">导出 PDF</button>
          <div class="separator"></div>
          <button @click="toggleToc" class="btn" :class="{ active: showToc }">
            目录
          </button>
        </div>

        <!-- 编辑和预览区域 -->
        <div class="editor-wrapper" :class="viewMode">
          <!-- 编辑区域 -->
          <div class="editor-pane" v-show="viewMode !== 'preview'">
            <textarea
              ref="editor"
              v-model="markdownText"
              class="editor-textarea"
              @scroll="syncScroll"
              @input="renderMarkdown"
              placeholder="在这里输入 Markdown..."
            ></textarea>
          </div>

          <!-- 预览区域 -->
          <div
            class="preview-pane"
            v-show="viewMode !== 'edit'"
            ref="preview"
            @scroll="syncScrollFromPreview"
          >
            <!-- 目录 -->
            <div v-if="showToc && toc.length > 0" class="toc-sidebar">
              <h4>目录</h4>
              <div
                v-for="(item, index) in toc"
                :key="index"
                class="toc-item"
                :style="{ paddingLeft: (item.level - 1) * 20 + 'px' }"
                @click="scrollToHeading(item.id)"
              >
                {{ item.text }}
              </div>
            </div>

            <!-- 渲染的Markdown内容 -->
            <div
              class="markdown-body"
              v-html="renderedHTML"
              ref="markdownBody"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface TocItem {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  fileUrl?: string
  fileName?: string
  initialContent?: string
}>()

const loading = ref(false)
const error = ref('')
const markdownText = ref('')
const renderedHTML = ref('')
const viewMode = ref<'split' | 'edit' | 'preview'>('split')
const showToc = ref(false)
const toc = ref<TocItem[]>([])
const editor = ref<HTMLTextAreaElement>()
const preview = ref<HTMLDivElement>()
const markdownBody = ref<HTMLDivElement>()

// 同步滚动标志，防止循环触发
let isSyncingEditor = false
let isSyncingPreview = false

async function loadMarkdown() {
  if (!props.fileUrl) {
    if (props.initialContent) {
      markdownText.value = props.initialContent
      renderMarkdown()
    }
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch(props.fileUrl)
    markdownText.value = await response.text()
    renderMarkdown()
  } catch (err: any) {
    error.value = '加载文件失败: ' + err.message
  } finally {
    loading.value = false
  }
}

async function renderMarkdown() {
  try {
    // 动态加载marked库
    if (!(window as any).marked) {
      await loadScript('https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js')
      // 配置marked
      ;(window as any).marked.setOptions({
        breaks: true,
        gfm: true,
        highlight: function (code: string, lang: string) {
          return highlightCode(code, lang)
        }
      })
    }

    // 渲染Markdown
    renderedHTML.value = (window as any).marked.parse(markdownText.value)

    // 生成目录
    generateToc()

    // 添加标题锚点
    await nextTick()
    addHeadingAnchors()
  } catch (err: any) {
    error.value = '渲染失败: ' + err.message
  }
}

function highlightCode(code: string, lang: string): string {
  // 简单的代码高亮（实际应该使用highlight.js）
  const languages: Record<string, string[]> = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while'],
    typescript: ['interface', 'type', 'extends', 'implements', 'public', 'private'],
    python: ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'for', 'while'],
    html: ['div', 'span', 'p', 'a', 'img', 'ul', 'li'],
    css: ['color', 'background', 'margin', 'padding', 'display', 'flex']
  }

  if (languages[lang]) {
    const keywords = languages[lang]
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      code = code.replace(regex, `<span class="keyword">${keyword}</span>`)
    })
  }

  return `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function generateToc() {
  const headings: TocItem[] = []
  const lines = markdownText.value.split('\n')

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].replace(/[*_`#]/g, '')
      const id = text.toLowerCase().replace(/\s+/g, '-')
      headings.push({ id, text, level })
    }
  })

  toc.value = headings
}

function addHeadingAnchors() {
  if (!markdownBody.value) return

  const headings = markdownBody.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
  headings.forEach((heading, index) => {
    const h = heading as HTMLElement
    const text = h.textContent || ''
    const id = text.toLowerCase().replace(/\s+/g, '-')
    h.id = id

    // 添加锚点链接
    const anchor = document.createElement('a')
    anchor.href = `#${id}`
    anchor.className = 'heading-anchor'
    anchor.textContent = '#'
    anchor.style.cssText = 'margin-left: 8px; color: #667eea; text-decoration: none; opacity: 0; transition: opacity 0.2s;'
    h.appendChild(anchor)

    // 鼠标悬停显示锚点
    h.style.position = 'relative'
    h.addEventListener('mouseenter', () => {
      anchor.style.opacity = '1'
    })
    h.addEventListener('mouseleave', () => {
      anchor.style.opacity = '0'
    })
  })
}

function scrollToHeading(id: string) {
  if (!markdownBody.value) return

  const heading = markdownBody.value.querySelector(`#${id}`)
  if (heading) {
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function syncScroll() {
  if (isSyncingPreview) return
  isSyncingEditor = true

  const editorEl = editor.value
  const previewEl = preview.value

  if (editorEl && previewEl) {
    const percentage =
      editorEl.scrollTop / (editorEl.scrollHeight - editorEl.clientHeight)
    previewEl.scrollTop =
      percentage * (previewEl.scrollHeight - previewEl.clientHeight)
  }

  setTimeout(() => {
    isSyncingEditor = false
  }, 100)
}

function syncScrollFromPreview() {
  if (isSyncingEditor) return
  isSyncingPreview = true

  const editorEl = editor.value
  const previewEl = preview.value

  if (editorEl && previewEl) {
    const percentage =
      previewEl.scrollTop / (previewEl.scrollHeight - previewEl.clientHeight)
    editorEl.scrollTop =
      percentage * (editorEl.scrollHeight - editorEl.clientHeight)
  }

  setTimeout(() => {
    isSyncingPreview = false
  }, 100)
}

function toggleView(mode: 'split' | 'edit' | 'preview') {
  viewMode.value = mode
}

function toggleToc() {
  showToc.value = !showToc.value
}

async function exportHTML() {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${props.fileName || 'Markdown'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
    }
    pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
    }
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.9em;
    }
    img {
      max-width: 100%;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background: #f5f5f5;
      font-weight: 600;
    }
  </style>
</head>
<body>
  ${renderedHTML.value}
</body>
</html>
  `

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = (props.fileName || 'document').replace('.md', '.html')
  a.click()
  URL.revokeObjectURL(url)
}

async function exportPDF() {
  // 实际应该使用jsPDF或puppeteer
  alert('PDF导出功能需要集成jsPDF库')

  // 示例代码（需要引入jsPDF）
  /*
  if (!(window as any).jsPDF) {
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js')
  }

  const doc = new (window as any).jsPDF()
  doc.html(renderedHTML.value, {
    callback: (pdf: any) => {
      pdf.save((props.fileName || 'document').replace('.md', '.pdf'))
    }
  })
  */
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
  loadMarkdown()
})
</script>

<style scoped>
.markdown-preview {
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

.file-info {
  font-size: 14px;
  opacity: 0.9;
}

.preview-content {
  flex: 1;
  overflow: hidden;
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

.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  display: flex;
  gap: 10px;
  padding: 10px 20px;
  background: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn:hover {
  background: #f0f0f0;
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

.editor-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-wrapper.split .editor-pane,
.editor-wrapper.split .preview-pane {
  width: 50%;
}

.editor-wrapper.edit .editor-pane {
  width: 100%;
}

.editor-wrapper.preview .preview-pane {
  width: 100%;
}

.editor-pane {
  border-right: 1px solid #e0e0e0;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  border: none;
  padding: 20px;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.preview-pane {
  overflow: auto;
  padding: 20px;
  position: relative;
}

.toc-sidebar {
  position: sticky;
  top: 0;
  float: right;
  width: 200px;
  max-height: 100%;
  overflow: auto;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
  margin-left: 20px;
  margin-bottom: 20px;
}

.toc-sidebar h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.toc-item {
  padding: 6px 0;
  cursor: pointer;
  font-size: 13px;
  color: #667eea;
  transition: color 0.2s;
}

.toc-item:hover {
  color: #5568d3;
}

.markdown-body {
  max-width: 800px;
  line-height: 1.6;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body :deep(h1) {
  font-size: 2em;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.markdown-body :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}

.markdown-body :deep(p) {
  margin-bottom: 16px;
}

.markdown-body :deep(a) {
  color: #667eea;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
}

.markdown-body :deep(pre) {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.markdown-body :deep(th) {
  background: #f5f5f5;
  font-weight: 600;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 4px;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid #ddd;
  padding-left: 16px;
  margin: 0 0 16px 0;
  color: #666;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 30px;
  margin-bottom: 16px;
}

.markdown-body :deep(li) {
  margin-bottom: 8px;
}

.keyword {
  color: #d73a49;
  font-weight: 600;
}
</style>
