/**
 * Synthesizes a realistic physical paper page turn sound effect using Web Audio API.
 * Combines bandpass-filtered noise friction with low-frequency parchment resonance.
 * Completely offline, zero dependencies, zero network requests.
 */

class PageTurnSound {
  private audioCtx: AudioContext | null = null;
  public enabled = true;

  private initContext() {
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  public play() {
    if (!this.enabled || typeof window === "undefined") return;

    try {
      this.initContext();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const duration = 0.32; // ~320ms paper flip

      // 1. Friction / Paper Rustle Noise Layer
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      // Generate soft pink/brown paper noise
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2 + white * 0.5) * 0.18;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Bandpass filter sweeping down to mimic sliding across page
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2200, now);
      filter.frequency.exponentialRampToValueAtTime(750, now + duration);
      filter.Q.setValueAtTime(1.8, now);

      // Gain envelope for friction
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.35, now + 0.04);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);

      // 2. Subtle parchment paper body impact (landing)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(50, now + duration);

      oscGain.gain.setValueAtTime(0.001, now + 0.08);
      oscGain.gain.linearRampToValueAtTime(0.12, now + 0.12);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now + 0.08);
      osc.stop(now + duration);
    } catch (e) {
      // Audio playback silently bypassed if browser policy blocks autoplay
      console.debug("Page turn audio error:", e);
    }
  }
}

export const pageTurnAudio = new PageTurnSound();
