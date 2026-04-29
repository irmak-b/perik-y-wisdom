import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Calendar, BookOpen, Sparkles, User } from "lucide-react";
import parchment from "@/assets/parchment-bg.jpg";

const tabs = [
  { to: "/app", label: "Yuva", icon: Sparkles, end: true },
  { to: "/app/cycle", label: "Mevsimler", icon: Calendar },
  { to: "/app/wisdom", label: "Bilgelik", icon: BookOpen },
  { to: "/app/profile", label: "Profil", icon: User },
];

export const MobileShell = ({ children }: { children: ReactNode }) => {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex justify-center bg-secondary/30">
      <div
        className="w-full max-w-md min-h-screen relative flex flex-col"
        style={{
          backgroundImage: `url(${parchment})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "local",
        }}
      >
        <div className="absolute inset-0 bg-parchment/40 pointer-events-none" />
        <main className="relative flex-1 pb-24">{children}</main>

        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-3 pb-3 pt-2 z-50"
          aria-label="Ana navigasyon"
        >
          <div className="rounded-3xl border border-border/70 bg-card/95 backdrop-blur shadow-[var(--shadow-card)] flex justify-around py-2 px-2">
            {tabs.map((t) => {
              const active =
                t.end ? loc.pathname === t.to : loc.pathname.startsWith(t.to);
              const Icon = t.icon;
              return (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.end}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all ${
                    active
                      ? "text-primary-foreground bg-secondary"
                      : "text-secondary/80 hover:text-secondary"
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.6} />
                  <span className="font-display text-xs leading-none">{t.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};
