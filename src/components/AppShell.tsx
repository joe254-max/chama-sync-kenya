import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Users, Wallet, FileText, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chamas", label: "Chamas", icon: Wallet },
  { to: "/members", label: "Members", icon: Users },
  { to: "/reports", label: "Reports", icon: FileText },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isSuperAdmin, isOfficer, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  const roleLabel = isSuperAdmin ? "Super Admin" : isOfficer ? "Officer" : "Member";

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b bg-sidebar px-4 py-3 md:hidden">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">CS</div>
          <span className="font-semibold">ChamaSync</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside className={`${open ? "block" : "hidden"} border-b bg-sidebar md:block md:w-64 md:border-b-0 md:border-r`}>
        <div className="hidden items-center gap-2 border-b px-6 py-5 md:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">CS</div>
          <div>
            <div className="font-semibold">ChamaSync</div>
            <Badge variant="secondary" className="text-xs">{roleLabel}</Badge>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {nav.map((n) => {
            const active = location.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">{user.email}</div>
          <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
