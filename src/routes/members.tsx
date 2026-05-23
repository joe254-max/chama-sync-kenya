import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/members")({
  component: () => <AppShell><MembersPage /></AppShell>,
});

function MembersPage() {
  const [q, setQ] = useState("");
  const { data: members } = useQuery({
    queryKey: ["all-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*, chamas(name)")
        .order("full_name");
      if (error) throw error;
      return data as any[];
    },
  });

  const filtered = (members ?? []).filter((m) =>
    !q || m.full_name?.toLowerCase().includes(q.toLowerCase()) || m.member_number?.includes(q) || m.phone_number?.includes(q)
  );

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">Members</h1>
        <p className="text-sm text-muted-foreground">All members across your chamas</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Directory</CardTitle>
          <Input placeholder="Search by name, member # or phone" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        </CardHeader>
        <CardContent>
          {!filtered.length ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No members found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b">
                  <tr>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Member #</th>
                    <th className="py-2 pr-4">Chama</th>
                    <th className="py-2 pr-4">Phone</th>
                    <th className="py-2 pr-4">Joined</th>
                    <th className="py-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{m.full_name}</td>
                      <td className="py-2 pr-4">{m.member_number || "—"}</td>
                      <td className="py-2 pr-4">{m.chamas?.name || "—"}</td>
                      <td className="py-2 pr-4">{m.phone_number || "—"}</td>
                      <td className="py-2 pr-4">{formatDate(m.date_joined)}</td>
                      <td className="py-2 pr-4">
                        <Badge variant={m.is_active ? "default" : "secondary"} className={m.is_active ? "bg-success" : ""}>
                          {m.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
