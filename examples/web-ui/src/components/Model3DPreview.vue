<template>
  <div class="model3d-preview">
    <div class="preview-header">
      <h3>🎲 3D 模型预览</h3>
      <div class="model-info">
        <span class="file-name">{{ fileName }}</span>
        <span class="model-stats" v-if="modelStats.vertices">
          {{ modelStats.vertices }} 顶点 | {{ modelStats.faces }} 面
        </span>
      </div>
    </div>

    <div class="preview-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在加载 3D 模型...</p>
        <div class="progress-bar" v-if="loadProgress > 0">
          <div class="progress-fill" :style="{ width: loadProgress + '%' }"></div>
          <span class="progress-text">{{ Math.round(loadProgress) }}%</span>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error">
        <p>❌ {{ error }}</p>
      </div>

      <!-- 3D查看器 -->
      <div v-else class="viewer-container">
        <!-- 工具栏 -->
        <div class="toolbar">
          <button @click="toggleAutoRotate" class="btn" :class="{ active: autoRotate }" title="自动旋转">
            🔄 旋转
          </button>
          <button @click="resetCamera" class="btn" title="重置视角">
            🎯 重置
          </button>
          <div class="separator"></div>
          <button @click="toggleWireframe" class="btn" :class="{ active: wireframe }" title="线框模式">
            📐 线框
          </button>
          <button @click="toggleGrid" class="btn" :class="{ active: showGrid }" title="显示网格">
            🔲 网格
          </button>
          <button @click="toggleAxes" class="btn" :class="{ active: showAxes }" title="显示坐标轴">
            📏 坐标轴
          </button>
          <div class="separator"></div>
          <span class="label">背景:</span>
          <select v-model="bgColor" class="bg-select">
            <option value="#ffffff">白色</option>
            <option value="#f0f0f0">灰色</option>
            <option value="#000000">黑色</option>
            <option value="#1a1a2e">深蓝</option>
          </select>
        </div>

        <!-- 3D画布 -->
        <div class="canvas-wrapper" ref="canvasWrapper">
          <canvas ref="canvas"></canvas>
        </div>

        <!-- 控制面板 -->
        <div class="control-panel">
          <div class="panel-section">
            <h4>材质</h4>
            <button @click="changeMaterial('normal')" class="btn-small" :class="{ active: currentMaterial === 'normal' }">
              标准
            </button>
            <button @click="changeMaterial('wireframe')" class="btn-small" :class="{ active: currentMaterial === 'wireframe' }">
              线框
            </button>
            <button @click="changeMaterial('smooth')" class="btn-small" :class="{ active: currentMaterial === 'smooth' }">
              光滑
            </button>
          </div>

          <div class="panel-section">
            <h4>灯光</h4>
            <label class="checkbox-label">
              <input type="checkbox" v-model="lights.ambient" @change="updateLights" />
              环境光
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="lights.directional" @change="updateLights" />
              方向光
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="lights.point" @change="updateLights" />
              点光源
            </label>
          </div>

          <div class="panel-section">
            <h4>导出</h4>
            <button @click="exportScreenshot" class="btn-small">
              📷 截图
            </button>
            <button @click="exportModel" class="btn-small">
              💾 导出GLB
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  fileUrl: string
  fileName: string
}>()

const loading = ref(false)
const error = ref('')
const loadProgress = ref(0)
const autoRotate = ref(true)
const wireframe = ref(false)
const showGrid = ref(true)
const showAxes = ref(true)
const bgColor = ref('#ffffff')
const currentMaterial = ref('normal')
const modelStats = ref({ vertices: 0, faces: 0 })

const canvas = ref<HTMLCanvasElement>()
const canvasWrapper = ref<HTMLDivElement>()

const lights = ref({
  ambient: true,
  directional: true,
  point: false
})

// Three.js 对象
let scene: any = null
let camera: any = null
let renderer: any = null
let model: any = null
let grid: any = null
let axes: any = null
let animationId: number | null = null

// 鼠标控制
let isMouseDown = false
let mouseX = 0
let mouseY = 0
let targetRotationX = 0
let targetRotationY = 0
let rotationX = 0
let rotationY = 0

async function loadThreeJS() {
  // 动态加载Three.js
  if (!(window as any).THREE) {
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js')
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js')
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/OBJLoader.js')
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/GLTFLoader.js')
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/FBXLoader.js')
  }
}

async function initViewer() {
  if (!canvas.value || !canvasWrapper.value) return

  const THREE = (window as any).THREE

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(bgColor.value)

  // 创建相机
  const width = canvasWrapper.value.clientWidth
  const height = canvasWrapper.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  // 添加灯光
  updateLights()

  // 添加网格
  if (showGrid.value) {
    grid = new THREE.GridHelper(10, 10)
    scene.add(grid)
  }

  // 添加坐标轴
  if (showAxes.value) {
    axes = new THREE.AxesHelper(5)
    scene.add(axes)
  }

  // 加载模型
  await loadModel()

  // 开始动画
  animate()
}

async function loadModel() {
  loading.value = true
  error.value = ''
  loadProgress.value = 0

  try {
    const THREE = (window as any).THREE
    const fileExt = props.fileName.split('.').pop()?.toLowerCase()

    const response = await fetch(props.fileUrl)
    const blob = await response.blob()

    if (fileExt === 'obj') {
      const loader = new THREE.OBJLoader()
      model = loader.parse(await blob.text())
    } else if (fileExt === 'gltf' || fileExt === 'glb') {
      const loader = new THREE.GLTFLoader()
      const arrayBuffer = await blob.arrayBuffer()
      const gltf = await new Promise((resolve, reject) => {
        loader.parse(arrayBuffer, '', resolve, reject)
      })
      model = (gltf as any).scene || (gltf as any)
    } else if (fileExt === 'fbx') {
      const loader = new THREE.FBXLoader()
      const arrayBuffer = await blob.arrayBuffer()
      model = loader.parse(arrayBuffer, '')
    } else {
      throw new Error('不支持的文件格式')
    }

    // 计算模型统计
    calculateStats()

    // 居中并缩放模型
    centerModel()

    // 添加到场景
    scene.add(model)

    loadProgress.value = 100
  } catch (err: any) {
    error.value = '加载模型失败: ' + err.message
  } finally {
    loading.value = false
  }
}

function calculateStats() {
  if (!model) return

  let vertices = 0
  let faces = 0

  model.traverse((child: any) => {
    if (child.isMesh) {
      const geometry = child.geometry
      if (geometry.attributes.position) {
        vertices += geometry.attributes.position.count
      }
      if (geometry.index) {
        faces += geometry.index.count / 3
      } else {
        faces += geometry.attributes.position.count / 3
      }
    }
  })

  modelStats.value = { vertices, faces: Math.round(faces) }
}

function centerModel() {
  if (!model) return

  const THREE = (window as any).THREE
  const box = new THREE.Box3().setFromObject(model)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())

  // 居中
  model.position.sub(center)

  // 缩放以适应视图
  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = 5 / maxDim
  model.scale.multiplyScalar(scale)

  // 调整相机位置
  camera.position.z = maxDim * 2
}

function animate() {
  if (!scene || !camera || !renderer) return

  animationId = requestAnimationFrame(animate)

  // 自动旋转
  if (autoRotate.value && model) {
    model.rotation.y += 0.01
  }

  renderer.render(scene, camera)
}

function toggleAutoRotate() {
  autoRotate.value = !autoRotate.value
}

function toggleWireframe() {
  wireframe.value = !wireframe.value
  if (model) {
    model.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.wireframe = wireframe.value
      }
    })
  }
}

function toggleGrid() {
  showGrid.value = !showGrid.value
  if (grid) {
    grid.visible = showGrid.value
  }
}

function toggleAxes() {
  showAxes.value = !showAxes.value
  if (axes) {
    axes.visible = showAxes.value
  }
}

function resetCamera() {
  if (camera) {
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
  }
  if (model) {
    model.rotation.x = 0
    model.rotation.y = 0
  }
}

function changeMaterial(type: string) {
  currentMaterial.value = type

  if (!model) return

  const THREE = (window as any).THREE

  model.traverse((child: any) => {
    if (child.isMesh) {
      if (type === 'wireframe') {
        child.material = new THREE.MeshBasicMaterial({
          color: 0x000000,
          wireframe: true
        })
      } else if (type === 'smooth') {
        child.material = new THREE.MeshStandardMaterial({
          color: 0x808080,
          roughness: 0.5,
          metalness: 0.5,
          flatShading: false
        })
      } else {
        child.material = new THREE.MeshStandardMaterial({
          color: 0x808080,
          roughness: 0.7,
          metalness: 0.3,
          flatShading: true
        })
      }
    }
  })
}

function updateLights() {
  if (!scene) return

  const THREE = (window as any).THREE

  // 清除现有灯光
  const lightsToRemove = scene.children.filter((child: any) => child.isLight)
  lightsToRemove.forEach((light: any) => scene.remove(light))

  // 环境光
  if (lights.value.ambient) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
  }

  // 方向光
  if (lights.value.directional) {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)
  }

  // 点光源
  if (lights.value.point) {
    const pointLight = new THREE.PointLight(0xffffff, 1, 100)
    pointLight.position.set(0, 5, 5)
    scene.add(pointLight)
  }
}

function exportScreenshot() {
  if (!renderer) return

  const url = renderer.domElement.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = props.fileName.replace(/\.[^.]+$/, '') + '.png'
  a.click()
}

function exportModel() {
  alert('导出功能需要集成Three.js导出器')
}

function handleResize() {
  if (!canvasWrapper.value || !renderer || !camera) return

  const width = canvasWrapper.value.clientWidth
  const height = canvasWrapper.value.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function handleMouseDown(event: MouseEvent) {
  isMouseDown = true
  mouseX = event.clientX
  mouseY = event.clientY
}

function handleMouseMove(event: MouseEvent) {
  if (!isMouseDown) return

  const deltaX = event.clientX - mouseX
  const deltaY = event.clientY - mouseY

  if (model && !autoRotate.value) {
    model.rotation.y += deltaX * 0.01
    model.rotation.x += deltaY * 0.01
  }

  mouseX = event.clientX
  mouseY = event.clientY
}

function handleMouseUp() {
  isMouseDown = false
}

function handleWheel(event: WheelEvent) {
  if (!camera) return

  event.preventDefault()
  camera.position.z += event.deltaY * 0.01
  camera.position.z = Math.max(1, Math.min(100, camera.position.z))
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

// 监听背景色变化
watch(bgColor, (newColor) => {
  if (scene) {
    scene.background = new (window as any).THREE.Color(newColor)
  }
})

onMounted(async () => {
  try {
    await loadThreeJS()
    await initViewer()

    // 添加事件监听
    if (canvas.value) {
      canvas.value.addEventListener('mousedown', handleMouseDown)
      canvas.value.addEventListener('mousemove', handleMouseMove)
      canvas.value.addEventListener('mouseup', handleMouseUp)
      canvas.value.addEventListener('wheel', handleWheel)
    }

    window.addEventListener('resize', handleResize)
  } catch (err: any) {
    error.value = '初始化失败: ' + err.message
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  if (canvas.value) {
    canvas.value.removeEventListener('mousedown', handleMouseDown)
    canvas.value.removeEventListener('mousemove', handleMouseMove)
    canvas.value.removeEventListener('mouseup', handleMouseUp)
    canvas.value.removeEventListener('wheel', handleWheel)
  }

  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.model3d-preview {
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

.model-info {
  display: flex;
  gap: 20px;
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

.progress-bar {
  width: 200px;
  height: 20px;
  background: #f0f0f0;
  border-radius: 10px;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #667eea;
  transition: width 0.3s;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: white;
  font-weight: 600;
}

.viewer-container {
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
  flex-wrap: wrap;
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

.label {
  font-size: 14px;
  color: #666;
}

.bg-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.canvas-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.canvas-wrapper canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.control-panel {
  display: flex;
  gap: 20px;
  padding: 15px 20px;
  background: #f9f9f9;
  border-top: 1px solid #e0e0e0;
  flex-wrap: wrap;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-section h4 {
  margin: 0;
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  cursor: pointer;
}

.btn-small {
  padding: 6px 10px;
  font-size: 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-small:hover {
  background: #f0f0f0;
}

.btn-small.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}
</style>
