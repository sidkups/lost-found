# Lost and Found Application: Agentic Coding Project Plan

This document serves as the central plan for the final year graduate project. The goal of this project is to build a Lost and Found application while explicitly demonstrating **Agentic Coding** principles and workflows. 

*Note: Detailed files for each of these steps will be created as separate documents when we execute them.*

## Phase 1: Project Conception and Requirements
- [x] **1.1 Define Project Scope & Objectives**
  - Identify the primary users (e.g., students, staff, admins).
  - Define core features (report lost item, report found item, search/match items, claim process).
  - Explicitly define the "Agentic" goals (e.g., how AI agents will assist in development, testing, or operation).
- [x] **1.2 Gather and Document Requirements**
  - Create a detailed `requirements.md` document.
  - Define functional requirements (features).
  - Define non-functional requirements (performance, security, scalability).

## Phase 2: Technical Design and Architecture
- [x] **2.1 Choose Technology Stack**
  - Evaluate and select frontend framework (e.g., React, Flutter, Next.js).
  - Evaluate and select backend technology (e.g., Node.js, Python, Firebase, Supabase).
  - Choose a database (e.g., PostgreSQL, MongoDB, Firestore).
  - Document the selection rationale in a `tech-stack.md` document.
- [x] **2.2 Finalise System Architecture**
  - Design the high-level system architecture (Client-Server, Microservices, or Serverless).
  - Design the database schema and data models.
  - Create API design guidelines.
  - Document the architecture in an `architecture.md` document (include Mermaid diagrams).
- [x] **2.3 Define the Agentic Harness**
  - Define the role of the AI agent in the development lifecycle (e.g., code generation, code review, test generation).
  - Set up prompt templates and context management for the agent.
  - Define custom skills or workflows the agent will use for this specific project.
  - Document the agentic workflow in `agentic-harness.md`.

## Phase 3: Software Development Life Cycle (SDLC) Setup
- [x] **3.1 Define Project Management & Issue Tracking**
  - Set up a Kanban board or issue tracker.
  - Define the process for converting requirements into actionable tasks (so the agent has a clear backlog).
- [ ] **3.2 Set up Version Control & Repository**
  - Initialize Git repository.
  - Define branching strategy (e.g., Trunk-Based Development, which is often preferred for agentic workflows).
- [ ] **3.3 Establish Test-Driven Development (TDD) Process**
  - Configure testing frameworks (Unit, Integration, E2E).
  - Define testing standards and coverage goals.
  - Document how the AI agent will assist in writing and running tests.
- [ ] **3.4 Configure CI/CD Pipelines**
  - Set up Continuous Integration (e.g., GitHub Actions, GitLab CI) for automated linting and testing.
  - Set up Continuous Deployment for staging and production environments.
- [ ] **3.5 Integrate Autonomous Agentic Coding Workflows**
  - Configure the AI agent for autonomous task execution (e.g., assigning tickets/issues directly to the agent).
  - Define review and approval gates for agent-generated Pull Requests (PRs).
  - Set up continuous feedback loops where the agent acts on CI/CD failures autonomously.

## Phase 4: Implementation (Iterative Development)
- [ ] **4.1 Sprint 1: Foundation & Authentication**
  - Scaffold the project structures (frontend and backend).
  - Implement user registration and login.
- [ ] **4.2 Sprint 2: Core Entity Management**
  - Implement APIs and UI for submitting "Lost" reports.
  - Implement APIs and UI for submitting "Found" reports.
- [ ] **4.3 Sprint 3: Search and Matching**
  - Implement search functionality with filtering.
  - (Optional) Implement an AI/Agentic feature for automated matching of lost and found items.
- [ ] **4.4 Sprint 4: Claiming Process & Notifications**
  - Implement the workflow for a user to claim a found item.
  - Add email or in-app notifications.

## Phase 5: Testing, Polish, and Deployment
- [ ] **5.1 Comprehensive Testing & QA**
  - Run full test suites.
  - Perform manual User Acceptance Testing (UAT).
  - Security and vulnerability scanning.
- [ ] **5.2 Final Polish & Bug Fixing**
  - Address any UI/UX issues.
  - Optimize performance bottlenecks.
- [ ] **5.3 Production Deployment**
  - Deploy the application to the production environment.
  - Monitor logs and system health.

## Phase 6: Project Submission and Defense
- [ ] **6.1 Documentation Finalization**
  - Ensure all codebase is adequately commented.
  - Prepare the final project report, emphasizing the Agentic coding approach.
- [ ] **6.2 Presentation Preparation**
  - Create presentation slides.
  - Prepare a live demonstration of the application and the agentic workflow.
