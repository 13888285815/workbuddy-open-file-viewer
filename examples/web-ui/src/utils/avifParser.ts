/**
 * AVIF (AV1 Image File Format) parser
 * Uses libavif or browser native support
 */

export async function canDecodeAvif(): Promise<boolean> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  // Test if browser supports AVIF
  const avifTest = new Image();
  return new Promise((resolve) => {
    avifTest.onload = () => resolve(true);
    avifTest.onerror = () => resolve(false);
    avifTest.src = "data:image/avif;base64,AAAAFGZ0eXBhdmlmAAAAAGF2aWZtcDNlAAAAAEl0aXA";
  });
}

export async function avifToPng(avifData: ArrayBuffer): Promise<Blob> {
  // Check browser support
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas not supported");
  }

  // Decode AVIF using Image() element
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([avifData], { type: "image/avif" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (pngBlob) => {
          URL.revokeObjectURL(url);
          if (pngBlob) {
            resolve(pngBlob);
          } else {
            reject(new Error("Failed to convert AVIF to PNG"));
          }
        },
        "image/png",
        1.0
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode AVIF image"));
    };

    img.src = url;
  });
}
