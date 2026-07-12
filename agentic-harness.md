# Agentic Harness & Workflows

## Overview
This project will be developed using an **Agentic Coding** workflow, where an AI assistant acts as a pair-programmer, handling tasks ranging from codebase scaffolding to advanced bug fixing. This document defines how the AI agent is integrated into the Software Development Life Cycle (SDLC) for the "Lost and Found" application.

## 1. Role of the AI Agent
The AI agent will assist with the following activities:
- **Code Generation:** Generating boilerplate HTML, CSS, JavaScript, and Firebase configuration.
- **Architectural & Planning Assistance:** Suggesting design patterns and structuring the documentation.
- **Testing:** Writing and running automated tests and performing security audits (e.g., Firebase security rules).
- **Refactoring:** Cleaning up code and suggesting performance optimizations.
- **Debugging:** Interpreting error logs and implementing fixes autonomously.

## 2. Context Management & Prompt Strategies
To ensure the AI produces high-quality, relevant code:
- **Context Priming:** All relevant markdown files (`requirements.md`, `architecture.md`, `tech-stack.md`) are kept small, focused, and in the root directory so the AI can easily parse them.
- **Step-by-Step Instructions:** Tasks are broken down into granular tickets (in `project-management.md`) to avoid overwhelming the context window.
- **Rules & Constraints:** Any project-specific rules (like using Vanilla CSS over Tailwind) are documented in `.agents/AGENTS.md` (or similar custom rule configurations) to enforce strict compliance.

## 3. Agentic Development Loop
1. **Planning:** The user defines a goal in plain English or selects a ticket from the Kanban board.
2. **Analysis:** The agent reviews the existing codebase and relevant architectural documents.
3. **Execution:** The agent implements the required features, commits changes, and runs initial checks.
4. **Review & Iterate:** The user reviews the AI's PRs or commits, provides feedback, and the agent iterates until completion.
5. **Documentation Sync:** At the end of every session, the agent updates project documentation (`AGENTS.md`, `agentic-harness.md`, `requirements.md`, etc.) with any new learnings, architectural decisions, or follow-ups to maintain a single source of truth.

## 4. Custom Skills & Tools
For this project, the agent will utilize built-in skills for Firebase and Web Development, specifically:
- `firebase-firestore`, `firebase-auth-basics`, and `firebase-basics` to handle backend configuration securely.
- `modern-web-guidance` to ensure best practices in HTML/CSS and frontend interactions.
