import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";

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

    return NextResponse.json({ success: true, deleted: result.count });
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

  const body = await request.json();

  const netPnl = body.net_pnl ?? ((body.pnl || 0) + (body.commission || 0) + (body.swap || 0));
  const pnl = body.pnl ?? (netPnl - (body.commission || 0) - (body.swap || 0));

  try {
    const data = await sql`
      INSERT INTO trades ${sql({ ...body, user_id: user.id, pnl, net_pnl: netPnl })}
      RETURNING *
    `;
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
