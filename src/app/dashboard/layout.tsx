import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { RouteProgress } from "@/components/layout/route-progress";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "var(--surface-page)" }}>
      <RouteProgress />
      <Sidebar />
      <main className="min-h-screen md:pl-[180px] pb-16 md:pb-0">
        <ErrorBoundary>
          <div className="p-4 md:p-5">{children}</div>
        </ErrorBoundary>
      </main>
      <MobileNav />
    </div>
  );
}
