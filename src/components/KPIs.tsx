import { useEffect, useRef } from 'react';

export default function KPIs() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const kpis = [
    { metric: 'D1 Retention', target: '≥ 35%', icon: '📈', colorClass: 'text-green-400' },
    { metric: 'D7 Retention', target: '≥ 15%', icon: '📊', colorClass: 'text-green-400' },
    { metric: 'Runs / DAU', target: '≥ 4', icon: '🔄', colorClass: 'text-violet-400' },
    { metric: 'Share Rate', target: '≥ 12%', icon: '📤', colorClass: 'text-fuchsia-400' },
    { metric: 'TG-подписчики', target: '≥ 10%/нед', icon: '👥', colorClass: 'text-cyan-400' },
    { metric: 'X-посты', target: '≥ 2× базовой', icon: '📱', colorClass: 'text-yellow-400' },
  ];

  return (
    <section id="kpi" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent" />
      
      <div ref={ref} className="section-reveal max-w-5xl mx-auto relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📈</span>
          <span className="text-sm text-violet-400 uppercase tracking-widest font-mono">09 · KPIs</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-12">KPI игры</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.metric} className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">{kpi.icon}</div>
              <p className="text-gray-400 text-sm mb-1">{kpi.metric}</p>
              <p className={`text-2xl font-bold ${kpi.colorClass}`}>{kpi.target}</p>
            </div>
          ))}
        </div>

        {/* Additional note */}
        <div className="mt-8 glass-card rounded-2xl p-6 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-yellow-300">Медиана просмотров</span> X-постов с game-карточками ≥ 2× базовой.
                Конверсия в holders — вторично, смотрим UTM pinned-поста.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
