import re

# Read App.vue
with open('App.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the toolbar section with PreviewToolbar
old_toolbar = """        <!-- Toolbar -->
        <div class="content-toolbar">"""

new_toolbar = """        <!-- Preview Toolbar -->
        <PreviewToolbar
          :file="store.selectedFile"
          :current-page="previewCurrentPage"
          :total-pages="previewTotalPages"
          :scale="previewScale"
          :rotation="previewRotation"
          :is-fullscreen="isFullscreen"
          @zoom-in="handleZoomIn"
          @zoom-out="handleZoomOut"
          @rotate-cw="handleRotateCW"
          @prev-page="handlePrevPage"
          @next-page="handleNextPage"
          @edit="handleEdit"
          @save-as="handleSaveAs"
          @print="handlePrint"
          @share="handleShare"
          @download="downloadFile"
          @fullscreen="toggleFullscreen"
          @info="handleInfo"
          @settings="handleSettings"
        />"""

if old_toolbar in content:
    content = content.replace(old_toolbar, new_toolbar)
    print("✅ Replaced toolbard with PreviewToolbar")
else:
    print("⚠️ Toolbard not found")

# 2. Add StatusBar before the closing </main> tag
old_closing = "    </main>"
new_closing = """    <!-- Status Bar -->
    <StatusBar
      :file="store.selectedFile"
      :total-files="store.flatList.filter(n => n.type !== 'folder').length"
      :total-folders="store.flatList.filter(n => n.type === 'folder').length"
      :total-size="store.flatList.reduce((sum, n) => sum + (n.size || 0), 0)"
      :selected-count="store.selectedIds.size"
      @clear-selection="store.clearSelection()"
    />

    <!-- File Converter Panel -->
    <div v-if="showConverter" class="converter-panel-container">
      <FileConverter
        :file="store.selectedFile"
        @convert="handleConvert"
      />
    </div>
  </main>"""

if old_closing in content:
    content = content.replace(old_closing, new_closing)
    print("✅ Added StatusBar and FileConverter")
else:
    print("⚠️ Closing main tag not found")

# Write back
with open('App.vue', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Template updated")
