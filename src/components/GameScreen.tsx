import { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine, ChartPoint } from '../game/engine';
import { sound } from '../game/sound';

interface GameResult {
  score: number;
  closingPrice: number;
  chartPoints: ChartPoint[];
  maxCombo: number;
}

export default function GameScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    try {
      const saved = localStorage.getItem('muchjump_best');
      return saved ? parseInt(saved) : 0;
    } catch {
      return 0;
    }
  });

  const handleResize = useCallback(() => {
    if (!containerRef.current || !canvasRef.current || !engineRef.current) return;
    
    const maxWidth = Math.min(420, window.innerWidth - 16);
    const maxHeight = Math.min(720, window.innerHeight - 100);
    
    canvasRef.current.width = maxWidth;
    canvasRef.current.height = maxHeight;
    canvasRef.current.style.width = `${maxWidth}px`;
    canvasRef.current.style.height = `${maxHeight}px`;
    
    engineRef.current.resize(maxWidth, maxHeight);
  }, []);

  // Initialize audio on first user interaction
  useEffect(() => {
    const initAudio = () => {
      sound.init();
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
    document.addEventListener('click', initAudio);
    document.addEventListener('touchstart', initAudio);
    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const maxWidth = Math.min(420, window.innerWidth - 16);
    const maxHeight = Math.min(720, window.innerHeight - 100);
    canvas.width = maxWidth;
    canvas.height = maxHeight;

    const engine = new GameEngine(canvas);
    engineRef.current = engine;

    engine.onScoreUpdate = () => {
      // Could update external state here if needed
    };

    engine.onGameOver = (score, closingPrice, chartPoints, maxCombo) => {
      setGameResult({ score, closingPrice, chartPoints, maxCombo });
      if (closingPrice > bestScore) {
        setBestScore(closingPrice);
        try {
          localStorage.setItem('muchjump_best', closingPrice.toString());
        } catch {
          // ignore
        }
      }
    };

    engine.start();
    window.addEventListener('resize', handleResize);

    return () => {
      engine.stop();
      engine.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, bestScore]);

  const handleShare = () => {
    setShowShareCard(true);
  };

  const closeShareCard = () => {
    setShowShareCard(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Header */}
      <div className="w-full max-w-[420px] px-4 py-2 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-base">🐕</span>
          <span className="text-xs font-bold text-violet-400 tracking-wide">MUCH JUMP</span>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          PB: <span className="text-yellow-400">${bestScore.toLocaleString()}</span>
        </div>
      </div>

      {/* Game Canvas */}
      <div ref={containerRef} className="relative flex items-center justify-center flex-1 w-full">
        <canvas
          ref={canvasRef}
          className="rounded-xl border border-violet-500/20 shadow-2xl shadow-violet-900/30 touch-none"
        />
      </div>

      {/* Bottom bar */}
      <div className="w-full max-w-[420px] px-4 py-2 flex items-center justify-between relative z-10">
        <div className="text-[10px] text-gray-600 font-mono">
          tap left/right to move
        </div>
        {gameResult && (
          <button
            onClick={handleShare}
            className="px-3 py-1 bg-violet-600/80 hover:bg-violet-500 rounded-lg text-[10px] font-semibold transition-colors border border-violet-500/30"
          >
            Share 📤
          </button>
        )}
      </div>

      {/* Share Card Modal */}
      {showShareCard && gameResult && (
        <ShareCard result={gameResult} onClose={closeShareCard} />
      )}

      {/* Compliance */}
      <div className="absolute bottom-1 left-0 right-0 text-center pointer-events-none">
        <p className="text-[9px] text-gray-700">
          $HMWTCH is a meme experiment · Not financial advice
        </p>
      </div>
    </div>
  );
}

function ShareCard({ result, onClose }: { result: GameResult; onClose: () => void }) {
  const today = new Date();
  const seedStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

  const handleShareClick = () => {
    const text = `I hit $${result.closingPrice.toLocaleString()} in MUCH JUMP 🐕📈\n\nMy answer for $HMWTCH: $${result.closingPrice.toLocaleString()}\nBest combo: ×${result.maxCombo}\nDaily seed: ${seedStr}\n\nBeat me. Jump Much.\n\n#HMWTCH #MuchJump`;
    
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
      }).catch(() => {
        alert(text);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative max-w-sm w-full">
        <div className="bg-gradient-to-b from-[#0f0f23] to-[#1a1035] rounded-2xl border border-violet-500/30 p-5 shadow-2xl shadow-violet-500/10">
          {/* Header */}
          <div className="text-center mb-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">MUCH JUMP · Oracle Card</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">🐕</span>
              <span className="text-sm font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                HOW MUCH WILL YOU HIT?
              </span>
            </div>
          </div>

          {/* Score */}
          <div className="text-center py-3">
            <p className="text-xs text-gray-400 mb-1">I hit</p>
            <p className="text-4xl font-black text-green-400" style={{ textShadow: '0 0 20px rgba(34,197,94,0.4)' }}>
              ${result.closingPrice.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">My answer for $HMWTCH</p>
          </div>

          {/* Mini chart */}
          <div className="bg-black/30 rounded-xl p-3 mb-3">
            <svg viewBox="0 0 200 50" className="w-full h-12">
              {result.chartPoints.length > 1 && (() => {
                const points = result.chartPoints;
                const minY = Math.min(...points.map(p => p.y));
                const maxY = Math.max(...points.map(p => p.y));
                const range = maxY - minY || 1;
                
                const pathData = points.map((p, i) => {
                  const x = (i / (points.length - 1)) * 196 + 2;
                  const y = 48 - ((p.y - minY) / range) * 44 - 2;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ');

                return (
                  <>
                    <path d={pathData} fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.8" />
                    {points.filter((_, i) => i % Math.max(1, Math.floor(points.length / 15)) === 0).map((p, i) => {
                      const x = (i / (points.length - 1)) * 196 + 2;
                      const y = 48 - ((p.y - minY) / range) * 44 - 2;
                      return (
                        <circle key={i} cx={x} cy={y} r="2" fill={p.green ? '#22c55e' : '#ef4444'} />
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>

          {/* Stats */}
          <div className="flex justify-between text-[10px] text-gray-500 mb-3 px-1">
            <span>Height: {Math.floor(result.score)}m</span>
            <span>Combo: ×{result.maxCombo}</span>
            <span>seed: {seedStr}</span>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-xs text-violet-300 italic mb-3">"Beat me. Jump Much."</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleShareClick}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold transition-colors"
              >
                Share 📤
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[9px] text-gray-700 mt-2">
          $HMWTCH is a meme experiment · Not financial advice
        </p>
      </div>
    </div>
  );
}
