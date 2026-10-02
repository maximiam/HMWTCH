// Simple Web Audio API sound effects for MUCH JUMP

class SoundEngine {
  private ctx: AudioContext | null = null;
  private initialized = false;

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initialized = true;
    } catch {
      console.log('Audio not available');
    }
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15) {
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  bounce() {
    // "Plink" sound
    this.playTone(800, 0.1, 'sine', 0.1);
    setTimeout(() => this.playTone(1200, 0.08, 'sine', 0.05), 30);
  }

  goldBounce() {
    // Sparkly sound
    this.playTone(1000, 0.15, 'sine', 0.12);
    setTimeout(() => this.playTone(1500, 0.12, 'sine', 0.08), 50);
    setTimeout(() => this.playTone(2000, 0.1, 'sine', 0.05), 100);
  }

  catBounce() {
    // Meow-like sound
    this.playTone(600, 0.2, 'triangle', 0.1);
    setTimeout(() => this.playTone(900, 0.15, 'triangle', 0.08), 80);
  }

  powerUp() {
    // Ascending tones
    this.playTone(400, 0.1, 'square', 0.06);
    setTimeout(() => this.playTone(600, 0.1, 'square', 0.06), 60);
    setTimeout(() => this.playTone(800, 0.1, 'square', 0.06), 120);
    setTimeout(() => this.playTone(1200, 0.15, 'square', 0.08), 180);
  }

  gameOver() {
    // Descending sad tones
    this.playTone(400, 0.3, 'sawtooth', 0.08);
    setTimeout(() => this.playTone(300, 0.3, 'sawtooth', 0.06), 150);
    setTimeout(() => this.playTone(200, 0.5, 'sawtooth', 0.04), 300);
  }

  personalBest() {
    // Triumphant piano note
    this.playTone(523, 0.4, 'sine', 0.1); // C5
    setTimeout(() => this.playTone(659, 0.4, 'sine', 0.08), 100); // E5
    setTimeout(() => this.playTone(784, 0.6, 'sine', 0.1), 200); // G5
  }

  shield() {
    this.playTone(300, 0.2, 'triangle', 0.08);
    setTimeout(() => this.playTone(500, 0.15, 'triangle', 0.06), 100);
  }
}

export const sound = new SoundEngine();
