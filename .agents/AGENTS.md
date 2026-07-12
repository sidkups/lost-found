# Agent Instructions & Project Rules

This file contains custom rules and behavioral guidelines for the AI agent to follow during the development of this workspace.

## Workflow Rules
- **Context Management:** If any requested feature, idea, or information is not relevant to the current milestone or scope, add it to the `todo.md` file in the root directory rather than implementing it immediately. Use markdown checkboxes `[ ]`.
- **Coding Standards:** Follow best practices and standard conventions for the chosen tech stack. Code should be clean, modular, and well-documented. Do not skip testing.
- **Documentation First:** Document any architectural including tech stack decisions or complex logic in the appropriate `.md` files before implementation to maintain alignment with the project plan.  At the end of every session, update AGENTS.md, agentic-harness.md, for any learnings or followups.  Also update requirements.md, project-management.md, architecture.md, tech-stack.md and weekly-plan.md if anything changes.
- **Raise MR:** When the task implementation is complete, ask the user whether to raise an MR.  

## Firebase
Always look for and use the appropriate **Firebase agent skills** to perform tasks related to Firebase.

The primary reason is To report lost and found items, and connect them in a trustworthy way

I want to use Firebase as my backend, using Firebase Authentication and Firestore database.

Set up and use Email/password Authentication.

Use my existing Firebase project: 509636494210

Make sure to register a web app in that project and set up my app's codebase to use Firebase.

## Session Follow-ups & Learnings
- **[2026-07-12] Session Closed**: Successfully completed Phase 4.3 (Part 1). Implemented public database search and UI filtering for lost and found items using a hybrid Firestore + client-side approach. The next session will focus on Phase 4.3 (Part 2): Implement an AI-powered matching algorithm.
- **[2026-07-12] Session Closed (Debugging)**: Resolved critical issues with reporting items (Phase 4.2). Diagnosed that Firestore Database was uninitialized, which caused the SDK to hang silently. Bypassed Firebase Storage CORS issues and potential billing constraints by implementing client-side Canvas-based image compression, saving Base64 image strings directly to Firestore within the 1MB document limit.

## Raise MR
When raising an MR, ensure to use the `gh` agent to create an MR with a proper title and description.  MR description should include:
  - What was done
  - How it was done
  - What was verified