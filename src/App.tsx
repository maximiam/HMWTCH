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

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans">
      <Navigation />
      <HeroSection />
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
