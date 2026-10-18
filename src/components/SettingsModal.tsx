import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Cloud, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Key, 
  Play, 
  ExternalLink,
  RefreshCw,
  Terminal,
  Database,
  Cpu
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateView?: (view: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'services' | 'diagnostics'>('services');
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [projectId, setProjectId] = useState('mindmesh-prod-enterprise');
  const [region, setRegion] = useState('us-central1');

  // Diagnostic Test Runner State
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  const fetchStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const [intRes, healthRes] = await Promise.all([
        fetch('/api/integrations/status'),
        fetch('/api/health')
      ]);
      if (intRes.ok) {
        const data = await intRes.json();
        setIntegrations(data.integrations || []);
        if (data.projectId) setProjectId(data.projectId);
        if (data.region) setRegion(data.region);
      }
      if (healthRes.ok) {
        const hData = await healthRes.json();
        setHealthStatus(hData);
      }
    } catch (err) {
      console.error('Failed to load status:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const runDiagnostics = async () => {
    setIsRunningTests(true);
    try {
      const res = await fetch('/api/evaluations/run', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTestResults(data);
      }
    } catch (err) {
      console.error('Diagnostics run failed:', err);
    } finally {
      setIsRunningTests(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#070d1e] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-[#040816]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Settings & Service Configuration</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Google Cloud Platform
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage backend services, inspect live credentials, and execute API contract diagnostics.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-[#030612] px-6 gap-6">
          <button
            onClick={() => setActiveTab('services')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'services'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Cloud Services Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Developer Diagnostics & Tests</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {activeTab === 'services' ? (
            <div className="space-y-6">
              {/* Project Info Bar */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">Target GCP Project:</span>
                  <code className="text-cyan-300 font-mono bg-black/40 px-2 py-0.5 rounded border border-slate-800">
                    {projectId}
                  </code>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">Cloud Region:</span>
                  <code className="text-slate-300 font-mono bg-black/40 px-2 py-0.5 rounded border border-slate-800">
                    {region}
                  </code>
                </div>
                <button
                  onClick={fetchStatus}
                  disabled={isLoadingStatus}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus ? 'animate-spin' : ''}`} />
                  <span>Refresh Status</span>
                </button>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((svc) => {
                  const isReady = svc.status.toLowerCase().includes('connected') || svc.status.toLowerCase().includes('verified');
                  const isConfigReq = svc.status.toLowerCase().includes('configuration') || svc.status.toLowerCase().includes('unconnected');

                  return (
                    <div
                      key={svc.id}
                      className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <div className="text-xs font-bold text-white">{svc.serviceName}</div>
                            <div className="text-[10px] font-mono text-slate-400">{svc.category}</div>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                              isReady
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : isConfigReq
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {svc.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mt-2">
                          {svc.details}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Model/Spec: {svc.model}</span>
                        {svc.docsUrl && (
                          <a
                            href={svc.docsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <span>Docs</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Credential Setup Guide */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Configuring Production Google Cloud Integrations:</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  MindMeshAI never fabricates connection status. To activate full Google BigQuery live warehouse execution or Document AI processor endpoints, configure your environment variables in <code className="text-cyan-300 font-mono">.env</code>:
                </p>
                <div className="p-3 bg-black/60 rounded-lg font-mono text-[11px] text-slate-300 space-y-1">
                  <div>GEMINI_API_KEY=&quot;&lt;your-gemini-key&gt;&quot;</div>
                  <div>BIGQUERY_PROJECT_ID=&quot;&lt;your-gcp-project-id&gt;&quot;</div>
                  <div>GOOGLE_APPLICATION_CREDENTIALS=&quot;&lt;/path/to/service-account.json&gt;&quot;</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Test Runner Controls */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Automated API Contract & Security Suite</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Execute automated tests across SQL AST read-only guards, prompt injection defense, and JSON response schemas.
                  </p>
                </div>

                <button
                  onClick={runDiagnostics}
                  disabled={isRunningTests}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-600/20 shrink-0 cursor-pointer"
                >
                  {isRunningTests ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Running Suite...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Run Diagnostic Suite</span>
                    </>
                  )}
                </button>
              </div>

              {/* Health Overview */}
              {healthStatus && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
                    <span className="text-slate-400">Server Health</span>
                    <div className="text-emerald-400 font-bold font-mono text-sm mt-1 uppercase">
                      {healthStatus.status}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
                    <span className="text-slate-400">Gemini Key</span>
                    <div className="text-white font-bold font-mono text-sm mt-1">
                      {healthStatus.geminiConfigured ? 'Active' : 'Unconfigured'}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
                    <span className="text-slate-400">BigQuery Live</span>
                    <div className="text-white font-bold font-mono text-sm mt-1">
                      {healthStatus.bigQueryConfigured ? 'Connected' : 'Config Required'}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
                    <span className="text-slate-400">Uptime</span>
                    <div className="text-white font-bold font-mono text-sm mt-1">
                      {healthStatus.uptimeSeconds}s
                    </div>
                  </div>
                </div>
              )}

              {/* Live Test Results */}
              {testResults ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Evaluation Results ({testResults.passed}/{testResults.totalTests} Passed)
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Score: {testResults.overallScore}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    {testResults.results?.map((res: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                          res.passed
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {res.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                          <div>
                            <span className="font-semibold text-white">{res.testName}</span>
                            <div className="text-[11px] text-slate-400">{res.metric}</div>
                          </div>
                        </div>

                        <div className="text-right font-mono text-[11px]">
                          <span className={res.passed ? 'text-emerald-400' : 'text-rose-400'}>
                            {res.passed ? 'PASSED' : 'FAILED'}
                          </span>
                          <div className="text-slate-500">{res.latencyMs}ms</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl bg-slate-900/30 border border-slate-800/80 text-slate-400 text-xs">
                  Click &quot;Run Diagnostic Suite&quot; to execute real-time evaluations and verify API JSON contracts.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#040816] flex items-center justify-between text-xs text-slate-400">
          <span>MindMeshAI Enterprise Platform v1.0.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
