"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, AlertTriangle, Lightbulb, TrendingUp, Loader2 } from "lucide-react";

interface AiInsight {
  type: "pattern" | "warning" | "suggestion" | "strength";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

interface AiAnalysis {
  summary: string;
  insights: AiInsight[];
  recommendations: string[];
}

export default function AiInsightsPage() {
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState("50");
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: parseInt(limit) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze trades");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const getInsightIcon = (type: AiInsight["type"]) => {
    switch (type) {
      case "pattern":
        return <TrendingUp className="h-5 w-5 text-blue-400" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case "suggestion":
        return <Lightbulb className="h-5 w-5 text-purple-400" />;
      case "strength":
        return <TrendingUp className="h-5 w-5 text-emerald-400" />;
    }
  };

  const getImpactBadge = (impact: AiInsight["impact"]) => {
    switch (impact) {
      case "high":
        return <Badge className="bg-red-600/20 text-red-400">High Impact</Badge>;
      case "medium":
        return <Badge className="bg-yellow-600/20 text-yellow-400">Medium</Badge>;
      case "low":
        return <Badge className="bg-zinc-600/20 text-zinc-400">Low</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Insights</h1>
        <p className="text-zinc-400 mt-1">
          Let AI analyze your trading patterns and provide actionable insights
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-emerald-400" />
            Trade Analysis
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Select how many recent trades to analyze
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={limit} onValueChange={(value) => value && setLimit(value)}>
              <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="20">Last 20 Trades</SelectItem>
                <SelectItem value="50">Last 50 Trades</SelectItem>
                <SelectItem value="100">Last 100 Trades</SelectItem>
                <SelectItem value="200">Last 200 Trades</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Trades
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 leading-relaxed">{analysis.summary}</p>
            </CardContent>
          </Card>

          {analysis.insights.length > 0 && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.insights.map((insight, index) => {
                  const title = typeof insight.title === "string" ? insight.title : "Insight";
                  const description = typeof insight.description === "string" ? insight.description : "";
                  const type = typeof insight.type === "string" ? insight.type : "suggestion";
                  const impact = typeof insight.impact === "string" ? insight.impact : "medium";

                  return (
                    <div
                      key={index}
                      className="p-4 bg-zinc-800 rounded-lg border border-zinc-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getInsightIcon(type as AiInsight["type"])}
                          <h3 className="font-medium text-white">
                            {title}
                          </h3>
                        </div>
                        {getImpactBadge(impact as AiInsight["impact"])}
                      </div>
                      <p className="text-zinc-400 text-sm ml-8">
                        {description}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {analysis.recommendations.length > 0 && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.recommendations.map((rec, index) => {
                    const text = typeof rec === "string" ? rec : JSON.stringify(rec);
                    return (
                      <li key={index} className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 shrink-0" />
                        <span className="text-zinc-300">{text}</span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!analysis && !loading && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12">
            <div className="text-center">
              <Brain className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400">
                Click &quot;Analyze Trades&quot; to get AI-powered insights about your trading patterns
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
