import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftRight, ArrowDown, Repeat, PieChart, ArrowUp, Download, Filter } from "lucide-react";
import { MemberShell } from "@/components/MemberShell";
import { ActivityList, DoughnutCard, MemberCard, MemberPage, Pager, PromoCard, RowMenuButton, SearchFilterBar, SectionTabs, SelectPill, SimpleTable, StatCard, StatusBadge, TableRow } from "@/components/member-ui";

export const Route = createFileRoute("/member/transactions")({ component: MemberTransactions });

const tx = [
  { date: "24 May 2024", time: "10:30 AM", desc: "Contribution to Ufanisi Chama", sub: "Monthly contribution", chama: "Ufanisi Chama", color: "#c00", type: "Income", amount: "+ KSh 2,500", tone: "positive" as const, method: "M-Pesa", meta: "0712 345 678", status: "Completed", st: "success" as const },
  { date: "24 May 2024", time: "02:45 PM", desc: "Withdrawal to Pamoja Investment", sub: "Member withdrawal", chama: "Pamoja Investment", color: "#f59e0b", type: "Expense", amount: "- KSh 5,000", tone: "negative" as const, method: "M-Pesa", meta: "0712 345 678", status: "Completed", st: "success" as const },
  { date: "24 May 2024", time: "04:20 PM", desc: "Loan repayment – Tujijenge Chama", sub: "Partial repayment", chama: "Tujijenge Chama", color: "#16a34a", type: "Income", amount: "+ KSh 3,000", tone: "positive" as const, method: "Bank Transfer", meta: "Equity Bank", status: "Completed", st: "success" as const },
  { date: "23 May 2024", time: "11:15 AM", desc: "Loan disbursed to Ufanisi Chama", sub: "Normal loan", chama: "Ufanisi Chama", color: "#c00", type: "Expense", amount: "- KSh 20,000", tone: "negative" as const, method: "M-Pesa", meta: "0712 345 678", status: "Completed", st: "success" as const },
  { date: "22 May 2024", time: "09:05 AM", desc: "Contribution to Pamoja Investment", sub: "Member contribution", chama: "Pamoja Investment", color: "#f59e0b", type: "Income", amount: "+ KSh 1,500", tone: "positive" as const, method: "Airtel Money", meta: "0723 456 789", status: "Completed", st: "success" as const },
  { date: "21 May 2024", time: "03:30 PM", desc: "Withdrawal request – Pending", sub: "Awaiting approval", chama: "Tujijenge Chama", color: "#16a34a", type: "Expense", amount: "- KSh 4,000", tone: "negative" as const, method: "M-Pesa", meta: "0712 345 678", status: "Pending", st: "warning" as const },
  { date: "20 May 2024", time: "10:00 AM", desc: "Loan interest payment", sub: "Interest collected", chama: "Ufanisi Chama", color: "#c00", type: "Income", amount: "+ KSh 800", tone: "positive" as const, method: "Bank Transfer", meta: "Co-op Bank", status: "Completed", st: "success" as const },
];

function MemberTransactions() {
  return (
    <MemberShell>
      <MemberPage title="Transactions" subtitle="View and track all financial transactions across your chamas." statCards={<><StatCard icon={ArrowLeftRight} iconWrap="bg-emerald-50" iconColor="text-emerald-600" label="Total Inflows" value="KSh 85,600" meta="This month" trend={{ value: "+ 15.2%", tone: "positive" }} /><StatCard icon={ArrowDown} iconWrap="bg-red-50" iconColor="text-red-500" label="Total Outflows" value="KSh 63,200" meta="This month" trend={{ value: "+ 8.6%", tone: "positive" }} /><StatCard icon={Repeat} iconWrap="bg-violet-50" iconColor="text-indigo-500" label="Net Flow" value="KSh 22,400" meta="This month" /><StatCard icon={PieChart} iconWrap="bg-amber-50" iconColor="text-amber-500" label="Total Transactions" value="56" meta="This month" trend={{ value: "+ 11.3%", tone: "positive" }} /></>}>
        <div className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
          <MemberCard className="overflow-hidden">
            <SectionTabs tabs={[{ label: "All Transactions", active: true }, { label: "By Chama" }, { label: "By Type" }, { label: "Pending" }, { label: "Reconciled" }]} />
            <div className="flex flex-wrap items-center gap-3 px-6 py-4">
              <SearchFilterBar placeholder="Search transactions..." filters={["01 May – 31 May 2024", "All Chamas"]} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-3">
              <div className="flex flex-wrap gap-2"><SelectPill label="Transaction Type" /><SelectPill label="Chama" /><SelectPill label="Payment Method" /><SelectPill label="Status" /></div>
              <div className="flex gap-2"><button className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"><Download className="h-4 w-4" />Export</button><button className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"><Filter className="h-4 w-4" />Filter</button></div>
            </div>
            <SimpleTable headers={["Date & Time", "Description", "Chama", "Type", "Amount", "Payment Method", "Status", ""]} rows={tx.map((t, i) => (
              <TableRow key={i}>
                <td><div className="font-medium">{t.date}</div><div className="text-sm text-slate-500">{t.time}</div></td>
                <td><div className="font-medium">{t.desc}</div><div className="text-sm text-slate-500">{t.sub}</div></td>
                <td><div className="flex items-center gap-2"><span className="h-8 w-8 rounded-full text-white grid place-items-center text-xs font-semibold" style={{ backgroundColor: t.color }}>{t.chama.charAt(0)}</span><div className="text-sm">{t.chama}</div></div></td>
                <td><div className="flex items-center gap-2"><span className={`flex h-7 w-7 items-center justify-center rounded-full ${t.tone === "positive" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>{t.tone === "positive" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}</span>{t.type}</div></td>
                <td className={`font-semibold ${t.tone === "positive" ? "text-emerald-600" : "text-red-500"}`}>{t.amount}</td>
                <td><div>{t.method}</div><div className="text-sm text-slate-500">{t.meta}</div></td>
                <td><StatusBadge label={t.status} tone={t.st} /></td>
                <td><RowMenuButton /></td>
              </TableRow>
            ))} />
            <div className="flex items-center justify-between px-6 pb-4 pt-2 text-sm text-slate-500"><span>Showing 1 to 7 of 56 transactions</span></div>
            <Pager />
          </MemberCard>
          <div className="space-y-5">
            <DoughnutCard title={<div className="flex items-center justify-between gap-3"><span>Transaction Breakdown <span className="text-sm text-slate-400">(This Month)</span></span><button className="text-sm font-semibold text-red-600">View details</button></div>} total="56 Transactions" segments={[{ color: "#16a34a", value: 56 }, { color: "#d10d0d", value: 41 }, { color: "#f59e0b", value: 3 }]} legend={[{ color: "#16a34a", label: "Income", value: "KSh 85,600", percent: "(56%)" }, { color: "#d10d0d", label: "Expenses", value: "KSh 63,200", percent: "(41%)" }, { color: "#f59e0b", label: "Loans", value: "KSh 8,400", percent: "(3%)" }]} />
            <MemberCard title="Recent Activity" action={<button className="text-[15px] font-semibold text-red-600">View all</button>}>
              <ActivityList items={[{ icon: ArrowUp, iconWrap: "bg-emerald-50", iconColor: "text-emerald-600", title: "Contribution to Ufanisi Chama", subtitle: "24 May 2024 · 10:30 AM", meta: "", value: "+ KSh 2,500", valueTone: "positive" }, { icon: ArrowDown, iconWrap: "bg-red-50", iconColor: "text-red-500", title: "Withdrawal to Pamoja Investment", subtitle: "24 May 2024 · 02:45 PM", meta: "", value: "- KSh 5,000", valueTone: "negative" }, { icon: ArrowUp, iconWrap: "bg-emerald-50", iconColor: "text-emerald-600", title: "Loan repayment – Tujijenge Chama", subtitle: "24 May 2024 · 04:20 PM", meta: "", value: "+ KSh 3,000", valueTone: "positive" }, { icon: ArrowDown, iconWrap: "bg-amber-50", iconColor: "text-amber-500", title: "Withdrawal request – Pending", subtitle: "23 May 2024 · 11:15 AM", meta: "", value: "- KSh 4,000", valueTone: "negative" }]} />
            </MemberCard>
            <PromoCard title="Track Every Move, Stay in Control." description="View your transactions and understand your finances better." buttonLabel="Download Statement" tone="red" />
          </div>
        </div>
      </MemberPage>
    </MemberShell>
  );
}
