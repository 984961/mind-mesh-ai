import React, { useState } from 'react';
import { Sparkles, Search, ArrowRight, LayoutDashboard, Menu, X, Home } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  inWorkspace: boolean;
  onToggleWorkspace: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  inWorkspace,
  onToggleWorkspace,
  onOpenSearch,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    if (inWorkspace) {
      onToggleWorkspace();
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 80);
  };

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 bg-[#030712]/75 backdrop-blur-xl border-b border-white/[0.06] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Left: Brand Logo & Wordmark matching reference */}
        <button
          onClick={() => {
            if (inWorkspace) onToggleWorkspace();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left group cursor-pointer whitespace-nowrap shrink-0"
        >
          {/* Neural Mesh Brain Logo */}
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-500 p-[1.5px] shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-400/40 transition-shadow">
            <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
                <path d="M9 21h6" />
                <circle cx="12" cy="9" r="2" fill="currentColor" />
                <path d="m10 7 4 4" />
                <path d="m14 7-4 4" />
              </svg>
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white flex items-center">
            <span>MindMesh</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
          </span>
        </button>

        {/* Center: 6 Clean Single-line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => scrollToSection('hero')}
            className="hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('solutions')}
            className="hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Solutions
          </button>
          <button
            onClick={() => scrollToSection('technology')}
            className="hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Technology
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            About
          </button>
        </nav>

        {/* Right: Search Icon + Glowing Blue-to-Violet Get Started Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            title="Global Enterprise Knowledge Search"
            className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {inWorkspace ? (
            <button
              onClick={onToggleWorkspace}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-full hover:bg-slate-800 transition-all cursor-pointer shadow-md"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span>Public Site</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('dashboard')}
              className="group flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 rounded-full hover:from-blue-500 hover:via-indigo-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 cursor-pointer whitespace-nowrap"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-white/[0.08] flex flex-col gap-3">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-left text-sm text-slate-300 hover:text-cyan-400 py-1"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-left text-sm text-slate-300 hover:text-cyan-400 py-1"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('solutions')}
            className="text-left text-sm text-slate-300 hover:text-cyan-400 py-1"
          >
            Solutions
          </button>
          <button
            onClick={() => scrollToSection('technology')}
            className="text-left text-sm text-slate-300 hover:text-cyan-400 py-1"
          >
            Technology
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="text-left text-sm text-slate-300 hover:text-cyan-400 py-1"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-left text-sm text-slate-300 hover:text-cyan-400 py-1"
          >
            About
          </button>
          <button
            onClick={() => {
              setMobileOpen(false);
              onNavigate('dashboard');
            }}
            className="mt-2 text-center py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 rounded-full"
          >
            Enter Workspace
          </button>
        </div>
      )}
    </header>
  );
};
