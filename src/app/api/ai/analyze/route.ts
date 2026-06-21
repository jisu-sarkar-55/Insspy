import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
import { analyzeTrades } from "@/lib/openrouter";
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

    const limitCheck = await checkAiLimit(user.id, user.email);
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: `AI analysis limit reached (${limitCheck.current}/${limitCheck.limit} this month).`,
        usage: limitCheck,
      }, { status: 429 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Failed to check AI limit" }, { status: 500 });
  }

  try {
    const trades = await sql`
      SELECT * FROM trades
      WHERE user_id = ${user.id}
      ${account_id ? sql`AND account_id = ${account_id}` : sql``}
      ${strategy ? sql`AND strategy = ${strategy}` : sql``}
      ORDER BY entry_time DESC
      LIMIT ${queryLimit}
    `;

    if (trades.length === 0) {
      return NextResponse.json(
        { error: "No trades found for analysis" },
        { status: 404 }
      );
    }

    const analysis = await analyzeTrades(trades as unknown as Trade[]);

    let savedId: string | undefined;
    try {
      const tradeIds = trades.map((t: any) => t.id);
      const insightsJson = JSON.stringify(analysis);
      const [savedAnalysis] = await sql`
        INSERT INTO ai_analyses (user_id, trade_ids, analysis_text, insights)
        VALUES (${user.id}, ${tradeIds}, ${analysis.summary}, ${insightsJson})
        RETURNING *
      `;
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
