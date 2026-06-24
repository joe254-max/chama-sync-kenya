import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, CalendarDays, Clock, Wallet, Building2, Smartphone, CreditCard } from "lucide-react";
import { MemberShell } from "@/components/MemberShell";
import { DoughnutCard, DownloadIconButton, MemberCard, MemberPage, MetricList, Pager, PromoCard, SearchFilterBar, SectionTabs, SimpleTable, StatCard, StatusBadge, TableRow, MemberIdentity } from "@/components/member-ui";

export const Route = createFileRoute("/member/withdrawals")({ component: MemberWithdrawals });

const rows = [
  { date: "24 May 2024", time: "02:45 PM", chama: "Ufanisi Chama", role: "Member", color: "#c00", amount: "KSh 5,000", method: "M-Pesa", meta: "0712 345 678", status: "Completed", tone: "success" as const, ref: "WD987654321" },
  { date: "20 May 2024", time: "11:30 AM", chama: "Pamoja Investment", role: "Treasurer", color: "#f59e0b", amount: "KSh 3,000", method: "Bank Transfer", meta: "Equity Bank · **** 1234", status: "Completed", tone: "success" as const, ref: "WD987654322" },
  { date: "18 May 2024", time: "09:15 AM", chama: "Tujijenge Chama", role: "Member", color: "#16a34a", amount: "KSh 4,500", method: "M-Pesa", meta: "0712 345 678", status: "Pending", tone: "warning" as const, ref: "WD987654323" },
  { date: "15 May 2024", time: "04:20 PM", chama: "Ufanisi Chama", role: "Member", color: "#c00", amount: "KSh 2,000", method: "Airtel Money", meta: "0723 456 789", status: "Completed", tone: "success" as const, ref: "WD987654324" },
  { date: "10 May 2024", time: "10:05 AM", chama: "Pamoja Investment", role: "Treasurer", color: "#f59e0b", amount: "KSh 6,000", method: "Bank Transfer", meta: "KCB Bank · **** 4567", status: "Failed", tone: "danger" as const, ref: "WD987654325" },
  { date: "05 May 2024", time: "01:45 PM", chama: "Tujijenge Chama", role: "Member", color: "#16a34a", amount: "KSh 3,000", method: "M-Pesa", meta: "0712 345 678", status: "Completed", tone: "success" as const, ref: "WD987654326" },
  { date: "28 Apr 2024", time: "08:30 AM", chama: "Ufanisi Chama", role: "Member", color: "#c00", amount: "KSh 4,500", method: "Bank Transfer", meta: "Co-op Bank · **** 7890", status: "Completed", tone: "success" as const, ref: "WD987654327" },
];

function MemberWithdrawals() {
  return (
    <MemberShell>
      <MemberPage title="Withdrawals" subtitle="Track and manage all your withdrawal requests across your chamas." statCards={<><StatCard icon={ArrowDown} iconWrap="bg-emerald-50" iconColor="text-emerald-600" label="Total Withdrawn" value="KSh 27,000" meta="All time" trend={{ value: "+ 12.5%", tone: "positive" }} /><StatCard icon={CalendarDays} iconWrap="bg-violet-50" iconColor="text-indigo-500" label="This Month" value="KSh 8,000" meta="May 2024" trend={{ value: "+ 5.3%", tone: "positive" }} /><StatCard icon={Clock} iconWrap="bg-amber-50" iconColor="text-amber-500" label="Pending Requests" value="KSh 5,000" meta="2 requests" /><StatCard icon={Wallet} iconWrap="bg-violet-50" iconColor="text-violet-500" label="Available to Withdraw" value="KSh 15,450" meta="Across all chamas" /></>}>
        <div className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
          <MemberCard className="overflow-hidden">
            <SectionTabs tabs={[{ label: "All Withdrawals", active: true }, { label: "Pending" }, { label: "Completed" }, { label: "Failed" }]} />
            <SearchFilterBar placeholder="Search withdrawals..." filters={["All Chamas"]} />
            <SimpleTable headers={["Date & Time", "Chama", "Amount", "Payment Method", "Status", "Reference", "Action"]} rows={rows.map((r, i) => (
              <TableRow key={i}>
                <td><div className="font-medium">{r.date}</div><div className="text-sm text-slate-500">{r.time}</div></td>
                <td><MemberIdentity name={r.chama} subline="" role={r.role} color={r.color} /></td>
                <td className="font-semibold">{r.amount}</td>
                <td><div>{r.method}</div><div className="text-sm text-slate-500">{r.meta}</div></td>
                <td><StatusBadge label={r.status} tone={r.tone} /></td>
                <td className="text-sm text-slate-600">{r.ref}</td>
                <td>{r.tone === "warning" ? <button className="rounded-lg border px-3 py-1.5 text-xs text-red-600">Cancel</button> : r.tone === "danger" ? <button className="rounded-lg border px-3 py-1.5 text-xs text-red-600">Retry</button> : <DownloadIconButton />}</td>
              </TableRow>
            ))} />
            <div className="flex items-center justify-between px-6 pb-4 pt-2 text-sm text-slate-500"><span>Showing 1 to 7 of 18 withdrawals</span></div>
            <Pager />
          </MemberCard>
          <div className="space-y-5">
            <MemberCard title={<span>Withdrawal Summary <span className="text-sm text-slate-400">(This Year)</span></span>}>
              <div className="grid grid-cols-[1fr_auto] gap-6 px-6 py-6 items-center">
                <MetricList items={[{ label: "Total Requested", value: "KSh 36,000" }, { label: "Total Completed", value: "KSh 27,000" }, { label: "Total Pending", value: "KSh 5,000" }, { label: "Total Failed", value: "KSh 4,000" }]} />
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full" style={{ background: "conic-gradient(#16a34a 0% 70%, #d10d0d 70% 85%, #f59e0b 85% 100%)" }}><div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white"><span className="text-base font-semibold">KSh 27,000</span><span className="text-[10px] text-slate-500">Completed</span></div></div>
              </div>
            </MemberCard>
            <MemberCard title="Common Payment Methods">
              <div className="space-y-4 px-6 py-5">
                {[{ icon: Smartphone, color: "#16a34a", bg: "bg-emerald-50", iconColor: "text-emerald-600", label: "M-Pesa", value: "KSh 18,000", pct: "66.7%" }, { icon: Building2, color: "#6366f1", bg: "bg-indigo-50", iconColor: "text-indigo-600", label: "Bank Transfer", value: "KSh 7,500", pct: "27.8%" }, { icon: CreditCard, color: "#dc2626", bg: "bg-red-50", iconColor: "text-red-600", label: "Airtel Money", value: "KSh 1,500", pct: "5.5%" }].map((m) => (
                  <div key={m.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-lg ${m.bg}`}><m.icon className={`h-5 w-5 ${m.iconColor}`} /></div><div className="font-medium">{m.label}</div></div>
                    <div className="text-right"><div className="font-semibold">{m.value}</div><div className="text-sm text-slate-500">{m.pct}</div></div>
                  </div>
                ))}
              </div>
            </MemberCard>
            <PromoCard title="Need Help with a Withdrawal?" description="Our support team is here to help you 24/7." buttonLabel="Contact Support" tone="soft" />
          </div>
        </div>
      </MemberPage>
    </MemberShell>
  );
}
