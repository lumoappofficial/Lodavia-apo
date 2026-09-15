/**
 * Audio Synthesizer & Haptic Utility for premium feedback.
 */

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light'): void {
  try {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(35);
          break;
        case 'success':
          navigator.vibrate([15, 50, 20]);
          break;
        case 'error':
          navigator.vibrate([30, 40, 30, 40, 30]);
          break;
      }
    }
  } catch (e) {
    // Ignore if unsupported
  }
}

export function playSynthSound(
  frequency: number,
  type: 'sine' | 'triangle' | 'sawtooth' | 'square' = 'sine',
  duration = 0.12,
  volume = 0.08
): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioCtx = new AudioContextClass();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);

    triggerHaptic('light');
  } catch (e) {
    // Audio context might be blocked initially by user interaction policy
  }
}

export function playPresetSound(preset: 'click' | 'nav' | 'reward' | 'store' | 'achievement' | 'success' | 'error'): void {
  try {
    switch (preset) {
      case 'click':
        playSynthSound(600, 'sine', 0.06, 0.06);
        triggerHaptic('light');
        break;
      case 'nav':
        playSynthSound(750, 'sine', 0.08, 0.06);
        triggerHaptic('light');
        break;
      case 'reward':
        playSynthSound(523.25, 'sine', 0.1, 0.08);
        setTimeout(() => playSynthSound(659.25, 'sine', 0.1, 0.08), 80);
        setTimeout(() => playSynthSound(783.99, 'sine', 0.2, 0.08), 160);
        triggerHaptic('success');
        break;
      case 'store':
        playSynthSound(440, 'triangle', 0.1, 0.07);
        setTimeout(() => playSynthSound(880, 'sine', 0.15, 0.07), 100);
        triggerHaptic('medium');
        break;
      case 'achievement':
        playSynthSound(523.25, 'sine', 0.12, 0.08);
        setTimeout(() => playSynthSound(659.25, 'sine', 0.12, 0.08), 90);
        setTimeout(() => playSynthSound(783.99, 'sine', 0.12, 0.08), 180);
        setTimeout(() => playSynthSound(1046.5, 'sine', 0.3, 0.09), 270);
        triggerHaptic('success');
        break;
      case 'success':
        playSynthSound(600, 'sine', 0.1, 0.07);
        setTimeout(() => playSynthSound(900, 'sine', 0.2, 0.08), 90);
        triggerHaptic('success');
        break;
      case 'error':
        playSynthSound(220, 'sawtooth', 0.15, 0.06);
        setTimeout(() => playSynthSound(180, 'sawtooth', 0.2, 0.06), 120);
        triggerHaptic('error');
        break;
    }
  } catch (e) {
    // Ignore
  }
}
