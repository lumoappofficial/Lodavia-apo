import { playSynthSound } from './helpers';

let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
      sharedAudioContext = new AudioContextClass();
    }
    if (sharedAudioContext.state === 'suspended') {
      sharedAudioContext.resume().catch(() => {});
    }
    return sharedAudioContext;
  } catch {
    return null;
  }
}

/**
 * Helper to play a pristine Web Audio tone with a smooth, click-free exponential gain envelope.
 */
function playToneAt(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  peakGain: number = 0.08,
  type: OscillatorType = 'sine'
) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Smooth envelope: rapid gentle attack, exponential decay release
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.04);
  } catch {
    // Ignore audio playback exceptions
  }
}

function playSequence(notes: { freq: number; type?: 'sine' | 'triangle' | 'sawtooth' | 'square'; duration?: number; delay: number }[]) {
  notes.forEach((note) => {
    setTimeout(() => playSynthSound(note.freq, note.type || 'sine', note.duration || 0.15), note.delay);
  });
}

export function playAppLaunchSound() {
  playSequence([
    { freq: 392.0, delay: 0, duration: 0.12 },
    { freq: 523.25, delay: 90, duration: 0.12 },
    { freq: 659.25, delay: 180, duration: 0.12 },
    { freq: 987.77, delay: 280, duration: 0.35 },
  ]);
}

/**
 * 1. Developed Message Received Sound:
 * Two distinct rising pop tones with an 85ms interval for a modern, tactile messaging feel.
 */
export function playMessageReceivedSound() {
  const ctx = getAudioContext();
  if (ctx) {
    const t0 = ctx.currentTime;
    // Tone 1: warm mid pop (784Hz - G5)
    playToneAt(ctx, 783.99, t0, 0.07, 0.075, 'sine');
    // Tone 2: higher crisp resolving pop after 85ms (1046.5Hz - C6)
    playToneAt(ctx, 1046.50, t0 + 0.085, 0.13, 0.085, 'sine');
  } else {
    playSequence([
      { freq: 783.99, delay: 0, duration: 0.07 },
      { freq: 1046.50, delay: 85, duration: 0.13 },
    ]);
  }
}

/**
 * 2. New Message Sent Sound:
 * Ultra-short, distinct upward chirp (higher pitch and shorter duration than receive sound).
 */
export function playMessageSentSound() {
  const ctx = getAudioContext();
  if (ctx) {
    const t0 = ctx.currentTime;
    // Quick micro-pulse followed immediately by bright affirmative chime
    playToneAt(ctx, 1174.66, t0, 0.04, 0.055, 'sine');
    playToneAt(ctx, 1567.98, t0 + 0.04, 0.07, 0.065, 'sine');
  } else {
    playSequence([
      { freq: 1174.66, delay: 0, duration: 0.04 },
      { freq: 1567.98, delay: 40, duration: 0.07 },
    ]);
  }
}

export function playNotificationSound() {
  playSequence([
    { freq: 659.25, type: 'triangle', delay: 0, duration: 0.1 },
    { freq: 987.77, type: 'triangle', delay: 60, duration: 0.18 },
  ]);
}

export function playSuccessSound(tier: 'common' | 'rare' | 'epic_legendary' = 'common') {
  const ctx = getAudioContext();
  if (ctx) {
    const t0 = ctx.currentTime;
    if (tier === 'epic_legendary') {
      // Grand triumphant cosmic fanfare
      playToneAt(ctx, 523.25, t0, 0.14, 0.08, 'triangle');       // C5
      playToneAt(ctx, 659.25, t0 + 0.08, 0.14, 0.09, 'triangle');  // E5
      playToneAt(ctx, 783.99, t0 + 0.16, 0.16, 0.095, 'triangle'); // G5
      playToneAt(ctx, 1046.50, t0 + 0.26, 0.22, 0.11, 'sine');    // C6
      playToneAt(ctx, 1318.51, t0 + 0.40, 0.35, 0.12, 'sine');    // E6
      playToneAt(ctx, 1567.98, t0 + 0.55, 0.55, 0.13, 'sine');    // G6
      playToneAt(ctx, 2093.00, t0 + 0.60, 0.45, 0.07, 'sine');    // C7
    } else if (tier === 'rare') {
      // Vibrant crystal chime fanfare
      playToneAt(ctx, 587.33, t0, 0.12, 0.075, 'sine');      // D5
      playToneAt(ctx, 783.99, t0 + 0.09, 0.14, 0.085, 'sine'); // G5
      playToneAt(ctx, 987.77, t0 + 0.18, 0.16, 0.095, 'sine'); // B5
      playToneAt(ctx, 1174.66, t0 + 0.28, 0.38, 0.11, 'sine'); // D6
      playToneAt(ctx, 1567.98, t0 + 0.34, 0.25, 0.06, 'sine'); // G6
    } else {
      // Classic smooth common success
      playToneAt(ctx, 523.25, t0, 0.10, 0.07, 'sine');
      playToneAt(ctx, 659.25, t0 + 0.08, 0.11, 0.08, 'sine');
      playToneAt(ctx, 783.99, t0 + 0.16, 0.28, 0.09, 'sine');
    }
  } else {
    if (tier === 'epic_legendary') {
      playSequence([
        { freq: 523.25, delay: 0, duration: 0.12 },
        { freq: 659.25, delay: 80, duration: 0.12 },
        { freq: 783.99, delay: 160, duration: 0.14 },
        { freq: 1046.50, delay: 260, duration: 0.2 },
        { freq: 1318.51, delay: 400, duration: 0.3 },
        { freq: 1567.98, delay: 550, duration: 0.5 },
      ]);
    } else if (tier === 'rare') {
      playSequence([
        { freq: 587.33, delay: 0, duration: 0.1 },
        { freq: 783.99, delay: 90, duration: 0.12 },
        { freq: 987.77, delay: 180, duration: 0.14 },
        { freq: 1174.66, delay: 280, duration: 0.3 },
      ]);
    } else {
      playSequence([
        { freq: 523.25, delay: 0, duration: 0.1 },
        { freq: 659.25, delay: 80, duration: 0.1 },
        { freq: 783.99, delay: 160, duration: 0.25 },
      ]);
    }
  }
}

export function playUnboxingBurstSound(tier: 'common' | 'rare' | 'epic_legendary' = 'common') {
  const ctx = getAudioContext();
  if (!ctx) return;
  const t0 = ctx.currentTime;
  if (tier === 'epic_legendary') {
    playToneAt(ctx, 160, t0, 0.2, 0.12, 'sawtooth');
    playToneAt(ctx, 880, t0 + 0.05, 0.18, 0.09, 'triangle');
    playToneAt(ctx, 1760, t0 + 0.1, 0.25, 0.08, 'sine');
  } else if (tier === 'rare') {
    playToneAt(ctx, 220, t0, 0.15, 0.09, 'triangle');
    playToneAt(ctx, 1174, t0 + 0.04, 0.2, 0.07, 'sine');
  } else {
    playToneAt(ctx, 330, t0, 0.12, 0.07, 'sine');
    playToneAt(ctx, 880, t0 + 0.04, 0.15, 0.06, 'sine');
  }
}

export function playPurchaseSound() {
  playSequence([
    { freq: 587.33, delay: 0, duration: 0.1 },
    { freq: 783.99, delay: 70, duration: 0.1 },
    { freq: 1046.5, delay: 140, duration: 0.1 },
    { freq: 1318.51, delay: 220, duration: 0.3 },
  ]);
}

/**
 * 3. Incoming Call Ringtone:
 * Returns an object with start() and stop() methods.
 * Plays a distinctive, melodic 4-note cosmic motif that repeats every 1.8s until stop() is called.
 */
export function playIncomingCallRingtone(autoStart: boolean = false): { start: () => void; stop: () => void } {
  let intervalId: any = null;
  let isPlaying = false;

  const playMelodyCycle = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    // Note 1: E5 (659.25 Hz)
    playToneAt(ctx, 659.25, t0, 0.13, 0.08, 'sine');
    // Note 2: G#5 (830.61 Hz)
    playToneAt(ctx, 830.61, t0 + 0.15, 0.13, 0.085, 'sine');
    // Note 3: B5 (987.77 Hz)
    playToneAt(ctx, 987.77, t0 + 0.30, 0.14, 0.09, 'sine');
    // Note 4: E6 (1318.51 Hz) - soaring high tone
    playToneAt(ctx, 1318.51, t0 + 0.46, 0.24, 0.095, 'sine');
    // Second phrase resolving
    playToneAt(ctx, 987.77, t0 + 0.78, 0.12, 0.075, 'sine');
    playToneAt(ctx, 1174.66, t0 + 0.92, 0.28, 0.085, 'sine');
  };

  const start = () => {
    if (isPlaying) return;
    isPlaying = true;
    playMelodyCycle();
    intervalId = setInterval(() => {
      if (isPlaying) {
        playMelodyCycle();
      }
    }, 1800);
  };

  const stop = () => {
    isPlaying = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  if (autoStart) {
    start();
  }

  return { start, stop };
}

/**
 * 4. Outgoing Call Tone (Ringback):
 * Returns an object with start() and stop() methods.
 * Plays a calm, gentle rhythmic ringback pulse that repeats every 2.6s while waiting for an answer.
 */
export function playOutgoingCallTone(autoStart: boolean = false): { start: () => void; stop: () => void } {
  let intervalId: any = null;
  let isPlaying = false;

  const playPulseCycle = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    // Calm, warm dual-tone pulse (440Hz + 480Hz) with gentle low gain
    playToneAt(ctx, 440.0, t0, 0.65, 0.045, 'sine');
    playToneAt(ctx, 480.0, t0, 0.65, 0.040, 'sine');
  };

  const start = () => {
    if (isPlaying) return;
    isPlaying = true;
    playPulseCycle();
    intervalId = setInterval(() => {
      if (isPlaying) {
        playPulseCycle();
      }
    }, 2600);
  };

  const stop = () => {
    isPlaying = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  if (autoStart) {
    start();
  }

  return { start, stop };
}

