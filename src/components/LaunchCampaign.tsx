import { useEffect, useRef } from 'react';

export default function LaunchCampaign() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const posts = [
    {
      num: 1,
      type: 'Тизер',
      icon: '👁️',
      content: 'Силуэт Much на свече-трамплине',
      subtitle: '«much is building something. it jumps.»',
      borderClass: 'border-l-violet-500',
      iconBg: 'bg-violet-500/20',
      badgeClass: 'text-violet-400 bg-violet-500/10',
    },
    {
      num: 2,
      type: 'Бета',
      icon: '🧪',
      content: 'Oracles first: top-10 предсказаний недели получают ранний доступ',
      subtitle: 'сид-коды в реплаях',
      borderClass: 'border-l-fuchsia-500',
      iconBg: 'bg-fuchsia-500/20',
      badgeClass: 'text-fuchsia-400 bg-fuchsia-500/10',
    },
    {
      num: 3,
      type: 'Launch',
      icon: '🚀',
      content: 'Трейлер-скринкаст 15 сек (ран + share-card) + кнопка Play в pinned',
      subtitle: 'полный запуск',
      borderClass: 'border-l-green-500',
      iconBg: 'bg-green-500/20',
      badgeClass: 'text-green-400 bg-green-500/10',
    },
  ];

  return (
    <section id="launch" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-950/5 to-transparent" />
      
      <div ref={ref} className="section-reveal max-w-5xl mx-auto relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🎯</span>
          <span className="text-sm text-fuchsia-400 uppercase tracking-widest font-mono">10 · Launch Campaign</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-4">Запуск-кампания</h2>
        <p className="text-gray-400 text-lg mb-12">3 поста + пин</p>

        {/* Posts timeline */}
        <div className="space-y-6 mb-12">
          {posts.map((post) => (
            <div key={post.num} className={`glass-card rounded-2xl p-6 border-l-4 ${post.borderClass} hover:translate-x-2 transition-transform`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${post.iconBg} flex items-center justify-center text-2xl shrink-0`}>
                  {post.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${post.badgeClass}`}>
                      POST {post.num}
                    </span>
                    <span className="text-sm font-semibold text-white">{post.type}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-1">{post.content}</p>
                  <p className="text-gray-500 text-xs italic">{post.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Much Report integration */}
        <div className="glass-card rounded-2xl p-6 border border-cyan-500/20">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📰</span>
            <h3 className="font-semibold text-cyan-300">Daily Much Report</h3>
          </div>
          <div className="px-4 py-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <p className="text-sm text-cyan-200 font-mono">
              «Game: beta live. Oracles jumping: [N].»
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
