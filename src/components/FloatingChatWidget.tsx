import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink, 
  CornerDownRight, 
  AlertCircle,
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

interface FloatingChatWidgetProps {
  currentPage: string;
  onNavigateView: (view: string) => void;
}

// Markdown parser helper for assistant responses
const renderMarkdownContent = (content: string) => {
  const lines = content.split('\n');
  return lines.map((line, idx) => {
    // Heading 3 or 2
    if (line.startsWith('### ')) {
      return (
        <h4 key={idx} className="font-bold text-cyan-300 text-xs mt-2 mb-1">
          {line.replace('### ', '')}
        </h4>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <h3 key={idx} className="font-bold text-white text-sm mt-2.5 mb-1 text-cyan-200">
          {line.replace('## ', '')}
        </h3>
      );
    }
    // Bullet item
    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      const cleanLine = line.replace(/^[•\-\*]\s*/, '');
      return (
        <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
          <span className="text-cyan-400 font-bold shrink-0">•</span>
          <span className="text-slate-300">{formatInline(cleanLine)}</span>
        </div>
      );
    }
    // Numbered list item
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      return (
        <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
          <span className="text-indigo-400 font-mono text-[11px] font-semibold shrink-0">{numMatch[1]}.</span>
          <span className="text-slate-300">{formatInline(numMatch[2])}</span>
        </div>
      );
    }
    // Empty line spacer
    if (!line.trim()) {
      return <div key={idx} className="h-1.5" />;
    }
    // Standard paragraph
    return (
      <p key={idx} className="text-slate-200 leading-relaxed">
        {formatInline(line)}
      </p>
    );
  });
};

const formatInline = (text: string) => {
  // Support **bold** and `code`
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
        <code key={i} className="px-1 py-0.5 rounded bg-black/60 border border-slate-700/60 font-mono text-[11px] text-cyan-300">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  currentPage,
  onNavigateView,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/assistant/history');
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          }
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    fetchHistory();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text || !text.trim() || isLoading) return;

    const userText = text.trim();
    setInputMessage('');
    setErrorMsg(null);

    // Optimistically append user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          conversationId: 'default',
          context: { page: currentPage }
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev.filter(m => m.id !== tempUserMsg.id), tempUserMsg, data.message]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to communicate with AI Assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      const res = await fetch('/api/assistant/history', { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open MindMeshAI Assistant"
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-500 p-[2px] shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:shadow-[0_0_40px_rgba(217,70,239,0.8)] hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <div className="w-full h-full bg-[#030712] rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-cyan-300 group-hover:scale-110 transition-transform animate-pulse" />
          </div>
          {/* Subtle notification halo */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 text-[9px] font-bold text-black items-center justify-center">AI</span>
          </span>
        </button>
      )}

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div
          className={`flex flex-col bg-[#090d1a] border border-indigo-500/30 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-200 ${
            isExpanded
              ? 'fixed inset-4 sm:inset-10 z-50'
              : 'w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Top Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#040816] border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-fuchsia-600 p-[1.5px] flex items-center justify-center">
                <div className="w-full h-full bg-[#030712] rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>MindMeshAI Assistant</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <div className="text-[10px] text-slate-400 font-mono">
                  Gemini on Vertex AI · Active
                </div>
              </div>
            </div>

              {/* Header Control Buttons */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClear}
                title="New conversation / Clear chat"
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">New Chat</span>
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore size' : 'Expand window'}
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors hidden sm:block cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize / Close chat"
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-md shadow-indigo-600/20 whitespace-pre-wrap'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {isUser ? (
                      msg.text
                    ) : (
                      <div className="space-y-2">
                        {renderMarkdownContent(msg.text)}
                      </div>
                    )}

                    {/* Citations block if any */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                        <div className="text-[10px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                          Verified Grounded Sources:
                        </div>
                        {msg.citations.map((c, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-black/40 border border-slate-800 text-[11px] text-slate-300"
                          >
                            <div className="font-semibold text-white">{c.title}</div>
                            <div className="text-slate-400 text-[10px] line-clamp-2">"{c.snippet}"</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message timestamp and copy affordance */}
                  {!isUser && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 pl-1">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-cyan-400 flex items-center gap-0.5 cursor-pointer"
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
                    </div>
                  )}

                  {/* Suggested actions chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (action.view) {
                              onNavigateView(action.view);
                            } else {
                              handleSendMessage(action.label);
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <CornerDownRight className="w-3 h-3 text-cyan-400" />
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 w-fit">
                <div className="w-3.5 h-3.5 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
                <span className="text-xs">MindMeshAI is reasoning...</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar with all 5 user requested prompts */}
          {messages.length <= 1 && (
            <div className="px-4 py-2.5 border-t border-white/[0.05] bg-[#040816]/70">
              <div className="text-[10px] text-slate-400 uppercase font-mono mb-1.5 font-semibold">Suggested Prompts:</div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Summarize an uploaded document.',
                  'Find an answer in my knowledge base.',
                  'Turn meeting notes into action items.',
                  'Analyze my business data.',
                  'Help me plan a workflow.'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-900/90 border border-indigo-500/30 hover:border-cyan-400 text-slate-300 hover:text-cyan-200 transition-all cursor-pointer text-left"
                  >
                    {idx + 1}. {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 bg-[#040816] border-t border-white/[0.08]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask MindMeshAI about documents, meetings, or data..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white flex items-center justify-center transition-all shadow-md shadow-indigo-600/30 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
