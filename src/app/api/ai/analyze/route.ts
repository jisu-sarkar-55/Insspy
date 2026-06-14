import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeTrades } from "@/lib/openrouter";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { account_id, strategy, limit = 100 } = await request.json();

  let query = supabase
    .from("trades")
    .select("*")
    .eq("user_id", user.id)
    .order("entry_time", { ascending: false })
    .limit(limit);

  if (account_id) {
    query = query.eq("account_id", account_id);
  }

  if (strategy) {
    query = query.eq("strategy", strategy);
  }

  const { data: trades, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!trades || trades.length === 0) {
    return NextResponse.json(
      { error: "No trades found for analysis" },
      { status: 404 }
    );
  }

  const analysis = await analyzeTrades(trades);

  const { data: savedAnalysis, error: saveError } = await supabase
    .from("ai_analyses")
    .insert({
      user_id: user.id,
      trade_ids: trades.map((t) => t.id),
      analysis_text: analysis.summary,
      insights: analysis,
    })
    .select()
    .single();

  if (saveError) {
    console.error("Error saving analysis:", saveError);
  }

  return NextResponse.json({
    analysis,
    trades_analyzed: trades.length,
    saved_id: savedAnalysis?.id,
  });
}
