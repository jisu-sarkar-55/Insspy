import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { explainLosingTrade } from "@/lib/openrouter";
import { analyzeLosingTrade } from "@/lib/calculations";
import { checkAiLimit } from "@/lib/limits";
import type { Trade } from "@/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let trade_id: string | undefined;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    trade_id = body.trade_id as string | undefined;

    const limitCheck = await checkAiLimit(user.id, user.email);
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: `AI analysis limit reached (${limitCheck.current}/${limitCheck.limit} this month).`,
        usage: limitCheck,
      }, { status: 429 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to check AI limit" }, { status: 500 });
  }

  if (!trade_id) {
    return NextResponse.json({ error: "trade_id is required" }, { status: 400 });
  }

  try {
    const { data: trade, error: tradeError } = await supabase
      .from("trades")
      .select("*")
      .eq("id", trade_id)
      .eq("user_id", user.id)
      .single();

    if (tradeError) {
      if (tradeError.code === "PGRST116") {
        return NextResponse.json({ error: "Trade not found" }, { status: 404 });
      }
      throw tradeError;
    }

    const { data: allTrades, error: allError } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_time", { ascending: false })
      .limit(20);

    if (allError) throw allError;

    const localAnalysis = analyzeLosingTrade(trade as unknown as Trade, allTrades as unknown as Trade[]);

    const aiAnalysis = await explainLosingTrade(trade as unknown as Trade, allTrades as unknown as Trade[], {
      session: localAnalysis.session,
      consecutiveLossCount: localAnalysis.consecutiveLossCount,
      similarEntryWinRate: localAnalysis.similarEntryWinRate ?? 0,
      possibleReasons: localAnalysis.possibleReasons,
    });

    try {
      const insightsJson = JSON.stringify({ localAnalysis, aiAnalysis });
      const tradeIds = [trade_id];
      await supabase
        .from("ai_analyses")
        .insert({ user_id: user.id, trade_ids: tradeIds, analysis_text: aiAnalysis || "", insights: insightsJson });
    } catch (saveError) {
      console.error("Error saving AI analysis:", saveError);
    }

    return NextResponse.json({
      trade,
      localAnalysis,
      aiAnalysis,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
