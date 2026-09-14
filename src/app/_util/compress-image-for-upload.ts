export interface CompressImageForUploadOptions {
  maxLongEdgePx: number;
  quality: number;
  maxOutputBytes: number;
}

function supportsWebpEncoding(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').startsWith('data:image/webp');
}

function scaleToMaxLongEdge(
  width: number,
  height: number,
  maxLongEdgePx: number
): {
  width: number;
  height: number;
} {
  const longEdge = Math.max(width, height);
  if (longEdge <= maxLongEdgePx) {
    return { width, height };
  }
  const scale = maxLongEdgePx / longEdge;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

function replaceFileExtension(fileName: string, extension: string): string {
  const base = fileName.replace(/\.[^.]+$/, '').trim() || 'image';
  return `${base}.${extension}`;
}

export async function compressImageForUpload(
  file: File,
  options: CompressImageForUploadOptions
): Promise<File> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  try {
    const { width, height } = scaleToMaxLongEdge(
      bitmap.width,
      bitmap.height,
      options.maxLongEdgePx
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not process image');
    }

    context.drawImage(bitmap, 0, 0, width, height);

    const useWebp = supportsWebpEncoding();
    const mimeType = useWebp ? 'image/webp' : 'image/jpeg';
    const extension = useWebp ? 'webp' : 'jpg';

    let blob = await canvasToBlob(canvas, mimeType, options.quality);
    if (!blob) {
      throw new Error('Could not compress image');
    }

    if (blob.size > options.maxOutputBytes && mimeType === 'image/webp') {
      blob = (await canvasToBlob(canvas, 'image/jpeg', options.quality)) ?? blob;
      if (blob.size > options.maxOutputBytes) {
        throw new Error('Image is still too large after compression');
      }
      return new File([blob], replaceFileExtension(file.name, 'jpg'), {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
    }

    if (blob.size > options.maxOutputBytes) {
      throw new Error('Image is still too large after compression');
    }

    return new File([blob], replaceFileExtension(file.name, extension), {
      type: mimeType,
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close();
  }
}
