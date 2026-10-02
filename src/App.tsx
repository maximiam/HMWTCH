import { useState } from 'react';
import HeroSection from './components/HeroSection';
import CoreIdea from './components/CoreIdea';
import GameCycle from './components/GameCycle';
import Scoring from './components/Scoring';
import SocialFeatures from './components/SocialFeatures';
import HolderGate from './components/HolderGate';
import Seasons from './components/Seasons';
import ArtSound from './components/ArtSound';
import MVPRoadmap from './components/MVPRoadmap';
import KPIs from './components/KPIs';
import LaunchCampaign from './components/LaunchCampaign';
import Compliance from './components/Compliance';
import Navigation from './components/Navigation';
import GameScreen from './components/GameScreen';

type View = 'concept' | 'game';

function App() {
  const [view, setView] = useState<View>('concept');

  if (view === 'game') {
    return (
      <div className="relative">
        {/* Back button */}
        <button
          onClick={() => setView('concept')}
          className="fixed top-3 left-3 z-50 px-3 py-1.5 bg-violet-600/90 hover:bg-violet-500 rounded-lg text-xs font-semibold transition-colors backdrop-blur-sm border border-violet-500/30 flex items-center gap-1.5"
        >
          <span>←</span>
          <span>Concept Doc</span>
        </button>
        <GameScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans relative">
      {/* Play Game floating button */}
      <button
        onClick={() => setView('game')}
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl font-bold text-white shadow-lg shadow-violet-500/30 transition-all hover:scale-105 flex items-center gap-2">
          <span className="text-lg">🎮</span>
          <span>Play Game</span>
        </div>
        <div className="absolute inset-0 bg-violet-500/20 rounded-xl blur-lg -z-10 animate-pulse" />
      </button>

      <Navigation />
      <HeroSection />
      
      {/* Quick play banner */}
      <div className="max-w-3xl mx-auto px-6 -mt-4 mb-8">
        <button
          onClick={() => setView('game')}
          className="w-full glass-card rounded-xl p-4 flex items-center justify-between hover:border-violet-500/40 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🕹️</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Try the playable demo</p>
              <p className="text-xs text-gray-500">Jump on candles, hit a number, share your oracle</p>
            </div>
          </div>
          <span className="text-violet-400 group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      <CoreIdea />
      <GameCycle />
      <Scoring />
      <SocialFeatures />
      <HolderGate />
      <Seasons />
      <ArtSound />
      <MVPRoadmap />
      <KPIs />
      <LaunchCampaign />
      <Compliance />
    </div>
  );
}

export default App;
