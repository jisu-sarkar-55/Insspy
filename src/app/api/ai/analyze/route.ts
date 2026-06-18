import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
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

  const { account_id, strategy, limit = 100 } = await request.json();

  try {
    const trades = await sql`
      SELECT * FROM trades
      WHERE user_id = ${user.id}
      ${account_id ? sql`AND account_id = ${account_id}` : sql``}
      ${strategy ? sql`AND strategy = ${strategy}` : sql``}
      ORDER BY entry_time DESC
      LIMIT ${limit}
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
