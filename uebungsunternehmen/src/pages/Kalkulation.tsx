import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateTask, type CalcTask, SCHEMA_ROWS, type CalculationSchema, type CalculationDirection } from '../data/calculationTasks';

export default function Kalkulation() {
  const [task, setTask] = useState<CalcTask | null>(null);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean>>({}); // true = correct, false = wrong
  const [showSolution, setShowSolution] = useState(false);
  const [schema, setSchema] = useState<CalculationSchema>('Bezugskalkulation');
  const [direction, setDirection] = useState<CalculationDirection>('Vorwärts');

  useEffect(() => {
    newTask();
  }, [schema, direction]);

  const newTask = () => {
    const t = generateTask(schema, direction);
    setTask(t);
    
    // Pre-fill given values based on direction
    const initialInputs: Record<string, string> = {};
    
    if (schema === 'Bezugskalkulation') {
      initialInputs['lep'] = t.values.lep.toFixed(2).replace('.', ',');
      initialInputs['bezugskosten'] = t.values.bezugskosten.toFixed(2).replace('.', ',');
    } else {
      // Handelskalkulation
      initialInputs['bezugskosten'] = t.values.bezugskosten.toFixed(2).replace('.', ',');
      
      if (direction === 'Vorwärts') {
        initialInputs['lep'] = t.values.lep.toFixed(2).replace('.', ',');
      } else {
        initialInputs['brutto'] = t.values.brutto.toFixed(2).replace('.', ',');
      }
    }

    setUserInputs(initialInputs);
    setFeedback({});
    setShowSolution(false);
  };

  const handleInputChange = (key: string, value: string) => {
    setUserInputs(prev => ({ ...prev, [key]: value }));
    // Clear feedback for this field when edited
    if (feedback[key] !== undefined) {
      const newFeedback = { ...feedback };
      delete newFeedback[key];
      setFeedback(newFeedback);
    }
  };

  const checkSolution = () => {
    if (!task) return;
    
    const newFeedback: Record<string, boolean> = {};
    
    SCHEMA_ROWS.forEach(row => {
      // Skip rows not in current schema
      if (schema === 'Bezugskalkulation' && row.key === 'hkz') return; // Stop after BP
      // Actually we need to filter the rows properly in the render loop too.
      
      const userValStr = userInputs[row.key];
      if (!userValStr) return;

      const userVal = parseFloat(userValStr.replace(',', '.'));
      const correctVal = task.values[row.key];
      
      // Allow 0.05 tolerance
      if (Math.abs(userVal - correctVal) <= 0.05) {
        newFeedback[row.key] = true;
      } else {
        newFeedback[row.key] = false;
      }
    });

    setFeedback(newFeedback);
  };

  // Filter rows based on schema
  const visibleRows = SCHEMA_ROWS.filter(row => {
    if (schema === 'Bezugskalkulation') {
      // Show up to 'bp'
      const index = SCHEMA_ROWS.findIndex(r => r.key === 'bp');
      const rowIndex = SCHEMA_ROWS.findIndex(r => r.key === row.key);
      return rowIndex <= index;
    }
    return true;
  });

  if (!task) return <div>Laden...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
          ← Zurück
        </Link>
        <h1 className="text-xl font-bold ml-4 text-slate-800">Kalkulation üben</h1>
      </header>

      <main className="p-4 md:p-8 max-w-5xl mx-auto w-full">
        
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <select 
              value={schema} 
              onChange={(e) => setSchema(e.target.value as CalculationSchema)}
              className="p-2 border rounded shadow-sm"
            >
              <option value="Bezugskalkulation">Bezugskalkulation</option>
              <option value="Handelskalkulation">Handelskalkulation</option>
            </select>
            
            {schema === 'Handelskalkulation' && (
              <select 
                value={direction} 
                onChange={(e) => setDirection(e.target.value as CalculationDirection)}
                className="p-2 border rounded shadow-sm"
              >
                <option value="Vorwärts">Vorwärts</option>
                <option value="Rückwärts">Rückwärts</option>
              </select>
            )}
          </div>

          <button 
            onClick={newTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-2"
          >
            <span>↻</span> Neue Aufgabe
          </button>
        </div>

        {/* Task Description */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl mb-8 text-slate-800 leading-relaxed shadow-sm">
          {task.description}
        </div>

        {/* Calculation Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
          <div className="grid grid-cols-[2fr_1fr_1fr] bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
            <div className="p-4">Posten</div>
            <div className="p-4">Betrag (€)</div>
            <div className="p-4">Feedback</div>
          </div>

          {visibleRows.map((row, idx) => {
            const isReadOnly = (direction === 'Vorwärts' && (row.key === 'lep' || row.key === 'bezugskosten')) ||
                               (direction === 'Rückwärts' && (row.key === 'brutto' || row.key === 'bezugskosten'));
            
            // Determine percentage label
            let label = row.label;
            if (row.percentageKey) {
              label = `${row.operator} ${row.label} (${task.percentages[row.percentageKey]}%)`;
            } else if (row.operator) {
              label = `${row.operator} ${row.label}`;
            }

            return (
              <div key={row.key} className={`grid grid-cols-[2fr_1fr_1fr] border-b border-slate-100 items-center hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                <div className="p-3 pl-4 text-slate-700 font-medium">
                  {label}
                </div>
                <div className="p-2">
                  <input 
                    type="text" 
                    value={showSolution ? task.values[row.key].toFixed(2).replace('.', ',') : (userInputs[row.key] || '')}
                    onChange={(e) => handleInputChange(row.key, e.target.value)}
                    disabled={isReadOnly || showSolution}
                    className={`w-full p-2 border rounded text-right font-mono ${
                      isReadOnly ? 'bg-slate-100 text-slate-500' : 'bg-white focus:ring-2 focus:ring-blue-500 outline-none border-slate-300'
                    } ${
                      feedback[row.key] === true ? 'border-green-500 bg-green-50' : 
                      feedback[row.key] === false ? 'border-red-500 bg-red-50' : ''
                    }`}
                    placeholder="0,00"
                  />
                </div>
                <div className="p-3 flex items-center justify-center text-xl">
                  {feedback[row.key] === true && <span className="text-green-500">✓</span>}
                  {feedback[row.key] === false && <span className="text-red-500">✗</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button 
            onClick={checkSolution}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-colors flex-1 md:flex-none"
          >
            ✓ Überprüfen
          </button>
          
          <button 
            onClick={() => setShowSolution(!showSolution)}
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-colors flex-1 md:flex-none"
          >
            ℹ Musterlösung {showSolution ? 'ausblenden' : 'anzeigen'}
          </button>
        </div>

      </main>
    </div>
  );
}

