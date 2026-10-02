import { useEffect, useRef } from 'react';

export default function ArtSound() {
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
    <section id="art" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-950/5 to-transparent" />
      
      <div ref={ref} className="section-reveal max-w-6xl mx-auto relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🎨</span>
          <span className="text-sm text-pink-400 uppercase tracking-widest font-mono">07 · Art & Sound</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-12">Арт и звук</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Sprites */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-pink-300 mb-4 flex items-center gap-2">
              <span>🖼️</span> Спрайты
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                Much: jump / flip / hit / sleep-run
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                Свечи-платформы 4 типов
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                Кот-платформа (3 состояния)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                Паверапы (кофе, смузи, ракета, луна)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                Фоны биомов (мемы-сеттинги)
              </li>
            </ul>
            <div className="mt-4 p-3 bg-pink-500/10 rounded-lg">
              <p className="text-xs text-pink-300">
                <span className="font-semibold">База:</span> LoRA-датасет + sticker-raws
              </p>
            </div>
          </div>

          {/* Generation Pipeline */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-pink-300 mb-4 flex items-center gap-2">
              <span>⚙️</span> Генерация спрайтов
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1.5 bg-fuchsia-500/20 rounded-lg text-sm text-fuchsia-300">фон-маджента</span>
              <span className="text-gray-600">→</span>
              <span className="px-3 py-1.5 bg-violet-500/20 rounded-lg text-sm text-violet-300">chroma-key</span>
              <span className="text-gray-600">→</span>
              <span className="px-3 py-1.5 bg-green-500/20 rounded-lg text-sm text-green-300">transparent 512</span>
            </div>
            <p className="text-gray-500 text-xs mt-3">Готовый пайплайн</p>
          </div>

          {/* UI */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-pink-300 mb-4 flex items-center gap-2">
              <span>📐</span> UI
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Шапка-логотип «HOW MUCH WILL YOU HIT?»</li>
              <li>• Кнопка-кепка</li>
              <li>• Карточка результата = wrap-карточка</li>
            </ul>
          </div>

          {/* Sound */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-pink-300 mb-4 flex items-center gap-2">
              <span>🔊</span> Звук
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎵</span>
                <div>
                  <p className="text-sm text-white">Lo-fi loop</p>
                  <p className="text-xs text-gray-500">70 bpm</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <div>
                  <p className="text-sm text-white">«Плинк» отскока</p>
                  <p className="text-xs text-gray-500">при каждом прыжке</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🐱</span>
                <div>
                  <p className="text-sm text-white">Мяв кота</p>
                  <p className="text-xs text-gray-500">на кот-платформе</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🎹</span>
                <div>
                  <p className="text-sm text-white">Одна пиано-нота</p>
                  <p className="text-xs text-gray-500">на Personal Best</p>
                </div>
              </div>
            </div>
            <div className="mt-4 px-3 py-2 bg-yellow-500/10 rounded-lg text-yellow-400 text-xs">
              «Made with AI» не скрываем
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
