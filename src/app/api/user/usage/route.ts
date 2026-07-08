import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FREE_LIMITS } from "@/lib/limits";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    trades: { current: 0, limit: FREE_LIMITS.maxTrades },
    ai_analyses: { current: 0, limit: FREE_LIMITS.maxAiAnalysesPerMonth },
    csv_imports: { current: 0, limit: FREE_LIMITS.maxCsvImports },
    goals: { current: 0, limit: FREE_LIMITS.maxActiveGoals },
    playbooks: { current: 0, limit: FREE_LIMITS.maxSetupPlaybooks },
    report_downloads: { current: 0, limit: FREE_LIMITS.maxReportDownloadsPerMonth },
  });
}
