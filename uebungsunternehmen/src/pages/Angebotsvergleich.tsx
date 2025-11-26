import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateComparisonTask, type ComparisonTask } from '../data/offerTasks';

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
  const [showSolution, setShowSolution] = useState(false);
  const [userPrices, setUserPrices] = useState<Record<string, string>>({});
  const [priceValidation, setPriceValidation] = useState<Record<string, boolean | null>>({});

  useEffect(() => {
    newTask();
  }, []);

  const newTask = () => {
    const t = generateComparisonTask();
    setTask(t);
    setWinnerId(null);
    setShowSolution(false);
    setUserPrices({});
    setPriceValidation({});
    // Initialize criteria with empty scores
    setCriteria(DEFAULT_CRITERIA.map(c => ({
      ...c,
      weight: 1,
      scores: t.offers.reduce((acc, offer) => ({ ...acc, [offer.id]: 0 }), {})
    })));
  };

  const checkPrice = (offerId: string, correctPrice: number) => {
    const input = userPrices[offerId]?.replace(',', '.') || '0';
    const userPrice = parseFloat(input);
    const isValid = Math.abs(userPrice - correctPrice) < 0.05;
    setPriceValidation(prev => ({ ...prev, [offerId]: isValid }));
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
          {task.offers.map((offer, idx) => {
            return (
              <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="bg-slate-100 p-4 border-b border-slate-200 font-bold text-lg text-center text-slate-700">
                  Angebot {idx + 1}: {offer.supplier.name}
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  {/* Offer Document */}
                  {idx % 3 === 0 && (
                    <div className="bg-white border border-slate-300 p-6 shadow-sm relative font-serif text-slate-900 text-sm leading-relaxed">
                      <div className="text-center border-b-2 border-slate-800 pb-2 mb-4">
                        <h3 className="text-xl font-bold uppercase tracking-widest">{offer.supplier.name}</h3>
                        <p className="text-xs text-slate-500">Ihr Partner für Technik</p>
                      </div>
                      <p className="mb-4">Sehr geehrte Damen und Herren,</p>
                      <p className="mb-2">wir danken für Ihre Anfrage und unterbreiten Ihnen folgendes Angebot:</p>
                      <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>Listenpreis: <strong>{offer.listPrice.toFixed(2)} €</strong></li>
                        <li>Lieferzeit: {offer.deliveryTime} Tage</li>
                        <li>Garantie: {offer.warranty} Jahre</li>
                      </ul>
                      <p className="mb-2">Konditionen:</p>
                      <p className="text-xs text-slate-600 mb-4">
                        Wir gewähren {offer.discount}% Rabatt sowie {offer.cashDiscount}% Skonto bei Zahlung innerhalb von 14 Tagen. 
                        Für Verpackung und Versand berechnen wir {offer.shipping.toFixed(2)} €.
                      </p>
                      <p>Mit freundlichen Grüßen,<br/>i.A. Müller</p>
                    </div>
                  )}

                  {idx % 3 === 1 && (
                    <div className="bg-slate-50 border-l-4 border-blue-500 p-5 shadow-sm relative font-sans text-slate-800 text-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-blue-600 text-lg">{offer.supplier.name}</span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Angebot</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                        <div>
                          <span className="block text-slate-500">Preis (netto)</span>
                          <span className="font-bold text-lg">{offer.listPrice.toFixed(2)} €</span>
                        </div>
                        <div>
                          <span className="block text-slate-500">Versand</span>
                          <span className="font-bold">{offer.shipping.toFixed(2)} €</span>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border border-slate-200 mb-4 text-xs space-y-1">
                        <div className="flex justify-between"><span>Rabatt:</span> <span>{offer.discount}%</span></div>
                        <div className="flex justify-between"><span>Skonto:</span> <span>{offer.cashDiscount}%</span></div>
                        <div className="flex justify-between"><span>Lieferung:</span> <span>in {offer.deliveryTime} Tagen</span></div>
                        <div className="flex justify-between"><span>Garantie:</span> <span>{offer.warranty} Jahre</span></div>
                      </div>
                      <p className="text-xs italic text-slate-500">Wir freuen uns auf Ihre Bestellung!</p>
                    </div>
                  )}

                  {idx % 3 === 2 && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 shadow-md relative font-mono text-slate-800 text-xs transform rotate-1">
                      <div className="border-b border-slate-400 pb-2 mb-2 font-bold text-center text-base">
                        {offer.supplier.name}
                      </div>
                      <p className="mb-2">Hi,</p>
                      <p className="mb-2">hier ist das Angebot für die angefragte Hardware:</p>
                      <p className="mb-1">&gt; Preis: {offer.listPrice.toFixed(2)} EUR</p>
                      <p className="mb-1">&gt; Rabatt: {offer.discount} %</p>
                      <p className="mb-1">&gt; Skonto: {offer.cashDiscount} %</p>
                      <p className="mb-1">&gt; Versandkosten: {offer.shipping.toFixed(2)} EUR</p>
                      <br/>
                      <p className="mb-1">Details:</p>
                      <p className="mb-1">- {offer.warranty} Jahre Garantie</p>
                      <p className="mb-1">- Lieferung in ca. {offer.deliveryTime} Tagen</p>
                      <br/>
                      <p>Grüße aus dem Lager!</p>
                    </div>
                  )}

                  {/* Price Calculation Input */}
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Bezugspreis berechnen:
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="0,00"
                        value={userPrices[offer.id] || ''}
                        onChange={(e) => setUserPrices(prev => ({...prev, [offer.id]: e.target.value}))}
                        className={`w-full p-2 border rounded text-right font-mono ${
                          priceValidation[offer.id] === true ? 'border-green-500 bg-green-50 text-green-700' :
                          priceValidation[offer.id] === false ? 'border-red-500 bg-red-50 text-red-700' :
                          'border-slate-300'
                        }`}
                      />
                      <button 
                        onClick={() => checkPrice(offer.id, offer.finalPrice)}
                        className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700 transition-colors"
                      >
                        ✓
                      </button>
                    </div>
                    {priceValidation[offer.id] === false && (
                      <div className="text-xs text-red-600 mt-1">Falsch. Versuch es nochmal!</div>
                    )}
                    {priceValidation[offer.id] === true && (
                      <div className="text-xs text-green-600 mt-1 font-bold">Korrekt!</div>
                    )}
                  </div>

                  {showSolution && (
                     <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded text-sm animate-in fade-in">
                       <div className="font-bold text-green-800 mb-1">Lösungsweg:</div>
                       <div className="grid grid-cols-[1fr_auto] gap-x-4 text-xs text-green-900 font-mono">
                          <span>Listenpreis:</span> <span>{offer.listPrice.toFixed(2)} €</span>
                          <span>- {offer.discount}% Rabatt:</span> <span>{(offer.listPrice * offer.discount / 100).toFixed(2)} €</span>
                          <span className="font-bold border-t border-green-200">Zieleinkaufspreis:</span> <span className="font-bold border-t border-green-200">{(offer.listPrice * (1 - offer.discount / 100)).toFixed(2)} €</span>
                          <span>- {offer.cashDiscount}% Skonto:</span> <span>{(offer.listPrice * (1 - offer.discount / 100) * offer.cashDiscount / 100).toFixed(2)} €</span>
                          <span className="font-bold border-t border-green-200">Bareinkaufspreis:</span> <span className="font-bold border-t border-green-200">{(offer.listPrice * (1 - offer.discount / 100) * (1 - offer.cashDiscount / 100)).toFixed(2)} €</span>
                          <span>+ Bezugskosten:</span> <span>{offer.shipping.toFixed(2)} €</span>
                          <span className="font-bold border-t border-green-200 pt-1">Bezugspreis:</span> <span className="font-bold border-t border-green-200 pt-1">{offer.finalPrice.toFixed(2)} €</span>
                       </div>
                     </div>
                  )}
                  
                  <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 italic mt-2">
                    "{offer.supplier.description}"
                  </div>
                </div>
              </div>
            );
          })}
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
          <div className="flex justify-center gap-4 flex-wrap mb-6">
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
          
          <div className="flex justify-center mb-6">
             <button
              onClick={() => setShowSolution(!showSolution)}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              {showSolution ? 'Lösung verbergen' : 'Lösung anzeigen (Bezugspreise)'}
            </button>
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
