import { useEffect, useRef } from 'react';

export default function Compliance() {
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
    <section id="compliance" className="py-24 px-6 relative">
      <div ref={ref} className="section-reveal max-w-5xl mx-auto relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">⚖️</span>
          <span className="text-sm text-gray-400 uppercase tracking-widest font-mono">11 · Compliance</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-12">Комплаенс</h2>

        <div className="glass-card rounded-2xl p-8 border border-red-500/20 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-red-300 mb-2">Футер игры</h3>
              <p className="text-gray-300 text-sm leading-relaxed italic">
                «$HMWTCH is a meme experiment, not an investment. It can go to zero. Not financial advice.»
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-5">
            <div className="text-2xl mb-2">🚫</div>
            <h4 className="font-semibold text-white text-sm mb-1">Нет наград токенами</h4>
            <p className="text-gray-500 text-xs">Лидерборд = слава</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="text-2xl mb-2">🧢</div>
            <h4 className="font-semibold text-white text-sm mb-1">Холдер-гейт = косметика</h4>
            <p className="text-gray-500 text-xs">Не преимущество в игре</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="text-2xl mb-2">🔞</div>
            <h4 className="font-semibold text-white text-sm mb-1">Возрастной gate</h4>
            <p className="text-gray-500 text-xs">Telegram + дисклеймер на входе</p>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-12 glass-card rounded-2xl p-8 border border-violet-500/30 animate-pulse-glow">
          <h3 className="text-xl font-bold text-violet-300 mb-4">Суть в трёх строках</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-400 font-bold text-lg shrink-0">1.</span>
              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="text-white font-semibold">Vertical jumper:</span> Much скачет по свечам (зелёные — держат, красные — трескаются, кот — супер-подброс и осуждение); высота рана превращается в «$-число» — твой личный ответ на главный вопрос бренда.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold text-lg shrink-0">2.</span>
              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="text-white font-semibold">Каждое число = заявка на Oracle Wall</span> + daily seed-лидерборд («Oracle of the Day» уже встроен в контент-рубрики X); share-card рана в sticker-стиле = внешний виральный крюк.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-fuchsia-400 font-bold text-lg shrink-0">3.</span>
              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="text-white font-semibold">Ноль pay-to-win и токен-наград:</span> холдер-гейт даёт косметику (золотая кепка, cat-companion), milestones аккаунта открывают скины всем, биомы сезонов = районы нашей карты Crypto City (финальный биом — участок HMWTCH с растущей башней).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-800 bg-gray-900/50">
            <span className="text-sm text-gray-500">MUCH JUMP · v0.1 · Game Concept Document</span>
          </div>
          <p className="text-gray-700 text-xs mt-4">
            HOW MUCH WILL YOU HIT? · October 2026
          </p>
        </div>
      </div>
    </section>
  );
}
