# SetConnection

### *The Ultimate Bridge Between Underground Techno Culture and High-Performance Software Engineering*

## The Vision: What is SetConnection?

**SetConnection** is an **industrial-grade distributed SaaS platform**, specifically engineered to solve one of the biggest pain points in the independent electronic music scene (Industrial Techno DJs, producers like *Dex Music / DJ Zy*, record labels, and music collectors): **the "black box" of long-format DJ sets (1 to 2 hours)**.

When a DJ publishes a mix on traditional platforms, listeners have no way of knowing which track is playing during a specific transition, nor do they have a direct bridge to stream or purchase that track. **SetConnection** automates the entire lifecycle of a DJ set:

1. **Fault-Tolerant Massive Ingestion:** Uploading heavy `.mp3` and `.wav` files directly to S3-compatible object storage (**MinIO / AWS S3**).

2. **Smart Tracklist (Asynchronous AI & Fingerprinting):** Background processing powered by distributed queues (**Redis + BullMQ**) that scans audio without blocking the Node.js main thread, detecting track transitions and millimeter-accurate timestamps.

3. **Smart Waveform & Interactive Nodes:** An editorial minimalist interface (*Apple / Clean Bento Grid*) where the audio waveform renders interactive nodes at every transition detected by AI, synchronized in real time with the global player and the tracklist table.

4. **DJ Studio (Artist Command Center):** An exclusive administrative dashboard for creators featuring real-time metrics, processing state management, and catalog control.

5. **Hybrid Export Ecosystem:** OAuth 2.0 integration, **Deep Links** (`external_urls`) to **Spotify, Beatport, Bandcamp, and SoundCloud**, and standard DJ playlist generation (`.m3u` compatible with Traktor/Rekordbox).

---

## System Architecture & Data Flow

Built under **Senior Full-Stack** standards, applying **Clean Architecture**, **SOLID** principles, and strict decoupling via design patterns.

```
[ Frontend Client (Angular 21 + Signals + Web Audio API) ]
       │
       │  (REST API / JWT / WebSockets Socket.io 4.8)
       ▼
[ API Gateway & Core (NestJS 11 - Clean Architecture) ]
       │
       ├──► [ Auth & Guards ]    ──► [ Passport JWT + Bcrypt ] (Role Control: DJ / Listener)
       ├──► [ Strategy Pattern ] ──► [ AWS SDK S3 -> MinIO ]   (Binary Audio Set Storage)
       ├──► [ BullMQ & Redis ]   ──► [ Background Workers ]    (AI Analysis + Nodemailer Alerts)
       └──► [ TypeORM 0.3 ]      ──► [ PostgreSQL 16 ]         (Cascading Relational Persistence)
```

---

## Monorepo Structure (`setConnection_fullStack`)

```
setConnection_fullStack/
├── backend/                  # REST API, WebSockets, Workers & Business Logic (NestJS 11)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/         # JWT issuance/validation, Passport strategies & Hashing (Bcrypt)
│   │   │   ├── sets/         # Controllers, services, TypeORM entities & BullMQ queue
│   │   │   ├── storage/      # Strategy Pattern (IStorageProvider -> S3StorageProvider)
│   │   │   └── ...           # Socket.io Gateways, Aggregator Service & Notifications
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── setconnection-frontend/   # Reactive SPA with Editorial Bento Aesthetics (Angular 21)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         # Singleton AudioPlayerService, AuthService (Signals), Guards
│   │   │   ├── features/     # DJ Studio (Bento Grid), Upload Zone, Public Explore, Login
│   │   │   └── shared/       # Smart WaveformComponent (Canvas + Nodes), TrackTable
│   └── package.json
├── docker-compose.yml        # Local Orchestration: PostgreSQL, Redis & MinIO (S3)
└── README.md
```

---

## 🛠️ Detailed Tech Stack

### **Backend (`/backend`)**

| Technology | Version | Architectural Purpose |
| ----- | ----- | ----- |
| **NestJS Core & Common** | `^11.0.1` | Modular backend framework with strict Dependency Injection. |
| **TypeORM + PG** | `^0.3.28` / `^8.20` | Relational ORM for PostgreSQL (`sets`, `track_markers`, `track_sources`, `users`). |
| **BullMQ & Bull** | `^5.78.0` | Distributed queue management over Redis for asynchronous set analysis. |
| **Socket.io / WebSockets** | `^4.8.3` | Real-time events (`analysis:progress`, `track:found`, `analysis:completed`). |
| **AWS SDK S3** | `^3.1031.0` | Official S3 client connected to **MinIO** under the *Strategy Pattern*. |
| **Passport + JWT + Bcrypt** | `^11.0.2` / `^6.0` | Stateless authentication and endpoint protection for artists. |
| **Class-Validator / Transformer** | `^0.15.1` | Defensive DTO validation at the API boundary. |
| **Nodemailer** | `^9.0.3` | Email notifications supporting the *"Leave & Come Back"* UX flow. |
| **Jest & Supertest** | `^30.0.0` / `^7.0` | Unit testing and E2E integration testing suite. |

### **Frontend (`/setconnection-frontend`)**

| Technology | Version | Architectural Purpose |
| ----- | ----- | ----- |
| **Angular Core & Router** | `^21.0.0` | Architecture built on **Standalone Components**, **Signals**, and **Functional Guards**. |
| **Tailwind CSS** | `^3.4.19` | High-contrast minimalist editorial design system (*Apple / Bento Grid*). |
| **Socket.io Client** | `^4.8.3` | Live reactive synchronization during AI audio scanning. |
| **Web Audio API & Canvas** | `Native` | Custom *Waveform* rendering, interactive transition nodes, and instant audio *seeking*. |
| **Vitest & JSDOM** | `^4.0.8` | Next-generation ultra-fast unit testing engine for the frontend. |

---

## Relational Data Model (PostgreSQL)

The database schema is designed to support both the hybrid workflow (DJ + AI) and unreleased tracks (*dubplates*):

* **`users`**: UUID identity, encrypted credentials, and role-based access control (`DJ`, `LISTENER`, `ADMIN`).
* **`sets`**: Core entity with UUID, mix metadata, MinIO object reference (`audio_url`), precomputed `waveform_json`, and lifecycle state (`PENDING`, `PROCESSING`, `READY`, `ERROR`).
* **`track_markers`**: `1:N` relationship with `sets`. Stores the exact entry timestamp in seconds (`start_time`), artist, title, matching status, and AI `confidence_score`.
* **`track_sources`**: `1:N` relationship with `track_markers`. Maps multiple external providers per track (Spotify, Beatport, Bandcamp, SoundCloud) for direct streaming or purchase.

---

## Local Setup & Deployment Guide

### 1. Prerequisites

* **Node.js** (v20+ recommended) and **npm** (`v11+`)
* **Docker Desktop** running in the background

### 2. Spin Up the Infrastructure (Docker Compose)

From the root of the repository (`setConnection_fullStack`), start the database, queue, and S3 storage containers:

```bash
docker-compose up -d
```

* **PostgreSQL:** `localhost:5432`
* **Redis:** `localhost:6379`
* **MinIO Console:** `http://localhost:9001` (Ensure the `dex-sets` bucket is created).

### 3. Configure and Start the Backend

```bash
cd backend
npm install
```

Verify your `.env` file in `backend/.env` with your PostgreSQL, Redis, MinIO, JWT, and Spotify OAuth credentials, then start the development server:

```bash
npm run start:dev
```

*The HTTP server and WebSocket Gateway will listen on `http://localhost:3000`.*

### 4. Configure and Start the Frontend

In a new terminal window, navigate to the Angular project:

```bash
cd setconnection-frontend
npm install
npm run start
```

*Open your browser at `http://localhost:4200`.*

---

## Engineering Roadmap (Completed & Active Sprints)

* **Sprint 1 — Foundations & Persistence:** Docker infrastructure (`postgres`, `redis`, `minio`), S3 *Strategy Pattern* implementation, DTO validation, `SlugService`, and PostgreSQL persistence with TypeORM.
* **Sprint 2 — The Asynchronous Brain:** Work queue integration with **BullMQ / Redis**, *Background Workers* for heavy audio set analysis, and real-time event emission via **WebSockets (`Socket.io`)**.
* **Sprint 3 — External Ecosystem, OAuth & Production Workaround:** Metadata aggregator service, Spotify OAuth 2.0 flow, and an engineering workaround for Spotify Web API *Development Mode* restrictions (`403 Forbidden` on `POST /playlists`), implementing industry-standard **`.m3u` playlist exports** (Traktor/Rekordbox ready) and **Deep Links** (`external_urls`).
* **Sprint 4 & 5 — Frontend Core & The Engine Room:** Angular architecture with Standalone Components and Signals, multipart upload with live progress bar, and a reactive track table connected to WebSockets.
* **Sprint 6 — Lightweight Authentication & Traffic Control (Roles):**
  * Reactive `AuthService` using Signals on the frontend and JWT/Passport module in NestJS.
  * *Functional Guards* (`canActivate`) protecting `/studio` and `/upload` for DJs while keeping the listener experience frictionless.
  * Minimalist Login view crafted under the Apple/Bento editorial aesthetic.
* **Sprint 7 — DJ Studio (Artist Command Center):**
  * **Bento Stats Grid (`DjDashboardComponent`):** High-contrast cards displaying real-time metrics (total plays, AI-discovered tracks, MinIO storage usage).
  * **Set Management Table:** Administrative view with semantic status badges (`AI PROCESSING ⚡`, `PUBLISHED 🟢`, `ERROR 🔴`) and seamless post-upload redirection.
* 🔥 **Sprint 8 — Public Catalog & Smart Waveform (The Crown Jewel):**
  * **Public Explore Grid:** Open catalog wired to the global `AudioPlayer` (Singleton).
  * **Waveform UI Overhaul & Visual Nodes:** High-contrast HTML5 Canvas waveform rendering interactive markers at every AI-detected transition.
  * **Bidirectional Sync (Nodes ↔ Table):** Hovering or clicking on canvas nodes highlights the corresponding track card in the table below and triggers an instant audio `seek()`.