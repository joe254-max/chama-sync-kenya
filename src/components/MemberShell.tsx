import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Bell, ChevronDown, ChevronLeft, ChevronRight, CreditCard, HandCoins, HelpCircle, LayoutDashboard, LogOut, ReceiptText, ScrollText, Search, Users, UserRound, WalletCards } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logoAsset from "@/assets/mchama-logo.png.asset.json";
import logoWhiteAsset from "@/assets/mchama-logo-white.png.asset.json";

type NavItem = { label: string; to: string; icon: LucideIcon; badge?: string };

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/member/home", icon: LayoutDashboard },
  { label: "My Chamas", to: "/member/chamas", icon: Users },
  { label: "Contributions", to: "/member/contributions", icon: WalletCards },
  { label: "Withdrawals", to: "/member/withdrawals", icon: HandCoins },
  { label: "Loans", to: "/member/loans", icon: CreditCard },
  { label: "Transactions", to: "/member/transactions", icon: ReceiptText },
  { label: "Statements", to: "/member/statements", icon: ScrollText },
  { label: "Profile", to: "/member/profile", icon: UserRound },
  { label: "Notifications", to: "/member/notifications", icon: Bell, badge: "3" },
  { label: "Help & Support", to: "/member/help", icon: HelpCircle },
];

export function MemberShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { user, loading, roles, isOfficer, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/" });
    else if (isOfficer || !roles.includes("member")) navigate({ to: "/dashboard" });
  }, [user, loading, roles, isOfficer, navigate]);

  const displayName = (user?.user_metadata?.full_name as string) ?? "John Kamau";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const sidebarWidth = collapsed ? "80px" : "244px";

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900">
      <div
        className="mx-auto min-h-screen max-w-[1536px] xl:grid"
        style={{ gridTemplateColumns: `${sidebarWidth} 1fr` }}
      >
        <aside
          className="sticky top-0 hidden h-screen flex-col overflow-hidden bg-[#aa0202] px-3 pb-4 pt-4 text-white transition-all duration-300 xl:flex"
          style={{ width: sidebarWidth }}
        >
          {/* Watermark logo */}
          <img
            src={logoWhiteAsset.url}
            alt=""
            aria-hidden
            className="smokey-drift pointer-events-none absolute inset-0 m-auto h-[85%] w-[85%] object-contain opacity-[0.08]"
          />
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="absolute -right-3 top-6 z-10 grid h-7 w-7 place-items-center rounded-full border border-red-200 bg-white text-red-600 shadow-md hover:bg-red-50"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <div className={`relative z-10 flex flex-col items-center pb-5 text-center ${collapsed ? "px-0" : "px-3 pt-1"}`}>
            <div
              className={`smokey-red-shadow relative grid place-items-center rounded-full bg-[#aa0202] ring-1 ring-white/30 ring-offset-2 ring-offset-[#aa0202] transition-all duration-300 ${collapsed ? "h-12 w-12" : "h-28 w-28"}`}
            >
              <span className="pointer-events-none absolute inset-1 rounded-full border border-white/25" />
              <span className="pointer-events-none absolute inset-2.5 rounded-full border border-white/10" />
              <img
                src={logoAsset.url}
                alt="M-Chama"
                className={`relative object-contain transition-all duration-300 ${collapsed ? "h-9 w-9" : "h-24 w-24"}`}
              />
            </div>
          </div>

          <nav className="relative z-10 flex-1 space-y-1 overflow-hidden">
            {navItems.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 rounded-[12px] ${collapsed ? "justify-center px-2 py-2.5" : "px-4 py-2.5"} text-[14px] font-medium transition ${active ? "bg-white text-red-600 shadow-[0_6px_18px_rgba(0,0,0,0.12)]" : "text-white hover:bg-white/10"}`}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.badge ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] text-white">{item.badge}</span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={async () => { await signOut(); navigate({ to: "/" }); }}
            title={collapsed ? "Log Out" : undefined}
            className={`mt-2 flex items-center gap-3 rounded-[12px] ${collapsed ? "justify-center px-2 py-2.5" : "px-4 py-2.5"} text-left text-[14px] font-medium text-white hover:bg-white/10`}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && "Log Out"}
          </button>
        </aside>

        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8 xl:px-8">
          <div className="mb-6 flex items-center justify-end gap-4 px-1 pt-2">
            <button className="relative text-slate-900"><Bell className="h-6 w-6" /><span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] text-white">3</span></button>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">{avatarLetter}</div>
              <div className="text-[15px] font-medium text-slate-900">{displayName}</div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </div>
          </div>
          <div className="mx-auto max-w-[1248px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function MemberTopFilters({ placeholder, showDate = false }: { placeholder: string; showDate?: boolean }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
      <label className="flex h-12 min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-400 lg:min-w-[240px]">
        <Search className="h-4 w-4" />
        <input className="w-full bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400" placeholder={placeholder} />
      </label>
      {showDate ? <button className="inline-flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-[14px] font-medium text-slate-700">01 May – 31 May 2024</button> : null}
    </div>
  );
}
