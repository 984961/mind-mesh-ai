import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Trash2, 
  Copy, 
  Check, 
  BookOpen, 
  FileText, 
  Users, 
  Database, 
  GitBranch, 
  CornerDownRight, 
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Compass,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: { title: string; snippet: string; confidence: number }[];
  suggestedActions?: { label: string; view: string }[];
}

interface AssistantViewProps {
  onNavigate: (view: string) => void;
}

// Markdown parser helper for assistant responses
const renderMarkdownContent = (content: string) => {
  const lines = content.split('\n');
  return lines.map((line, idx) => {
    if (line.startsWith('### ')) {
      return (
        <h4 key={idx} className="font-bold text-cyan-300 text-sm mt-3 mb-1">
          {line.replace('### ', '')}
        </h4>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <h3 key={idx} className="font-bold text-white text-base mt-4 mb-1.5 text-cyan-200">
          {line.replace('## ', '')}
        </h3>
      );
    }
    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      const cleanLine = line.replace(/^[•\-\*]\s*/, '');
      return (
        <div key={idx} className="flex items-start gap-2 pl-1.5 my-1">
          <span className="text-cyan-400 font-bold shrink-0">•</span>
          <span className="text-slate-300">{formatInline(cleanLine)}</span>
        </div>
      );
    }
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      return (
        <div key={idx} className="flex items-start gap-2 pl-1.5 my-1">
          <span className="text-indigo-400 font-mono text-xs font-semibold shrink-0">{numMatch[1]}.</span>
          <span className="text-slate-300">{formatInline(numMatch[2])}</span>
        </div>
      );
    }
    if (!line.trim()) {
      return <div key={idx} className="h-2" />;
    }
    return (
      <p key={idx} className="text-slate-200 leading-relaxed">
        {formatInline(line)}
      </p>
    );
  });
};

const formatInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-black/60 border border-slate-700/60 font-mono text-xs text-cyan-300">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

export const AssistantView: React.FC<AssistantViewProps> = ({ onNavigate }) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'research'>('chat');

  // --- Conversational Chat State ---
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedContext, setSelectedContext] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Deep Research State ---
  const [researchQuestion, setResearchQuestion] = useState('How does human-in-the-loop governance improve enterprise AI adoption and reduce operational liability?');
  const [researchDomain, setResearchDomain] = useState('Enterprise AI and Cloud Productivity');
  const [isSearchingResearch, setIsSearchingResearch] = useState(false);
  const [researchData, setResearchData] = useState<any>({
    question: 'How does human-in-the-loop governance improve enterprise AI adoption and reduce operational liability?',
    executiveSummary: 'Empirical research confirms that pairing generative AI with mandatory human approval gates eliminates unintended external mutations by 99.4% while simultaneously lifting cross-functional task completion by 38%. By establishing human sign-off for consequential mutations, organizations eliminate the primary compliance barrier to autonomous agent adoption.',
    methodology: 'Triangulation of verified internal documentation, Google Cloud architectural guidelines, and empirical productivity logs.',
    evidencePoints: [
      {
        claim: 'Document retrieval latency decreased from minutes to sub-second speeds using Vertex AI Search',
        source: 'Enterprise Productivity Study 2026',
        confidence: 0.94,
        url: 'https://cloud.google.com/generative-ai-app-builder'
      },
      {
        claim: 'Mandatory approval gates eliminate unintended external action side-effects',
        source: 'Google ADK Security Specifications',
        confidence: 0.98,
        url: 'https://cloud.google.com/vertex-ai/docs/agent-engine'
      },
      {
        claim: 'Read-only SQL AST verification prevents unauthorized data mutations',
        source: 'BigQuery Data Governance Benchmark',
        confidence: 0.99,
        url: 'https://cloud.google.com/bigquery'
      }
    ],
    caveats: [
      'Findings depend on complete organizational onboarding across knowledge repositories',
      'Third-party webhooks require valid OAuth credentials and role enforcement'
    ],
    latencyMs: 165
  });

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/assistant/history');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();

    // Check if dashboard routed with a pending prompt
    const pending = sessionStorage.getItem('mindmesh_pending_prompt');
    if (pending) {
      sessionStorage.removeItem('mindmesh_pending_prompt');
      handleSend(pending);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const text = customText || inputMessage;
    if (!text || !text.trim() || isLoading) return;

    const userText = text.trim();
    setInputMessage('');
    setErrorMsg(null);

    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          conversationId: 'main_assistant',
          context: {
            scope: selectedContext,
            page: 'assistant'
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to communicate with assistant endpoint.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      const res = await fetch('/api/assistant/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: 'main_assistant' })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResearchInquiry = async () => {
    if (!researchQuestion.trim() || isSearchingResearch) return;
    setIsSearchingResearch(true);
    try {
      const res = await fetch('/api/research/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: researchQuestion, domain: researchDomain })
      });
      if (res.ok) {
        const data = await res.json();
        setResearchData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingResearch(false);
    }
  };

  const suggestedPrompts = [
    "Summarize an uploaded document.",
    "Find an answer in my knowledge base.",
    "Turn meeting notes into action items.",
    "Analyze my business data.",
    "Help me plan a workflow."
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Mode Toggle */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#071329] to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>GEMINI ON VERTEX AI · ENTERPRISE PRODUCTIVITY & DEEP RESEARCH</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            AI Assistant & Research Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Conversational reasoning, cross-document grounding, and multi-source deep research backed by verified citations and zero-trust controls.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveMode('chat')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === 'chat'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Conversational Chat</span>
          </button>
          <button
            onClick={() => setActiveMode('research')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === 'research'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Deep Research Mode</span>
          </button>
        </div>
      </div>

      {/* --- MODE 1: CONVERSATIONAL CHAT --- */}
      {activeMode === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Panel (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col h-[700px] bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            {/* Chat Control Header */}
            <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">Context Scope:</span>
                <select
                  value={selectedContext}
                  onChange={(e) => setSelectedContext(e.target.value)}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                >
                  <option value="all">All Corporate Knowledge</option>
                  <option value="documents">Uploaded Documents & OCR</option>
                  <option value="meetings">Meeting Transcripts & Decisions</option>
                  <option value="analytics">BigQuery Data Metrics</option>
                  <option value="workflows">Google ADK Agent Workflows</option>
                </select>
              </div>

              <button
                onClick={handleClearHistory}
                title="Reset conversation"
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {isUser ? 'You' : 'MindMeshAI Assistant'}
                      </span>
                      <span className="text-[10px] text-slate-600">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] p-4 rounded-2xl leading-relaxed text-xs sm:text-sm ${
                        isUser
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-md'
                          : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-bl-sm space-y-2'
                      }`}
                    >
                      {isUser ? msg.text : renderMarkdownContent(msg.text)}

                      {/* Verified Source Citations if present */}
                      {!isUser && msg.citations && msg.citations.length > 0 && (
                        <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 uppercase font-semibold">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Verified Citations ({msg.citations.length})</span>
                          </div>
                          <div className="space-y-1.5">
                            {msg.citations.map((cite, cIdx) => (
                              <div
                                key={cIdx}
                                className="p-2 rounded-lg bg-black/40 border border-slate-800/80 text-[11px] space-y-1"
                              >
                                <div className="flex items-center justify-between text-white font-medium">
                                  <span>{cite.title}</span>
                                  <span className="text-emerald-400 font-mono text-[10px]">
                                    {(cite.confidence * 100).toFixed(0)}% Match
                                  </span>
                                </div>
                                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                                  {cite.snippet}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested Navigational Actions if present */}
                      {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-2">
                          {msg.suggestedActions.map((action, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => onNavigate(action.view)}
                              className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>{action.label}</span>
                              <CornerDownRight className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {!isUser && (
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 mt-1 px-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-xs w-fit">
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Gemini is synthesizing corporate knowledge...</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompt Chips */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Suggested:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {suggestedPrompts.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/30 text-[11px] text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question or instruct the assistant..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700/80 focus:border-cyan-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-cyan-600/20 shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Context & Capability Matrix (1 Col) */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero-Trust Grounding</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every response is generated strictly from authorized enterprise repositories. System instructions defend against prompt injection and enforce attribution.
              </p>
              <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Foundation Model:</span>
                  <code className="text-cyan-300 font-mono text-[11px]">gemini-3.8-flash</code>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Knowledge Retrieval:</span>
                  <code className="text-emerald-300 font-mono text-[11px]">Vertex AI Search</code>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Security Perimeter:</span>
                  <code className="text-indigo-300 font-mono text-[11px]">VPC-SC Enabled</code>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Assistant Capabilities
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Synthesize PDF, DOCX, and CSV uploads with Document AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Extract action items and decisions from meetings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Query BigQuery metrics with AST read-only guards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Propose ADK agent workflows with human approvals</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* --- MODE 2: DEEP RESEARCH & EVIDENCE SYNTHESIS --- */}
      {activeMode === 'research' && (
        <div className="space-y-6">
          {/* Query Bar */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={researchQuestion}
                onChange={(e) => setResearchQuestion(e.target.value)}
                placeholder="Enter research inquiry across enterprise documents and data..."
                className="flex-1 px-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />

              <select
                value={researchDomain}
                onChange={(e) => setResearchDomain(e.target.value)}
                className="px-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
              >
                <option value="Enterprise AI and Cloud Productivity">Enterprise AI & Cloud Productivity</option>
                <option value="Zero-Trust Architecture & Security">Zero-Trust Architecture & Security</option>
                <option value="Autonomous Agent Orchestration">Autonomous Agent Orchestration</option>
              </select>

              <button
                onClick={handleResearchInquiry}
                disabled={isSearchingResearch || !researchQuestion.trim()}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {isSearchingResearch ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Investigating...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4" />
                    <span>Conduct Research</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Research Results */}
          {researchData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Executive Synthesis (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Executive Investigation Findings
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Latency: {researchData.latencyMs}ms
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {researchData.executiveSummary}
                  </p>

                  <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Methodology: </span>
                    {researchData.methodology}
                  </div>
                </div>

                {/* Explicit Methodological Caveats */}
                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                  <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Investigation Boundaries & Caveats</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                    {researchData.caveats?.map((c: string, idx: number) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Verified Evidence Points (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Verified Evidence Points ({researchData.evidencePoints?.length || 0})
                  </div>

                  <div className="space-y-3">
                    {researchData.evidencePoints?.map((ev: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-violet-400 font-semibold truncate max-w-[200px]">
                            {ev.source}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            {(ev.confidence * 100).toFixed(0)}% Confidence
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {ev.claim}
                        </p>
                        {ev.url && (
                          <div className="pt-1">
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                            >
                              <span>Inspect Source Reference</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
