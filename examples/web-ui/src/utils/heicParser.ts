/**
 * HEIC (High Efficiency Image Coding) parser
 * Uses heic2any library or browser native support
 */

export async function canDecodeHeic(): Promise<boolean> {
  // Check if browser supports HEIC via heic2any
  return typeof window !== "undefined" && "heic2any" in window;
}

export async function heicToPng(heicData: ArrayBuffer): Promise<Blob[]> {
  // Try using heic2any library
  if (typeof window !== "undefined" && "heic2any" in window) {
    const heic2any = (window as any).heic2any;
    const result = await heic2any({ 
      blob: new Blob([heicData], { type: "image/heic" }),
    });
    return result.map((item: any) => item.blob);
  }

  // Falback: Use canvas (if browser supports HEIC natively)
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas not supported");
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([heicData], { type: "image/heic" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (pngBlob) => {
          URL.revokeObjectURL(url);
          if (pngBlob) {
            resolve([pngBlob]);
          } else {
            reject(new Error("Failed to convert HEIC to PNG"));
          }
        },
        "image/png",
        1.0
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode HEIC image. Try using heic2any library."));
    };

    img.src = url;
  });
}

export async function renderHeicPreview(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const pngBlobs = await heicToPng(buffer);
    if (pngBlobs.length > 0) {
      return URL.createObjectURL(pngBlobs[0]);
    }
    throw new Error("No converted image");
  } catch (err) {
    console.error("HEIC preview failed:", err);
    throw err;
  }
}
