import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";
import {
  Wallet, ArrowLeftRight, Banknote, Megaphone, MessageCircle,
  CheckSquare, CalendarDays, User, FileText, Settings, LogOut, Search, Bell,
  HelpCircle,
} from "lucide-react";

type NavItem = {
  icon: any;
  label: string;
  to?: string;
  badge?: { text: string; tone: "red" | "green" };
};

export function MemberShell({ title, subtitle, children }: { title?: string; subtitle?: string; children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user, loading, roles, isOfficer, signOut } = useAuth();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/" });
    else if (isOfficer || !roles.includes("member")) navigate({ to: "/dashboard" });
  }, [user, loading, roles, isOfficer, navigate]);

  const handleLogout = async () => { await signOut(); navigate({ to: "/" }); };

  const initials = (user?.email ?? "M").slice(0, 2).toUpperCase();
  const displayName = (user?.user_metadata?.full_name as string) ?? user?.email?.split("@")[0] ?? "Member";

  const navMain: NavItem[] = [
    { icon: Wallet, label: "My wallet", to: "/member/home" },
    { icon: ArrowLeftRight, label: "Transact", to: "/member/transact" },
    { icon: Banknote, label: "Loans", badge: { text: "Active", tone: "green" } },
  ];
  const navCommunity: NavItem[] = [
    { icon: Megaphone, label: "Announcements", to: "/member/announcements", badge: { text: "2", tone: "red" } },
    { icon: MessageCircle, label: "Chat officer" },
    { icon: CheckSquare, label: "Votes & polls" },
    { icon: CalendarDays, label: "Meetings" },
  ];
  const navAccount: NavItem[] = [
    { icon: User, label: "My profile" },
    { icon: FileText, label: "Documents" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto grid min-h-screen md:grid-cols-[220px_1fr]">
        <aside className="hidden flex-col border-r bg-background md:flex">
          <div className="flex items-center gap-2.5 border-b px-5 py-4">
            <img src={logo} alt="M-Chama" className="h-8 w-8 object-contain" />
            <div>
              <div className="text-sm font-medium">M-Chama</div>
              <div className="text-[11px] text-muted-foreground">Member portal</div>
            </div>
          </div>

          <div className="mx-4 mt-3 flex items-center gap-2.5 rounded-lg bg-[#EEEDFE] px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7F77DD] text-[13px] font-medium text-[#EEEDFE]">{initials}</div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-medium text-[#3C3489]">{displayName}</div>
              <div className="text-[11px] text-[#534AB7]">Sisi Sote Chama</div>
            </div>
          </div>

          <NavSection title="Main" items={navMain} pathname={pathname} />
          <NavSection title="Community" items={navCommunity} pathname={pathname} />
          <NavSection title="Account" items={navAccount} pathname={pathname} />

          <button onClick={handleLogout} className="mt-auto flex items-center gap-2.5 border-t px-4 py-3.5 text-[13px] text-muted-foreground hover:text-foreground">
            <LogOut className="h-[17px] w-[17px]" /> Sign out
          </button>
        </aside>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-3 border-b bg-background px-6 py-3">
            <div className="flex-1">
              <p className="text-[13px] text-muted-foreground">
                {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
              <h2 className="mt-0.5 text-base font-medium">
                {title ?? `Good morning, ${displayName}`}
                {subtitle && <span className="font-normal text-muted-foreground"> — {subtitle}</span>}
              </h2>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <div className="flex h-9 w-[200px] items-center gap-2 rounded-md border bg-muted/40 px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input className="w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground" placeholder="Search transactions..." />
              </div>
              <IconBtn><Bell className="h-[17px] w-[17px]" /><span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-background bg-[#E24B4A]" /></IconBtn>
              <IconBtn><HelpCircle className="h-[17px] w-[17px]" /></IconBtn>
              <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#7F77DD] text-[13px] font-medium text-[#EEEDFE]">{initials}</div>
            </div>
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function NavSection({ title, items, pathname }: { title: string; items: NavItem[]; pathname: string }) {
  return (
    <>
      <div className="px-3 pb-1 pt-2 text-[11px] uppercase tracking-wider text-muted-foreground">{title}</div>
      {items.map((n) => {
        const active = !!n.to && pathname === n.to;
        const cls = `flex cursor-pointer items-center gap-2.5 px-4 py-2 text-[13px] transition-colors ${active ? "bg-[#EEEDFE] font-medium text-[#3C3489]" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`;
        const inner = (
          <>
            <n.icon className={`h-[17px] w-[17px] ${active ? "text-[#7F77DD]" : ""}`} />
            {n.label}
            {n.badge && (
              <span className={`ml-auto rounded-full px-1.5 py-px text-[10px] font-medium ${n.badge.tone === "red" ? "bg-[#FCEBEB] text-[#A32D2D]" : "bg-[#E1F5EE] text-[#085041]"}`}>{n.badge.text}</span>
            )}
          </>
        );
        return n.to ? (
          <Link key={n.label} to={n.to} className={cls}>{inner}</Link>
        ) : (
          <div key={n.label} className={cls}>{inner}</div>
        );
      })}
    </>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return <button className="relative flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground">{children}</button>;
}
