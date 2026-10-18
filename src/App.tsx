import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DemoModal } from './components/DemoModal';
import { SearchModal } from './components/SearchModal';
import { WorkspaceLayout } from './components/WorkspaceLayout';
import { DashboardView } from './components/views/DashboardView';
import { KnowledgeView } from './components/views/KnowledgeView';
import { DocumentsView } from './components/views/DocumentsView';
import { MeetingsView } from './components/views/MeetingsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { WorkflowsView } from './components/views/WorkflowsView';
import { FloatingChatWidget } from './components/FloatingChatWidget';
import { AssistantView } from './components/views/AssistantView';
import { KnowledgeDocument, MeetingRecord, TaskItem, WorkflowRun, UserProfile } from './types';

export default function App() {
  const [inWorkspace, setInWorkspace] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Enterprise Store State
  const [user, setUser] = useState<UserProfile>({
    uid: 'usr-admin-01',
    email: 'mohanreddym491@gmail.com',
    displayName: 'Mohan Reddy',
    role: 'Enterprise Admin',
    workspaceId: 'ws-mindmesh-global',
    permissions: ['all'],
    mode: 'Verified Enterprise Workspace'
  });

  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowRun[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Initial Data Fetching from full-stack server
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [docsRes, meetsRes, tasksRes, wfsRes, authRes] = await Promise.all([
          fetch('/api/documents'),
          fetch('/api/meetings'),
          fetch('/api/tasks'),
          fetch('/api/workflows'),
          fetch('/api/auth/verify', { method: 'POST' })
        ]);

        if (docsRes.ok) {
          const d = await docsRes.json();
          setDocuments(d.documents || []);
        }
        if (meetsRes.ok) {
          const m = await meetsRes.json();
          setMeetings(m.meetings || []);
        }
        if (tasksRes.ok) {
          const t = await tasksRes.json();
          setTasks(t.tasks || []);
        }
        if (wfsRes.ok) {
          const w = await wfsRes.json();
          setWorkflows(w.workflows || []);
        }
        if (authRes.ok) {
          const a = await authRes.json();
          if (a.user) setUser(a.user);
        }
      } catch (err) {
        console.error('Initial data load:', err);
      }
    };

    loadInitialData();
  }, []);

  // Navigation Handlers
  const handleEnterWorkspace = (targetView?: string) => {
    setInWorkspace(true);
    if (targetView) setCurrentView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnLanding = () => {
    setInWorkspace(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* If not in workspace, show top Navbar and Landing Page */}
      {!inWorkspace ? (
        <div className="h-screen h-[100dvh] max-h-screen flex flex-col overflow-hidden bg-[#030712]">
          <Navbar
            currentView={currentView}
            onNavigate={(view) => {
              if (view === 'landing') {
                handleReturnLanding();
              } else {
                handleEnterWorkspace(view);
              }
            }}
            inWorkspace={inWorkspace}
            onToggleWorkspace={() => handleEnterWorkspace('dashboard')}
            onOpenSearch={() => setSearchModalOpen(true)}
          />
          <LandingPage
            onEnterWorkspace={handleEnterWorkspace}
            onWatchDemo={() => setDemoModalOpen(true)}
          />
        </div>
      ) : (
        /* Authenticated Workspace with Sidebar and View Routing */
        <WorkspaceLayout
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onReturnLanding={handleReturnLanding}
          user={user}
        >
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={(view) => setCurrentView(view)}
              documents={documents}
              meetings={meetings}
              tasks={tasks}
              workflows={workflows}
              onOpenUpload={() => {
                setCurrentView('documents');
              }}
            />
          )}

          {currentView === 'knowledge' && <KnowledgeView />}

          {currentView === 'documents' && (
            <DocumentsView
              documents={documents}
              onUploadSuccess={(newDoc) => setDocuments(prev => [newDoc, ...prev])}
              onDeleteSuccess={(id) => setDocuments(prev => prev.filter(d => d.id !== id))}
            />
          )}

          {(currentView === 'meetings' || currentView === 'tasks') && (
            <MeetingsView
              meetings={meetings}
              tasks={tasks}
              onMeetingAnalyzed={(newMeet) => setMeetings(prev => [newMeet, ...prev])}
              onTasksConfirmed={(createdTasks) => setTasks(prev => [...createdTasks, ...prev])}
              onTaskUpdated={(updatedTask) => {
                setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
              }}
              onTaskDeleted={(id) => setTasks(prev => prev.filter(t => t.id !== id))}
            />
          )}

          {currentView === 'analytics' && <AnalyticsView />}

          {(currentView === 'assistant' || currentView === 'research') && (
            <AssistantView onNavigate={(view) => setCurrentView(view)} />
          )}

          {currentView === 'workflows' && (
            <WorkflowsView
              workflows={workflows}
              onWorkflowCreated={(newWf) => setWorkflows(prev => [newWf, ...prev])}
              onWorkflowUpdated={(updatedWf) => {
                setWorkflows(prev => prev.map(w => w.id === updatedWf.id ? updatedWf : w));
              }}
            />
          )}
        </WorkspaceLayout>
      )}

      {/* Floating Universal AI Assistant Chatbot */}
      <FloatingChatWidget
        currentPage={inWorkspace ? currentView : 'landing'}
        onNavigateView={(view) => handleEnterWorkspace(view)}
      />

      {/* Interactive Walkthrough Demo Modal */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onOpenWorkspace={(view) => {
          setDemoModalOpen(false);
          handleEnterWorkspace(view);
        }}
      />

      {/* Global Knowledge & Tools Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        documents={documents}
        meetings={meetings}
        onSelectResult={(view) => {
          handleEnterWorkspace(view);
        }}
      />
    </div>
  );
}
