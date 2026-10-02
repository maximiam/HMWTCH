import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setLoaded(true), 300);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Floating candles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${8 + i * 8}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          >
            <div className={`w-3 ${i % 3 === 0 ? 'bg-green-500/30' : i % 3 === 1 ? 'bg-red-500/30' : 'bg-yellow-500/30'} rounded-sm`}
              style={{ height: `${30 + Math.random() * 60}px` }}
            />
          </div>
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />

      <div className={`relative z-10 text-center px-6 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Version badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-violet-300">v0.1 · Game Concept · Октябрь 2026</span>
        </div>

        {/* Main title */}
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            MUCH JUMP
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-400 mb-2 font-light">
          Telegram Mini App · Vertical Jumper · One-Thumb
        </p>
        
        {/* Slogan */}
        <p className="text-lg md:text-xl text-violet-300/80 mb-12 italic">
          "Jump Much. Hit a number. Join the question."
        </p>

        {/* Game art preview */}
        <div className="relative inline-block mb-8">
          <div className="w-64 h-48 md:w-80 md:h-56 rounded-2xl overflow-hidden border border-violet-500/30 shadow-2xl shadow-violet-500/20 animate-float">
            <img 
              src="https://image.qwenlm.ai/generated-images/f3b27366-0ef4-45d3-84a6-db4e32f9e1ff/_result.png" 
              alt="MUCH JUMP game preview - dog jumping on candle platforms"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-violet-500/10 rounded-3xl blur-xl -z-10" />
        </div>

        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="glass-card px-4 py-2 rounded-lg">
            <span className="text-green-400 font-mono">30–90s</span>
            <span className="text-gray-500 ml-2">per run</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-lg">
            <span className="text-yellow-400 font-mono">Phaser 3</span>
            <span className="text-gray-500 ml-2">+ Supabase</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-lg">
            <span className="text-fuchsia-400 font-mono">Doodle Jump</span>
            <span className="text-gray-500 ml-2">× Crypto</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-violet-500/40 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-violet-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
