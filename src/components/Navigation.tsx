import { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', label: '🏠 Home' },
  { id: 'core', label: '💡 Core' },
  { id: 'cycle', label: '🎮 Cycle' },
  { id: 'scoring', label: '📊 Scoring' },
  { id: 'social', label: '🌐 Social' },
  { id: 'holder', label: '🔑 Holder' },
  { id: 'seasons', label: '🗺️ Seasons' },
  { id: 'art', label: '🎨 Art' },
  { id: 'mvp', label: '🚀 MVP' },
  { id: 'kpi', label: '📈 KPIs' },
  { id: 'launch', label: '🎯 Launch' },
];

export default function Navigation() {
  const [active, setActive] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPos = window.scrollY + window.innerHeight / 3;
      
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActive(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed right-4 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex flex-col gap-3">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group relative flex items-center justify-end"
            onClick={() => setActive(section.id)}
          >
            <span className="absolute right-8 bg-violet-900/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {section.label}
            </span>
            <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
              active === section.id 
                ? 'bg-violet-500 border-violet-400 scale-125 shadow-lg shadow-violet-500/50' 
                : 'bg-transparent border-gray-600 hover:border-violet-400'
            }`} />
          </a>
        ))}
      </div>
    </nav>
  );
}
