import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, AlertTriangle, TrendingUp, UserCheck } from "lucide-react";

export const Route = createFileRoute("/reports")({
  component: () => <AppShell><ReportsPage /></AppShell>,
});

function ReportsPage() {
  const reports = [
    { icon: FileText, title: "Group Performance", desc: "Render Group's Performance Form for any meeting session." },
    { icon: TrendingUp, title: "Monthly Performance", desc: "Aggregated monthly performance form per chama." },
    { icon: UserCheck, title: "Member Statement", desc: "Full history for any member across sessions." },
    { icon: AlertTriangle, title: "Defaulters Report", desc: "Members with outstanding loans older than 3 months." },
  ];
  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">Printable reports and statements</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((r) => (
          <Card key={r.title}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <r.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{r.title}</CardTitle>
                  <CardDescription className="text-xs">Coming soon</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{r.desc}</CardContent>
          </Card>
        ))}
      </div>
      <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
        Reports build on top of meeting sessions. Submit a few meetings in <strong>Meeting Mode</strong> and the report renderers will be wired up next.
      </div>
    </div>
  );
}
