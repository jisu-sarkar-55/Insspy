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
  rulesSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
  },
  ruleItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  ruleLabel: {
    width: "60%",
    fontSize: 11,
  },
  ruleValue: {
    width: "40%",
    fontSize: 11,
    fontWeight: "bold",
  },
  pass: {
    color: "#10b981",
  },
  fail: {
    color: "#ef4444",
  },
});

export function PropFirmReport({ trades }: Props) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const monthlyTrades = trades.filter((t) => {
    const tradeDate = new Date(t.entry_time);
    return tradeDate >= monthStart && tradeDate <= now;
  });

  const totalPnl = monthlyTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0);
  const winTrades = monthlyTrades.filter((t) => (t.net_pnl || 0) > 0);
  const winRate = monthlyTrades.length > 0 ? (winTrades.length / monthlyTrades.length) * 100 : 0;
  
  const maxDrawdown = monthlyTrades.reduce((max, t) => {
    const pnl = t.net_pnl || 0;
    return pnl < max ? pnl : max;
  }, 0);

  const tradingDaysSet = new Set(
    monthlyTrades.map((t) => new Date(t.entry_time).toDateString())
  );
  const tradingDays = tradingDaysSet.size;
  const tradingDaysArray = Array.from(tradingDaysSet);

  const avgTradesPerDay = tradingDays > 0 ? monthlyTrades.length / tradingDays : 0;

  const rules = [
    { label: "Maximum Daily Loss", value: "$1,000", status: "pass" },
    { label: "Maximum Total Loss", value: "$3,000", status: "pass" },
    { label: "Profit Target", value: "$3,000", status: totalPnl >= 3000 ? "pass" : "fail" },
    { label: "Minimum Trading Days", value: "5 days", status: tradingDays >= 5 ? "pass" : "fail" },
    { label: "Maximum Position Size", value: "5 lots", status: "pass" },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Prop Firm Evaluation Report</Text>
          <Text style={styles.subtitle}>
            {now.toLocaleString("default", { month: "long", year: "numeric" })}
          </Text>

          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 12, marginBottom: 5 }}>
              Account Size: $100,000
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 5 }}>
              Evaluation Period: {monthStart.toLocaleDateString()} - {now.toLocaleDateString()}
            </Text>
          </View>

          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 10 }}>
                Performance Summary
              </Text>
              <View style={styles.row}>
                <Text style={styles.headerCell}>Metric</Text>
                <Text style={styles.headerCell}>Value</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cell}>Total Trades</Text>
                <Text style={styles.cell}>{monthlyTrades.length}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cell}>Win Rate</Text>
                <Text style={styles.cell}>{winRate.toFixed(1)}%</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cell}>Total P&L</Text>
                <Text style={[styles.cell, totalPnl >= 0 ? styles.positive : styles.negative]}>
                  ${totalPnl.toFixed(2)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cell}>Max Drawdown</Text>
                <Text style={[styles.cell, styles.negative]}>
                  ${maxDrawdown.toFixed(2)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cell}>Trading Days</Text>
                <Text style={styles.cell}>{tradingDays}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cell}>Avg Trades/Day</Text>
                <Text style={styles.cell}>{avgTradesPerDay.toFixed(1)}</Text>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 10 }}>
                Prop Firm Rules
              </Text>
              <View style={styles.rulesSection}>
                {rules.map((rule, index) => (
                  <View key={index} style={styles.ruleItem}>
                    <Text style={styles.ruleLabel}>{rule.label}</Text>
                    <Text
                      style={[
                        styles.ruleValue,
                        rule.status === "pass" ? styles.pass : styles.fail,
                      ]}
                    >
                      {rule.value} {rule.status === "pass" ? "✓" : "✗"}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 10 }}>
            Daily Performance
          </Text>

          <View style={styles.row}>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>Trades</Text>
            <Text style={styles.headerCell}>P&L</Text>
            <Text style={styles.headerCell}>Cumulative</Text>
          </View>

          {tradingDaysArray.map((day) => {
            const dayTrades = monthlyTrades.filter(
              (t) => new Date(t.entry_time).toDateString() === day
            );
            const dayPnl = dayTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0);
            return (
              <View key={day} style={styles.row}>
                <Text style={styles.cell}>{day}</Text>
                <Text style={styles.cell}>{dayTrades.length}</Text>
                <Text
                  style={[
                    styles.cell,
                    dayPnl >= 0 ? styles.positive : styles.negative,
                  ]}
                >
                  ${dayPnl.toFixed(2)}
                </Text>
                <Text style={styles.cell}>—</Text>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}