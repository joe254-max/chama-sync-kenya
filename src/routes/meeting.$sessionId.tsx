import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatKES, formatDate, parseNumber } from "@/lib/format";
import { toast } from "sonner";
import { Lock, Save, CheckCircle2, ArrowLeft, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/meeting/$sessionId")({
  component: () => <AppShell><MeetingEditor /></AppShell>,
});

type MemberRow = {
  member_id: string;
  full_name: string;
  member_number: string | null;
  savings_shares_bf: number;
  loan_balance_bf: number;
  total_repaid: number;
  principal: number;
  loan_interest: number;
  shares_this_month: number;
  welfare: number;
  record_id?: string;
};

function MeetingEditor() {
  const { sessionId } = useParams({ from: "/meeting/$sessionId" });
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [tab, setTab] = useState("records");
  const dirtyRef = useRef(false);

  const { data: session, refetch: refetchSession } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meeting_sessions")
        .select("*, chamas(name)")
        .eq("id", sessionId).single();
      if (error) throw error;
      return data;
    },
  });

  const locked = session?.is_locked ?? false;

  // --- Member rows ---
  const { data: initialRows, isLoading: rowsLoading } = useQuery({
    queryKey: ["session-rows", sessionId, session?.chama_id],
    enabled: !!session?.chama_id,
    queryFn: async (): Promise<MemberRow[]> => {
      const chamaId = session!.chama_id;
      const { data: members } = await supabase
        .from("members").select("id, full_name, member_number")
        .eq("chama_id", chamaId).eq("is_active", true).order("full_name");

      const { data: existing } = await supabase
        .from("member_records").select("*").eq("session_id", sessionId);

      // Pre-fill BF values from previous session's CF
      const { data: prevSession } = await supabase
        .from("meeting_sessions").select("id")
        .eq("chama_id", chamaId).eq("is_locked", true)
        .lt("meeting_date", session!.meeting_date)
        .order("meeting_date", { ascending: false }).limit(1);

      let prevRecords: any[] = [];
      if (prevSession?.[0]?.id) {
        const { data } = await supabase
          .from("member_records")
          .select("member_id, savings_shares_cf, loan_cf")
          .eq("session_id", prevSession[0].id);
        prevRecords = data ?? [];
      }
      const prevMap = new Map(prevRecords.map((r) => [r.member_id, r]));
      const existingMap = new Map((existing ?? []).map((r) => [r.member_id, r]));

      return (members ?? []).map((m) => {
        const ex = existingMap.get(m.id);
        const prev = prevMap.get(m.id);
        return {
          member_id: m.id,
          full_name: m.full_name,
          member_number: m.member_number,
          savings_shares_bf: Number(ex?.savings_shares_bf ?? prev?.savings_shares_cf ?? 0),
          loan_balance_bf: Number(ex?.loan_balance_bf ?? prev?.loan_cf ?? 0),
          total_repaid: Number(ex?.total_repaid ?? 0),
          principal: Number(ex?.principal ?? 0),
          loan_interest: Number(ex?.loan_interest ?? 0),
          shares_this_month: Number(ex?.shares_this_month ?? 0),
          welfare: Number(ex?.welfare ?? 0),
          record_id: ex?.id,
        };
      });
    },
  });

  const [rows, setRows] = useState<MemberRow[]>([]);
  useEffect(() => { if (initialRows) setRows(initialRows); }, [initialRows]);

  const updateRow = (idx: number, key: keyof MemberRow, value: number) => {
    setRows((r) => {
      const copy = [...r];
      (copy[idx] as any)[key] = value;
      return copy;
    });
    dirtyRef.current = true;
  };

  // Totals
  const totals = useMemo(() => {
    const t = { savings_bf: 0, loan_bf: 0, total_repaid: 0, principal: 0, interest: 0, shares: 0, welfare: 0, savings_cf: 0, loan_cf: 0 };
    rows.forEach((r) => {
      t.savings_bf += r.savings_shares_bf;
      t.loan_bf += r.loan_balance_bf;
      t.total_repaid += r.total_repaid;
      t.principal += r.principal;
      t.interest += r.loan_interest;
      t.shares += r.shares_this_month;
      t.welfare += r.welfare;
      t.savings_cf += r.savings_shares_bf + r.shares_this_month;
      t.loan_cf += r.loan_balance_bf - r.principal;
    });
    return t;
  }, [rows]);

  // Save records
  const saveRecords = useMutation({
    mutationFn: async () => {
      const payload = rows.map((r) => ({
        id: r.record_id,
        session_id: sessionId,
        member_id: r.member_id,
        savings_shares_bf: r.savings_shares_bf,
        loan_balance_bf: r.loan_balance_bf,
        total_repaid: r.total_repaid,
        principal: r.principal,
        loan_interest: r.loan_interest,
        shares_this_month: r.shares_this_month,
        welfare: r.welfare,
      }));
      const { data, error } = await supabase
        .from("member_records")
        .upsert(payload, { onConflict: "session_id,member_id" })
        .select("id, member_id");
      if (error) throw error;
      // attach ids back
      const idMap = new Map((data ?? []).map((r) => [r.member_id, r.id]));
      setRows((prev) => prev.map((r) => ({ ...r, record_id: idMap.get(r.member_id) ?? r.record_id })));
      dirtyRef.current = false;
    },
    onSuccess: () => toast.success("Records saved"),
    onError: (e: any) => toast.error(e.message),
  });

  // Autosave every 30s
  useEffect(() => {
    if (locked) return;
    const id = setInterval(() => {
      if (dirtyRef.current && rows.length) saveRecords.mutate();
    }, 30_000);
    return () => clearInterval(id);
  }, [locked, rows.length]);

  // Warn on unload if dirty
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // --- Advances ---
  const { data: advances } = useQuery({
    queryKey: ["advances", sessionId],
    queryFn: async () => (await supabase.from("advances").select("*, members(full_name, member_number)").eq("session_id", sessionId)).data ?? [],
  });

  // --- Loans given ---
  const { data: loansGiven } = useQuery({
    queryKey: ["loans_given", sessionId],
    queryFn: async () => (await supabase.from("loans_given").select("*, members(full_name, member_number)").eq("session_id", sessionId)).data ?? [],
  });

  // --- Summary ---
  const { data: summary } = useQuery({
    queryKey: ["summary", sessionId],
    queryFn: async () => (await supabase.from("session_summary").select("*").eq("session_id", sessionId).maybeSingle()).data,
  });

  const [sumForm, setSumForm] = useState<any>(null);
  useEffect(() => {
    if (summary) setSumForm(summary);
    else setSumForm({
      total_repaid: 0, advance_paid: 0, fines_and_charges: 0, welfare: 0,
      pass_books: 0, transfer: 0, prev_banking: 0, others: 0,
      principal_withdrawals: 0, loans: 0, advance: 0, welfare_risk: 0,
      service_fee: 0, pass_books_d: 0, loan_form: 0, others_d: 0,
      overdraft_bf: 0, od_paid: 0, total_banking: 0,
      bank_withdrawal: 0, total_in_bank: 0, total_overdraft: 0,
    });
  }, [summary]);

  // Pre-fill from records totals
  useEffect(() => {
    if (!sumForm) return;
    setSumForm((s: any) => ({ ...s, total_repaid: totals.total_repaid, welfare: totals.welfare, loans: loansGiven?.reduce((sum, l) => sum + Number(l.amount), 0) ?? s.loans, advance_paid: advances?.reduce((sum, a) => sum + Number(a.amount), 0) ?? s.advance_paid }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totals.total_repaid, totals.welfare, advances?.length, loansGiven?.length]);

  const grandC = sumForm ? Number(sumForm.total_repaid) + Number(sumForm.advance_paid) + Number(sumForm.fines_and_charges) + Number(sumForm.welfare) + Number(sumForm.pass_books) + Number(sumForm.transfer) + Number(sumForm.prev_banking) + Number(sumForm.others) : 0;
  const grandD = sumForm ? Number(sumForm.principal_withdrawals) + Number(sumForm.loans) + Number(sumForm.advance) + Number(sumForm.welfare_risk) + Number(sumForm.service_fee) + Number(sumForm.pass_books_d) + Number(sumForm.loan_form) + Number(sumForm.others_d) : 0;
  const balanceOd = sumForm ? Number(sumForm.overdraft_bf) - Number(sumForm.od_paid) : 0;
  const surplus = grandC - grandD;

  const saveSummary = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("session_summary").upsert({ ...sumForm, session_id: sessionId }, { onConflict: "session_id" });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Summary saved"); qc.invalidateQueries({ queryKey: ["summary", sessionId] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const submit = useMutation({
    mutationFn: async (comment: string) => {
      if (dirtyRef.current) await saveRecords.mutateAsync();
      await saveSummary.mutateAsync();
      const { error } = await supabase
        .from("meeting_sessions")
        .update({ is_locked: true, submitted_at: new Date().toISOString(), auditor_comment: comment })
        .eq("id", sessionId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Meeting submitted and locked");
      refetchSession();
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (!session) return <div className="p-8 text-muted-foreground">Loading session…</div>;

  return (
    <div className="container mx-auto max-w-7xl space-y-4 p-3 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to="/chamas/$chamaId" params={{ chamaId: session.chama_id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to chama
          </Link>
          <h1 className="text-2xl font-bold mt-1">
            {(session as any).chamas?.name} — Meeting #{session.meeting_number ?? "—"}
          </h1>
          <p className="text-sm text-muted-foreground">{formatDate(session.meeting_date)} · {session.venue || "—"}</p>
        </div>
        <div className="flex items-center gap-2">
          {locked ? (
            <Badge variant="secondary"><Lock className="h-3 w-3 mr-1" /> Locked</Badge>
          ) : (
            <Button onClick={() => saveRecords.mutate()} variant="outline" disabled={saveRecords.isPending}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="advances">Advances</TabsTrigger>
          <TabsTrigger value="loans">Loans Out</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="submit">Review</TabsTrigger>
        </TabsList>

        {/* RECORDS */}
        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Member records</CardTitle>
              <CardDescription>Calculated cells (blue) update live. Negative loan balance = red row.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {rowsLoading ? (
                <div className="p-6 text-sm text-muted-foreground">Loading members…</div>
              ) : !rows.length ? (
                <div className="p-6 text-sm text-muted-foreground">No active members in this chama.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px] text-sm">
                    <thead className="bg-muted/50 text-left text-xs uppercase">
                      <tr>
                        <th className="p-2">Member</th>
                        <th className="p-2">Savings B/F</th>
                        <th className="p-2">Loan B/F</th>
                        <th className="p-2">Repaid</th>
                        <th className="p-2">Principal</th>
                        <th className="p-2">Interest</th>
                        <th className="p-2">Shares</th>
                        <th className="p-2">Welfare</th>
                        <th className="p-2 bg-calc/40">Savings C/F</th>
                        <th className="p-2 bg-calc/40">Loan C/F</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => {
                        const sCF = r.savings_shares_bf + r.shares_this_month;
                        const lCF = r.loan_balance_bf - r.principal;
                        const bad = lCF < 0;
                        return (
                          <tr key={r.member_id} className={`border-b last:border-0 ${bad ? "bg-destructive/10" : ""}`}>
                            <td className="p-2">
                              <div className="font-medium">{r.full_name}</div>
                              <div className="text-xs text-muted-foreground">#{r.member_number || "—"}</div>
                            </td>
                            {(["savings_shares_bf","loan_balance_bf","total_repaid","principal","loan_interest","shares_this_month","welfare"] as const).map((k) => (
                              <td key={k} className="p-1">
                                <Input
                                  className="h-9 w-28 text-right"
                                  disabled={locked}
                                  inputMode="decimal"
                                  value={r[k] || ""}
                                  onChange={(e) => updateRow(i, k, parseNumber(e.target.value))}
                                />
                              </td>
                            ))}
                            <td className="p-2 bg-calc/30 text-calc-foreground text-right font-medium">
                              <Lock className="inline h-3 w-3 mr-1 opacity-60" />{formatKES(sCF)}
                            </td>
                            <td className={`p-2 bg-calc/30 text-right font-medium ${bad ? "text-destructive" : "text-calc-foreground"}`}>
                              <Lock className="inline h-3 w-3 mr-1 opacity-60" />{formatKES(lCF)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-muted/60 font-semibold">
                      <tr>
                        <td className="p-2">TOTALS (KES)</td>
                        <td className="p-2 text-right">{formatKES(totals.savings_bf)}</td>
                        <td className="p-2 text-right">{formatKES(totals.loan_bf)}</td>
                        <td className="p-2 text-right">{formatKES(totals.total_repaid)}</td>
                        <td className="p-2 text-right">{formatKES(totals.principal)}</td>
                        <td className="p-2 text-right">{formatKES(totals.interest)}</td>
                        <td className="p-2 text-right">{formatKES(totals.shares)}</td>
                        <td className="p-2 text-right">{formatKES(totals.welfare)}</td>
                        <td className="p-2 text-right bg-calc/40">{formatKES(totals.savings_cf)}</td>
                        <td className="p-2 text-right bg-calc/40">{formatKES(totals.loan_cf)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ADVANCES */}
        <TabsContent value="advances">
          <LineEntryCard
            title="Section A — Advances paid today"
            sessionId={sessionId}
            chamaId={session.chama_id}
            table="advances"
            withInstallment
            locked={locked}
            items={advances ?? []}
          />
        </TabsContent>

        {/* LOANS OUT */}
        <TabsContent value="loans">
          <LineEntryCard
            title="Section B — Cash given out today"
            sessionId={sessionId}
            chamaId={session.chama_id}
            table="loans_given"
            locked={locked}
            items={loansGiven ?? []}
          />
        </TabsContent>

        {/* SUMMARY */}
        <TabsContent value="summary">
          {sumForm && (
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Section C — Money In (Receipts)</CardTitle></CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                  {[
                    ["total_repaid", "Total repaid"], ["advance_paid", "Advance paid"], ["fines_and_charges", "Fines & charges"], ["welfare", "Welfare"],
                    ["pass_books", "Pass books"], ["transfer", "Transfer"], ["prev_banking", "Prev banking"], ["others", "Others"],
                  ].map(([k, label]) => (
                    <SumField key={k} label={label} value={sumForm[k]} onChange={(v) => setSumForm({ ...sumForm, [k]: v })} disabled={locked} />
                  ))}
                  <CalcField label="Grand total C" value={grandC} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Section D — Money Out (Payments)</CardTitle></CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                  {[
                    ["principal_withdrawals", "Principal withdrawals"], ["loans", "Loans"], ["advance", "Advance"], ["welfare_risk", "Welfare risk"],
                    ["service_fee", "Service fee"], ["pass_books_d", "Pass books"], ["loan_form", "Loan form"], ["others_d", "Others"],
                  ].map(([k, label]) => (
                    <SumField key={k} label={label} value={sumForm[k]} onChange={(v) => setSumForm({ ...sumForm, [k]: v })} disabled={locked} />
                  ))}
                  <CalcField label="Grand total D" value={grandD} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Section E — Overdraft</CardTitle></CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                  <SumField label="Overdraft B/F" value={sumForm.overdraft_bf} onChange={(v) => setSumForm({ ...sumForm, overdraft_bf: v })} disabled={locked} />
                  <SumField label="OD paid" value={sumForm.od_paid} onChange={(v) => setSumForm({ ...sumForm, od_paid: v })} disabled={locked} />
                  <CalcField label="Balance OD" value={balanceOd} />
                  <SumField label="Total banking" value={sumForm.total_banking} onChange={(v) => setSumForm({ ...sumForm, total_banking: v })} disabled={locked} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Section F</CardTitle></CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-3">
                  <SumField label="Bank withdrawal" value={sumForm.bank_withdrawal} onChange={(v) => setSumForm({ ...sumForm, bank_withdrawal: v })} disabled={locked} />
                  <SumField label="Total in bank" value={sumForm.total_in_bank} onChange={(v) => setSumForm({ ...sumForm, total_in_bank: v })} disabled={locked} />
                  <SumField label="Total overdraft" value={sumForm.total_overdraft} onChange={(v) => setSumForm({ ...sumForm, total_overdraft: v })} disabled={locked} />
                </CardContent>
              </Card>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border bg-card p-4">
                <div>
                  <div className="text-sm text-muted-foreground">Surplus / Deficit</div>
                  <div className={`text-2xl font-bold ${surplus >= 0 ? "text-success" : "text-destructive"}`}>
                    KES {formatKES(surplus)}
                  </div>
                </div>
                {!locked && <Button onClick={() => saveSummary.mutate()} disabled={saveSummary.isPending}><Save className="h-4 w-4 mr-2" />Save summary</Button>}
              </div>
            </div>
          )}
        </TabsContent>

        {/* REVIEW & SUBMIT */}
        <TabsContent value="submit">
          <SubmitPanel
            locked={locked}
            session={session}
            totals={totals}
            grandC={grandC}
            grandD={grandD}
            surplus={surplus}
            onSubmit={(comment: string) => submit.mutate(comment)}
            isPending={submit.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SumField({ label, value, onChange, disabled }: { label: string; value: number; onChange: (n: number) => void; disabled?: boolean }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input className="text-right" inputMode="decimal" disabled={disabled} value={value || ""} onChange={(e) => onChange(parseNumber(e.target.value))} />
    </div>
  );
}

function CalcField({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="flex h-9 items-center justify-end rounded-md border bg-calc/40 px-3 font-semibold text-calc-foreground">
        <Lock className="h-3 w-3 mr-1 opacity-60" /> {formatKES(value)}
      </div>
    </div>
  );
}

function LineEntryCard({ title, sessionId, chamaId, table, items, locked, withInstallment }: {
  title: string; sessionId: string; chamaId: string;
  table: "advances" | "loans_given"; items: any[]; locked: boolean; withInstallment?: boolean;
}) {
  const qc = useQueryClient();
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [installment, setInstallment] = useState("1");

  const { data: members } = useQuery({
    queryKey: ["members-for-entry", chamaId],
    queryFn: async () => (await supabase.from("members").select("id, full_name, member_number").eq("chama_id", chamaId).eq("is_active", true).order("full_name")).data ?? [],
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!memberId || !amount) throw new Error("Select a member and enter amount");
      const payload: any = { session_id: sessionId, member_id: memberId, amount: parseNumber(amount) };
      if (withInstallment) payload.installment_number = parseInt(installment) || 1;
      const { error } = await supabase.from(table).insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Added");
      qc.invalidateQueries({ queryKey: [table, sessionId] });
      setMemberId(""); setAmount(""); setInstallment("1");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from(table).delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table, sessionId] }),
  });

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {!locked && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end mb-4">
            <div className="flex-1">
              <Label className="text-xs">Member</Label>
              <select className="h-9 w-full rounded-md border bg-background px-2 text-sm" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                <option value="">Select member</option>
                {members?.map((m) => <option key={m.id} value={m.id}>{m.full_name} {m.member_number ? `(#${m.member_number})` : ""}</option>)}
              </select>
            </div>
            {withInstallment && (
              <div className="w-full sm:w-28">
                <Label className="text-xs">Installment</Label>
                <select className="h-9 w-full rounded-md border bg-background px-2 text-sm" value={installment} onChange={(e) => setInstallment(e.target.value)}>
                  <option value="1">1st</option><option value="2">2nd</option><option value="3">3rd</option>
                </select>
              </div>
            )}
            <div className="w-full sm:w-40">
              <Label className="text-xs">Amount (KES)</Label>
              <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <Button onClick={() => add.mutate()} disabled={add.isPending}><Plus className="h-4 w-4 mr-1" />Add</Button>
          </div>
        )}
        {!items.length ? (
          <div className="py-6 text-center text-sm text-muted-foreground">No entries yet</div>
        ) : (
          <div className="divide-y">
            {items.map((it: any) => (
              <div key={it.id} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium">{it.members?.full_name}</div>
                  <div className="text-xs text-muted-foreground">
                    #{it.members?.member_number || "—"}
                    {withInstallment ? ` · Installment ${it.installment_number}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">KES {formatKES(it.amount)}</span>
                  {!locked && (
                    <Button size="icon" variant="ghost" onClick={() => del.mutate(it.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SubmitPanel({ locked, session, totals, grandC, grandD, surplus, onSubmit, isPending }: any) {
  const [comment, setComment] = useState(session?.auditor_comment ?? "");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & submit</CardTitle>
        <CardDescription>Submitting locks the meeting. Only a Super Admin can unlock it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatBox label="Total savings (C/F)" value={formatKES(totals.savings_cf)} />
          <StatBox label="Total loans outstanding" value={formatKES(totals.loan_cf)} />
          <StatBox label="Surplus / Deficit" value={`KES ${formatKES(surplus)}`} highlight={surplus >= 0 ? "success" : "destructive"} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <StatBox label="Grand total C (Money in)" value={`KES ${formatKES(grandC)}`} />
          <StatBox label="Grand total D (Money out)" value={`KES ${formatKES(grandD)}`} />
        </div>
        <div>
          <Label>Auditor's comments</Label>
          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} disabled={locked} rows={4} />
        </div>
        {!locked ? (
          <Button size="lg" onClick={() => onSubmit(comment)} disabled={isPending} className="w-full sm:w-auto">
            <CheckCircle2 className="h-4 w-4 mr-2" /> {isPending ? "Submitting…" : "Submit & lock meeting"}
          </Button>
        ) : (
          <Badge variant="secondary" className="text-sm"><Lock className="h-3 w-3 mr-1" /> Submitted on {formatDate(session.submitted_at)}</Badge>
        )}
      </CardContent>
    </Card>
  );
}

function StatBox({ label, value, highlight }: { label: string; value: string; highlight?: "success" | "destructive" }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-xl font-bold ${highlight === "success" ? "text-success" : highlight === "destructive" ? "text-destructive" : ""}`}>{value}</div>
    </div>
  );
}
