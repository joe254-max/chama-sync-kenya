import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Wallet, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login/member")({
  component: MemberLogin,
});

function MemberLogin() {
  const navigate = useNavigate();
  const { user, loading, roles, isOfficer } = useAuth();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (loading || !user) return;
    if (roles.includes("member") && !isOfficer) navigate({ to: "/member/home" });
    else if (isOfficer) {
      toast.error("This is an officer account. Please go back and use Officer login.");
      supabase.auth.signOut();
    }
  }, [user, loading, roles, isOfficer, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }
    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const userRoles = (roleRows ?? []).map((r) => r.role);
    setBusy(false);
    if (userRoles.includes("member") && !userRoles.includes("officer") && !userRoles.includes("super_admin")) {
      toast.success("Karibu! Welcome back");
      navigate({ to: "/member/home" });
    } else {
      await supabase.auth.signOut();
      toast.error("This is an officer account. Please go back and use Officer login.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[oklch(0.65_0.18_300)]/5 px-4 py-6">
      <div className="mx-auto max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <Card className="mt-6">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.65_0.18_300)]/10 text-[oklch(0.55_0.2_300)]">
              <Wallet className="h-6 w-6" />
            </div>
            <CardTitle className="mt-2">Member Login</CardTitle>
            <CardDescription>Access your savings and loans</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={signIn} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="h-12 w-full bg-[oklch(0.55_0.2_300)] text-base text-white hover:bg-[oklch(0.5_0.2_300)]"
                disabled={busy}
              >
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login as Member"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Phone OTP login coming soon — use email for now.
              </p>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Are you an officer?{" "}
          <Link to="/login/officer" className="font-medium text-primary hover:underline">
            Officer login
          </Link>
        </p>
      </div>
    </div>
  );
}
