import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Calendar, 
  Clock,
  ArrowRight,
  CheckSquare,
  Filter,
  Check
} from 'lucide-react';
import { MeetingRecord, MeetingActionItem, TaskItem } from '../../types';

interface MeetingsViewProps {
  meetings: MeetingRecord[];
  tasks?: TaskItem[];
  onMeetingAnalyzed: (meeting: MeetingRecord) => void;
  onTasksConfirmed: (newTasks: any[]) => void;
  onTaskUpdated?: (updatedTask: TaskItem) => void;
  onTaskDeleted?: (id: string) => void;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({
  meetings,
  tasks = [],
  onMeetingAnalyzed,
  onTasksConfirmed,
  onTaskUpdated,
  onTaskDeleted,
}) => {
  const [activeTab, setActiveTab] = useState<'meetings' | 'tasks'>('meetings');
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(meetings[0] || null);
  const [rawNotes, setRawNotes] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Filter state for tasks registry
  const [taskFilter, setTaskFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Editable actions state for selected meeting
  const [editableActions, setEditableActions] = useState<MeetingActionItem[]>(
    selectedMeeting ? [...selectedMeeting.proposedActions] : []
  );

  const handleSelectMeeting = (meet: MeetingRecord) => {
    setSelectedMeeting(meet);
    setEditableActions([...meet.proposedActions]);
    setSaveSuccessMsg(null);
  };

  const handleAnalyze = async () => {
    if (!rawNotes.trim()) {
      setErrorMsg('Please paste meeting notes or a transcript.');
      return;
    }
    setIsAnalyzing(true);
    setErrorMsg(null);
    setSaveSuccessMsg(null);

    try {
      const res = await fetch('/api/meetings/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: meetingTitle || 'Executive Architecture & Strategy Sync',
          rawNotes,
          attendees: ['Elena Rostova', 'David Chen', 'Sarah Jenkins', 'Marcus Vance']
        })
      });

      if (!res.ok) throw new Error('Meeting analysis failed.');
      const data = await res.json();
      onMeetingAnalyzed(data.meeting);
      setSelectedMeeting(data.meeting);
      setEditableActions([...data.meeting.proposedActions]);
      setRawNotes('');
      setMeetingTitle('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error analyzing meeting.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmActions = async () => {
    if (!selectedMeeting) return;
    try {
      const res = await fetch('/api/meetings/actions/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId: selectedMeeting.id,
          actions: editableActions
        })
      });

      if (!res.ok) throw new Error('Failed to confirm action items.');
      const data = await res.json();
      onTasksConfirmed(data.createdTasks);
      setSaveSuccessMsg(`Successfully confirmed and saved ${data.createdTasks.length} task(s) to the enterprise task registry!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving action items.');
    }
  };

  const handleExportMarkdown = () => {
    if (!selectedMeeting) return;
    const md = `# ${selectedMeeting.title}
Date: ${selectedMeeting.date}
Attendees: ${selectedMeeting.attendees.join(', ')}

## Executive Summary
${selectedMeeting.summary}

## Key Decisions
${selectedMeeting.decisions.map(d => `- ${d}`).join('\n')}

## Unresolved Questions
${selectedMeeting.unresolvedQuestions.map(q => `- ${q}`).join('\n')}

## Action Items
${editableActions.map(a => `- [${a.approved ? 'x' : ' '}] ${a.description} (Owner: ${a.owner}, Deadline: ${a.deadline})`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMeeting.title.toLowerCase().replace(/\s+/g, '-')}-summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSampleTranscript = () => {
    setMeetingTitle('Q4 Enterprise Infrastructure & Security Audit');
    setRawNotes(`Elena Rostova (09:02): Good morning everyone. Let's review our VPC perimeter and BigQuery analytics connector status.
David Chen (09:04): BigQuery query parser is complete. We added AST validation to reject any DROP or DELETE statements. It guarantees read-only safety.
Sarah Jenkins (09:07): Excellent. For Document AI, we need to ensure IAM service account keys rotate on a 90-day cycle.
Action item: Sarah to document the KMS key rotation procedure by October 22.
Action item: David to submit the BigQuery query validator code for SOC2 compliance review by October 25.
Decided: We are moving forward with Google Cloud Run for the production serverless runtime.
Unresolved: Whether to configure external Slack webhooks through Google Cloud Pub/Sub or direct HTTP gateway.`);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = taskFilter === 'All' 
      ? true 
      : taskFilter === 'Completed' 
      ? t.status === 'Completed' 
      : t.status !== 'Completed';
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1228] to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Users className="w-4 h-4 text-amber-400" />
            <span>MEETING INTELLIGENCE & ACTION VERIFICATION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Meeting Intelligence & Action Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Summarize transcripts, extract key decisions, generate accountable action items, and maintain verified task tracking.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('meetings')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'meetings'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Transcripts & Summaries</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Action Items & Tasks ({tasks.length})</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: TRANSCRIPTS & SUMMARIES --- */}
      {activeTab === 'meetings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Transcript Input & Past Meetings */}
          <div className="lg:col-span-5 space-y-6">
            {/* Analyze Form */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Synthesize Transcript</span>
                </div>
                <button
                  onClick={loadSampleTranscript}
                  className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                >
                  Load Sample
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-3">
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="Meeting Title (e.g. Q4 Cloud Security Sync)"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />

                <textarea
                  rows={7}
                  value={rawNotes}
                  onChange={(e) => setRawNotes(e.target.value)}
                  placeholder="Paste meeting transcript or raw notes here..."
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Extracting Intelligence...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Synthesize Decisions & Actions</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Past Meetings List */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Synthesized Meetings ({meetings.length})
              </h3>
              <div className="space-y-2">
                {meetings.map(meet => (
                  <div
                    key={meet.id}
                    onClick={() => handleSelectMeeting(meet)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedMeeting?.id === meet.id
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="line-clamp-1">{meet.title}</span>
                      <span className="text-[11px] font-mono text-slate-500">{meet.date}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {meet.summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Selected Meeting Details */}
          <div className="lg:col-span-7 space-y-6">
            {selectedMeeting ? (
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Synthesized Intelligence</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{selectedMeeting.title}</h3>
                    <div className="text-xs text-slate-400 mt-1">
                      Attendees: {selectedMeeting.attendees.join(', ')} · Date: {selectedMeeting.date}
                    </div>
                  </div>

                  <button
                    onClick={handleExportMarkdown}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Export Markdown</span>
                  </button>
                </div>

                {saveSuccessMsg && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                {/* Executive Summary */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Executive Summary</div>
                  <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                    {selectedMeeting.summary}
                  </p>
                </div>

                {/* Decided vs Unresolved */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ratified Decisions</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-300">
                      {selectedMeeting.decisions.map((dec, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                          <span>{dec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Open Questions</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-300">
                      {selectedMeeting.unresolvedQuestions.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-amber-400 shrink-0 mt-0.5">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Items List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Proposed Action Items ({editableActions.length})
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Verify owners and deadlines. Click below to commit tasks to the enterprise task registry.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditableActions([
                          ...editableActions,
                          {
                            id: `act-${Date.now()}`,
                            description: 'New verified action item',
                            owner: 'Mohan Reddy',
                            deadline: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
                            approved: true
                          }
                        ]);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 rounded border border-cyan-500/30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Item</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {editableActions.map((act, idx) => (
                      <div
                        key={act.id}
                        className={`p-3 rounded-xl border text-xs transition-colors space-y-2 ${
                          act.approved ? 'bg-slate-950 border-emerald-500/30' : 'bg-slate-950/40 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={act.approved}
                            onChange={(e) => {
                              const updated = [...editableActions];
                              updated[idx].approved = e.target.checked;
                              setEditableActions(updated);
                            }}
                            className="mt-1 w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={act.description}
                            onChange={(e) => {
                              const updated = [...editableActions];
                              updated[idx].description = e.target.value;
                              setEditableActions(updated);
                            }}
                            className="w-full bg-transparent text-slate-200 focus:outline-none focus:border-b border-cyan-500 pb-0.5"
                          />
                          <button
                            onClick={() => {
                              setEditableActions(editableActions.filter((_, i) => i !== idx));
                            }}
                            className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 pl-7 text-[11px] text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <span>Owner:</span>
                            <input
                              type="text"
                              value={act.owner}
                              onChange={(e) => {
                                const updated = [...editableActions];
                                updated[idx].owner = e.target.value;
                                setEditableActions(updated);
                              }}
                              className="bg-slate-900 px-2 py-0.5 rounded text-slate-200 border border-slate-800 focus:outline-none w-28"
                            />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span>Deadline:</span>
                            <input
                              type="date"
                              value={act.deadline}
                              onChange={(e) => {
                                const updated = [...editableActions];
                                updated[idx].deadline = e.target.value;
                                setEditableActions(updated);
                              }}
                              className="bg-slate-900 px-2 py-0.5 rounded text-slate-200 border border-slate-800 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleConfirmActions}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer mt-4"
                  >
                    <Save className="w-4 h-4" />
                    <span>Confirm & Commit Approved Tasks to Registry</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 rounded-2xl bg-slate-900/40 border border-slate-800">
                Select or analyze a meeting to view intelligence.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: ACTION ITEMS & TASK REGISTRY --- */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Status:</span>
              {(['All', 'Pending', 'Completed'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setTaskFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    taskFilter === s
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Task Cards List */}
          {filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks.map(task => {
                const isCompleted = task.status === 'Completed';

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border text-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => {
                          if (onTaskUpdated) {
                            onTaskUpdated({
                              ...task,
                              status: isCompleted ? 'In Progress' : 'Completed'
                            });
                          }
                        }}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-black'
                            : 'border-slate-600 hover:border-emerald-400 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-1">
                        <div className={`font-semibold text-white ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                          {task.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          <span>Assignee: <strong className="text-slate-300 font-medium">{task.assignee}</strong></span>
                          <span>•</span>
                          <span>Due: <strong className="text-slate-300 font-medium font-mono">{task.dueDate}</strong></span>
                          <span>•</span>
                          <span className="text-slate-500">Source: {task.source}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                        task.priority === 'High'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : task.priority === 'Medium'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {task.priority} Priority
                      </span>

                      {onTaskDeleted && (
                        <button
                          onClick={() => onTaskDeleted(task.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800 text-slate-500 text-xs">
              No task records found matching current filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
