import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Wallet, Loader2, Fingerprint } from "lucide-react";
import { LoginBackdrop, LoginTagline } from "@/components/LoginBackdrop";
import {
  isBiometricAvailable,
  hasBiometricEnrolled,
  enrollBiometric,
  verifyBiometric,
  disableBiometric,
} from "@/lib/biometric";

export const Route = createFileRoute("/login/member")({
  component: MemberLogin,
});

function MemberLogin() {
  const navigate = useNavigate();
  const { user, loading, roles, isOfficer } = useAuth();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioEnrolled, setBioEnrolled] = useState(false);
  const [askEnroll, setAskEnroll] = useState(false);
  const [pendingSession, setPendingSession] = useState<{ access_token: string; refresh_token: string; userId: string; email: string } | null>(null);

  useEffect(() => {
    isBiometricAvailable().then((ok) => {
      setBioAvailable(ok);
      setBioEnrolled(ok && hasBiometricEnrolled());
    });
  }, []);

  useEffect(() => {
    if (loading || !user) return;
    if (roles.includes("member") && !isOfficer) navigate({ to: "/member/home" });
    else if (isOfficer) {
      toast.error("This is an officer account. Please use Officer login.");
      supabase.auth.signOut();
    }
  }, [user, loading, roles, isOfficer, navigate]);

  const finishMemberLogin = async (userId: string, userEmail: string) => {
    const { data: roleRows } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const userRoles = (roleRows ?? []).map((r) => r.role);
    if (!(userRoles.includes("member") && !userRoles.includes("officer") && !userRoles.includes("super_admin"))) {
      await supabase.auth.signOut();
      toast.error("This is an officer account. Use Officer login.");
      return false;
    }
    // Offer biometric enrollment
    if (bioAvailable && !hasBiometricEnrolled()) {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setPendingSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          userId,
          email: userEmail,
        });
        setAskEnroll(true);
        return true;
      }
    }
    toast.success("Karibu! Welcome back");
    navigate({ to: "/member/home" });
    return true;
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setBusy(false); return toast.error(error.message); }
    await finishMemberLogin(data.user.id, data.user.email ?? email);
    setBusy(false);
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/member/home`,
        data: { full_name: fullName },
      },
    });
    if (error) { setBusy(false); return toast.error(error.message); }
    if (data.session && data.user) {
      toast.success("Account created! Welcome.");
      await finishMemberLogin(data.user.id, data.user.email ?? email);
    } else {
      toast.success("Account created. Check your email to confirm, then sign in.");
    }
    setBusy(false);
  };

  const forgotPassword = async () => {
    if (!email) return toast.error("Enter your email first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/member`,
    });
    if (error) return toast.error(error.message);
    toast.success("Password reset link sent. Check your email.");
  };

  const quickUnlock = async () => {
    try {
      setBusy(true);
      const sess = await verifyBiometric();
      if (!sess) { setBusy(false); return toast.error("No saved session. Sign in first."); }
      const { error } = await supabase.auth.setSession(sess);
      if (error) {
        disableBiometric();
        setBioEnrolled(false);
        setBusy(false);
        return toast.error("Session expired. Please sign in again.");
      }
      toast.success("Welcome back");
      navigate({ to: "/member/home" });
    } catch {
      setBusy(false);
      toast.error("Biometric check failed");
    }
  };

  const doEnroll = async () => {
    if (!pendingSession) return;
    try {
      await enrollBiometric({
        userId: pendingSession.userId,
        userName: pendingSession.email,
        session: { access_token: pendingSession.access_token, refresh_token: pendingSession.refresh_token },
      });
      toast.success("Biometric login enabled");
    } catch {
      toast.error("Couldn't enable biometric login");
    } finally {
      setAskEnroll(false);
      navigate({ to: "/member/home" });
    }
  };

  if (askEnroll) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <LoginBackdrop />
        <Card className="w-full max-w-md border-white/20 bg-card/40 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Fingerprint className="h-7 w-7" />
            </div>
            <CardTitle className="mt-2">Enable biometric login?</CardTitle>
            <CardDescription>
              Sign in faster next time with your fingerprint or face. Your fingerprint stays on your phone — we never see it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full h-12" onClick={doEnroll}>Enable biometric login</Button>
            <Button variant="ghost" className="w-full" onClick={() => { setAskEnroll(false); navigate({ to: "/member/home" }); }}>
              Maybe later
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-4 py-6">
      <LoginBackdrop />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

        <Card className="mt-6 border-white/20 bg-card/40 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.65_0.18_300)]/10 text-[oklch(0.55_0.2_300)]">
              <Wallet className="h-6 w-6" />
            </div>
            <CardTitle className="mt-2">Member Access</CardTitle>
            <CardDescription>Sign in or create your member account</CardDescription>
          </CardHeader>
          <CardContent>
            {bioAvailable && bioEnrolled && (
              <Button
                type="button"
                onClick={quickUnlock}
                disabled={busy}
                variant="outline"
                className="mb-4 h-12 w-full gap-2 border-primary/30"
              >
                <Fingerprint className="h-5 w-5" /> Unlock with biometrics
              </Button>
            )}

            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={signIn} className="space-y-3 pt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" autoComplete="email" className="h-12" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" autoComplete="current-password" className="h-12" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="h-12 w-full bg-[oklch(0.55_0.2_300)] text-white hover:bg-[oklch(0.5_0.2_300)]" disabled={busy}>
                    {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login as Member"}
                  </Button>
                  <button type="button" onClick={forgotPassword} className="block w-full text-center text-sm text-muted-foreground hover:text-primary">
                    Forgot password?
                  </button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={signUp} className="space-y-3 pt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="su-name">Full name</Label>
                    <Input id="su-name" className="h-12" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-email">Email</Label>
                    <Input id="su-email" type="email" autoComplete="email" className="h-12" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-password">Password</Label>
                    <Input id="su-password" type="password" minLength={6} autoComplete="new-password" className="h-12" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="h-12 w-full bg-[oklch(0.55_0.2_300)] text-white hover:bg-[oklch(0.5_0.2_300)]" disabled={busy}>
                    {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create member account"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    An officer will link your account to your chama after signup.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-white/80">
          Are you an officer?{" "}
          <Link to="/login/officer" className="font-medium text-primary hover:underline">Officer login</Link>
        </p>
        </div>

        <div className="hidden lg:flex justify-center">
          <LoginTagline />
        </div>
      </div>
    </div>
  );
}
