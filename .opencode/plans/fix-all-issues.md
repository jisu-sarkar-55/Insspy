# Complete Fix Plan — All Issues

## Priority: Apply in order (Critical → High → Medium → Low)

---

## PHASE 1: CALCULATIONS (`src/lib/calculations.ts`)

### Fix 1.1 — `biggestLoss = 0` when no losing trades (C5/H8)
**Lines**: 81-84  
**Replace**:
```ts
const worstTrade = losingTrades.reduce((worst, t) =>
  (t.net_pnl ?? 0) < (worst.net_pnl ?? 0) ? t : worst,
  losingTrades[0]);
const biggestLoss = worstTrade?.net_pnl ?? 0;
const biggestLossDate = worstTrade?.entry_time?.split("T")[0] ?? null;
```
**With**:
```ts
let biggestLoss = 0;
let biggestLossDate: string | null = null;
if (losingTrades.length > 0) {
  const worstTrade = losingTrades.reduce((worst, t) =>
    (t.net_pnl ?? 0) < (worst.net_pnl ?? 0) ? t : worst,
    losingTrades[0]);
  biggestLoss = worstTrade?.net_pnl ?? 0;
  biggestLossDate = worstTrade?.entry_time?.split("T")[0] ?? null;
}
```

### Fix 1.2 — `profitFactor: Infinity` serializes to null (M1)
**Lines**: 91, 725, 867  
Replace `Infinity` with `99.9` in all 3 locations:
```ts
profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99.9 : 0,
```

### Fix 1.3 — `lastLossTime = 0` falsy check (C3)
**Lines**: 301, 306  
Change `let lastLossTime = 0` to `let lastLossTime: number | null = null;`  
Change `if (lastLossTime && ...)` to `if (lastLossTime !== null && ...)`

### Fix 1.4 — Hardcoded $10,000 in `calculateAnalyticsKPIs` (C2)
**Line**: 728  
Change `calculateDrawdownAnalysis(closed, 10000)` to use a configurable balance.  
Since no user balance is stored, the best approach: add a `startingBalance` parameter defaulting to `10000`:
```ts
export function calculateAnalyticsKPIs(trades: Trade[], startingBalance = 10000): AnalyticsKPIs {
```
And use `startingBalance` in the call.

### Fix 1.5 — `avgDailyPnl` formula assumes 5 trades/day (C1)
**Lines**: 1529-1532  
Replace:
```ts
const avgDailyPnl = monthlyPnl / Math.max(1, last30.length / 5);
const expectedMonthlyProfit = Math.round(avgDailyPnl * 22 * 100) / 100;
```
**With** (use actual trading days):
```ts
const tradingDays = new Set(last30.map((t) => t.entry_time.split("T")[0])).size;
const avgDailyPnl = monthlyPnl / Math.max(1, tradingDays);
const expectedMonthlyProfit = Math.round(avgDailyPnl * 22 * 100) / 100;
```

### Fix 1.6 — Consistency saturates at 100 for >200 trades (H2)
**Line**: 637  
Change `closed.length * 0.5` to `Math.min(closed.length, 100) * 0.3`:
```ts
const consistency = Math.round(Math.min(100, winRate * 0.8 + Math.min(closed.length, 100) * 0.3));
```

### Fix 1.7 — Breakeven trades don't break profit/loss runs (H7)
**Lines**: 455-486  
After line 479 (`}`), add:
```ts
  else {
    // breakeven: break both runs
    if (runAmount > bestProfitRun.amount) {
      bestProfitRun = { amount: runAmount, count: runCount };
    }
    if (runAmount < worstLossRun.amount) {
      worstLossRun = { amount: runAmount, count: runCount };
    }
    runAmount = 0;
    runCount = 0;
  }
```
Also update the `forEach` condition — the existing `if (pnl > 0)` / `else if (pnl < 0)` should get an `else` clause for breakevens.

### Fix 1.8 — Heatmap timezone mismatch (C4)
**Lines**: 515-517  
Use UTC for calendar grid construction:
```ts
const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
const adjustedFirst = firstDay === 0 ? 6 : firstDay - 1;
```

### Fix 1.9 — Session labels use UTC hours (H4)
**Lines**: 249-257  
Replace `getHour` to accept a timezone parameter or use local hours.  
Simple fix — change `getUTCHours()` to `getHours()` for session detection.  
```ts
function getHour(dateStr: string): number {
  return new Date(dateStr).getHours();
}
```
Note: this changes ALL hour-based functions to local time.

### Fix 1.10 — `calculateAverageRR` magic multipliers (H6)
**Lines**: 160-177  
When no exit_price exists, simply skip those trades instead of using magic numbers:
```ts
if (withoutExit.length > 0) {
  // without exit_price, skip (uses actual prices from withExit if available)
  if (withExit.length > 0 && totalDerived > 0) {
    const multiplier = totalDerived / withExit.length;
    for (const trade of withoutExit) {
      const riskDistance = Math.abs(trade.entry_price - trade.stop_loss!);
      if (riskDistance === 0 || trade.lot_size <= 0) continue;
      const riskInDollars = riskDistance * trade.lot_size * multiplier;
      if (riskInDollars > 0) {
        totalRR += (trade.net_pnl || 0) / riskInDollars;
        count++;
      }
    }
  }
}
```

### Fix 1.11 — Invalid dates produce NaN keys (H5)
**Line**: 249-250, and in `calculateSessionStats`/`calculateHeatmapData`  
Add a validation check before processing dates:
```ts
function getHour(dateStr: string): number {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return -1;
  return d.getHours();
}
```
Then in `getSessionLabel`, handle `-1`:
```ts
function getSessionLabel(hour: number): string {
  if (hour < 0) return "Unknown";
  ...
}
```
And in `calculateSessionStats` filter:
```ts
if (session === "Off-hours" || session === "Unknown") return;
```

### Fix 1.12 — Edge discovery score favors tiny all-win combos (M2)
**Lines**: 1441-1442  
Reduce the profitFactor multiplier:
```ts
const pf = gl > 0 ? gp / gl : gp > 0 ? 10 : 0;  // cap PF at 10 instead of 99
const score = wr * 0.5 + pf * 2 + tradesArr.length;
```

### Fix 1.13 — "Holding losing trades too long" label mismatch (M3)
**Lines**: 1345-1348  
Change the improvement suggestion text:
```ts
areas.push("Exiting winners too early");
```

### Fix 1.14 — Percentage formula when totalPnl = 0 (H3)
**Line**: 1142  
Fix the detail text to handle zero/negative totalPnl:
```ts
detail: worstSessionStat.pnl < 0
  ? `-$${Math.abs(worstSessionStat.pnl).toFixed(0)} P&L in ${worstSessionStat.session} session.`
  : "Performing adequately.",
```

### Fix 1.15 — `estimatedImprovement` formula mismatch (M8)
**Lines**: 1045-1051  
Change to reflect "cut in half":
```ts
const estimatedImprovement = Math.round(avgLossPerDay * 11); // half of 22 trading days
```

### Fix 1.16 — `similarEntryWinRate = 0` when no data (M7)
**Lines**: 1863-1865  
Use `null` and handle in the UI:
```ts
const similarEntryWinRate = similarTrades.length > 0
  ? (similarTrades.filter((t) => t.net_pnl! > 0).length / similarTrades.length) * 100
  : null;
```
And update lines 1897, 1916-1917 to handle `null`.

### Fix 1.17 — `daysBetween` rounds to 0 for intraday (M11)
**Lines**: 757-760  
Use a more precise duration (hours) for sub-day durations:
```ts
function daysBetween(a: string, b: string): number {
  return Math.max(1, Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)
  ));
}
```
This ensures minimum duration of 1 day for any real drawdown.

### Fix 1.18 — Weekly review date drift (H9)
**Lines**: 1478-1480, 1484, 1511  
Use UTC for the week calculation:
```ts
const now = new Date();
const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
```
Then for the date string:
```ts
startDate: weekAgo.toISOString().split("T")[0],
```
This is actually fine since ISO string from UTC is consistent. The real fix is in how `weekAgo` is computed — make sure `now` is treated consistently. The current code is actually OK, just ensure `entry_time` comparisons use the same timezone.

### Fix 1.19 — Projected drawdown formula (H1)
**Lines**: 1534-1537  
Replace the meaningless formula with a simpler one based on largest historical drawdown:
```ts
const drawdownStats = calculateDrawdownAnalysis(last30, Math.max(...dailyPnl.map(d => d.pnl).reduce((a, b) => a + b, 0), 1000));
const expectedDrawdown = drawdownStats.maxDrawdownPct;
```

---

## PHASE 2: API ROUTES

### Fix 2.1 — TOCTOU race conditions (Issue #4)
**Files**: All POST routes that check limits  
Replace the 2-step check-then-insert pattern with an atomic SQL approach.  
Example for `trades/route.ts` lines 86-108:
```ts
const [countResult] = await sql`
  SELECT count(*)::int as cnt FROM trades WHERE user_id = ${user.id}
`;
const count = countResult?.cnt ?? 0;
if (count >= 500) {
  return NextResponse.json({ error: "Trade limit reached (500 max)" }, { status: 429 });
}
```
This is still TOCTOU but much tighter. For full atomicity, use a serializable transaction:
```ts
const [result] = await sql.begin(async (sql) => {
  const [row] = await sql`SELECT count(*)::int as cnt FROM trades WHERE user_id = ${user.id} FOR UPDATE`;
  if ((row?.cnt ?? 0) >= 500) throw new Error("LIMIT");
  return await sql`INSERT INTO trades ${sql(insertData)} RETURNING *`;
});
```

### Fix 2.2 — AI routes: JSON parse error returns 500 (Issues #6, #9)
**Files**: `ai/analyze/route.ts` lines 23-38, `ai/explain-trade/route.ts` lines 22-35  
Separate JSON parsing from try/catch:
```ts
let body: Record<string, unknown>;
try {
  body = await request.json();
} catch {
  return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
}
```

### Fix 2.3 — AI save failure silently returns 200 (Issue #8)
**Files**: `ai/analyze/route.ts` lines 59-71, `ai/explain-trade/route.ts` lines 63-72  
Move the save before the response or return error status:
```ts
try {
  const [savedAnalysis] = await sql`INSERT INTO ai_analyses ...`;
  savedId = savedAnalysis?.id;
} catch (saveError) {
  console.error("Error saving analysis:", saveError);
  // still return 200 since analysis succeeded, but log it
}
```

### Fix 2.4 — `.catch(() => {})` swallows errors (Issue #7)
**Files**: `import/route.ts` line 290, `sync/mt5/route.ts` line 27  
At minimum log the error:
```ts
await sql`INSERT INTO import_log ...`.catch((e) => console.error("import_log insert failed:", e));
```

### Fix 2.5 — `safeCount` silently returns 0 (Issue #5)
**File**: `user/usage/route.ts` lines 6-13  
Log the error:
```ts
async function safeCount(query: ReturnType<typeof sql>): Promise<number> {
  try {
    const [row] = await query;
    return Number((row as { cnt?: number })?.cnt ?? 0);
  } catch (e) {
    console.error("safeCount error:", e);
    return 0;
  }
}
```

### Fix 2.6 — File size validation on CSV import (Issue #13)
**File**: `import/route.ts` lines 237-251  
Add before reading:
```ts
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
if (file.size > MAX_FILE_SIZE) {
  return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
}
```

### Fix 2.7 — No UUID validation on ID params (Issue #12)
**Files**: Multiple routes  
Add a UUID regex check:
```ts
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (id && !UUID_REGEX.test(id)) {
  return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
}
```

### Fix 2.8 — No timeout on OpenRouter API calls (Issue #20)
**File**: `lib/openrouter.ts`  
Add `AbortController`:
```ts
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);
const response = await fetch(url, {
  ...,
  signal: controller.signal
});
clearTimeout(timeout);
```

### Fix 2.9 — `goals/[id]` PUT missing `updated_at` (Issue #21)
**File**: `goals/[id]/route.ts` lines 50-54  
Add:
```ts
updateData.updated_at = new Date().toISOString();
```

### Fix 2.10 — `import/route.ts` returns 500 for format errors (Issue #10)
**File**: `import/route.ts` lines 300-305  
Change status to 400:
```ts
return NextResponse.json(
  { error: "Failed to parse file. Make sure it's a valid MT5 export." },
  { status: 400 }
);
```

### Fix 2.11 — `reports/download/route.ts` is a stub (Issue #22)
No functional fix needed — the endpoint checks limits. Just add a TODO or proper implementation.

---

## PHASE 3: AUTH & DATABASE

### Fix 3.1 — Missing `/auth/callback` route (broken email confirmation)
**Create**: `src/app/auth/callback/route.ts`
```ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`);
}
```

### Fix 3.2 — Middleware `getUser()` has no try/catch
**File**: `middleware.ts` lines 32-34  
Wrap in try/catch:
```ts
try {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && isPublic) return;   // allow public access
  if (!user) return redirectLogin;
  if (user && isPublic) return redirectDashboard;
} catch {
  if (isPublic) return;
  return redirectLogin;
}
```

### Fix 3.3 — No password reset flow
**Add link**: In `login/page.tsx`, add a "Forgot password?" link below the password field:
```tsx
<Link href="/auth/reset-password" className="text-xs" style={{ color: "var(--primary)" }}>
  Forgot password?
</Link>
```
**Create**: `src/app/auth/reset-password/page.tsx` with a simple email form.

### Fix 3.4 — Mobile users cannot sign out
**File**: `mobile-nav.tsx`  
Add a sign-out button/icon to the mobile nav. Easiest: add a `LogOut` icon to the `More` page or add it as the 6th tab.

### Fix 3.5 — Login loading state never set to false after success
**File**: `login/page.tsx` lines 34-46  
Add `setLoading(false)` after the redirect:
```ts
router.push("/dashboard");
router.refresh();
setLoading(false); // won't matter after redirect but good practice
```

### Fix 3.6 — No `onAuthStateChange` listener
**File**: Dashboard layout `layout.tsx`  
Add a client component or modify the layout to listen:
```tsx
"use client";
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") router.push("/auth/login");
  });
  return () => subscription.unsubscribe();
}, []);
```

Heads-up: the layout is a server component, so you'd need to add this to a client wrapper or add `"use client"` at the top.

---

## PHASE 4: COMPONENTS & UI

### Fix 4.1 — Add Error Boundary
**Create**: `src/components/ui/error-boundary.tsx`
```tsx
"use client";
import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <div className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>Something went wrong</div>
          <div className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>{this.state.error?.message}</div>
          <button onClick={() => this.setState({ hasError: false })} className="mt-4 px-4 py-2 rounded-lg" style={{ background: "var(--primary)", color: "#fff" }}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```
**Wrap** in `dashboard/layout.tsx`:
```tsx
<ErrorBoundary>
  <main ...>{children}</main>
</ErrorBoundary>
```

### Fix 4.2 — Landing page logo uses `<img>` instead of `<Image priority>`
**File**: `page.tsx` line 59  
Replace `<img>` with:
```tsx
<Image
  src="/logo1.png"
  alt="Insspy"
  width={160}
  height={24}
  priority
  className="h-8 w-auto"
/>
```

### Fix 4.3 — Missing `aria-label` on icon buttons
**Files**: 
- `page.tsx:79` — hamburger menu: add `aria-label="Open menu"`
- `trades/page.tsx:251-268` — View/Edit/Delete: add `aria-label={...}` to each
- `journal/page.tsx:307-321` — search input: add `aria-label="Search journals"`
- Back buttons: `aria-label="Go back"`

### Fix 4.4 — File drop zone not keyboard accessible
**File**: `import/page.tsx:176-181`  
Add `role="button"`, `tabIndex={0}`, and `onKeyDown` handler:
```tsx
onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
```

### Fix 4.5 — Missing `cancelled` flags
**Files**: 
- `settings/page.tsx:17-27` — add `cancelled` flag
- `reports/page.tsx:77-87` — add `cancelled` flag for dynamic imports
- `ai-insights/page.tsx:86-91` — add `cancelled` guard in `.then()`

### Fix 4.6 — Route progress bar never reaches 100%
**File**: `route-progress.tsx:27-33`  
Animate to 100% before hiding:
```tsx
setLoading(true);
requestAnimationFrame(() => {
  // animate to 100% then hide
  setTimeout(() => {
    setProgress(100);
    setTimeout(() => setLoading(false), 300);
  }, 200);
});
```

### Fix 4.7 — Unused imports
**File**: `page.tsx` — remove `Check` (line 13) and `Settings` (line 22) imports.

### Fix 4.8 — Missing `aria-current` on active nav items
**File**: `nav-link.tsx`, `sidebar.tsx`, `mobile-nav.tsx`  
Add `aria-current={isActive ? "page" : undefined}` to active links.

### Fix 4.9 — `overflow-x-hidden` on root container
**File**: `page.tsx:53` — keep it but ensure it doesn't clip sticky/fixed elements.

### Fix 4.10 — Route progress bar timeout increased
Already done (400→600ms). Good.

---

## PHASE 5: VERIFICATION

1. Run `npx tsc --noEmit` — must pass clean
2. Run `npx next build` — must complete
3. Manual testing checklist:
   - Login → Dashboard → all nav links work
   - Create a trade → verify streak, stats update
   - Mobile: bottom nav → More → all links work
   - Mobile: sign out (after adding the button)
   - Email confirmation flow (after adding callback route)
   - Upload a CSV with trades
   - Open AI insights page
   - Responsive: check all pages at 375px width

---

## SUMMARY OF CHANGES

| Phase | Files Changed | New Files | Edits |
|-------|--------------|-----------|-------|
| 1. Calculations | 1 | 0 | ~20 edits |
| 2. API Routes | ~12 | 0 | ~15 edits |
| 3. Auth/DB | ~5 | 2 | ~10 edits |
| 4. Components/UI | ~15 | 1 | ~20 edits |
| **Total** | **~33** | **3** | **~65 edits** |
