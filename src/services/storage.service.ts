import { storage, isFirebaseConfigured } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/m4a',
  'audio/webm',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg',
  'application/pdf'
]);

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_MEDIA_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export const storageService = {
  uploadFile: async (file: File | string, path: string): Promise<string> => {
    if (isFirebaseConfigured && storage && typeof file !== 'string') {
      // 1. Strict MIME type check - specifically reject SVGs and executables
      const fileType = (file.type || '').toLowerCase();
      if (!fileType || !ALLOWED_MIME_TYPES.has(fileType) || fileType.includes('svg') || fileType.includes('xml')) {
        throw new Error('نوع الملف غير مدعوم أو غير آمن. يسمح فقط بالصور (JPG/PNG/WEBP)، الصوتيات والفيديوهات الآمنة.');
      }

      // 2. Strict file size check
      const isImage = fileType.startsWith('image/');
      const maxAllowed = isImage ? MAX_IMAGE_SIZE_BYTES : MAX_MEDIA_SIZE_BYTES;
      if (file.size > maxAllowed) {
        throw new Error(`حجم الملف كبير جداً. الحد الأقصى المسموح هو ${maxAllowed / (1024 * 1024)} ميغابايت.`);
      }

      try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      } catch (err: any) {
        console.error('Firebase storage upload failed:', err);
        throw new Error(err.message || 'فشل تحميل الملف.');
      }
    } else {
      // Return local url or base64 dataurl simulator
      if (typeof file === 'string') return file;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    }
  }
};
