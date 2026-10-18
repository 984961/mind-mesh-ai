import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Plus, 
  Filter, 
  Calendar, 
  User, 
  FileText, 
  Users, 
  GitBranch,
  ShieldCheck
} from 'lucide-react';
import { TaskItem } from '../../types';

interface TasksViewProps {
  tasks: TaskItem[];
  onTaskCreated: (task: TaskItem) => void;
  onTaskUpdated: (task: TaskItem) => void;
  onTaskDeleted: (id: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New task form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignee, setNewAssignee] = useState('Mohan Reddy');
  const [newDueDate, setNewDueDate] = useState('2026-10-25');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'All') return true;
    return t.status === filterStatus;
  });

  const handleToggleStatus = async (task: TaskItem) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        const data = await res.json();
        onTaskUpdated(data.task);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) onTaskDeleted(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          assignee: newAssignee,
          dueDate: newDueDate,
          priority: newPriority,
          source: 'Manual Entry'
        })
      });
      if (res.ok) {
        const data = await res.json();
        onTaskCreated(data.task);
        setShowCreateModal(false);
        setNewTitle('');
        setNewDesc('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1228] to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>ENTERPRISE ACTION REGISTRY · WORKSPACE ISOLATION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Tasks & Action Items
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centralized repository of verified tasks originated from meeting transcripts, document audits, and agent workflows.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2">
          {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                filterStatus === status
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-500">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>

      {/* Tasks Table */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
        <div className="space-y-2.5">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border text-xs transition-colors flex items-center justify-between gap-4 ${
                task.status === 'Completed'
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1">
                <input
                  type="checkbox"
                  checked={task.status === 'Completed'}
                  onChange={() => handleToggleStatus(task)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                />

                <div className="space-y-0.5">
                  <div className={`font-semibold text-sm ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-white'}`}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-slate-400 text-xs">{task.description}</div>
                  )}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                    <span>Source: {task.source}</span>
                    <span>·</span>
                    <span className="text-slate-400">Owner: {task.assignee}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                  task.priority === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {task.priority}
                </span>

                <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                  Due {task.dueDate}
                </span>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#090d1a] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Create Enterprise Task</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Conduct cryptographic key audit"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Task scope and deliverables..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assignee</label>
                  <input
                    type="text"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
