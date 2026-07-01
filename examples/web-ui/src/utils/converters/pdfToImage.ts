/**
 * PDF 转图片转换器
 * 使用 pdf.js + Canvas API
 */

import { SourceFormat, TargetFormat, ConversionOptions } from './types';

// PDF.js 类型声明
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

/**
 * 初始化 PDF.js
 */
async function initPdfJs(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js 只能在浏览器环境中使用');
  }

  // 如果已经加载，直接返回
  if (window.pdfjsLib) {
    return window.pdfjsLib;
  }

  // 动态加载 PDF.js
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.js';
  document.head.appendChild(script);

  await new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
  });

  // 设置 worker URL
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js';

  return window.pdfjsLib;
}

/**
 * PDF 转图片
 * @param file PDF 文件
 * @param targetFormat 目标格式 (jpg, png, webp)
 * @param options 转换选项
 * @param onProgress 进度回调
 * @returns 转换后的图片 Blob 数组 (每页一个)
 */
export async function pdfToImage(
  file: File,
  targetFormat: 'jpg' | 'jpeg' | 'png' | 'webp',
  options: ConversionOptions = {},
  onProgress?: (progress: number, page: number, totalPages: number) => void
): Promise<Blob[]> {
  const pdfjsLib = await initPdfJs();
  
  const {
    quality = 0.92,
    scale = 2.0,  // 高分辨率
    pageRange
  } = options;

  // 读取 PDF 文件
  const arrayBuffer = await file.arrayBuffer();
  
  // 加载 PDF
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  // 确定要转换的页码范围
  const startPage = pageRange?.start || 1;
  const endPage = pageRange?.end || totalPages;
  const pagesToConvert = [];

  for (let i = startPage; i <= endPage && i <= totalPages; i++) {
    pagesToConvert.push(i);
  }

  const results: Blob[] = [];

  // 逐页转换
  for (let i = 0; i < pagesToConvert.length; i++) {
    const pageNum = pagesToConvert[i];
    
    // 获取页面
    const page = await pdf.getPage(pageNum);
    
    // 计算缩放比例
    const viewport = page.getViewport({ scale });

    // 创建 canvas
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('无法创建 Canvas 2D 上下文');
    }

    // 渲染 PDF 页面到 canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    // 将 canvas 转换为 Blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas 转 Blob 失败'));
          }
        },
        `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`,
        quality
      );
    });

    results.push(blob);

    // 报告进度
    if (onProgress) {
      const progress = ((i + 1) / pagesToConvert.length) * 100;
      onProgress(progress, pageNum, totalPages);
    }
  }

  return results;
}

/**
 * PDF 转单张图片 (合并所有页面)
 */
export async function pdfToSingleImage(
  file: File,
  targetFormat: 'jpg' | 'jpeg' | 'png' | 'webp',
  options: ConversionOptions = {},
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const pdfjsLib = await initPdfJs();
  
  const { quality = 0.92, scale = 2.0 } = options;

  // 读取 PDF 文件
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  // 先获取所有页面的尺寸
  const pageViewports = [];
  let totalHeight = 0;
  let maxWidth = 0;

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    pageViewports.push(viewport);
    totalHeight += viewport.height;
    maxWidth = Math.max(maxWidth, viewport.width);
  }

  // 创建合并后的 canvas
  const canvas = document.createElement('canvas');
  canvas.width = maxWidth;
  canvas.height = totalHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('无法创建 Canvas 2D 上下文');
  }

  // 逐页绘制
  let currentY = 0;
  for (let i = 0; i < totalPages; i++) {
    const page = await pdf.getPage(i + 1);
    const viewport = pageViewports[i];

    // 创建临时 canvas 渲染页面
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = viewport.width;
    tempCanvas.height = viewport.height;

    const tempContext = tempCanvas.getContext('2d');
    if (!tempContext) {
      throw new Error('无法创建临时 Canvas');
    }

    await page.render({
      canvasContext: tempContext,
      viewport: viewport
    }).promise;

    // 绘制到主 canvas
    context.drawImage(tempCanvas, 0, currentY);
    currentY += viewport.height;

    // 报告进度
    if (onProgress) {
      onProgress(((i + 1) / totalPages) * 100);
    }
  }

  // 转换为 Blob
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas 转 Blob 失败'));
        }
      },
      `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`,
      quality
    );
  });
}

/**
 * 检查是否支持 PDF 转图片
 */
export function isPdfToImageSupported(): boolean {
  return typeof window !== 'undefined' && 
         typeof document !== 'undefined' &&
         'HTMLCanvasElement' in window;
}
