import { useEffect, useRef } from 'react';

export default function CoreIdea() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="core" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent" />
      
      <div ref={ref} className="section-reveal max-w-5xl mx-auto relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">💡</span>
          <span className="text-sm text-violet-400 uppercase tracking-widest font-mono">01 · Core Idea</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
          Игра буквально играет
          <span className="text-violet-400"> главный вопрос бренда</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card rounded-2xl p-8">
            <div className="text-5xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-3 text-violet-300">Высота = Ответ</h3>
            <p className="text-gray-400 leading-relaxed">
              Высота твоего забега = твой личный ответ на «How Much Will This Coin Hit?»
              Каждый ран заканчивается числом — это твоё предсказание.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="text-5xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold mb-3 text-violet-300">Oracle Wall</h3>
            <p className="text-gray-400 leading-relaxed">
              Предсказание попадает на Oracle Wall и в лидерборд.
              Игра = UGC-машина предсказаний, упакованная в залипательный джампер.
            </p>
          </div>
        </div>

        {/* Visual metaphor */}
        <div className="mt-12 glass-card rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-gray-500 text-sm mb-1">Формула бренда</p>
              <p className="text-2xl font-mono">
                <span className="text-green-400">jump_height</span>
                <span className="text-gray-600"> → </span>
                <span className="text-yellow-400">$price</span>
                <span className="text-gray-600"> → </span>
                <span className="text-violet-400">oracle</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Слоган</p>
              <p className="text-lg italic text-fuchsia-300">"Jump Much. Hit a number."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
