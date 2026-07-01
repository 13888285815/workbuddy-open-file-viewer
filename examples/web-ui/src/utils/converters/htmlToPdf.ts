/**
 * HTML 转 PDF 转换器
 * 使用 html2canvas + jsPDF
 */

import { ConversionOptions } from './types';

/**
 * HTML 文件/内容 转 PDF
 * @param htmlContent HTML 内容 (字符串) 或 File 对象
 * @param options 转换选项
 * @param onProgress 进度回调
 * @returns PDF Blob
 */
export async function htmlToPdf(
  htmlContent: string | File,
  options: ConversionOptions = {},
  onProgress?: (progress: number, stage: string) => void
): Promise<Blob> {
  // 动态导入依赖
  const [jsPDFModule, html2canvasModule] = await Promise.all([
    import('jspdf'),
    import('html2canvas')
  ]);

  const { jsPDF } = jsPDFModule;
  const html2canvas = html2canvasModule.default;

  if (onProgress) {
    onProgress(10, '准备中...');
  }

  // 获取 HTML 内容
  let htmlString: string;
  if (typeof htmlContent === 'string') {
    htmlString = htmlContent;
  } else {
    htmlString = await htmlContent.text();
  }

  if (onProgress) {
    onProgress(20, '解析 HTML...');
  }

  // 创建临时容器
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '800px';  // 固定宽度
  container.innerHTML = htmlString;

  document.body.appendChild(container);

  try {
    if (onProgress) {
      onProgress(30, '渲染页面...');
    }

    // 使用 html2canvas 渲染
    const canvas = await html2canvas(container, {
      scale: options.scale || 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    if (onProgress) {
      onProgress(70, '生成 PDF...');
    }

    // 创建 PDF
    const pdfOptions = options.pdfOptions || {};
    const orientation = pdfOptions.orientation || 'portrait';
    const pageSize = pdfOptions.pageSize || 'a4';

    const pdf = new jsPDF({
      orientation: orientation === 'landscape' ? 'l' : 'p',
      unit: 'mm',
      format: pageSize
    });

    // 计算图片在 PDF 中的尺寸
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = pdfOptions.margin || 10;
    
    const availableWidth = pdfWidth - 2 * margin;
    const availableHeight = pdfHeight - 2 * margin;

    // Canvas 尺寸
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // 计算缩放比例
    const widthRatio = availableWidth / (canvasWidth * 0.264583);  // px to mm
    const heightRatio = availableHeight / (canvasHeight * 0.264583);
    const ratio = Math.min(widthRatio, heightRatio);

    const finalWidth = canvasWidth * 0.264583 * ratio;
    const finalHeight = canvasHeight * 0.264583 * ratio;

    // 如果内容超过一页，需要分页
    const pageCanvas = document.createElement('canvas');
    const pageCtx = pageCanvas.getContext('2d');
    
    if (!pageCtx) {
      throw new Error('无法创建 Canvas 上下文');
    }

    const pageHeight = Math.floor(
      (availableHeight / finalHeight) * canvasHeight
    );

    let position = 0;
    let pageNumber = 0;

    while (position < canvasHeight) {
      if (pageNumber > 0) {
        pdf.addPage();
      }

      // 截取当前页的内容
      const remainingHeight = canvasHeight - position;
      const currentPageHeight = Math.min(pageHeight, remainingHeight);

      pageCanvas.width = canvasWidth;
      pageCanvas.height = currentPageHeight;

      pageCtx.drawImage(
        canvas,
        0, position, canvasWidth, currentPageHeight,
        0, 0, canvasWidth, currentPageHeight
      );

      // 添加图片到 PDF
      const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(
        imgData,
        'JPEG',
        margin,
        margin,
        finalWidth,
        finalHeight > availableHeight ? availableHeight : finalHeight
      );

      position += currentPageHeight;
      pageNumber++;

      if (onProgress) {
        const progress = 70 + (position / canvasHeight) * 20;
        onProgress(Math.min(progress, 90), `生成第 ${pageNumber} 页...`);
      }
    }

    if (onProgress) {
      onProgress(100, '完成');
    }

    // 返回 PDF Blob
    return pdf.output('blob');
  } finally {
    // 清理临时容器
    document.body.removeChild(container);
  }
}

/**
 * 将现有 DOM 元素转为 PDF
 * @param element DOM 元素
 * @param options 转换选项
 * @param onProgress 进度回调
 * @returns PDF Blob
 */
export async function elementToPdf(
  element: HTMLElement,
  options: ConversionOptions = {},
  onProgress?: (progress: number, stage: string) => void
): Promise<Blob> {
  const html2canvasModule = await import('html2canvas');
  const jsPDFModule = await import('jspdf');

  const html2canvas = html2canvasModule.default;
  const { jsPDF } = jsPDFModule;

  if (onProgress) {
    onProgress(20, '渲染内容...');
  }

  // 渲染元素为 canvas
  const canvas = await html2canvas(element, {
    scale: options.scale || 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });

  if (onProgress) {
    onProgress(70, '生成 PDF...');
  }

  // 创建 PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;

  const availableWidth = pdfWidth - 2 * margin;
  const imgWidth = canvas.width * 0.264583;  // px to mm
  const imgHeight = canvas.height * 0.264583;

  const ratio = Math.min(availableWidth / imgWidth, 1);
  const finalWidth = imgWidth * ratio;
  const finalHeight = imgHeight * ratio;

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  pdf.addImage(imgData, 'JPEG', margin, margin, finalWidth, finalHeight);

  if (onProgress) {
    onProgress(100, '完成');
  }

  return pdf.output('blob');
}

/**
 * 检查是否支持 HTML 转 PDF
 */
export function isHtmlToPdfSupported(): boolean {
  return typeof window !== 'undefined' && 
         'HTMLCanvasElement' in window;
}
