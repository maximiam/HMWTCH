import { useEffect, useRef } from 'react';

const platforms = [
  { type: 'green', label: 'Зелёная свеча', desc: 'Ступень выше — цена рана растёт', icon: '🟢', borderClass: 'border-l-green-500' },
  { type: 'red', label: 'Красная свеча', desc: 'Честная ступень вниз — даун-кэндл рынка', icon: '🔴', borderClass: 'border-l-red-500' },
  { type: 'gold', label: 'Золотая свеча', desc: 'Редкий spike ×2', icon: '⭐', borderClass: 'border-l-yellow-500' },
  { type: 'cap', label: 'Кепка-платформа', desc: 'Щит на один промах', icon: '🧢', borderClass: 'border-l-violet-500' },
  { type: 'cat', label: 'Кот-платформа', desc: 'Супер-подброс + осуждение', icon: '🐱', borderClass: 'border-l-fuchsia-500' },
];

const powerups = [
  { name: 'Coffee', icon: '☕', desc: 'Ускорение' },
  { name: 'Smoothie', icon: '🥤', desc: 'Магнит свечей' },
  { name: 'Rocket', icon: '🚀', desc: 'Полёт 3 сек' },
  { name: 'Moon', icon: '🌙', desc: 'Финиш-гейт сезона' },
];

const hazards = [
  { name: 'Гэпы', desc: 'Упал в «подвал графика» — ран окончен', icon: '⚡' },
  { name: 'FUD-тучи', desc: 'Замедляют движение', icon: '🌧️' },
  { name: 'Волатильные зоны', desc: 'Свечи двигаются в ритме', icon: '📊' },
  { name: 'Сезонные листья', desc: 'Помехи на пути', icon: '🍂' },
];

export default function GameCycle() {
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
    <section id="cycle" className="py-24 px-6 relative">
      <div ref={ref} className="section-reveal max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🎮</span>
          <span className="text-sm text-violet-400 uppercase tracking-widest font-mono">02 · Game Cycle</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-4">Игровой цикл</h2>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl">
          30–90 сек на ран. Авто-раннер: Much бежит сам. Управление ОДНОЙ кнопкой.
          Ритм и тайминг решают всё.
        </p>

        {/* Flow diagram */}
        <div className="glass-card rounded-2xl p-6 mb-12 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-[600px] text-sm">
            <div className="px-4 py-2 bg-violet-500/20 border border-violet-500/40 rounded-lg text-violet-300 whitespace-nowrap">
              📱 Запуск из TG
            </div>
            <span className="text-violet-500">→</span>
            <div className="px-4 py-2 bg-fuchsia-500/20 border border-fuchsia-500/40 rounded-lg text-fuchsia-300 whitespace-nowrap">
              🐱 Лоадер-кот
            </div>
            <span className="text-violet-500">→</span>
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-lg text-green-300 whitespace-nowrap">
              🏃 Авто-ран
            </div>
            <span className="text-violet-500">→</span>
            <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/40 rounded-lg text-yellow-300 whitespace-nowrap">
              🕯️ Свечи-платформы
            </div>
            <span className="text-violet-500">→</span>
            <div className="px-4 py-2 bg-pink-500/20 border border-pink-500/40 rounded-lg text-pink-300 whitespace-nowrap">
              📊 Карточка результата
            </div>
            <span className="text-violet-500">→</span>
            <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-300 whitespace-nowrap">
              📤 Share в TG/X
            </div>
          </div>
        </div>

        {/* Platforms grid */}
        <h3 className="text-2xl font-semibold mb-6 text-violet-300">Платформы-свечи</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {platforms.map((p) => (
            <div key={p.type} className={`glass-card rounded-xl p-5 hover:scale-105 transition-transform cursor-default border-l-4 ${p.borderClass}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{p.icon}</span>
                <span className="font-semibold text-white">{p.label}</span>
              </div>
              <p className="text-gray-400 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Powerups */}
        <h3 className="text-2xl font-semibold mb-6 text-yellow-300">Паверапы</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {powerups.map((p) => (
            <div key={p.name} className="glass-card rounded-xl p-4 text-center hover:bg-yellow-500/5 transition-colors">
              <div className="text-4xl mb-2">{p.icon}</div>
              <div className="font-semibold text-white text-sm">{p.name}</div>
              <div className="text-gray-500 text-xs mt-1">{p.desc}</div>
            </div>
          ))}
        </div>

        {/* Hazards */}
        <h3 className="text-2xl font-semibold mb-6 text-red-300">Хазарды</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hazards.map((h) => (
            <div key={h.name} className="glass-card rounded-xl p-4 border border-red-500/20">
              <div className="text-2xl mb-2">{h.icon}</div>
              <div className="font-semibold text-white text-sm">{h.name}</div>
              <div className="text-gray-500 text-xs mt-1">{h.desc}</div>
            </div>
          ))}
        </div>

        {/* Chart visualization */}
        <div className="mt-12 glass-card rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-4">Визуал рана = рождение чарта $HMWTCH</p>
          <svg viewBox="0 0 600 150" className="w-full h-32">
            <path
              d="M 0 130 L 50 120 L 100 100 L 150 110 L 200 80 L 250 90 L 300 60 L 350 70 L 400 40 L 450 50 L 500 25 L 550 35 L 600 15"
              fill="none"
              stroke="url(#chartGradient)"
              strokeWidth="2.5"
              className="chart-line"
            />
            {[
              { x: 50, h: 30, green: true },
              { x: 100, h: 50, green: true },
              { x: 150, h: 40, green: false },
              { x: 200, h: 70, green: true },
              { x: 250, h: 60, green: false },
              { x: 300, h: 90, green: true },
              { x: 350, h: 80, green: false },
              { x: 400, h: 110, green: true },
              { x: 450, h: 100, green: false },
              { x: 500, h: 125, green: true },
              { x: 550, h: 115, green: false },
            ].map((c, i) => (
              <g key={i}>
                <line x1={c.x} y1={150 - c.h} x2={c.x} y2={150} stroke={c.green ? '#22c55e' : '#ef4444'} strokeWidth="1" opacity="0.5" />
                <rect
                  x={c.x - 6}
                  y={150 - c.h}
                  width="12"
                  height={c.h * 0.6}
                  fill={c.green ? '#22c55e' : '#ef4444'}
                  opacity="0.7"
                  rx="1"
                />
              </g>
            ))}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#d946ef" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}
