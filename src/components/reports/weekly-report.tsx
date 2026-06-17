import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Trade } from "@/types";
import { calculateSessionStats } from "@/lib/calculations";

interface Props {
  trades: Trade[];
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Helvetica",
  },
  coverSection: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
  },
  coverTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
  },
  coverSubtitle: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 20,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: "#10b981",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  statBox: {
    width: "25%",
    padding: 8,
  },
  statLabel: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    paddingVertical: 6,
  },
  cell: {
    flex: 1,
    fontSize: 9,
  },
  headerCell: {
    flex: 1,
    fontSize: 9,
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    padding: 6,
  },
  positive: { color: "#10b981" },
  negative: { color: "#ef4444" },
  muted: { color: "#999999" },
  summaryCard: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#f0fdf4",
    borderRadius: 4,
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#999999",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    paddingTop: 8,
  },
});

function formatCurrency(val: number): string {
  return `$${val.toFixed(2)}`;
}

function formatPct(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function WeeklyReport({ trades }: Props) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const weeklyTrades = trades.filter((t) => {
    const d = new Date(t.entry_time);
    return d >= weekAgo && d <= now;
  });

  const priorWeekTrades = trades.filter((t) => {
    const d = new Date(t.entry_time);
    return d >= twoWeeksAgo && d < weekAgo;
  });

  const closed = weeklyTrades.filter((t) => t.net_pnl !== null);
  const priorClosed = priorWeekTrades.filter((t) => t.net_pnl !== null);

  const totalPnl = closed.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const winners = closed.filter((t) => (t.net_pnl || 0) > 0);
  const losers = closed.filter((t) => (t.net_pnl || 0) < 0);
  const winRate = closed.length > 0 ? (winners.length / closed.length) * 100 : 0;

  const grossProfit = winners.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const grossLoss = Math.abs(losers.reduce((s, t) => s + (t.net_pnl || 0), 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

  const prevTotalPnl = priorClosed.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const weekOverWeek = priorClosed.length > 0 ? totalPnl - prevTotalPnl : 0;

  const dayMap = new Map<string, Trade[]>();
  closed.forEach((t) => {
    const date = t.entry_time.split("T")[0];
    const arr = dayMap.get(date) || [];
    arr.push(t);
    dayMap.set(date, arr);
  });

  const sortedDays = Array.from(dayMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const daySummaries = sortedDays.map(([date, dayTrades]) => {
    const dayPnl = dayTrades.reduce((s, t) => s + (t.net_pnl || 0), 0);
    const dayWins = dayTrades.filter((t) => (t.net_pnl || 0) > 0);
    return { date, trades: dayTrades.length, pnl: dayPnl, winRate: (dayWins.length / dayTrades.length) * 100 };
  });

  const bestDay = daySummaries.length > 0 ? daySummaries.reduce((a, b) => a.pnl > b.pnl ? a : b) : null;
  const worstDay = daySummaries.length > 0 ? daySummaries.reduce((a, b) => a.pnl < b.pnl ? a : b) : null;

  const sessionStats = calculateSessionStats(closed);

  const symbolMap = new Map<string, Trade[]>();
  closed.forEach((t) => {
    const arr = symbolMap.get(t.symbol) || [];
    arr.push(t);
    symbolMap.set(t.symbol, arr);
  });
  const topSymbol = Array.from(symbolMap.entries())
    .map(([symbol, arr]) => ({ symbol, pnl: arr.reduce((s, t) => s + (t.net_pnl || 0), 0), trades: arr.length }))
    .sort((a, b) => b.pnl - a.pnl)[0] || null;

  const generatedAt = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View wrap={false} style={styles.coverSection}>
          <Text style={styles.coverTitle}>Weekly Trading Report</Text>
          <Text style={styles.coverSubtitle}>
            {weekAgo.toLocaleDateString()} — {now.toLocaleDateString()}
          </Text>
          <Text style={{ fontSize: 10, color: "#666666", marginTop: 4 }}>
            {closed.length} trades · {formatCurrency(totalPnl)} net P&L · {formatPct(winRate)} win rate
          </Text>
          {priorClosed.length > 0 && (
            <Text style={[{ fontSize: 10, marginTop: 2 }, weekOverWeek >= 0 ? styles.positive : styles.negative]}>
              vs prior week: {weekOverWeek >= 0 ? "+" : ""}{formatCurrency(weekOverWeek)}
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Performance Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Trades</Text>
            <Text style={styles.statValue}>{closed.length}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Win Rate</Text>
            <Text style={styles.statValue}>{formatPct(winRate)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total P&L</Text>
            <Text style={[styles.statValue, totalPnl >= 0 ? styles.positive : styles.negative]}>
              {formatCurrency(totalPnl)}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Profit Factor</Text>
            <Text style={styles.statValue}>
              {profitFactor === Infinity ? "∞" : profitFactor.toFixed(2)}
            </Text>
          </View>
        </View>

        {daySummaries.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Daily Breakdown</Text>
            <View style={styles.row}>
              <Text style={styles.headerCell}>Date</Text>
              <Text style={styles.headerCell}>Trades</Text>
              <Text style={styles.headerCell}>Win Rate</Text>
              <Text style={styles.headerCell}>P&L</Text>
            </View>
            {daySummaries.map((day) => (
              <View key={day.date} style={styles.row}>
                <Text style={styles.cell}>{day.date}</Text>
                <Text style={styles.cell}>{day.trades}</Text>
                <Text style={styles.cell}>{formatPct(day.winRate)}</Text>
                <Text style={[styles.cell, day.pnl >= 0 ? styles.positive : styles.negative]}>
                  {formatCurrency(day.pnl)}
                </Text>
              </View>
            ))}
          </>
        )}

        {bestDay && worstDay && (
          <View style={{ marginTop: 8, marginBottom: 12 }}>
            <View style={styles.summaryCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryLabel}>Best Day</Text>
                <Text style={[styles.summaryValue, styles.positive]}>
                  {bestDay.date} ({formatCurrency(bestDay.pnl)})
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryLabel}>Worst Day</Text>
                <Text style={[styles.summaryValue, styles.negative]}>
                  {worstDay.date} ({formatCurrency(worstDay.pnl)})
                </Text>
              </View>
            </View>
          </View>
        )}

        {sessionStats.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Session Breakdown</Text>
            <View style={styles.row}>
              <Text style={styles.headerCell}>Session</Text>
              <Text style={styles.headerCell}>Trades</Text>
              <Text style={styles.headerCell}>Win Rate</Text>
              <Text style={styles.headerCell}>P&L</Text>
            </View>
            {sessionStats.map((s) => (
              <View key={s.session} style={styles.row}>
                <Text style={styles.cell}>{s.session}</Text>
                <Text style={styles.cell}>{s.trades}</Text>
                <Text style={styles.cell}>{formatPct(s.winRate)}</Text>
                <Text style={[styles.cell, s.pnl >= 0 ? styles.positive : styles.negative]}>
                  {formatCurrency(s.pnl)}
                </Text>
              </View>
            ))}
          </>
        )}

        {topSymbol && (
          <>
            <Text style={styles.sectionTitle}>Top Symbol</Text>
            <View style={styles.row}>
              <Text style={styles.headerCell}>Symbol</Text>
              <Text style={styles.headerCell}>Trades</Text>
              <Text style={styles.headerCell}>P&L</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cell}>{topSymbol.symbol}</Text>
              <Text style={styles.cell}>{topSymbol.trades}</Text>
              <Text style={[styles.cell, topSymbol.pnl >= 0 ? styles.positive : styles.negative]}>
                {formatCurrency(topSymbol.pnl)}
              </Text>
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Trade History</Text>
        <View style={styles.row}>
          <Text style={styles.headerCell}>Symbol</Text>
          <Text style={styles.headerCell}>Direction</Text>
          <Text style={styles.headerCell}>Entry</Text>
          <Text style={styles.headerCell}>Exit</Text>
          <Text style={styles.headerCell}>P&L</Text>
        </View>
        {closed.map((trade) => (
          <View key={trade.id} style={styles.row}>
            <Text style={styles.cell}>{trade.symbol}</Text>
            <Text style={styles.cell}>{trade.direction.toUpperCase()}</Text>
            <Text style={styles.cell}>{trade.entry_price}</Text>
            <Text style={styles.cell}>{trade.exit_price || "—"}</Text>
            <Text style={[styles.cell, (trade.net_pnl || 0) >= 0 ? styles.positive : styles.negative]}>
              {formatCurrency(trade.net_pnl || 0)}
            </Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text>Generated: {generatedAt}</Text>
          <Text>Page 1</Text>
        </View>
      </Page>
    </Document>
  );
}
