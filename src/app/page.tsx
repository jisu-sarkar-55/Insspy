import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  BarChart3,
  Brain,
  BookOpen,
  Shield,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold text-white">
                Trading Journal
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-zinc-400 hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Trade Smarter with{" "}
            <span className="text-emerald-400">AI-Powered</span> Insights
          </h1>
          <p className="text-xl text-zunc-400 mb-8 max-w-2xl mx-auto">
            Track every trade, analyze your performance, and discover patterns
            you never knew existed. Your personal trading coach powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
              >
                Start Journaling Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-8"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Everything You Need to Improve
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="w-12 h-12 bg-emerald-600/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Performance Analytics
              </h3>
              <p className="text-zinc-400">
                Win rate, profit factor, equity curves, and 20+ metrics to
                understand your trading performance.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="w-12 h-12 bg-purple-600/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-zinc-400">
                Get personalized analysis of your trading patterns and actionable
                recommendations to improve.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Trade Journal
              </h3>
              <p className="text-zinc-400">
                Record notes, screenshots, and psychology for each trade to
                build a comprehensive trading history.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="w-12 h-12 bg-yellow-600/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Strategy Tracking
              </h3>
              <p className="text-zinc-400">
                Tag trades by strategy and discover which approaches work best
                for your trading style.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Risk Management
              </h3>
              <p className="text-zinc-400">
                Track stop losses, risk-reward ratios, and drawdown to protect
                your capital.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="w-12 h-12 bg-cyan-600/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Psychology Tracking
              </h3>
              <p className="text-zinc-400">
                Log your emotional state and discover how confidence, fear, and
                greed impact your results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Log Your Trades
              </h3>
              <p className="text-zinc-400">
                Manually enter trades or import from your broker. Add notes and
                screenshots.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Analyze Performance
              </h3>
              <p className="text-zinc-400">
                View your stats, equity curve, and strategy breakdowns
                automatically calculated.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Improve with AI
              </h3>
              <p className="text-zinc-400">
                Get AI-powered insights to identify patterns and become a
                consistently profitable trader.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Trade Smarter?
          </h2>
          <p className="text-zinc-400 mb-8">
            Start your free trading journal today. No credit card required.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto text-center text-zinc-500 text-sm">
          <p>&copy; 2026 Trading Journal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
