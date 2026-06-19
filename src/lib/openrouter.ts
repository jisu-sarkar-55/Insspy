import type { Trade } from "@/types";

interface RawAiInsight {
  type?: string;
  title?: string;
  action?: string;
  description?: string;
  impact?: string;
  priority?: string;
  [key: string]: unknown;
}

interface NormalizedAiInsight {
  type: "pattern" | "warning" | "suggestion" | "strength";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

function normalizeInsights(raw: unknown[]): NormalizedAiInsight[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((item) => {
    const r = item as RawAiInsight;

    let type: NormalizedAiInsight["type"] = "suggestion";
    const rawType = (r.type || "").toLowerCase();
    if (rawType.includes("pattern")) type = "pattern";
    else if (rawType.includes("warning") || rawType.includes("risk")) type = "warning";
    else if (rawType.includes("strength") || rawType.includes("positive")) type = "strength";

    const title = r.title || r.action || "Insight";

    const description = r.description || r.action || "";

    let impact: NormalizedAiInsight["impact"] = "medium";
    const rawImpact = (r.impact || r.priority || "").toLowerCase();
    if (rawImpact.includes("high") || rawImpact.includes("critical") || rawImpact.includes("1")) impact = "high";
    else if (rawImpact.includes("low") || rawImpact.includes("3")) impact = "low";

    return { type, title, description, impact };
  });
}

function normalizeRecommendations(raw: unknown[]): string[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((item) => {
    if (typeof item === "string") return item;
    if (typeof item === "object" && item !== null) {
      const obj = item as Record<string, unknown>;
      return (obj.action || obj.description || obj.title || JSON.stringify(item)) as string;
    }
    return String(item);
  });
}

export async function analyzeTrades(trades: Trade[]): Promise<{
  summary: string;
  insights: NormalizedAiInsight[];
  recommendations: string[];
}> {
  const tradeData = trades.map((t) => ({
    symbol: t.symbol,
    direction: t.direction,
    entry: t.entry_price,
    exit: t.exit_price,
    pnl: t.net_pnl,
    strategy: t.strategy,
    notes: t.notes,
    confidence: t.confidence_before,
    fear: t.fear_level,
    greed: t.greed_level,
    followed_plan: t.followed_plan,
    entry_time: t.entry_time,
  }));

  const prompt = `Analyze these trading records and provide insights:

Trades: ${JSON.stringify(tradeData.slice(-50))}

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "summary": "A brief overview of trading performance",
  "insights": [
    {
      "type": "pattern",
      "title": "Short title",
      "description": "Detailed description",
      "impact": "high"
    }
  ],
  "recommendations": [
    "First actionable recommendation",
    "Second actionable recommendation"
  ]
}

type must be one of: pattern, warning, suggestion, strength
impact must be one of: high, medium, low

Focus on:
- Win rate and profitability patterns
- Time-based patterns (when do trades perform best/worst)
- Strategy effectiveness
- Risk management observations
- Specific areas for improvement`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Trading Journal AI",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || content,
        insights: normalizeInsights(parsed.insights || []),
        recommendations: normalizeRecommendations(parsed.recommendations || []),
      };
    }

    return {
      summary: content,
      insights: [],
      recommendations: [],
    };
  } catch (error) {
    console.error("AI analysis error:", error);
    return {
      summary: "Unable to generate analysis at this time.",
      insights: [],
      recommendations: [],
    };
  }
}

export async function getTradeAdvice(
  trade: Partial<Trade>,
  recentTrades: Trade[]
): Promise<string> {
  const context = recentTrades.slice(-10).map((t) => ({
    symbol: t.symbol,
    direction: t.direction,
    pnl: t.net_pnl,
    strategy: t.strategy,
  }));

  const prompt = `Based on recent trades: ${JSON.stringify(context)}
  
New trade: ${JSON.stringify(trade)}

Provide brief advice on whether this trade aligns with the trader's patterns and any considerations.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Trading Journal AI",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No advice available.";
  } catch {
    return "Unable to generate advice at this time.";
  }
}

export async function explainLosingTrade(
  trade: Trade,
  recentTrades: Trade[],
  localContext: {
    session: string;
    consecutiveLossCount: number;
    similarEntryWinRate: number;
    possibleReasons: string[];
  }
): Promise<string> {
  const tradeSummary = {
    symbol: trade.symbol,
    direction: trade.direction,
    entry: trade.entry_price,
    exit: trade.exit_price,
    pnl: trade.net_pnl,
    strategy: trade.strategy,
    notes: trade.notes,
    confidence: trade.confidence_before,
    fear: trade.fear_level,
    greed: trade.greed_level,
    followed_plan: trade.followed_plan,
    stop_loss: trade.stop_loss,
    take_profit: trade.take_profit,
    entry_time: trade.entry_time,
    exit_time: trade.exit_time,
  };

  const recentSummary = recentTrades.slice(-10).map((t) => ({
    symbol: t.symbol,
    direction: t.direction,
    pnl: t.net_pnl,
    strategy: t.strategy,
  }));

  const prompt = `You are an experienced trading coach reviewing a losing trade. Be direct, specific, and actionable. No generic advice.

Losing Trade:
${JSON.stringify(tradeSummary)}

Recent Context:
${JSON.stringify(recentSummary)}

Local Analysis:
- Session: ${localContext.session}
- Consecutive losses before this trade: ${localContext.consecutiveLossCount}
- Win rate for similar entries: ${localContext.similarEntryWinRate}%
- Detected issues: ${localContext.possibleReasons.join("; ")}

Provide a brief, coach-like analysis (3-5 sentences max). Focus on:
1. The most likely reason for this loss
2. What the trader should do differently next time
3. One specific, actionable rule to follow

Be direct and conversational, like a coach talking to a student. No bullet points, just natural language.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Trading Journal AI Coach",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Unable to analyze this trade at this time.";
  } catch {
    return "Unable to generate AI analysis at this time.";
  }
}
