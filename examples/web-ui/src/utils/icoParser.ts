/**
 * ICO (Windows icon) format parser
 * Supports reading ICO files and extracting PNG images
 */

export interface IcoImage {
  width: number;
  height: number;
  size: number;
  data: ArrayBuffer;
}

export async function parseIco(file: ArrayBuffer): Promise<IcoImage[]> {
  const view = new DataView(file);
  
  // Check ICO signature
  const reserved = view.getUint16(0, true);
  const type = view.getUint16(2, true);
  if (reserved !== 0 || type !== 1) {
    throw new Error("Not a valid ICO file");
  }

  const count = view.getUint16(4, true);
  const images: IcoImage[] = [];

  for (let i = 0; i < count; i++) {
    const offset = 6 + i * 16;
    const width = view.getUint8(offset) || 256;
    const height = view.getUint8(offset + 1) || 256;
    const size = view.getUint32(offset + 8, true);
    const dataOffset = view.getUint32(offset + 12, true);

    const data = file.slice(dataOffset, dataOffset + size);
    
    // Check if it's a PNG (starts with 0x89504e47)
    const isPng = new Uint8Array(data)[0] === 0x89;
    
    images.push({
      width,
      height,
      size,
      data: data,
    });
  }

  return images;
}

export async function icoToPng(icoData: ArrayBuffer, index = 0): Promise<Blob> {
  const images = await parseIco(icoData);
  if (index >= images.length) {
    throw new Error(`Image index ${index} out of bounds (${images.length} images)`);
  }
  
  return new Blob([images[index].data], { type: "image/png" });
}
