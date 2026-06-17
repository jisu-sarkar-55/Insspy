import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { RouteProgress } from "@/components/layout/route-progress";

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
      <main className="min-h-screen md:pl-[220px] pb-16 md:pb-0">
        <div className="p-4 md:p-5">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
