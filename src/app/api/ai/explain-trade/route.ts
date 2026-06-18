import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
import { explainLosingTrade } from "@/lib/openrouter";
import { analyzeLosingTrade } from "@/lib/calculations";
import type { Trade } from "@/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { trade_id } = await request.json();

  if (!trade_id) {
    return NextResponse.json({ error: "trade_id is required" }, { status: 400 });
  }

  try {
    const [trade] = await sql`
      SELECT * FROM trades WHERE id = ${trade_id} AND user_id = ${user.id}
    `;

    if (!trade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    const allTrades = await sql`
      SELECT * FROM trades WHERE user_id = ${user.id} ORDER BY entry_time DESC LIMIT 20
    `;

    const localAnalysis = analyzeLosingTrade(trade as unknown as Trade, allTrades as unknown as Trade[]);

    const aiAnalysis = await explainLosingTrade(trade as unknown as Trade, allTrades as unknown as Trade[], {
      session: localAnalysis.session,
      consecutiveLossCount: localAnalysis.consecutiveLossCount,
      similarEntryWinRate: localAnalysis.similarEntryWinRate,
      possibleReasons: localAnalysis.possibleReasons,
    });

    return NextResponse.json({
      trade,
      localAnalysis,
      aiAnalysis,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
