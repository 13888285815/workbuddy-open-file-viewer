/**
 * 图片格式转换器
 * 使用 Canvas API 进行格式转换
 */

import { ConversionOptions } from './types';

/**
 * 图片转图片 (格式转换)
 * @param file 源图片文件
 * @param targetFormat 目标格式
 * @param options 转换选项
 * @param onProgress 进度回调
 * @returns 转换后的图片 Blob
 */
export async function imageToImage(
  file: File,
  targetFormat: 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif',
  options: ConversionOptions = {},
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const { quality = 0.92 } = options;

  // 创建图片元素
  const img = new Image();
  const imageUrl = URL.createObjectURL(file);

  try {
    // 加载图片
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = imageUrl;
    });

    if (onProgress) {
      onProgress(30);
    }

    // 创建 canvas
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('无法创建 Canvas 2D 上下文');
    }

    // 绘制图片到 canvas
    context.drawImage(img, 0, 0);

    if (onProgress) {
      onProgress(60);
    }

    // 转换为目标格式
    const mimeType = `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`;
    
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas 转 Blob 失败'));
          }
        },
        mimeType,
        quality
      );
    });

    if (onProgress) {
      onProgress(100);
    }

    return blob;
  } finally {
    // 清理 URL
    URL.revokeObjectURL(imageUrl);
  }
}

/**
 * 多张图片合并为 PDF
 * @param files 图片文件数组
 * @param options 转换选项
 * @param onProgress 进度回调
 * @returns PDF Blob
 */
export async function imagesToPdf(
  files: File[],
  options: ConversionOptions = {},
  onProgress?: (progress: number, currentFile: number, totalFiles: number) => void
): Promise<Blob> {
  // 动态导入 jsPDF
  const { jsPDF } = await import('jspdf');
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4'
  });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // 创建图片元素
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);

    try {
      // 加载图片
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`图片加载失败: ${file.name}`));
        img.src = imageUrl;
      });

      // 如果不是第一页，添加新页
      if (i > 0) {
        pdf.addPage();
      }

      // 计算图片在 PDF 中的尺寸 (适应 A4)
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgRatio = img.width / img.height;
      const pdfRatio = pdfWidth / pdfHeight;

      let finalWidth, finalHeight;
      
      if (imgRatio > pdfRatio) {
        // 图片更宽，以宽度为基准
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / imgRatio;
      } else {
        // 图片更高，以高度为基准
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * imgRatio;
      }

      // 居中放置
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      // 添加图片到 PDF
      const imgData = await imageToBase64(file);
      pdf.addImage(
        imgData,
        file.type.includes('png') ? 'PNG' : 'JPEG',
        x,
        y,
        finalWidth,
        finalHeight
      );

      // 报告进度
      if (onProgress) {
        const progress = ((i + 1) / files.length) * 100;
        onProgress(progress, i + 1, files.length);
      }
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }

  // 生成 PDF Blob
  const pdfBlob = pdf.output('blob');
  return pdfBlob;
}

/**
 * 图片转 Base64
 */
function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // 移除 data:image/xxx;base64, 前缀
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 调整图片尺寸
 */
export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  keepAspectRatio: boolean = true
): Promise<Blob> {
  const img = new Image();
  const imageUrl = URL.createObjectURL(file);

  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = imageUrl;
    });

    let newWidth = img.width;
    let newHeight = img.height;

    if (keepAspectRatio) {
      // 保持宽高比
      if (newWidth > maxWidth) {
        newHeight = (maxWidth / newWidth) * newHeight;
        newWidth = maxWidth;
      }
      if (newHeight > maxHeight) {
        newWidth = (maxHeight / newHeight) * newWidth;
        newHeight = maxHeight;
      }
    } else {
      newWidth = maxWidth;
      newHeight = maxHeight;
    }

    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('无法创建 Canvas 2D 上下文');
    }

    context.drawImage(img, 0, 0, newWidth, newHeight);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas 转 Blob 失败'));
          }
        },
        file.type,
        0.92
      );
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

/**
 * 检查是否支持图片格式转换
 */
export function isImageConversionSupported(): boolean {
  return typeof window !== 'undefined' && 
         typeof document !== 'undefined' &&
         'HTMLCanvasElement' in window &&
         'FileReader' in window;
}
