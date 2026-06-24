import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Hourglass, CalendarDays, CheckSquare } from "lucide-react";
import { MemberShell } from "@/components/MemberShell";
import { DoughnutCard, FooterActionRow, MemberCard, MemberPage, MemberIdentity, Pager, PromoCard, SearchFilterBar, SectionTabs, SimpleTable, StatCard, StatusBadge, TableRow } from "@/components/member-ui";

export const Route = createFileRoute("/member/loans")({ component: MemberLoans });

const loans = [
  { id: "LN-2024-001", date: "15 May 2024", chama: "Ufanisi Chama", role: "Member", color: "#c00", type: "Normal Loan", amount: "KSh 50,000", out: "KSh 20,000", outMeta: "40% left", next: "24 May 2024", nextAmount: "KSh 5,000", status: "Active", tone: "success" as const },
  { id: "LN-2024-002", date: "10 May 2024", chama: "Pamoja Investment", role: "Treasurer", color: "#f59e0b", type: "Emergency Loan", amount: "KSh 30,000", out: "KSh 25,000", outMeta: "83.3% left", next: "30 May 2024", nextAmount: "KSh 5,000", status: "Active", tone: "success" as const },
  { id: "LN-2024-003", date: "05 Apr 2024", chama: "Tujijenge Chama", role: "Member", color: "#16a34a", type: "Asset Loan", amount: "KSh 80,000", out: "KSh 13,500", outMeta: "16.9% left", next: "05 Jun 2024", nextAmount: "KSh 4,500", status: "Active", tone: "success" as const },
  { id: "LN-2023-018", date: "20 Dec 2023", chama: "Ufanisi Chama", role: "Member", color: "#c00", type: "Normal Loan", amount: "KSh 25,000", out: "KSh 0", outMeta: "Paid in full", next: "-", nextAmount: "", status: "Completed", tone: "neutral" as const },
  { id: "LN-2023-015", date: "15 Nov 2023", chama: "Pamoja Investment", role: "Treasurer", color: "#f59e0b", type: "Emergency Loan", amount: "KSh 20,000", out: "KSh 0", outMeta: "Paid in full", next: "-", nextAmount: "", status: "Completed", tone: "neutral" as const },
  { id: "LN-2023-010", date: "10 Oct 2023", chama: "Tujijenge Chama", role: "Member", color: "#16a34a", type: "Normal Loan", amount: "KSh 15,000", out: "KSh 0", outMeta: "Paid in full", next: "-", nextAmount: "", status: "Completed", tone: "neutral" as const },
];

function MemberLoans() {
  return (
    <MemberShell>
      <MemberPage title="Loans" subtitle="Manage your loan applications, track repayments and view loan history." statCards={<><StatCard icon={Wallet} iconWrap="bg-emerald-50" iconColor="text-emerald-600" label="Total Loaned" value="KSh 128,000" meta="All time" trend={{ value: "+ 12.5%", tone: "positive" }} /><StatCard icon={Hourglass} iconWrap="bg-violet-50" iconColor="text-indigo-500" label="Outstanding Balance" value="KSh 58,500" meta="Across all loans" trend={{ value: "+ 5.3%", tone: "positive" }} /><StatCard icon={CalendarDays} iconWrap="bg-amber-50" iconColor="text-amber-500" label="Active Loans" value="2" meta="Currently active" /><StatCard icon={CheckSquare} iconWrap="bg-violet-50" iconColor="text-violet-500" label="Total Repaid" value="KSh 69,500" meta="All time" trend={{ value: "+ 18.7%", tone: "positive" }} /></>}>
        <div className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
          <MemberCard className="overflow-hidden">
            <SectionTabs tabs={[{ label: "All Loans", active: true }, { label: "Active Loans" }, { label: "Loan History" }, { label: "Applications" }]} />
            <SearchFilterBar placeholder="Search loans..." filters={["All Chamas"]} />
            <SimpleTable headers={["Loan ID", "Chama", "Loan Type", "Amount", "Outstanding", "Next Payment", "Status", "Action"]} rows={loans.map((l) => (
              <TableRow key={l.id}>
                <td><div className="font-medium">{l.id}</div><div className="text-sm text-slate-500">{l.date}</div></td>
                <td><MemberIdentity name={l.chama} subline="" role={l.role} color={l.color} /></td>
                <td>{l.type}</td>
                <td className="font-semibold">{l.amount}</td>
                <td><div className="font-semibold">{l.out}</div><div className="text-sm text-slate-500">{l.outMeta}</div></td>
                <td><div className="font-medium">{l.next}</div>{l.nextAmount && <div className="text-sm text-slate-500">{l.nextAmount}</div>}</td>
                <td><StatusBadge label={l.status} tone={l.tone} /></td>
                <td><button className="rounded-xl border px-4 py-2 text-sm font-medium">View</button></td>
              </TableRow>
            ))} />
            <div className="px-6 pb-6"><FooterActionRow buttonLabel="Apply for a New Loan" text="Need financial support? Apply for a loan from your chama." /></div>
            <MemberCard title={<span>Loan Summary <span className="text-sm text-slate-400">(This Year)</span></span>} className="mx-6 mb-6">
              <div className="grid grid-cols-2 gap-4 px-6 py-6 md:grid-cols-5">
                <div><div className="text-sm text-slate-500">Total Disbursed</div><div className="text-2xl font-semibold">KSh 128,000</div><div className="text-emerald-600 text-sm">↑ 12.5% vs last year</div></div>
                <div><div className="text-sm text-slate-500">Total Repaid</div><div className="text-2xl font-semibold">KSh 69,500</div><div className="text-emerald-600 text-sm">↑ 18.7% vs last year</div></div>
                <div><div className="text-sm text-slate-500">Total Outstanding</div><div className="text-2xl font-semibold">KSh 58,500</div><div className="text-emerald-600 text-sm">↑ 5.3% vs last year</div></div>
                <div><div className="text-sm text-slate-500">Defaulted Loans</div><div className="text-2xl font-semibold">KSh 2,000</div><div className="text-red-500 text-sm">↑ 2.1% vs last year</div></div>
                <div className="flex items-center justify-center"><div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-emerald-600 border-r-slate-200 border-b-slate-200"><div className="text-center"><div className="text-xl font-semibold">54.3%</div><div className="text-[10px] text-slate-500">Repayment Rate</div></div></div></div>
              </div>
            </MemberCard>
            <Pager />
          </MemberCard>
          <div className="space-y-5">
            <DoughnutCard title={<span>Loan Overview <span className="text-sm text-slate-400">(This Year)</span></span>} total="KSh 128,000" segments={[{ color: "#16a34a", value: 54.3 }, { color: "#f59e0b", value: 45.7 }, { color: "#d10d0d", value: 0.001 }]} legend={[{ color: "#16a34a", label: "Total Disbursed", value: "KSh 128,000", percent: "100%" }, { color: "#f59e0b", label: "Total Repaid", value: "KSh 69,500", percent: "54.3%" }, { color: "#d10d0d", label: "Total Outstanding", value: "KSh 58,500", percent: "45.7%" }]} />
            <MemberCard title="Upcoming Payments" action={<button className="text-[15px] font-semibold text-red-600">View all</button>}>
              <div className="space-y-5 px-6 py-5">
                {[["Ufanisi Chama", "24 May 2024 · KSh 5,000", "In 2 days", "bg-red-50 text-red-500"], ["Pamoja Investment", "30 May 2024 · KSh 5,000", "In 8 days", "bg-amber-50 text-amber-500"]].map(([name, time, badge, cls]) => <div key={name} className="flex items-center justify-between"><div><div className="font-semibold">{name}</div><div className="text-sm text-slate-500">{time}</div></div><span className={`rounded-full px-3 py-1 text-xs font-medium ${cls}`}>{badge}</span></div>)}
              </div>
            </MemberCard>
            <PromoCard title="Grow Your Dreams, Together" description="Access loans at friendly rates and grow your financial future with your chama." buttonLabel="Apply for a Loan" tone="soft" />
          </div>
        </div>
      </MemberPage>
    </MemberShell>
  );
}
