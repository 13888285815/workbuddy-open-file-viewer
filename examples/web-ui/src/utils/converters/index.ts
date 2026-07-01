/**
 * 文件转换工具主入口
 */

// 类型导出
export * from './types';

// PDF 转图片
export {
  pdfToImage,
  pdfToSingleImage,
  isPdfToImageSupported
} from './pdfToImage';

// 图片格式转换
export {
  imageToImage,
  imagesToPdf,
  resizeImage,
  isImageConversionSupported
} from './imageConverter';

// Markdown 转 HTML
export {
  MarkdownToHtmlConverter,
  markdownToHtml,
  isMarkdownToHtmlSupported
} from './markdownToHtml';

// HTML 转 PDF
export {
  htmlToPdf,
  elementToPdf,
  isHtmlToPdfSupported
} from './htmlToPdf';

/**
 * 获取支持的所有转换路径
 */
import { ConversionRoute, SourceFormat, TargetFormat } from './types';

export function getSupportedConversions(): ConversionRoute[] {
  return [
    // PDF 转换
    {
      source: 'pdf',
      target: 'jpg',
      label: 'PDF → JPG',
      description: '将 PDF 文件的每一页转换为 JPG 图片'
    },
    {
      source: 'pdf',
      target: 'png',
      label: 'PDF → PNG',
      description: '将 PDF 文件的每一页转换为 PNG 图片'
    },
    {
      source: 'pdf',
      target: 'webp',
      label: 'PDF → WebP',
      description: '将 PDF 文件的每一页转换为 WebP 图片'
    },
    {
      source: 'pdf',
      target: 'txt',
      label: 'PDF → 文本',
      description: '提取 PDF 文件中的文本内容'
    },

    // 图片格式互转
    {
      source: 'jpg',
      target: 'png',
      label: 'JPG → PNG',
      description: '将 JPG 图片转换为 PNG 格式'
    },
    {
      source: 'jpg',
      target: 'webp',
      label: 'JPG → WebP',
      description: '将 JPG 图片转换为 WebP 格式'
    },
    {
      source: 'png',
      target: 'jpg',
      label: 'PNG → JPG',
      description: '将 PNG 图片转换为 JPG 格式'
    },
    {
      source: 'png',
      target: 'webp',
      label: 'PNG → WebP',
      description: '将 PNG 图片转换为 WebP 格式'
    },
    {
      source: 'webp',
      target: 'jpg',
      label: 'WebP → JPG',
      description: '将 WebP 图片转换为 JPG 格式'
    },
    {
      source: 'webp',
      target: 'png',
      label: 'WebP → PNG',
      description: '将 WebP 图片转换为 PNG 格式'
    },

    // 图片转 PDF
    {
      source: 'jpg',
      target: 'pdf',
      label: 'JPG → PDF',
      description: '将 JPG 图片转换为 PDF 文件'
    },
    {
      source: 'png',
      target: 'pdf',
      label: 'PNG → PDF',
      description: '将 PNG 图片转换为 PDF 文件'
    },

    // Markdown 转换
    {
      source: 'md',
      target: 'html',
      label: 'Markdown → HTML',
      description: '将 Markdown 文档转换为 HTML 网页'
    },
    {
      source: 'markdown',
      target: 'html',
      label: 'Markdown → HTML',
      description: '将 Markdown 文档转换为 HTML 网页'
    },

    // HTML 转换
    {
      source: 'html',
      target: 'pdf',
      label: 'HTML → PDF',
      description: '将 HTML 网页转换为 PDF 文件',
      requiresLibrary: 'html2canvas + jsPDF'
    },
    {
      source: 'htm',
      target: 'pdf',
      label: 'HTML → PDF',
      description: '将 HTML 网页转换为 PDF 文件',
      requiresLibrary: 'html2canvas + jsPDF'
    },

    // 文本转换
    {
      source: 'txt',
      target: 'md',
      label: '文本 → Markdown',
      description: '将纯文本转换为 Markdown 格式'
    },
    {
      source: 'txt',
      target: 'html',
      label: '文本 → HTML',
      description: '将纯文本转换为 HTML 格式'
    }
  ];
}

/**
 * 检查转换是否支持
 */
export function isConversionSupported(
  sourceFormat: SourceFormat,
  targetFormat: TargetFormat
): boolean {
  const conversions = getSupportedConversions();
  return conversions.some(
    c => c.source === sourceFormat && c.target === targetFormat
  );
}

/**
 * 获取文件格式
 */
export function getFileFormat(filename: string): SourceFormat | null {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const formatMap: Record<string, SourceFormat> = {
    'pdf': 'pdf',
    'jpg': 'jpg',
    'jpeg': 'jpeg',
    'png': 'png',
    'webp': 'webp',
    'gif': 'gif',
    'doc': 'doc',
    'docx': 'docx',
    'xls': 'xls',
    'xlsx': 'xlsx',
    'csv': 'csv',
    'md': 'md',
    'markdown': 'markdown',
    'html': 'html',
    'htm': 'htm',
    'txt': 'txt'
  };

  return formatMap[extension || ''] || null;
}

/**
 * 获取格式显示名称
 */
export function getFormatDisplayName(format: SourceFormat | TargetFormat): string {
  const nameMap: Record<string, string> = {
    'pdf': 'PDF',
    'jpg': 'JPG',
    'jpeg': 'JPEG',
    'png': 'PNG',
    'webp': 'WebP',
    'gif': 'GIF',
    'doc': 'Word (DOC)',
    'docx': 'Word (DOCX)',
    'xls': 'Excel (XLS)',
    'xlsx': 'Excel (XLSX)',
    'csv': 'CSV',
    'md': 'Markdown',
    'markdown': 'Markdown',
    'html': 'HTML',
    'htm': 'HTML',
    'txt': '纯文本'
  };

  return nameMap[format] || format.toUpperCase();
}
