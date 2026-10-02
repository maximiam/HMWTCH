import { useEffect, useRef } from 'react';

export default function MVPRoadmap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const phases = [
    {
      phase: 'P0',
      title: 'Core',
      duration: '1–2 недели',
      borderClass: 'border-l-green-500',
      dotClass: 'bg-green-500/20 border-green-500 text-green-400',
      badgeClass: 'bg-green-500/10 text-green-400',
      items: [
        'Ран-луп',
        '3 типа платформ',
        'Кот',
        'Daily seed',
        'Лидерборд дня',
        'Share-card',
        'Лоадер-кот',
      ],
    },
    {
      phase: 'P1',
      title: 'Social',
      duration: '+2 недели',
      borderClass: 'border-l-violet-500',
      dotClass: 'bg-violet-500/20 border-violet-500 text-violet-400',
      badgeClass: 'bg-violet-500/10 text-violet-400',
      items: [
        'Косметика + wallet-гейт',
        'Лиги друзей',
        'Пуши',
      ],
    },
    {
      phase: 'P2',
      title: 'Seasons',
      duration: '+4 недели',
      borderClass: 'border-l-cyan-500',
      dotClass: 'bg-cyan-500/20 border-cyan-500 text-cyan-400',
      badgeClass: 'bg-cyan-500/10 text-cyan-400',
      items: [
        'Биомы Crypto City',
        'Oracle Wall веб-страница',
        'Fam squads',
        'Milestones-ивенты',
      ],
    },
  ];

  const stack = [
    { name: 'Phaser 3', desc: 'Game engine', icon: '🎮' },
    { name: 'TypeScript', desc: 'Language', icon: '📘' },
    { name: 'Supabase', desc: 'Auth + Scores', icon: '⚡' },
    { name: 'Vercel/CF Pages', desc: 'Hosting', icon: '🌐' },
  ];

  const team = [
    { role: '1 dev', desc: 'Phaser/TS', icon: '💻' },
    { role: '1 artist', desc: 'Сборщик ассетов', icon: '🎨' },
    { role: '1 SMM', desc: 'Ивенты/рубрики', icon: '📱' },
  ];

  return (
    <section id="mvp" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/5 to-transparent" />
      
      <div ref={ref} className="section-reveal max-w-6xl mx-auto relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🚀</span>
          <span className="text-sm text-green-400 uppercase tracking-widest font-mono">08 · MVP & Phases</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-12">MVP и фазы</h2>

        {/* Timeline */}
        <div className="relative mb-12">
          {/* Connection line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-violet-500 to-cyan-500 hidden md:block" />
          
          <div className="space-y-6">
            {phases.map((p) => (
              <div key={p.phase} className="relative flex gap-6">
                {/* Phase dot */}
                <div className={`hidden md:flex w-12 h-12 rounded-full border-2 items-center justify-center font-bold shrink-0 z-10 ${p.dotClass}`}>
                  {p.phase}
                </div>
                
                {/* Phase card */}
                <div className={`glass-card rounded-2xl p-6 flex-1 border-l-4 ${p.borderClass}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        <span className="md:hidden text-sm text-gray-500 mr-2">{p.phase}</span>
                        {p.title}
                      </h3>
                      <p className="text-gray-500 text-sm">{p.duration}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono ${p.badgeClass}`}>
                      {p.phase}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.items.map((item) => (
                      <span key={item} className="px-2.5 py-1 bg-gray-800/50 rounded-lg text-xs text-gray-300">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Стек P0</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stack.map((s) => (
              <div key={s.name} className="text-center p-3 bg-gray-800/30 rounded-xl">
                <div className="text-2xl mb-1">{s.icon}</div>
                <p className="text-sm font-semibold text-white">{s.name}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Команда MVP</h3>
          <div className="grid grid-cols-3 gap-4">
            {team.map((t) => (
              <div key={t.role} className="text-center p-4 bg-gray-800/30 rounded-xl">
                <div className="text-3xl mb-2">{t.icon}</div>
                <p className="text-sm font-semibold text-white">{t.role}</p>
                <p className="text-xs text-gray-500">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
