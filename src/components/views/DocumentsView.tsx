import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  Filter,
  ShieldAlert,
  Calendar,
  Layers
} from 'lucide-react';
import { KnowledgeDocument } from '../../types';

interface DocumentsViewProps {
  documents: KnowledgeDocument[];
  onUploadSuccess: (newDoc: KnowledgeDocument) => void;
  onDeleteSuccess: (id: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onUploadSuccess,
  onDeleteSuccess,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeDoc, setActiveDoc] = useState<KnowledgeDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Operations');
  const [uploadContent, setUploadContent] = useState('');
  const [uploadType, setUploadType] = useState<'PDF' | 'DOCX' | 'TXT' | 'CSV'>('PDF');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(documents.map(d => d.category)))];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadContent.trim()) {
      setUploadError('Title and document content are required.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          category: uploadCategory,
          content: uploadContent,
          sourceType: uploadType
        })
      });

      if (!res.ok) {
        throw new Error('Failed to upload document.');
      }

      const data = await res.json();
      onUploadSuccess(data.document);
      setShowUploadModal(false);
      setUploadTitle('');
      setUploadContent('');
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document from the knowledge base?')) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onDeleteSuccess(id);
        if (activeDoc?.id === id) setActiveDoc(null);
      }
    } catch (err) {
      console.error('Delete document failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1228] to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>GOOGLE DOCUMENT AI v1 · STRUCTURAL OCR & ENTITY EXTRACTION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Enterprise Document Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ingest PDFs, Word files, text specs, and CSV reports into private Cloud Storage with automatic entity and risk detection.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all shadow-lg shadow-cyan-600/20 shrink-0 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload & Parse Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter indexed documents..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-950/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">{doc.sourceType}</span>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{doc.title}</h3>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(doc.id)}
                  title="Delete Document"
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {doc.summary}
              </p>

              {/* Entity Badges (clean unboxed text metadata) */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                <span className="text-slate-500 font-mono">Entities:</span>
                {doc.entities.slice(0, 3).map((e, idx) => (
                  <span key={idx} className="text-slate-300">
                    {e}{idx < Math.min(doc.entities.length, 3) - 1 ? ' ·' : ''}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                {doc.extractionMethod}
              </span>
              <button
                onClick={() => setActiveDoc(doc)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Intelligence</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Detail Inspector Modal */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#090d1a] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{activeDoc.category} · {activeDoc.sourceType}</span>
                <h3 className="text-lg font-bold text-white mt-1">{activeDoc.title}</h3>
                <div className="text-xs text-slate-400 mt-0.5">Author: {activeDoc.author} · Added: {activeDoc.createdAt}</div>
              </div>
              <button
                onClick={() => setActiveDoc(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Executive Summary */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Executive Synthesis</div>
              <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                {activeDoc.summary}
              </p>
            </div>

            {/* Key Entities & Detected Risks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Named Entities Extracted ({activeDoc.entities.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-slate-300">
                  {activeDoc.entities.map((ent, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                      {ent}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Compliance & Security Risks ({activeDoc.risks.length})</span>
                </div>
                <ul className="space-y-1 text-slate-300 list-disc list-inside text-[11px]">
                  {activeDoc.risks.map((risk, idx) => (
                    <li key={idx}>{risk}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Items */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Extracted Action Items ({activeDoc.actionItems.length})</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-xs">
                {activeDoc.actionItems.map((act, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Raw Extracted Text Segment */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-400">Underlying Text Content:</div>
              <pre className="p-3 rounded-lg bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-400 max-h-40 overflow-y-auto whitespace-pre-wrap">
                {activeDoc.content}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#090d1a] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Ingest Enterprise Document</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Document Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Q4 Cloud Migration & Zero-Trust Architecture Review"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
                  >
                    <option value="Security & Architecture">Security & Architecture</option>
                    <option value="Operations">Operations</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Format Type</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
                  >
                    <option value="PDF">PDF (Portable Document)</option>
                    <option value="DOCX">DOCX (Word Specification)</option>
                    <option value="TXT">TXT (Plaintext Notes)</option>
                    <option value="CSV">CSV (Structured Dataset)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Document Text / Specification</label>
                <textarea
                  rows={6}
                  value={uploadContent}
                  onChange={(e) => setUploadContent(e.target.value)}
                  placeholder="Paste document text or policy draft here for Document AI extraction..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isUploading ? 'Extracting via Document AI...' : 'Parse & Ingest Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
