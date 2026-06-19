import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "Missing x-api-key header" }, { status: 401 });
  }

  const supabase = await createClient();

  try {
    const [keyData] = await sql`
      SELECT user_id FROM api_keys WHERE key = ${apiKey}
    `;

    if (!keyData) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const userId = keyData.user_id;

    await sql`
      UPDATE api_keys SET last_used = ${new Date().toISOString()} WHERE key = ${apiKey}
    `.catch((e) => console.error("api_keys update failed:", e));

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

    const mt5Tickets: string[] = insertData
      .map((t) => t.mt5_ticket)
      .filter((t): t is string => !!t);

    if (mt5Tickets.length > 0) {
      const existing: { mt5_ticket: string }[] = await sql`
        SELECT mt5_ticket FROM trades WHERE user_id = ${userId} AND mt5_ticket = ANY(${mt5Tickets})
      `;

      const existingTickets = new Set(
        (existing || []).map((e) => e.mt5_ticket)
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

      const typedNew = newTrades.map((t) => ({
        user_id: t.user_id as string,
        symbol: t.symbol as string,
        direction: t.direction as string,
        entry_price: t.entry_price as number,
        exit_price: t.exit_price as number | null,
        lot_size: t.lot_size as number,
        entry_time: t.entry_time as string,
        exit_time: t.exit_time as string | null,
        pnl: t.pnl as number,
        commission: t.commission as number,
        swap: t.swap as number,
        net_pnl: t.net_pnl as number,
        source: t.source as string,
        mt5_ticket: t.mt5_ticket as string | null,
      }));

      const data = await sql`
        INSERT INTO trades ${sql(typedNew, 'user_id', 'symbol', 'direction', 'entry_price', 'exit_price', 'lot_size', 'entry_time', 'exit_time', 'pnl', 'commission', 'swap', 'net_pnl', 'source', 'mt5_ticket')}
        RETURNING *
      `;

      return NextResponse.json({
        success: true,
        imported: data.length,
        skipped: insertData.length - data.length,
      });
    }

    const typedAll = insertData.map((t) => ({
      user_id: t.user_id as string,
      symbol: t.symbol as string,
      direction: t.direction as string,
      entry_price: t.entry_price as number,
      exit_price: t.exit_price as number | null,
      lot_size: t.lot_size as number,
      entry_time: t.entry_time as string,
      exit_time: t.exit_time as string | null,
      pnl: t.pnl as number,
      commission: t.commission as number,
      swap: t.swap as number,
      net_pnl: t.net_pnl as number,
      source: t.source as string,
      mt5_ticket: t.mt5_ticket as string | null,
    }));

    const data = await sql`
      INSERT INTO trades ${sql(typedAll, 'user_id', 'symbol', 'direction', 'entry_price', 'exit_price', 'lot_size', 'entry_time', 'exit_time', 'pnl', 'commission', 'swap', 'net_pnl', 'source', 'mt5_ticket')}
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      imported: data.length,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
