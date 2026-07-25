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

  let trades: Record<string, unknown>[];
  try {
    trades = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

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

  const mt5Tickets: string[] = insertData
    .map((t) => t.mt5_ticket)
    .filter((t): t is string => !!t);

  try {
    if (mt5Tickets.length > 0) {
      const { data: existing, error: existingError } = await supabase
        .from("trades")
        .select("mt5_ticket")
        .in("mt5_ticket", mt5Tickets);

      if (existingError) throw existingError;

      const existingTickets = new Set(
        (existing || []).map((e: { mt5_ticket: string }) => e.mt5_ticket)
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

      if (error) throw error;

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

    if (error) throw error;

    return NextResponse.json({
      success: true,
      imported: data.length,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
