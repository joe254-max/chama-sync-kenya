import { createFileRoute } from "@tanstack/react-router";
import { Search, Rocket, Users, Wallet, HandCoins, ArrowDown, FileText, UserRound, CreditCard, ShieldCheck, MessageCircle, Mail, Phone, ClipboardList, ChevronRight, Lightbulb, Video, BookOpen, HelpCircle, Megaphone, Newspaper, MonitorCog, FileQuestion } from "lucide-react";
import { MemberShell } from "@/components/MemberShell";
import { MemberCard, MemberPage } from "@/components/member-ui";

export const Route = createFileRoute("/member/help")({ component: MemberHelp });

const topics = [
  { icon: Rocket, color: "bg-red-50 text-red-500", title: "Getting Started", sub: "Learn the basics of using M-Chama" },
  { icon: Users, color: "bg-emerald-50 text-emerald-600", title: "Managing Chamas", sub: "Create, join and manage your chamas" },
  { icon: Wallet, color: "bg-amber-50 text-amber-600", title: "Contributions", sub: "How to make, track and manage contributions" },
  { icon: HandCoins, color: "bg-violet-50 text-indigo-600", title: "Loans & Borrowing", sub: "Apply, track and repay chama loans" },
  { icon: ArrowDown, color: "bg-blue-50 text-blue-600", title: "Withdrawals", sub: "Withdraw funds from your chama" },
  { icon: FileText, color: "bg-red-50 text-red-500", title: "Statements & Reports", sub: "View and download your chama reports" },
  { icon: UserRound, color: "bg-emerald-50 text-emerald-600", title: "Account & Profile", sub: "Manage your account settings and profile" },
  { icon: CreditCard, color: "bg-amber-50 text-amber-600", title: "Payments & Transactions", sub: "Understand payments and transaction history" },
  { icon: ShieldCheck, color: "bg-violet-50 text-indigo-600", title: "Security & Privacy", sub: "Keep your account safe and secure" },
];

const contacts = [
  { icon: MessageCircle, color: "bg-emerald-50 text-emerald-600", title: "Live Chat", sub: "Chat with our support team", meta: "Online", metaColor: "text-emerald-600 bg-emerald-50" },
  { icon: Mail, color: "bg-violet-50 text-indigo-600", title: "Email Support", sub: "support@m-chama.co.ke", meta: "We reply within 24 hours", metaColor: "text-slate-500 bg-slate-50" },
  { icon: Phone, color: "bg-red-50 text-red-500", title: "Phone Support", sub: "+254 700 123 456", meta: "Mon - Fri, 8:00 AM - 6:00 PM", metaColor: "text-slate-500 bg-slate-50" },
  { icon: ClipboardList, color: "bg-amber-50 text-amber-600", title: "Submit a Request", sub: "Send us a message", meta: "We'll get back to you", metaColor: "text-slate-500 bg-slate-50" },
];

const resources = [
  { icon: Video, color: "text-red-500", label: "Video Tutorials", sub: "Watch step-by-step guides" },
  { icon: BookOpen, color: "text-emerald-600", label: "User Guides", sub: "Detailed guides and articles" },
  { icon: FileQuestion, color: "text-amber-600", label: "FAQs", sub: "Find answers to common questions" },
  { icon: Newspaper, color: "text-indigo-600", label: "Blog & Tips", sub: "Tips and best practices for chamas" },
  { icon: MonitorCog, color: "text-blue-600", label: "System Status", sub: "Check our system status" },
  { icon: Megaphone, color: "text-red-500", label: "Feature Updates", sub: "See what's new on M-Chama" },
];

function MemberHelp() {
  return (
    <MemberShell>
      <MemberPage title="Help & Support" subtitle="We're here to help you. Find answers, get assistance and manage your support requests.">
        <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#fff4f3_0%,#fdecec_100%)] p-8">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-semibold">How can we help you today?</h2>
              <p className="mt-2 text-slate-600">Search for answers or browse help topics.</p>
              <div className="mt-6 flex items-center gap-2 rounded-2xl border bg-white p-2">
                <Search className="ml-2 h-5 w-5 text-slate-400" />
                <input placeholder="Search for help articles..." className="flex-1 bg-transparent px-2 py-2 outline-none text-sm" />
                <button className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white">Search</button>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="flex h-44 w-44 items-center justify-center rounded-full bg-red-100"><HelpCircle className="h-20 w-20 text-red-500" /></div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
          <div className="space-y-5">
            <MemberCard title="Popular Help Topics">
              <div className="grid gap-4 p-6 md:grid-cols-3">
                {topics.map((t) => (
                  <button key={t.title} className="group flex items-start justify-between gap-3 rounded-2xl border p-4 text-left hover:border-red-300">
                    <div className="flex items-start gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.color}`}><t.icon className="h-5 w-5" /></div><div><div className="font-medium">{t.title}</div><div className="text-sm text-slate-500">{t.sub}</div></div></div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
              <div className="mx-6 mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border bg-amber-50/40 p-5 md:flex-row">
                <div className="flex items-center gap-3"><Lightbulb className="h-5 w-5 text-amber-500" /><div><div className="font-medium">Can't find what you're looking for?</div><div className="text-sm text-slate-500">Our support team is ready to assist you.</div></div></div>
                <button className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white">Contact Support</button>
              </div>
            </MemberCard>
            <MemberCard title="Help Resources">
              <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {resources.map((r) => (
                  <button key={r.label} className="flex items-center gap-3 rounded-2xl border p-3 text-left">
                    <r.icon className={`h-5 w-5 ${r.color}`} />
                    <div className="min-w-0 flex-1"><div className="text-sm font-medium truncate">{r.label}</div><div className="text-xs text-slate-500 truncate">{r.sub}</div></div>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </button>
                ))}
              </div>
            </MemberCard>
          </div>

          <div className="space-y-5">
            <MemberCard title="Contact Support">
              <div className="px-6 py-1 text-sm text-slate-500">Choose the best way to reach us</div>
              <div className="space-y-4 px-6 py-5">
                {contacts.map((c) => (
                  <div key={c.title} className="flex items-center justify-between gap-3 rounded-2xl border p-3">
                    <div className="flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-full ${c.color}`}><c.icon className="h-5 w-5" /></div><div><div className="font-medium text-sm">{c.title}</div><div className="text-xs text-slate-500">{c.sub}</div></div></div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.metaColor}`}>{c.meta}</span>
                  </div>
                ))}
              </div>
            </MemberCard>
            <MemberCard title="Your Support Activity" action={<button className="text-sm font-semibold text-red-600">View All</button>}>
              <div className="space-y-3 px-6 py-5">
                {[{ title: "Loan application status", sub: "Request #SR-2024-0156", badge: "In Progress", badgeC: "bg-blue-50 text-blue-600", meta: "Updated 2 hours ago" }, { title: "How to invite members", sub: "Request #SR-2024-0142", badge: "Resolved", badgeC: "bg-emerald-50 text-emerald-600", meta: "Resolved 1 day ago" }, { title: "Contribution not reflected", sub: "Request #SR-2024-0138", badge: "Pending", badgeC: "bg-amber-50 text-amber-600", meta: "Updated 2 days ago" }].map((r) => (
                  <div key={r.title} className="flex items-start justify-between gap-3 rounded-2xl border p-3">
                    <div><div className="font-medium text-sm">{r.title}</div><div className="text-xs text-slate-500">{r.sub}</div></div>
                    <div className="text-right"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${r.badgeC}`}>{r.badge}</span><div className="mt-1 text-xs text-slate-500">{r.meta}</div></div>
                  </div>
                ))}
              </div>
            </MemberCard>
          </div>
        </div>
      </MemberPage>
    </MemberShell>
  );
}
