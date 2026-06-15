import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Trade } from "@/types";

interface Props {
  trades: Trade[];
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
    color: "#666666",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    fontSize: 10,
  },
  headerCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    padding: 8,
  },
  positive: {
    color: "#10b981",
  },
  negative: {
    color: "#ef4444",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  statBox: {
    width: "33%",
    padding: 10,
    boxSizing: "border-box",
  },
  statLabel: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export function MonthlyReport({ trades }: Props) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const monthlyTrades = trades.filter((t) => {
    const tradeDate = new Date(t.entry_time);
    return tradeDate >= monthStart && tradeDate <= now;
  });

  const totalPnl = monthlyTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0);
  const winTrades = monthlyTrades.filter((t) => (t.net_pnl || 0) > 0);
  const lossTrades = monthlyTrades.filter((t) => (t.net_pnl || 0) < 0);
  const winRate = monthlyTrades.length > 0 ? (winTrades.length / monthlyTrades.length) * 100 : 0;
  
  const avgWin = winTrades.length > 0 
    ? winTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0) / winTrades.length 
    : 0;
  const avgLoss = lossTrades.length > 0 
    ? lossTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0) / lossTrades.length 
    : 0;
  
  const profitFactor = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 0;

  const symbols = [...new Set(monthlyTrades.map((t) => t.symbol))];
  const symbolStats = symbols.map((symbol) => {
    const symbolTrades = monthlyTrades.filter((t) => t.symbol === symbol);
    const symbolPnl = symbolTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0);
    return { symbol, trades: symbolTrades.length, pnl: symbolPnl };
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Monthly Trading Report</Text>
          <Text style={styles.subtitle}>
            {now.toLocaleString("default", { month: "long", year: "numeric" })}
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Trades</Text>
              <Text style={styles.statValue}>{monthlyTrades.length}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Win Rate</Text>
              <Text style={styles.statValue}>{winRate.toFixed(1)}%</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total P&L</Text>
              <Text style={styles.statValue}>${totalPnl.toFixed(2)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Profit Factor</Text>
              <Text style={styles.statValue}>{profitFactor.toFixed(2)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Avg Win</Text>
              <Text style={styles.statValue}>${avgWin.toFixed(2)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Avg Loss</Text>
              <Text style={styles.statValue}>${avgLoss.toFixed(2)}</Text>
            </View>
          </View>

          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 10 }}>
            Symbol Performance
          </Text>

          <View style={styles.row}>
            <Text style={styles.headerCell}>Symbol</Text>
            <Text style={styles.headerCell}>Trades</Text>
            <Text style={styles.headerCell}>P&L</Text>
          </View>

          {symbolStats.map((stat) => (
            <View key={stat.symbol} style={styles.row}>
              <Text style={styles.cell}>{stat.symbol}</Text>
              <Text style={styles.cell}>{stat.trades}</Text>
              <Text
                style={[
                  styles.cell,
                  stat.pnl >= 0 ? styles.positive : styles.negative,
                ]}
              >
                ${stat.pnl.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}