# Project Management & Issue Tracking

## Overview
This document outlines the project management workflows for the "Lost and Found" application. It acts as our lightweight issue tracker and Kanban board, defining how requirements are converted into actionable tasks for the AI agent.

## Kanban Board Workflow
We use a simple text-based Kanban approach. Tasks move through the following stages:
- **[TODO]**: Ready to be picked up.
- **[IN PROGRESS]**: Currently being worked on by the agent or user.
- **[REVIEW]**: Code is written, waiting for manual QA or automated tests to pass.
- **[DONE]**: Task is completed and merged.

## Current Backlog

### Epic 1: Repository & SDLC Setup (Week 2, Session 2)
- [DONE] **Task 1.1:** Initialize Git repository and define branching strategy (Trunk-Based Development).
- [DONE] **Task 1.2:** Configure a basic CI/CD Pipeline (GitHub Actions) for linting HTML/JS/CSS.
- [DONE] **Task 1.3:** Configure TDD framework and CI integration.

### Epic 2: Foundation & Authentication (Week 3)
- [DONE] **Task 2.1:** Scaffold project folder structure (`index.html`, `css/`, `js/`, `firebase.json`).
- [DONE] **Task 2.2:** Initialize Firebase project and link to web app.
- [DONE] **Task 2.3:** Implement User Registration (Email/Password) UI and Firebase Logic.
- [DONE] **Task 2.4:** Implement User Login (Email/Password) UI and Firebase Logic.

### Epic 3: Core Entity Management (Week 4)
- [DONE] **Task 3.1:** Create UI and logic for "Report Lost Item" form.
- [DONE] **Task 3.2:** Create UI and logic for "Report Found Item" form.
- [DONE] **Task 3.3:** Configure Firestore Security Rules for items.

### Epic 4: Search and Matching (Week 5)
- [TODO] **Task 4.1:** Build search interface and integrate Firestore queries.
- [TODO] **Task 4.2:** Implement basic Agentic matching algorithm/suggestion logic for lost/found pairs.

### Epic 5: Claiming Process & Notifications (Week 6)
- [TODO] **Task 5.1:** Implement item claiming UI and Firestore updates.
- [TODO] **Task 5.2:** Implement basic notifications (e.g., in-app alert or email stub).
