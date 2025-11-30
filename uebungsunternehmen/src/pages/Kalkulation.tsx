import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateTask, type CalcTask, SCHEMA_ROWS, type CalculationSchema, type CalculationDirection, getCalculationExplanation } from '../data/calculationTasks';

export default function Kalkulation() {
  const [task, setTask] = useState<CalcTask | null>(null);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean>>({}); // true = correct, false = wrong
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
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
    
    // Bezugskosten is typically given in both directions
    initialInputs['bezugskosten'] = t.values.bezugskosten.toFixed(2).replace('.', ',');
    
    if (direction === 'Vorwärts') {
      initialInputs['lep'] = t.values.lep.toFixed(2).replace('.', ',');
    } else {
      // Rückwärts
      if (schema === 'Bezugskalkulation') {
        initialInputs['bp'] = t.values.bp.toFixed(2).replace('.', ',');
      } else {
        initialInputs['brutto'] = t.values.brutto.toFixed(2).replace('.', ',');
      }
    }

    setUserInputs(initialInputs);
    setFeedback({});
    setExpandedExplanations({});
    setShowSolution(false);
  };

  const handleInputChange = (key: string, value: string) => {
    setUserInputs(prev => ({ ...prev, [key]: value }));
    // Clear feedback for this field when edited
    if (feedback[key] !== undefined) {
      const newFeedback = { ...feedback };
      delete newFeedback[key];
      setFeedback(newFeedback);
      
      // Also hide explanation
      if (expandedExplanations[key]) {
        const newExpl = { ...expandedExplanations };
        delete newExpl[key];
        setExpandedExplanations(newExpl);
      }
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

      // Handle German number format (1.234,56)
      // Remove thousands separator (.) and replace decimal separator (,) with (.)
      const normalizedStr = userValStr.replace(/\./g, '').replace(',', '.');
      const userVal = parseFloat(normalizedStr);
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

      <main className="p-2 md:p-8 max-w-5xl mx-auto w-full">
        
        {/* Controls */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-4 md:mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 md:gap-4 w-full sm:w-auto">
            <select 
              value={schema} 
              onChange={(e) => setSchema(e.target.value as CalculationSchema)}
              className="p-2 border rounded shadow-sm text-sm flex-1 sm:flex-none"
            >
              <option value="Bezugskalkulation">Bezugskalkulation</option>
              <option value="Handelskalkulation">Handelskalkulation</option>
            </select>
            
            <select 
              value={direction} 
              onChange={(e) => setDirection(e.target.value as CalculationDirection)}
              className="p-2 border rounded shadow-sm text-sm flex-1 sm:flex-none"
            >
              <option value="Vorwärts">Vorwärts</option>
              <option value="Rückwärts">Rückwärts</option>
            </select>
          </div>

          <button 
            onClick={newTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
          >
            <span>↻</span> Neue Aufgabe
          </button>
        </div>

        {/* Task Description */}
        <div className="bg-blue-50 border border-blue-100 p-4 md:p-6 rounded-xl mb-4 md:mb-8 text-slate-800 leading-relaxed shadow-sm text-sm md:text-base">
          {task.description}
        </div>

        {/* Calculation Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 text-xs md:text-base">
          <div className="grid grid-cols-[1fr_90px_32px] sm:grid-cols-[1fr_120px_50px] md:grid-cols-[1fr_180px_80px] bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
            <div className="p-1 md:p-3">Posten</div>
            <div className="p-1 md:p-3 text-right md:text-left">Betrag (€)</div>
            <div className="p-1 md:p-3 text-center">Status</div>
          </div>

          {visibleRows.map((row, idx) => {
            const isReadOnly = 
              row.key === 'bezugskosten' ||
              (direction === 'Vorwärts' && row.key === 'lep') ||
              (direction === 'Rückwärts' && (
                (schema === 'Bezugskalkulation' && row.key === 'bp') ||
                (schema === 'Handelskalkulation' && row.key === 'brutto')
              ));
            
            // Determine percentage label
            let label = row.label;
            if (row.percentageKey) {
              label = `${row.operator} ${row.label} (${task.percentages[row.percentageKey]}%)`;
            } else if (row.operator) {
              label = `${row.operator} ${row.label}`;
            }

            return (
              <div key={row.key} className={`grid grid-cols-[1fr_90px_32px] sm:grid-cols-[1fr_120px_50px] md:grid-cols-[1fr_180px_80px] border-b border-slate-100 items-center hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                <div className="p-1 pl-2 md:p-2 md:pl-4 text-slate-700 font-medium truncate" title={label}>
                  {label}
                </div>
                <div className="p-0.5 md:p-1">
                  <input 
                    type="text" 
                    value={showSolution ? task.values[row.key].toFixed(2).replace('.', ',') : (userInputs[row.key] || '')}
                    onChange={(e) => handleInputChange(row.key, e.target.value)}
                    disabled={isReadOnly || showSolution}
                    className={`w-full p-0.5 md:p-1.5 border rounded text-right font-mono text-xs md:text-base ${
                      isReadOnly ? 'bg-slate-100 text-slate-500' : 'bg-white focus:ring-2 focus:ring-blue-500 outline-none border-slate-300'
                    } ${
                      feedback[row.key] === true ? 'border-green-500 bg-green-50' : 
                      feedback[row.key] === false ? 'border-red-500 bg-red-50' : ''
                    }`}
                    placeholder="0,00"
                  />
                </div>
                <div className="p-0.5 md:p-2 flex flex-col items-center justify-center relative">
                  <div className="flex items-center gap-0.5 md:gap-2 text-base md:text-xl">
                    {feedback[row.key] === true && <span className="text-green-500">✓</span>}
                    {feedback[row.key] === false && (
                      <>
                        <span className="text-red-500">✗</span>
                        <button 
                          onClick={() => setExpandedExplanations(prev => ({...prev, [row.key]: !prev[row.key]}))}
                          className="text-[10px] md:text-xs bg-blue-100 text-blue-700 px-1 py-0.5 md:px-2 md:py-1 rounded hover:bg-blue-200 font-bold"
                          title="Erklärung anzeigen"
                        >
                          ?
                        </button>
                      </>
                    )}
                  </div>
                  {expandedExplanations[row.key] && feedback[row.key] === false && (
                    <div className="absolute right-full top-0 mr-2 z-20 w-40 md:w-64 text-[10px] md:text-xs text-slate-600 bg-white p-2 rounded-lg border border-blue-200 shadow-xl">
                      <div className="font-bold text-blue-800 mb-1">Lösungsweg:</div>
                      {getCalculationExplanation(row.key, direction, task)}
                      <div className="absolute right-[-6px] top-3 w-3 h-3 bg-white border-t border-r border-blue-200 rotate-45"></div>
                    </div>
                  )}
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

