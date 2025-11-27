import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-br from-slate-800 to-slate-700 text-white py-12 px-4 text-center shadow-md relative">
        <a href="https://swjnmang.github.io/wss-digital/" className="absolute top-4 left-4 text-slate-300 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
          ← Zurück zu wss-digital
        </a>
        <h1 className="text-4xl font-bold mb-2 tracking-tight">
          Übungsunternehmen <span className="text-blue-400 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-1 after:bg-blue-600/35">Digital</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-xl mx-auto">
          Wähle einen Bereich, um zu starten.
        </p>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-12 flex items-center justify-center">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-8 w-full">
          
          <Link to="/buchungssaetze" className="bg-white rounded-2xl p-10 text-center text-slate-900 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col items-center h-full border border-slate-100">
            <div className="text-5xl mb-6 text-blue-500">
              📊
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-slate-800">Buchungssätze</h2>
            <p className="text-slate-500 leading-relaxed">
              Trainiere das Bilden von Buchungssätzen für verschiedene Geschäftsvorfälle.
            </p>
          </Link>

          <Link to="/kalkulation" className="bg-white rounded-2xl p-10 text-center text-slate-900 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col items-center h-full border border-slate-100">
            <div className="text-5xl mb-6 text-blue-500">
              🧮
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-slate-800">Bezugs- und Handelskalkulation</h2>
            <p className="text-slate-500 leading-relaxed">
              Berechne Bezugspreise, Selbstkosten und Verkaufspreise.
            </p>
          </Link>

          <Link to="/angebotsvergleich" className="bg-white rounded-2xl p-10 text-center text-slate-900 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col items-center h-full border border-slate-100">
            <div className="text-5xl mb-6 text-blue-500">
              ⚖️
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-slate-800">Angebotsvergleich</h2>
            <p className="text-slate-500 leading-relaxed">
              Vergleiche Angebote qualitativ und quantitativ anhand verschiedener Kriterien.
            </p>
          </Link>

          <Link to="/geschaeftsbriefe" className="bg-white rounded-2xl p-10 text-center text-slate-900 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col items-center h-full border border-slate-100">
            <div className="text-5xl mb-6 text-blue-500">
              ✉️
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-slate-800">DIN-Briefe</h2>
            <p className="text-slate-500 leading-relaxed">
              Trainiere das korrekte Erstellen von Geschäftsbriefen nach DIN 5008.
            </p>
          </Link>

        </div>
      </main>
    </div>
  );
}
