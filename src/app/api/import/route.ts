import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
import { checkCsvImportLimit } from "@/lib/limits";

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

function parseNumber(value: string): number {
  return parseFloat(value.replace(/\s/g, "")) || 0;
}

function detectDelimiter(line: string): string {
  return line.includes("\t") ? "\t" : ",";
}

function splitLine(line: string, delimiter: string): string[] {
  return line.split(delimiter).map((v) => v.trim());
}

function parseCsvLines(text: string): string[] {
  return text.trim().replace(/\r\n/g, "\n").split("\n");
}

function parseDealLevelCsv(csvText: string): Mt5Trade[] {
  const lines = parseCsvLines(csvText);
  if (lines.length < 2) return [];

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitLine(lines[0], delimiter).map((h) => h.toLowerCase());

  const timeIdx = headers.indexOf("time");
  const dealIdx = headers.indexOf("deal");
  const symbolIdx = headers.indexOf("symbol");
  const typeIdx = headers.indexOf("type");
  const directionIdx = headers.indexOf("direction");
  const volumeIdx = headers.indexOf("volume");
  const priceIdx = headers.indexOf("price");
  const commissionIdx = headers.indexOf("commission");
  const feeIdx = headers.indexOf("fee");
  const swapIdx = headers.indexOf("swap");
  const profitIdx = headers.indexOf("profit");

  interface Deal {
    time: string;
    deal: string;
    symbol: string;
    type: string;
    direction: string;
    volume: number;
    price: number;
    commission: number;
    fee: number;
    swap: number;
    profit: number;
  }

  const deals: Deal[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitLine(lines[i], delimiter);
    if (values.length < 10) continue;

    const type = (typeIdx >= 0 ? values[typeIdx] : "").toLowerCase();
    if (type === "balance" || type === "credit" || type === "interest") continue;

    deals.push({
      time: timeIdx >= 0 ? values[timeIdx] : "",
      deal: dealIdx >= 0 ? values[dealIdx] : `import-${i}`,
      symbol: symbolIdx >= 0 ? values[symbolIdx] : "UNKNOWN",
      type,
      direction: directionIdx >= 0 ? values[directionIdx].toLowerCase() : "",
      volume: volumeIdx >= 0 ? parseNumber(values[volumeIdx]) : 0,
      price: priceIdx >= 0 ? parseNumber(values[priceIdx]) : 0,
      commission: commissionIdx >= 0 ? parseNumber(values[commissionIdx]) : 0,
      fee: feeIdx >= 0 ? parseNumber(values[feeIdx]) : 0,
      swap: swapIdx >= 0 ? parseNumber(values[swapIdx]) : 0,
      profit: profitIdx >= 0 ? parseNumber(values[profitIdx]) : 0,
    });
  }

  deals.sort((a, b) => a.time.localeCompare(b.time));

  const trades: Mt5Trade[] = [];
  const openPositions = new Map<string, Deal[]>();

  for (const deal of deals) {
    if (deal.direction === "in") {
      const key = deal.symbol;
      if (!openPositions.has(key)) openPositions.set(key, []);
      openPositions.get(key)!.push(deal);
    } else if (deal.direction === "out") {
      const key = deal.symbol;
      const positions = openPositions.get(key);
      if (!positions || positions.length === 0) continue;

      const entry = positions.shift()!;
      if (positions.length === 0) openPositions.delete(key);

      trades.push({
        ticket: entry.deal,
        symbol: deal.symbol,
        direction: entry.type as "buy" | "sell",
        volume: entry.volume,
        open_time: entry.time,
        close_time: deal.time,
        open_price: entry.price,
        close_price: deal.price,
        commission: deal.commission + deal.fee,
        swap: deal.swap,
        profit: deal.profit,
      });
    }
  }

  return trades;
}

function parseMt5Csv(csvText: string): Mt5Trade[] {
  const lines = parseCsvLines(csvText);
  if (lines.length < 2) return [];

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitLine(lines[0], delimiter).map((h) => h.toLowerCase());

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
    const values = splitLine(lines[i], delimiter);

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
    const limitCheck = await checkCsvImportLimit(user.id);
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: `CSV import limit reached (${limitCheck.current}/${limitCheck.limit}).`,
        usage: limitCheck,
      }, { status: 429 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to check import limit" }, { status: 500 });
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

    const firstLine = text.trim().split("\n")[0].toLowerCase();
    const isDealFormat = firstLine.includes("deal") && firstLine.includes("direction");

    const trades = isDealFormat ? parseDealLevelCsv(text) : parseMt5Csv(text);

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
      source: "csv" as const,
      mt5_ticket: t.ticket,
    }));

    try {
      const data = await sql`
        INSERT INTO trades ${sql(insertData, 'user_id', 'symbol', 'direction', 'entry_price', 'exit_price', 'lot_size', 'entry_time', 'exit_time', 'pnl', 'commission', 'swap', 'net_pnl', 'source', 'mt5_ticket')}
        RETURNING *
      `;

      await sql`
        INSERT INTO import_log (user_id, source, trades_count) VALUES (${user.id}, 'csv', ${data.length})
      `.catch(() => {});

      return NextResponse.json({
        success: true,
        imported: data.length,
        trades: data,
      });
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json(
      { error: "Failed to parse file. Make sure it's a valid MT5 export." },
      { status: 500 }
    );
  }
}
