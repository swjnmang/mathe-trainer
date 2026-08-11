import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface TopicIndexLayoutProps {
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
}

export default function TopicIndexLayout({
  eyebrow = "Raum & Form",
  title,
  description,
  backHref = "/raum-und-form",
  backLabel = "Zurück zur Übersicht",
  children,
}: TopicIndexLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-900">
      <header className="w-full bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-4">
          <Link
            to={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{eyebrow}</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
            {description && (
              <p className="text-slate-600 max-w-2xl text-base sm:text-lg">{description}</p>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</main>
    </div>
  );
}

export function TopicCardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {children}
    </div>
  );
}

interface TopicCardProps {
  href: string;
  title: string;
  description?: string;
  icon: LucideIcon;
}

export function TopicCard({ href, title, description, icon: Icon }: TopicCardProps) {
  return (
    <Link
      to={href}
      className="bg-white rounded-2xl p-4 sm:p-5 text-center text-slate-900 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col items-center h-full border border-slate-100"
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-50 flex items-center justify-center text-[var(--accent)] mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold mb-1.5 text-slate-800">{title}</h3>
      {description && <p className="text-slate-500 leading-snug text-sm">{description}</p>}
      <div className="mt-auto" aria-hidden="true" />
    </Link>
  );
}
