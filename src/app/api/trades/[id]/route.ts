import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (id && !UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid trade ID" }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await sql`
      SELECT * FROM trades WHERE id = ${id} AND user_id = ${user.id} LIMIT 1
    `;
    return NextResponse.json(data[0] ?? null);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (id && !UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid trade ID" }, { status: 400 });
  }

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

  const netPnl = body.net_pnl as number ?? ((body.pnl as number || 0) + (body.commission as number || 0) + (body.swap as number || 0));
  const pnl = body.pnl as number ?? (netPnl - (body.commission as number || 0) - (body.swap as number || 0));

  const allowed = ["symbol", "direction", "entry_price", "exit_price", "stop_loss", "take_profit", "lot_size", "entry_time", "exit_time", "commission", "swap", "strategy", "tags", "notes", "screenshot_url", "confidence_before", "fear_level", "greed_level", "followed_plan", "mistakes", "source", "mt5_ticket", "setup_playbook_id", "account_id"];
  const updateData: Record<string, unknown> = { pnl, net_pnl: netPnl, updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) updateData[key] = body[key];
  }

  try {
    const data = await sql`
      UPDATE trades SET ${sql(updateData)}
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING *
    `;
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (id && !UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid trade ID" }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await sql`DELETE FROM trades WHERE id = ${id} AND user_id = ${user.id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
