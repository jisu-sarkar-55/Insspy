import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "Missing x-api-key header" }, { status: 401 });
  }

  const supabase = await createClient();

  const { data: keyData, error: keyError } = await supabase
    .from("api_keys")
    .select("user_id")
    .eq("key", apiKey)
    .single();

  if (keyError || !keyData) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  const userId = keyData.user_id;

  await supabase
    .from("api_keys")
    .update({ last_used: new Date().toISOString() })
    .eq("key", apiKey);

  const trades = await request.json();

  if (!Array.isArray(trades) || trades.length === 0) {
    return NextResponse.json({ error: "No trades provided" }, { status: 400 });
  }

  const insertData = trades.map((t: Record<string, unknown>) => {
    const mt5Profit = (t.profit as number) || 0;
    const commission = Math.abs((t.commission as number) || 0);
    const swap = (t.swap as number) || 0;

    return {
      user_id: userId,
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

  const mt5Tickets = insertData
    .map((t) => t.mt5_ticket)
    .filter((t) => t);

  if (mt5Tickets.length > 0) {
    const { data: existing } = await supabase
      .from("trades")
      .select("mt5_ticket")
      .eq("user_id", userId)
      .in("mt5_ticket", mt5Tickets as string[]);

    const existingTickets = new Set(
      existing?.map((e) => e.mt5_ticket) || []
    );

    const newTrades = insertData.filter(
      (t) => !t.mt5_ticket || !existingTickets.has(t.mt5_ticket as string)
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
