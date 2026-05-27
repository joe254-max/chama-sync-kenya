import { useEffect, useState } from "react";
import s1 from "@/assets/login-slides/s1.jpg";
import s2 from "@/assets/login-slides/s2.jpg";
import s3 from "@/assets/login-slides/s3.jpg";
import s4 from "@/assets/login-slides/s4.jpg";
import s5 from "@/assets/login-slides/s5.jpg";
import s6 from "@/assets/login-slides/s6.jpg";
import s7 from "@/assets/login-slides/s7.jpg";
import s8 from "@/assets/login-slides/s8.jpg";
import s9 from "@/assets/login-slides/s9.jpg";
import s10 from "@/assets/login-slides/s10.jpg";

const SLIDES = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
const TAGLINES = [
  "Save Together. Grow Together.",
  "Your Circle. Your Wealth.",
  "Small Contributions, Big Dreams.",
  "Building Futures as One.",
  "Where Community Meets Prosperity.",
  "Trust. Save. Thrive.",
  "Smart Chama. Smarter Future.",
  "Unity in Saving, Power in Growing.",
  "From Hustle to Investment.",
  "Turning Contributions into Success.",
];

const SLIDE_MS = 6500;

export function LoginBackdrop() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {SLIDES.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === idx ? 1 : 0,
            transform: i === idx ? "scale(1.08)" : "scale(1)",
            transition: "opacity 2000ms ease-in-out, transform 7000ms ease-out",
          }}
          aria-hidden
        />
      ))}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}

export function LoginTagline() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TAGLINES.length), SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setTyped("");
    const full = TAGLINES[idx];
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, [idx]);

  return (
    <div className="w-full max-w-xl rounded-3xl border border-white/20 bg-white/10 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-4">Chama Wisdom</p>
      <p className="min-h-[8rem] md:min-h-[10rem] text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
        <span className="bg-gradient-to-r from-white via-primary-foreground to-[oklch(0.85_0.15_300)] bg-clip-text text-transparent drop-shadow">
          {typed}
        </span>
        <span className="ml-1 inline-block h-10 md:h-14 w-[3px] translate-y-2 animate-pulse bg-primary" />
      </p>
    </div>
  );
}
