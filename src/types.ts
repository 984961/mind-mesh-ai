export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  workspaceId: string;
  permissions: string[];
  mode: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  sourceType: 'PDF' | 'DOCX' | 'TXT' | 'CSV';
  content: string;
  summary: string;
  entities: string[];
  risks: string[];
  actionItems: string[];
  extractionMethod: string;
  createdAt: string;
  sizeBytes: number;
  author: string;
}

export interface GroundedSource {
  id: string;
  title: string;
  snippet: string;
  category: string;
  confidence: number;
  section: string;
  sourceType: string;
}

export interface KnowledgeResponse {
  answer: string;
  isGrounded: boolean;
  groundedSources: GroundedSource[];
  suggestedFollowUps: string[];
  injectionPrevented?: boolean;
  latencyMs: number;
}

export interface MeetingActionItem {
  id: string;
  description: string;
  owner: string;
  deadline: string;
  approved: boolean;
}

export interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  attendees: string[];
  rawNotes: string;
  summary: string;
  decisions: string[];
  unresolvedQuestions: string[];
  proposedActions: MeetingActionItem[];
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  source: string;
  sourceType: 'Meeting' | 'Document' | 'Workflow' | 'Manual';
  createdAt: string;
}

export interface WorkflowStep {
  name: string;
  status: 'Completed' | 'Pending' | 'In Progress' | 'Waiting Approval' | 'Skipped';
  details: string;
}

export interface WorkflowRun {
  id: string;
  templateName: string;
  status: 'Running' | 'Awaiting Approval' | 'Completed' | 'Failed';
  startedAt: string;
  completedAt?: string;
  initiatedBy: string;
  steps: WorkflowStep[];
  pendingAction?: {
    actionType: string;
    targetService: string;
    payloadSummary: string;
    impactLevel: 'High' | 'Medium' | 'Low';
    requiredRole: string;
  };
}

export interface CloudIntegration {
  id: string;
  serviceName: string;
  category: string;
  status: 'Connected and verified' | 'Configuration required' | 'Test failed' | 'Local demo mode';
  model: string;
  details: string;
  latencyMs: number;
  docsUrl: string;
}

export interface EvaluationResult {
  testId: string;
  name: string;
  category: string;
  status: 'PASSED' | 'FAILED';
  latencyMs: number;
  metric: string;
  score: string;
  assertion: string;
}

export interface EvaluationSuiteRun {
  runTimestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  overallScore: string;
  averageLatencyMs: number;
  results: EvaluationResult[];
}
