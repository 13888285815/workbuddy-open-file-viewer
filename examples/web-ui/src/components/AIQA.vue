<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { MessageCircleIcon, SendIcon, LoaderIcon, UserIcon, BotIcon, XIcon, TrashIcon } from "lucide-vue-next";
import type { AIPanelFile } from "./AIPanel.vue";

const props = defineProps<{
  file: AIPanelFile;
}>();

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
}

const question = ref("");
const messages = ref<Message[]>([]);
const isLoading = ref(false);
const messagesContainer = ref<HTMLDivElement | null>(null);
const documentContent = ref("");

const suggestedQuestions = [
  "这篇文档的主要内容是什么？",
  "文档中有哪些关键信息？",
  "请总结核心观点",
  "有哪些重要的数据或结论？"
];

const getAnswer = async (questionText: string) => {
  if (!questionText.trim()) return;

  const userMsg: Message = {
    id: `user-${Date.now()}`,
    role: "user",
    content: questionText,
    timestamp: new Date()
  };
  messages.value.push(userMsg);
  question.value = "";
  isLoading.value = true;

  await nextTick();
  scrollToBottom();

  // Simulate AI thinking
  await new Promise((r) => setTimeout(r, 1200));

  let answer = "";
  const q = questionText.toLowerCase();

  if (q.includes("主要内容") || q.includes("主题")) {
    answer = `「${props.file.name}」的主要内容包括：

1. **概述**：文档介绍了相关背景和基本概念
2. **核心内容**：详细说明了主要议题和关键点
3. **结论**：总结了相关建议和行动计划

建议阅读完整文档获取详细信息。`;
  } else if (q.includes("关键") || q.includes("重点")) {
    answer = `根据文档分析，关键信息如下：

• 第一个要点：文档中首先强调了核心概念的重要性

• 第二个要点：其次详细阐述了具体实施方法

• 第三个要点：最后提出了优化建议

• 第四个要点：总结了对未来发展的展望`;
  } else if (q.includes("总结") || q.includes("概括")) {
    answer = `📋 文档总结：

这是一份关于「${props.file.name}」的文档，整体结构清晰，内容翔实。文档采用了总分总的结构，从背景介绍到详细分析，最后给出了建议和结论。建议仔细阅读以获取完整信息。`;
  } else if (q.includes("数据") || q.includes("结论")) {
    answer = `文档中包含以下数据和结论：

📊 数据方面：涉及多个统计指标和量化信息
📝 结论方面：基于数据分析给出了若干结论性观点
💡 建议方面：提出了可供参考的行动建议

详细数据请查阅文档具体章节。`;
  } else {
    answer = `关于您的问题"${questionText}"：

根据文档内容分析，这部分涉及文档的核心部分。详细的解答需要参考文档具体章节。

💡 提示：您可以尝试以下问法：
• "文档的主要内容是什么？"
• "有哪些关键信息？"
• "请总结核心观点"`;
  }

  const assistantMsg: Message = {
    id: `asst-${Date.now()}`,
    role: "assistant",
    content: answer,
    timestamp: new Date(),
    sources: ["来源：当前文档"]
  };

  messages.value.push(assistantMsg);
  isLoading.value = false;
  await nextTick();
  scrollToBottom();
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendQuestion = () => {
  getAnswer(question.value);
};

const askSuggested = (q: string) => {
  getAnswer(q);
};

const clearHistory = () => {
  messages.value = [];
};

watch(
  () => props.file,
  () => {
    messages.value = [];
    documentContent.value = "";
  }
);
</script>

<template>
  <div class="ai-qa">
    <!-- Header -->
    <div class="qa-header">
      <div class="qa-title">
        <MessageCircleIcon :size="16" />
        <span>智能问答</span>
      </div>
      <button v-if="messages.length > 0" class="qa-clear" @click="clearHistory" title="清空历史">
        <TrashIcon :size="14" />
      </button>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="qa-messages">
      <!-- Welcome / Empty state -->
      <div v-if="messages.length === 0" class="qa-welcome">
        <div class="qa-welcome-icon">
          <MessageCircleIcon :size="28" />
        </div>
        <p class="qa-welcome-title">基于文档的智能问答</p>
        <p class="qa-welcome-desc">AI 将根据当前文档内容回答您的问题</p>

        <!-- Suggested questions -->
        <div class="qa-suggested">
          <p class="qa-suggested-label">试试这样问</p>
          <div class="qa-suggested-list">
            <button
              v-for="sq in suggestedQuestions"
              :key="sq"
              class="qa-suggested-btn"
              @click="askSuggested(sq)"
            >
              {{ sq }}
            </button>
          </div>
        </div>
      </div>

      <!-- Chat messages -->
      <div v-else class="qa-chat">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['qa-message', msg.role]"
        >
          <div class="qa-message-avatar">
            <UserIcon v-if="msg.role === 'user'" :size="14" />
            <BotIcon v-else :size="14" />
          </div>
          <div class="qa-message-body">
            <div class="qa-message-content">{{ msg.content }}</div>
            <div v-if="msg.sources" class="qa-message-sources">
              <span v-for="src in msg.sources" :key="src" class="qa-source-tag">{{ src }}</span>
            </div>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="qa-message assistant loading">
          <div class="qa-message-avatar">
            <BotIcon :size="14" />
          </div>
          <div class="qa-message-body">
            <div class="qa-message-content qa-loading-content">
              <LoaderIcon :size="14" class="spin" />
              <span>正在分析文档...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="qa-input-area">
      <input
        v-model="question"
        type="text"
        class="qa-input"
        placeholder="输入问题，按回车发送..."
        :disabled="isLoading"
        @keyup.enter="sendQuestion"
      />
      <button
        class="qa-send"
        :disabled="!question.trim() || isLoading"
        @click="sendQuestion"
      >
        <SendIcon :size="16" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.ai-qa {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.qa-header {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.qa-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.qa-clear {
  width: 26px;
  height: 26px;
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

.qa-clear:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

/* Messages container */
.qa-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 0;
}

/* Welcome */
.qa-welcome {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.qa-welcome-icon {
  width: 56px;
  height: 56px;
  background: var(--selected-bg);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  margin-bottom: 4px;
}

.qa-welcome-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.qa-welcome-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 8px;
}

/* Suggested */
.qa-suggested {
  width: 100%;
  text-align: left;
}

.qa-suggested-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.qa-suggested-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.qa-suggested-btn {
  padding: 8px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  width: 100%;
}

.qa-suggested-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--selected-bg);
}

/* Chat */
.qa-chat {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 12px;
}

.qa-message {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.qa-message.user {
  flex-direction: row-reverse;
}

.qa-message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user .qa-message-avatar {
  background: var(--primary);
  color: white;
}

.assistant .qa-message-avatar {
  background: var(--selected-bg);
  color: var(--primary);
}

.qa-message-body {
  max-width: calc(100% - 44px);
}

.qa-message-content {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.user .qa-message-content {
  background: var(--primary);
  color: white;
  border-bottom-right-radius: 4px;
}

.assistant .qa-message-content {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-bottom-left-radius: 4px;
}

.qa-loading-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
}

.qa-loading-content svg {
  color: var(--primary);
}

/* Sources */
.qa-message-sources {
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.qa-source-tag {
  padding: 2px 8px;
  background: var(--selected-bg);
  border-radius: 10px;
  font-size: 10px;
  color: var(--primary);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* Input area */
.qa-input-area {
  padding: 10px 12px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
  background: var(--bg-primary);
}

.qa-input {
  flex: 1;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--bg-secondary);
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  transition: all 0.15s;
}

.qa-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.qa-input::placeholder {
  color: var(--text-muted);
}

.qa-input:disabled {
  opacity: 0.5;
}

.qa-send {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.qa-send:hover:not(:disabled) {
  background: var(--primary-hover);
}

.qa-send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Spin */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
