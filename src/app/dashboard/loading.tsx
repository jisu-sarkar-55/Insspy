export default function DashboardLoading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "var(--border-medium)", borderTopColor: "transparent" }}
        />
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
          Loading...
        </div>
      </div>
    </div>
  );
}
