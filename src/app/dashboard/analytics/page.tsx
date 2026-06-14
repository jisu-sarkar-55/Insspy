"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EquityCurveChart } from "@/components/charts/equity-curve";
import { DailyPnlChart } from "@/components/charts/daily-pnl";
import { WinLossChart } from "@/components/charts/win-loss";
import {
  calculateDashboardStats,
  calculateDailyPnl,
  calculateMonthlyPnl,
  calculateEquityCurve,
  calculateStrategyStats,
} from "@/lib/calculations";
import type { Trade } from "@/types";

export default function AnalyticsPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTrades() {
      const { data } = await supabase
        .from("trades")
        .select("*")
        .order("entry_time", { ascending: false });

      if (data) {
        setTrades(data);
      }
      setLoading(false);
    }

    fetchTrades();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Loading analytics...</div>
      </div>
    );
  }

  const stats = calculateDashboardStats(trades);
  const dailyPnl = calculateDailyPnl(trades);
  const monthlyPnl = calculateMonthlyPnl(trades);
  const equityCurve = calculateEquityCurve(trades, 10000);
  const strategyStats = calculateStrategyStats(trades);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-zinc-400 mt-1">
          Deep dive into your trading performance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Equity Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <EquityCurveChart data={equityCurve} />
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Daily P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyPnlChart data={dailyPnl} />
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Win/Loss Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <WinLossChart
              wins={stats.totalWinningTrades}
              losses={stats.totalLosingTrades}
            />
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyPnl.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-zinc-400">
                No monthly data available
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-auto">
                {monthlyPnl.map((month) => (
                  <div
                    key={month.month}
                    className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg"
                  >
                    <span className="text-white">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-zinc-400 text-sm">
                        {month.trades} trades
                      </span>
                      <span
                        className={`font-medium ${
                          month.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        ${month.pnl.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {strategyStats.length > 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Strategy Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-400">Strategy</TableHead>
                  <TableHead className="text-zinc-400">Trades</TableHead>
                  <TableHead className="text-zinc-400">Win Rate</TableHead>
                  <TableHead className="text-zinc-400">Net P&L</TableHead>
                  <TableHead className="text-zinc-400">Avg R:R</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {strategyStats.map((stat) => (
                  <TableRow key={stat.strategy} className="border-zinc-800">
                    <TableCell className="font-medium text-white">
                      {stat.strategy}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {stat.totalTrades}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {stat.winRate.toFixed(1)}%
                    </TableCell>
                    <TableCell
                      className={
                        stat.netPnl >= 0 ? "text-emerald-400" : "text-red-400"
                      }
                    >
                      ${stat.netPnl.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {stat.averageRR.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
