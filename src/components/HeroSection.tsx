import React from 'react';
import { 
  FileText, 
  Search, 
  Users, 
  BarChart2, 
  GitBranch, 
  BookOpen, 
  Play 
} from 'lucide-react';

interface HeroSectionProps {
  onWatchDemo: () => void;
  onSelectFeature: (view: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onWatchDemo,
  onSelectFeature,
}) => {
  return (
    <section id="hero" className="relative w-full flex-1 min-h-[calc(100dvh-73px)] max-h-[calc(100dvh-73px)] flex flex-col items-center justify-center overflow-hidden bg-[#030712] py-2 px-4 sm:px-6 select-none">
      {/* 1. Cinematic Human-to-AI Neural Background (Bright & Visible) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/src/assets/images/hero_neural_mesh_bright_1792152865417.jpg"
          alt="MindMeshAI - Human Neural Mind and AI Android Mind Connected via Central Synaptic Sphere"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-95 scale-100"
        />
        {/* Soft, measured central gradient for high contrast readability of centered text */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#030712]/70 via-[#030712]/30 to-transparent" />
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#030712]/75 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#030712]/80 to-transparent" />
      </div>

      {/* 2. Main Hero Content Container (Centered in Viewport) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center my-auto">
        {/* Eyebrow */}
        <div className="text-[11px] sm:text-xs font-mono tracking-[0.25em] text-cyan-300 uppercase font-semibold mb-2 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
          THE FUTURE OF WORK
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-2 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          MindMesh<span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
        </h1>

        {/* Subtitle with dual color emphasis */}
        <p className="text-base sm:text-xl lg:text-2xl font-bold text-white mb-2 max-w-3xl text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Connecting <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">Human Intelligence</span> with <span className="text-fuchsia-400 drop-shadow-[0_0_20px_rgba(232,121,249,0.8)]">AI Intelligence</span>
        </p>

        {/* Supporting Message */}
        <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-xl mx-auto leading-relaxed mb-3 text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Access knowledge. Collaborate smarter. Make better decisions.<br className="hidden sm:inline" />
          Turn information into meaningful action.
        </p>

        {/* 3. Six Floating Feature Callouts Around Center Neural Sphere */}
        <div className="relative w-full max-w-4xl my-1 hidden md:block h-52 pointer-events-auto">
          {/* Left Feature 1: Documents — Extract & Understand */}
          <button
            onClick={() => onSelectFeature('documents')}
            className="absolute left-[12%] top-[10%] flex items-center gap-2.5 group text-left transition-all hover:scale-105 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-slate-950/85 border border-fuchsia-400/80 shadow-[0_0_20px_rgba(217,70,239,0.7)] flex items-center justify-center text-fuchsia-300 group-hover:border-fuchsia-300 transition-all backdrop-blur-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] group-hover:text-fuchsia-300 transition-colors">
                Documents
              </div>
              <div className="text-[10px] text-slate-300 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                Extract & Understand
              </div>
            </div>
          </button>

          {/* Left Feature 2: Knowledge — Search & Discover */}
          <button
            onClick={() => onSelectFeature('knowledge')}
            className="absolute left-[18%] top-[45%] flex items-center gap-2.5 group text-left transition-all hover:scale-105 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-slate-950/85 border border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.7)] flex items-center justify-center text-cyan-300 group-hover:border-cyan-300 transition-all backdrop-blur-sm">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] group-hover:text-cyan-300 transition-colors">
                Knowledge
              </div>
              <div className="text-[10px] text-slate-300 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                Search & Discover
              </div>
            </div>
          </button>

          {/* Left Feature 3: Meetings — Summarize & Act */}
          <button
            onClick={() => onSelectFeature('meetings')}
            className="absolute left-[14%] top-[80%] flex items-center gap-2.5 group text-left transition-all hover:scale-105 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-slate-950/85 border border-indigo-400/80 shadow-[0_0_20px_rgba(129,140,248,0.7)] flex items-center justify-center text-indigo-300 group-hover:border-indigo-300 transition-all backdrop-blur-sm">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] group-hover:text-indigo-300 transition-colors">
                Meetings
              </div>
              <div className="text-[10px] text-slate-300 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                Summarize & Act
              </div>
            </div>
          </button>

          {/* Right Feature 4: Data Analytics — Insights & Trends */}
          <button
            onClick={() => onSelectFeature('analytics')}
            className="absolute right-[12%] top-[10%] flex items-center gap-2.5 group text-right flex-row-reverse transition-all hover:scale-105 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-slate-950/85 border border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.7)] flex items-center justify-center text-cyan-300 group-hover:border-cyan-300 transition-all backdrop-blur-sm">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] group-hover:text-cyan-300 transition-colors">
                Data Analytics
              </div>
              <div className="text-[10px] text-slate-300 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                Insights & Trends
              </div>
            </div>
          </button>

          {/* Right Feature 5: Workflows — Automate & Execute */}
          <button
            onClick={() => onSelectFeature('workflows')}
            className="absolute right-[18%] top-[45%] flex items-center gap-2.5 group text-right flex-row-reverse transition-all hover:scale-105 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-slate-950/85 border border-fuchsia-400/80 shadow-[0_0_20px_rgba(217,70,239,0.7)] flex items-center justify-center text-fuchsia-300 group-hover:border-fuchsia-300 transition-all backdrop-blur-sm">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] group-hover:text-fuchsia-300 transition-colors">
                Workflows
              </div>
              <div className="text-[10px] text-slate-300 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                Automate & Execute
              </div>
            </div>
          </button>

          {/* Right Feature 6: Research — Explore & Validate */}
          <button
            onClick={() => onSelectFeature('assistant')}
            className="absolute right-[14%] top-[80%] flex items-center gap-2.5 group text-right flex-row-reverse transition-all hover:scale-105 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-slate-950/85 border border-blue-400/80 shadow-[0_0_20px_rgba(96,165,250,0.7)] flex items-center justify-center text-blue-300 group-hover:border-blue-300 transition-all backdrop-blur-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] group-hover:text-blue-300 transition-colors">
                Research
              </div>
              <div className="text-[10px] text-slate-300 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                Explore & Validate
              </div>
            </div>
          </button>
        </div>

        {/* Mobile/Compact Floating Indicators */}
        <div className="md:hidden flex flex-wrap justify-center gap-2 max-w-sm my-2">
          {[
            { label: 'Documents', icon: FileText, color: 'text-fuchsia-400 border-fuchsia-400/50', view: 'documents' },
            { label: 'Knowledge', icon: Search, color: 'text-cyan-400 border-cyan-400/50', view: 'knowledge' },
            { label: 'Meetings', icon: Users, color: 'text-indigo-400 border-indigo-400/50', view: 'meetings' },
            { label: 'Analytics', icon: BarChart2, color: 'text-cyan-400 border-cyan-400/50', view: 'analytics' },
            { label: 'Workflows', icon: GitBranch, color: 'text-fuchsia-400 border-fuchsia-400/50', view: 'workflows' },
            { label: 'Research', icon: BookOpen, color: 'text-blue-400 border-blue-400/50', view: 'assistant' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectFeature(item.view)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border ${item.color} text-[11px] font-semibold text-white shadow-md backdrop-blur-sm cursor-pointer`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. Single Watch Demo Button */}
        <div className="flex items-center justify-center mt-3 mb-1">
          <button
            onClick={onWatchDemo}
            className="flex items-center justify-center gap-2.5 px-8 py-3 text-sm font-semibold text-slate-100 bg-[#060b1e]/85 border border-indigo-400/70 hover:border-indigo-300 rounded-full hover:bg-slate-900 transition-all cursor-pointer shadow-[0_0_25px_rgba(99,102,241,0.4)] backdrop-blur-md hover:scale-105"
          >
            <div className="w-5 h-5 rounded-full border border-indigo-400/80 flex items-center justify-center">
              <Play className="w-2.5 h-2.5 text-cyan-400 fill-cyan-400 ml-0.5" />
            </div>
            <span>Watch Demo</span>
          </button>
        </div>
      </div>
    </section>
  );
};
