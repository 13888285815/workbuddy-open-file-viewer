<template>
  <div class="svg-preview">
    <div class="preview-header">
      <h3>🎨 SVG 预览</h3>
      <div class="file-info">
        <span class="file-name">{{ fileName }}</span>
        <span class="view-mode-label">模式: {{ viewMode === 'preview' ? '预览' : '代码' }}</span>
      </div>
    </div>

    <div class="preview-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在加载 SVG...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error">
        <p>❌ {{ error }}</p>
      </div>

      <!-- SVG预览 -->
      <div v-else class="svg-container">
        <!-- 工具栏 -->
        <div class="toolbar">
          <button @click="zoomIn" class="btn" title="放大">
            🔍+ 放大
          </button>
          <button @click="zoomOut" class="btn" title="缩小">
            🔍- 缩小
          </button>
          <button @click="resetZoom" class="btn" title="重置">
            ↺ 重置
          </button>
          <button @click="fitToView" class="btn" title="适应视图">
            ⊡ 适应
          </button>
          <div class="separator"></div>
          <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
          <div class="separator"></div>
          <button
            @click="toggleViewMode"
            class="btn"
            :class="{ active: viewMode === 'code' }"
            title="切换模式"
          >
            {{ viewMode === 'preview' ? '代码' : '预览' }}
          </button>
          <button @click="extractColors" class="btn" title="提取颜色">
            🎨 提取颜色
          </button>
        </div>

        <!-- 主内容区域 -->
        <div class="main-content">
          <!-- SVG预览区域 -->
          <div
            v-show="viewMode === 'preview'"
            class="svg-viewer"
            ref="viewer"
            @wheel="handleWheel"
          >
            <div
              class="svg-wrapper"
              ref="svgWrapper"
              :style="{
                transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                transformOrigin: 'center center'
              }"
              @mousedown="startDrag"
              @mousemove="onDrag"
              @mouseup="endDrag"
              @mouseleave="endDrag"
            >
              <div v-html="svgContent" class="svg-content" ref="svgContainer"></div>
            </div>
          </div>

          <!-- 代码查看模式 -->
          <div v-show="viewMode === 'code'" class="code-viewer">
            <pre><code>{{ svgCode }}</code></pre>
          </div>

          <!-- 颜色面板 -->
          <div v-if="showColorPanel" class="color-panel">
            <div class="panel-header">
              <h4>提取的颜色</h4>
              <button @click="showColorPanel = false" class="close-btn">
                &times;
              </button>
            </div>
            <div class="color-list">
              <div
                v-for="(color, index) in extractedColors"
                :key="index"
                class="color-item"
                @click="copyColor(color)"
              >
                <div
                  class="color-swatch"
                  :style="{ background: color }"
                ></div>
                <span class="color-value">{{ color }}</span>
                <span class="copy-hint">点击复制</span>
              </div>
              <div v-if="extractedColors.length === 0" class="no-colors">
                未找到颜色
              </div>
            </div>
          </div>
        </div>

        <!-- 信息栏 -->
        <div class="info-bar">
          <span class="svg-size" v-if="svgSize.width">
            尺寸: {{ svgSize.width }} × {{ svgSize.height }}
          </span>
          <span class="element-count">
            元素数: {{ elementCount }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps<{
  fileUrl: string
  fileName: string
}>()

const loading = ref(false)
const error = ref('')
const svgContent = ref('')
const svgCode = ref('')
const viewMode = ref<'preview' | 'code'>('preview')
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const showColorPanel = ref(false)
const extractedColors = ref<string[]>([])
const svgSize = ref({ width: 0, height: 0 })
const elementCount = ref(0)

const viewer = ref<HTMLDivElement>()
const svgWrapper = ref<HTMLDivElement>()
const svgContainer = ref<HTMLDivElement>()

let isDragging = false
let dragStartX = 0
let dragStartY = 0
let initialTranslateX = 0
let initialTranslateY = 0

async function loadSVG() {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(props.fileUrl)
    svgCode.value = await response.text()

    // 验证SVG
    if (!svgCode.value.includes('<svg')) {
      throw new Error('不是有效的SVG文件')
    }

    svgContent.value = svgCode.value

    await nextTick()
    analyzeSVG()
  } catch (err: any) {
    error.value = '加载SVG失败: ' + err.message
  } finally {
    loading.value = false
  }
}

function analyzeSVG() {
  if (!svgContainer.value) return

  const svg = svgContainer.value.querySelector('svg')
  if (svg) {
    // 获取尺寸
    const width = svg.getAttribute('width') || svg.viewBox?.baseVal?.width || 'auto'
    const height = svg.getAttribute('height') || svg.viewBox?.baseVal?.height || 'auto'
    svgSize.value = { width: parseInt(width as string) || 0, height: parseInt(height as string) || 0 }

    // 统计元素数
    elementCount.value = svg.querySelectorAll('*').length
  }
}

function zoomIn() {
  scale.value = Math.min(scale.value * 1.2, 10)
}

function zoomOut() {
  scale.value = Math.max(scale.value / 1.2, 0.1)
}

function resetZoom() {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

function fitToView() {
  if (!viewer.value || !svgContainer.value) return

  const containerWidth = viewer.value.clientWidth
  const containerHeight = viewer.value.clientHeight
  const svg = svgContainer.value.querySelector('svg')

  if (svg) {
    const svgWidth = svg.getBoundingClientRect().width
    const svgHeight = svg.getBoundingClientRect().height

    const scaleX = containerWidth / svgWidth
    const scaleY = containerHeight / svgHeight
    scale.value = Math.min(scaleX, scaleY) * 0.9

    translateX.value = 0
    translateY.value = 0
  }
}

function handleWheel(event: WheelEvent) {
  event.preventDefault()

  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

function startDrag(event: MouseEvent) {
  isDragging = true
  dragStartX = event.clientX
  dragStartY = event.clientY
  initialTranslateX = translateX.value
  initialTranslateY = translateY.value
}

function onDrag(event: MouseEvent) {
  if (!isDragging) return

  const deltaX = event.clientX - dragStartX
  const deltaY = event.clientY - dragStartY

  translateX.value = initialTranslateX + deltaX / scale.value
  translateY.value = initialTranslateY + deltaY / scale.value
}

function endDrag() {
  isDragging = false
}

function toggleViewMode() {
  viewMode.value = viewMode.value === 'preview' ? 'code' : 'preview'
}

function extractColors() {
  const colors: string[] = []

  // 从SVG代码中提取颜色
  const colorRegexes = [
    /fill\s*[:=]\s*["']?([#\w]+)/gi,
    /stroke\s*[:=]\s*["']?([#\w]+)/gi,
    /stop-color\s*[:=]\s*["']?([#\w]+)/gi,
    /#[0-9a-fA-F]{6}/g,
    /#[0-9a-fA-F]{3}/g,
    /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g
  ]

  colorRegexes.forEach((regex) => {
    const matches = svgCode.value.match(regex)
    if (matches) {
      matches.forEach((match) => {
        const color = match.match(/#[0-9a-fA-F]{3,6}/)?.[0] || match
        if (color && !colors.includes(color)) {
          colors.push(color)
        }
      })
    }
  })

  // 从DOM中提取颜色
  if (svgContainer.value) {
    const elements = svgContainer.value.querySelectorAll('*')
    elements.forEach((el) => {
      const styles = window.getComputedStyle(el)
      const fill = styles.fill
      const stroke = styles.stroke

      if (fill && fill !== 'none' && !colors.includes(fill)) {
        colors.push(fill)
      }
      if (stroke && stroke !== 'none' && !colors.includes(stroke)) {
        colors.push(stroke)
      }
    })
  }

  extractedColors.value = colors.slice(0, 50) // 限制最多50个颜色
  showColorPanel.value = true
}

function copyColor(color: string) {
  navigator.clipboard.writeText(color).then(() => {
    alert(`已复制: ${color}`)
  })
}

onMounted(() => {
  loadSVG()
})
</script>

<style scoped>
.svg-preview {
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
  display: flex;
  gap: 20px;
  font-size: 14px;
  opacity: 0.9;
}

.view-mode-label {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.preview-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.svg-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  padding: 8px 12px;
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

.zoom-level {
  font-size: 14px;
  color: #666;
  min-width: 50px;
  text-align: center;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.svg-viewer {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50% / 20px 20px;
  cursor: grab;
}

.svg-viewer:active {
  cursor: grabbing;
}

.svg-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  transition: transform 0.1s;
}

.svg-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-content :deep(svg) {
  max-width: 100%;
  max-height: 100%;
}

.code-viewer {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: #f5f5f5;
}

.code-viewer pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.code-viewer code {
  color: #333;
}

.color-panel {
  width: 300px;
  background: white;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.panel-header h4 {
  margin: 0;
  font-size: 14px;
}

.close-btn {
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.color-list {
  flex: 1;
  overflow: auto;
  padding: 10px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.color-item:hover {
  background: #f5f5f5;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #ddd;
  flex-shrink: 0;
}

.color-value {
  flex: 1;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
}

.copy-hint {
  font-size: 11px;
  color: #999;
}

.no-colors {
  text-align: center;
  padding: 40px;
  color: #999;
}

.info-bar {
  display: flex;
  gap: 20px;
  padding: 10px 20px;
  background: #f9f9f9;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #666;
}
</style>
