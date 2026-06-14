import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  let query = supabase
    .from("trades")
    .select("*")
    .eq("user_id", user.id)
    .order("entry_time", { ascending: false });

  if (accountId) {
    query = query.eq("account_id", accountId);
  }

  if (strategy) {
    query = query.eq("strategy", strategy);
  }

  if (startDate) {
    query = query.gte("entry_time", startDate);
  }

  if (endDate) {
    query = query.lte("entry_time", endDate);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
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

  const { data, error } = await supabase
    .from("trades")
    .insert({
      ...body,
      user_id: user.id,
      pnl,
      net_pnl: netPnl,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
