import { createFileRoute } from "@tanstack/react-router";
import { MemberShell } from "@/components/MemberShell";
import { TrendingUp, Check, Gift, Info } from "lucide-react";

export const Route = createFileRoute("/member/home")({ component: MemberHome });

function MemberHome() {
  return (
    <MemberShell subtitle="meeting in 3 days">
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_300px]">
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
    </MemberShell>
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
function Stat({ val, label, color }: { val: string; label: string; color?: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-2.5 py-2">
      <div className="text-sm font-medium" style={color ? { color } : undefined}>{val}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
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
function Snap({ val, label, color }: { val: string; label: string; color?: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2.5">
      <div className="text-base font-medium" style={color ? { color } : undefined}>{val}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
