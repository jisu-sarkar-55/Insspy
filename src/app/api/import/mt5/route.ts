import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trades = await request.json();

  if (!Array.isArray(trades) || trades.length === 0) {
    return NextResponse.json({ error: "No trades provided" }, { status: 400 });
  }

  const insertData = trades.map((t: Record<string, unknown>) => {
    const mt5Profit = (t.pnl as number) || 0;
    const commission = Math.abs((t.commission as number) || 0);
    const swap = (t.swap as number) || 0;

    return {
      user_id: user.id,
      symbol: t.symbol,
      direction: t.direction,
      entry_price: t.entry_price,
      exit_price: t.exit_price,
      lot_size: t.lot_size,
      entry_time: t.entry_time,
      exit_time: t.exit_time,
      pnl: mt5Profit + commission + swap,
      commission,
      swap,
      net_pnl: mt5Profit,
      source: "mt5",
      mt5_ticket: t.mt5_ticket,
    };
  });

  // Check for duplicates based on mt5_ticket
  const mt5Tickets = insertData
    .map((t) => t.mt5_ticket)
    .filter((t) => t);

  if (mt5Tickets.length > 0) {
    const { data: existing } = await supabase
      .from("trades")
      .select("mt5_ticket")
      .in("mt5_ticket", mt5Tickets);

    const existingTickets = new Set(
      existing?.map((e) => e.mt5_ticket) || []
    );

    const newTrades = insertData.filter(
      (t) => !t.mt5_ticket || !existingTickets.has(t.mt5_ticket)
    );

    if (newTrades.length === 0) {
      return NextResponse.json({
        success: true,
        imported: 0,
        message: "All trades already synced",
      });
    }

    const { data, error } = await supabase
      .from("trades")
      .insert(newTrades)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imported: data.length,
      skipped: insertData.length - data.length,
    });
  }

  const { data, error } = await supabase
    .from("trades")
    .insert(insertData)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    imported: data.length,
  });
}
