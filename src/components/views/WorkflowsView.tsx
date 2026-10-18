import React, { useState } from 'react';
import { 
  GitBranch, 
  Play, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Check, 
  X,
  RefreshCw
} from 'lucide-react';
import { WorkflowRun } from '../../types';

interface WorkflowsViewProps {
  workflows: WorkflowRun[];
  onWorkflowUpdated: (updatedWf: WorkflowRun) => void;
  onWorkflowCreated: (newWf: WorkflowRun) => void;
}

export const WorkflowsView: React.FC<WorkflowsViewProps> = ({
  workflows,
  onWorkflowUpdated,
  onWorkflowCreated,
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowRun | null>(workflows[0] || null);
  const [isStarting, setIsStarting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('Authorized for production enterprise dispatch.');

  const handleStartWorkflow = async (templateId: string) => {
    setIsStarting(true);
    try {
      const res = await fetch('/api/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId })
      });
      if (!res.ok) throw new Error('Failed to initiate agent workflow.');
      const data = await res.json();
      onWorkflowCreated(data.workflow);
      setSelectedWorkflow(data.workflow);
    } catch (err) {
      console.error(err);
    } finally {
      setIsStarting(false);
    }
  };

  const handleApprove = async (id: string, approved: boolean) => {
    setApprovingId(id);
    try {
      const res = await fetch(`/api/workflows/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, userNotes: approvalNotes })
      });
      if (!res.ok) throw new Error('Approval call failed.');
      const data = await res.json();
      onWorkflowUpdated(data.workflow);
      setSelectedWorkflow(data.workflow);
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1228] to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <span>GOOGLE AGENT DEVELOPMENT KIT (ADK) · HUMAN-IN-THE-LOOP APPROVAL GATES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Workflow Automation & Agent Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Autonomous multi-step planning with deterministic contracts. Consequential external actions are paused until human approval.
          </p>
        </div>

        {/* Template Quick Launchers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleStartWorkflow('doc-intelligence')}
            disabled={isStarting}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Document Synthesis Agent</span>
          </button>
          <button
            onClick={() => handleStartWorkflow('action-sync')}
            disabled={isStarting}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 cursor-pointer"
          >
            <GitBranch className="w-3.5 h-3.5 text-amber-400" />
            <span>Launch Action Dispatch Pipeline</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Workflows List + Workflow Detail / Approval Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Workflow Run History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Agent Workflow Executions ({workflows.length})
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Firestore Logged</span>
            </div>

            <div className="space-y-2.5">
              {workflows.map(wf => (
                <div
                  key={wf.id}
                  onClick={() => setSelectedWorkflow(wf)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    selectedWorkflow?.id === wf.id
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{wf.templateName}</span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                      wf.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : wf.status === 'Awaiting Approval'
                        ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {wf.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Initiated by: {wf.initiatedBy}</span>
                    <span>{wf.startedAt.split('T')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Execution Timeline & Active Gate */}
        <div className="lg:col-span-7 space-y-6">
          {selectedWorkflow ? (
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">ADK Agent Pipeline Trace</div>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedWorkflow.templateName}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Workflow ID: <code className="font-mono text-slate-300">{selectedWorkflow.id}</code> · Status: <span className="text-cyan-300 font-semibold">{selectedWorkflow.status}</span>
                  </div>
                </div>
              </div>

              {/* Consequential Action Approval Gate Banner */}
              {selectedWorkflow.status === 'Awaiting Approval' && selectedWorkflow.pendingAction && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Active Consequential Action Gate</h4>
                      <p className="text-[11px] text-amber-300/80">
                        The autonomous agent has formulated an external state mutation and is waiting for your verification.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target External Service:</span>
                      <span className="font-semibold text-white">{selectedWorkflow.pendingAction.targetService}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Action Type:</span>
                      <span className="text-cyan-400 font-mono">{selectedWorkflow.pendingAction.actionType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Impact Level:</span>
                      <span className="text-amber-400 font-semibold">{selectedWorkflow.pendingAction.impactLevel}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-slate-300">
                      <span className="text-slate-400 block mb-0.5">Payload Summary:</span>
                      "{selectedWorkflow.pendingAction.payloadSummary}"
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] text-slate-400">Authorization Notes (Audit Trail)</label>
                    <input
                      type="text"
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleApprove(selectedWorkflow.id, false)}
                      disabled={approvingId === selectedWorkflow.id}
                      className="px-4 py-2 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-colors cursor-pointer"
                    >
                      Reject & Abort
                    </button>
                    <button
                      onClick={() => handleApprove(selectedWorkflow.id, true)}
                      disabled={approvingId === selectedWorkflow.id}
                      className="px-5 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Authorize & Dispatch</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Execution Steps Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Deterministic Step Execution
                </h4>

                <div className="space-y-3">
                  {selectedWorkflow.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3.5 text-xs"
                    >
                      <div className="mt-0.5 shrink-0">
                        {step.status === 'Completed' && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {step.status === 'Waiting Approval' && (
                          <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center animate-pulse">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {step.status === 'Pending' && (
                          <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {step.status === 'Skipped' && (
                          <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                            <X className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{step.name}</span>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">{step.status}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Idempotency & Safety Policy */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-500 space-y-1">
                <div className="text-slate-400 font-semibold">Idempotency & Rollback Guarantees:</div>
                <div>• All agent actions require an immutable cryptographic transaction key.</div>
                <div>• Re-runs are strictly idempotent to prevent duplicate messages or webhook triggers.</div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 rounded-2xl bg-slate-900/40 border border-slate-800">
              Select an agent workflow to inspect execution steps.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
