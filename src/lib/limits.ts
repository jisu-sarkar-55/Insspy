export interface LimitResult {
  allowed: boolean;
  current: number;
  limit: number;
}

export const FREE_LIMITS = {
  maxTrades: Infinity,
  maxAiAnalysesPerMonth: Infinity,
  maxCsvImports: Infinity,
  maxActiveGoals: Infinity,
  maxSetupPlaybooks: Infinity,
  maxReportDownloadsPerMonth: Infinity,
} as const;

export async function checkTradeLimit(_userId?: string, _userEmail?: string | null): Promise<LimitResult> {
  return { allowed: true, current: 0, limit: Infinity };
}

export async function checkAiLimit(_userId?: string, _userEmail?: string | null): Promise<LimitResult> {
  return { allowed: true, current: 0, limit: Infinity };
}

export async function checkCsvImportLimit(_userId?: string, _userEmail?: string | null): Promise<LimitResult> {
  return { allowed: true, current: 0, limit: Infinity };
}

export async function checkGoalsLimit(_userId?: string, _userEmail?: string | null): Promise<LimitResult> {
  return { allowed: true, current: 0, limit: Infinity };
}

export async function checkPlaybooksLimit(_userId?: string, _userEmail?: string | null): Promise<LimitResult> {
  return { allowed: true, current: 0, limit: Infinity };
}

export async function checkReportDownloadLimit(_userId?: string, _userEmail?: string | null): Promise<LimitResult> {
  return { allowed: true, current: 0, limit: Infinity };
}

export async function incrementReportDownload(_userId?: string, _userEmail?: string | null): Promise<void> {
}
