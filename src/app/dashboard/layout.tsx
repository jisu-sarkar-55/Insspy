import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--surface-page)" }}>
      <Sidebar />
      <main className="flex-1 overflow-auto hide-scrollbar pb-16 md:pb-0">
        <div className="p-4 md:p-5">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
