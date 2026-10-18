import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Database, 
  Play, 
  ShieldCheck, 
  ShieldAlert, 
  Table, 
  BarChart2, 
  PieChart, 
  AlertTriangle, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  TrendingUp, 
  RotateCcw, 
  Sparkles, 
  Download, 
  Search, 
  Filter, 
  Layers,
  Key,
  Info
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'csv' | 'bigquery'>('csv');

  // --- CSV / File Analytics State ---
  const [fileData, setFileData] = useState<any[]>([
    { department: 'Engineering', headcount: 142, avg_doc_search_min_before: 22.4, avg_doc_search_min_after: 3.8, weekly_hours_saved: 540.2, action_item_completion_rate: 0.88 },
    { department: 'Product Management', headcount: 38, avg_doc_search_min_before: 18.6, avg_doc_search_min_after: 2.4, weekly_hours_saved: 122.5, action_item_completion_rate: 0.94 },
    { department: 'Customer Operations', headcount: 95, avg_doc_search_min_before: 26.0, avg_doc_search_min_after: 4.1, weekly_hours_saved: 415.8, action_item_completion_rate: 0.82 },
    { department: 'Legal & Compliance', headcount: 24, avg_doc_search_min_before: 31.5, avg_doc_search_min_after: 5.2, weekly_hours_saved: 126.0, action_item_completion_rate: 0.96 },
    { department: 'Information Security', headcount: 42, avg_doc_search_min_before: 19.8, avg_doc_search_min_after: 3.0, weekly_hours_saved: 154.6, action_item_completion_rate: 0.91 },
    { department: 'Sales Engineering', headcount: 64, avg_doc_search_min_before: 24.2, avg_doc_search_min_after: 4.5, weekly_hours_saved: 252.0, action_item_completion_rate: 0.85 },
  ]);
  const [fileName, setFileName] = useState('enterprise_operations_q3.csv');
  const [tableFilter, setTableFilter] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(
    "Across the 6 enterprise divisions, MindMeshAI saved an aggregate 1,611.1 hours/week. Legal & Compliance achieved the highest action item completion rate (96%), while Engineering gained the largest absolute time reclaim (540.2 hrs/wk) by reducing document search latency from 22.4 to 3.8 minutes."
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Column definitions based on fileData
  const columns = useMemo(() => {
    if (!fileData || fileData.length === 0) return [];
    return Object.keys(fileData[0]);
  }, [fileData]);

  const numericColumns = useMemo(() => {
    if (!fileData || fileData.length === 0) return [];
    return columns.filter(col => fileData.some(row => typeof row[col] === 'number' && !isNaN(row[col])));
  }, [columns, fileData]);

  const categoricalColumns = useMemo(() => {
    if (!fileData || fileData.length === 0) return [];
    return columns.filter(col => !numericColumns.includes(col));
  }, [columns, numericColumns]);

  // Selected dimensions for visualization
  const [selectedCategoryCol, setSelectedCategoryCol] = useState<string>('department');
  const [selectedMetricCol, setSelectedMetricCol] = useState<string>('weekly_hours_saved');

  useEffect(() => {
    if (categoricalColumns.length > 0 && !categoricalColumns.includes(selectedCategoryCol)) {
      setSelectedCategoryCol(categoricalColumns[0]);
    }
    if (numericColumns.length > 0 && !numericColumns.includes(selectedMetricCol)) {
      setSelectedMetricCol(numericColumns[0]);
    }
  }, [categoricalColumns, numericColumns]);

  // Computed KPIs
  const kpis = useMemo(() => {
    if (!fileData || fileData.length === 0) return null;
    const totalRows = fileData.length;
    const metricValues = fileData.map(r => Number(r[selectedMetricCol]) || 0);
    const sum = metricValues.reduce((a, b) => a + b, 0);
    const avg = sum / totalRows;
    const max = Math.max(...metricValues);
    const min = Math.min(...metricValues);

    return {
      totalRows,
      metricName: selectedMetricCol,
      sum: Number.isInteger(sum) ? sum : sum.toFixed(1),
      avg: avg.toFixed(1),
      max: Number.isInteger(max) ? max : max.toFixed(1),
      min: Number.isInteger(min) ? min : min.toFixed(1),
    };
  }, [fileData, selectedMetricCol]);

  // Handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        parseAndSetCsv(text);
      } catch (err) {
        console.error('Failed to parse file:', err);
      }
    };

    reader.readAsText(file);
  };

  const parseAndSetCsv = (csvText: string) => {
    const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return;

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    
    // Parse rows
    const rows = lines.slice(1).map(line => {
      // Split with quotes support
      const values: string[] = [];
      let inQuotes = false;
      let curVal = '';

      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"' || c === "'") {
          inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          values.push(curVal.trim().replace(/^["']|["']$/g, ''));
          curVal = '';
        } else {
          curVal += c;
        }
      }
      values.push(curVal.trim().replace(/^["']|["']$/g, ''));

      const rowObj: any = {};
      headers.forEach((h, idx) => {
        const raw = values[idx] !== undefined ? values[idx] : '';
        const num = Number(raw);
        rowObj[h] = !isNaN(num) && raw !== '' ? num : raw;
      });
      return rowObj;
    });

    setFileData(rows);
    setAiInsights(null);
  };

  // Generate AI Insights from current dataset
  const generateInsights = async () => {
    if (!fileData || fileData.length === 0) return;
    setIsAiAnalyzing(true);
    try {
      const sample = fileData.slice(0, 10);
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Please provide a concise, 2-paragraph business data executive briefing on this dataset (${fileName}). Key metrics: ${JSON.stringify(kpis)}. Sample data rows: ${JSON.stringify(sample)}. Identify key trends, top performers, and actionable recommendations.`,
          conversationId: 'analytics_insights',
          context: { page: 'analytics' }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiInsights(data.message?.text || 'Analysis completed.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // --- BigQuery & Safe SQL State ---
  const defaultQuery = `SELECT department, headcount, avg_doc_search_min_before, avg_doc_search_min_after, weekly_hours_saved, action_item_completion_rate\nFROM \`mindmesh-prod-enterprise.analytics.enterprise_operations_q3\`\nORDER BY weekly_hours_saved DESC\nLIMIT 100;`;

  const [sqlQuery, setSqlQuery] = useState(defaultQuery);
  const [isRunningSql, setIsRunningSql] = useState(false);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [securityBlock, setSecurityBlock] = useState<any>(null);
  const [configBlock, setConfigBlock] = useState<any>(null);
  const [diagnosticError, setDiagnosticError] = useState<string | null>(null);

  const runSqlQuery = async (queryToRun: string) => {
    setIsRunningSql(true);
    setSecurityBlock(null);
    setConfigBlock(null);
    setDiagnosticError(null);
    setQueryResult(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch('/api/analytics/query', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ sqlQuery: queryToRun }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const rawText = await res.text();
        setDiagnosticError(
          `Server returned a non-JSON response (HTTP ${res.status}). Preview: "${rawText.slice(0, 100)}"`
        );
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.isBlocked) {
          setSecurityBlock(data);
        } else if (data.isConfigError) {
          setConfigBlock(data);
        } else {
          setDiagnosticError(data.error || `Server returned error status HTTP ${res.status}`);
        }
        return;
      }

      if (data.isConfigError) {
        setConfigBlock(data);
      } else {
        setQueryResult(data);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setDiagnosticError('Request timed out: Query execution exceeded 12 seconds.');
      } else {
        setDiagnosticError(`Network exception: ${err.message || 'Failed to communicate with analytics endpoint.'}`);
      }
    } finally {
      setIsRunningSql(false);
    }
  };

  // Filtered rows for CSV Table
  const filteredRows = useMemo(() => {
    if (!tableFilter.trim()) return fileData;
    const q = tableFilter.toLowerCase();
    return fileData.filter(row => 
      Object.values(row).some(v => String(v).toLowerCase().includes(q))
    );
  }, [fileData, tableFilter]);

  // Color palette for charts
  const colors = ['#06b6d4', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#071329] to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>ENTERPRISE DATA ANALYTICS · CSV VISUALIZER & BIGQUERY ENGINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Data Analytics & Visualization Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Upload CSV/Excel data to dynamically generate KPI cards, interactive bar charts, and pie distributions. Connect to Google BigQuery for authorized enterprise SQL analysis.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'csv'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV / File Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('bigquery')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'bigquery'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>BigQuery SQL Studio</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: CSV / FILE ANALYTICS --- */}
      {activeTab === 'csv' && (
        <div className="space-y-6">
          {/* Controls: Upload & Column Controls */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.tsv,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-cyan-600/20 flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload CSV / Excel File</span>
              </button>

              <button
                onClick={() => {
                  setFileName('enterprise_operations_q3.csv');
                  setFileData([
                    { department: 'Engineering', headcount: 142, avg_doc_search_min_before: 22.4, avg_doc_search_min_after: 3.8, weekly_hours_saved: 540.2, action_item_completion_rate: 0.88 },
                    { department: 'Product Management', headcount: 38, avg_doc_search_min_before: 18.6, avg_doc_search_min_after: 2.4, weekly_hours_saved: 122.5, action_item_completion_rate: 0.94 },
                    { department: 'Customer Operations', headcount: 95, avg_doc_search_min_before: 26.0, avg_doc_search_min_after: 4.1, weekly_hours_saved: 415.8, action_item_completion_rate: 0.82 },
                    { department: 'Legal & Compliance', headcount: 24, avg_doc_search_min_before: 31.5, avg_doc_search_min_after: 5.2, weekly_hours_saved: 126.0, action_item_completion_rate: 0.96 },
                    { department: 'Information Security', headcount: 42, avg_doc_search_min_before: 19.8, avg_doc_search_min_after: 3.0, weekly_hours_saved: 154.6, action_item_completion_rate: 0.91 },
                    { department: 'Sales Engineering', headcount: 64, avg_doc_search_min_before: 24.2, avg_doc_search_min_after: 4.5, weekly_hours_saved: 252.0, action_item_completion_rate: 0.85 },
                  ]);
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors border border-slate-700 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Sample Data</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
                <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-white truncate max-w-xs">{fileName}</span>
                <span className="text-slate-600">({fileData.length} rows)</span>
              </div>
            </div>

            {/* Dimension / Metric Selectors */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Category:</span>
                <select
                  value={selectedCategoryCol}
                  onChange={(e) => setSelectedCategoryCol(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {categoricalColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Metric:</span>
                <select
                  value={selectedMetricCol}
                  onChange={(e) => setSelectedMetricCol(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  {numericColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={generateInsights}
                disabled={isAiAnalyzing}
                className="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiAnalyzing ? 'Synthesizing...' : 'AI Insights'}</span>
              </button>
            </div>
          </div>

          {/* AI Insights Card if available */}
          {aiInsights && (
            <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Gemini Executive Data Synthesis</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {aiInsights}
              </p>
            </div>
          )}

          {/* Dynamic KPI Cards */}
          {kpis && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">Total Analyzed Records</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {kpis.totalRows}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Rows in dataset</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400 truncate">Total {kpis.metricName}</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                  {kpis.sum}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Aggregate metric sum</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400 truncate">Average {kpis.metricName}</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {kpis.avg}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Mean per record</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">Range (Min — Max)</div>
                <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
                  {kpis.min} — {kpis.max}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Spread range</div>
              </div>
            </div>
          )}

          {/* Visualizations: Bar Chart & Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Bar Chart (7 Cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {selectedMetricCol} by {selectedCategoryCol}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Ranked Comparison</span>
              </div>

              {/* Bar Rows */}
              <div className="space-y-3.5 pt-2">
                {(() => {
                  const maxVal = Math.max(...fileData.map(r => Number(r[selectedMetricCol]) || 0), 1);
                  return fileData.map((row, idx) => {
                    const catVal = String(row[selectedCategoryCol] || `Item ${idx + 1}`);
                    const numVal = Number(row[selectedMetricCol]) || 0;
                    const pct = Math.min(100, Math.max(5, (numVal / maxVal) * 100));

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-300 truncate max-w-xs">{catVal}</span>
                          <span className="font-mono text-cyan-400 font-semibold">{numVal}</span>
                        </div>
                        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex items-center">
                          <div
                            style={{ 
                              width: `${pct}%`,
                              backgroundColor: colors[idx % colors.length]
                            }}
                            className="h-full rounded-full transition-all duration-500 shadow-sm"
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Pie / Donut Breakdown Chart (5 Cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Proportional Distribution
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Share of Total</span>
                </div>

                {/* Donut representation */}
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-40 h-40 rounded-full border-8 border-slate-950 flex items-center justify-center bg-slate-900/80 shadow-inner">
                    <div className="text-center">
                      <div className="text-xl font-bold font-mono text-white">{fileData.length}</div>
                      <div className="text-[10px] uppercase font-mono text-slate-400">Categories</div>
                    </div>
                  </div>
                </div>

                {/* Legend list with calculated shares */}
                <div className="space-y-2 pt-2">
                  {(() => {
                    const totalMetric = fileData.reduce((acc, r) => acc + (Number(r[selectedMetricCol]) || 0), 0) || 1;
                    return fileData.slice(0, 5).map((row, idx) => {
                      const catVal = String(row[selectedCategoryCol] || `Item ${idx + 1}`);
                      const numVal = Number(row[selectedMetricCol]) || 0;
                      const share = ((numVal / totalMetric) * 100).toFixed(1);

                      return (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2.5 h-2.5 rounded-full shrink-0" 
                              style={{ backgroundColor: colors[idx % colors.length] }} 
                            />
                            <span className="text-slate-300 truncate max-w-[140px]">{catVal}</span>
                          </div>
                          <span className="font-mono text-slate-400 text-[11px]">{share}%</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-800">
                Visualizing proportional share based on active column: <code className="text-cyan-300 font-mono">{selectedMetricCol}</code>
              </div>
            </div>
          </div>

          {/* Interactive Data Table */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Raw Dataset Records ({filteredRows.length} Rows)
                </h3>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tableFilter}
                  onChange={(e) => setTableFilter(e.target.value)}
                  placeholder="Filter records..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    {columns.map(col => (
                      <th key={col} className="py-2.5 px-3 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {filteredRows.slice(0, 50).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      {columns.map(col => (
                        <td key={col} className="py-2.5 px-3 whitespace-nowrap text-slate-300">
                          {String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: BIGQUERY & SAFE SQL STUDIO --- */}
      {activeTab === 'bigquery' && (
        <div className="space-y-6">
          {/* Security & Scope Banner */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Google BigQuery SQL Engine (AST Read-Only Protection)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                Authorized Scope: mindmesh-prod-enterprise.analytics.*
              </span>
            </div>

            <textarea
              rows={4}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="Enter read-only BigQuery standard SQL (e.g. SELECT department, weekly_hours_saved FROM ...)"
              className="w-full p-3.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              {/* Security Test Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const malicious = "DROP TABLE `mindmesh-prod-enterprise.analytics.enterprise_operations_q3`;";
                    setSqlQuery(malicious);
                    runSqlQuery(malicious);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg hover:bg-rose-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Test DROP Barrier</span>
                </button>

                <button
                  onClick={() => {
                    const multi = "SELECT * FROM enterprise_operations_q3; DROP TABLE enterprise_operations_q3;";
                    setSqlQuery(multi);
                    runSqlQuery(multi);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test Batch Injection</span>
                </button>

                <button
                  onClick={() => {
                    setSqlQuery(defaultQuery);
                    runSqlQuery(defaultQuery);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Safe Query</span>
                </button>
              </div>

              <button
                onClick={() => runSqlQuery(sqlQuery)}
                disabled={isRunningSql || !sqlQuery.trim()}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 shrink-0"
              >
                {isRunningSql ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Validating & Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Execute Query</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Security Policy Violation Banner */}
          {securityBlock && (
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 space-y-2.5 shadow-lg shadow-rose-950/20">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Security Policy Violation Enforced</span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {securityBlock.error}
              </p>
              {securityBlock.violatingPattern && (
                <div className="text-[11px] font-mono text-rose-300 bg-black/40 p-2.5 rounded-lg border border-rose-500/20">
                  Violating pattern flagged: <code className="font-bold text-rose-200">{securityBlock.violatingPattern}</code>
                </div>
              )}
            </div>
          )}

          {/* BigQuery Configuration Required Banner */}
          {configBlock && (
            <div className="p-6 rounded-2xl bg-[#091428] border border-cyan-500/30 text-slate-200 space-y-4 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Google BigQuery Configuration Required</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Live Credentials Unconfigured
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Your query passed AST read-only validation and targeted an allowlisted table. To query your live BigQuery warehouse, configure credentials in your environment.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>AST Guard: Passed</span>
                </div>
              </div>

              {/* Required GCP Roles */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-2">
                <div className="text-slate-300 font-semibold flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GCP Requirements for Live Warehouse Connection:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] pl-1">
                  <li>Set <code className="text-cyan-300 font-mono">BIGQUERY_PROJECT_ID</code> in environment.</li>
                  <li>Set <code className="text-cyan-300 font-mono">GOOGLE_APPLICATION_CREDENTIALS</code> to your service account key.</li>
                  <li>Required IAM roles: <code className="text-emerald-300 font-mono">roles/bigquery.dataViewer</code> and <code className="text-emerald-300 font-mono">roles/bigquery.jobUser</code>.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Diagnostic Error Banner */}
          {diagnosticError && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Endpoint Diagnostic Notice</span>
              </div>
              <p className="text-xs font-mono leading-relaxed bg-black/40 p-3 rounded-lg border border-amber-500/20">
                {diagnosticError}
              </p>
            </div>
          )}

          {/* Live Query Results if returned */}
          {queryResult && queryResult.rows && queryResult.rows.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Query Results ({queryResult.rowCount} Rows)
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400">AST Validated</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                      {queryResult.columns?.map((col: string) => (
                        <th key={col} className="py-2.5 px-3">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {queryResult.rows.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        {queryResult.columns?.map((col: string) => (
                          <td key={col} className="py-2.5 px-3 text-slate-300">{String(row[col])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
