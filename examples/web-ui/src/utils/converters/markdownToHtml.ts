/**
 * Markdown 转 HTML 转换器
 * 使用简单的正则表达式解析 (无需额外依赖)
 */

import { ConversionOptions } from './types';

/**
 * 简单的 Markdown 转 HTML 转换器
 * 支持常见 Markdown 语法
 */
export class MarkdownToHtmlConverter {
  private markdown: string;
  private html: string;

  constructor(markdown: string) {
    this.markdown = markdown;
    this.html = '';
  }

  /**
   * 转换 Markdown 为 HTML
   */
  convert(): string {
    let result = this.markdown;

    // 转换顺序很重要
    // 先转换代码块 (避免内部语法被其他规则处理)
    result = this.convertCodeBlocks(result);
    
    // 转换标题
    result = this.convertHeadings(result);
    
    // 转换水平线
    result = this.convertHorizontalRules(result);
    
    // 转换粗体和斜体
    result = this.convertBoldAndItalic(result);
    
    // 转换链接和图片
    result = this.convertLinksAndImages(result);
    
    // 转换行内代码
    result = this.convertInlineCode(result);
    
    // 转换列表 (无序和有序)
    result = this.convertLists(result);
    
    // 转换引用块
    result = this.convertBlockquotes(result);
    
    // 转换段落 (最后处理)
    result = this.convertParagraphs(result);

    this.html = result;
    return result;
  }

  /**
   * 转换标题
   */
  private convertHeadings(text: string): string {
    return text.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, content) => {
      const level = hashes.length;
      return `<h${level}>${this.escapeHtml(content.trim())}</h${level}>`;
    });
  }

  /**
   * 转换粗体和斜体
   */
  private convertBoldAndItalic(text: string): string {
    // 粗体+斜体 (***text*** 或 ___text___)
    text = text.replace(/\*{3}(.+?)\*{3}/g, '<strong><em>$1</em></strong>');
    text = text.replace(/_{3}(.+?)_{3}/g, '<strong><em>$1</em></strong>');
    
    // 粗体 (**text** 或 __text__)
    text = text.replace(/\*{2}(.+?)\*{2}/g, '<strong>$1</strong>');
    text = text.replace(/_{2}(.+?)_{2}/g, '<strong>$1</strong>');
    
    // 斜体 (*text* 或 _text_)
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.+?)_/g, '<em>$1</em>');

    return text;
  }

  /**
   * 转换链接和图片
   */
  private convertLinksAndImages(text: string): string {
    // 图片 (![alt](url))
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
    
    // 链接 ([text](url))
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    return text;
  }

  /**
   * 转换代码块
   */
  private convertCodeBlocks(text: string): string {
    // 围栏代码块 (```)
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang ? ` class="language-${lang}"` : '';
      return `<pre><code${language}>${this.escapeHtml(code.trim())}</code></pre>`;
    });

    return text;
  }

  /**
   * 转换行内代码
   */
  private convertInlineCode(text: string): string {
    return text.replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  /**
   * 转换列表
   */
  private convertLists(text: string): string {
    const lines = text.split('\n');
    const result: string[] = [];
    let inUnorderedList = false;
    let inOrderedList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 无序列表 (-, *, +)
      const unorderedMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
      if (unorderedMatch) {
        if (!inUnorderedList) {
          result.push('<ul>');
          inUnorderedList = true;
        }
        if (inOrderedList) {
          result.push('</ol>');
          inOrderedList = false;
        }
        result.push(`  <li>${unorderedMatch[1]}</li>`);
        continue;
      }

      // 有序列表 (1., 2., ...)
      const orderedMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);
      if (orderedMatch) {
        if (!inOrderedList) {
          result.push('<ol>');
          inOrderedList = true;
        }
        if (inUnorderedList) {
          result.push('</ul>');
          inUnorderedList = false;
        }
        result.push(`  <li>${orderedMatch[1]}</li>`);
        continue;
      }

      // 如果不是列表项，关闭之前的列表
      if (inUnorderedList) {
        result.push('</ul>');
        inUnorderedList = false;
      }
      if (inOrderedList) {
        result.push('</ol>');
        inOrderedList = false;
      }

      result.push(line);
    }

    // 关闭末尾的列表
    if (inUnorderedList) {
      result.push('</ul>');
    }
    if (inOrderedList) {
      result.push('</ol>');
    }

    return result.join('\n');
  }

  /**
   * 转换引用块
   */
  private convertBlockquotes(text: string): string {
    return text.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');
  }

  /**
   * 转换水平线
   */
  private convertHorizontalRules(text: string): string {
    return text.replace(/^[-*_]{3,}$/gm, '<hr />');
  }

  /**
   * 转换段落 (简单的处理，将连续的非标签行包装在 <p> 中)
   */
  private convertParagraphs(text: string): string {
    const lines = text.split('\n');
    const result: string[] = [];
    let paragraphLines: string[] = [];

    const flushParagraph = () => {
      if (paragraphLines.length > 0) {
        const content = paragraphLines.join('<br />');
        // 如果内容已经包含块级元素，不包装在 <p> 中
        if (!/^<(h[1-6]|div|pre|ul|ol|blockquote|hr)/.test(content)) {
          result.push(`<p>${content}</p>`);
        } else {
          result.push(content);
        }
        paragraphLines = [];
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();
      
      // 空行表示段落结束
      if (trimmed === '') {
        flushParagraph();
        result.push('');
        continue;
      }

      // 如果行以 HTML 块级元素开头，结束当前段落
      if (/^<(h[1-6]|div|pre|ul|ol|blockquote|hr|p)/.test(trimmed)) {
        flushParagraph();
        result.push(trimmed);
        continue;
      }

      paragraphLines.push(trimmed);
    }

    flushParagraph();

    return result.join('\n');
  }

  /**
   * HTML 转义
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

/**
 * Markdown 文件转 HTML
 * @param file Markdown 文件
 * @param options 转换选项
 * @param onProgress 进度回调
 * @returns HTML Blob
 */
export async function markdownToHtml(
  file: File,
  options: ConversionOptions = {},
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // 读取文件内容
  const text = await file.text();

  if (onProgress) {
    onProgress(20);
  }

  // 转换 Markdown 为 HTML
  const converter = new MarkdownToHtmlConverter(text);
  const htmlBody = converter.convert();

  if (onProgress) {
    onProgress(60);
  }

  // 包装完整的 HTML 文档
  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${file.name.replace(/\.(md|markdown)$/, '')}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: Consolas, Monaco, "Courier New", monospace;
    }
    pre {
      background: #f4f4f4;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 15px;
      color: #666;
      margin: 1em 0;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    hr {
      border: none;
      border-top: 2px solid #ddd;
      margin: 2em 0;
    }
  </style>
</head>
<body>
${htmlBody}
</body>
</html>`;

  if (onProgress) {
    onProgress(100);
  }

  // 创建 Blob
  return new Blob([fullHtml], { type: 'text/html' });
}

/**
 * 检查是否支持 Markdown 转 HTML
 */
export function isMarkdownToHtmlSupported(): boolean {
  return typeof window !== 'undefined';
}
