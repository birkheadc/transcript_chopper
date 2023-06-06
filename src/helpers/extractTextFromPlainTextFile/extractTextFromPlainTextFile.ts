export default function extractTextFromPlainTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        resolve(event.target?.result as string);
      } catch {
        reject();
      }
    }
    try {
      reader.readAsText(file);
    } catch {
      reject();
    }
  });
}