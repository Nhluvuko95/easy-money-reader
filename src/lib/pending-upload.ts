let pending: File | null = null;

export function setPendingUpload(file: File) {
  pending = file;
}

export function takePendingUpload(): File | null {
  const f = pending;
  pending = null;
  return f;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const s = String(reader.result);
      resolve(s.slice(s.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
