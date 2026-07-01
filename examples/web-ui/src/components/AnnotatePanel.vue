<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import {
  XIcon,
  PenIcon,
  TypeIcon,
  HighlighterIcon,
  SquareIcon,
  CircleIcon,
  ArrowRightIcon,
  UndoIcon,
  RedoIcon,
  SaveIcon,
  DownloadIcon,
  TrashIcon,
  PaletteIcon,
  MousePointerIcon,
  EraserIcon
} from "lucide-vue-next";

interface Annotation {
  id: string;
  type: "pen" | "text" | "highlight" | "rect" | "circle" | "arrow";
  color: string;
  size: number;
  points?: { x: number; y: number }[];
  text?: string;
  x?: number;
  y?: number;
}

interface Props {
  visible: boolean;
  fileName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fileName: "未命名文件"
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", annotations: Annotation[]): void;
  (e: "export"): void;
}>();

// Tool state
type ToolType = "select" | "pen" | "text" | "highlight" | "rect" | "circle" | "arrow" | "eraser";
const currentTool = ref<ToolType>("select");
const currentColor = ref("#ff0000");
const currentSize = ref(3);

// Canvas state
const canvasRef = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const isDrawing = ref(false);
const annotations = ref<Annotation[]>([]);
const undoStack = ref<Annotation[][]>([]);
const redoStack = ref<Annotation[][]>([]);

// Text input
const showTextInput = ref(false);
const textInput = ref("");
const textPosition = ref({ x: 0, y: 0 });

// Color presets
const colorPresets = [
  "#ff0000", "#00ff00", "#0000ff", "#ffff00",
  "#ff00ff", "#00ffff", "#000000", "#ffffff",
  "#ff8800", "#88ff00", "#0088ff", "#ff0088"
];

// Size presets
const sizePresets = [1, 2, 3, 5, 8, 12];

// Initialize canvas
const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  ctx.value = canvas.getContext("2d");
  resizeCanvas();
  redrawAnnotations();
};

// Resize canvas
const resizeCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const parent = canvas.parentElement;
  if (!parent) return;
  
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;
  
  redrawAnnotations();
};

// Start drawing
const startDrawing = (e: MouseEvent) => {
  if (currentTool.value === "select") return;
  
  isDrawing.value = true;
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  if (currentTool.value === "text") {
    textPosition.value = { x, y };
    showTextInput.value = true;
    return;
  }
  
  const annotation: Annotation = {
    id: Date.now().toString(),
    type: currentTool.value as any,
    color: currentColor.value,
    size: currentSize.value,
    points: [{ x, y }]
  };
  
  annotations.value.push(annotation);
  saveToUndoStack();
};

// Draw
const draw = (e: MouseEvent) => {
  if (!isDrawing.value) return;
  
  const canvas = canvasRef.value;
  if (!canvas || !ctx.value) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const currentAnnotation = annotations.value[annotations.value.length - 1];
  if (!currentAnnotation || !currentAnnotation.points) return;
  
  currentAnnotation.points.push({ x, y });
  
  redrawAnnotations();
};

// Stop drawing
const stopDrawing = () => {
  isDrawing.value = false;
};

// Redraw all annotations
const redrawAnnotations = () => {
  const canvas = canvasRef.value;
  if (!canvas || !ctx.value) return;
  
  ctx.value.clearRect(0, 0, canvas.width, canvas.height);
  
  for (const annotation of annotations.value) {
    drawAnnotation(annotation);
  }
};

// Draw single annotation
const drawAnnotation = (annotation: Annotation) => {
  if (!ctx.value) return;
  
  ctx.value.strokeStyle = annotation.color;
  ctx.value.fillStyle = annotation.color;
  ctx.value.lineWidth = annotation.size;
  ctx.value.lineCap = "round";
  ctx.value.lineJoin = "round";
  
  switch (annotation.type) {
    case "pen":
      if (!annotation.points || annotation.points.length < 2) break;
      ctx.value.beginPath();
      ctx.value.moveTo(annotation.points[0].x, annotation.points[0].y);
      for (let i = 1; i < annotation.points.length; i++) {
        ctx.value.lineTo(annotation.points[i].x, annotation.points[i].y);
      }
      ctx.value.stroke();
      break;
      
    case "highlight":
      ctx.value.globalAlpha = 0.3;
      if (!annotation.points || annotation.points.length < 2) break;
      ctx.value.beginPath();
      ctx.value.moveTo(annotation.points[0].x, annotation.points[0].y);
      for (let i = 1; i < annotation.points.length; i++) {
        ctx.value.lineTo(annotation.points[i].x, annotation.points[i].y);
      }
      ctx.value.stroke();
      ctx.value.globalAlpha = 1.0;
      break;
      
    case "rect":
      if (!annotation.points || annotation.points.length < 2) break;
      const rectX = Math.min(annotation.points[0].x, annotation.points[annotation.points.length - 1].x);
      const rectY = Math.min(annotation.points[0].y, annotation.points[annotation.points.length - 1].y);
      const rectW = Math.abs(annotation.points[annotation.points.length - 1].x - annotation.points[0].x);
      const rectH = Math.abs(annotation.points[annotation.points.length - 1].y - annotation.points[0].y);
      ctx.value.strokeRect(rectX, rectY, rectW, rectH);
      break;
      
    case "circle":
      if (!annotation.points || annotation.points.length < 2) break;
      const centerX = annotation.points[0].x;
      const centerY = annotation.points[0].y;
      const radiusX = Math.abs(annotation.points[annotation.points.length - 1].x - centerX);
      const radiusY = Math.abs(annotation.points[annotation.points.length - 1].y - centerY);
      ctx.value.beginPath();
      ctx.value.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.value.stroke();
      break;
      
    case "arrow":
      if (!annotation.points || annotation.points.length < 2) break;
      const start = annotation.points[0];
      const end = annotation.points[annotation.points.length - 1];
      drawArrow(start.x, start.y, end.x, end.y);
      break;
  }
};

// Draw arrow
const drawArrow = (fromX: number, fromY: number, toX: number, toY: number) => {
  if (!ctx.value) return;
  
  const headlen = 15;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  
  ctx.value.beginPath();
  ctx.value.moveTo(fromX, fromY);
  ctx.value.lineTo(toX, toY);
  ctx.value.stroke();
  
  ctx.value.beginPath();
  ctx.value.moveTo(toX, toY);
  ctx.value.lineTo(
    toX - headlen * Math.cos(angle - Math.PI / 6),
    toY - headlen * Math.sin(angle - Math.PI / 6)
  );
  ctx.value.moveTo(toX, toY);
  ctx.value.lineTo(
    toX - headlen * Math.cos(angle + Math.PI / 6),
    toY - headlen * Math.sin(angle + Math.PI / 6)
  );
  ctx.value.stroke();
};

// Add text annotation
const addTextAnnotation = () => {
  if (!textInput.value.trim()) {
    showTextInput.value = false;
    return;
  }
  
  const annotation: Annotation = {
    id: Date.now().toString(),
    type: "text",
    color: currentColor.value,
    size: currentSize.value * 5,
    text: textInput.value,
    x: textPosition.value.x,
    y: textPosition.value.y
  };
  
  annotations.value.push(annotation);
  saveToUndoStack();
  
  // Draw text
  if (ctx.value) {
    ctx.value.fillStyle = annotation.color;
    ctx.value.font = `${annotation.size}px sans-serif`;
    ctx.value.fillText(annotation.text!, annotation.x!, annotation.y!);
  }
  
  textInput.value = "";
  showTextInput.value = false;
};

// Undo
const undo = () => {
  if (annotations.value.length === 0) return;
  
  undoStack.value.push([...annotations.value]);
  annotations.value.pop();
  redoStack.value = [];
  
  redrawAnnotations();
};

// Redo
const redo = () => {
  if (undoStack.value.length === 0) return;
  
  const lastState = undoStack.value.pop();
  if (lastState) {
    redoStack.value.push([...annotations.value]);
    annotations.value = lastState;
    redrawAnnotations();
  }
};

// Save to undo stack
const saveToUndoStack = () => {
  undoStack.value.push([...annotations.value]);
  if (undoStack.value.length > 50) {
    undoStack.value.shift();
  }
  redoStack.value = [];
};

// Clear all
const clearAll = () => {
  annotations.value = [];
  saveToUndoStack();
  redrawAnnotations();
};

// Save annotations
const saveAnnotations = () => {
  emit("save", annotations.value);
};

// Export with annotations
const exportFile = () => {
  emit("export");
};

// Close
const close = () => {
  emit("close");
};

// Lifecycle
onMounted(() => {
  initCanvas();
  window.addEventListener("resize", resizeCanvas);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCanvas);
});

// Tool options
const tools = [
  { value: "select", icon: MousePointerIcon, label: "选择" },
  { value: "pen", icon: PenIcon, label: "画笔" },
  { value: "text", icon: TypeIcon, label: "文本" },
  { value: "highlight", icon: HighlighterIcon, label: "高亮" },
  { value: "rect", icon: SquareIcon, label: "矩形" },
  { value: "circle", icon: CircleIcon, label: "圆形" },
  { value: "arrow", icon: ArrowRightIcon, label: "箭头" },
  { value: "eraser", icon: EraserIcon, label: "橡皮" }
];
</script>

<template>
  <div v-if="visible" class="annotate-panel">
    <!-- Header -->
    <div class="panel-header">
      <div class="header-left">
        <PenIcon :size="20" />
        <h3>标注批注</h3>
        <span class="file-name">{{ fileName }}</span>
      </div>
      <button class="close-btn" @click="close">
        <XIcon :size="20" />
      </button>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <!-- Tools -->
      <div class="tool-group">
        <button
          v-for="tool in tools"
          :key="tool.value"
          :class="['tool-btn', { active: currentTool === tool.value }]"
          :title="tool.label"
          @click="currentTool = tool.value as ToolType"
        >
          <component :is="tool.icon" :size="18" />
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Color Picker -->
      <div class="tool-group">
        <div class="color-picker">
          <div
            class="current-color"
            :style="{ backgroundColor: currentColor }"
          ></div>
          <div class="color-presets">
            <button
              v-for="color in colorPresets"
              :key="color"
              :class="['color-btn', { active: currentColor === color }]"
              :style="{ backgroundColor: color }"
              @click="currentColor = color"
            ></button>
          </div>
        </div>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Size Picker -->
      <div class="tool-group">
        <div class="size-picker">
          <span class="size-label">粗细</span>
          <div class="size-options">
            <button
              v-for="size in sizePresets"
              :key="size"
              :class="['size-btn', { active: currentSize === size }]"
              @click="currentSize = size"
            >
              <span :style="{ width: size * 3 + 'px', height: size * 3 + 'px' }"></span>
            </button>
          </div>
        </div>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Actions -->
      <div class="tool-group">
        <button
          class="action-btn"
          title="撤销"
          :disabled="annotations.length === 0"
          @click="undo"
        >
          <UndoIcon :size="18" />
        </button>
        <button
          class="action-btn"
          title="重做"
          :disabled="undoStack.length === 0"
          @click="redo"
        >
          <RedoIcon :size="18" />
        </button>
        <button
          class="action-btn danger"
          title="清除全部"
          @click="clearAll"
        >
          <TrashIcon :size="18" />
        </button>
      </div>

      <div class="toolbar-spacer"></div>

      <!-- Save / Export -->
      <div class="tool-group">
        <button class="primary-btn" @click="saveAnnotations">
          <SaveIcon :size="16" />
          保存批注
        </button>
        <button class="secondary-btn" @click="exportFile">
          <DownloadIcon :size="16" />
          导出文件
        </button>
      </div>
    </div>

    <!-- Canvas Area -->
    <div class="canvas-container">
      <canvas
        ref="canvasRef"
        :class="['annotation-canvas', `cursor-${currentTool}`]"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
      ></canvas>

      <!-- Text Input -->
      <div
        v-if="showTextInput"
        class="text-input-overlay"
        :style="{ left: textPosition.x + 'px', top: textPosition.y + 'px' }"
      >
        <input
          v-model="textInput"
          class="text-input"
          placeholder="输入文本..."
          :style="{ color: currentColor, fontSize: currentSize * 5 + 'px' }"
          @keyup.enter="addTextAnnotation"
          @keyup.escape="showTextInput = false"
          ref="textInputRef"
        />
      </div>
    </div>

    <!-- Annotation List -->
    <div class="annotation-list">
      <div class="list-header">
        <span>批注列表</span>
        <span class="count">{{ annotations.length }} 个批注</span>
      </div>
      <div class="list-content">
        <div
          v-for="(annotation, index) in annotations"
          :key="annotation.id"
          class="annotation-item"
        >
          <div class="annotation-icon" :style="{ color: annotation.color }">
            <PenIcon v-if="annotation.type === 'pen'" :size="14" />
            <TypeIcon v-else-if="annotation.type === 'text'" :size="14" />
            <HighlighterIcon v-else-if="annotation.type === 'highlight'" :size="14" />
            <SquareIcon v-else-if="annotation.type === 'rect'" :size="14" />
            <CircleIcon v-else-if="annotation.type === 'circle'" :size="14" />
            <ArrowRightIcon v-else-if="annotation.type === 'arrow'" :size="14" />
          </div>
          <div class="annotation-info">
            <span class="annotation-type">
              {{ annotation.type === 'pen' ? '画笔' :
                  annotation.type === 'text' ? '文本' :
                  annotation.type === 'highlight' ? '高亮' :
                  annotation.type === 'rect' ? '矩形' :
                  annotation.type === 'circle' ? '圆形' : '箭头' }}
            </span>
            <span class="annotation-detail">
              {{ annotation.text || `${annotation.points?.length || 0} 个点` }}
            </span>
          </div>
          <button
            class="delete-btn"
            @click="annotations.splice(index, 1); redrawAnnotations()"
          >
            <XIcon :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.annotate-panel {
  position: fixed;
  inset: 0;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Header */
.panel-header {
  height: 56px;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-secondary);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left svg {
  color: var(--primary);
}

.header-left h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.file-name {
  font-size: 13px;
  color: var(--text-muted);
  padding: 4px 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.close-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Toolbar */
.toolbar {
  height: 56px;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-primary);
  overflow-x: auto;
}

.tool-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-divider {
  width: 1px;
  height: 32px;
  background: var(--border);
  margin: 0 8px;
}

.toolbar-spacer {
  flex: 1;
}

/* Tool Buttons */
.tool-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.tool-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.tool-btn.active {
  background: var(--primary);
  color: white;
}

/* Color Picker */
.color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-color {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid var(--border);
  cursor: pointer;
}

.color-presets {
  display: flex;
  gap: 4px;
}

.color-btn {
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.color-btn:hover {
  transform: scale(1.2);
}

.color-btn.active {
  border-color: var(--text-primary);
}

/* Size Picker */
.size-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}

.size-label {
  font-size: 12px;
  color: var(--text-muted);
}

.size-options {
  display: flex;
  align-items: center;
  gap: 4px;
}

.size-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.size-btn:hover {
  background: var(--bg-secondary);
}

.size-btn.active {
  background: var(--selected-bg);
}

.size-btn span {
  display: block;
  background: var(--text-primary);
  border-radius: 50%;
}

/* Action Buttons */
.action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn:hover:not(:disabled) {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.action-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.action-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.primary-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: var(--primary);
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}

.primary-btn:hover {
  background: var(--primary-hover);
}

.secondary-btn {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}

.secondary-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Canvas */
.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: var(--bg-secondary);
  margin: 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.annotation-canvas {
  position: absolute;
  inset: 0;
  cursor: crosshair;
}

.annotation-canvas.cursor-select {
  cursor: default;
}

.annotation-canvas.cursor-eraser {
  cursor: pointer;
}

/* Text Input */
.text-input-overlay {
  position: absolute;
  z-index: 10;
}

.text-input {
  padding: 4px 8px;
  border: 2px solid var(--primary);
  border-radius: 4px;
  background: var(--bg-primary);
  outline: none;
  min-width: 200px;
}

/* Annotation List */
.annotation-list {
  height: 200px;
  border-top: 1px solid var(--border);
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
}

.count {
  font-size: 12px;
  color: var(--text-muted);
}

.list-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.annotation-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  transition: all 0.15s;
}

.annotation-item:hover {
  background: var(--bg-tertiary);
}

.annotation-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border-radius: 4px;
}

.annotation-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.annotation-type {
  font-size: 13px;
  color: var(--text-primary);
}

.annotation-detail {
  font-size: 11px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s;
}

.annotation-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Responsive */
@media (max-width: 768px) {
  .toolbar {
    padding: 0 10px;
  }

  .color-presets {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
  }

  .annotation-list {
    height: 150px;
  }
}
</style>
