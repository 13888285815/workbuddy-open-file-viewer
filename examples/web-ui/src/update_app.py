import re

# Read App.vue
with open('App.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add imports for new components
old_import = "import Sidebar from \"./components/Sidebar.vue\";"
new_import = """import Sidebar from "./components/Sidebar.vue";
import PreviewToolbar from "./components/PreviewToolbar.vue";
import StatusBar from "./components/StatusBar.vue";
import FileConverter from "./components/FileConverter.vue";"""
content = content.replace(old_import, new_import)

# 2. Add state for preview toolbar
old_state = "const showPreviewModal = ref(false);\nconst previewFile = ref<TreeNode | null>(null);"
new_state = """const showPreviewModal = ref(false);
const previewFile = ref<TreeNode | null>(null);
const previewScale = ref(1);
const previewRotation = ref(0);
const previewCurrentPage = ref(1);
const previewTotalPages = ref(0);
const showConverter = ref(false);"""

if old_state in content:
    content = content.replace(old_state, new_state)

# 3. Add toolbar event handlers
toolbar_handlers = """
// ─── Preview Toolbar Actions ─────────────────────────────────────────────────

const handleZoomIn = () => {
  previewScale.value = Math.min(previewScale.value + 0.25, 3);
};

const handleZoomOut = () => {
  previewScale.value = Math.max(previewScale.value - 0.25, 0.1);
};

const handleRotateCW = () => {
  previewRotation.value = (previewRotation.value + 90) % 360;
};

const handlePrevPage = () => {
  previewCurrentPage.value = Math.max(previewCurrentPage.value - 1, 1);
};

const handleNextPage = () => {
  if (previewTotalPages.value) {
    previewCurrentPage.value = Math.min(previewCurrentPage.value + 1, previewTotalPages.value);
  }
};

const handleEdit = () => {
  alert("编辑功能开发中...");
};

const handleSaveAs = () => {
  if (!store.selectedFile?.file) return;
  const url = URL.createObjectURL(store.selectedFile.file);
  const a = document.createElement("a");
  a.href = url;
  a.download = store.selectedFile.name;
  a.click();
  URL.revokeObjectURL(url);
};

const handlePrint = () => {
  window.print();
};

const handleShare = () => {
  if (navigator.share && store.selectedFile) {
    navigator.share({
      title: store.selectedFile.name,
      text: "查看文件: " + store.selectedFile.name,
    });
  } else {
    alert("分享功能需要浏览器支持 Web Share API");
  }
};

const handleInfo = (node?: TreeNode) => {
  const target = node || store.selectedFile;
  if (!target) return;
  detailTarget.value = target;
  showDetailModal.value = true;
  closeContextMenu();
};

const handleSettings = () => {
  alert("设置功能开发中...");
};

const handleConverter = () => {
  showConverter.value = !showConverter.value;
};

const handleConvert = (targetFormat: string) => {
  console.log("Converting to:", targetFormat);
  alert(`文件转换功能开发中...\\n目标格式: ${targetFormat}`);
};
"""

# Insert before the keyboard shortcuts section
old_section = "// ─── Keyboard Shortcuts ───────────────────────────────────────────────────────"
if old_section in content:
    content = content.replace(old_section, toolbar_handlers + "\n" + old_section)

# Write back
with open('App.vue', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ App.vue updated with new component imports and handlers")
