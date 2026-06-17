import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Trade } from "@/types";
import { calculateDrawdownAnalysis } from "@/lib/calculations";

interface Props {
  trades: Trade[];
}

const ACCOUNT_SIZE = 100000;
const DAILY_LOSS_LIMIT = 1000;
const MAX_TOTAL_LOSS = 3000;
const PROFIT_TARGET = 3000;
const MIN_TRADING_DAYS = 5;
const MAX_POSITION_SIZE = 5;

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
    backgroundColor: "#f0fdf4",
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
  rulesSection: {
    marginTop: 16,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
  },
  ruleItem: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
  },
  ruleLabel: {
    width: "50%",
    fontSize: 10,
  },
  ruleValue: {
    width: "25%",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  ruleStatus: {
    width: "25%",
    fontSize: 10,
    textAlign: "right",
  },
  pass: { color: "#10b981" },
  fail: { color: "#ef4444" },
  barOuter: {
    height: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
    marginTop: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  barInner: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 5,
  },
  barLabel: {
    fontSize: 9,
    color: "#666666",
    textAlign: "center",
    marginBottom: 4,
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

interface DaySummary {
  date: string;
  trades: number;
  pnl: number;
  cumulative: number;
}

export function PropFirmReport({ trades }: Props) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyTrades = trades.filter((t) => {
    const d = new Date(t.entry_time);
    return d >= monthStart && d <= now;
  });

  const closed = monthlyTrades.filter((t) => t.net_pnl !== null);
  const sorted = [...closed].sort((a, b) => a.entry_time.localeCompare(b.entry_time));

  const totalPnl = sorted.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const winTrades = sorted.filter((t) => (t.net_pnl || 0) > 0);
  const winRate = sorted.length > 0 ? (winTrades.length / sorted.length) * 100 : 0;

  const drawdown = calculateDrawdownAnalysis(sorted, ACCOUNT_SIZE);

  const dayMap = new Map<string, Trade[]>();
  sorted.forEach((t) => {
    const date = t.entry_time.split("T")[0];
    const arr = dayMap.get(date) || [];
    arr.push(t);
    dayMap.set(date, arr);
  });

  const sortedDays = Array.from(dayMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const daySummaries: DaySummary[] = sortedDays.reduce<DaySummary[]>((acc, [date, dayTrades]) => {
    const dayPnl = dayTrades.reduce((s, t) => s + (t.net_pnl || 0), 0);
    const prev = acc.length > 0 ? acc[acc.length - 1].cumulative : ACCOUNT_SIZE;
    acc.push({ date, trades: dayTrades.length, pnl: dayPnl, cumulative: prev + dayPnl });
    return acc;
  }, []);

  const tradingDaysCount = sortedDays.length;

  const dailyPnlValues = daySummaries.map((d) => d.pnl);
  const maxDailyLoss = Math.min(...dailyPnlValues);
  const maxIndividualLoss = Math.min(...sorted.map((t) => t.net_pnl || 0));
  const maxLotSize = Math.max(...sorted.map((t) => t.lot_size || 0));

  const minEquity = Math.min(...daySummaries.map((d) => d.cumulative), ACCOUNT_SIZE);
  const maxTotalDrawdown = minEquity < ACCOUNT_SIZE ? ACCOUNT_SIZE - minEquity : 0;

  const profitTargetProgress = Math.min(100, (totalPnl / PROFIT_TARGET) * 100);

  const rules = [
    {
      label: "Maximum Daily Loss",
      value: `-$${DAILY_LOSS_LIMIT.toLocaleString()}`,
      actual: formatCurrency(maxDailyLoss),
      status: maxDailyLoss >= -DAILY_LOSS_LIMIT ? "pass" : "fail",
    },
    {
      label: "Maximum Total Loss",
      value: `-$${MAX_TOTAL_LOSS.toLocaleString()}`,
      actual: formatCurrency(-maxTotalDrawdown),
      status: maxTotalDrawdown <= MAX_TOTAL_LOSS ? "pass" : "fail",
    },
    {
      label: "Profit Target",
      value: `$${PROFIT_TARGET.toLocaleString()}`,
      actual: formatCurrency(totalPnl),
      status: totalPnl >= PROFIT_TARGET ? "pass" : "fail",
    },
    {
      label: "Minimum Trading Days",
      value: `${MIN_TRADING_DAYS} days`,
      actual: `${tradingDaysCount} days`,
      status: tradingDaysCount >= MIN_TRADING_DAYS ? "pass" : "fail",
    },
    {
      label: "Maximum Position Size",
      value: `${MAX_POSITION_SIZE} lots`,
      actual: `${maxLotSize.toFixed(2)} lots`,
      status: maxLotSize <= MAX_POSITION_SIZE ? "pass" : "fail",
    },
  ];

  const passedCount = rules.filter((r) => r.status === "pass").length;
  const allPassed = passedCount === rules.length;

  const generatedAt = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View wrap={false} style={styles.coverSection}>
          <Text style={styles.coverTitle}>Prop Firm Evaluation Report</Text>
          <Text style={styles.coverSubtitle}>{monthLabel}</Text>
          <Text style={{ fontSize: 10, color: "#666666", marginTop: 4 }}>
            Account: ${ACCOUNT_SIZE.toLocaleString()} · {sorted.length} trades · {formatCurrency(totalPnl)} net P&L
          </Text>
          <Text style={{ fontSize: 10, marginTop: 2, color: allPassed ? "#10b981" : "#ef4444" }}>
            Rules: {passedCount}/{rules.length} passed {allPassed ? "✓" : "✗"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Performance Summary</Text>
        <View style={styles.row}>
          <Text style={styles.headerCell}>Metric</Text>
          <Text style={styles.headerCell}>Value</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Total Trades</Text>
          <Text style={styles.cell}>{sorted.length}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Win Rate</Text>
          <Text style={styles.cell}>{formatPct(winRate)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Total P&L</Text>
          <Text style={[styles.cell, totalPnl >= 0 ? styles.positive : styles.negative]}>
            {formatCurrency(totalPnl)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Max Drawdown (peak-to-trough)</Text>
          <Text style={[styles.cell, styles.negative]}>
            {formatCurrency(drawdown.maxDrawdown)} ({formatPct(drawdown.maxDrawdownPct)})
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Trading Days</Text>
          <Text style={styles.cell}>{tradingDaysCount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Avg Trades/Day</Text>
          <Text style={styles.cell}>
            {tradingDaysCount > 0 ? (sorted.length / tradingDaysCount).toFixed(1) : "0"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Max Lot Size</Text>
          <Text style={styles.cell}>{maxLotSize.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Worst Single Trade</Text>
          <Text style={[styles.cell, styles.negative]}>
            {formatCurrency(maxIndividualLoss)}
          </Text>
        </View>

        <View style={styles.rulesSection}>
          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 12 }}>
            Prop Firm Rules Checklist
          </Text>
          {rules.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <Text style={styles.ruleLabel}>{rule.label}</Text>
              <Text style={styles.ruleValue}>{rule.value}</Text>
              <Text
                style={[
                  styles.ruleStatus,
                  rule.status === "pass" ? styles.pass : styles.fail,
                ]}
              >
                {rule.status === "pass" ? "✓ Pass" : "✗ Fail"}
                {" ("}{rule.actual}{")"}
              </Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 11, color: "#666666", marginTop: 12, marginBottom: 4 }}>
          Profit Target Progress: {formatCurrency(totalPnl)} / {formatCurrency(PROFIT_TARGET)}
        </Text>
        <View style={styles.barOuter}>
          <View
            style={[
              styles.barInner,
              { width: `${Math.min(100, profitTargetProgress)}%` },
            ]}
          />
        </View>
        <Text style={styles.barLabel}>
          {profitTargetProgress.toFixed(0)}% of target
        </Text>

        {daySummaries.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Daily Performance</Text>
            <View style={styles.row}>
              <Text style={styles.headerCell}>Date</Text>
              <Text style={styles.headerCell}>Trades</Text>
              <Text style={styles.headerCell}>P&L</Text>
              <Text style={styles.headerCell}>Cumulative</Text>
            </View>
            {daySummaries.map((day) => (
              <View key={day.date} style={styles.row}>
                <Text style={styles.cell}>{day.date}</Text>
                <Text style={styles.cell}>{day.trades}</Text>
                <Text
                  style={[
                    styles.cell,
                    day.pnl >= 0 ? styles.positive : styles.negative,
                  ]}
                >
                  {formatCurrency(day.pnl)}
                </Text>
                <Text
                  style={[
                    styles.cell,
                    day.cumulative >= ACCOUNT_SIZE ? styles.positive : styles.negative,
                  ]}
                >
                  {formatCurrency(day.cumulative)}
                </Text>
              </View>
            ))}
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
