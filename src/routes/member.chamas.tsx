import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, PiggyBank, Users, Wallet } from "lucide-react";
import { MemberShell } from "@/components/MemberShell";
import { DoughnutCard, FooterActionRow, MemberCard, MemberPage, MemberIdentity, Pager, SearchFilterBar, SectionTabs, SimpleTable, StatCard, StatusBadge, TableRow, PromoCard } from "@/components/member-ui";

export const Route = createFileRoute("/member/chamas")({ component: MemberChamas });

function MemberChamas() {
  return (
    <MemberShell>
      <MemberPage title="My Chamas" subtitle="Manage and track all your chamas in one place." statCards={<><StatCard icon={Users} iconWrap="bg-red-50" iconColor="text-red-500" label="Total Chamas" value="3" meta="You are a member" /><StatCard icon={PiggyBank} iconWrap="bg-emerald-50" iconColor="text-emerald-600" label="Total Savings" value="KSh 128,450" meta="Across all chamas" /><StatCard icon={Wallet} iconWrap="bg-violet-50" iconColor="text-indigo-500" label="Total Contributions" value="KSh 96,500" meta="This year" trend={{ value: "+ 12.5%", tone: "positive" }} /><StatCard icon={CalendarDays} iconWrap="bg-violet-50" iconColor="text-violet-500" label="Upcoming Meetings" value="2" meta="In the next 7 days" /></>}>
        <MemberCard className="overflow-hidden">
          <SectionTabs tabs={[{ label: "My Chamas", active: true }, { label: "Invitations", badge: "1" }, { label: "Archived" }]} />
          <SearchFilterBar placeholder="Search chama..." filters={["All Status"]} />
          <div className="grid gap-5 xl:grid-cols-[1.45fr_.75fr]">
            <div>
              <SimpleTable headers={["Chama", "Role", "Total Savings", "Your Savings", "Next Meeting", "Status", "Action"]} rows={[
                <TableRow key="1"><td><MemberIdentity name="Ufanisi Chama" subline="Since Jan 2023" role="Member" color="#c00" /></td><td><StatusBadge label="Member" tone="danger" /></td><td><div className="font-semibold">KSh 45,000</div><div className="text-emerald-600 text-sm">↑ 12.5%</div></td><td><div className="font-semibold">KSh 15,000</div><div className="text-slate-500 text-sm">33.3%</div></td><td><div className="font-medium">24 May 2024</div><div className="text-slate-500 text-sm">7:00 PM</div></td><td><StatusBadge label="Active" /></td><td><button className="rounded-xl border px-4 py-2 text-sm font-medium">View</button></td></TableRow>,
                <TableRow key="2"><td><MemberIdentity name="Pamoja Investment" subline="Since Aug 2022" role="Treasurer" color="#f59e0b" /></td><td><StatusBadge label="Treasurer" tone="warning" /></td><td><div className="font-semibold">KSh 32,500</div><div className="text-emerald-600 text-sm">↑ 8.7%</div></td><td><div className="font-semibold">KSh 10,000</div><div className="text-slate-500 text-sm">30.8%</div></td><td><div className="font-medium">30 May 2024</div><div className="text-slate-500 text-sm">7:00 PM</div></td><td><StatusBadge label="Active" /></td><td><button className="rounded-xl border px-4 py-2 text-sm font-medium">View</button></td></TableRow>,
                <TableRow key="3"><td><MemberIdentity name="Tujijenge Chama" subline="Since Feb 2024" role="Member" color="#16a34a" /></td><td><StatusBadge label="Member" tone="danger" /></td><td><div className="font-semibold">KSh 50,950</div><div className="text-emerald-600 text-sm">↑ 15.2%</div></td><td><div className="font-semibold">KSh 20,450</div><div className="text-slate-500 text-sm">40.1%</div></td><td><div className="font-medium">05 Jun 2024</div><div className="text-slate-500 text-sm">7:00 PM</div></td><td><StatusBadge label="Active" /></td><td><button className="rounded-xl border px-4 py-2 text-sm font-medium">View</button></td></TableRow>
              ]} />
              <div className="px-6 pb-6"><FooterActionRow buttonLabel="Join a New Chama" text="Discover and join a chama to grow together" /></div>
              <MemberCard title={<span>Contribution Overview <span className="text-slate-400 text-sm">(This Month)</span></span>} className="mx-6 mb-6"><div className="grid gap-4 px-6 py-6 md:grid-cols-5"><div><div className="text-slate-500 text-sm">Expected</div><div className="text-3xl font-semibold">KSh 18,000</div><div className="text-sm text-slate-500">From all members</div></div><div><div className="text-slate-500 text-sm">Received</div><div className="text-3xl font-semibold">KSh 12,000</div><div className="text-sm text-slate-500">66.7% of expected</div></div><div><div className="text-slate-500 text-sm">Pending</div><div className="text-3xl font-semibold">KSh 6,000</div><div className="text-sm text-slate-500">33.3% remaining</div></div><div><div className="text-slate-500 text-sm">Overdue</div><div className="text-3xl font-semibold">KSh 2,000</div><div className="text-sm text-slate-500">2 members</div></div><div className="flex items-center justify-center"><div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-emerald-600 border-r-slate-200 border-b-slate-200"><span className="text-2xl font-semibold">66.7%</span></div></div></div></MemberCard>
            </div>
            <div className="space-y-5 px-0 pb-6 pr-6">
              <DoughnutCard title="Savings Distribution" total="KSh 128,450" segments={[{ color: "#d10d0d", value: 35.1 }, { color: "#f59e0b", value: 25.3 }, { color: "#16a34a", value: 39.6 }]} legend={[{ color: "#d10d0d", label: "Ufanisi Chama", value: "KSh 45,000", percent: "35.1%" }, { color: "#f59e0b", label: "Pamoja Investment", value: "KSh 32,500", percent: "25.3%" }, { color: "#16a34a", label: "Tujijenge Chama", value: "KSh 50,950", percent: "39.6%" }]} />
              <MemberCard title="Upcoming Meetings" action={<button className="text-[15px] font-semibold text-red-600">View all</button>}><div className="space-y-5 px-6 py-5">{[["Ufanisi Chama", "24 May 2024 · 7:00 PM", "In 2 days", "bg-red-50 text-red-500"], ["Pamoja Investment", "30 May 2024 · 7:00 PM", "In 8 days", "bg-amber-50 text-amber-500"]].map(([name, time, badge, cls]) => <div key={name} className="flex items-center justify-between"><div><div className="font-semibold">{name}</div><div className="text-sm text-slate-500">{time}</div></div><span className={`rounded-full px-3 py-1 text-xs font-medium ${cls}`}>{badge}</span></div>)}</div></MemberCard>
              <PromoCard title="Stronger Together, Greater Tomorrow" description="Contribute consistently and watch your chama grow." buttonLabel="Make a Contribution" tone="soft" />
            </div>
          </div>
        </MemberCard>
      </MemberPage>
    </MemberShell>
  );
}
