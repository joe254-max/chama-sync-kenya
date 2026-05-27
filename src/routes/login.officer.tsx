import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, ClipboardList, Loader2 } from "lucide-react";
import { LoginBackdrop, LoginTagline } from "@/components/LoginBackdrop";

export const Route = createFileRoute("/login/officer")({
  component: OfficerLogin,
});

function OfficerLogin() {
  const navigate = useNavigate();
  const { user, loading, isOfficer, roles } = useAuth();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If already signed in, route by role
  useEffect(() => {
    if (loading || !user) return;
    if (isOfficer) navigate({ to: "/dashboard" });
    else if (roles.includes("member")) {
      toast.error("This account is a member account. Please go back and select Member login.");
      supabase.auth.signOut();
    }
  }, [user, loading, isOfficer, roles, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }
    // Verify role
    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const userRoles = (roleRows ?? []).map((r) => r.role);
    setBusy(false);
    if (userRoles.includes("super_admin") || userRoles.includes("officer")) {
      toast.success("Welcome back");
      navigate({ to: "/dashboard" });
    } else {
      await supabase.auth.signOut();
      toast.error("This account is a member account. Please go back and select Member login.");
    }
  };

  const forgotPassword = async () => {
    if (!email) return toast.error("Enter your email first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/officer`,
    });
    if (error) return toast.error(error.message);
    toast.success("Password reset link sent. Check your email.");
  };

  return (
    <div className="relative min-h-screen px-4 py-6">
      <LoginBackdrop />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div className="w-full max-w-md mx-auto lg:mx-0">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <Card className="mt-6 border-white/20 bg-card/40 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ClipboardList className="h-6 w-6" />
            </div>
            <CardTitle className="mt-2">Officer Login</CardTitle>
            <CardDescription>Sign in to manage your chamas</CardDescription>
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
              <Button type="submit" className="h-12 w-full text-base" disabled={busy}>
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login as Officer"}
              </Button>
              <button
                type="button"
                onClick={forgotPassword}
                className="block w-full text-center text-sm text-muted-foreground hover:text-primary"
              >
                Forgot password?
              </button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Not an officer?{" "}
          <Link to="/login/member" className="font-medium text-primary hover:underline">
            Member login
          </Link>
        </p>
      </div>
    </div>
  );
}
