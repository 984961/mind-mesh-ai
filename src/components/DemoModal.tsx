import React, { useState } from 'react';
import { X, CheckCircle, Shield, Sparkles, Database, FileText, Users, ArrowRight } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWorkspace: (view?: string) => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onOpenWorkspace }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      title: 'Human & AI Convergence: The Core Concept',
      subtitle: 'Harmonizing Human Intuition with Artificial Intelligence',
      badge: 'Pillar 1 · Unified Intelligence',
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            MindMeshAI bridges the gap between human contextual judgment and autonomous AI reasoning. Instead of replacing people, it provides an interconnected neural mesh where every document, meeting, dataset, and workflow is indexed, verified, and placed under human control.
          </p>
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2 text-slate-300">
            <div className="flex items-center gap-2 text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Human Domain: Context, Strategic Intent, Ethical Boundaries, Approvals
            </div>
            <div className="flex items-center gap-2 text-cyan-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              AI Domain: Multi-file Synthesis, Document AI Extraction, AST SQL Validation, Rapid RAG
            </div>
          </div>
        </div>
      ),
      targetView: 'dashboard'
    },
    {
      title: 'Evidence-Grounded Knowledge Assistant (RAG)',
      subtitle: 'Zero Hallucinations · Real Citations · Injection Protected',
      badge: 'Pillar 2 · Knowledge RAG',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Query across internal company whitepapers, security audits, and operational reports. Every answer is grounded in retrieved passages with verified citations. If an answer is not supported by documentation, MindMeshAI honestly refuses rather than fabricating answers.
          </p>
          <div className="p-3.5 rounded-xl bg-[#030712] border border-cyan-500/30 text-xs font-mono space-y-2 text-slate-300">
            <div className="text-cyan-400 font-semibold">// Example Verification Trace:</div>
            <div>Source: "Enterprise Cloud Security Whitepaper (PDF)" [Score: 98.4%]</div>
            <div className="text-slate-400">"Data at rest across Cloud Firestore, Cloud Storage, and BigQuery is encrypted by default with customer-managed encryption keys (CMEK)."</div>
          </div>
        </div>
      ),
      targetView: 'knowledge'
    },
    {
      title: 'Meeting Intelligence & Verified Action Items',
      subtitle: 'From Unstructured Transcripts to Accountable Tasks',
      badge: 'Pillar 3 · Meeting Actions',
      icon: Users,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Meeting notes and transcripts are parsed into structured executive summaries, confirmed decisions, and open questions. Proposed tasks must be reviewed, edited, and explicitly approved by humans before being committed to the enterprise task registry.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-emerald-400 font-medium mb-1">Decisions Log</div>
              <div className="text-slate-400 text-[11px]">Strict disallowance of DROP/DELETE operations confirmed</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-amber-400 font-medium mb-1">Human Approval</div>
              <div className="text-slate-400 text-[11px]">2 actions staged · User verifies owners and deadlines</div>
            </div>
          </div>
        </div>
      ),
      targetView: 'meetings'
    },
    {
      title: 'Safe BigQuery Analytics & AST-Enforced SQL',
      subtitle: 'Self-Service Business Intelligence with Strict Guardrails',
      badge: 'Pillar 4 · Data Analytics',
      icon: Database,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Execute SQL queries against enterprise datasets. The query validator checks every statement at the AST parser level: destructive operations like <code className="text-rose-400">DROP</code>, <code className="text-rose-400">DELETE</code>, or <code className="text-rose-400">ALTER</code> are blocked immediately.
          </p>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Weekly Engineering Hours Saved:</span>
              <span className="text-cyan-400 font-mono font-medium">1,144.1 hrs/yr</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Action Item Completion Rate:</span>
              <span className="text-emerald-400 font-mono font-medium">89.6%</span>
            </div>
          </div>
        </div>
      ),
      targetView: 'analytics'
    },
    {
      title: 'Google ADK Agent Orchestration & Human Approval Gates',
      subtitle: 'Consequential Actions Require Explicit Human Authorization',
      badge: 'Pillar 5 · Agent Governance',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Agents built on Google ADK perform multi-step planning and data extraction. However, before executing any mutation or external webhook dispatch (e.g. Jira updates, Slack notices, cloud events), the agent pauses in an "Awaiting Approval" state until a verified user approves.
          </p>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
            <div className="font-semibold mb-1">Active Approval Gate Enforced:</div>
            <div>Target: Slack Enterprise Notification API · Action: Post sprint summary</div>
            <div className="text-[11px] text-amber-300/80 mt-1">Status: Paused · Requires Human Cryptographic Approval</div>
          </div>
        </div>
      ),
      targetView: 'workflows'
    }
  ];

  const currentStepData = demoSteps[activeStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#090d1a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#040711]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{currentStepData.badge}</span>
              <h3 className="text-base font-semibold text-white">{currentStepData.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-xs text-slate-400 mb-3 font-medium">{currentStepData.subtitle}</div>
          {currentStepData.content}

          {/* Stepper indicator */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              {demoSteps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeStep ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              {activeStep > 0 && (
                <button
                  onClick={() => setActiveStep(prev => prev - 1)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Previous
                </button>
              )}
              {activeStep < demoSteps.length - 1 ? (
                <button
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onOpenWorkspace(currentStepData.targetView);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-lg hover:from-cyan-400 hover:to-indigo-500 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/25"
                >
                  <span>Open Interactive App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
