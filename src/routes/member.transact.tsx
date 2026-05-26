import { createFileRoute } from "@tanstack/react-router";
import { MemberShell } from "@/components/MemberShell";
import { Smartphone, Banknote, ArrowUp, ArrowDown, FileBarChart } from "lucide-react";

export const Route = createFileRoute("/member/transact")({ component: MemberTransact });

function MemberTransact() {
  return (
    <MemberShell title="Transact">
      <div className="flex flex-col gap-5">
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
      </div>
    </MemberShell>
  );
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
