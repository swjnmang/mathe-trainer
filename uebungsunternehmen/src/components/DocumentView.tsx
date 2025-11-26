import type { Task } from '../data/bookingTasks';

interface DocumentViewProps {
  task: Task;
}

export default function DocumentView({ task }: DocumentViewProps) {
  const { type, documentData } = task;

  if (type === 'Kontoauszug') {
    return (
      <div className="bg-white border border-gray-300 shadow-md p-8 font-mono text-sm max-w-2xl mx-auto min-h-[400px]">
        <div className="border-b-2 border-gray-800 pb-4 mb-4 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest">{documentData.sender}</h2>
            <p>Kontoauszug Nr. {documentData.number}</p>
          </div>
          <div className="text-right">
            <p>Datum: {documentData.date}</p>
            <p>Kunde: {documentData.receiver}</p>
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead className="border-b border-gray-400">
            <tr>
              <th className="py-2">Datum</th>
              <th className="py-2">Vorgang / Verwendungszweck</th>
              <th className="py-2 text-right">Umsatz</th>
            </tr>
          </thead>
          <tbody>
            {documentData.transactions?.map((t, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 align-top">{t.date}</td>
                <td className="py-3 align-top whitespace-pre-line">{t.description}</td>
                <td className={`py-3 align-top text-right font-bold ${t.type === 'Haben' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'Haben' ? '+' : '-'} {t.amount.toFixed(2).replace('.', ',')} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-8 text-xs text-gray-500 text-center">
          Ende des Auszugs
        </div>
      </div>
    );
  }

  // Invoice View (ER / AR)
  return (
    <div className="bg-white border border-gray-200 shadow-lg p-8 max-w-2xl mx-auto min-h-[500px] relative">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div className="whitespace-pre-line text-sm text-gray-600">
          <span className="font-bold text-gray-900 block mb-1">Absender:</span>
          {documentData.sender}
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">RECHNUNG</h1>
          <p className="text-sm text-gray-600">Nr: {documentData.number}</p>
          <p className="text-sm text-gray-600">Datum: {documentData.date}</p>
        </div>
      </div>

      {/* Receiver */}
      <div className="mb-12 ml-4 p-4 border rounded bg-gray-50 inline-block min-w-[250px]">
        <span className="text-xs text-gray-400 block mb-1">Empfänger:</span>
        <div className="whitespace-pre-line font-medium">
          {documentData.receiver}
        </div>
      </div>

      {/* Items */}
      <table className="w-full mb-8">
        <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
          <tr>
            <th className="py-2 px-4 text-left">Beschreibung</th>
            <th className="py-2 px-4 text-right">Betrag</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {documentData.items.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-100">
              <td className="py-3 px-4">{item.description}</td>
              <td className="py-3 px-4 text-right">{item.amount.toFixed(2).replace('.', ',')} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-1 text-sm">
            <span>Netto:</span>
            <span>{documentData.netAmount.toFixed(2).replace('.', ',')} €</span>
          </div>
          <div className="flex justify-between py-1 text-sm border-b border-gray-300 mb-1">
            <span>USt (19%):</span>
            <span>{documentData.taxAmount.toFixed(2).replace('.', ',')} €</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>Gesamtbetrag:</span>
            <span>{documentData.totalAmount.toFixed(2).replace('.', ',')} €</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 left-8 right-8 text-center text-xs text-gray-400 border-t pt-4">
        Vielen Dank für Ihren Auftrag! Zahlbar innerhalb von 14 Tagen ohne Abzug.
      </div>
    </div>
  );
}
