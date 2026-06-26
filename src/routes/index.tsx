import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ClipboardList, Wallet, ArrowRight } from "lucide-react";
import logoAsset from "@/assets/mchama-logo.png.asset.json";

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
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#fff1f1] px-4 py-8 text-black">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col">
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="smokey-red-shadow relative grid h-32 w-32 place-items-center overflow-hidden rounded-full bg-[#aa0202] ring-1 ring-black/10">
            <span className="pointer-events-none absolute inset-1.5 rounded-full border border-white/30" />
            <span className="pointer-events-none absolute inset-3 rounded-full border border-white/15" />
            <img src={logoAsset.url} alt="M-Chama logo" className="relative h-24 w-24 object-contain" />
          </div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-[#aa0202]">Together We Grow</p>
        </div>

        {/* Heading */}
        <div className="mt-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            Welcome back.
          </h2>
          <p className="mt-2 text-lg text-neutral-600">Who are you?</p>
        </div>

        {/* Role cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            to="/login/officer"
            className="group flex min-h-[180px] flex-col justify-between rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:border-[#aa0202]/40 hover:shadow-[0_18px_40px_-16px_rgba(170,2,2,0.45)] active:scale-[0.98]"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#aa0202]/10 text-[#aa0202]">
                <ClipboardList className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-black">I am an Officer</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Manage chamas, meetings and member records
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#aa0202]">
              Continue <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/login/member"
            className="group flex min-h-[180px] flex-col justify-between rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:border-[#aa0202]/40 hover:shadow-[0_18px_40px_-16px_rgba(170,2,2,0.45)] active:scale-[0.98]"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/90 text-white">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-black">I am a Member</h3>
              <p className="mt-1 text-sm text-neutral-600">
                View my savings, loans and transactions
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-black">
              Continue <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Footer hint */}
        <p className="mt-auto pt-10 text-center text-sm text-neutral-500">
          First time here? Contact your chama officer to get registered.
        </p>
      </div>
    </div>
  );
}
