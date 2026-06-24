import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ArrowDown, Users, FileText, ScrollText, BellRing, ChevronRight, Bell, Mail, Wallet, CreditCard, Cog } from "lucide-react";
import { MemberShell } from "@/components/MemberShell";
import { MemberCard, MemberPage, Pager, PromoCard, SearchFilterBar, SectionTabs } from "@/components/member-ui";

export const Route = createFileRoute("/member/notifications")({ component: MemberNotifications });

const today = [
  { icon: CalendarDays, color: "bg-emerald-50 text-emerald-600", title: "Contribution received", sub: "Ufanisi Chama: John Kamau contributed KSh 5,000", time: "11:30 AM", unread: true },
  { icon: ArrowDown, color: "bg-amber-50 text-amber-600", title: "Loan payment received", sub: "Pamoja Investment: Grace Wanjiku paid KSh 2,500", time: "10:15 AM", unread: true },
  { icon: Users, color: "bg-violet-50 text-indigo-600", title: "You were added to a chama", sub: "You have been added to Tujijenge Chama by Mary Wambui", time: "9:45 AM", unread: true },
];
const yesterday = [
  { icon: CalendarDays, color: "bg-blue-50 text-blue-600", title: "Upcoming meeting reminder", sub: "Ufanisi Chama meeting is tomorrow at 7:00 PM", time: "Yesterday, 5:30 PM" },
  { icon: FileText, color: "bg-emerald-50 text-emerald-600", title: "Monthly statement generated", sub: "Your April 2024 statement for Ufanisi Chama is ready", time: "Yesterday, 2:20 PM" },
  { icon: Users, color: "bg-amber-50 text-amber-600", title: "Loan approved", sub: "Your loan request of KSh 50,000 has been approved", time: "Yesterday, 11:10 AM" },
];
const week = [
  { icon: ScrollText, color: "bg-red-50 text-red-500", title: "Statement generated", sub: "March 2024 statement for Pamoja Investment is ready", time: "22 May 2024, 4:00 PM" },
  { icon: FileText, color: "bg-violet-50 text-indigo-600", title: "Profile updated", sub: "Your profile information was updated successfully", time: "21 May 2024, 3:15 PM" },
];

function NotifGroup({ title, items }: { title: string; items: typeof today }) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-slate-500">{title}</div>
      <MemberCard>
        <div className="divide-y">
          {items.map((n) => (
            <div key={n.title} className="flex items-center gap-3 px-5 py-4">
              {("unread" in n && n.unread) ? <span className="h-2 w-2 rounded-full bg-red-500" /> : <span className="h-2 w-2 rounded-full bg-transparent" />}
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${n.color}`}><n.icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm">{n.title}</div>
                <div className="text-sm text-slate-500 truncate">{n.sub}</div>
              </div>
              <div className="flex items-center gap-3"><span className="text-xs text-slate-500 whitespace-nowrap">{n.time}</span>{("unread" in n && n.unread) ? <span className="h-2 w-2 rounded-full bg-red-500" /> : <span className="h-2 w-2 rounded-full bg-slate-200" />}</div>
            </div>
          ))}
        </div>
      </MemberCard>
    </div>
  );
}

function MemberNotifications() {
  return (
    <MemberShell>
      <MemberPage title="Notifications" subtitle="Stay updated with everything happening in your chamas.">
        <div className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
          <MemberCard className="overflow-hidden">
            <SectionTabs tabs={[{ label: "All Notifications", active: true, badge: "3" }, { label: "Unread", badge: "3" }, { label: "Chama Updates" }, { label: "Transactions" }, { label: "Loans" }, { label: "System" }]} />
            <SearchFilterBar placeholder="Search notifications..." filters={["All Chamas"]} />
            <div className="space-y-6 px-6 pb-6">
              <NotifGroup title="Today" items={today} />
              <NotifGroup title="Yesterday" items={yesterday} />
              <NotifGroup title="This Week" items={week} />
            </div>
            <div className="flex items-center justify-between px-6 pb-4 text-sm text-slate-500"><span>Showing 1 to 7 of 24 notifications</span></div>
            <Pager />
          </MemberCard>

          <div className="space-y-5">
            <MemberCard title="Notification Summary">
              <div className="space-y-4 px-6 py-5">
                {[{ icon: Bell, color: "bg-red-50 text-red-500", label: "Unread", value: "3", tone: "text-red-500" }, { icon: Mail, color: "bg-emerald-50 text-emerald-600", label: "Total Notifications", value: "24", tone: "" }, { icon: CalendarDays, color: "bg-blue-50 text-blue-600", label: "This Week", value: "12", tone: "" }, { icon: FileText, color: "bg-amber-50 text-amber-600", label: "This Month", value: "48", tone: "" }].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-full ${s.color}`}><s.icon className="h-5 w-5" /></div><span>{s.label}</span></div>
                    <span className={`font-semibold ${s.tone}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </MemberCard>
            <MemberCard title="Notification Preferences">
              <div className="px-6 py-1 text-sm text-slate-500">Choose what you want to be notified about.</div>
              <div className="space-y-4 px-6 py-5">
                {[{ icon: Wallet, label: "Contribution Updates", sub: "Email, SMS, Push" }, { icon: Users, label: "Loan Updates", sub: "Email, SMS, Push" }, { icon: CalendarDays, label: "Meeting Reminders", sub: "Email, SMS, Push" }, { icon: Mail, label: "Chama Invitations", sub: "Email, SMS, Push" }, { icon: Cog, label: "System Updates", sub: "Email, Push" }].map((p) => (
                  <div key={p.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><p.icon className="h-5 w-5 text-slate-500" /><div><div className="font-medium text-sm">{p.label}</div><div className="text-xs text-slate-500">{p.sub}</div></div></div>
                    <button className="relative h-6 w-11 rounded-full bg-emerald-500"><span className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-white" /></button>
                  </div>
                ))}
              </div>
              <button className="mx-6 mb-6 flex w-[calc(100%-3rem)] items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium">Manage Preferences<ChevronRight className="h-4 w-4 text-slate-400" /></button>
            </MemberCard>
            <PromoCard title="Never Miss Important Updates" description="Enable push notifications and stay informed in real-time." buttonLabel="Enable Push Notifications" tone="soft" />
          </div>
        </div>
      </MemberPage>
    </MemberShell>
  );
}
