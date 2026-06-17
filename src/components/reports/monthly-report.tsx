import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Trade } from "@/types";
import {
  calculateEquityCurve,
  calculateSessionStats,
  calculateDayOfWeekStats,
  calculateDrawdownAnalysis,
  calculateSymbolStats,
} from "@/lib/calculations";

const STARTING_BALANCE = 10000;

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
  if (val === Infinity) return "∞";
  if (val === -Infinity) return "-∞";
  return `$${val.toFixed(2)}`;
}

function formatPct(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function MonthlyReport({ trades }: Props) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const monthlyTrades = trades.filter((t) => {
    const d = new Date(t.entry_time);
    return d >= monthStart && d <= now;
  });

  const prevMonthTrades = trades.filter((t) => {
    const d = new Date(t.entry_time);
    return d >= prevMonthStart && d <= prevMonthEnd;
  });

  const closed = monthlyTrades.filter((t) => t.net_pnl !== null);
  const prevClosed = prevMonthTrades.filter((t) => t.net_pnl !== null);

  const totalPnl = closed.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const winners = closed.filter((t) => (t.net_pnl || 0) > 0);
  const losers = closed.filter((t) => (t.net_pnl || 0) < 0);
  const winRate = closed.length > 0 ? (winners.length / closed.length) * 100 : 0;

  const grossProfit = winners.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const grossLoss = Math.abs(losers.reduce((s, t) => s + (t.net_pnl || 0), 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

  const avgWin = winners.length > 0 ? grossProfit / winners.length : 0;
  const avgLoss = losers.length > 0 ? -(grossLoss / losers.length) : 0;

  const equityCurve = calculateEquityCurve(closed, STARTING_BALANCE);
  const sessionStats = calculateSessionStats(closed);
  const dayStats = calculateDayOfWeekStats(closed);
  const drawdown = calculateDrawdownAnalysis(closed, STARTING_BALANCE);
  const symbolStats = calculateSymbolStats(closed);

  const bestSymbol = symbolStats.length > 0 ? symbolStats.reduce((a, b) => a.pnl > b.pnl ? a : b) : null;
  const worstSymbol = symbolStats.length > 0 ? symbolStats.reduce((a, b) => a.pnl < b.pnl ? a : b) : null;

  const prevTotalPnl = prevClosed.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const momDelta = prevClosed.length > 0 ? totalPnl - prevTotalPnl : 0;

  const generatedAt = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });

  const equityStart = equityCurve.length > 0 ? equityCurve[0].equity : STARTING_BALANCE;
  const equityEnd = equityCurve.length > 0 ? equityCurve[equityCurve.length - 1].equity : STARTING_BALANCE;
  const netChange = equityEnd - equityStart;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View wrap={false} style={styles.coverSection}>
          <Text style={styles.coverTitle}>Monthly Trading Report</Text>
          <Text style={styles.coverSubtitle}>{monthLabel}</Text>
          <Text style={{ fontSize: 10, color: "#666666", marginTop: 4 }}>
            {closed.length} trades · {formatCurrency(totalPnl)} net P&L · {formatPct(winRate)} win rate · PF {profitFactor === Infinity ? "∞" : profitFactor.toFixed(2)}
          </Text>
          {prevClosed.length > 0 && (
            <Text style={[styles.coverSubtitle, momDelta >= 0 ? styles.positive : styles.negative, { marginTop: 2 }]}>
              vs previous month: {formatCurrency(momDelta)}
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
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Avg Win</Text>
            <Text style={styles.statValue}>{formatCurrency(avgWin)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Avg Loss</Text>
            <Text style={styles.statValue}>{formatCurrency(avgLoss)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Max Drawdown</Text>
            <Text style={[styles.statValue, styles.negative]}>
              {formatCurrency(drawdown.maxDrawdown)} ({formatPct(drawdown.maxDrawdownPct)})
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Expectancy</Text>
            <Text style={styles.statValue}>
              {closed.length > 0 ? formatCurrency(totalPnl / closed.length) : "$0.00"}
            </Text>
          </View>
        </View>

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

        {dayStats.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Day of Week Breakdown</Text>
            <View style={styles.row}>
              <Text style={styles.headerCell}>Day</Text>
              <Text style={styles.headerCell}>Trades</Text>
              <Text style={styles.headerCell}>Win Rate</Text>
              <Text style={styles.headerCell}>P&L</Text>
            </View>
            {dayStats.map((d) => (
              <View key={d.day} style={styles.row}>
                <Text style={styles.cell}>{d.day}</Text>
                <Text style={styles.cell}>{d.trades}</Text>
                <Text style={styles.cell}>{formatPct(d.winRate)}</Text>
                <Text style={[styles.cell, d.pnl >= 0 ? styles.positive : styles.negative]}>
                  {formatCurrency(d.pnl)}
                </Text>
              </View>
            ))}
          </>
        )}

        <Text style={styles.sectionTitle}>Symbol Performance</Text>
        <View style={styles.row}>
          <Text style={styles.headerCell}>Symbol</Text>
          <Text style={styles.headerCell}>Trades</Text>
          <Text style={styles.headerCell}>Win Rate</Text>
          <Text style={styles.headerCell}>P&L</Text>
          <Text style={styles.headerCell}>PF</Text>
        </View>
        {symbolStats.map((stat) => (
          <View key={stat.symbol} style={styles.row}>
            <Text style={styles.cell}>{stat.symbol}</Text>
            <Text style={styles.cell}>{stat.trades}</Text>
            <Text style={styles.cell}>{formatPct(stat.winRate)}</Text>
            <Text style={[styles.cell, stat.pnl >= 0 ? styles.positive : styles.negative]}>
              {formatCurrency(stat.pnl)}
            </Text>
            <Text style={styles.cell}>
              {stat.profitFactor === Infinity ? "∞" : stat.profitFactor.toFixed(2)}
            </Text>
          </View>
        ))}

        {bestSymbol && worstSymbol && (
          <View style={{ marginTop: 12 }}>
            <View style={styles.summaryCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryLabel}>Best Symbol</Text>
                <Text style={[styles.summaryValue, styles.positive]}>
                  {bestSymbol.symbol} ({formatCurrency(bestSymbol.pnl)})
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryLabel}>Worst Symbol</Text>
                <Text style={[styles.summaryValue, styles.negative]}>
                  {worstSymbol.symbol} ({formatCurrency(worstSymbol.pnl)})
                </Text>
              </View>
            </View>
          </View>
        )}

        {equityCurve.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Equity Progress</Text>
            <Text style={{ fontSize: 9, color: "#666666", marginBottom: 8 }}>
              Start: {formatCurrency(equityStart)} → End: {formatCurrency(equityEnd)} ({netChange >= 0 ? "+" : ""}{formatCurrency(netChange)})
            </Text>
            <View style={styles.row}>
              <Text style={styles.headerCell}>Date</Text>
              <Text style={styles.headerCell}>Daily P&L</Text>
              <Text style={styles.headerCell}>Equity</Text>
              <Text style={styles.headerCell}>Drawdown</Text>
            </View>
            {equityCurve.map((pt) => {
              const dd = drawdown.curve.find(c => c.date === pt.date);
              return (
                <View key={pt.date} style={styles.row}>
                  <Text style={styles.cell}>{pt.date}</Text>
                  <Text style={[styles.cell, (pt.equity - STARTING_BALANCE) >= 0 ? styles.positive : styles.negative]}>
                    {formatCurrency(pt.equity - STARTING_BALANCE)}
                  </Text>
                  <Text style={styles.cell}>{formatCurrency(pt.equity)}</Text>
                  <Text style={[styles.cell, styles.muted]}>
                    {formatCurrency(dd?.drawdown || 0)}
                  </Text>
                </View>
              );
            })}
          </>
        )}

        <View style={styles.footer}>
          <Text>Generated: {generatedAt}</Text>
          <Text>Page 1</Text>
        </View>
      </Page>
    </Document>
  );
}
