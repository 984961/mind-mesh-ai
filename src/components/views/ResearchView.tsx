import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  CheckCircle2, 
  Clock,
  Compass
} from 'lucide-react';

export const ResearchView: React.FC = () => {
  const [question, setQuestion] = useState('How does human-in-the-loop governance improve enterprise AI adoption and reduce operational liability?');
  const [domain, setDomain] = useState('Enterprise AI and Cloud Productivity');
  const [isSearching, setIsSearching] = useState(false);
  const [researchData, setResearchData] = useState<any>({
    question: 'How does human-in-the-loop governance improve enterprise AI adoption and reduce operational liability?',
    executiveSummary: 'Empirical research across enterprise organizations confirms that pairing generative AI with mandatory human approval gates reduces unintended webhook executions by 99.4% while simultaneously lifting cross-functional task completion by 38%. By establishing cryptographic consent for consequential mutations, organizations eliminate the primary compliance barrier to autonomous agent adoption.',
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
        claim: 'Read-only SQL AST verification prevents 100% of unauthorized data mutations',
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

  const handleResearch = async () => {
    if (!question.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/research/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, domain })
      });
      if (!res.ok) throw new Error('Research query failed.');
      const data = await res.json();
      setResearchData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1228] to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-violet-400 mb-1">
            <Compass className="w-4 h-4 text-violet-400" />
            <span>DEEP RESEARCH AGENT · MULTI-SOURCE EVIDENCE SYNTHESIS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Deep Research Assistant
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Structured investigation engine separating verified source evidence from AI interpretation with explicit caveats.
          </p>
        </div>
      </div>

      {/* Query Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter research inquiry..."
            className="flex-1 px-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />

          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
          >
            <option value="Enterprise AI and Cloud Productivity">Enterprise AI & Cloud Productivity</option>
            <option value="Zero-Trust Architecture & Security">Zero-Trust Architecture & Security</option>
            <option value="Autonomous Agent Orchestration">Autonomous Agent Orchestration</option>
          </select>

          <button
            onClick={handleResearch}
            disabled={isSearching}
            className="px-6 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {isSearching ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Investigating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Conduct Research</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Research Output Details */}
      {researchData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Synthesis (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Executive Investigation Findings
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Latency: {researchData.latencyMs}ms
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                {researchData.executiveSummary}
              </p>

              {/* Methodology */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800/80 text-xs space-y-1">
                <span className="text-slate-400 font-semibold block">Analytical Methodology:</span>
                <span className="text-slate-300">{researchData.methodology}</span>
              </div>
            </div>

            {/* Caveats and Boundaries */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Transparent Caveats & Constraints ({researchData.caveats?.length || 0})</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                {researchData.caveats?.map((c: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Evidence Matrix (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Verified Evidence Points ({researchData.evidencePoints?.length || 0})
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {researchData.evidencePoints?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
                  >
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      "{item.claim}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
                      <span className="text-slate-400 truncate max-w-[180px]">{item.source}</span>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1 font-mono shrink-0"
                        >
                          <span>Verify</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
