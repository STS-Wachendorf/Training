# Musical Verein Management Tool Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Setup the core infrastructure, Supabase authentication, and the MVPBlocks UI framework.

**Architecture:** Vite React SPA with Tailwind CSS (MVPBlocks), Supabase Auth context provider, and protected routes.

**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS, Supabase JS Client, React Router.

---

### Task 1: Setup Supabase Client & Environment Variables

**Files:**
- Create: `.env.local`
- Create: `src/lib/supabase.ts`

**Step 1: Write the environment file (No test needed for .env)**

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Step 2: Install Supabase Client**

Run: `npm install @supabase/supabase-js`
Expected: PASS

**Step 3: Write minimal implementation**

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Step 4: Commit**

```bash
git add src/lib/supabase.ts package.json package-lock.json
git commit -m "chore: setup supabase client"
```

---

### Task 2: Configure React Router & Layout

**Files:**
- Modify: `src/main.tsx`
- Create: `src/layouts/RootLayout.tsx`

**Step 1: Install React Router**

Run: `npm install react-router`
Expected: PASS

**Step 2: Write minimal implementation (RootLayout)**

```tsx
// src/layouts/RootLayout.tsx
import { Outlet } from 'react-router';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
```

**Step 3: Modify main.tsx**

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import { RootLayout } from './layouts/RootLayout'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
```

**Step 4: Commit**

```bash
git add src/main.tsx src/layouts/RootLayout.tsx package.json package-lock.json
git commit -m "feat: configure react router and root layout"
```

---

### Task 3: Initialize MVPBlocks & Tailwind CSS

**Files:**
- Create: `tailwind.config.js` (or use Vite plugin depending on Tailwind version)
- Modify: `src/index.css`

**Step 1: Install MVPBlocks and Tailwind**

Run: `npm install -g mvpblocks && npx mvpblocks init --vite`
Expected: PASS (Follow prompts for React/Vite/Tailwind setup)

**Step 2: Verify Setup**

Run: `npm run dev`
Expected: Server starts successfully without CSS errors.

**Step 3: Commit**

```bash
git add .
git commit -m "chore: initialize mvpblocks and tailwind"
```
