import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { storage } from '../utils/storage';
import { handleFirestoreError, OperationType } from '../utils/firestore-error';

export interface AIHistoryItem {
  id: string;
  prompt: string;
  response: string;
  timestamp: string;
}

export const aiService = {
  logAIQuery: async (userId: string, prompt: string, response: string): Promise<void> => {
    const historyItem = {
      id: `ai_${Date.now()}`,
      prompt,
      response,
      timestamp: new Date().toISOString()
    };
    if (isFirebaseConfigured && db) {
      const collPath = `users/${userId}/ai_history`;
      try {
        await addDoc(collection(db, collPath), historyItem);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, collPath);
      }
    } else {
      const history = storage.load<AIHistoryItem[]>('lumo_ai_history', []);
      history.unshift(historyItem);
      storage.save('lumo_ai_history', history);
    }
  },

  generateImage: async (prompt: string): Promise<{ imageUrl: string }> => {
    const res = await fetch('/api/ai/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error('Failed to generate image via Express Backend');
    return res.json();
  },

  analyzeImage: async (imageBase64: string, prompt?: string): Promise<{ analysis: string }> => {
    const res = await fetch('/api/ai/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64, prompt: prompt || 'Analyze this image' }),
    });
    if (!res.ok) throw new Error('Failed to analyze image via Express Backend');
    return res.json();
  },

  voiceChat: async (text: string): Promise<{ audioUrl: string }> => {
    const res = await fetch('/api/ai/voice-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('Failed to synthesize voice via Express Backend');
    return res.json();
  }
};
