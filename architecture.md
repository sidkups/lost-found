# System Architecture

## Overview
The "Lost and Found" application employs a **Serverless Architecture** utilizing Firebase as a Backend-as-a-Service (BaaS). The frontend is a Single Page Application (or a set of static pages) built with Vanilla HTML, CSS, and JavaScript. It communicates directly with Firebase services using the Firebase Web SDK, eliminating the need for a custom middleware server for core features.

## Architecture Diagram
```mermaid
graph TD
    Client[Client Browser \n HTML, CSS, JS]
    
    subgraph Firebase Services
        Auth[Firebase Authentication \n (User Login/Registration)]
        DB[(Cloud Firestore \n NoSQL Database)]
        Hosting[Firebase Hosting \n (Static Asset Delivery)]
    end
    
    Client -- "Static Files Request" --> Hosting
    Client -- "Authenticates User (SDK)" --> Auth
    Client -- "Reads/Writes Data (SDK)" --> DB
```

## Data Models (Firestore)

### 1. `users` Collection
Stores user profile information.
- `uid` (Document ID)
- `email` (String)
- `displayName` (String)
- `createdAt` (Timestamp)

### 2. `items` Collection
Stores reports for both lost and found items.
- `id` (Document ID)
- `type` (String: "lost" | "found")
- `title` (String)
- `description` (String)
- `category` (String)
- `date` (Timestamp)
- `location` (String)
- `imageUrl` (String - URL to image storage, optionally Firebase Storage)
- `status` (String: "open" | "resolved" | "claimed")
- `reportedBy` (Reference/String: User UID)
- `createdAt` (Timestamp)

### 3. `claims` Collection
Tracks items that users are attempting to claim.
- `id` (Document ID)
- `itemId` (Reference/String: Item ID)
- `claimantId` (Reference/String: User UID)
- `status` (String: "pending" | "approved" | "rejected")
- `createdAt` (Timestamp)

## API Design & Security
- **Data Access:** All data interactions happen via the Firebase Client SDK.
- **Security:** Firebase Security Rules will be implemented in Firestore to ensure users can only modify their own items and claims, while allowing read access for searching.
