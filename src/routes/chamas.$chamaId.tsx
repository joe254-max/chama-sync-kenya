import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/chamas/$chamaId")({
  component: () => <AppShell><ChamaDetail /></AppShell>,
});

function ChamaDetail() {
  const { chamaId } = useParams({ from: "/chamas/$chamaId" });
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ full_name: "", member_number: "", phone_number: "", id_number: "" });

  const { data: chama } = useQuery({
    queryKey: ["chama", chamaId],
    queryFn: async () => {
      const { data, error } = await supabase.from("chamas").select("*").eq("id", chamaId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: members } = useQuery({
    queryKey: ["members", chamaId],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("*").eq("chama_id", chamaId).order("full_name");
      if (error) throw error;
      return data;
    },
  });

  const { data: sessions } = useQuery({
    queryKey: ["sessions", chamaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meeting_sessions").select("*").eq("chama_id", chamaId)
        .order("meeting_date", { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
  });

  const addMember = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("members").insert({ ...form, chama_id: chamaId });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Member added");
      qc.invalidateQueries({ queryKey: ["members", chamaId] });
      setOpen(false);
      setForm({ full_name: "", member_number: "", phone_number: "", id_number: "" });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (!chama) return <div className="p-8 text-muted-foreground">Loading…</div>;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/chamas" className="flex items-center gap-1 hover:text-foreground"><ArrowLeft className="h-4 w-4" />Chamas</Link>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{chama.name}</h1>
          <p className="text-sm text-muted-foreground">{chama.project_name} · Officer: {chama.officer_name || "—"}</p>
        </div>
        <Link to="/meeting/new" search={{ chamaId } as any}>
          <Button><Plus className="h-4 w-4 mr-2" />Start meeting</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Members ({members?.length ?? 0})</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" />Add</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add member</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Full name *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
                  <div><Label>Member number</Label><Input value={form.member_number} onChange={(e) => setForm({ ...form, member_number: e.target.value })} /></div>
                  <div><Label>Phone</Label><Input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} /></div>
                  <div><Label>ID number</Label><Input value={form.id_number} onChange={(e) => setForm({ ...form, id_number: e.target.value })} /></div>
                </div>
                <DialogFooter>
                  <Button onClick={() => addMember.mutate()} disabled={!form.full_name || addMember.isPending}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {!members?.length ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No members yet</div>
            ) : (
              <div className="divide-y">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">{m.full_name}</div>
                      <div className="text-xs text-muted-foreground">#{m.member_number || "—"} · {m.phone_number || "—"}</div>
                    </div>
                    <Badge variant={m.is_active ? "default" : "secondary"} className={m.is_active ? "bg-success" : ""}>
                      {m.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent meetings</CardTitle></CardHeader>
          <CardContent>
            {!sessions?.length ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No meetings yet</div>
            ) : (
              <div className="divide-y">
                {sessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">Meeting #{s.meeting_number ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(s.meeting_date)} · {s.venue || "—"}</div>
                    </div>
                    <Badge variant={s.is_locked ? "secondary" : "default"} className={s.is_locked ? "" : "bg-success"}>
                      {s.is_locked ? "Locked" : "Open"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
