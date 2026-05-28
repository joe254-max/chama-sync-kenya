import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, CalendarDays, PiggyBank, Wallet, Users } from "lucide-react";
import { MemberShell } from "@/components/MemberShell";
import { ActivityList, DoughnutCard, MemberCard, MemberPage, PromoCard, StatCard } from "@/components/member-ui";

export const Route = createFileRoute("/member/home")({ component: MemberHome });

function MemberHome() {
  return (
    <MemberShell>
      <MemberPage
        title="Welcome back, John 👋"
        subtitle="Here's what's happening with your finances today."
        statCards={
          <>
            <StatCard icon={PiggyBank} iconWrap="bg-red-50" iconColor="text-red-500" label="Total Savings" value="KSh 128,450" meta="Across all chamas" />
            <StatCard icon={Wallet} iconWrap="bg-emerald-50" iconColor="text-emerald-600" label="Total Contributions" value="KSh 96,500" meta="This year" trend={{ value: "+ 12.5%", tone: "positive" }} />
            <StatCard icon={ArrowDown} iconWrap="bg-violet-50" iconColor="text-indigo-500" label="Total Withdrawals" value="KSh 27,000" meta="All time" />
            <StatCard icon={Users} iconWrap="bg-amber-50" iconColor="text-amber-500" label="Active Chamas" value="3" meta="You are a member" />
          </>
        }
      >
        <div className="grid gap-5 xl:grid-cols-[1.05fr_1.1fr_.92fr]">
          <MemberCard title="My Chamas" action={<button className="text-[15px] font-semibold text-red-600">View all</button>}>
            <div className="space-y-4 px-6 py-5">
              {[
                ["Ufanisi Chama", "Next meeting: 24 May 2024", "Member", "KSh 45,000", "#c00"],
                ["Pamoja Investment", "Next meeting: 30 May 2024", "Treasurer", "KSh 32,500", "#f59e0b"],
                ["Tujijenge Chama", "Next meeting: 05 Jun 2024", "Member", "KSh 50,950", "#16a34a"],
              ].map(([name, sub, role, value, color]) => (
                <div key={name} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ backgroundColor: String(color) }}>{String(name).charAt(0)}</div><div><div className="text-[15px] font-semibold">{name}</div><div className="text-[14px] text-slate-500">{sub}</div></div></div>
                  <div className="text-right"><div className="text-[13px] text-slate-500">My Savings</div><div className="text-[17px] font-semibold text-emerald-600">{value}</div></div>
                </div>
              ))}
              <button className="mt-2 h-12 w-full rounded-[14px] bg-red-700 text-[15px] font-semibold text-white">+ Join a New Chama</button>
            </div>
          </MemberCard>
          <DoughnutCard
            title={<div className="flex items-center justify-between"><span>Savings Overview</span><button className="rounded-xl border border-slate-200 px-4 py-2 text-[14px] font-medium text-slate-700">This Year</button></div>}
            total="KSh 128,450"
            segments={[{ color: "#d10d0d", value: 35.1 }, { color: "#f59e0b", value: 25.3 }, { color: "#16a34a", value: 39.6 }]}
            legend={[{ color: "#d10d0d", label: "Ufanisi Chama", value: "KSh 45,000", percent: "35.1%" }, { color: "#f59e0b", label: "Pamoja Investment", value: "KSh 32,500", percent: "25.3%" }, { color: "#16a34a", label: "Tujijenge Chama", value: "KSh 50,950", percent: "39.6%" }]}
          />
          <MemberCard title="Upcoming Meetings" action={<button className="text-[15px] font-semibold text-red-600">View all</button>}>
            <div className="space-y-5 px-6 py-5">
              {[["Ufanisi Chama", "24 May 2024 · 7:00 PM", "In 2 days", "bg-red-50 text-red-500"], ["Pamoja Investment", "30 May 2024 · 7:00 PM", "In 8 days", "bg-amber-50 text-amber-500"], ["Tujijenge Chama", "05 Jun 2024 · 7:00 PM", "In 14 days", "bg-emerald-50 text-emerald-600"]].map(([name, time, badge, cls]) => <div key={name} className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 text-white"><CalendarDays className="h-5 w-5" /></div><div><div className="text-[15px] font-semibold">{name}</div><div className="text-[14px] text-slate-500">{time}</div></div></div><span className={`rounded-full px-3 py-1 text-[12px] font-medium ${cls}`}>{badge}</span></div>)}
            </div>
          </MemberCard>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
          <MemberCard title="Recent Transactions" action={<button className="text-[15px] font-semibold text-red-600">View all</button>}>
            <ActivityList items={[{ icon: ArrowUp, iconWrap: "bg-emerald-50", iconColor: "text-emerald-600", title: "Contribution to Ufanisi Chama", subtitle: "May 20, 2024 · 10:30 AM", meta: "Contribution", value: "+ KSh 2,500", valueTone: "positive" }, { icon: ArrowDown, iconWrap: "bg-red-50", iconColor: "text-red-500", title: "Withdrawal from Pamoja Investment", subtitle: "May 15, 2024 · 03:45 PM", meta: "Withdrawal", value: "- KSh 5,000", valueTone: "negative" }, { icon: ArrowUp, iconWrap: "bg-emerald-50", iconColor: "text-emerald-600", title: "Contribution to Tujijenge Chama", subtitle: "May 10, 2024 · 09:15 AM", meta: "Contribution", value: "+ KSh 3,000", valueTone: "positive" }]} />
          </MemberCard>
          <PromoCard title="Grow Together, Thrive Together" description="Stay consistent with your contributions and watch your chama grow." buttonLabel="Make a Contribution" tone="red" artwork={<div className="relative h-[190px] w-[220px]"><div className="absolute bottom-0 right-1 h-28 w-20 rounded-[24px] border-4 border-white/20 bg-black/20" /><div className="absolute bottom-0 left-2 flex gap-2">{[32,44,56].map((h) => <span key={h} className="w-6 rounded-t-full bg-amber-400/80" style={{ height: h }} />)}</div></div>} />
        </div>
      </MemberPage>
    </MemberShell>
  );
}
