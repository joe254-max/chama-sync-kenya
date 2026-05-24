import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, LogOut } from "lucide-react";

export const Route = createFileRoute("/member/home")({
  component: MemberHome,
});

function MemberHome() {
  const navigate = useNavigate();
  const { user, loading, roles, isOfficer, signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/" });
    else if (isOfficer || !roles.includes("member")) navigate({ to: "/dashboard" });
  }, [user, loading, roles, isOfficer, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[oklch(0.65_0.18_300)]/5 px-4 py-6">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[oklch(0.55_0.2_300)] text-white">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-semibold">Member Portal</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <h1 className="text-xl font-semibold">Karibu! 👋</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The member portal (wallet, transactions, loans, community) is coming soon.
              You are signed in as <span className="font-medium">{user?.email}</span>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
