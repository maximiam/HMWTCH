import { useEffect, useRef } from 'react';

export default function Scoring() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="scoring" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/5 to-transparent" />
      
      <div ref={ref} className="section-reveal max-w-5xl mx-auto relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📊</span>
          <span className="text-sm text-green-400 uppercase tracking-widest font-mono">03 · Scoring</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Скоринг и связь с брендом
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card rounded-2xl p-6 border-t-2 border-green-500">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-green-300 mb-2">Closing Price</h3>
            <p className="text-gray-400 text-sm">
              Финальная точка личного чарта (последняя подтверждённая свеча) конвертируется в «$» по курсу сезона.
            </p>
            <div className="mt-4 px-3 py-2 bg-green-500/10 rounded-lg font-mono text-green-400 text-sm">
              Season 1: 1 м = $1
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border-t-2 border-violet-500">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-lg font-semibold text-violet-300 mb-2">Personal Best</h3>
            <p className="text-gray-400 text-sm">
              Твой стоящий прогноз на стене. Обновил PB — обновил прогноз.
            </p>
            <div className="mt-4 px-3 py-2 bg-violet-500/10 rounded-lg text-violet-400 text-sm">
              «update my oracle»
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border-t-2 border-yellow-500">
            <div className="text-3xl mb-3">⚖️</div>
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">Честность</h3>
            <p className="text-gray-400 text-sm">
              Считается именно close чарта, а не максимум — механика честна к метафоре рынка.
            </p>
            <div className="mt-4 px-3 py-2 bg-yellow-500/10 rounded-lg text-yellow-400 text-sm">
              no pump & dump
            </div>
          </div>
        </div>

        {/* Key principle */}
        <div className="glass-card rounded-2xl p-8 border border-violet-500/30">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🚫</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Zero Promises</h3>
              <p className="text-gray-400">
                Никаких денежных/токенных наград: только слава, пины и косметика.
                Комплаенс + философия «zero promises».
              </p>
            </div>
          </div>
        </div>

        {/* Score card mockup */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="glass-card rounded-2xl p-6 animate-pulse-glow">
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">My Oracle</p>
              <p className="text-5xl font-black text-green-400 green-glow mb-2">$4,200</p>
              <p className="text-gray-400 text-sm mb-4">I hit $4.2K. My answer for $HMWTCH: 4.2K</p>
              <div className="flex gap-2 justify-center">
                <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm transition-colors">
                  Share 📤
                </button>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm transition-colors">
                  Beat me 🏃
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
