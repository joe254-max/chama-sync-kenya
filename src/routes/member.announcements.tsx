import { createFileRoute } from "@tanstack/react-router";
import { MemberShell } from "@/components/MemberShell";
import { Users, Clock, Calendar, MapPin, Banknote, Check, X } from "lucide-react";

export const Route = createFileRoute("/member/announcements")({ component: MemberAnnouncements });

function MemberAnnouncements() {
  return (
    <MemberShell title="Announcements">
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_320px]">
        {/* Announcements list */}
        <div className="rounded-xl border bg-background p-4">
          <div className="mb-3 text-sm font-medium">All announcements</div>
          <Announcement text="Loan applications are open until Friday 17 May. Apply in the Loans tab." time="2 hours ago · Officer Grace Auma" />
          <Announcement text="Next meeting venue changed to Kwa Chief's Office. Same time applies." time="Yesterday · Officer Grace Auma" />
          <Announcement text="April share-out has been recorded. Check your statement for details." time="3 days ago · Officer Grace Auma" read />
        </div>

        {/* Meeting card */}
        <div className="rounded-xl border bg-background p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-md bg-[#EEEDFE]"><Users className="h-[17px] w-[17px] text-[#7F77DD]" /></div>
            <div>
              <div className="text-sm font-medium">Upcoming meeting</div>
              <div className="text-xs text-muted-foreground">Sisi Sote Chama</div>
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between rounded-md bg-[#EEEDFE] px-3 py-2">
            <div className="text-xs font-medium text-[#3C3489] flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Meeting in</div>
            <div className="text-xl font-medium text-[#7F77DD]">3 days</div>
          </div>
          <div className="mb-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
            <Row icon={Calendar}>Thursday, 16 May 2026</Row>
            <Row icon={Clock}>2:00 PM</Row>
            <Row icon={MapPin}>Kwa Chief's Office, Kitale</Row>
            <Row icon={Banknote}>Contribution due: KES 1,400</Row>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-1 rounded-md border border-[#9FE1CB] bg-[#E1F5EE] px-2 py-2 text-xs font-medium text-[#085041]"><Check className="h-3.5 w-3.5" />I will attend</button>
            <button className="flex items-center justify-center gap-1 rounded-md border bg-muted/40 px-2 py-2 text-xs text-muted-foreground"><X className="h-3.5 w-3.5" />I'll be absent</button>
          </div>
        </div>
      </div>
    </MemberShell>
  );
}

function Row({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return <div className="flex items-center gap-2"><Icon className="h-3.5 w-3.5 text-[#7F77DD]" />{children}</div>;
}
function Announcement({ text, time, read }: { text: string; time: string; read?: boolean }) {
  return (
    <div className="flex gap-2.5 border-b py-2.5 last:border-b-0 last:pb-0">
      <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${read ? "bg-border" : "bg-[#7F77DD]"}`} />
      <div>
        <div className="text-[13px] leading-snug">{text}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">{time}</div>
      </div>
    </div>
  );
}
