import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";
import {
  LayoutDashboard, Wallet, ArrowLeftRight, Banknote, Megaphone, MessageCircle,
  CheckSquare, CalendarDays, User, FileText, Settings, LogOut, Search, Bell,
  HelpCircle, TrendingUp, Check, Smartphone, ArrowUp, ArrowDown, FileBarChart,
  Users, Clock, Calendar, MapPin, Gift, Info, X,
} from "lucide-react";

export const Route = createFileRoute("/member/home")({ component: MemberHome });

function MemberHome() {
  const navigate = useNavigate();
  const { user, loading, roles, isOfficer, signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/" });
    else if (isOfficer || !roles.includes("member")) navigate({ to: "/dashboard" });
  }, [user, loading, roles, isOfficer, navigate]);

  const handleLogout = async () => { await signOut(); navigate({ to: "/" }); };

  const initials = (user?.email ?? "M").slice(0, 2).toUpperCase();
  const displayName = (user?.user_metadata?.full_name as string) ?? user?.email?.split("@")[0] ?? "Member";

  const navMain = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Wallet, label: "My wallet" },
    { icon: ArrowLeftRight, label: "Transact" },
    { icon: Banknote, label: "Loans", badge: { text: "Active", tone: "green" as const } },
  ];
  const navCommunity = [
    { icon: Megaphone, label: "Announcements", badge: { text: "2", tone: "red" as const } },
    { icon: MessageCircle, label: "Chat officer" },
    { icon: CheckSquare, label: "Votes & polls" },
    { icon: CalendarDays, label: "Meetings" },
  ];
  const navAccount = [
    { icon: User, label: "My profile" },
    { icon: FileText, label: "Documents" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto grid min-h-screen md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="hidden flex-col border-r bg-background md:flex">
          <div className="flex items-center gap-2.5 border-b px-5 py-4">
            <img src={logo} alt="M-Chama" className="h-8 w-8 object-contain" />
            <div>
              <div className="text-sm font-medium">M-Chama</div>
              <div className="text-[11px] text-muted-foreground">Member portal</div>
            </div>
          </div>

          <div className="mx-4 mt-3 flex items-center gap-2.5 rounded-lg bg-[#EEEDFE] px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7F77DD] text-[13px] font-medium text-[#EEEDFE]">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-medium text-[#3C3489]">{displayName}</div>
              <div className="text-[11px] text-[#534AB7]">Sisi Sote Chama</div>
            </div>
          </div>

          <NavSection title="Main" items={navMain} />
          <NavSection title="Community" items={navCommunity} />
          <NavSection title="Account" items={navAccount} />

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-2.5 border-t px-4 py-3.5 text-[13px] text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-[17px] w-[17px]" /> Sign out
          </button>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-col">
          {/* Top bar */}
          <div className="flex items-center gap-3 border-b bg-background px-6 py-3">
            <div className="flex-1">
              <p className="text-[13px] text-muted-foreground">
                {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
              <h2 className="mt-0.5 text-base font-medium">
                Good morning, {displayName} <span className="font-normal text-muted-foreground">— meeting in 3 days</span>
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

          {/* Content */}
          <div className="grid flex-1 items-start gap-5 p-6 lg:grid-cols-[1fr_300px]">
            {/* Left */}
            <div className="flex min-w-0 flex-col gap-4">
              {/* Hero row */}
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div className="rounded-xl border border-[#534AB7] bg-[#7F77DD] p-5">
                  <div className="text-xs text-[#AFA9EC]">Total savings balance</div>
                  <div className="text-[26px] font-medium tracking-tight text-[#EEEDFE]">KES 26,144</div>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-[#AFA9EC]">
                    <TrendingUp className="h-3.5 w-3.5" /> +KES 1,400 this month
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-[11px] text-[#AFA9EC]"><span>Savings goal progress</span><span>63%</span></div>
                    <div className="h-[5px] overflow-hidden rounded bg-[#534AB7]"><div className="h-full rounded bg-[#EEEDFE]" style={{ width: "63%" }} /></div>
                    <div className="mt-1 flex justify-between text-[11px] text-[#AFA9EC]"><span>KES 0</span><span>Target: KES 41,500</span></div>
                  </div>
                </div>
                <div className="rounded-xl border bg-background p-5">
                  <div className="text-xs text-muted-foreground">Active loan balance</div>
                  <div className="text-[26px] font-medium tracking-tight text-[#A32D2D]">KES 25,800</div>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-[#1D9E75]"><Check className="h-3.5 w-3.5" /> KES 1,400 repaid last meeting</div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>Repayment progress</span><span className="font-medium text-[#1D9E75]">45%</span></div>
                    <div className="h-2 overflow-hidden rounded border bg-muted/40"><div className="h-full rounded bg-[#1D9E75]" style={{ width: "45%" }} /></div>
                    <div className="mt-1.5 text-[11px] text-muted-foreground">Next payment: KES 1,400 due 16 May</div>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <QuickAction icon={Smartphone} label="Deposit via M-Pesa" bg="#E1F5EE" color="#085041" />
                <QuickAction icon={Banknote} label="Apply for loan" bg="#EEEDFE" color="#3C3489" />
                <QuickAction icon={ArrowUp} label="Request withdrawal" bg="#FAEEDA" color="#633806" />
                <QuickAction icon={FileBarChart} label="Download statement" bg="#E6F1FB" color="#0C447C" />
              </div>

              {/* Recent transactions */}
              <Section title="Recent transactions" link="View all">
                <Tx name="Monthly shares — May" date="13 May 2026 · M-Pesa" amount="+KES 1,400" inDir tag="Shares" tagBg="#E1F5EE" tagColor="#085041" />
                <Tx name="Loan repayment — May" date="13 May 2026 · M-Pesa" amount="+KES 1,400" inDir tag="Loan" tagBg="#EEEDFE" tagColor="#3C3489" />
                <Tx name="Welfare contribution" date="13 May 2026 · Cash" amount="+KES 30" inDir iconBg="#FAEEDA" iconColor="#633806" tag="Welfare" tagBg="#FAEEDA" tagColor="#633806" />
                <Tx name="Late payment fine" date="15 Apr 2026 · Auto-charged" amount="-KES 100" tag="Fine" tagBg="#FCEBEB" tagColor="#A32D2D" />
                <Tx name="Monthly shares — April" date="15 Apr 2026 · M-Pesa" amount="+KES 1,400" inDir tag="Shares" tagBg="#E1F5EE" tagColor="#085041" />
              </Section>

              {/* Loan schedule */}
              <Section title="Loan repayment schedule" link="Full schedule">
                <div className="mb-1.5 flex justify-between text-xs text-muted-foreground"><span>Loan issued: KES 57,000 · Jan 2026</span><span className="font-medium text-[#1D9E75]">45% cleared</span></div>
                <div className="h-2.5 overflow-hidden rounded border bg-muted/40"><div className="h-full rounded bg-[#1D9E75]" style={{ width: "45%" }} /></div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Stat val="KES 31,200" label="Repaid" color="#0F6E56" />
                  <Stat val="KES 25,800" label="Outstanding" color="#A32D2D" />
                  <Stat val="6 months" label="Remaining" />
                </div>
              </Section>
            </div>

            {/* Right */}
            <div className="flex min-w-0 flex-col gap-4">
              {/* Meeting */}
              <div className="rounded-xl border bg-background p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-[34px] w-[34px] items-center justify-center rounded-md bg-[#EEEDFE]"><Users className="h-[17px] w-[17px] text-[#7F77DD]" /></div>
                  <div>
                    <div className="text-sm font-medium">Upcoming meeting</div>
                    <div className="text-xs text-muted-foreground">Sisi Sote Chama</div>
                  </div>
                </div>
                <div className="mb-3 flex items-center justify-between rounded-md bg-[#EEEDFE] px-3 py-2">
                  <div className="text-xs font-medium text-[#3C3489] flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Meeting in</div>
                  <div className="text-xl font-medium text-[#7F77DD]">3 days</div>
                </div>
                <div className="mb-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
                  <Row icon={Calendar}>Thursday, 16 May 2026</Row>
                  <Row icon={Clock}>2:00 PM</Row>
                  <Row icon={MapPin}>Kwa Chief's Office, Kitale</Row>
                  <Row icon={Banknote}>Contribution due: KES 1,400</Row>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-1 rounded-md border border-[#9FE1CB] bg-[#E1F5EE] px-2 py-2 text-xs font-medium text-[#085041]"><Check className="h-3.5 w-3.5" />I will attend</button>
                  <button className="flex items-center justify-center gap-1 rounded-md border bg-muted/40 px-2 py-2 text-xs text-muted-foreground"><X className="h-3.5 w-3.5" />I'll be absent</button>
                </div>
              </div>

              {/* Financial health */}
              <Section title="Financial health score" link="Improve ↗">
                <div className="flex items-center gap-4 pb-3">
                  <svg width="70" height="70" viewBox="0 0 70 70">
                    <circle cx="35" cy="35" r="28" fill="none" stroke="#EEEDFE" strokeWidth="7" />
                    <circle cx="35" cy="35" r="28" fill="none" stroke="#7F77DD" strokeWidth="7" strokeDasharray="142 176" strokeDashoffset="35" strokeLinecap="round" />
                    <text x="35" y="40" textAnchor="middle" fontSize="16" fontWeight="500" fill="#7F77DD">81</text>
                  </svg>
                  <div className="flex-1">
                    <div className="text-[28px] font-medium leading-none text-[#7F77DD]">81<span className="text-sm text-muted-foreground">/100</span></div>
                    <div className="mb-2 text-xs text-muted-foreground">Good standing</div>
                    <Health label="Contributions" pct={92} />
                    <Health label="Loan repayment" pct={75} color="#1D9E75" />
                    <Health label="Attendance" pct={80} />
                  </div>
                </div>
                <div className="rounded-md bg-[#EEEDFE] px-3 py-2 text-xs text-[#3C3489] flex items-center gap-1.5"><Info className="h-3.5 w-3.5" />You qualify for loans up to <strong>KES 78,432</strong></div>
              </Section>

              {/* Savings goal */}
              <div className="rounded-xl border bg-background p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-medium">Savings goal</div>
                  <div className="cursor-pointer text-xs text-[#7F77DD]">Edit</div>
                </div>
                <div className="mb-2 flex items-baseline justify-between">
                  <div className="text-lg font-medium text-[#7F77DD]">KES 26,144</div>
                  <div className="text-xs text-muted-foreground">of KES 41,500 target</div>
                </div>
                <div className="h-2 overflow-hidden rounded border bg-muted/40"><div className="h-full rounded bg-[#1D9E75]" style={{ width: "63%" }} /></div>
                <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground"><span>63% reached</span><span>By December 2026</span></div>
              </div>

              {/* Share-out */}
              <div className="rounded-xl border border-[#9FE1CB] bg-[#E1F5EE] px-5 py-4">
                <div className="mb-1 flex items-center gap-1 text-xs font-medium text-[#085041]"><Gift className="h-3.5 w-3.5" />Year-end share-out estimate</div>
                <div className="text-[22px] font-medium text-[#0F6E56]">KES 12,400</div>
                <div className="mt-1 text-[11px] leading-snug text-[#085041]/75">Based on current trajectory. Confirmed at December AGM.</div>
              </div>

              {/* Announcements */}
              <Section title="Announcements" link="All">
                <Announcement text="Loan applications are open until Friday 17 May. Apply in the Loans tab." time="2 hours ago · Officer Grace Auma" />
                <Announcement text="Next meeting venue changed to Kwa Chief's Office. Same time applies." time="Yesterday · Officer Grace Auma" />
                <Announcement text="April share-out has been recorded. Check your statement for details." time="3 days ago · Officer Grace Auma" read />
              </Section>

              {/* Group snapshot */}
              <Section title="Group snapshot">
                <div className="grid grid-cols-2 gap-2">
                  <Snap val="KES 122,617" label="Group savings" color="#0F6E56" />
                  <Snap val="KES 185,900" label="Loans outstanding" color="#A32D2D" />
                  <Snap val="9/10" label="Paid this month" />
                  <Snap val="KES 2,471" label="Interest earned" color="#7F77DD" />
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function NavSection({ title, items }: { title: string; items: { icon: any; label: string; active?: boolean; badge?: { text: string; tone: "red" | "green" } }[] }) {
  return (
    <>
      <div className="px-3 pb-1 pt-2 text-[11px] uppercase tracking-wider text-muted-foreground">{title}</div>
      {items.map((n) => (
        <div key={n.label} className={`flex cursor-pointer items-center gap-2.5 px-4 py-2 text-[13px] transition-colors ${n.active ? "bg-[#EEEDFE] font-medium text-[#3C3489]" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
          <n.icon className={`h-[17px] w-[17px] ${n.active ? "text-[#7F77DD]" : ""}`} />
          {n.label}
          {n.badge && (
            <span className={`ml-auto rounded-full px-1.5 py-px text-[10px] font-medium ${n.badge.tone === "red" ? "bg-[#FCEBEB] text-[#A32D2D]" : "bg-[#E1F5EE] text-[#085041]"}`}>{n.badge.text}</span>
          )}
        </div>
      ))}
    </>
  );
}
function IconBtn({ children }: { children: React.ReactNode }) {
  return <button className="relative flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground">{children}</button>;
}
function QuickAction({ icon: Icon, label, bg, color }: { icon: any; label: string; bg: string; color: string }) {
  return (
    <button className="flex flex-col items-center gap-2 rounded-xl border bg-background p-3.5 transition hover:bg-muted/40">
      <div className="flex h-[38px] w-[38px] items-center justify-center rounded-md" style={{ background: bg }}>
        <Icon className="h-[19px] w-[19px]" style={{ color }} />
      </div>
      <div className="text-center text-xs font-medium">{label}</div>
    </button>
  );
}
function Section({ title, link, children }: { title: string; link?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium">{title}</div>
        {link && <div className="cursor-pointer text-xs text-[#7F77DD] hover:text-[#534AB7]">{link}</div>}
      </div>
      {children}
    </div>
  );
}
function Tx({ name, date, amount, inDir, tag, tagBg, tagColor, iconBg, iconColor }: { name: string; date: string; amount: string; inDir?: boolean; tag: string; tagBg: string; tagColor: string; iconBg?: string; iconColor?: string }) {
  const Icon = inDir ? ArrowDown : ArrowUp;
  const bg = iconBg ?? (inDir ? "#E1F5EE" : "#FCEBEB");
  const color = iconColor ?? (inDir ? "#0F6E56" : "#A32D2D");
  return (
    <div className="flex items-center gap-3 border-b py-2.5 last:border-b-0 last:pb-0">
      <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md" style={{ background: bg }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center text-[13px] font-medium">
          <span className="truncate">{name}</span>
          <span className="ml-1.5 rounded-full px-1.5 py-px text-[10px] font-medium" style={{ background: tagBg, color: tagColor }}>{tag}</span>
        </div>
        <div className="text-[11px] text-muted-foreground">{date}</div>
      </div>
      <div className={`text-[13px] font-medium ${inDir ? "text-[#0F6E56]" : "text-[#A32D2D]"}`}>{amount}</div>
    </div>
  );
}
function Stat({ val, label, color }: { val: string; label: string; color?: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-2.5 py-2">
      <div className="text-sm font-medium" style={color ? { color } : undefined}>{val}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
function Row({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return <div className="flex items-center gap-2"><Icon className="h-3.5 w-3.5 text-[#7F77DD]" />{children}</div>;
}
function Health({ label, pct, color = "#7F77DD" }: { label: string; pct: number; color?: string }) {
  return (
    <div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
      <span>{label}</span>
      <div className="h-1 w-20 overflow-hidden rounded bg-muted/60"><div className="h-full rounded" style={{ width: `${pct}%`, background: color }} /></div>
      <span>{pct}%</span>
    </div>
  );
}
function Announcement({ text, time, read }: { text: string; time: string; read?: boolean }) {
  return (
    <div className="flex gap-2.5 border-b py-2.5 last:border-b-0 last:pb-0">
      <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${read ? "bg-border" : "bg-[#7F77DD]"}`} />
      <div>
        <div className="text-[13px] leading-snug">{text}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">{time}</div>
      </div>
    </div>
  );
}
function Snap({ val, label, color }: { val: string; label: string; color?: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2.5">
      <div className="text-base font-medium" style={color ? { color } : undefined}>{val}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
