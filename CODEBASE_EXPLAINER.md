# Codebase Explainer: Deep Dive

This document provides a comprehensive technical walkthrough of the **Career Suite AI** architecture, logic flows, and implementation details.

---

## ✦ Directory Mapping

| Folder | Responsibility |
| :--- | :--- |
| **`app/`** | The core Next.js App Router directory. Contains all pages, layouts, and API routes. |
| **`app/api/`** | Backend logic handling AI analysis, file uploads, and outreach generation. |
| **`app/actions/`** | Server Actions for secure database mutations (Profile updates, Password changes). |
| **`app/components/`** | Reusable UI components built with Tailwind CSS 4 and Framer Motion. |
| **`lib/`** | Utility functions, database connection logic, and validation schemas. |
| **`models/`** | Mongoose (Data) models representing the database structure. |
*  
---

## ✦ File-by-File Analysis

### 1. AI Analysis Logic
**File:** [`app/api/analyze/route.ts`](file:///d:/TCb%20project%20sidd,gargi/resume-analyser/app/api/analyze/route.ts)
- **Purpose**: Conducts the core resume vs. job description (JD) comparison.
- **Core Logic**: Uses a **Dual-Mode Prompt** that forces the LLM to act as both an "ATS Parser" and a "Senior Recruiter". It returns a strict JSON payload with keyword matching and cultural "vibe" assessment.
- **Libraries**: `@google/generative-ai` (Gemini), `mongoose`, `next/server`.

### 2. LinkedIn Ghostwriter
**File:** [`app/api/outreach/route.ts`](file:///d:/TCb%20project%20sidd,gargi/resume-analyser/app/api/outreach/route.ts)
- **Purpose**: Generates high-conversion LinkedIn connection requests.
- **Core Logic**: Takes the "Vibe" and "Top Strength" discovered in the analysis phase to craft 3 distinct messages (Startup, Corporate, Technical) under a strict 300-character limit.
- **Libraries**: `@google/generative-ai`.

### 3. Server Actions (Profile Management)
**File:** [`app/actions/profile.ts`](file:///d:/TCb%20project%20sidd,gargi/resume-analyser/app/actions/profile.ts)
- **Purpose**: Handles user settings, profile updates, and password changes.
- **Core Logic**: Implements secure mutations using Mongoose. Utilizes `revalidatePath` to clear Next.js caches after an update, ensuring the UI reflects data changes immediately without full page reloads.
- **Libraries**: `bcryptjs` (password hashing), `zod` (validation).

### 4. Authentication Infrastructure
**Files:** [`lib/auth.ts`](file:///d:/TCb%20project%20sidd,gargi/resume-analyser/lib/auth.ts) & [`middleware.ts`](file:///d:/TCb%20project%20sidd,gargi/resume-analyser/middleware.ts)
- **Purpose**: Secures the application and handles session persistence.
- **Core Logic**: Uses `jose` for lightweight JWT signing and verification. The middleware intercepts every request to check for a valid `session` cookie, handling redirects to `/login` or `/onboarding` as necessary.
- **Libraries**: `jose`, `next/headers`.

---

## ✦ Key Logic Breakdowns

### Dual-Mode AI Prompting
The system avoids generic "how is my resume" queries. Instead, it uses a structured prompt:
```typescript
const prompt = `### ROLE
You are a dual-mode AI System: 1. ATS Parser. 2. Senior Recruiter.
### TASK
Analyze JD and Resume. Return TWO distinct scores... return ONLY strict JSON.`
```
This multi-agent persona strategy ensures the AI provides objective technical scores (ATS) alongside subjective professional advice (Recruiter).

### Prisma vs. MongoDB Discrepancy
The current architecture uses **MongoDB/Mongoose**. While the initial requirements mentioned Prisma/PostgreSQL, the codebase is currently optimized for a document-based store, allowing for flexible storage of unstructured AI analysis reports.

---

## ✦ Future Improvements

> [!TIP]
> **Database Migration**: If high-scale relational reporting is needed, migrating to **Prisma/PostgreSQL** would provide better data integrity and easier aggregations for user analytics.

> [!WARNING]
> **Error Boundaries**: While API routes have try/catch blocks, adding **Next.js Error Boundaries** to the main dashboards (Analyzer, Dashboard) would improve the "Vibe" for users if the LLM service experiences latency or downtime.

> [!NOTE]
> **PDF Parsing**: Currently using `pdf-parse`. For resumes with complex multi-column layouts, integrating a more advanced parser or an OCR-based approach would further improve ATS score accuracy.
