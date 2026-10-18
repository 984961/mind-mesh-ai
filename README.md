# MindMeshAI — Connecting Human Intelligence with AI Intelligence

> **Hackathon Track**: Future of Work & Enterprise Productivity  
> **Product Message**: Connect Knowledge. Empower Intelligence.  
> **Cloud Platform**: Google Cloud & Vertex AI Native Architecture

---

## 1. Executive Summary

Organizations are submerged in fragmented knowledge: technical specifications, policy PDFs, unrecorded meeting discussions, ad-hoc spreadsheets, and disconnected automation scripts. Teams lose an estimated **4.8 hours per employee weekly** hunting for context and validating decisions.

**MindMeshAI** provides a unified enterprise intelligence workspace that harmonizes human strategic context with Google Cloud foundation models:
1. **Evidence-Grounded Knowledge Assistant (RAG)**: Dual-pass retrieval across authorized enterprise records with real citations and zero-hallucination guarantees.
2. **Document Intelligence**: Deep OCR, entity recognition, compliance risk identification, and automated action item extraction powered by Google Document AI v1.
3. **Meeting Intelligence**: Audio transcript analysis extracting ratified decisions, open questions, and accountable tasks requiring human confirmation before commitment.
4. **Business Data Analyst**: Safe SQL execution against BigQuery datasets protected by AST-level rejection of destructive mutations (`DROP`, `DELETE`, `ALTER`).
5. **Google ADK Agent Orchestration**: Multi-step agent pipelines with cryptographic human-in-the-loop approval gates before any external state change (Slack, Jira, webhooks).
6. **Empirical AI Safety & Evaluation Console**: Continuous verification suite measuring citation fidelity, prompt injection defense, and schema adherence.

---

## 2. Google Cloud Platform Architecture

```
[ Client Browser / PWA ] 
          │  HTTPS / TLS 1.3
          ▼
[ Google Cloud Load Balancing + Cloud Armor ]
          │
          ▼
[ Google Cloud Run (Containerized Node.js Microservice) ]
    ├── Vertex AI Gemini API (gemini-3.8-flash)
    ├── Vertex AI Search (Enterprise Datastores & Dense Vector Retrieval)
    ├── Google Document AI v1 (Document OCR, Entity & Form Parser)
    ├── Google ADK & Vertex AI Agent Engine (Multi-Step Gated Workflows)
    ├── Google BigQuery (AST Read-Only Authorized Views)
    ├── Cloud Firestore & Firebase Auth (User Identity & State Persistence)
    └── Google Cloud Storage (CMEK-Encrypted Private Vault)
```

---

## 3. Core API Endpoints

- `GET /api/health`: Health status, uptime, environment, and Gemini configuration.
- `GET /api/integrations/status`: Status matrix for all 8 Google Cloud services.
- `POST /api/auth/verify`: Enterprise session token verification and RBAC permissions.
- `POST /api/knowledge/query`: Grounded RAG search with prompt injection defense.
- `GET /api/documents` & `POST /api/documents/upload`: Document AI extraction & cataloging.
- `DELETE /api/documents/:id`: Document removal from Firestore and Cloud Storage index.
- `POST /api/meetings/analyze`: Transcript intelligence (decisions, open questions, proposed actions).
- `POST /api/meetings/actions/confirm`: Commits human-approved meeting action items to task registry.
- `POST /api/analytics/query`: Read-only SQL validator & analytics execution engine.
- `POST /api/workflows/run`: Initiates Google ADK multi-step agent pipeline.
- `POST /api/workflows/:id/approve`: Human-in-the-loop authorization gate execution.
- `GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/:id`, `DELETE /api/tasks/:id`: Task registry CRUD.
- `POST /api/evaluations/run`: Automated empirical verification suite.

---

## 4. Local Development & Deployment

### Local Development:
```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (optional; defaults to full local demo mode)
cp .env.example .env

# 3. Start full-stack server
npm run dev
```

### Production Build & Containerization:
```bash
# Build Vite frontend
npm run build

# Run production container
docker build -t mindmesh-ai .
docker run -p 3000:3000 mindmesh-ai
```

---

## 5. Security & Governance Standards

- **Zero-Trust Network Perimeter**: Bound by Google Cloud VPC Service Controls.
- **Customer-Managed Encryption Keys (CMEK)**: All data at rest across Firestore, BigQuery, and Cloud Storage is protected by Cloud KMS.
- **AST-Enforced SQL**: Destructive SQL commands are rejected at the syntax tree parser before touching databases.
- **Prompt Injection Defense**: Structural XML boundary fencing and regex heuristics neutralize instruction overrides.
- **Cryptographic Approval Gates**: Consequential actions are held in an `Awaiting Approval` state until verified by an authorized workspace administrator.
