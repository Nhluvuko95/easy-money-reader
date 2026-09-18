import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, CopyCheck, FileText, Home, PieChart } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/statements", label: "Statements", icon: FileText },
  { to: "/duplicates", label: "Duplicates", icon: CopyCheck },
  { to: "/summary", label: "Summary", icon: PieChart },
] as const;

export function AppShell({
  title,
  subtitle,
  back,
  children,
}: {
  title: string;
  subtitle?: string;
  back?: { to: string; label: string };
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b-2 border-border bg-primary px-5 py-5 text-primary-foreground">
        <div className="mx-auto w-full max-w-2xl">
          {back ? (
            <Link
              to={back.to}
              className="mb-3 inline-flex min-h-12 items-center gap-2 rounded-xl px-3 py-2 text-lg font-bold underline underline-offset-4"
            >
              <ArrowLeft className="size-6 shrink-0" aria-hidden />
              {back.label}
            </Link>
          ) : null}
          <h1 className="text-3xl font-bold">{title}</h1>
          {subtitle ? <p className="mt-1 text-lg opacity-90">{subtitle}</p> : null}
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-40 pt-6">{children}</main>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-border bg-card"
      >
        <ul className="mx-auto grid w-full max-w-2xl grid-cols-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-20 flex-col items-center justify-center gap-1 px-1 py-3 text-base font-bold",
                    active ? "bg-secondary text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-8 shrink-0" aria-hidden />
                  <span>{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
