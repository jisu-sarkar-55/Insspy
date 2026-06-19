"use client";
import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <div className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>Something went wrong</div>
          <div className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>{this.state.error?.message}</div>
          <button onClick={() => this.setState({ hasError: false })} className="mt-4 px-4 py-2 rounded-lg" style={{ background: "var(--primary)", color: "#fff" }}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
