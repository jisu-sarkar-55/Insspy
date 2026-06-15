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
});

export function WeeklyReport({ trades }: Props) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const weeklyTrades = trades.filter((t) => {
    const tradeDate = new Date(t.entry_time);
    return tradeDate >= weekAgo && tradeDate <= now;
  });

  const totalPnl = weeklyTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0);
  const winTrades = weeklyTrades.filter((t) => (t.net_pnl || 0) > 0);
  const winRate = weeklyTrades.length > 0 ? (winTrades.length / weeklyTrades.length) * 100 : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Weekly Trading Report</Text>
          <Text style={styles.subtitle}>
            {weekAgo.toLocaleDateString()} - {now.toLocaleDateString()}
          </Text>

          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 12, marginBottom: 5 }}>
              Total Trades: {weeklyTrades.length}
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 5 }}>
              Win Rate: {winRate.toFixed(1)}%
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 5 }}>
              Total P&L: ${totalPnl.toFixed(2)}
            </Text>
          </View>

          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 10 }}>
            Trade History
          </Text>

          <View style={styles.row}>
            <Text style={styles.headerCell}>Symbol</Text>
            <Text style={styles.headerCell}>Direction</Text>
            <Text style={styles.headerCell}>Entry</Text>
            <Text style={styles.headerCell}>Exit</Text>
            <Text style={styles.headerCell}>P&L</Text>
          </View>

          {weeklyTrades.map((trade) => (
            <View key={trade.id} style={styles.row}>
              <Text style={styles.cell}>{trade.symbol}</Text>
              <Text style={styles.cell}>{trade.direction.toUpperCase()}</Text>
              <Text style={styles.cell}>{trade.entry_price}</Text>
              <Text style={styles.cell}>{trade.exit_price || "—"}</Text>
              <Text
                style={[
                  styles.cell,
                  (trade.net_pnl || 0) >= 0 ? styles.positive : styles.negative,
                ]}
              >
                ${(trade.net_pnl || 0).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}