import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Mt5Trade {
  ticket: string;
  symbol: string;
  direction: "buy" | "sell";
  volume: number;
  open_time: string;
  close_time: string;
  open_price: number;
  close_price: number;
  commission: number;
  swap: number;
  profit: number;
}

function parseMt5Csv(csvText: string): Mt5Trade[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const ticketIdx = headers.findIndex((h) => h.includes("ticket") || h === "#");
  const symbolIdx = headers.findIndex((h) => h.includes("symbol") || h.includes("item"));
  const typeIdx = headers.findIndex((h) => h.includes("type"));
  const volumeIdx = headers.findIndex((h) => h.includes("volume") || h.includes("size") || h.includes("lots"));
  const openTimeIdx = headers.findIndex((h) => h.includes("open time") || h.includes("open_time") || h.includes("time"));
  const closeTimeIdx = headers.findIndex((h) => h.includes("close time") || h.includes("close_time"));
  const openPriceIdx = headers.findIndex((h) => h.includes("open price") || h.includes("open_price") || h.includes("price"));
  const closePriceIdx = headers.findIndex((h) => h.includes("close price") || h.includes("close_price"));
  const commissionIdx = headers.findIndex((h) => h.includes("commission"));
  const swapIdx = headers.findIndex((h) => h.includes("swap"));
  const profitIdx = headers.findIndex((h) => h.includes("profit") || h.includes("p/l") || h.includes("pnl"));

  const trades: Mt5Trade[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());

    if (values.length < headers.length - 1) continue;

    const typeStr = typeIdx >= 0 ? values[typeIdx].toLowerCase() : "";
    let direction: "buy" | "sell" = "buy";
    if (typeStr.includes("sell") || typeStr.includes("short")) {
      direction = "sell";
    }

    const openTime = openTimeIdx >= 0 ? values[openTimeIdx] : "";
    const closeTime = closeTimeIdx >= 0 ? values[closeTimeIdx] : "";

    trades.push({
      ticket: ticketIdx >= 0 ? values[ticketIdx] : `import-${i}`,
      symbol: symbolIdx >= 0 ? values[symbolIdx] : "UNKNOWN",
      direction,
      volume: volumeIdx >= 0 ? parseFloat(values[volumeIdx]) || 0.01 : 0.01,
      open_time: openTime,
      close_time: closeTime,
      open_price: openPriceIdx >= 0 ? parseFloat(values[openPriceIdx]) || 0 : 0,
      close_price: closePriceIdx >= 0 ? parseFloat(values[closePriceIdx]) || 0 : 0,
      commission: commissionIdx >= 0 ? parseFloat(values[commissionIdx]) || 0 : 0,
      swap: swapIdx >= 0 ? parseFloat(values[swapIdx]) || 0 : 0,
      profit: profitIdx >= 0 ? parseFloat(values[profitIdx]) || 0 : 0,
    });
  }

  return trades;
}

function parseMt5Date(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();

  const cleaned = dateStr.replace(/"/g, "").trim();

  const formats = [
    /^(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/,
    /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/,
    /^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/,
  ];

  for (const format of formats) {
    const match = cleaned.match(format);
    if (match) {
      if (format === formats[0] || format === formats[1]) {
        return `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}`;
      } else {
        return `${match[3]}-${match[2]}-${match[1]}T${match[4]}:${match[5]}:${match[6]}`;
      }
    }
  }

  const date = new Date(cleaned);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }

  return new Date().toISOString();
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv") && !file.name.endsWith(".htm") && !file.name.endsWith(".html")) {
      return NextResponse.json(
        { error: "Please upload a CSV or HTML file" },
        { status: 400 }
      );
    }

    const text = await file.text();
    const trades = parseMt5Csv(text);

    if (trades.length === 0) {
      return NextResponse.json(
        { error: "No valid trades found in the file. Check the format." },
        { status: 400 }
      );
    }

    const insertData = trades.map((t) => ({
      user_id: user.id,
      symbol: t.symbol,
      direction: t.direction,
      entry_price: t.open_price,
      exit_price: t.close_price,
      lot_size: t.volume,
      entry_time: parseMt5Date(t.open_time),
      exit_time: parseMt5Date(t.close_time),
      pnl: t.profit + t.commission + t.swap,
      commission: Math.abs(t.commission),
      swap: t.swap,
      net_pnl: t.profit,
      source: "mt5" as const,
      mt5_ticket: t.ticket,
    }));

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
      trades: data,
    });
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json(
      { error: "Failed to parse file. Make sure it's a valid MT5 export." },
      { status: 500 }
    );
  }
}
