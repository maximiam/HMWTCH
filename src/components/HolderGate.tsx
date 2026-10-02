import { useEffect, useRef } from 'react';

export default function HolderGate() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const cosmetics = [
    { name: 'Золотая кепка', icon: '🧢', rarity: 'Day-1' },
    { name: 'След-искорки', icon: '✨', rarity: 'Day-1' },
    { name: 'Бейдж в лидерборде', icon: '🏅', rarity: 'Day-1' },
  ];

  const milestones = [
    { holders: '500', reward: 'Шарф-Uptober скин', icon: '🧣' },
    { holders: '1,000', reward: 'Cat-companion на плече', icon: '🐱' },
    { holders: 'Graduation', reward: 'Ракета-трейл', icon: '🚀' },
  ];

  return (
    <section id="holder" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/5 to-transparent" />
      
      <div ref={ref} className="section-reveal max-w-5xl mx-auto relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🔑</span>
          <span className="text-sm text-amber-400 uppercase tracking-widest font-mono">05 · Holder Gate</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Холдер-гейт и токен-связка
        </h2>
        <p className="text-amber-300/80 text-lg mb-12 font-medium">Без pay-to-win</p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Wallet Connect */}
          <div className="glass-card rounded-2xl p-6 border border-amber-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">◎</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Wallet Connect</h3>
                <p className="text-gray-500 text-xs">Solana, опционально</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              ≥1 $HMWTCH = косметика «Day-1 Fam»:
            </p>
            <div className="space-y-2">
              {cosmetics.map((c) => (
                <div key={c.name} className="flex items-center gap-3 px-3 py-2 bg-amber-500/10 rounded-lg">
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-sm text-amber-200">{c.name}</span>
                  <span className="ml-auto text-xs text-amber-500/60 px-2 py-0.5 bg-amber-500/10 rounded">{c.rarity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="glass-card rounded-2xl p-6 border border-violet-500/20">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span>🎯</span> Milestones аккаунта
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Открывают скины <span className="text-violet-300">всем</span>:
            </p>
            <div className="space-y-3">
              {milestones.map((m) => (
                <div key={m.holders} className="flex items-center gap-3 px-3 py-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-white">{m.reward}</p>
                    <p className="text-xs text-violet-400">{m.holders} holders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Join button */}
        <div className="glass-card rounded-2xl p-6 text-center border border-green-500/20">
          <p className="text-gray-400 text-sm mb-3">Единственная нативная кнопка в игре:</p>
          <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold text-white hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg shadow-green-500/20">
            join the experiment →
          </button>
          <p className="text-gray-600 text-xs mt-3">pump.fun-ссылка в профиле Mini App · в ране не мельтешит</p>
        </div>
      </div>
    </section>
  );
}
