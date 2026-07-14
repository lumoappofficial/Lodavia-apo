import { storage, isFirebaseConfigured } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const storageService = {
  uploadFile: async (file: File | string, path: string): Promise<string> => {
    if (isFirebaseConfigured && storage && typeof file !== 'string') {
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
