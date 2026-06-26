import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { LoginBackdrop, LoginTagline } from "@/components/LoginBackdrop";
import { PasswordInput } from "@/components/PasswordInput";
import logoAsset from "@/assets/mchama-logo.png.asset.json";

export const Route = createFileRoute("/login/officer")({
  component: OfficerLogin,
});

function OfficerLogin() {
  const navigate = useNavigate();
  const { user, loading, isOfficer, roles } = useAuth();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPending, setVerifyPending] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

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
      if (error.message.toLowerCase().includes("email not confirmed") || error.message.toLowerCase().includes("not verified")) {
        setVerifyEmail(email);
        setVerifyPending(true);
        return toast.error("Please verify your email before signing in.");
      }
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
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return toast.error(error.message);
    toast.success("Password reset link sent. Check your email.");
  };

  const resendVerification = async () => {
    if (resendCooldown > 0 || !verifyEmail) return;
    setBusy(true);
    const { error } = await supabase.auth.resend({ type: "signup", email: verifyEmail });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Verification email resent. Check your inbox.");
    setResendCooldown(60);
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

        <Card className="mt-6 border border-white/20 bg-white/95 text-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55),0_8px_24px_-12px_rgba(170,2,2,0.45)] backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="smokey-red-shadow mx-auto relative grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-[#aa0202] ring-1 ring-black/10">
              <span className="pointer-events-none absolute inset-1 rounded-full border border-white/30" />
              <img src={logoAsset.url} alt="M-Chama" className="relative h-16 w-16 object-contain" />
            </div>
            <CardTitle className="mt-3 text-[#aa0202]">Officer Login</CardTitle>
            <CardDescription className="text-neutral-600">Sign in to manage your chamas</CardDescription>
          </CardHeader>
          <CardContent>
            {verifyPending && (
              <div className="mb-4 rounded-lg border border-[#aa0202]/20 bg-[#aa0202]/5 p-4 text-sm">
                <p className="font-medium text-[#aa0202]">Verification pending</p>
                <p className="mt-1 text-neutral-600">
                  We sent a verification link to <span className="font-semibold">{verifyEmail}</span>. Check your inbox and spam folder.
                </p>
                <button
                  type="button"
                  onClick={resendVerification}
                  disabled={busy || resendCooldown > 0}
                  className="mt-2 text-sm font-medium text-[#aa0202] hover:underline disabled:opacity-50 disabled:hover:no-underline"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend verification email"}
                </button>
              </div>
            )}

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
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  className="h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="h-12 w-full bg-[#aa0202] text-base text-white hover:bg-[#7a0101] shadow-[0_10px_24px_-10px_rgba(170,2,2,0.6)]" disabled={busy}>
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login as Officer"}
              </Button>
              <button
                type="button"
                onClick={forgotPassword}
                className="block w-full text-center text-sm text-neutral-600 hover:text-[#aa0202]"
              >
                Forgot password?
              </button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-white/80">
          Not an officer?{" "}
          <Link to="/login/member" className="font-medium text-primary hover:underline">
            Member login
          </Link>
        </p>
        </div>

        <div className="hidden lg:flex justify-center">
          <LoginTagline />
        </div>
      </div>
    </div>
  );
}
