import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Users, 
  BarChart2, 
  GitBranch, 
  Sparkles, 
  ArrowRight, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Clock,
  Settings,
  Database
} from 'lucide-react';
import { KnowledgeDocument, MeetingRecord, TaskItem, WorkflowRun } from '../../types';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  documents: KnowledgeDocument[];
  meetings: MeetingRecord[];
  tasks: TaskItem[];
  workflows: WorkflowRun[];
  onOpenUpload: () => void;
  onRunQuickQuery?: (query: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  documents,
  meetings,
  tasks,
  workflows,
  onOpenUpload,
}) => {
  const [quickPrompt, setQuickPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const awaitingApprovals = workflows.filter(w => w.status === 'Awaiting Approval');
  const pendingTasks = tasks.filter(t => t.status !== 'Completed');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    // Store quick prompt for the assistant view and navigate
    sessionStorage.setItem('mindmesh_pending_prompt', quickPrompt);
    onNavigate('assistant');
  };

  const handleSuggestedPrompt = (promptText: string) => {
    sessionStorage.setItem('mindmesh_pending_prompt', promptText);
    onNavigate('assistant');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Welcome Header & AI Assistant Input Bar */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#071329] to-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>MINDMESH ENTERPRISE WORKSPACE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Connecting Human Intelligence with AI Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Access organizational knowledge, analyze documents and data, synthesize meetings into actionable tasks, and orchestrate agent workflows with human oversight.
          </p>
        </div>

        {/* AI Assistant Quick Input Bar */}
        <div className="space-y-3">
          <form onSubmit={handleQuickSubmit} className="relative flex items-center">
            <div className="absolute left-4 text-cyan-400 pointer-events-none">
              <Sparkles className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="Ask anything across your organization's knowledge, documents, or data..."
              className="w-full pl-11 pr-28 py-3.5 bg-slate-950/80 border border-slate-700/80 focus:border-cyan-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!quickPrompt.trim() || isSubmitting}
              className="absolute right-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-600/20"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Suggested Prompts */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Suggested:</span>
            {[
              'Summarize an uploaded document',
              'Find an answer in my knowledge base',
              'Turn meeting notes into action items',
              'Analyze my business data'
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedPrompt(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/30 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Six Core Module Quick Action Buttons */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Core Modules
          </h2>
          <span className="text-[11px] text-slate-500">Google Cloud Powered</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'assistant', label: 'AI Assistant', icon: Sparkles, desc: 'Gemini conversational reasoning', color: 'text-cyan-400', border: 'hover:border-cyan-500/40' },
            { id: 'knowledge', label: 'Knowledge Search', icon: Search, desc: 'Vertex AI Search & citations', color: 'text-indigo-400', border: 'hover:border-indigo-500/40' },
            { id: 'documents', label: 'Document Intel', icon: FileText, desc: 'Document AI OCR & extraction', color: 'text-blue-400', border: 'hover:border-blue-500/40' },
            { id: 'meetings', label: 'Meeting Intel', icon: Users, desc: 'Summaries & action items', color: 'text-amber-400', border: 'hover:border-amber-500/40' },
            { id: 'analytics', label: 'Data Analytics', icon: BarChart2, desc: 'CSV visualizer & BigQuery', color: 'text-emerald-400', border: 'hover:border-emerald-500/40' },
            { id: 'workflows', label: 'Workflows', icon: GitBranch, desc: 'ADK agents with human gates', color: 'text-violet-400', border: 'hover:border-violet-500/40' },
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => onNavigate(mod.id)}
                className={`p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left transition-all ${mod.border} hover:bg-slate-850 group cursor-pointer flex flex-col justify-between space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${mod.color}`} />
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {mod.label}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    {mod.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Pending Human Approval Gate Alert (if any workflow awaiting human action) */}
      {awaitingApprovals.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 mb-0.5">
                  Action Gate: Human Authorization Required
                </div>
                <h3 className="text-sm font-bold text-white">
                  {awaitingApprovals[0].templateName}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {awaitingApprovals[0].pendingAction?.payloadSummary}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('workflows')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded-xl transition-colors shrink-0 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Review & Authorize</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Main Two-Column Content: Recent Documents & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Documents */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Recent Documents</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenUpload}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
              <span className="text-slate-600">·</span>
              <button
                onClick={() => onNavigate('documents')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({documents.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {documents.length > 0 ? (
            <div className="space-y-2.5">
              {documents.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onNavigate('documents')}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer group flex items-center justify-between"
                >
                  <div className="space-y-0.5 pr-3 truncate">
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                      {doc.title}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{doc.category}</span>
                      <span>•</span>
                      <span className="font-mono">{doc.sourceType}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {doc.createdAt}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-3">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <div>
                <div className="text-xs font-semibold text-white">No documents uploaded yet</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Upload PDF, DOCX, TXT, or CSV files to extract text and generate summaries.
                </div>
              </div>
              <button
                onClick={onOpenUpload}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload First Document</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Recent Activity & Meeting Actions */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Meeting Intelligence & Actions</h3>
            </div>
            <button
              onClick={() => onNavigate('meetings')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>View Meetings ({meetings.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {meetings.length > 0 ? (
            <div className="space-y-3">
              {meetings.slice(0, 2).map((meet) => (
                <div
                  key={meet.id}
                  onClick={() => onNavigate('meetings')}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      {meet.title}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500">{meet.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {meet.summary}
                  </p>
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-medium">
                      {meet.proposedActions?.length || 0} action items generated
                    </span>
                    <span>{meet.attendees?.length || 0} attendees</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-3">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <div>
                <div className="text-xs font-semibold text-white">No meetings synthesized yet</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Paste meeting notes or transcripts to extract decisions and assigned tasks.
                </div>
              </div>
              <button
                onClick={() => onNavigate('meetings')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Synthesize Notes</span>
              </button>
            </div>
          )}

          {/* Active Tasks Mini-List if available */}
          {pendingTasks.length > 0 && (
            <div className="pt-2 border-t border-slate-800/60">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 font-medium">Assigned Tasks ({pendingTasks.length})</span>
                <button
                  onClick={() => onNavigate('meetings')}
                  className="text-emerald-400 hover:underline text-[11px]"
                >
                  View Tasks
                </button>
              </div>
              <div className="space-y-1.5">
                {pendingTasks.slice(0, 2).map((t) => (
                  <div key={t.id} className="p-2 rounded-lg bg-slate-950/40 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-300 truncate">{t.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">{t.assignee}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
