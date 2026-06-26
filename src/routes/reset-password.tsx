import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { LoginBackdrop } from "@/components/LoginBackdrop";
import { PasswordInput } from "@/components/PasswordInput";
import logoAsset from "@/assets/mchama-logo.png.asset.json";

export const Route = createFileRoute("/reset-password")({ component: ResetPassword });

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    // Supabase recovery links land here; auth state event fires PASSWORD_RECOVERY
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) return toast.error("Password must be at least 6 characters");
    if (pw !== confirm) return toast.error("Passwords do not match");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(error.message);
    await supabase.auth.signOut();
    toast.success("Password updated. Please log in with your new password.");
    navigate({ to: "/" });
  };

  return (
    <div className="relative min-h-screen px-4 py-10">
      <LoginBackdrop />
      <div className="mx-auto w-full max-w-md">
        <Card className="border border-white/20 bg-white/95 text-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55),0_8px_24px_-12px_rgba(170,2,2,0.45)] backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="smokey-red-shadow mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-[#aa0202] ring-1 ring-black/10">
              <img src={logoAsset.url} alt="M-Chama" className="h-16 w-16 object-contain" />
            </div>
            <CardTitle className="mt-3 text-[#aa0202]">Set a new password</CardTitle>
            <CardDescription className="text-neutral-600">Choose a strong password you'll remember.</CardDescription>
          </CardHeader>
          <CardContent>
            {!ready ? (
              <p className="text-center text-sm text-neutral-600">
                Validating reset link… If nothing happens, request a new link from the login page.
              </p>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pw">New password</Label>
                  <PasswordInput id="pw" className="h-12" value={pw} onChange={(e) => setPw(e.target.value)} required minLength={6} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cp">Confirm password</Label>
                  <PasswordInput id="cp" className="h-12" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
                </div>
                <Button type="submit" className="h-12 w-full bg-[#aa0202] text-white hover:bg-[#7a0101]" disabled={busy}>
                  {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : (<><ShieldCheck className="mr-2 h-5 w-5" /> Update password</>)}
                </Button>
              </form>
            )}
            <p className="mt-4 text-center text-sm">
              <Link to="/" className="text-[#aa0202] hover:underline">Back to login</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
