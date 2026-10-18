import React, { useState } from 'react';
import { Search, X, FileText, Users, ArrowRight, Sparkles, Database } from 'lucide-react';
import { KnowledgeDocument, MeetingRecord } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (view: string, detail?: any) => void;
  documents: KnowledgeDocument[];
  meetings: MeetingRecord[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
  documents,
  meetings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const matchedDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const matchedMeetings = meetings.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#090d1a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-[#040711]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search across documents, meeting summaries, or tools..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Body */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
          {/* Quick Tool Navigation */}
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold px-2 mb-2">
              Quick Capability Jump
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => {
                  onSelectResult('knowledge');
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left hover:bg-slate-850 flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Ask RAG</span>
              </button>

              <button
                onClick={() => {
                  onSelectResult('documents');
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-fuchsia-500/40 text-left hover:bg-slate-850 flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white"
              >
                <FileText className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                <span className="truncate">Document AI</span>
              </button>

              <button
                onClick={() => {
                  onSelectResult('meetings');
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-left hover:bg-slate-850 flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white"
              >
                <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">Meetings</span>
              </button>

              <button
                onClick={() => {
                  onSelectResult('analytics');
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left hover:bg-slate-850 flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Safe SQL</span>
              </button>
            </div>
          </div>

          {/* Documents Results */}
          {matchedDocs.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold px-2 mb-2">
                Matching Enterprise Documents ({matchedDocs.length})
              </div>
              <div className="space-y-1.5">
                {matchedDocs.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      onSelectResult('documents');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-white font-medium truncate group-hover:text-cyan-300">{doc.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">{doc.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meeting Summaries Results */}
          {matchedMeetings.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold px-2 mb-2">
                Matching Meeting Records ({matchedMeetings.length})
              </div>
              <div className="space-y-1.5">
                {matchedMeetings.map(meet => (
                  <div
                    key={meet.id}
                    onClick={() => {
                      onSelectResult('meetings');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="text-white font-medium truncate group-hover:text-indigo-300">{meet.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">{meet.date}</span>
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
