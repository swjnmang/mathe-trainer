import { Link } from "react-router-dom";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">In Arbeit</p>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-slate-600">Hier entsteht bald neuer Inhalt.</p>
      </div>
      <Link to="/raum-und-form" className="text-sm font-semibold text-slate-900 hover:underline">
        Zurück zu Raum &amp; Form
      </Link>
    </div>
  );
}
