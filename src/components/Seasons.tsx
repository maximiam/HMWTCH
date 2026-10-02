import { useEffect, useRef } from 'react';

const seasons = [
  {
    num: 1,
    name: 'The Curve',
    biomes: ['Луг', 'Гараж', 'Ночной город'],
    status: 'current',
    color: 'violet',
    icon: '🌿',
  },
  {
    num: 2,
    name: 'Crypto City',
    biomes: ['DOGE-district (золотая пустыня)', 'PEPE-district (зелёное болото)', 'SOLANA-district (неон-тил)', 'WIF-district (розовые облака)', 'HMWTCH-district (стройка)'],
    status: 'planned',
    color: 'cyan',
    icon: '🏙️',
  },
];

export default function Seasons() {
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
    <section id="seasons" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent" />
      
      <div ref={ref} className="section-reveal max-w-6xl mx-auto relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🗺️</span>
          <span className="text-sm text-cyan-400 uppercase tracking-widest font-mono">06 · Seasons & Biomes</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-4">Сезоны и биомы</h2>
        <p className="text-gray-400 text-lg mb-12">= лор Crypto City</p>

        {/* Season 1 */}
        <div className="glass-card rounded-2xl p-8 mb-6 border-l-4 border-violet-500">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🌿</span>
            <div>
              <h3 className="text-xl font-bold text-violet-300">Season 1: «The Curve»</h3>
              <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">CURRENT</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {seasons[0].biomes.map((b) => (
              <span key={b} className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg text-sm text-violet-200">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Season 2 */}
        <div className="glass-card rounded-2xl p-8 mb-8 border-l-4 border-cyan-500">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏙️</span>
            <div>
              <h3 className="text-xl font-bold text-cyan-300">Season 2+: Crypto City</h3>
              <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">PLANNED</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {seasons[1].biomes.map((b, i) => (
              <div key={b} className="px-4 py-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                <p className="text-sm text-cyan-200">{b}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <p className="text-sm text-amber-200">
              <span className="font-semibold">Финальный биом — участок HMWTCH:</span> прыгаешь по стройке своего района
              (палатка → домик → башня; визуал обновляется по milestones аккаунта)
            </p>
          </div>
        </div>

        {/* Season info */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">4 недели</p>
            <p className="text-gray-500 text-sm">длительность сезона</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">Синхронно с X</p>
            <p className="text-gray-500 text-sm">контент-сезонами</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">Сброс + новый коэф.</p>
            <p className="text-gray-500 text-sm">лидерборда и курса метра</p>
          </div>
        </div>
      </div>
    </section>
  );
}
