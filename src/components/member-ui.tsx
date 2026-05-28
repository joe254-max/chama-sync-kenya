import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { type LucideIcon, ChevronDown, ChevronRight, Download, EllipsisVertical, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MemberPage({ title, subtitle, statCards, children }: { title: string; subtitle: string; statCards?: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-[26px] font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="text-[15px] text-slate-500">{subtitle}</p>
      </div>
      {statCards && <div className="grid gap-5 xl:grid-cols-4">{statCards}</div>}
      {children}
      <MemberFooter />
    </div>
  );
}

export function StatCard({ icon: Icon, iconWrap, iconColor, label, value, meta, trend }: { icon: LucideIcon; iconWrap: string; iconColor: string; label: string; value: string; meta: string; trend?: { value: string; tone: "positive" | "negative" } }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white px-7 py-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${iconWrap}`}><Icon className={`h-6 w-6 ${iconColor}`} /></div>
        {trend ? <span className={`pt-1 text-[15px] font-semibold ${trend.tone === "positive" ? "text-emerald-600" : "text-red-500"}`}>{trend.value}</span> : null}
      </div>
      <div className="mt-3 text-[15px] text-slate-500">{label}</div>
      <div className="mt-1 text-[20px] font-semibold text-slate-900">{value}</div>
      <div className="mt-2 text-[15px] text-slate-600">{meta}</div>
    </div>
  );
}

export function MemberCard({ title, action, className = "", children }: { title?: ReactNode; action?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={`rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.05)] ${className}`}>
      {(title || action) && <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5"><div className="text-[17px] font-semibold text-slate-900">{title}</div>{action}</div>}
      {children}
    </section>
  );
}

export function SectionTabs({ tabs }: { tabs: { label: string; active?: boolean; badge?: string }[] }) {
  return <div className="flex flex-wrap items-center gap-10 border-b border-slate-100 px-4 sm:px-6">{tabs.map((tab) => <button key={tab.label} className={`relative flex items-center gap-2 py-5 text-[15px] font-medium ${tab.active ? "text-red-600" : "text-slate-500 hover:text-slate-800"}`}>{tab.label}{tab.badge ? <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-red-700 px-1.5 text-[11px] font-semibold text-white">{tab.badge}</span> : null}{tab.active ? <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-red-600" /> : null}</button>)}</div>;
}

export function SearchFilterBar({ placeholder, filters, extra }: { placeholder: string; filters?: string[]; extra?: ReactNode }) {
  return <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end"><SearchInput placeholder={placeholder} />{filters?.map((filter) => <SelectPill key={filter} label={filter} />)}</div>{extra}</div>;
}

export function SearchInput({ placeholder }: { placeholder: string }) {
  return <label className="flex h-12 min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-400 lg:min-w-[240px]"><Search className="h-4 w-4" /><input className="w-full bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400" placeholder={placeholder} /></label>;
}

export function SelectPill({ label }: { label: string }) {
  return <button className="inline-flex h-12 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-[14px] font-medium text-slate-700">{label}<ChevronDown className="h-4 w-4 text-slate-500" /></button>;
}

export function DoughnutCard({ title, total, segments, legend }: { title: ReactNode; total: string; segments: { color: string; value: number }[]; legend: { color: string; label: string; value: string; percent?: string }[] }) {
  const totalValue = segments.reduce((sum, segment) => sum + segment.value, 0);
  let start = 0;
  const gradient = `conic-gradient(${segments.map((segment) => { const from = start; const end = start + (segment.value / totalValue) * 100; start = end; return `${segment.color} ${from}% ${end}%`; }).join(", ")})`;
  return (
    <MemberCard title={title} className="overflow-hidden">
      <div className="grid gap-8 px-6 py-6 md:grid-cols-[220px_1fr] md:items-center">
        <div className="flex justify-center"><div className="relative flex h-[172px] w-[172px] items-center justify-center rounded-full" style={{ background: gradient }}><div className="flex h-[108px] w-[108px] flex-col items-center justify-center rounded-full bg-white text-center"><span className="text-[14px] text-slate-500">Total</span><span className="text-[17px] font-semibold leading-tight text-slate-900">{total}</span></div></div></div>
        <div className="space-y-5">{legend.map((item) => <div key={item.label} className="grid grid-cols-[14px_1fr_auto] items-start gap-3 text-[15px] text-slate-700"><span className="mt-1.5 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} /><div><div className="font-medium text-slate-900">{item.label}</div><div className="mt-1 font-semibold text-slate-900">{item.value}</div></div>{item.percent ? <div className="pt-1 text-slate-700">{item.percent}</div> : null}</div>)}</div>
      </div>
    </MemberCard>
  );
}

export function PromoCard({ title, description, buttonLabel, tone = "red", artwork }: { title: string; description: string; buttonLabel: string; tone?: "red" | "soft"; artwork?: ReactNode }) {
  return <div className={`overflow-hidden rounded-[22px] p-7 shadow-[0_20px_55px_rgba(15,23,42,0.05)] ${tone === "red" ? "bg-[linear-gradient(135deg,#be0000_0%,#d10d0d_55%,#c10a0a_100%)] text-white" : "bg-[linear-gradient(135deg,#fff4f3_0%,#fdecec_100%)] text-slate-900"}`}><div className="grid gap-6 md:grid-cols-[1.1fr_.9fr] md:items-end"><div><h3 className="max-w-[260px] text-[22px] font-semibold leading-tight">{title}</h3><p className={`mt-4 max-w-[290px] text-[15px] leading-7 ${tone === "red" ? "text-white/85" : "text-slate-600"}`}>{description}</p><Button className={`mt-7 h-12 rounded-[14px] px-6 text-[15px] font-semibold ${tone === "red" ? "bg-white text-red-700 hover:bg-white/90" : "bg-red-700 text-white hover:bg-red-800"}`}>{buttonLabel}</Button></div><div className="flex min-h-[170px] items-end justify-center">{artwork}</div></div></div>;
}

export function ListingFooter({ text }: { text: string }) { return <div className="px-6 py-5 text-[14px] text-slate-500">{text}</div>; }

export function Pager() { const pages = ["1", "2", "3", "4"]; return <div className="flex items-center justify-end gap-3 px-6 pb-6"><button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">‹</button>{pages.map((page, index) => <button key={page} className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-[14px] font-medium ${index === 0 ? "bg-red-700 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>{page}</button>)}<span className="px-1 text-slate-400">…</span><button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">›</button></div>; }

export function SummaryList({ items }: { items: { icon: LucideIcon; iconWrap: string; iconColor: string; label: string; value: string; meta?: string; badge?: string }[] }) {
  return <div className="space-y-3 px-5 py-5">{items.map((item) => { const Icon = item.icon; return <div key={item.label} className="flex items-center justify-between gap-3 rounded-[18px] border border-slate-100 px-4 py-3"><div className="flex items-center gap-3"><div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.iconWrap}`}><Icon className={`h-5 w-5 ${item.iconColor}`} /></div><div><div className="text-[15px] font-medium text-slate-900">{item.label}</div>{(item.value || item.meta) && <div className="mt-1 text-[14px] text-slate-500">{item.value}{item.meta ? ` · ${item.meta}` : ""}</div>}</div></div>{item.badge ? <span className="rounded-full bg-red-50 px-3 py-1 text-[13px] font-medium text-red-500">{item.badge}</span> : null}</div>; })}</div>;
}

export function MetricList({ items }: { items: { label: string; value: string; tone?: "default" | "positive" | "negative" }[] }) { return <div className="space-y-4 px-6 py-6">{items.map((item) => <div key={item.label} className="flex items-center justify-between gap-5 text-[15px]"><span className="text-slate-500">{item.label}</span><span className={`font-semibold ${item.tone === "positive" ? "text-emerald-600" : item.tone === "negative" ? "text-red-600" : "text-slate-900"}`}>{item.value}</span></div>)}</div>; }

export function ActivityList({ items }: { items: { icon: LucideIcon; iconWrap: string; iconColor: string; title: string; subtitle: string; meta: string; value?: string; valueTone?: "positive" | "negative" | "neutral" }[] }) {
  return <div className="space-y-4 px-5 py-5">{items.map((item) => { const Icon = item.icon; return <div key={item.title} className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><div className={`mt-0.5 flex h-11 w-11 items-center justify-center rounded-full ${item.iconWrap}`}><Icon className={`h-5 w-5 ${item.iconColor}`} /></div><div><div className="text-[15px] font-medium text-slate-900">{item.title}</div><div className="text-[14px] text-slate-500">{item.subtitle}</div><div className="mt-0.5 text-[13px] text-slate-400">{item.meta}</div></div></div>{item.value ? <span className={`whitespace-nowrap text-[15px] font-semibold ${item.valueTone === "positive" ? "text-emerald-600" : item.valueTone === "negative" ? "text-red-600" : "text-slate-700"}`}>{item.value}</span> : null}</div>; })}</div>;
}

export function SimpleTable({ headers, rows }: { headers: string[]; rows: ReactNode[] }) {
  return <div className="overflow-x-auto px-3 pb-3 sm:px-5 sm:pb-5"><table className="min-w-full border-separate border-spacing-0"><thead><tr>{headers.map((header) => <th key={header} className="border-b border-slate-100 px-3 py-4 text-left text-[13px] font-semibold text-slate-900">{header}</th>)}</tr></thead><tbody>{rows}</tbody></table></div>;
}

export function TableRow({ children }: { children: ReactNode }) { return <tr className="[&>td]:border-b [&>td]:border-slate-100 [&>td]:px-3 [&>td]:py-4 [&>td]:align-top">{children}</tr>; }

export function MemberIdentity({ name, subline, role, color }: { name: string; subline: string; role: string; color: string }) {
  return <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ backgroundColor: color }}><span className="text-lg font-semibold">{name.charAt(0)}</span></div><div><div className="text-[15px] font-semibold text-slate-900">{name}</div><div className="mt-0.5 text-[14px] text-slate-500">{subline}</div><span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium ${role === "Treasurer" ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-500"}`}>{role}</span></div></div>;
}

export function StatusBadge({ label, tone = "success" }: { label: string; tone?: "success" | "warning" | "danger" | "neutral" }) {
  const cls = tone === "success" ? "bg-emerald-100 text-emerald-700" : tone === "warning" ? "bg-amber-100 text-amber-600" : tone === "danger" ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600";
  return <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium ${cls}`}>{label}</span>;
}

export function ActionGhost({ label }: { label: string }) { return <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[14px] font-medium text-slate-700">{label}<ChevronRight className="h-4 w-4 text-slate-400" /></button>; }
export function RowMenuButton() { return <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500"><EllipsisVertical className="h-4 w-4" /></button>; }
export function DownloadIconButton() { return <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-red-600"><Download className="h-4 w-4" /></button>; }
export function FooterActionRow({ text, buttonLabel }: { text: string; buttonLabel: string }) { return <div className="flex flex-col items-center justify-between gap-4 rounded-[20px] border border-dashed border-slate-200 px-6 py-5 text-center md:flex-row md:text-left"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-[28px] text-red-600">+</div><div><div className="text-[20px] font-medium text-slate-900">{buttonLabel}</div><div className="mt-1 text-[14px] text-slate-500">{text}</div></div></div><ChevronRight className="hidden h-5 w-5 text-slate-300 md:block" /></div>; }
export function SidebarLinkButton({ to, children }: { to: string; children: ReactNode }) { return <Link to={to}>{children}</Link>; }
export function MemberFooter() { return <div className="flex flex-col gap-3 border-t border-slate-100 px-2 pt-5 text-[14px] text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>© 2024 M-Chama. All rights reserved.</span><div className="flex items-center gap-8"><span>Terms &amp; Conditions</span><span>Privacy Policy</span></div></div>; }
