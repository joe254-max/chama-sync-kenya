import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Users, Wallet, BarChart3, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">CS</div>
            <span className="text-lg font-semibold">ChamaSync</span>
          </div>
          <Link to="/auth"><Button>Sign in</Button></Link>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Manage your <span className="text-primary">Chama</span> with confidence
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            ChamaSync brings your Kenyan savings group into one clean, mobile-friendly app —
            members, savings, loans, and meeting records, all in one place.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/auth"><Button size="lg">Get started</Button></Link>
          </div>
        </section>

        <section className="container mx-auto grid gap-6 px-4 pb-20 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, title: "Member management", body: "Track every member, their savings, shares and loans." },
            { icon: Wallet, title: "Meeting Mode", body: "Streamlined data entry built for live chama meetings." },
            { icon: BarChart3, title: "Reports & analytics", body: "Performance reports and growth charts that match your paper forms." },
            { icon: ShieldCheck, title: "Secure by design", body: "Role-based access — admins, officers and members each see what they should." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ChamaSync
      </footer>
    </div>
  );
}
