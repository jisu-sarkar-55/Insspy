import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { explainLosingTrade } from "@/lib/openrouter";
import { analyzeLosingTrade } from "@/lib/calculations";

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

  const { data: trade, error: tradeError } = await supabase
    .from("trades")
    .select("*")
    .eq("id", trade_id)
    .eq("user_id", user.id)
    .single();

  if (tradeError || !trade) {
    return NextResponse.json({ error: "Trade not found" }, { status: 404 });
  }

  const { data: recentTrades } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", user.id)
    .order("entry_time", { ascending: false })
    .limit(20);

  const allTrades = recentTrades || [];
  const localAnalysis = analyzeLosingTrade(trade, allTrades);

  const aiAnalysis = await explainLosingTrade(trade, allTrades, {
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
}
