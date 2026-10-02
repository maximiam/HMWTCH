// MUCH JUMP — Game Engine
// Vertical jumper with candle platforms

import { sound } from './sound';

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'green' | 'red' | 'gold' | 'cap' | 'cat';
  confirmed: boolean;
  broken: boolean;
  bounceAnim: number;
}

export interface PowerUp {
  x: number;
  y: number;
  type: 'coffee' | 'smoothie' | 'rocket' | 'moon';
  collected: boolean;
}

export interface Hazard {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'fud';
  active: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: 'left' | 'right';
  shieldActive: boolean;
  rocketActive: boolean;
  rocketTimer: number;
  speedBoost: boolean;
  speedTimer: number;
  magnetActive: boolean;
  magnetTimer: number;
  frame: number;
  frameTimer: number;
}

export interface ChartPoint {
  x: number;
  y: number;
  green: boolean;
}

export interface GameState {
  status: 'loading' | 'menu' | 'playing' | 'gameover';
  player: Player;
  platforms: Platform[];
  powerups: PowerUp[];
  hazards: Hazard[];
  particles: Particle[];
  cameraY: number;
  score: number;
  maxHeight: number;
  closingPrice: number;
  highestPlatformY: number;
  combo: number;
  maxCombo: number;
  chartPoints: ChartPoint[];
  loadingProgress: number;
  loadingText: string;
  screenShake: number;
  time: number;
  W: number;
  H: number;
}

const GRAVITY = 0.35;
const JUMP_FORCE = -11;
const HIGH_JUMP_FORCE = -15;
const MOVE_SPEED = 4.5;
const MAX_FALL_SPEED = 10;
const PLATFORM_MIN_GAP = 60;
const PLATFORM_MAX_GAP = 100;

export class GameEngine {
  state: GameState;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  animFrame: number = 0;
  keys: Set<string> = new Set();
  touchLeft: boolean = false;
  touchRight: boolean = false;
  touchHeld: boolean = false;
  onScoreUpdate?: (score: number, closingPrice: number) => void;
  onGameOver?: (score: number, closingPrice: number, chartPoints: ChartPoint[], maxCombo: number) => void;
  private running: boolean = false;
  private boundKeydown: (e: KeyboardEvent) => void;
  private boundKeyup: (e: KeyboardEvent) => void;
  private boundTouchStart: (e: TouchEvent) => void;
  private boundTouchMove: (e: TouchEvent) => void;
  private boundTouchEnd: (e: TouchEvent) => void;
  private boundMouseDown: (e: MouseEvent) => void;
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseUp: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.state = this.createInitialState(canvas.width, canvas.height);
    
    // Bind event handlers
    this.boundKeydown = this.handleKeyDown.bind(this);
    this.boundKeyup = this.handleKeyUp.bind(this);
    this.boundTouchStart = this.handleTouchStart.bind(this);
    this.boundTouchMove = this.handleTouchMove.bind(this);
    this.boundTouchEnd = this.handleTouchEnd.bind(this);
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
    
    this.setupInput();
  }

  createInitialState(W: number, H: number): GameState {
    return {
      status: 'loading',
      player: this.createPlayer(W, H),
      platforms: [],
      powerups: [],
      hazards: [],
      particles: [],
      cameraY: 0,
      score: 0,
      maxHeight: 0,
      closingPrice: 0,
      highestPlatformY: H - 80,
      combo: 0,
      maxCombo: 0,
      chartPoints: [],
      loadingProgress: 0,
      loadingText: 'the cat is still buffering…',
      screenShake: 0,
      time: 0,
      W,
      H,
    };
  }

  createPlayer(W: number, H: number): Player {
    return {
      x: W / 2 - 18,
      y: H - 130,
      vx: 0,
      vy: 0,
      width: 36,
      height: 36,
      facing: 'right',
      shieldActive: false,
      rocketActive: false,
      rocketTimer: 0,
      speedBoost: false,
      speedTimer: 0,
      magnetActive: false,
      magnetTimer: 0,
      frame: 0,
      frameTimer: 0,
    };
  }

  setupInput() {
    window.addEventListener('keydown', this.boundKeydown);
    window.addEventListener('keyup', this.boundKeyup);
    this.canvas.addEventListener('touchstart', this.boundTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', this.boundTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this.boundTouchEnd, { passive: false });
    this.canvas.addEventListener('mousedown', this.boundMouseDown);
    this.canvas.addEventListener('mousemove', this.boundMouseMove);
    this.canvas.addEventListener('mouseup', this.boundMouseUp);
    this.canvas.addEventListener('mouseleave', this.boundMouseUp);
  }

  destroy() {
    window.removeEventListener('keydown', this.boundKeydown);
    window.removeEventListener('keyup', this.boundKeyup);
    this.canvas.removeEventListener('touchstart', this.boundTouchStart);
    this.canvas.removeEventListener('touchmove', this.boundTouchMove);
    this.canvas.removeEventListener('touchend', this.boundTouchEnd);
    this.canvas.removeEventListener('mousedown', this.boundMouseDown);
    this.canvas.removeEventListener('mousemove', this.boundMouseMove);
    this.canvas.removeEventListener('mouseup', this.boundMouseUp);
    this.canvas.removeEventListener('mouseleave', this.boundMouseUp);
  }

  handleKeyDown(e: KeyboardEvent) {
    this.keys.add(e.key);
    if (e.key === ' ' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.state.status === 'menu') this.startGame();
      else if (this.state.status === 'gameover') this.resetToMenu();
    }
  }

  handleKeyUp(e: KeyboardEvent) {
    this.keys.delete(e.key);
  }

  handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width * this.state.W;

    if (this.state.status === 'menu') { this.startGame(); return; }
    if (this.state.status === 'gameover') { this.resetToMenu(); return; }

    this.touchHeld = true;
    if (x < this.state.W / 2) {
      this.touchLeft = true;
      this.touchRight = false;
    } else {
      this.touchRight = true;
      this.touchLeft = false;
    }
  }

  handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width * this.state.W;

    if (x < this.state.W / 2) {
      this.touchLeft = true;
      this.touchRight = false;
    } else {
      this.touchRight = true;
      this.touchLeft = false;
    }
  }

  handleTouchEnd(e: TouchEvent) {
    e.preventDefault();
    this.touchLeft = false;
    this.touchRight = false;
    this.touchHeld = false;
  }

  handleMouseDown(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * this.state.W;

    if (this.state.status === 'menu') { this.startGame(); return; }
    if (this.state.status === 'gameover') { this.resetToMenu(); return; }

    this.touchHeld = true;
    if (x < this.state.W / 2) {
      this.touchLeft = true;
      this.touchRight = false;
    } else {
      this.touchRight = true;
      this.touchLeft = false;
    }
  }

  handleMouseMove(e: MouseEvent) {
    if (!this.touchHeld) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * this.state.W;

    if (x < this.state.W / 2) {
      this.touchLeft = true;
      this.touchRight = false;
    } else {
      this.touchRight = true;
      this.touchLeft = false;
    }
  }

  handleMouseUp() {
    this.touchLeft = false;
    this.touchRight = false;
    this.touchHeld = false;
  }

  startLoading() {
    this.state.status = 'loading';
    this.state.loadingProgress = 0;
    
    const loadingInterval = setInterval(() => {
      if (!this.running) { clearInterval(loadingInterval); return; }
      this.state.loadingProgress += Math.random() * 15 + 5;
      
      const texts = [
        'the cat is still buffering…',
        'loading candles…',
        'much is warming up…',
        'chart is forming…',
        'almost there…',
      ];
      this.state.loadingText = texts[Math.floor(Math.random() * texts.length)];
      
      if (this.state.loadingProgress >= 100) {
        this.state.loadingProgress = 100;
        clearInterval(loadingInterval);
        setTimeout(() => {
          if (this.running) this.state.status = 'menu';
        }, 400);
      }
    }, 180);
  }

  startGame() {
    const { W, H } = this.state;
    this.state.status = 'playing';
    this.state.player = this.createPlayer(W, H);
    this.state.platforms = [];
    this.state.powerups = [];
    this.state.hazards = [];
    this.state.particles = [];
    this.state.cameraY = 0;
    this.state.score = 0;
    this.state.maxHeight = 0;
    this.state.closingPrice = 0;
    this.state.highestPlatformY = H - 80;
    this.state.combo = 0;
    this.state.maxCombo = 0;
    this.state.chartPoints = [];
    this.state.screenShake = 0;

    this.generateInitialPlatforms();
  }

  resetToMenu() {
    this.state.status = 'menu';
  }

  getDailySeed(): string {
    const today = new Date();
    return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
  }

  generateInitialPlatforms() {
    const { W, H } = this.state;
    // Starting platform (wide, green)
    this.state.platforms.push({
      x: W / 2 - 50,
      y: H - 80,
      width: 100,
      height: 18,
      type: 'green',
      confirmed: true,
      broken: false,
      bounceAnim: 0,
    });

    // Generate platforms going up
    let y = H - 80;
    for (let i = 0; i < 25; i++) {
      y -= PLATFORM_MIN_GAP + Math.random() * (PLATFORM_MAX_GAP - PLATFORM_MIN_GAP);
      this.spawnPlatform(y);
    }
  }

  spawnPlatform(y: number) {
    const { W } = this.state;
    const difficulty = Math.min(1, Math.abs(y) / 5000);
    
    const rand = Math.random();
    let type: Platform['type'];
    
    // Adjust probabilities based on difficulty
    if (rand < 0.45 - difficulty * 0.1) type = 'green';
    else if (rand < 0.7) type = 'red';
    else if (rand < 0.85) type = 'gold';
    else if (rand < 0.94) type = 'cap';
    else type = 'cat';

    const baseWidth = type === 'gold' ? 45 : type === 'cat' ? 55 : 65;
    const width = baseWidth + Math.random() * 25 - difficulty * 15;
    const x = Math.random() * (W - Math.max(40, width));

    this.state.platforms.push({
      x,
      y,
      width: Math.max(40, width),
      height: 18,
      type,
      confirmed: false,
      broken: false,
      bounceAnim: 0,
    });

    // Spawn powerup occasionally
    if (Math.random() < 0.07) {
      const pTypes: PowerUp['type'][] = ['coffee', 'smoothie', 'rocket', 'moon'];
      this.state.powerups.push({
        x: x + width / 2,
        y: y - 35,
        type: pTypes[Math.floor(Math.random() * pTypes.length)],
        collected: false,
      });
    }

    // Spawn FUD cloud occasionally (after some height)
    if (Math.random() < 0.04 + difficulty * 0.03 && y < this.state.H - 400) {
      this.state.hazards.push({
        x: Math.random() * (W - 70),
        y: y - 50,
        width: 70,
        height: 35,
        type: 'fud',
        active: true,
      });
    }

    this.state.highestPlatformY = y;
  }

  update() {
    if (this.state.status !== 'playing') return;

    const { W, H } = this.state;
    const p = this.state.player;
    this.state.time++;

    // Input
    let moveDir = 0;
    if (this.keys.has('ArrowLeft') || this.keys.has('a') || this.touchLeft) moveDir = -1;
    if (this.keys.has('ArrowRight') || this.keys.has('d') || this.touchRight) moveDir = 1;

    const speed = p.speedBoost ? MOVE_SPEED * 1.6 : MOVE_SPEED;
    p.vx = moveDir * speed;
    if (moveDir !== 0) p.facing = moveDir > 0 ? 'right' : 'left';

    // Rocket mode
    if (p.rocketActive) {
      p.vy = -7;
      p.rocketTimer--;
      if (p.rocketTimer <= 0) p.rocketActive = false;
      this.spawnParticle(p.x + p.width / 2, p.y + p.height, (Math.random() - 0.5) * 2, 3 + Math.random() * 2, '#f59e0b', 3);
      this.spawnParticle(p.x + p.width / 2, p.y + p.height, (Math.random() - 0.5) * 2, 4 + Math.random() * 2, '#ef4444', 2);
    } else {
      // Gravity
      p.vy += GRAVITY;
      if (p.vy > MAX_FALL_SPEED) p.vy = MAX_FALL_SPEED;
    }

    // Timers
    if (p.speedBoost) { p.speedTimer--; if (p.speedTimer <= 0) p.speedBoost = false; }
    if (p.magnetActive) { p.magnetTimer--; if (p.magnetTimer <= 0) p.magnetActive = false; }

    // Move
    p.x += p.vx;
    p.y += p.vy;

    // Wrap around
    if (p.x > W) p.x = -p.width;
    if (p.x + p.width < 0) p.x = W;

    // Animation
    p.frameTimer++;
    if (p.frameTimer > 8) { p.frame = (p.frame + 1) % 4; p.frameTimer = 0; }

    // Platform collision (only when falling)
    if (p.vy > 0 && !p.rocketActive) {
      for (const plat of this.state.platforms) {
        if (plat.broken) continue;
        
        const playerBottom = p.y + p.height;
        const prevBottom = playerBottom - p.vy;
        
        if (
          p.x + p.width > plat.x + 4 &&
          p.x < plat.x + plat.width - 4 &&
          playerBottom >= plat.y &&
          prevBottom <= plat.y + 8
        ) {
          this.handlePlatformLanding(plat);
          break;
        }
      }
    }

    // PowerUp collection
    for (const pu of this.state.powerups) {
      if (pu.collected) continue;
      const dx = (p.x + p.width / 2) - pu.x;
      const dy = (p.y + p.height / 2) - pu.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (p.magnetActive && dist < 120) {
        pu.x -= dx * 0.06;
        pu.y -= dy * 0.06;
      }
      
      if (dist < 25) {
        pu.collected = true;
        this.activatePowerUp(pu.type);
        this.spawnParticles(pu.x, pu.y, '#fbbf24', 8);
      }
    }

    // Hazard collision
    for (const h of this.state.hazards) {
      if (!h.active) continue;
      if (
        p.x + p.width > h.x &&
        p.x < h.x + h.width &&
        p.y + p.height > h.y &&
        p.y < h.y + h.height
      ) {
        if (!p.shieldActive && !p.rocketActive) {
          p.vx *= 0.2;
          p.vy += 1.5;
        }
      }
    }

    // Camera follow (only moves up)
    const targetY = p.y - H * 0.4;
    if (targetY < this.state.cameraY) {
      this.state.cameraY += (targetY - this.state.cameraY) * 0.08;
    }

    // Score
    const height = Math.max(0, (H - 130 - p.y) / 8);
    if (height > this.state.maxHeight) {
      this.state.maxHeight = height;
      this.state.score = Math.floor(height);
      this.state.closingPrice = this.state.score;
    }

    // Generate new platforms
    while (this.state.highestPlatformY > this.state.cameraY - 300) {
      this.state.highestPlatformY -= PLATFORM_MIN_GAP + Math.random() * (PLATFORM_MAX_GAP - PLATFORM_MIN_GAP);
      this.spawnPlatform(this.state.highestPlatformY);
    }

    // Cleanup
    const bottomCull = this.state.cameraY + H + 200;
    this.state.platforms = this.state.platforms.filter(pl => pl.y < bottomCull);
    this.state.powerups = this.state.powerups.filter(pu => !pu.collected && pu.y < bottomCull);
    this.state.hazards = this.state.hazards.filter(h => h.y < bottomCull);

    // Particles
    this.state.particles = this.state.particles.filter(part => {
      part.x += part.vx;
      part.y += part.vy;
      part.vy += 0.1;
      part.life--;
      return part.life > 0;
    });

    // Screen shake
    if (this.state.screenShake > 0) this.state.screenShake *= 0.85;
    if (this.state.screenShake < 0.1) this.state.screenShake = 0;

    // Platform bounce anim
    for (const plat of this.state.platforms) {
      if (plat.bounceAnim > 0) plat.bounceAnim *= 0.85;
    }

    // Game over check
    if (p.y > this.state.cameraY + H + 60) {
      if (p.shieldActive) {
        p.shieldActive = false;
        p.y = this.state.cameraY + H * 0.3;
        p.vy = JUMP_FORCE;
        this.state.screenShake = 8;
        this.spawnParticles(p.x + p.width / 2, p.y + p.height / 2, '#8b5cf6', 12);
      } else {
        this.gameOver();
      }
    }

    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.state.score, this.state.closingPrice);
    }
  }

  handlePlatformLanding(plat: Platform) {
    const p = this.state.player;
    
    switch (plat.type) {
      case 'green':
        p.vy = JUMP_FORCE;
        plat.confirmed = true;
        plat.bounceAnim = 5;
        this.state.combo++;
        if (this.state.combo > this.state.maxCombo) this.state.maxCombo = this.state.combo;
        this.addChartPoint(plat, true);
        this.spawnParticles(p.x + p.width / 2, plat.y, '#22c55e', 4);
        sound.bounce();
        break;
      case 'red':
        p.vy = JUMP_FORCE * 0.75;
        plat.confirmed = true;
        plat.bounceAnim = 3;
        this.state.combo = Math.max(0, this.state.combo - 1);
        this.addChartPoint(plat, false);
        this.spawnParticles(p.x + p.width / 2, plat.y, '#ef4444', 3);
        sound.bounce();
        break;
      case 'gold':
        p.vy = HIGH_JUMP_FORCE;
        plat.confirmed = true;
        plat.bounceAnim = 8;
        this.state.score += 50;
        this.state.combo += 3;
        if (this.state.combo > this.state.maxCombo) this.state.maxCombo = this.state.combo;
        this.addChartPoint(plat, true);
        this.spawnParticles(p.x + p.width / 2, plat.y, '#fbbf24', 10);
        this.state.screenShake = 5;
        sound.goldBounce();
        break;
      case 'cap':
        p.vy = JUMP_FORCE;
        p.shieldActive = true;
        plat.confirmed = true;
        plat.bounceAnim = 5;
        this.addChartPoint(plat, true);
        this.spawnParticles(p.x + p.width / 2, plat.y, '#8b5cf6', 6);
        sound.shield();
        break;
      case 'cat':
        p.vy = HIGH_JUMP_FORCE * 1.2;
        plat.confirmed = true;
        plat.bounceAnim = 10;
        this.state.combo += 2;
        if (this.state.combo > this.state.maxCombo) this.state.maxCombo = this.state.combo;
        this.addChartPoint(plat, true);
        this.spawnParticles(p.x + p.width / 2, plat.y, '#d946ef', 8);
        this.state.screenShake = 3;
        sound.catBounce();
        break;
    }
  }

  addChartPoint(plat: Platform, green: boolean) {
    this.state.chartPoints.push({
      x: plat.x + plat.width / 2,
      y: plat.y,
      green,
    });
    if (this.state.chartPoints.length > 60) {
      this.state.chartPoints.shift();
    }
  }

  activatePowerUp(type: PowerUp['type']) {
    const p = this.state.player;
    sound.powerUp();
    switch (type) {
      case 'coffee':
        p.speedBoost = true;
        p.speedTimer = 300;
        break;
      case 'smoothie':
        p.magnetActive = true;
        p.magnetTimer = 360;
        break;
      case 'rocket':
        p.rocketActive = true;
        p.rocketTimer = 150;
        break;
      case 'moon':
        this.state.score += 200;
        p.vy = HIGH_JUMP_FORCE * 1.4;
        this.state.screenShake = 6;
        break;
    }
  }

  spawnParticle(x: number, y: number, vx: number, vy: number, color: string, size: number) {
    this.state.particles.push({ x, y, vx, vy, life: 25, maxLife: 25, color, size });
  }

  spawnParticles(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      this.state.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5 - 2,
        life: 20 + Math.random() * 15,
        maxLife: 35,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  gameOver() {
    this.state.status = 'gameover';
    this.state.screenShake = 12;
    sound.gameOver();
    if (this.onGameOver) {
      this.onGameOver(
        this.state.closingPrice,
        this.state.closingPrice,
        this.state.chartPoints,
        this.state.maxCombo
      );
    }
  }

  resize(w: number, h: number) {
    this.state.W = w;
    this.state.H = h;
    this.canvas.width = w;
    this.canvas.height = h;
  }

  // === RENDERING ===

  render() {
    const ctx = this.ctx;
    const { W, H } = this.state;
    const cam = this.state.cameraY;
    const shake = this.state.screenShake;
    const shakeX = shake > 0.5 ? (Math.random() - 0.5) * shake : 0;
    const shakeY = shake > 0.5 ? (Math.random() - 0.5) * shake : 0;

    ctx.save();
    ctx.translate(shakeX, shakeY);

    this.renderBackground(ctx, cam, W, H);

    switch (this.state.status) {
      case 'loading': this.renderLoading(ctx, W, H); break;
      case 'menu': this.renderMenu(ctx, W, H); break;
      case 'playing': this.renderGame(ctx, cam, W, H); break;
      case 'gameover':
        this.renderGame(ctx, cam, W, H);
        this.renderGameOver(ctx, W, H);
        break;
    }

    ctx.restore();
  }

  renderBackground(ctx: CanvasRenderingContext2D, cam: number, W: number, H: number) {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    const heightFactor = Math.min(1, Math.abs(cam) / 4000);
    
    gradient.addColorStop(0, `rgb(${10 + heightFactor * 15}, ${8 + heightFactor * 5}, ${25 + heightFactor * 35})`);
    gradient.addColorStop(1, `rgb(${12}, ${8}, ${22})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(-10, -10, W + 20, H + 20);

    // Stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 40; i++) {
      const sx = (i * 137.5 + 50) % W;
      const sy = ((i * 97.3 + cam * 0.05) % H + H) % H;
      const size = 0.5 + (i % 4) * 0.4;
      ctx.fillRect(sx, sy, size, size);
    }

    // Subtle grid
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
    ctx.lineWidth = 1;
    const gridOffset = ((cam * 0.2) % 50 + 50) % 50;
    for (let y = gridOffset; y < H; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
  }

  renderGame(ctx: CanvasRenderingContext2D, cam: number, W: number, H: number) {
    // Chart line
    if (this.state.chartPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      
      const first = this.state.chartPoints[0];
      ctx.moveTo(first.x, first.y - cam);
      
      for (let i = 1; i < this.state.chartPoints.length; i++) {
        const pt = this.state.chartPoints[i];
        ctx.lineTo(pt.x, pt.y - cam);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Platforms
    for (const plat of this.state.platforms) {
      this.renderCandle(ctx, plat, cam);
    }

    // PowerUps
    for (const pu of this.state.powerups) {
      if (!pu.collected) this.renderPowerUp(ctx, pu, cam);
    }

    // Hazards
    for (const h of this.state.hazards) {
      if (h.active) this.renderHazard(ctx, h, cam);
    }

    // Particles
    for (const part of this.state.particles) {
      const alpha = part.life / part.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = part.color;
      ctx.beginPath();
      ctx.arc(part.x, part.y - cam, part.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Player
    this.renderPlayer(ctx, cam);

    // HUD
    this.renderHUD(ctx, W, H);
  }

  renderCandle(ctx: CanvasRenderingContext2D, plat: Platform, cam: number) {
    const x = plat.x;
    const y = plat.y - cam - plat.bounceAnim;
    const w = plat.width;
    const h = plat.height;
    const t = this.state.time;

    // Wick
    const wickX = x + w / 2;
    const wickH = 7 + Math.sin(t * 0.1 + x) * 2;
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(wickX, y);
    ctx.lineTo(wickX, y - wickH);
    ctx.stroke();

    // Flame
    const flameSize = 3 + Math.sin(t * 0.15 + x * 0.1) * 1.5;
    const flameColor = plat.type === 'gold' ? '#fbbf24' : '#f97316';
    ctx.fillStyle = flameColor;
    ctx.beginPath();
    ctx.ellipse(wickX, y - wickH - flameSize, flameSize * 0.7, flameSize, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flame glow
    ctx.fillStyle = plat.type === 'gold' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(249, 115, 22, 0.1)';
    ctx.beginPath();
    ctx.arc(wickX, y - wickH - flameSize, flameSize * 3, 0, Math.PI * 2);
    ctx.fill();

    // Candle body colors
    let bodyColor: string;
    let topColor: string;
    switch (plat.type) {
      case 'green': bodyColor = '#16a34a'; topColor = '#22c55e'; break;
      case 'red': bodyColor = '#dc2626'; topColor = '#ef4444'; break;
      case 'gold': bodyColor = '#d97706'; topColor = '#fbbf24'; break;
      case 'cap': bodyColor = '#7c3aed'; topColor = '#8b5cf6'; break;
      case 'cat': bodyColor = '#c026d3'; topColor = '#d946ef'; break;
    }

    // Body shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.roundRect(x + 2, y + 2, w, h, 3);
    ctx.fill();

    // Body
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 3);
    ctx.fill();

    // Top highlight
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h * 0.4, [3, 3, 0, 0]);
    ctx.fill();

    // Shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(x + 4, y + 2, w * 0.3, 3);

    // Type-specific decorations
    if (plat.type === 'cat') {
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('😺', x + w / 2, y + h / 2 + 1);
    } else if (plat.type === 'cap') {
      ctx.font = '11px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧢', x + w / 2, y + h / 2 + 1);
    } else if (plat.type === 'gold') {
      // Sparkle effect
      const sparklePhase = (t * 0.05 + x * 0.01) % 1;
      if (sparklePhase < 0.3) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(x + w * 0.7, y + h * 0.3, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  renderPowerUp(ctx: CanvasRenderingContext2D, pu: PowerUp, cam: number) {
    const x = pu.x;
    const y = pu.y - cam;
    const bob = Math.sin(this.state.time * 0.07 + pu.x * 0.1) * 4;

    // Glow
    ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
    ctx.beginPath();
    ctx.arc(x, y + bob, 18, 0, Math.PI * 2);
    ctx.fill();

    // Ring
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y + bob, 14 + Math.sin(this.state.time * 0.1) * 2, 0, Math.PI * 2);
    ctx.stroke();

    const icons: Record<string, string> = {
      coffee: '☕', smoothie: '🥤', rocket: '🚀', moon: '🌙',
    };

    ctx.font = '18px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icons[pu.type], x, y + bob);
  }

  renderHazard(ctx: CanvasRenderingContext2D, h: Hazard, cam: number) {
    const x = h.x;
    const y = h.y - cam;
    const t = this.state.time;

    // Cloud body
    ctx.fillStyle = 'rgba(80, 80, 100, 0.7)';
    ctx.beginPath();
    ctx.arc(x + 15, y + 18, 14, 0, Math.PI * 2);
    ctx.arc(x + 35, y + 12, 16, 0, Math.PI * 2);
    ctx.arc(x + 55, y + 18, 13, 0, Math.PI * 2);
    ctx.arc(x + 35, y + 25, 12, 0, Math.PI * 2);
    ctx.fill();

    // Inner dark
    ctx.fillStyle = 'rgba(50, 50, 70, 0.5)';
    ctx.beginPath();
    ctx.arc(x + 35, y + 18, 10, 0, Math.PI * 2);
    ctx.fill();

    // FUD text
    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = `rgba(239, 68, 68, ${0.5 + Math.sin(t * 0.1) * 0.3})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FUD', x + 35, y + 18);
  }

  renderPlayer(ctx: CanvasRenderingContext2D, cam: number) {
    const p = this.state.player;
    const x = p.x;
    const y = p.y - cam;

    // Shield
    if (p.shieldActive) {
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.4 + Math.sin(this.state.time * 0.1) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + p.width / 2, y + p.height / 2, p.width * 0.75, 0, Math.PI * 2);
      ctx.stroke();
      
      // Shield glow
      ctx.fillStyle = 'rgba(139, 92, 246, 0.05)';
      ctx.beginPath();
      ctx.arc(x + p.width / 2, y + p.height / 2, p.width * 0.75, 0, Math.PI * 2);
      ctx.fill();
    }

    // Speed trail
    if (p.speedBoost) {
      for (let i = 1; i <= 3; i++) {
        ctx.globalAlpha = 0.2 / i;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(
          x + p.width / 2 - p.vx * i * 3,
          y + p.height / 2,
          p.width * 0.25 / i,
          0, Math.PI * 2
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Magnet aura
    if (p.magnetActive) {
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.arc(x + p.width / 2, y + p.height / 2, 60 + Math.sin(this.state.time * 0.08) * 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Dog character
    ctx.save();
    ctx.translate(x + p.width / 2, y + p.height / 2);
    
    if (p.facing === 'left') ctx.scale(-1, 1);

    // Squash & stretch
    const squash = p.vy < -5 ? 0.85 : p.vy > 5 ? 1.15 : 1;
    const stretch = p.vy < -5 ? 1.15 : p.vy > 5 ? 0.85 : 1;
    ctx.scale(squash, stretch);

    // Draw dog
    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐕', 0, 0);

    // Rocket
    if (p.rocketActive) {
      ctx.font = '14px serif';
      ctx.fillText('🔥', 0, 18);
    }

    ctx.restore();
  }

  renderHUD(ctx: CanvasRenderingContext2D, W: number, H: number) {
    // Score panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 130, 44, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('YOUR ORACLE', 16, 14);
    
    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#22c55e';
    ctx.fillText(`$${this.state.closingPrice.toLocaleString()}`, 16, 30);

    // Combo
    if (this.state.combo > 1) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.roundRect(W - 65, 8, 57, 26, 6);
      ctx.fill();

      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#fbbf24';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`×${this.state.combo}`, W - 36, 21);
    }

    // Active powerups
    let indicatorY = 58;
    const p = this.state.player;
    const indicators: string[] = [];
    if (p.shieldActive) indicators.push('🧢');
    if (p.speedBoost) indicators.push('☕');
    if (p.magnetActive) indicators.push('🥤');
    if (p.rocketActive) indicators.push('🚀');
    
    for (const icon of indicators) {
      ctx.font = '14px serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(icon, 12, indicatorY);
      indicatorY += 20;
    }

    // Height bar
    const barX = W - 6;
    const barY = 44;
    const barH = H - 88;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(barX, barY, 3, barH);
    
    const progress = Math.min(1, this.state.maxHeight / 800);
    const gradient = ctx.createLinearGradient(0, barY + barH, 0, barY);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(1, '#d946ef');
    ctx.fillStyle = gradient;
    ctx.fillRect(barX, barY + barH * (1 - progress), 3, barH * progress);

    // Daily seed indicator
    ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(`seed: ${this.getDailySeed()}`, W - 12, H - 16);
  }

  renderLoading(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const t = this.state.time;
    
    // Cat
    ctx.font = '50px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const bounce = Math.sin(t * 0.05) * 10;
    ctx.fillText('🐱', W / 2, H / 2 - 50 + bounce);

    // Text
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(this.state.loadingText, W / 2, H / 2 + 20);

    // Progress bar
    const barW = 180;
    const barX = (W - barW) / 2;
    const barY = H / 2 + 45;
    
    ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, 6, 3);
    ctx.fill();

    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW * (this.state.loadingProgress / 100), 6, 3);
    ctx.fill();
  }

  renderMenu(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const t = this.state.time;

    // Title
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const gradient = ctx.createLinearGradient(W * 0.2, H * 0.3, W * 0.8, H * 0.3);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(0.5, '#d946ef');
    gradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = gradient;
    ctx.fillText('MUCH JUMP', W / 2, H * 0.28);

    // Subtitle
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('HOW MUCH WILL YOU HIT?', W / 2, H * 0.34);

    // Dog
    const bounce = Math.sin(t * 0.06) * 12;
    ctx.font = '44px serif';
    ctx.fillText('🐕', W / 2, H * 0.48 + bounce);

    // Decorative candles
    ctx.font = '20px serif';
    ctx.fillText('🕯️', W * 0.25, H * 0.6);
    ctx.fillText('🕯️', W * 0.75, H * 0.55);
    ctx.fillText('🕯️', W * 0.5, H * 0.65);

    // Play text
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#22c55e';
    const pulse = 0.6 + Math.sin(t * 0.08) * 0.4;
    ctx.globalAlpha = pulse;
    ctx.fillText('TAP TO PLAY', W / 2, H * 0.78);
    ctx.globalAlpha = 1;

    // Controls
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#4b5563';
    ctx.fillText('← tap left  |  tap right →', W / 2, H * 0.84);
    ctx.fillText('jump on candles · hit a number', W / 2, H * 0.88);
  }

  renderGameOver(ctx: CanvasRenderingContext2D, W: number, H: number) {
    // Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(-10, -10, W + 20, H + 20);

    // Card
    const cardW = Math.min(280, W - 40);
    const cardH = 280;
    const cardX = (W - cardW) / 2;
    const cardY = (H - cardH) / 2;

    // Card bg
    ctx.fillStyle = 'rgba(15, 15, 35, 0.95)';
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 14);
    ctx.fill();
    ctx.stroke();

    // Top accent
    const accentGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
    accentGrad.addColorStop(0, '#8b5cf6');
    accentGrad.addColorStop(1, '#d946ef');
    ctx.fillStyle = accentGrad;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, 3, [14, 14, 0, 0]);
    ctx.fill();

    // Title
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('RUN COMPLETE', W / 2, cardY + 18);

    // Score
    ctx.font = 'bold 36px monospace';
    ctx.fillStyle = '#22c55e';
    ctx.textBaseline = 'middle';
    ctx.fillText(`$${this.state.closingPrice.toLocaleString()}`, W / 2, cardY + 65);

    // Label
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('My answer for $HMWTCH', W / 2, cardY + 92);

    // Mini chart
    if (this.state.chartPoints.length > 1) {
      const chartX = cardX + 20;
      const chartY2 = cardY + 110;
      const chartW = cardW - 40;
      const chartH2 = 50;

      // Chart bg
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.roundRect(chartX, chartY2, chartW, chartH2, 4);
      ctx.fill();

      const points = this.state.chartPoints;
      const minY = Math.min(...points.map(p => p.y));
      const maxY = Math.max(...points.map(p => p.y));
      const range = maxY - minY || 1;

      // Line
      ctx.beginPath();
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < points.length; i++) {
        const px = chartX + 4 + (i / (points.length - 1)) * (chartW - 8);
        const py = chartY2 + chartH2 - 4 - ((points[i].y - minY) / range) * (chartH2 - 8);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Dots
      for (let i = 0; i < points.length; i++) {
        const px = chartX + 4 + (i / (points.length - 1)) * (chartW - 8);
        const py = chartY2 + chartH2 - 4 - ((points[i].y - minY) / range) * (chartH2 - 8);
        ctx.fillStyle = points[i].green ? '#22c55e' : '#ef4444';
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Stats
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.textBaseline = 'top';
    ctx.fillText(`Height: ${Math.floor(this.state.maxHeight)}m  ·  Best Combo: ×${this.state.maxCombo}`, W / 2, cardY + 180);

    // CTA
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.textBaseline = 'middle';
    const pulse = 0.6 + Math.sin(this.state.time * 0.08) * 0.4;
    ctx.globalAlpha = pulse;
    ctx.fillText('TAP TO PLAY AGAIN', W / 2, cardY + 220);
    ctx.globalAlpha = 1;

    // Share hint
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#4b5563';
    ctx.fillText('"Beat me. Jump Much."', W / 2, cardY + 250);
  }

  gameLoop = () => {
    if (!this.running) return;
    this.update();
    this.state.time++;
    this.render();
    this.animFrame = requestAnimationFrame(this.gameLoop);
  };

  start() {
    this.running = true;
    this.startLoading();
    this.animFrame = requestAnimationFrame(this.gameLoop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.animFrame);
  }
}
