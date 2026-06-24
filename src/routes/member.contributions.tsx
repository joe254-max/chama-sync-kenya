import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, ArrowDown, Users, CalendarDays } from "lucide-react";
import { MemberShell } from "@/components/MemberShell";
import { DoughnutCard, DownloadIconButton, MemberCard, MemberPage, MetricList, Pager, PromoCard, SearchFilterBar, SectionTabs, SimpleTable, StatCard, StatusBadge, TableRow, MemberIdentity } from "@/components/member-ui";

export const Route = createFileRoute("/member/contributions")({ component: MemberContributions });

const rows = [
  { date: "20 May 2024", time: "10:30 AM", chama: "Ufanisi Chama", role: "Member", color: "#c00", type: "Regular Contribution", amount: "KSh 15,000", method: "M-Pesa", meta: "0712 345 678" },
  { date: "15 May 2024", time: "03:45 PM", chama: "Pamoja Investment", role: "Treasurer", color: "#f59e0b", type: "Regular Contribution", amount: "KSh 10,000", method: "Bank Transfer", meta: "KCB Bank" },
  { date: "10 May 2024", time: "09:15 AM", chama: "Tujijenge Chama", role: "Member", color: "#16a34a", type: "Regular Contribution", amount: "KSh 20,450", method: "M-Pesa", meta: "0712 345 678" },
  { date: "05 May 2024", time: "11:20 AM", chama: "Ufanisi Chama", role: "Member", color: "#c00", type: "Emergency Fund", amount: "KSh 5,000", method: "Airtel Money", meta: "0723 456 789" },
  { date: "30 Apr 2024", time: "08:00 AM", chama: "Pamoja Investment", role: "Treasurer", color: "#f59e0b", type: "Regular Contribution", amount: "KSh 10,000", method: "Bank Transfer", meta: "Equity Bank" },
  { date: "25 Apr 2024", time: "04:30 PM", chama: "Tujijenge Chama", role: "Member", color: "#16a34a", type: "Regular Contribution", amount: "KSh 15,000", method: "M-Pesa", meta: "0712 345 678" },
  { date: "20 Apr 2024", time: "10:45 AM", chama: "Ufanisi Chama", role: "Member", color: "#c00", type: "Regular Contribution", amount: "KSh 15,000", method: "Bank Transfer", meta: "Co-op Bank" },
];

function MemberContributions() {
  return (
    <MemberShell>
      <MemberPage title="My Contributions" subtitle="Track and manage all your contributions across your chamas." statCards={<><StatCard icon={ArrowUp} iconWrap="bg-emerald-50" iconColor="text-emerald-600" label="Total Contributions" value="KSh 96,500" meta="This year" trend={{ value: "+ 12.5%", tone: "positive" }} /><StatCard icon={ArrowDown} iconWrap="bg-violet-50" iconColor="text-indigo-500" label="This Month" value="KSh 12,000" meta="May 2024" trend={{ value: "- 5.3%", tone: "negative" }} /><StatCard icon={Users} iconWrap="bg-amber-50" iconColor="text-amber-500" label="Active Chamas" value="3" meta="You contribute to" /><StatCard icon={CalendarDays} iconWrap="bg-violet-50" iconColor="text-violet-500" label="Upcoming Contributions" value="KSh 6,000" meta="In the next 7 days" /></>}>
        <div className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
          <MemberCard className="overflow-hidden">
            <SectionTabs tabs={[{ label: "All Contributions", active: true }, { label: "Contribution Calendar" }]} />
            <SearchFilterBar placeholder="Search contributions..." filters={["All Chamas"]} />
            <SimpleTable headers={["Date", "Chama", "Type", "Amount", "Payment Method", "Status", "Receipt"]} rows={rows.map((r, i) => (
              <TableRow key={i}>
                <td><div className="font-medium">{r.date}</div><div className="text-sm text-slate-500">{r.time}</div></td>
                <td><MemberIdentity name={r.chama} subline="" role={r.role} color={r.color} /></td>
                <td className="text-emerald-600">{r.type}</td>
                <td className="font-semibold">{r.amount}</td>
                <td><div>{r.method}</div><div className="text-sm text-slate-500">{r.meta}</div></td>
                <td><StatusBadge label="Successful" /></td>
                <td><DownloadIconButton /></td>
              </TableRow>
            ))} />
            <div className="flex items-center justify-between px-6 pb-4 pt-2 text-sm text-slate-500"><span>Showing 1 to 7 of 24 contributions</span></div>
            <Pager />
          </MemberCard>
          <div className="space-y-5">
            <DoughnutCard title="Contributions by Chama" total="KSh 96,500" segments={[{ color: "#d10d0d", value: 46.7 }, { color: "#f59e0b", value: 33.7 }, { color: "#16a34a", value: 19.6 }]} legend={[{ color: "#d10d0d", label: "Ufanisi Chama", value: "KSh 45,000", percent: "46.7%" }, { color: "#f59e0b", label: "Pamoja Investment", value: "KSh 32,500", percent: "33.7%" }, { color: "#16a34a", label: "Tujijenge Chama", value: "KSh 19,000", percent: "19.6%" }]} />
            <MemberCard title={<span>Contribution Summary <span className="text-sm text-slate-400">(This Year)</span></span>}>
              <MetricList items={[{ label: "Total Expected", value: "KSh 108,000" }, { label: "Total Received", value: "KSh 96,500" }, { label: "Total Pending", value: "KSh 6,000" }, { label: "Total Overdue", value: "KSh 5,500" }]} />
              <div className="flex items-center justify-center pb-6"><div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-emerald-600 border-r-slate-200 border-b-slate-200"><div className="text-center"><div className="text-2xl font-semibold">89.4%</div><div className="text-xs text-slate-500">Completion Rate</div></div></div></div>
            </MemberCard>
            <PromoCard title="Stay Consistent, Grow Together" description="Regular contributions build stronger chamas and bigger returns." buttonLabel="Make a Contribution" tone="soft" />
          </div>
        </div>
      </MemberPage>
    </MemberShell>
  );
}
