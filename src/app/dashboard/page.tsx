"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart3,
  Calendar,
} from "lucide-react";
import type { Trade, DashboardStats } from "@/types";
import { calculateDashboardStats } from "@/lib/calculations";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTrades() {
      const { data: trades } = await supabase
        .from("trades")
        .select("*")
        .order("entry_time", { ascending: false });

      if (trades) {
        setStats(calculateDashboardStats(trades));
      }
      setLoading(false);
    }

    fetchTrades();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome to Trading Journal
        </h2>
        <p className="text-zinc-400">
          Start by adding your first trade to see your analytics.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Trades",
      value: stats.totalTrades,
      icon: BarChart3,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "Win Rate",
      value: `${stats.winRate.toFixed(1)}%`,
      icon: Target,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      title: "Net P&L",
      value: `$${stats.netPnl.toFixed(2)}`,
      icon: DollarSign,
      color: stats.netPnl >= 0 ? "text-emerald-400" : "text-red-400",
      bgColor: stats.netPnl >= 0 ? "bg-emerald-400/10" : "bg-red-400/10",
    },
    {
      title: "Profit Factor",
      value: stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2),
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      title: "Average Win",
      value: `$${stats.averageWin.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      title: "Average Loss",
      value: `$${stats.averageLoss.toFixed(2)}`,
      icon: TrendingDown,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
    },
    {
      title: "Best Day",
      value: `$${stats.bestDay.toFixed(2)}`,
      icon: Calendar,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      title: "Worst Day",
      value: `$${stats.worstDay.toFixed(2)}`,
      icon: Calendar,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">
          Your trading performance at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Win/Loss Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400">
                  {stats.totalWinningTrades}
                </div>
                <div className="text-sm text-zinc-400">Winning Trades</div>
              </div>
              <div className="text-4xl font-bold text-zinc-600">/</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400">
                  {stats.totalLosingTrades}
                </div>
                <div className="text-sm text-zinc-400">Losing Trades</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/dashboard/trades/new"
              className="block w-full p-3 text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              + Add New Trade
            </a>
            <a
              href="/dashboard/analytics"
              className="block w-full p-3 text-center bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              View Detailed Analytics
            </a>
            <a
              href="/dashboard/ai-insights"
              className="block w-full p-3 text-center bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Get AI Insights
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
