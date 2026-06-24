import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Pencil, ShieldCheck, BadgeCheck, User, IdCard, CalendarDays, MapPin, Bell, MessageSquare, BellRing, Languages, Coins, Sun, Lock, ShieldAlert, Users, Wallet, ArrowDown, PiggyBank, ArrowUp, UserPlus, FileEdit, KeyRound } from "lucide-react";
import { MemberShell } from "@/components/MemberShell";
import { MemberCard, MemberPage, StatCard } from "@/components/member-ui";

export const Route = createFileRoute("/member/profile")({ component: MemberProfile });

function MemberProfile() {
  return (
    <MemberShell>
      <MemberPage title="My Profile" subtitle="Manage your account settings and preferences.">
        <MemberCard className="overflow-hidden">
          <div className="grid gap-6 p-6 md:grid-cols-[1fr_1.1fr_1.1fr]">
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-24 rounded-full bg-slate-200 grid place-items-center text-3xl font-semibold text-slate-700">J<button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white border grid place-items-center"><Pencil className="h-4 w-4" /></button></div>
              <div>
                <div className="flex items-center gap-2"><span className="text-xl font-semibold">John Kamau</span><span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-600 px-2 py-1 text-xs font-medium"><BadgeCheck className="h-3 w-3" />Verified</span></div>
                <div className="text-sm text-slate-500">Member since January 2023</div>
                <div className="mt-3 flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-slate-400" />john.kamau@email.com</div>
                <div className="mt-1 flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-slate-400" />+254 712 345 678</div>
              </div>
            </div>
            <div className="rounded-2xl bg-red-50 p-5">
              <div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200"><ShieldCheck className="h-5 w-5 text-slate-600" /></div><div><div className="font-semibold">Platinum Member</div><div className="text-sm text-slate-500">Your current membership tier</div></div></div>
              <div className="mt-4 h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-red-600" style={{ width: "62%" }} /></div>
              <div className="mt-2 text-sm text-slate-600">1,250 / 2,000 points</div>
              <div className="text-sm text-slate-500">750 points to Diamond</div>
            </div>
            <div className="rounded-2xl p-5">
              <div className="flex items-center justify-between"><div className="font-semibold">Profile Completion</div><span className="text-emerald-600 font-semibold">85% Complete</span></div>
              <div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: "85%" }} /></div>
              <div className="mt-3 text-sm text-slate-500">Keep your profile updated for better chama experience</div>
            </div>
          </div>
        </MemberCard>

        <div className="text-lg font-semibold">Quick Overview</div>
        <div className="grid gap-5 xl:grid-cols-5">
          <StatCard icon={Users} iconWrap="bg-red-50" iconColor="text-red-500" label="Total Chamas" value="3" meta="Active memberships" />
          <StatCard icon={PiggyBank} iconWrap="bg-emerald-50" iconColor="text-emerald-600" label="Total Savings" value="KSh 128,450" meta="Across all chamas" trend={{ value: "+ 12.5%", tone: "positive" }} />
          <StatCard icon={ArrowDown} iconWrap="bg-violet-50" iconColor="text-indigo-500" label="Total Contributions" value="KSh 96,500" meta="This year" trend={{ value: "+ 12.5%", tone: "positive" }} />
          <StatCard icon={CalendarDays} iconWrap="bg-amber-50" iconColor="text-amber-500" label="Upcoming Meetings" value="2" meta="In the next 7 days" />
          <StatCard icon={Wallet} iconWrap="bg-violet-50" iconColor="text-violet-500" label="Active Loans" value="1" meta="Totaling KSh 25,000" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr_1fr]">
          <MemberCard title="Personal Information" action={<button className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"><Pencil className="h-3 w-3" />Edit</button>}>
            <div className="space-y-4 px-6 py-5">
              {[{ icon: User, label: "Full Name", value: "John Kamau" }, { icon: Mail, label: "Email Address", value: "john.kamau@email.com" }, { icon: Phone, label: "Phone Number", value: "+254 712 345 678" }, { icon: IdCard, label: "ID Number", value: "12345678" }, { icon: CalendarDays, label: "Date of Birth", value: "15 March 1990" }, { icon: MapPin, label: "Residential Address", value: "123 Kenyatta Avenue, Nairobi, Kenya" }].map((f) => <div key={f.label} className="flex items-start justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"><div className="flex items-center gap-3 text-slate-500"><f.icon className="h-4 w-4" /><span className="text-sm">{f.label}</span></div><div className="text-right text-sm font-medium">{f.value}</div></div>)}
            </div>
            <div className="mx-6 mb-6 rounded-xl border bg-emerald-50/60 px-4 py-3 flex items-center justify-between"><div className="flex items-center gap-3 text-emerald-700"><BadgeCheck className="h-5 w-5" /><div><div className="font-semibold">Identity Verified</div><div className="text-xs">Your identity has been verified successfully.</div></div></div><span className="text-xs text-emerald-700">✓ Verified</span></div>
          </MemberCard>

          <div className="space-y-5">
            <MemberCard title="Preferences" action={<button className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"><Pencil className="h-3 w-3" />Edit</button>}>
              <div className="space-y-4 px-6 py-5">
                {[{ icon: Bell, label: "Email Notifications", value: "Enabled" }, { icon: MessageSquare, label: "SMS Notifications", value: "Enabled" }, { icon: BellRing, label: "Push Notifications", value: "Enabled" }, { icon: Languages, label: "Language", value: "English" }, { icon: Coins, label: "Currency", value: "Kenyan Shilling (KSh)" }, { icon: Sun, label: "Theme", value: "Light Mode" }].map((f) => <div key={f.label} className="flex items-center justify-between gap-4 text-sm"><div className="flex items-center gap-3 text-slate-500"><f.icon className="h-4 w-4" />{f.label}</div><div className="font-medium">{f.value}</div></div>)}
              </div>
            </MemberCard>
            <MemberCard title="Security" action={<button className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"><Pencil className="h-3 w-3" />Update</button>}>
              <div className="space-y-4 px-6 py-5">
                <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Lock className="h-4 w-4 text-slate-500" /><div><div className="font-medium text-sm">Password</div><div className="text-xs text-slate-500">Last changed 2 months ago</div></div></div><span className="text-sm">••••••</span></div>
                <div className="flex items-center justify-between"><div className="flex items-center gap-3"><ShieldAlert className="h-4 w-4 text-slate-500" /><div className="font-medium text-sm">Two-Factor Authentication</div></div><span className="text-emerald-600 text-sm font-medium">+ Enabled</span></div>
              </div>
            </MemberCard>
          </div>

          <div className="space-y-5">
            <MemberCard title="Recent Activity" action={<button className="text-sm font-semibold text-red-600">View All</button>}>
              <div className="space-y-4 px-6 py-5">
                {[{ icon: ArrowUp, color: "bg-emerald-50 text-emerald-600", title: "Contribution made", sub: "Ufanisi Chama", value: "KSh 5,000", meta: "2 hours ago" }, { icon: ArrowDown, color: "bg-amber-50 text-amber-600", title: "Loan payment", sub: "Pamoja Investment", value: "KSh 2,500", meta: "1 day ago" }, { icon: UserPlus, color: "bg-violet-50 text-indigo-600", title: "Joined new chama", sub: "Tujijenge Chama", value: "", meta: "1 day ago" }, { icon: FileEdit, color: "bg-red-50 text-red-500", title: "Profile updated", sub: "Email address changed", value: "", meta: "3 days ago" }, { icon: KeyRound, color: "bg-slate-100 text-slate-600", title: "Password changed", sub: "", value: "", meta: "2 weeks ago" }].map((a) => (
                  <div key={a.title} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-full ${a.color}`}><a.icon className="h-4 w-4" /></div><div><div className="text-sm font-medium">{a.title}</div><div className="text-xs text-slate-500">{a.sub}</div></div></div>
                    <div className="text-right"><div className="text-sm font-semibold">{a.value}</div><div className="text-xs text-slate-400">{a.meta}</div></div>
                  </div>
                ))}
              </div>
            </MemberCard>
            <div className="rounded-[22px] bg-[linear-gradient(135deg,#fff4f3_0%,#fdecec_100%)] p-6">
              <div className="font-semibold text-lg">Refer & Earn</div>
              <p className="mt-2 text-sm text-slate-600">Invite friends to join M-Chama and earn rewards together.</p>
              <button className="mt-4 rounded-xl bg-red-700 text-white px-5 py-2.5 text-sm font-semibold">Invite Friends</button>
            </div>
          </div>
        </div>
      </MemberPage>
    </MemberShell>
  );
}
