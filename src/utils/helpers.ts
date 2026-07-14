export const generateId = (prefix = 'id'): string => {
  return `${prefix}_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
};

export const playSynthSound = (frequency: number, type: 'sine' | 'triangle' | 'sawtooth' | 'square' = 'sine', duration = 0.15) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context might be blocked initially
  }
};
