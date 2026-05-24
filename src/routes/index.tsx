import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ClipboardList, Wallet, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user, loading, isOfficer, roles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;
    if (isOfficer) navigate({ to: "/dashboard" });
    else if (roles.includes("member")) navigate({ to: "/member/home" });
  }, [user, loading, isOfficer, roles, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col">
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="M-Chama logo" className="h-24 w-24 object-contain" />
          <p className="mt-1 text-sm text-muted-foreground">Together We Grow</p>
        </div>

        {/* Heading */}
        <div className="mt-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back.
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">Who are you?</p>
        </div>

        {/* Role cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            to="/login/officer"
            className="group flex min-h-[180px] flex-col justify-between rounded-2xl border-2 border-primary/20 bg-card p-5 shadow-sm transition hover:border-primary hover:shadow-md active:scale-[0.98]"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardList className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">I am an Officer</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage chamas, meetings and member records
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
              Continue <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/login/member"
            className="group flex min-h-[180px] flex-col justify-between rounded-2xl border-2 border-[oklch(0.65_0.18_300)]/20 bg-card p-5 shadow-sm transition hover:border-[oklch(0.65_0.18_300)] hover:shadow-md active:scale-[0.98]"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.65_0.18_300)]/10 text-[oklch(0.55_0.2_300)]">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">I am a Member</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                View my savings, loans and transactions
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[oklch(0.55_0.2_300)]">
              Continue <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Footer hint */}
        <p className="mt-auto pt-10 text-center text-sm text-muted-foreground">
          First time here? Contact your chama officer to get registered.
        </p>
      </div>
    </div>
  );
}
