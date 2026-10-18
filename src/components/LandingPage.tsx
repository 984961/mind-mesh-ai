import React from 'react';
import { HeroSection } from './HeroSection';

interface LandingPageProps {
  onEnterWorkspace: (view?: string) => void;
  onWatchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterWorkspace, onWatchDemo }) => {
  return (
    <div className="flex-1 w-full flex flex-col justify-center overflow-hidden bg-[#030712] relative">
      <HeroSection
        onWatchDemo={onWatchDemo}
        onSelectFeature={(feature) => onEnterWorkspace(feature)}
      />
    </div>
  );
};
