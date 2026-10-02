import { useEffect, useRef } from 'react';

export default function SocialFeatures() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="social" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-950/5 to-transparent" />
      
      <div ref={ref} className="section-reveal max-w-6xl mx-auto relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🌐</span>
          <span className="text-sm text-fuchsia-400 uppercase tracking-widest font-mono">04 · Social & Virality</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-12">
          Социалка и виральность
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Daily Seed */}
          <div className="glass-card rounded-2xl p-6 group hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl">🌱</div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-300">Daily Seed</h3>
                <p className="text-gray-500 text-xs">Одна раскладка на всех в сутки</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              Честный дневной лидерборд + тема для daily wrap.
            </p>
            <div className="px-3 py-2 bg-cyan-500/10 rounded-lg text-cyan-400 text-xs font-mono">
              "today's oracle hit $12.4K in-game"
            </div>
          </div>

          {/* Friend Leagues */}
          <div className="glass-card rounded-2xl p-6 group hover:border-pink-500/40 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-2xl">👥</div>
              <div>
                <h3 className="text-lg font-semibold text-pink-300">Лиги друзей</h3>
                <p className="text-gray-500 text-xs">Топ-3 друзей обгоняют тебя</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              Персональные пуши с подколами.
            </p>
            <div className="px-3 py-2 bg-pink-500/10 rounded-lg text-pink-400 text-xs font-mono">
              "@handle hit $9.1K. your $8.7K is laughing at you."
            </div>
          </div>

          {/* Share Card */}
          <div className="glass-card rounded-2xl p-6 group hover:border-violet-500/40 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-2xl">🎴</div>
              <div>
                <h3 className="text-lg font-semibold text-violet-300">Share-Card</h3>
                <p className="text-gray-500 text-xs">Sticker-стиль бренда</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              Автогенерация из ран-статов. Главный внешний виральный крюк.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-blue-500/20 rounded text-blue-400 text-xs">TG</span>
              <span className="px-2 py-1 bg-sky-500/20 rounded text-sky-400 text-xs">X/Twitter</span>
            </div>
          </div>

          {/* Fam Squad */}
          <div className="glass-card rounded-2xl p-6 group hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">🫂</div>
              <div>
                <h3 className="text-lg font-semibold text-amber-300">Fam Squad</h3>
                <p className="text-gray-500 text-xs">Клан-механика lite</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              До 5 человек, суммарная высота за неделю → значок в wrap.
            </p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xs">
                  {['🐕', '🐱', '🦊', '🐸', '🐰'][i]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* X Integration */}
        <div className="mt-8 glass-card rounded-2xl p-6 border border-sky-500/20">
          <div className="flex items-center gap-4">
            <div className="text-4xl">𝕏</div>
            <div>
              <h3 className="text-lg font-semibold text-sky-300">Кросс-интеграция с X</h3>
              <p className="text-gray-400 text-sm">
                Еженедельный топ-10 игры постится в <span className="text-sky-400 font-semibold">SUNDAY MATH</span> как «game oracles»
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
