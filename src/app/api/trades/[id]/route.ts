import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

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
      UPDATE trades SET ${sql({ ...body, pnl, net_pnl: netPnl, updated_at: new Date().toISOString() })}
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
