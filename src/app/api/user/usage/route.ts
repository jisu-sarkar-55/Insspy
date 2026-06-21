import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
import { FREE_LIMITS } from "@/lib/limits";

const ADMIN_EMAIL = "sarkar55jisu@gmail.com";

async function safeCount(query: ReturnType<typeof sql>): Promise<number> {
  try {
    const [row] = await query;
    return Number((row as { cnt?: number })?.cnt ?? 0);
  } catch (e) {
    console.error("safeCount error:", e);
    return 0;
  }
}

function unlimited(limits: Record<string, { current: number; limit: number }>) {
  const result: Record<string, { current: number; limit: number }> = {};
  for (const key of Object.keys(limits)) {
    result[key] = { current: 0, limit: Infinity };
  }
  return result;
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.email === ADMIN_EMAIL) {
    return NextResponse.json(unlimited({
      trades: { current: 0, limit: 0 },
      ai_analyses: { current: 0, limit: 0 },
      csv_imports: { current: 0, limit: 0 },
      goals: { current: 0, limit: 0 },
      playbooks: { current: 0, limit: 0 },
      report_downloads: { current: 0, limit: 0 },
    }));
  }

  const [trades, ai, csv, goals, playbooks, reports] = await Promise.all([
    safeCount(sql`SELECT count(*)::int as cnt FROM trades WHERE user_id = ${user.id}::uuid`),
    safeCount(sql`SELECT count(*)::int as cnt FROM ai_analyses WHERE user_id = ${user.id}::uuid AND created_at >= date_trunc('month', now())`),
    safeCount(sql`SELECT count(*)::int as cnt FROM import_log WHERE user_id = ${user.id}::uuid AND source = 'csv'`),
    safeCount(sql`SELECT count(*)::int as cnt FROM goals WHERE user_id = ${user.id}::uuid AND status = 'active'`),
    safeCount(sql`SELECT count(*)::int as cnt FROM setup_playbooks WHERE user_id = ${user.id}::uuid`),
    safeCount(sql`SELECT count(*)::int as cnt FROM report_downloads WHERE user_id = ${user.id}::uuid AND created_at >= date_trunc('month', now())`),
  ]);

  return NextResponse.json({
    trades: { current: trades, limit: FREE_LIMITS.maxTrades },
    ai_analyses: { current: ai, limit: FREE_LIMITS.maxAiAnalysesPerMonth },
    csv_imports: { current: csv, limit: FREE_LIMITS.maxCsvImports },
    goals: { current: goals, limit: FREE_LIMITS.maxActiveGoals },
    playbooks: { current: playbooks, limit: FREE_LIMITS.maxSetupPlaybooks },
    report_downloads: { current: reports, limit: FREE_LIMITS.maxReportDownloadsPerMonth },
  });
}
