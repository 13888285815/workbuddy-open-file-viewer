/**
 * 文件转换类型定义
 */

// 支持的文件格式
export type SourceFormat = 
  | 'pdf'
  | 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif'
  | 'doc' | 'docx'
  | 'xls' | 'xlsx' | 'csv'
  | 'md' | 'markdown'
  | 'html' | 'htm'
  | 'txt';

export type TargetFormat = 
  | 'pdf'
  | 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif'
  | 'txt'
  | 'csv'
  | 'html'
  | 'md' | 'markdown';

// 转换任务状态
export type ConversionStatus = 
  | 'pending'     // 等待中
  | 'processing'  // 处理中
  | 'completed'   // 已完成
  | 'failed';     // 失败

// 转换任务
export interface ConversionTask {
  id: string;
  sourceFile: File;
  sourceFormat: SourceFormat;
  targetFormat: TargetFormat;
  status: ConversionStatus;
  progress: number;  // 0-100
  result?: Blob;
  resultUrl?: string;
  error?: string;
  options?: ConversionOptions;
  createdAt: Date;
}

// 转换选项
export interface ConversionOptions {
  // 图片质量 (0-1)
  quality?: number;
  // 图片分辨率/缩放
  scale?: number;
  // PDF 页码范围
  pageRange?: {
    start: number;
    end: number;
  };
  // 是否批量转换
  batch?: boolean;
  // HTML to PDF 选项
  pdfOptions?: {
    margin?: number;
    pageSize?: 'a4' | 'letter' | 'legal';
    orientation?: 'portrait' | 'landscape';
  };
}

// 支持的转换映射
export interface ConversionRoute {
  source: SourceFormat;
  target: TargetFormat;
  label: string;
  description: string;
  requiresLibrary?: string;
}

// 转换历史记录
export interface ConversionHistory {
  id: string;
  sourceName: string;
  sourceFormat: SourceFormat;
  targetFormat: TargetFormat;
  completedAt: Date;
  fileSize: number;
  downloadUrl: string;
}
