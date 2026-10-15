import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeTrades } from "@/lib/openrouter";
import type { Trade } from "@/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let account_id: string | undefined;
  let strategy: string | undefined;
  let queryLimit = 100;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    account_id = body.account_id as string | undefined;
    strategy = body.strategy as string | undefined;
    queryLimit = (body.limit as number) ?? 100;
  } catch {
    return NextResponse.json({ error: "Failed to parse request" }, { status: 500 });
  }

  try {
    let query = supabase
      .from("trades")
      .select("*")
      .eq("user_id", user.id);

    if (account_id) query = query.eq("account_id", account_id);
    if (strategy) query = query.eq("strategy", strategy);

    query = query.order("entry_time", { ascending: false }).limit(queryLimit);

    const { data: trades, error } = await query;
    if (error) throw error;

    if (!trades || trades.length === 0) {
      return NextResponse.json(
        { error: "No trades found for analysis" },
        { status: 404 }
      );
    }

    const analysis = await analyzeTrades(trades as unknown as Trade[]);

    let savedId: string | undefined;
    try {
      const tradeIds = trades.map((t: { id: string }) => t.id);
      const insightsJson = JSON.stringify(analysis);
      const { data: savedAnalysis, error: saveError } = await supabase
        .from("ai_analyses")
        .insert({ user_id: user.id, trade_ids: tradeIds, analysis_text: analysis.summary, insights: insightsJson })
        .select()
        .single();

      if (saveError) throw saveError;
      savedId = savedAnalysis?.id;
    } catch (saveError) {
      console.error("Error saving analysis:", saveError);
    }

    return NextResponse.json({
      analysis,
      trades_analyzed: trades.length,
      saved_id: savedId,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
