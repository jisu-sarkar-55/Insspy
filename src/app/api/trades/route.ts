import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
import { checkTradeLimit } from "@/lib/limits";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("account_id");
  const strategy = searchParams.get("strategy");
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");

  try {
    const data = await sql`
      SELECT * FROM trades
      WHERE user_id = ${user.id}
      ${accountId ? sql`AND account_id = ${accountId}` : sql``}
      ${strategy ? sql`AND strategy = ${strategy}` : sql``}
      ${startDate ? sql`AND entry_time >= ${startDate}` : sql``}
      ${endDate ? sql`AND entry_time <= ${endDate}` : sql``}
      ORDER BY entry_time DESC
    `;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No trade IDs provided" }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM trades WHERE id = ANY(${ids}) AND user_id = ${user.id}
    `;

    return NextResponse.json({ success: true, deleted: Number(result.count) });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const limitCheck = await checkTradeLimit(user.id);
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: `Trade limit reached (${limitCheck.current}/${limitCheck.limit}). Delete existing trades to add more.`,
        usage: limitCheck,
      }, { status: 429 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to check trade limit" }, { status: 500 });
  }

  const netPnl = body.net_pnl as number ?? ((body.pnl as number || 0) + (body.commission as number || 0) + (body.swap as number || 0));
  const pnl = body.pnl as number ?? (netPnl - (body.commission as number || 0) - (body.swap as number || 0));

  const allowed = ["symbol", "direction", "entry_price", "exit_price", "stop_loss", "take_profit", "lot_size", "entry_time", "exit_time", "commission", "swap", "strategy", "tags", "notes", "screenshot_url", "confidence_before", "fear_level", "greed_level", "followed_plan", "mistakes", "source", "mt5_ticket", "setup_playbook_id", "account_id"];
  const insertData: Record<string, unknown> = { user_id: user.id, pnl, net_pnl: netPnl };
  for (const key of allowed) {
    if (key in body) insertData[key] = body[key];
  }

  try {
    const data = await sql`
      INSERT INTO trades ${sql(insertData)}
      RETURNING *
    `;
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
