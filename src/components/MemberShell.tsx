import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { Bell, ChevronDown, CreditCard, HandCoins, HelpCircle, LayoutDashboard, LogOut, ReceiptText, ScrollText, Search, Users, UserRound, WalletCards } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

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

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/" });
    else if (isOfficer || !roles.includes("member")) navigate({ to: "/dashboard" });
  }, [user, loading, roles, isOfficer, navigate]);

  const displayName = (user?.user_metadata?.full_name as string) ?? "John Kamau";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-[1536px] xl:grid-cols-[244px_1fr]">
        <aside className="hidden min-h-screen flex-col bg-[linear-gradient(180deg,#b90000_0%,#ae0000_60%,#9f0000_100%)] px-4 pb-8 pt-8 text-white xl:flex">
          <div className="flex flex-col items-center px-3 pb-8 pt-2 text-center">
            <img src={logo} alt="M-Chama" className="h-24 w-auto object-contain brightness-0 invert" />
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-[14px] px-5 py-4 text-[15px] font-medium transition ${active ? "bg-white text-red-600 shadow-[0_10px_30px_rgba(0,0,0,0.12)]" : "text-white hover:bg-white/10"}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] text-white">{item.badge}</span> : null}
                </Link>
              );
            })}
          </nav>
          <button onClick={async () => { await signOut(); navigate({ to: "/" }); }} className="mt-auto flex items-center gap-3 px-5 py-4 text-left text-[15px] font-medium text-white hover:bg-white/10 rounded-[14px]">
            <LogOut className="h-5 w-5" />
            Log Out
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
