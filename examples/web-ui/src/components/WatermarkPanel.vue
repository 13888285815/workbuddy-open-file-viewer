<script setup lang="ts">
import { ref, computed } from "vue";
import {
  XIcon,
  DropletsIcon,
  ImageIcon,
  EyeIcon,
  RotateCwIcon,
  MoveIcon,
  DownloadIcon,
  CheckIcon,
  TypeIcon,
  SlidersIcon
} from "lucide-vue-next";

interface WatermarkConfig {
  type: "text" | "image";
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number;
  rotation: number;
  position: "tile" | "center" | "custom";
  customX: number;
  customY: number;
  imageUrl?: string;
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
  (e: "apply", config: WatermarkConfig): void;
  (e: "preview", config: WatermarkConfig): void;
}>();

// State
const config = ref<WatermarkConfig>({
  type: "text",
  text: "机密文件",
  fontSize: 48,
  fontFamily: "Microsoft YaHei",
  color: "#000000",
  opacity: 30,
  rotation: -45,
  position: "tile",
  customX: 50,
  customY: 50
});

const showPreview = ref(false);
const applied = ref(false);

// Font families
const fontFamilies = [
  "Microsoft YaHei",
  "SimSun",
  "SimHei",
  "KaiTi",
  "Arial",
  "Times New Roman",
  "Courier New"
];

// Position options
const positionOptions = [
  { value: "tile", label: "平铺", icon: "⊞" },
  { value: "center", label: "居中", icon: "◎" },
  { value: "custom", label: "自定义", icon: "⊕" }
];

// Preset colors
const colorPresets = [
  "#000000", "#ffffff", "#ff0000", "#00ff00",
  "#0000ff", "#ffff00", "#ff00ff", "#00ffff",
  "#808080", "#800000", "#008000", "#000080"
];

// Apply watermark
const applyWatermark = () => {
  emit("apply", { ...config.value });
  applied.value = true;
  setTimeout(() => {
    applied.value = false;
  }, 2000);
};

// Preview watermark
const previewWatermark = () => {
  emit("preview", { ...config.value });
  showPreview.value = true;
};

// Close
const close = () => {
  emit("close");
};

// Handle image upload
const handleImageUpload = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  
  const file = input.files[0];
  const reader = new FileReader();
  
  reader.onload = (event) => {
    config.value.imageUrl = event.target?.result as string;
  };
  
  reader.readAsDataURL(file);
};

// Reset config
const resetConfig = () => {
  config.value = {
    type: "text",
    text: "机密文件",
    fontSize: 48,
    fontFamily: "Microsoft YaHei",
    color: "#000000",
    opacity: 30,
    rotation: -45,
    position: "tile",
    customX: 50,
    customY: 50
  };
};
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="watermark-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <DropletsIcon :size="20" />
          <h3>水印设置</h3>
        </div>
        <button class="close-btn" @click="close">
          <XIcon :size="20" />
        </button>
      </div>

      <!-- File Info -->
      <div class="file-info">
        <div class="file-icon">
          <DropletsIcon :size="24" />
        </div>
        <div class="file-details">
          <div class="file-name">{{ fileName }}</div>
          <div class="file-hint">为文件添加水印保护</div>
        </div>
      </div>

      <!-- Watermark Type -->
      <div class="config-section">
        <label class="config-label">
          <TypeIcon :size="16" />
          水印类型
        </label>
        <div class="type-tabs">
          <button
            :class="['type-tab', { active: config.type === 'text' }]"
            @click="config.type = 'text'"
          >
            <TypeIcon :size="16" />
            文字水印
          </button>
          <button
            :class="['type-tab', { active: config.type === 'image' }]"
            @click="config.type = 'image'"
          >
            <ImageIcon :size="16" />
            图片水印
          </button>
        </div>
      </div>

      <!-- Text Watermark Config -->
      <div v-if="config.type === 'text'" class="config-content">
        <!-- Text Input -->
        <div class="config-section">
          <label class="config-label">水印文字</label>
          <input
            v-model="config.text"
            type="text"
            class="form-input"
            placeholder="请输入水印文字"
          />
        </div>

        <!-- Font Family -->
        <div class="config-section">
          <label class="config-label">字体</label>
          <select v-model="config.fontFamily" class="form-input">
            <option v-for="font in fontFamilies" :key="font" :value="font">
              {{ font }}
            </option>
          </select>
        </div>

        <!-- Font Size -->
        <div class="config-section">
          <label class="config-label">
            <SlidersIcon :size="16" />
            字体大小
          </label>
          <div class="slider-group">
            <input
              v-model.number="config.fontSize"
              type="range"
              min="12"
              max="120"
              class="slider"
            />
            <span class="slider-value">{{ config.fontSize }}px</span>
          </div>
        </div>

        <!-- Color -->
        <div class="config-section">
          <label class="config-label">颜色</label>
          <div class="color-picker">
            <input
              v-model="config.color"
              type="color"
              class="color-input"
            />
            <div class="color-presets">
              <button
                v-for="color in colorPresets"
                :key="color"
                :class="['color-btn', { active: config.color === color }]"
                :style="{ backgroundColor: color }"
                @click="config.color = color"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Watermark Config -->
      <div v-if="config.type === 'image'" class="config-content">
        <div class="config-section">
          <label class="config-label">水印图片</label>
          <div class="image-upload">
            <div v-if="!config.imageUrl" class="upload-placeholder">
              <ImageIcon :size="48" />
              <p>点击或拖拽上传图片</p>
            </div>
            <div v-else class="image-preview">
              <img :src="config.imageUrl" alt="Watermark" />
            </div>
            <input
              type="file"
              accept="image/*"
              class="file-input"
              @change="handleImageUpload"
            />
          </div>
        </div>
      </div>

      <!-- Common Settings -->
      <div class="config-content">
        <!-- Opacity -->
        <div class="config-section">
          <label class="config-label">
            <EyeIcon :size="16" />
            透明度
          </label>
          <div class="slider-group">
            <input
              v-model.number="config.opacity"
              type="range"
              min="5"
              max="100"
              class="slider"
            />
            <span class="slider-value">{{ config.opacity }}%</span>
          </div>
        </div>

        <!-- Rotation -->
        <div class="config-section">
          <label class="config-label">
            <RotateCwIcon :size="16" />
            旋转角度
          </label>
          <div class="slider-group">
            <input
              v-model.number="config.rotation"
              type="range"
              min="-180"
              max="180"
              class="slider"
            />
            <span class="slider-value">{{ config.rotation }}°</span>
          </div>
        </div>

        <!-- Position -->
        <div class="config-section">
          <label class="config-label">
            <MoveIcon :size="16" />
            位置
          </label>
          <div class="position-options">
            <button
              v-for="opt in positionOptions"
              :key="opt.value"
              :class="['position-btn', { active: config.position === opt.value }]"
              @click="config.position = opt.value as any"
            >
              <span class="position-icon">{{ opt.icon }}</span>
              <span>{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <!-- Custom Position -->
        <div v-if="config.position === 'custom'" class="config-section">
          <label class="config-label">自定义位置</label>
          <div class="custom-position">
            <div class="position-input">
              <label>X: {{ config.customX }}%</label>
              <input
                v-model.number="config.customX"
                type="range"
                min="0"
                max="100"
                class="slider"
              />
            </div>
            <div class="position-input">
              <label>Y: {{ config.customY }}%</label>
              <input
                v-model.number="config.customY"
                type="range"
                min="0"
                max="100"
                class="slider"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Area -->
      <div class="preview-section">
        <div class="preview-header">
          <span>水印预览</span>
          <button class="preview-btn" @click="previewWatermark">
            <EyeIcon :size="14" />
            刷新预览
          </button>
        </div>
        <div class="preview-area">
          <div class="preview-document">
            <div class="preview-content">
              <h2>示例文档</h2>
              <p>这是一段示例文本，用于预览水印效果。</p>
              <p>水印将显示在此文档的背景中。</p>
              
              <!-- Watermark Preview Overlay -->
              <div
                v-if="showPreview"
                class="watermark-preview-overlay"
                :style="{
                  opacity: config.opacity / 100
                }"
              >
                <!-- Tile position -->
                <template v-if="config.position === 'tile'">
                  <div
                    v-for="i in 20"
                    :key="i"
                    class="watermark-text tile"
                    :style="{
                      left: ((i - 1) % 5) * 25 + '%',
                      top: Math.floor((i - 1) / 5) * 33 + '%',
                      transform: `rotate(${config.rotation}deg)`,
                      color: config.color,
                      fontSize: config.fontSize + 'px',
                      fontFamily: config.fontFamily
                    }"
                  >
                    {{ config.type === 'text' ? config.text : '🖼️' }}
                  </div>
                </template>
                
                <!-- Center position -->
                <template v-if="config.position === 'center'">
                  <div
                    class="watermark-text center"
                    :style="{
                      transform: `translate(-50%, -50%) rotate(${config.rotation}deg)`,
                      color: config.color,
                      fontSize: config.fontSize + 'px',
                      fontFamily: config.fontFamily
                    }"
                  >
                    {{ config.type === 'text' ? config.text : '🖼️' }}
                  </div>
                </template>
                
                <!-- Custom position -->
                <template v-if="config.position === 'custom'">
                  <div
                    class="watermark-text custom"
                    :style="{
                      left: config.customX + '%',
                      top: config.customY + '%',
                      transform: `translate(-50%, -50%) rotate(${config.rotation}deg)`,
                      color: config.color,
                      fontSize: config.fontSize + 'px',
                      fontFamily: config.fontFamily
                    }"
                  >
                    {{ config.type === 'text' ? config.text : '🖼️' }}
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button class="btn-secondary" @click="resetConfig">
          重置
        </button>
        <button class="btn-primary" @click="applyWatermark">
          <CheckIcon v-if="!applied" :size="16" />
          <CheckIcon v-else :size="16" />
          {{ applied ? "已应用" : "应用水印" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.watermark-modal {
  background: var(--bg-primary);
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  z-index: 10;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-title svg {
  color: var(--primary);
}

.close-btn {
  width: 32px;
  height: 32px;
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

/* File Info */
.file-info {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-secondary);
  margin: 16px;
  border-radius: 8px;
}

.file-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: white;
  border-radius: 8px;
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 500;
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.file-hint {
  font-size: 12px;
  color: var(--text-muted);
}

/* Config Sections */
.config-section {
  padding: 12px 20px;
}

.config-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.config-label svg {
  color: var(--text-muted);
}

.config-content {
  animation: fadeIn 0.2s ease;
}

/* Type Tabs */
.type-tabs {
  display: flex;
  gap: 8px;
}

.type-tab {
  flex: 1;
  padding: 12px;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.type-tab:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.type-tab.active {
  border-color: var(--primary);
  background: var(--selected-bg);
  color: var(--primary);
}

/* Form Input */
.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.15s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Slider */
.slider-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--bg-tertiary);
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  transition: all 0.15s;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.slider-value {
  min-width: 60px;
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 500;
  text-align: right;
}

/* Color Picker */
.color-picker {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-input {
  width: 48px;
  height: 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
}

.color-presets {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.color-btn {
  width: 28px;
  height: 28px;
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
  box-shadow: 0 0 0 2px var(--bg-primary);
}

/* Image Upload */
.image-upload {
  position: relative;
  border: 2px dashed var(--border);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.image-upload:hover {
  border-color: var(--primary);
}

.upload-placeholder {
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
}

.upload-placeholder svg {
  margin-bottom: 12px;
}

.upload-placeholder p {
  font-size: 13px;
}

.image-preview {
  padding: 20px;
  text-align: center;
}

.image-preview img {
  max-width: 200px;
  max-height: 120px;
  object-fit: contain;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

/* Position Options */
.position-options {
  display: flex;
  gap: 8px;
}

.position-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.position-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.position-btn.active {
  border-color: var(--primary);
  background: var(--selected-bg);
  color: var(--primary);
}

.position-icon {
  font-size: 24px;
}

/* Custom Position */
.custom-position {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.position-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.position-input label {
  font-size: 12px;
  color: var(--text-muted);
}

/* Preview */
.preview-section {
  margin: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.preview-header {
  padding: 10px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.preview-btn {
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s;
}

.preview-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.preview-area {
  height: 300px;
  overflow: auto;
  background: var(--bg-primary);
}

.preview-document {
  padding: 40px;
  min-height: 100%;
}

.preview-content {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.preview-content h2 {
  margin-bottom: 16px;
  color: #000;
}

.preview-content p {
  margin-bottom: 12px;
  line-height: 1.6;
  color: #333;
}

/* Watermark Preview Overlay */
.watermark-preview-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.watermark-text {
  position: absolute;
  white-space: nowrap;
  user-select: none;
}

.watermark-text.tile {
  transform-origin: center;
}

.watermark-text.center {
  left: 50%;
  top: 50%;
}

.watermark-text.custom {
  transform-origin: center;
}

/* Modal Actions */
.modal-actions {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  position: sticky;
  bottom: 0;
  background: var(--bg-primary);
}

.btn-primary {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: var(--primary);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  padding: 10px 20px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Responsive */
@media (max-width: 768px) {
  .watermark-modal {
    width: 95%;
  }

  .type-tabs {
    flex-direction: column;
  }

  .preview-area {
    height: 200px;
  }
}
</style>
