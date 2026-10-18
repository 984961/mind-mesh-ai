import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Search, 
  FileText, 
  Users, 
  BarChart2, 
  GitBranch, 
  Home, 
  Menu, 
  X, 
  ChevronRight,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';
import { SettingsModal } from './SettingsModal';

interface WorkspaceLayoutProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onReturnLanding: () => void;
  user: UserProfile;
  children: React.ReactNode;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  currentView,
  onNavigate,
  onReturnLanding,
  user,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Six focused core modules + Main Dashboard
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'knowledge', label: 'Knowledge Search', icon: Search },
    { id: 'documents', label: 'Document Intelligence', icon: FileText },
    { id: 'meetings', label: 'Meeting Intelligence', icon: Users },
    { id: 'analytics', label: 'Data Analytics', icon: BarChart2 },
    { id: 'workflows', label: 'Workflow Automation', icon: GitBranch },
  ];

  const currentItem = navItems.find(item => item.id === currentView) || {
    id: currentView,
    label: currentView.charAt(0).toUpperCase() + currentView.slice(1),
    icon: LayoutDashboard
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#040711] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white text-sm">MindMeshAI</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettingsOpen(true)}
            title="Settings & Diagnostics"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Compact Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block md:w-64 bg-[#040816] border-r border-slate-800/80 flex flex-col justify-between shrink-0 z-40 transition-all`}
      >
        <div className="p-4 space-y-6">
          {/* Brand Wordmark */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                MindMesh<span className="text-cyan-400">AI</span>
              </span>
            </button>

            <button
              onClick={onReturnLanding}
              title="Return to Public Landing Page"
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links: 6 Core Modules */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
              Core Modules
            </div>
            <nav className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Area: Settings & Diagnostics + User Info */}
        <div className="p-4 border-t border-slate-800/80 bg-[#030612] space-y-3">
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl transition-colors border border-slate-800/60 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings & Diagnostics</span>
          </button>

          <div className="flex items-center gap-3 pt-1">
            <img
              src="/src/assets/images/avatar_workspace_lead_1792151397627.jpg"
              alt={user.displayName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
            />
            <div className="truncate space-y-0.5">
              <div className="text-xs font-semibold text-white truncate">{user.displayName}</div>
              <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{user.mode}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Viewport Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Workspace Top Header Bar */}
        <header className="px-6 py-3.5 bg-[#040816]/70 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between gap-4">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
              Workspace
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-medium">{currentItem.label}</span>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSettingsOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-cyan-400" />
              <span>GCP Services & Diagnostics</span>
            </button>

            <button
              onClick={onReturnLanding}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer"
            >
              Public Site
            </button>
          </div>
        </header>

        {/* Viewport Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Settings & Diagnostics Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onNavigateView={onNavigate}
      />
    </div>
  );
};
