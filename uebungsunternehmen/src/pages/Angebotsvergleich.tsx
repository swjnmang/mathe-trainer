import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateComparisonTask, type ComparisonTask, type Offer } from '../data/offerTasks';

interface Criterion {
  id: string;
  name: string;
  weight: number; // 1-5
  scores: Record<string, number>; // offerId -> score (1-10)
}

const DEFAULT_CRITERIA = [
  { id: 'price', name: 'Bezugspreis (Niedriger ist besser)' },
  { id: 'quality', name: 'Qualität / Verarbeitung' },
  { id: 'env', name: 'Umweltschutz / Nachhaltigkeit' },
  { id: 'service', name: 'Service / Support' },
  { id: 'delivery', name: 'Lieferzeit (Kürzer ist besser)' },
  { id: 'warranty', name: 'Garantiezeit (Länger ist besser)' }
];

export default function Angebotsvergleich() {
  const [task, setTask] = useState<ComparisonTask | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [winnerId, setWinnerId] = useState<string | null>(null);

  useEffect(() => {
    newTask();
  }, []);

  const newTask = () => {
    const t = generateComparisonTask();
    setTask(t);
    setWinnerId(null);
    // Initialize criteria with empty scores
    setCriteria(DEFAULT_CRITERIA.map(c => ({
      ...c,
      weight: 1,
      scores: t.offers.reduce((acc, offer) => ({ ...acc, [offer.id]: 0 }), {})
    })));
  };

  const updateWeight = (criterionId: string, weight: number) => {
    setCriteria(prev => prev.map(c => c.id === criterionId ? { ...c, weight } : c));
  };

  const updateScore = (criterionId: string, offerId: string, score: number) => {
    setCriteria(prev => prev.map(c => c.id === criterionId ? { 
      ...c, 
      scores: { ...c.scores, [offerId]: score } 
    } : c));
  };

  const calculateTotal = (offerId: string) => {
    return criteria.reduce((sum, c) => sum + (c.scores[offerId] || 0) * c.weight, 0);
  };

  const handleDecision = (id: string) => {
    setWinnerId(id);
  };

  if (!task) return <div>Laden...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
          ← Zurück
        </Link>
        <h1 className="text-xl font-bold ml-4 text-slate-800">
          Angebotsvergleich: {task.product}
        </h1>
        <button 
          onClick={newTask}
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          ↻ Neue Aufgabe
        </button>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* Offers Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {task.offers.map((offer, idx) => (
            <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-slate-100 p-4 border-b border-slate-200 font-bold text-lg text-center text-slate-700">
                Angebot {idx + 1}: {offer.supplier.name}
              </div>
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="text-3xl font-bold text-blue-600 text-center mb-2">
                  {offer.price.toFixed(2)} €
                </div>
                
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Lieferzeit:</span>
                    <span className="font-medium text-slate-900">{offer.deliveryTime} Tage</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Garantie:</span>
                    <span className="font-medium text-slate-900">{offer.warranty} Jahre</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 italic mt-2">
                  "{offer.supplier.description}"
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scoring Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 mb-8">
          <div className="p-6 bg-slate-800 text-white">
            <h2 className="text-xl font-bold">Nutzwertanalyse</h2>
            <p className="text-slate-300 text-sm mt-1">Gewichte die Kriterien (1-5) und verteile Punkte (1-10) für jedes Angebot.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-sm uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 w-1/4">Kriterium</th>
                  <th className="p-4 w-24 text-center">Gewichtung<br/>(1-5)</th>
                  {task.offers.map((offer, idx) => (
                    <th key={offer.id} className="p-4 text-center">
                      Angebot {idx + 1}<br/>
                      <span className="text-xs normal-case text-slate-500">{offer.supplier.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criteria.map(criterion => (
                  <tr key={criterion.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-700">
                      {criterion.name}
                    </td>
                    <td className="p-4 text-center">
                      <input 
                        type="number" 
                        min="1" max="5" 
                        value={criterion.weight}
                        onChange={(e) => updateWeight(criterion.id, parseInt(e.target.value) || 0)}
                        className="w-16 p-2 border border-slate-300 rounded text-center font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </td>
                    {task.offers.map(offer => (
                      <td key={offer.id} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <input 
                            type="number" 
                            min="0" max="10" 
                            value={criterion.scores[offer.id] || ''}
                            onChange={(e) => updateScore(criterion.id, offer.id, parseInt(e.target.value) || 0)}
                            className="w-16 p-2 border border-slate-300 rounded text-center focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="0-10"
                          />
                          <span className="text-xs text-slate-400 font-mono">
                            x{criterion.weight}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Totals Row */}
                <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                  <td className="p-4 text-right" colSpan={2}>Gesamtpunktzahl:</td>
                  {task.offers.map(offer => {
                    const total = calculateTotal(offer.id);
                    const isWinner = winnerId === offer.id;
                    const maxPoints = Math.max(...task.offers.map(o => calculateTotal(o.id)));
                    const isHighest = total === maxPoints && total > 0;

                    return (
                      <td key={offer.id} className={`p-4 text-center text-xl ${isHighest ? 'text-green-600' : ''}`}>
                        {total}
                        {isHighest && <div className="text-xs text-green-600 font-normal mt-1">Beste Punktzahl</div>}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Decision Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-slate-200">
          <h3 className="text-lg font-bold mb-6">Deine Entscheidung</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {task.offers.map((offer, idx) => (
              <button
                key={offer.id}
                onClick={() => handleDecision(offer.id)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  winnerId === offer.id 
                    ? 'bg-green-600 text-white shadow-lg scale-105 ring-4 ring-green-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Angebot {idx + 1} wählen
              </button>
            ))}
          </div>
          {winnerId && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
              <p className="text-xl text-slate-800">
                Du hast dich für <strong>{task.offers.find(o => o.id === winnerId)?.supplier.name}</strong> entschieden.
              </p>
              <p className="text-slate-500 mt-2">
                Vergleiche deine Entscheidung mit der errechneten Punktzahl oben.
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
