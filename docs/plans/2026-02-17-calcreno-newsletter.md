# CalcReno Newsletter Signup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** When a visitor clicks the CalcReno card on the landing page, a Polish-language modal opens, collects first name + email, saves the subscriber to Supabase, and triggers a Brevo welcome email via a Supabase Edge Function.

**Architecture:** The React frontend opens a shadcn/ui Dialog when the CalcReno card is clicked. On form submit the frontend calls a new Edge Function `newsletter-signup` (with `verify_jwt: false` so unauthenticated visitors can reach it). The Edge Function saves the row to a new `newsletter_subscribers` Supabase table using the service role key, then calls the Brevo REST API to add the contact and send a transactional welcome email.

**Tech Stack:** React 18 + TypeScript, shadcn/ui Dialog, React Hook Form + Zod, Supabase MCP (project `kralcmyhjvoiywcpntkg`, region `eu-central-1`), Supabase Edge Functions (Deno), Brevo Transactional Email API.

---

## Pre-requisites (manual steps before coding)

Before running any task below, complete these once:

1. **Create a free Brevo account** at https://app.brevo.com — no credit card required.
2. In Brevo go to **Settings → API Keys → Create a new API key**. Copy it.
3. In Brevo go to **Email → Templates → Create a transactional template**. Design a welcome email in Polish. Note the numeric **Template ID** (e.g. `1`).
4. *(Optional)* In Brevo go to **Contacts → Lists → Create list** called "CalcReno Waitlist". Note the numeric **List ID** (e.g. `3`).
5. Add the Brevo API key as a Supabase secret — run in your terminal:
   ```bash
   npx supabase secrets set BREVO_API_KEY=your_key_here --project-ref kralcmyhjvoiywcpntkg
   ```
   Also note your Brevo Template ID and List ID — you will hard-code them in the Edge Function in Task 2.

---

## Task 1: Create the `newsletter_subscribers` Supabase table

**Files:**
- No local files — applied directly via Supabase MCP

**Step 1: Apply the migration via Supabase MCP**

Use the `mcp__supabase__apply_migration` tool with:
- `project_id`: `kralcmyhjvoiywcpntkg`
- `name`: `create_newsletter_subscribers`
- `query`:

```sql
create table public.newsletter_subscribers (
  id             uuid        primary key default gen_random_uuid(),
  email          text        not null unique,
  first_name     text        not null,
  source         text        not null default 'calcreno_landing',
  subscribed_at  timestamptz not null default now(),
  brevo_synced   boolean     not null default false
);

alter table public.newsletter_subscribers enable row level security;

-- Anyone (including unauthenticated) can insert a new subscriber
create policy "Anyone can subscribe"
  on public.newsletter_subscribers
  for insert
  with check (true);

-- No public select — service role is used server-side for reads
```

**Step 2: Verify table exists**

Use `mcp__supabase__execute_sql` with query:
```sql
select column_name, data_type
from information_schema.columns
where table_name = 'newsletter_subscribers'
order by ordinal_position;
```
Expected: 6 rows — `id`, `email`, `first_name`, `source`, `subscribed_at`, `brevo_synced`.

**Step 3: Commit**
```bash
git add -A
git commit -m "feat: add newsletter_subscribers Supabase migration"
```

---

## Task 2: Create the `newsletter-signup` Edge Function

**Files:**
- Create: `supabase/functions/newsletter-signup/index.ts`

The Edge Function must:
1. Accept `POST { firstName: string, email: string }`
2. Validate inputs
3. Insert into `newsletter_subscribers` with `SUPABASE_SERVICE_ROLE_KEY`
4. Call Brevo API to add contact to list (optional but recommended)
5. Call Brevo API to send transactional welcome email
6. Return `{ success: true }` or `{ success: false, error: string }`

> **Important:** This function must be deployed with `verify_jwt: false` because unauthenticated visitors use it.

**Step 1: Write the Edge Function**

Create `supabase/functions/newsletter-signup/index.ts`:

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── Replace with your actual Brevo values ──────────────────────────────────
const BREVO_TEMPLATE_ID = 1;   // Your Brevo transactional template numeric ID
const BREVO_LIST_ID = 3;       // Your Brevo contact list numeric ID (or remove if unused)
// ──────────────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { firstName, email } = await req.json();

    // ── Input validation ────────────────────────────────────────────────────
    if (!firstName || typeof firstName !== "string" || firstName.trim().length < 1) {
      return new Response(JSON.stringify({ success: false, error: "first_name required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(JSON.stringify({ success: false, error: "valid email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = firstName.trim();

    // ── Save to Supabase ────────────────────────────────────────────────────
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: cleanEmail, first_name: cleanName });

    // Treat duplicate email as success (idempotent)
    if (dbError && !dbError.message.includes("duplicate key")) {
      throw new Error(`DB error: ${dbError.message}`);
    }

    const alreadySubscribed = !!dbError; // duplicate key = already in DB

    // ── Brevo: Add contact to list ──────────────────────────────────────────
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;

    if (!alreadySubscribed) {
      const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          attributes: { FIRSTNAME: cleanName },
          listIds: [BREVO_LIST_ID],
          updateEnabled: true,
        }),
      });

      if (!contactRes.ok && contactRes.status !== 204) {
        const err = await contactRes.text();
        console.error("Brevo contact error:", err);
        // Non-fatal — continue to send email
      }

      // ── Brevo: Send transactional welcome email ──────────────────────────
      const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: [{ email: cleanEmail, name: cleanName }],
          templateId: BREVO_TEMPLATE_ID,
          params: { FIRSTNAME: cleanName },
        }),
      });

      if (!emailRes.ok) {
        const err = await emailRes.text();
        console.error("Brevo email error:", err);
        // Non-fatal — subscriber is saved, email failure is logged
      } else {
        // Mark as synced in DB
        await supabase
          .from("newsletter_subscribers")
          .update({ brevo_synced: true })
          .eq("email", cleanEmail);
      }
    }

    return new Response(
      JSON.stringify({ success: true, alreadySubscribed }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    const message = err?.message ?? "Internal server error";
    console.error("newsletter-signup error:", message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

**Step 2: Deploy the Edge Function via Supabase MCP**

Use `mcp__supabase__deploy_edge_function` tool with:
- `project_id`: `kralcmyhjvoiywcpntkg`
- `name`: `newsletter-signup`
- `verify_jwt`: `false`  ← critical, unauthenticated users must reach this
- `entrypoint_path`: `index.ts`
- `files`: the `index.ts` content above

**Step 3: Smoke-test the Edge Function**

Run this curl to verify it works end-to-end before touching React:
```bash
curl -X POST \
  https://kralcmyhjvoiywcpntkg.supabase.co/functions/v1/newsletter-signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","email":"test@example.com"}'
```
Expected response: `{"success":true,"alreadySubscribed":false}`

Then verify the row appeared in Supabase:
```sql
select * from newsletter_subscribers order by subscribed_at desc limit 5;
```

**Step 4: Commit**
```bash
git add supabase/functions/newsletter-signup/index.ts
git commit -m "feat: add newsletter-signup edge function with Brevo integration"
```

---

## Task 3: Create the `NewsletterModal` React component

**Files:**
- Create: `src/components/ui/newsletter-modal.tsx`

This component uses:
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` from `@/components/ui/dialog`
- `Button` from `@/components/ui/button`
- `supabase` client from `@/integrations/supabase/client` (to call `supabase.functions.invoke`)
- React `useState` for form state (no React Hook Form needed — only 2 fields)

**Step 1: Write the component**

Create `src/components/ui/newsletter-modal.tsx`:

```typescript
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'duplicate';

export function NewsletterModal({ open, onOpenChange }: NewsletterModalProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;

    setFormState('loading');
    setErrorMsg('');

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-signup', {
        body: { firstName: firstName.trim(), email: email.trim() },
      });

      if (error) throw new Error(error.message);

      if (data?.alreadySubscribed) {
        setFormState('duplicate');
      } else {
        setFormState('success');
      }
    } catch (err) {
      setErrorMsg('Coś poszło nie tak. Spróbuj ponownie.');
      setFormState('error');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after dialog closes (300ms for animation)
    setTimeout(() => {
      setFirstName('');
      setEmail('');
      setFormState('idle');
      setErrorMsg('');
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0f1729] border border-cyan-500/30 text-white max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-900 via-cyan-800 to-cyan-700 rounded-xl flex items-center justify-center mb-2 shadow-xl border border-cyan-500/40">
            <img
              src="/calcreno-logo-full-transparent.png"
              alt="CalcReno"
              className="w-12 h-12 object-contain"
            />
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            Bądź pierwszy!
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            CalcReno — mobilny kalkulator materiałów budowlanych — jest w przygotowaniu.
            Zapisz się, aby otrzymać powiadomienie o starcie beta i pełnym uruchomieniu.
          </DialogDescription>
        </DialogHeader>

        {formState === 'success' && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-center">
            <p className="text-green-400 font-semibold text-lg">Dziękujemy, {firstName}!</p>
            <p className="text-gray-300 text-sm mt-1">
              Sprawdź swoją skrzynkę — wysłaliśmy Ci e-mail powitalny.
            </p>
            <Button
              className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white"
              onClick={handleClose}
            >
              Zamknij
            </Button>
          </div>
        )}

        {formState === 'duplicate' && (
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4 text-center">
            <p className="text-yellow-400 font-semibold">Już jesteś na liście!</p>
            <p className="text-gray-300 text-sm mt-1">
              Ten adres e-mail jest już zarejestrowany. Damy Ci znać przy starcie.
            </p>
            <Button
              className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white"
              onClick={handleClose}
            >
              Zamknij
            </Button>
          </div>
        )}

        {(formState === 'idle' || formState === 'loading' || formState === 'error') && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Imię
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="np. Marcin"
                required
                disabled={formState === 'loading'}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Adres e-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="np. marcin@example.com"
                required
                disabled={formState === 'loading'}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition disabled:opacity-50"
              />
            </div>

            {formState === 'error' && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}

            <Button
              type="submit"
              disabled={formState === 'loading' || !firstName.trim() || !email.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 disabled:opacity-50"
            >
              {formState === 'loading' ? 'Zapisywanie...' : 'Zapisz mnie na listę'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Bez spamu. Tylko ważne informacje o CalcReno. Możesz zrezygnować w każdej chwili.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

**Step 2: Verify it builds**
```bash
npm run build 2>&1 | tail -20
```
Expected: no TypeScript errors related to `newsletter-modal.tsx`.

**Step 3: Commit**
```bash
git add src/components/ui/newsletter-modal.tsx
git commit -m "feat: add NewsletterModal component for CalcReno signup"
```

---

## Task 4: Wire the modal to the CalcReno card

**Files:**
- Modify: `src/components/sections/EnhancedAppsSection.tsx`

The CalcReno card currently falls into the `if (!app.link)` branch (line ~220) and renders as a plain `<div>`. We need to:
1. Import `NewsletterModal` and `useState`
2. Add `isNewsletterOpen` state
3. Wrap the CalcReno card `<div>` with an `onClick` that opens the modal
4. Render the `<NewsletterModal>` below the grid

**Step 1: Add the import at the top of the file**

In `src/components/sections/EnhancedAppsSection.tsx`, after the existing imports add:
```typescript
import { useState } from 'react';
import { NewsletterModal } from '@/components/ui/newsletter-modal';
```

**Step 2: Add state inside the component**

Inside `EnhancedAppsSection` component body, before the `apps` array definition, add:
```typescript
const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
```

**Step 3: Replace the `if (!app.link)` branch**

Find this block (around line 220):
```typescript
if (!app.link) {
  return (
    <div key={app.id}>
      {cardContent}
    </div>
  );
}
```

Replace it with:
```typescript
if (!app.link) {
  // CalcReno: open newsletter modal on click
  if (app.id === 'calcreno') {
    return (
      <div
        key={app.id}
        onClick={() => setIsNewsletterOpen(true)}
        className="cursor-pointer"
        role="button"
        aria-label="Zapisz się na newsletter CalcReno"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsNewsletterOpen(true)}
      >
        {cardContent}
      </div>
    );
  }
  return (
    <div key={app.id}>
      {cardContent}
    </div>
  );
}
```

**Step 4: Render the modal after the closing `</div>` of the grid**

Find the closing `</div>` of `className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"` and add the modal directly after it, before the outer `</div>`:

```typescript
        </div>

        <NewsletterModal
          open={isNewsletterOpen}
          onOpenChange={setIsNewsletterOpen}
        />
      </div>
    </section>
```

**Step 5: Verify it builds**
```bash
npm run build 2>&1 | tail -20
```
Expected: clean build with no TypeScript errors.

**Step 6: Manual smoke test**

Start the dev server:
```bash
npm run dev
```
1. Open http://localhost:8080
2. Scroll to "Nasze Aplikacje" section
3. Click the **CalcReno** card — modal should open
4. Click the **RenoTimeline** card — nothing should happen (external link opens)
5. Fill in first name + email in the modal and submit
6. Verify success state appears with the correct name
7. Check Supabase table: `select * from newsletter_subscribers;`
8. Check your inbox for the Brevo welcome email

**Step 7: Commit**
```bash
git add src/components/sections/EnhancedAppsSection.tsx
git commit -m "feat: open newsletter modal when CalcReno card is clicked"
```

---

## Summary of all changes

| What | Where |
|---|---|
| New DB table | `public.newsletter_subscribers` (via Supabase MCP migration) |
| New Edge Function | `supabase/functions/newsletter-signup/index.ts` (deployed via MCP, `verify_jwt: false`) |
| New React component | `src/components/ui/newsletter-modal.tsx` |
| Modified component | `src/components/sections/EnhancedAppsSection.tsx` |
| Brevo secret | Set via `npx supabase secrets set BREVO_API_KEY=...` |
