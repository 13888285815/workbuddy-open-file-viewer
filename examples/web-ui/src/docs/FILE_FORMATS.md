# 文件格式支持清单

## 已支持的格式

### 图片格式
- ✅ JPEG/JPG - imagePlugin
- ✅ PNG - imagePlugin
- ✅ GIF - imagePlugin
- ✅ WebP - imagePlugin
- ✅ SVG - imagePlugin
- ✅ BMP - imagePlugin
- ✅ ICO - 需要添加
- ✅ AVIF - 需要添加
- ✅ HEIC - 需要添加

### 视频格式
- ✅ MP4 - videoPlugin
- ✅ WebM - videoPlugin
- ✅ AVI - 需要添加
- ✅ MOV - 需要添加
- ✅ MKV - 需要添加
- ✅ FLV - 需要添加

### 音频格式
- ✅ MP3 - audioPlugin
- ✅ WAV - audioPlugin
- ✅ OGG - 需要添加
- ✅ FLAC - 需要添加
- ✅ AAC - 需要添加
- ✅ WMA - 需要添加

### 文档格式
- ✅ PDF - pdfPlugin
- ✅ DOCX - officePlugin
- ✅ XLSX - officePlugin
- ✅ PPTX - officePlugin
- ✅ ODT - ofdPlugin
- ✅ ODS - ofdPlugin
- ✅ ODP - ofdPlugin
- ✅ EPUB - epubPlugin
- ✅ XPS - xpsPlugin

### 压缩包格式
- ✅ ZIP - archivePlugin
- ✅ RAR - archivePlugin (需要 unrar.js)
- ✅ 7Z - archivePlugin (需要 7zip.js)
- ✅ TAR - archivePlugin
- ✅ GZ - archivePlugin

### 代码格式
- ✅ JS/TS - textPlugin (语法高亮)
- ✅ PY - textPlugin
- ✅ HTML/CSS - textPlugin
- ✅ JSON - textPlugin
- ✅ XML - textPlugin
- ✅ YAML - textPlugin
- ✅ Markdown - textPlugin (渲染)

### 邮件格式
- ✅ EML - emailPlugin
- ✅ MSG - emailPlugin (需要添加)

### 3D 模型格式
- ✅ GLTF/GLB - model3dPlugin
- ✅ OBJ - model3dPlugin
- ✅ FBX - 需要添加
- ✅ STL - 需要添加
- ✅ 3DS - 需要添加

### CAD 格式
- ✅ DWG - cadPlugin (需要添加)
- ✅ DXF - cadPlugin (需要添加)

### GIS 格式
- ✅ GeoJSON - gisPlugin
- ✅ KML - gisPlugin
- ✅ GPX - gisPlugin

## 需要添加的格式支持

### 图片格式
- [ ] ICO - 使用 canvas 渲染
- [ ] AVIF - 使用 avif.js
- [ ] HEIC - 使用 heic2any

### 视频格式
- [ ] AVI - 使用 video.js 或直接 <video>
- [ ] MOV - 使用 <video>
- [ ] MKV - 使用 video.js

### 音频格式
- [ ] OGG - 使用 <audio>
- [ ] FLAC - 使用 <audio>
- [ ] AAC - 使用 <audio>

### 压缩包格式
- [ ] RAR - 使用 unrar.js
- [ ] 7Z - 使用 7zip.js

### 邮件格式
- [ ] MSG - 使用 emailjs

### 3D 模型格式
- [ ] FBX - 使用 three.js FBXLoader
- [ ] STL - 使用 three.js STLLoader
- [ ] 3DS - 使用 three.js TDSLoader

### CAD 格式
- [ ] DWG - 使用 LibreDWG 或在线转换
- [ ] DXF - 使用 three.js DXFLoader

### 其他格式
- [ ] CSV - 表格预览
- [ ] RTF - 富文本预览
- [ ] Torrent - 种子文件解析
- [ ] APK - Android 包解析
- [ ] IPYNB - Jupyter Notebook 渲染

## 文件转换支持

### 文档转换
- [ ] PDF → Word/Excel/PowerPoint
- [ ] Word → PDF/HTML/Markdown
- [ ] Excel → PDF/CSV/HTML
- [ ] PowerPoint → PDF/Images
- [ ] Markdown → PDF/HTML/Word
- [ ] HTML → PDF/Markdown

### 图片转换
- [ ] JPG/PNG/GIF/WebP 互转
- [ ] SVG → PNG/JPG
- [ ] HEIC → JPG/PNG

### 视频转换
- [ ] MP4 → WebM/GIF
- [ ] WebM → MP4
- [ ] 视频 → 音频

### 音频转换
- [ ] MP3 → WAV/OGG
- [ ] WAV → MP3/FLAC

## 实现优先级

### P0 (立即实现)
- ICO/AVIF/HEIC 图片格式
- CSV 表格预览
- 视频/音频格式的更多支持

### P1 (本周内)
- RAR/7Z 压缩包
- MSG 邮件格式
- FBX/STL 3D 模型

### P2 (本月内)
- DWG/DXF CAD 格式
- 文件转换功能
- Jupyter Notebook 渲染
