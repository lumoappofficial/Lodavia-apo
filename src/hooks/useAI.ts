import { useApp } from '../contexts/AppContext';
import { aiService } from '../services/ai.service';

export function useAI() {
  const {
    aiGenerating,
    setAiGenerating,
    aiSuggestionText,
    setAiSuggestionText
  } = useApp();

  return {
    aiGenerating,
    setAiGenerating,
    aiSuggestionText,
    setAiSuggestionText,
    logAIQuery: aiService.logAIQuery,
    generateImage: aiService.generateImage,
    analyzeImage: aiService.analyzeImage,
    voiceChat: aiService.voiceChat
  };
}
