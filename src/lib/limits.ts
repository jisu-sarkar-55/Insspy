import { sql } from "@/lib/db";

export interface LimitResult {
  allowed: boolean;
  current: number;
  limit: number;
}

const ADMIN_EMAIL = "sarkar55jisu@gmail.com";

function isAdmin(email: string | undefined | null): boolean {
  return email === ADMIN_EMAIL;
}

export const FREE_LIMITS = {
  maxTrades: 500,
  maxAiAnalysesPerMonth: 20,
  maxCsvImports: 10,
  maxActiveGoals: 5,
  maxSetupPlaybooks: 10,
  maxReportDownloadsPerMonth: 10,
} as const;

export async function checkTradeLimit(userId: string, userEmail?: string | null): Promise<LimitResult> {
  if (isAdmin(userEmail)) return { allowed: true, current: 0, limit: Infinity };
  try {
    const [row] = await sql`SELECT count(*)::int as cnt FROM trades WHERE user_id = ${userId}::uuid`;
    const current = Number(row?.cnt ?? 0);
    return { allowed: current < FREE_LIMITS.maxTrades, current, limit: FREE_LIMITS.maxTrades };
  } catch {
    return { allowed: true, current: 0, limit: FREE_LIMITS.maxTrades };
  }
}

export async function checkAiLimit(userId: string, userEmail?: string | null): Promise<LimitResult> {
  if (isAdmin(userEmail)) return { allowed: true, current: 0, limit: Infinity };
  try {
    const [row] = await sql`
      SELECT count(*)::int as cnt FROM ai_analyses
      WHERE user_id = ${userId}::uuid AND created_at >= date_trunc('month', now())
    `;
    const current = Number(row?.cnt ?? 0);
    return { allowed: current < FREE_LIMITS.maxAiAnalysesPerMonth, current, limit: FREE_LIMITS.maxAiAnalysesPerMonth };
  } catch {
    return { allowed: true, current: 0, limit: FREE_LIMITS.maxAiAnalysesPerMonth };
  }
}

export async function checkCsvImportLimit(userId: string, userEmail?: string | null): Promise<LimitResult> {
  if (isAdmin(userEmail)) return { allowed: true, current: 0, limit: Infinity };
  try {
    const [row] = await sql`
      SELECT count(*)::int as cnt FROM import_log
      WHERE user_id = ${userId}::uuid AND source = 'csv'
    `;
    const current = Number(row?.cnt ?? 0);
    return { allowed: current < FREE_LIMITS.maxCsvImports, current, limit: FREE_LIMITS.maxCsvImports };
  } catch {
    return { allowed: true, current: 0, limit: FREE_LIMITS.maxCsvImports };
  }
}

export async function checkGoalsLimit(userId: string, userEmail?: string | null): Promise<LimitResult> {
  if (isAdmin(userEmail)) return { allowed: true, current: 0, limit: Infinity };
  try {
    const [row] = await sql`
      SELECT count(*)::int as cnt FROM goals
      WHERE user_id = ${userId}::uuid AND status = 'active'
    `;
    const current = Number(row?.cnt ?? 0);
    return { allowed: current < FREE_LIMITS.maxActiveGoals, current, limit: FREE_LIMITS.maxActiveGoals };
  } catch {
    return { allowed: true, current: 0, limit: FREE_LIMITS.maxActiveGoals };
  }
}

export async function checkPlaybooksLimit(userId: string, userEmail?: string | null): Promise<LimitResult> {
  if (isAdmin(userEmail)) return { allowed: true, current: 0, limit: Infinity };
  try {
    const [row] = await sql`
      SELECT count(*)::int as cnt FROM setup_playbooks
      WHERE user_id = ${userId}::uuid
    `;
    const current = Number(row?.cnt ?? 0);
    return { allowed: current < FREE_LIMITS.maxSetupPlaybooks, current, limit: FREE_LIMITS.maxSetupPlaybooks };
  } catch {
    return { allowed: true, current: 0, limit: FREE_LIMITS.maxSetupPlaybooks };
  }
}

export async function checkReportDownloadLimit(userId: string, userEmail?: string | null): Promise<LimitResult> {
  if (isAdmin(userEmail)) return { allowed: true, current: 0, limit: Infinity };
  try {
    const [row] = await sql`
      SELECT count(*)::int as cnt FROM report_downloads
      WHERE user_id = ${userId}::uuid AND created_at >= date_trunc('month', now())
    `;
    const current = Number(row?.cnt ?? 0);
    return { allowed: current < FREE_LIMITS.maxReportDownloadsPerMonth, current, limit: FREE_LIMITS.maxReportDownloadsPerMonth };
  } catch {
    return { allowed: true, current: 0, limit: FREE_LIMITS.maxReportDownloadsPerMonth };
  }
}

export async function incrementReportDownload(userId: string, userEmail?: string | null): Promise<void> {
  if (isAdmin(userEmail)) return;
  try {
    await sql`
      INSERT INTO report_downloads (user_id) VALUES (${userId})
    `;
  } catch {
    // table may not exist yet — silently ignore
  }
}
