import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Server, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Layers, 
  Search, 
  FileText 
} from 'lucide-react';
import { CloudIntegration } from '../../types';

export const IntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState<CloudIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectId, setProjectId] = useState('mindmesh-prod-enterprise');
  const [region, setRegion] = useState('us-central1');
  const [lastTested, setLastTested] = useState<string>('');

  const fetchIntegrations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/integrations/status');
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data.integrations);
        setProjectId(data.projectId);
        setRegion(data.region);
        setLastTested(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1228] to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>GOOGLE CLOUD PLATFORM · INTEGRATION STATUS MATRIX</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Cloud Integrations & Verification
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time status check for Vertex AI, Search Datastores, Document AI, BigQuery, Firestore, and Cloud Run.
          </p>
        </div>

        <button
          onClick={fetchIntegrations}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-xl transition-all border border-slate-700 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Test All Services</span>
        </button>
      </div>

      {/* Cloud Environment Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-0.5">Google Cloud Project</span>
          <span className="font-mono text-xs font-bold text-white">{projectId}</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-0.5">Deployment Region</span>
          <span className="font-mono text-xs font-bold text-cyan-400">{region}</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-0.5">Last Verified At</span>
          <span className="font-mono text-xs font-bold text-emerald-400">{lastTested || 'Testing now...'}</span>
        </div>
      </div>

      {/* Status Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {integrations.map(integ => (
          <div
            key={integ.id}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{integ.category}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{integ.serviceName}</h3>
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase ${
                  integ.status === 'Connected and verified'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${integ.status === 'Connected and verified' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span>{integ.status}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                {integ.details}
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Model / Specification:</span>
                <span className="text-slate-200">{integ.model}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-mono">
                Probe Latency: <span className="text-emerald-400">{integ.latencyMs}ms</span>
              </span>
              <a
                href={integ.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>GCP Reference</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
