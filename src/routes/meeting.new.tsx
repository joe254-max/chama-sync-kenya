import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

type Search = { chamaId?: string };

export const Route = createFileRoute("/meeting/new")({
  validateSearch: (s: Record<string, unknown>): Search => ({ chamaId: s.chamaId as string | undefined }),
  component: () => <AppShell><NewMeeting /></AppShell>,
});

function NewMeeting() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/meeting/new" });
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    chama_id: search.chamaId ?? "",
    meeting_date: today,
    meeting_number: "" as string,
    venue: "",
    time: "",
    field_officer: "",
    elder: "",
    zona: "",
    zona_ward: "",
    bus_no: "",
  });

  const { data: chamas } = useQuery({
    queryKey: ["chamas-for-meeting"],
    queryFn: async () => {
      const { data } = await supabase.from("chamas").select("id, name").eq("is_archived", false).order("name");
      return data ?? [];
    },
  });

  // Suggest next meeting number
  useEffect(() => {
    if (!form.chama_id) return;
    supabase
      .from("meeting_sessions")
      .select("meeting_number")
      .eq("chama_id", form.chama_id)
      .order("meeting_number", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        const next = ((data?.[0]?.meeting_number as number) || 0) + 1;
        setForm((f) => ({ ...f, meeting_number: String(next) }));
      });
  }, [form.chama_id]);

  const create = useMutation({
    mutationFn: async () => {
      if (!form.chama_id) throw new Error("Select a chama");
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("meeting_sessions")
        .insert({
          chama_id: form.chama_id,
          meeting_date: form.meeting_date,
          meeting_number: form.meeting_number ? parseInt(form.meeting_number) : null,
          venue: form.venue,
          time: form.time,
          field_officer: form.field_officer,
          elder: form.elder,
          zona: form.zona,
          zona_ward: form.zona_ward,
          bus_no: form.bus_no,
          created_by: user?.id,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: (id) => {
      toast.success("Meeting session created");
      navigate({ to: "/meeting/$sessionId", params: { sessionId: id } });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="container mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">Start new meeting</h1>
        <p className="text-sm text-muted-foreground">Step 1 — Session setup</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Meeting details</CardTitle>
          <CardDescription>Fill in the basics, then move on to member records.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Chama *</Label>
            <Select value={form.chama_id} onValueChange={(v) => setForm({ ...form, chama_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select chama" /></SelectTrigger>
              <SelectContent>
                {chamas?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Date</Label><Input type="date" value={form.meeting_date} onChange={(e) => setForm({ ...form, meeting_date: e.target.value })} /></div>
          <div><Label>Meeting #</Label><Input type="number" value={form.meeting_number} onChange={(e) => setForm({ ...form, meeting_number: e.target.value })} /></div>
          <div><Label>Venue</Label><Input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
          <div><Label>Time</Label><Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="e.g. 10:00 AM" /></div>
          <div><Label>Field officer</Label><Input value={form.field_officer} onChange={(e) => setForm({ ...form, field_officer: e.target.value })} /></div>
          <div><Label>Elder</Label><Input value={form.elder} onChange={(e) => setForm({ ...form, elder: e.target.value })} /></div>
          <div><Label>Zona</Label><Input value={form.zona} onChange={(e) => setForm({ ...form, zona: e.target.value })} /></div>
          <div><Label>Zona ward</Label><Input value={form.zona_ward} onChange={(e) => setForm({ ...form, zona_ward: e.target.value })} /></div>
          <div><Label>Bus no.</Label><Input value={form.bus_no} onChange={(e) => setForm({ ...form, bus_no: e.target.value })} /></div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={() => create.mutate()} disabled={create.isPending || !form.chama_id} size="lg">
          Continue <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
