// Procedural Web Audio synthesizer for Kamolon Barista tactile feedback

class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted = false;

  private ensureContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playIngredientAdd(category: string): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Pitch variation ±8% for tactile freshness
    const jitter = 0.92 + Math.random() * 0.16;
    const baseFreq =
      category === 'qahva_sut'
        ? 320
        : category === 'choy_suv'
          ? 520
          : category === 'meva_kokat'
            ? 440
            : category === 'siroplar'
              ? 590
              : 490;

    osc.type = category === 'ziravorlar' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(baseFreq * jitter, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45 * jitter, now + 0.08);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playRemove(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(190, now + 0.09);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  public playServeResult(score: number): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes =
      score === 10
        ? [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6 celebratory chord
        : score >= 7
          ? [440, 554.37, 659.25]
          : [330, 293.66, 261.63];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startAt = now + idx * 0.075;
      osc.type = score >= 7 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, startAt);
      gain.gain.setValueAtTime(score >= 7 ? 0.09 : 0.05, startAt);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.24);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + 0.26);
    });
  }
}

export const soundEngine = new SoundEngine();
