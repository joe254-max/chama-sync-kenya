import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatKES, formatDate } from "@/lib/format";
import { Users, Wallet, Banknote, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: () => <AppShell><Dashboard /></AppShell>,
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [{ count: chamaCount }, { count: memberCount }, savingsRes] = await Promise.all([
        supabase.from("chamas").select("*", { count: "exact", head: true }).eq("is_archived", false),
        supabase.from("members").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("member_records").select("savings_shares_cf"),
      ]);
      const totalSavings = (savingsRes.data ?? []).reduce((s, r) => s + Number(r.savings_shares_cf || 0), 0);
      return { chamaCount: chamaCount ?? 0, memberCount: memberCount ?? 0, totalSavings };
    },
  });

  const { data: chamas } = useQuery({
    queryKey: ["chamas-with-last-meeting"],
    queryFn: async () => {
      const { data: chamas } = await supabase
        .from("chamas")
        .select("id, name, project_name, is_archived")
        .eq("is_archived", false)
        .order("created_at", { ascending: false });
      if (!chamas) return [];
      const ids = chamas.map((c) => c.id);
      const { data: sessions } = await supabase
        .from("meeting_sessions")
        .select("chama_id, meeting_date")
        .in("chama_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"])
        .order("meeting_date", { ascending: false });
      const lastByChama = new Map<string, string>();
      (sessions ?? []).forEach((s) => {
        if (!lastByChama.has(s.chama_id)) lastByChama.set(s.chama_id, s.meeting_date);
      });
      return chamas.map((c) => ({ ...c, lastMeeting: lastByChama.get(c.id) ?? null }));
    },
  });

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of all chamas</p>
        </div>
        <Link to="/meeting/new">
          <Button><Plus className="h-4 w-4 mr-2" />Start New Meeting</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Total Chamas" value={stats?.chamaCount.toString() ?? "—"} />
        <StatCard icon={Users} label="Total Members" value={stats?.memberCount.toString() ?? "—"} />
        <StatCard icon={Banknote} label="Total Savings (KES)" value={formatKES(stats?.totalSavings ?? 0)} />
      </div>

      <Card>
        <CardHeader><CardTitle>Chamas</CardTitle></CardHeader>
        <CardContent>
          {!chamas?.length ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No chamas yet. <Link to="/chamas" className="text-primary underline">Create your first chama</Link>.
            </div>
          ) : (
            <div className="divide-y">
              {chamas.map((c) => {
                const stale = !c.lastMeeting || (Date.now() - new Date(c.lastMeeting).getTime()) > 1000 * 60 * 60 * 24 * 60;
                return (
                  <Link key={c.id} to="/chamas/$chamaId" params={{ chamaId: c.id }} className="flex items-center justify-between py-3 hover:bg-accent/40 -mx-2 px-2 rounded">
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.project_name || "—"}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground hidden sm:inline">Last meeting: {formatDate(c.lastMeeting)}</span>
                      <Badge variant={stale ? "destructive" : "default"} className={stale ? "" : "bg-success"}>
                        {stale ? "Needs attention" : "Active"}
                      </Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
