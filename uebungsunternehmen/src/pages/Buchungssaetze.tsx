import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateBookingTask, type Task } from '../data/bookingTasks';
import { IKR_ACCOUNTS } from '../data/ikr';
import DocumentView from '../components/DocumentView';

export default function Buchungssaetze() {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Advanced State for multiple rows
  const [bookingRows, setBookingRows] = useState([
    { id: 1, account: '', amount: '', type: 'Soll' },
    { id: 2, account: '', amount: '', type: 'Haben' }
  ]);

  useEffect(() => {
    newTask();
  }, []);

  const newTask = () => {
    setCurrentTask(generateBookingTask());
    setFeedback(null);
    setShowHint(false);
    setBookingRows([
      { id: 1, account: '', amount: '', type: 'Soll' },
      { id: 2, account: '', amount: '', type: 'Haben' }
    ]);
  };

  const addRow = () => {
    setBookingRows([...bookingRows, { id: Date.now(), account: '', amount: '', type: 'Soll' }]);
  };

  const updateRow = (id: number, field: string, value: string) => {
    setBookingRows(rows => rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const removeRow = (id: number) => {
    setBookingRows(rows => rows.filter(r => r.id !== id));
  };

  const handleCheckAdvanced = () => {
    if (!currentTask) return;

    // Normalize user input
    const userBooking = bookingRows.map(row => ({
      account: row.account,
      amount: parseFloat(row.amount.replace(',', '.')),
      isDebit: row.type === 'Soll'
    })).filter(r => r.account && !isNaN(r.amount));

    // Compare with solution
    // 1. Check number of lines
    if (userBooking.length !== currentTask.solution.length) {
      setFeedback({ type: 'error', message: `Die Anzahl der Buchungszeilen stimmt nicht. (Erwartet: ${currentTask.solution.length})` });
      return;
    }

    // 2. Check each line (order doesn't matter, but account+type must match)
    let allCorrect = true;
    const solutionCopy = [...currentTask.solution];

    for (const userLine of userBooking) {
      const matchIndex = solutionCopy.findIndex(sol => 
        sol.account === userLine.account && 
        sol.isDebit === userLine.isDebit &&
        Math.abs(sol.amount - userLine.amount) < 0.01
      );

      if (matchIndex !== -1) {
        solutionCopy.splice(matchIndex, 1);
      } else {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setFeedback({ type: 'success', message: 'Hervorragend! Der Buchungssatz ist korrekt.' });
    } else {
      setFeedback({ type: 'error', message: 'Der Buchungssatz ist leider falsch. Überprüfe Konten und Beträge.' });
    }
  };

  if (!currentTask) return <div>Laden...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
          ← Zurück
        </Link>
        <h1 className="text-xl font-bold ml-4 text-slate-800">
          Buchungssätze üben
        </h1>
        <button 
          onClick={newTask}
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          ↻ Neue Aufgabe
        </button>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Document */}
        <div className="flex flex-col gap-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-800">
            <p className="font-bold">Situation:</p>
            <p>{currentTask.description}</p>
            <p className="text-sm mt-2 text-blue-600">Du arbeitest für die <strong>Büro-Design GmbH</strong>.</p>
          </div>
          
          <div className="overflow-auto max-h-[calc(100vh-250px)] rounded shadow-lg">
            <DocumentView task={currentTask} />
          </div>
        </div>

        {/* Right Column: Booking Interface */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Buchungssatz bilden</h2>
              <button 
                onClick={() => setShowHint(!showHint)}
                className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
              >
                {showHint ? '💡 Hilfe ausblenden' : '💡 Hilfe anzeigen'}
              </button>
            </div>

            {showHint && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mb-4 text-sm text-amber-800 animate-in fade-in slide-in-from-top-2">
                <strong>Tipp:</strong> {currentTask.hint}
              </div>
            )}
            
            <div className="space-y-3 mb-6">
              {bookingRows.map((row) => (
                <div key={row.id} className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Konto</label>
                    <select 
                      value={row.account}
                      onChange={(e) => updateRow(row.id, 'account', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Wählen...</option>
                      {IKR_ACCOUNTS.map(acc => (
                        <option key={acc.number} value={acc.number}>
                          {acc.number} - {acc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-32">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Betrag</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={row.amount}
                        onChange={(e) => updateRow(row.id, 'amount', e.target.value)}
                        placeholder="0,00"
                        className="w-full p-2 border border-slate-300 rounded text-sm text-right pr-6 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <span className="absolute right-2 top-2 text-slate-400 text-sm">€</span>
                    </div>
                  </div>

                  <div className="w-24">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Seite</label>
                    <select 
                      value={row.type}
                      onChange={(e) => updateRow(row.id, 'type', e.target.value)}
                      className={`w-full p-2 border rounded text-sm font-bold ${row.type === 'Soll' ? 'text-red-600 bg-red-50 border-red-200' : 'text-green-600 bg-green-50 border-green-200'}`}
                    >
                      <option value="Soll">Soll</option>
                      <option value="Haben">Haben</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => removeRow(row.id)}
                    className="mt-6 text-slate-400 hover:text-red-500 p-1"
                    title="Zeile entfernen"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mb-8">
              <button 
                onClick={addRow}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50 transition-colors"
              >
                + Zeile hinzufügen
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-sm text-slate-500">
                Summe Soll: <span className={Math.abs(bookingRows.filter(r => r.type === 'Soll').reduce((sum, r) => sum + (parseFloat(r.amount.replace(',', '.')) || 0), 0) - bookingRows.filter(r => r.type === 'Haben').reduce((sum, r) => sum + (parseFloat(r.amount.replace(',', '.')) || 0), 0)) < 0.01 ? 'text-green-600 font-bold' : 'text-red-500'}>
                  {bookingRows.filter(r => r.type === 'Soll').reduce((sum, r) => sum + (parseFloat(r.amount.replace(',', '.')) || 0), 0).toFixed(2)} €
                </span>
                <span className="mx-2">|</span>
                Summe Haben: <span className="font-medium">
                  {bookingRows.filter(r => r.type === 'Haben').reduce((sum, r) => sum + (parseFloat(r.amount.replace(',', '.')) || 0), 0).toFixed(2)} €
                </span>
              </div>
              
              <button 
                onClick={handleCheckAdvanced}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
              >
                Prüfen
              </button>
            </div>
          </div>

          {feedback && (
            <div className={`p-4 rounded-lg border ${feedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{feedback.type === 'success' ? '🎉' : '⚠️'}</span>
                <div>
                  <p className="font-bold">{feedback.type === 'success' ? 'Richtig!' : 'Nicht ganz...'}</p>
                  <p>{feedback.message}</p>
                </div>
              </div>
              {feedback.type === 'success' && (
                <button 
                  onClick={newTask}
                  className="mt-3 text-sm font-bold underline hover:no-underline"
                >
                  Nächste Aufgabe →
                </button>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}


