<template>
  <div class="email-preview">
    <div class="preview-header">
      <h3>📧 邮件预览</h3>
    </div>

    <div class="preview-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在解析邮件...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error">
        <p>❌ {{ error }}</p>
      </div>

      <!-- 邮件内容 -->
      <div v-else-if="email" class="email-container">
        <!-- 邮件头部信息 -->
        <div class="email-header">
          <div class="email-field">
            <label>发件人:</label>
            <span>{{ email.from }}</span>
          </div>
          <div class="email-field">
            <label>收件人:</label>
            <span>{{ email.to }}</span>
          </div>
          <div class="email-field" v-if="email.cc">
            <label>抄送:</label>
            <span>{{ email.cc }}</span>
          </div>
          <div class="email-field">
            <label>主题:</label>
            <span class="subject">{{ email.subject }}</span>
          </div>
          <div class="email-field">
            <label>日期:</label>
            <span>{{ formatDate(email.date) }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="email-actions">
          <button @click="reply" class="btn btn-primary">回复</button>
          <button @click="forward" class="btn">转发</button>
          <button @click="downloadEmail" class="btn">下载原文</button>
        </div>

        <!-- 邮件正文 -->
        <div class="email-body">
          <!-- HTML正文 -->
          <div v-if="email.htmlBody" class="html-body">
            <iframe
              ref="bodyFrame"
              class="body-frame"
              sandbox="allow-same-origin"
            ></iframe>
          </div>

          <!-- 纯文本正文 -->
          <div v-else-if="email.textBody" class="text-body">
            <pre>{{ email.textBody }}</pre>
          </div>

          <!-- 无正文 -->
          <div v-else class="no-body">
            <p>此邮件没有正文内容</p>
          </div>
        </div>

        <!-- 附件列表 -->
        <div v-if="email.attachments && email.attachments.length > 0" class="attachments">
          <h4>📎 附件 ({{ email.attachments.length }})</h4>
          <div class="attachment-list">
            <div
              v-for="(attachment, index) in email.attachments"
              :key="index"
              class="attachment-item"
            >
              <span class="attachment-icon">{{ getFileIcon(attachment.name) }}</span>
              <div class="attachment-info">
                <span class="attachment-name">{{ attachment.name }}</span>
                <span class="attachment-size">{{ formatSize(attachment.size) }}</span>
              </div>
              <button @click="downloadAttachment(attachment)" class="btn-small">
                下载
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface EmailAttachment {
  name: string
  size: number
  type: string
  content: Blob
}

interface EmailData {
  from: string
  to: string
  cc?: string
  subject: string
  date: Date
  htmlBody?: string
  textBody?: string
  attachments: EmailAttachment[]
}

const props = defineProps<{
  fileUrl: string
  fileName: string
}>()

const loading = ref(false)
const error = ref('')
const email = ref<EmailData | null>(null)
const bodyFrame = ref<HTMLIFrameElement>()

async function loadEmail() {
  loading.value = true
  error.value = ''

  try {
    // 动态加载JSZip（用于解析.eml或.msg文件）
    if (!(window as any).JSZip) {
      await loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js')
    }

    const response = await fetch(props.fileUrl)
    const blob = await response.blob()

    // 判断文件类型
    if (props.fileName.endsWith('.eml')) {
      await parseEml(blob)
    } else if (props.fileName.endsWith('.msg')) {
      await parseMsg(blob)
    } else {
      throw new Error('不支持的邮件格式')
    }

    // 渲染HTML正文
    if (email.value?.htmlBody) {
      await nextTick()
      if (bodyFrame.value) {
        const frameDoc = bodyFrame.value.contentDocument
        if (frameDoc) {
          frameDoc.open()
          frameDoc.write(email.value.htmlBody)
          frameDoc.close()
        }
      }
    }
  } catch (err: any) {
    error.value = '解析邮件失败: ' + err.message
  } finally {
    loading.value = false
  }
}

async function parseEml(blob: Blob) {
  const text = await blob.text()
  const lines = text.split('\n')

  const emailData: EmailData = {
    from: '',
    to: '',
    subject: '',
    date: new Date(),
    attachments: []
  }

  let isHeaders = true
  let bodyStart = false
  let htmlBody = ''
  let textBody = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (isHeaders) {
      if (line.startsWith('From:')) {
        emailData.from = line.substring(5).trim()
      } else if (line.startsWith('To:')) {
        emailData.to = line.substring(3).trim()
      } else if (line.startsWith('Cc:')) {
        emailData.cc = line.substring(3).trim()
      } else if (line.startsWith('Subject:')) {
        emailData.subject = line.substring(8).trim()
      } else if (line.startsWith('Date:')) {
        emailData.date = new Date(line.substring(5).trim())
      } else if (line.trim() === '') {
        isHeaders = false
        bodyStart = true
        continue
      }
    }

    if (bodyStart) {
      if (line.includes('<html') || line.includes('<body')) {
        htmlBody += line + '\n'
      } else if (htmlBody) {
        htmlBody += line + '\n'
      } else {
        textBody += line + '\n'
      }
    }
  }

  if (htmlBody) {
    emailData.htmlBody = htmlBody
  } else if (textBody) {
    emailData.textBody = textBody
  }

  email.value = emailData
}

async function parseMsg(blob: Blob) {
  // .msg文件需要专门的解析库
  // 这里使用简化的解析方法
  alert('MSG文件解析需要专用库，当前使用简化解析')

  const text = await blob.text()
  email.value = {
    from: '解析中...',
    to: '解析中...',
    subject: props.fileName,
    date: new Date(),
    textBody: text.substring(0, 1000) + '...',
    attachments: []
  }
}

function reply() {
  alert('回复功能需要集成邮件发送服务')
}

function forward() {
  alert('转发功能需要集成邮件发送服务')
}

async function downloadEmail() {
  const url = URL.createObjectURL(await fetch(props.fileUrl).then((r) => r.blob()))
  const a = document.createElement('a')
  a.href = url
  a.download = props.fileName
  a.click()
  URL.revokeObjectURL(url)
}

async function downloadAttachment(attachment: EmailAttachment) {
  const url = URL.createObjectURL(attachment.content)
  const a = document.createElement('a')
  a.href = url
  a.download = attachment.name
  a.click()
  URL.revokeObjectURL(url)
}

function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase()
  const iconMap: Record<string, string> = {
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    zip: '📦',
    rar: '📦'
  }
  return iconMap[ext || ''] || '📎'
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(date: Date): string {
  return date.toLocaleString('zh-CN')
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
  loadEmail()
})
</script>

<style scoped>
.email-preview {
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
  margin: 0;
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

.email-container {
  max-width: 900px;
  margin: 0 auto;
}

.email-header {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.email-field {
  display: flex;
  margin-bottom: 10px;
  line-height: 1.6;
}

.email-field label {
  font-weight: 600;
  min-width: 80px;
  color: #555;
}

.email-field .subject {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.email-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.btn {
  padding: 10px 20px;
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

.btn-primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-primary:hover {
  background: #5568d3;
}

.email-body {
  margin-bottom: 30px;
}

.body-frame {
  width: 100%;
  height: 500px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.text-body {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  overflow: auto;
}

.text-body pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.no-body {
  text-align: center;
  padding: 40px;
  color: #999;
}

.attachments {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
}

.attachments h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
  transition: background 0.2s;
}

.attachment-item:hover {
  background: #f0f0f0;
}

.attachment-icon {
  font-size: 24px;
  margin-right: 12px;
}

.attachment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.attachment-name {
  font-weight: 500;
  color: #333;
}

.attachment-size {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.btn-small {
  padding: 6px 12px;
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
</style>
