import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/chamas/")({
  component: () => <AppShell><ChamasPage /></AppShell>,
});

function ChamasPage() {
  const qc = useQueryClient();
  const { isSuperAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", project_name: "", officer_name: "", bank_name: "", bank_account_number: "" });

  const { data: chamas } = useQuery({
    queryKey: ["chamas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("chamas").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createChama = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("chamas").insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Chama created");
      qc.invalidateQueries({ queryKey: ["chamas"] });
      setOpen(false);
      setForm({ name: "", project_name: "", officer_name: "", bank_name: "", bank_account_number: "" });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chamas</h1>
          <p className="text-sm text-muted-foreground">Manage your savings groups</p>
        </div>
        {isSuperAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />New chama</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create chama</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Project name</Label><Input value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} /></div>
                <div><Label>Officer name</Label><Input value={form.officer_name} onChange={(e) => setForm({ ...form, officer_name: e.target.value })} /></div>
                <div><Label>Bank name</Label><Input value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} /></div>
                <div><Label>Bank account number</Label><Input value={form.bank_account_number} onChange={(e) => setForm({ ...form, bank_account_number: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button onClick={() => createChama.mutate()} disabled={!form.name || createChama.isPending}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>All chamas</CardTitle></CardHeader>
        <CardContent>
          {!chamas?.length ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No chamas yet.</div>
          ) : (
            <div className="divide-y">
              {chamas.map((c) => (
                <Link key={c.id} to="/chamas/$chamaId" params={{ chamaId: c.id }} className="flex items-center justify-between py-3 hover:bg-accent/40 -mx-2 px-2 rounded">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.project_name || "—"} · {c.bank_name || "No bank"}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{c.is_archived ? "Archived" : "Active"}</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
