import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, CalendarDays, Mail, ChevronRight } from "lucide-react";
import { MemberShell } from "@/components/MemberShell";
import { DownloadIconButton, MemberCard, MemberPage, MetricList, Pager, PromoCard, RowMenuButton, SearchFilterBar, SectionTabs, SimpleTable, StatCard, StatusBadge, TableRow, MemberIdentity } from "@/components/member-ui";

export const Route = createFileRoute("/member/statements")({ component: MemberStatements });

const stmts = [
  { name: "May 2024 Statement", sub: "Monthly statement", chama: "Ufanisi Chama", role: "Member", color: "#c00", type: "Monthly", period: "01 May 2024 – 31 May 2024", gen: "24 May 2024", time: "10:30 AM" },
  { name: "April 2024 Statement", sub: "Monthly statement", chama: "Ufanisi Chama", role: "Member", color: "#c00", type: "Monthly", period: "01 Apr 2024 – 30 Apr 2024", gen: "30 Apr 2024", time: "09:20 AM" },
  { name: "Q1 2024 Statement", sub: "Quarterly statement", chama: "Ufanisi Chama", role: "Member", color: "#c00", type: "Quarterly", period: "01 Jan 2024 – 31 Mar 2024", gen: "02 Apr 2024", time: "11:45 AM" },
  { name: "March 2024 Statement", sub: "Monthly statement", chama: "Pamoja Investment", role: "Treasurer", color: "#f59e0b", type: "Monthly", period: "01 Mar 2024 – 31 Mar 2024", gen: "01 Apr 2024", time: "08:15 AM" },
  { name: "February 2024 Statement", sub: "Monthly statement", chama: "Pamoja Investment", role: "Treasurer", color: "#f59e0b", type: "Monthly", period: "01 Feb 2024 – 29 Feb 2024", gen: "01 Mar 2024", time: "09:05 AM" },
  { name: "FY 2023 Annual Statement", sub: "Annual statement", chama: "Tujijenge Chama", role: "Member", color: "#16a34a", type: "Yearly", period: "01 Jan 2023 – 31 Dec 2023", gen: "05 Jan 2024", time: "10:00 AM" },
  { name: "December 2023 Statement", sub: "Monthly statement", chama: "Tujijenge Chama", role: "Member", color: "#16a34a", type: "Monthly", period: "01 Dec 2023 – 31 Dec 2023", gen: "02 Jan 2024", time: "11:30 AM" },
];

function MemberStatements() {
  return (
    <MemberShell>
      <MemberPage title="Statements" subtitle="View and download your chama financial statements and account summaries." statCards={<><StatCard icon={FileText} iconWrap="bg-emerald-50" iconColor="text-emerald-600" label="This Year (2024)" value="KSh 128,450" meta="Total Inflows" trend={{ value: "+ 12.5%", tone: "positive" }} /><StatCard icon={FileText} iconWrap="bg-red-50" iconColor="text-red-500" label="This Year (2024)" value="KSh 96,500" meta="Total Outflows" trend={{ value: "+ 8.6%", tone: "positive" }} /><StatCard icon={CalendarDays} iconWrap="bg-violet-50" iconColor="text-violet-500" label="Statements Generated" value="8" meta="All time" /><StatCard icon={Download} iconWrap="bg-amber-50" iconColor="text-amber-500" label="Last Statement" value="May 2024" meta="Generated on 24 May 2024" /></>}>
        <div className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
          <MemberCard className="overflow-hidden">
            <SectionTabs tabs={[{ label: "All Statements", active: true }, { label: "Yearly Statements" }, { label: "Monthly Statements" }]} />
            <SearchFilterBar placeholder="Search statements..." filters={["Statement Type", "Year", "Chama"]} />
            <SimpleTable headers={["Statement Name", "Chama", "Type", "Period", "Generated On", "Status", "Action", ""]} rows={stmts.map((s, i) => (
              <TableRow key={i}>
                <td><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50"><FileText className="h-5 w-5 text-emerald-600" /></div><div><div className="font-medium">{s.name}</div><div className="text-sm text-slate-500">{s.sub}</div></div></div></td>
                <td><MemberIdentity name={s.chama} subline="" role={s.role} color={s.color} /></td>
                <td>{s.type}</td>
                <td className="text-sm">{s.period}</td>
                <td><div className="font-medium">{s.gen}</div><div className="text-sm text-slate-500">{s.time}</div></td>
                <td><StatusBadge label="Generated" /></td>
                <td><DownloadIconButton /></td>
                <td><RowMenuButton /></td>
              </TableRow>
            ))} />
            <div className="flex items-center justify-between px-6 pb-4 pt-2 text-sm text-slate-500"><span>Showing 1 to 7 of 24 statements</span></div>
            <Pager />
          </MemberCard>
          <div className="space-y-5">
            <MemberCard title={<span>Statement Summary <span className="text-sm text-slate-400">(This Year)</span></span>}>
              <MetricList items={[{ label: "Total Inflows", value: "KSh 128,450", tone: "positive" }, { label: "Total Outflows", value: "KSh 96,500", tone: "negative" }, { label: "Net Flow", value: "KSh 31,950" }, { label: "Statements Generated", value: "8" }]} />
            </MemberCard>
            <MemberCard title="Quick Actions">
              <div className="space-y-3 px-5 py-5">
                {[{ icon: CalendarDays, bg: "bg-violet-50", color: "text-violet-600", label: "Generate Monthly Statement", sub: "Generate statement for current month" }, { icon: CalendarDays, bg: "bg-amber-50", color: "text-amber-600", label: "Generate Yearly Statement", sub: "Generate statement for this year" }, { icon: Mail, bg: "bg-emerald-50", color: "text-emerald-600", label: "Email Statements", sub: "Send statements to your email" }].map((q) => (
                  <button key={q.label} className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left">
                    <div className="flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-lg ${q.bg}`}><q.icon className={`h-5 w-5 ${q.color}`} /></div><div><div className="font-medium">{q.label}</div><div className="text-sm text-slate-500">{q.sub}</div></div></div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </MemberCard>
            <PromoCard title="Stay Informed, Stay Empowered." description="Download your statements and keep track of your chama's financial health." buttonLabel="Learn More" tone="soft" />
          </div>
        </div>
      </MemberPage>
    </MemberShell>
  );
}
