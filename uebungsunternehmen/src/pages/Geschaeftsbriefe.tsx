import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { letterAssignments, type LetterAssignment } from '../data/letterAssignments';

interface LetterFields {
  sender: string;
  recipientLines: string[];
  recipientAdditions: string[];
  recipientType: 'business' | 'private';
  date: string;
  subject: string;
  salutation: string;
  bodyIntro: string;
  bodyMain: string;
  bodyClosing: string;
  greeting: string;
  signature: string;
  closingCompany: string;
  attachments: string;
  infoBlock: InfoBlockFields;
}

interface RecipientPiece {
  id: string;
  text: string;
}

interface InfoBlockFields {
  reference: string;
  clientMessageDate: string;
  ourReference: string;
  ourMessageDate: string;
  contactName: string;
  phone: string;
  fax: string;
  mail: string;
  infoDate: string;
}

interface ValidationItem {
  id: string;
  label: string;
  status: 'ok' | 'warn';
  message: string;
}

const today = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());
const firstAssignment = letterAssignments[0];
const recipientTypeGuidance: Record<'business' | 'private', string[]> = {
  business: [
    'Zeile 1: Unternehmen (ggf. fett).',
    'Zeile 2: Ansprechpartner mit Titel.',
    'Zeile 3–4: Straße/Postfach + PLZ Ort.',
    'Weitere Zeilen für Abteilung, Referenz, Versandhinweis.'
  ],
  private: [
    'Zeile 1: Anrede + Vor- und Nachname.',
    'Zeile 2: Straße oder Postfach.',
    'Zeile 3: PLZ und Ort.',
    'Zusatzzeilen nur bei c/o oder Etage verwenden.'
  ]
};

function buildRecipientPieces(assignment: LetterAssignment): RecipientPiece[] {
  return assignment.recipientPieces.map((text, index) => ({
    id: `${assignment.id}-${index}`,
    text
  }));
}

function shufflePieces(pieces: RecipientPiece[]): RecipientPiece[] {
  const copy = [...pieces];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const spacingHints = [
  {
    title: 'Absender → Zusatz-/Vermerkzone',
    detail: '1 Leerzeile nach dem Firmenkopf, dann beginnt die 5-zeilige Zusatzzone.'
  },
  {
    title: 'Zusatz-/Vermerkzone → Empfänger',
    detail: 'Direkt anschließen, keine weitere Leerzeile zwischen den Blöcken.'
  },
  {
    title: 'Empfänger → Betreff',
    detail: '2 Leerzeilen freilassen, bevor der Betreff steht.'
  },
  {
    title: 'Betreff → Anrede',
    detail: 'Nach dem Betreff erneut 2 Leerzeilen einfügen.'
  },
  {
    title: 'Anrede → Text',
    detail: '1 Leerzeile genügt zwischen Anrede und Text.'
  },
  {
    title: 'Text → Grußformel',
    detail: '1 Leerzeile nach dem letzten Absatz.'
  },
  {
    title: 'Grußformel → Unterschrift',
    detail: '3 Leerzeilen für die handschriftliche Signatur.'
  }
];

export default function Geschaeftsbriefe() {
  const [assignmentId, setAssignmentId] = useState(firstAssignment.id);
  const [fields, setFields] = useState<LetterFields>(() => createTemplate(firstAssignment));
  const [availablePieces, setAvailablePieces] = useState<RecipientPiece[]>(() =>
    shufflePieces(buildRecipientPieces(firstAssignment))
  );
  const [linePieceMap, setLinePieceMap] = useState<(string | null)[]>(() => Array(9).fill(null));
  const [activeRecipientLine, setActiveRecipientLine] = useState<number | null>(null);

  const currentAssignment = useMemo(() => {
    return letterAssignments.find(item => item.id === assignmentId) ?? firstAssignment;
  }, [assignmentId]);

  const validations = useMemo(() => validateFields(fields), [fields]);
  const recipientPieces = useMemo(() => buildRecipientPieces(currentAssignment), [currentAssignment]);

  const handleAssignmentChange = (nextId: string) => {
    const nextAssignment = letterAssignments.find(item => item.id === nextId);
    if (!nextAssignment) {
      return;
    }
    setAssignmentId(nextId);
    setFields(createTemplate(nextAssignment));
    setAvailablePieces(shufflePieces(buildRecipientPieces(nextAssignment)));
    setLinePieceMap(Array(9).fill(null));
    setActiveRecipientLine(null);
  };

  const handleRecipientLineInput = (index: number, value: string) => {
    const existingPieceId = linePieceMap[index];
    if (existingPieceId) {
      const piece = recipientPieces.find(token => token.id === existingPieceId);
      if (piece && piece.text !== value) {
        setAvailablePieces(prev => [...prev, piece]);
        setLinePieceMap(prev => {
          const next = [...prev];
          next[index] = null;
          return next;
        });
      }
    }

    setFields(prev => {
      const recipientLines = [...prev.recipientLines];
      recipientLines[index] = value;
      return { ...prev, recipientLines };
    });
    setActiveRecipientLine(index);
  };

  const handleApplyPiece = (pieceId: string) => {
    const piece = availablePieces.find(item => item.id === pieceId);
    if (!piece) {
      return;
    }
    const fallbackIndex = fields.recipientLines.findIndex(line => line.trim() === '');
    const targetIndex = activeRecipientLine ?? fallbackIndex;
    if (targetIndex === null || targetIndex === -1) {
      return;
    }

    const previousPieceId = linePieceMap[targetIndex];
    if (previousPieceId) {
      const previousPiece = recipientPieces.find(item => item.id === previousPieceId);
      if (previousPiece) {
        setAvailablePieces(prev => [...prev, previousPiece]);
      }
    }

    setLinePieceMap(prev => {
      const next = [...prev];
      next[targetIndex] = piece.id;
      return next;
    });

    setFields(prev => {
      const recipientLines = [...prev.recipientLines];
      recipientLines[targetIndex] = piece.text;
      return { ...prev, recipientLines };
    });

    setAvailablePieces(prev => prev.filter(item => item.id !== piece.id));
    setActiveRecipientLine(targetIndex < fields.recipientLines.length - 1 ? targetIndex + 1 : targetIndex);
  };

  const handleReturnPiece = (lineIndex: number) => {
    const pieceId = linePieceMap[lineIndex];
    if (!pieceId) {
      return;
    }
    const piece = recipientPieces.find(item => item.id === pieceId);
    if (piece) {
      setAvailablePieces(prev => [...prev, piece]);
    }
    setLinePieceMap(prev => {
      const next = [...prev];
      next[lineIndex] = null;
      return next;
    });
    setFields(prev => {
      const recipientLines = [...prev.recipientLines];
      recipientLines[lineIndex] = '';
      return { ...prev, recipientLines };
    });
  };

  const handleResetRecipientLines = () => {
    setFields(prev => ({ ...prev, recipientLines: Array(9).fill('') }));
    setLinePieceMap(Array(9).fill(null));
    setAvailablePieces(shufflePieces(recipientPieces));
    setActiveRecipientLine(null);
  };

  const handleFieldChange = (key: keyof LetterFields, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const combinedBody = [fields.bodyIntro, fields.bodyMain, fields.bodyClosing].filter(Boolean).join('\n\n');

  const derivedRecipient = useMemo(
    () => buildRecipientBlock(fields.recipientAdditions, fields.recipientLines),
    [fields.recipientAdditions, fields.recipientLines]
  );
  const builderSections = getBuilderSections(handleFieldChange, fields);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center gap-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
            ← Zurück zur Übersicht
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Übungsunternehmen</p>
            <h1 className="text-xl font-bold">DIN 5008 Geschäftsbriefe</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <section className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Aufgabenpool</p>
                <h2 className="text-lg font-bold">{currentAssignment.subject}</h2>
              </div>
              <AssignmentSelector
                assignments={letterAssignments}
                currentId={assignmentId}
                onChange={handleAssignmentChange}
              />
            </div>
            <span className="inline-flex text-xs uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold w-fit">
              {currentAssignment.company}
            </span>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              {currentAssignment.context.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">Arbeitsaufträge</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {currentAssignment.requirements.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <SpacingCoach />

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">Briefbausteine ausfüllen</h2>
            <div className="space-y-8">
              <SenderAdditionInput
                value={fields.recipientAdditions[4] ?? ''}
                onChange={value =>
                  setFields(prev => {
                    const recipientAdditions = [...prev.recipientAdditions];
                    recipientAdditions[4] = value;
                    return { ...prev, recipientAdditions };
                  })
                }
              />
              <StructuredAddressInputs
                recipientLines={fields.recipientLines}
                recipientType={fields.recipientType}
                availablePieces={availablePieces}
                linePieceMap={linePieceMap}
                activeLineIndex={activeRecipientLine}
                onRecipientLineChange={handleRecipientLineInput}
                onPieceApply={handleApplyPiece}
                onPieceReturn={handleReturnPiece}
                onResetPieces={handleResetRecipientLines}
                onActiveLineChange={setActiveRecipientLine}
                onRecipientTypeChange={type => handleFieldChange('recipientType', type)}
              />
              <InfoBlockInputs
                info={fields.infoBlock}
                onChange={(info: InfoBlockFields) => setFields(prev => ({ ...prev, infoBlock: info }))}
              />
              <SubjectInput
                value={fields.subject}
                onChange={value => handleFieldChange('subject', value)}
              />
              <ClosingBlockInputs
                company={fields.closingCompany}
                greeting={fields.greeting}
                signature={fields.signature}
                onChange={(field, value) => handleFieldChange(field, value)}
              />
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                Der gesamte Brieftext wurde bereits in das erste Textfeld übertragen und enthält absichtlich keine Leerzeilen. Teile ihn in sinnvolle Abschnitte und ergänze Leerzeilen, falls du eine sauberere Darstellung brauchst.
              </div>
              <div className="space-y-5">
                {builderSections.map(section => (
                  <div key={section.id}>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700">{section.label}</label>
                      <span className="text-xs text-slate-400">{section.helper}</span>
                    </div>
                    {section.type === 'textarea' ? (
                      <textarea
                        value={section.value}
                        onChange={event => section.onChange(event.target.value)}
                        rows={section.rows}
                        className="mt-2 w-full rounded-2xl border border-slate-300 p-3 text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    ) : (
                      <input
                        type="text"
                        value={section.value}
                        onChange={event => section.onChange(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-300 p-3 text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <LetterPreview fields={fields} recipientBlock={derivedRecipient} />
            <ValidationList
              items={validations}
              combinedBody={combinedBody}
              infoBlock={fields.infoBlock}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function createTemplate(currentAssignment: LetterAssignment): LetterFields {
  return {
    sender: currentAssignment.companyAddress,
    recipientAdditions: Array(5).fill(''),
    recipientLines: Array(9).fill(''),
    recipientType: currentAssignment.recipientType,
    date: today,
    subject: '',
    salutation: '',
    bodyIntro: currentAssignment.bodyDraft,
    bodyMain: '',
    bodyClosing: '',
    greeting: '',
    closingCompany: currentAssignment.company,
    signature: '',
    attachments: '',
    infoBlock: {
      reference: '',
      clientMessageDate: '',
      ourReference: '',
      ourMessageDate: '',
      contactName: '',
      phone: '',
      fax: '',
      mail: '',
      infoDate: ''
    }
  };
}

function getBuilderSections(
  handleFieldChange: (key: keyof LetterFields, value: string) => void,
  fields: LetterFields
) {
  return [
    {
      id: 'sender',
      label: 'Absender (max. 3 Zeilen)',
      helper: 'Zeilen 1–3',
      type: 'textarea',
      rows: 3,
      value: fields.sender,
      onChange: (value: string) => handleFieldChange('sender', value)
    },
    {
      id: 'date',
      label: 'Datum',
      helper: 'rechtsbündig',
      type: 'input',
      rows: 1,
      value: fields.date,
      onChange: (value: string) => handleFieldChange('date', value)
    },
    {
      id: 'salutation',
      label: 'Anrede',
      helper: 'z. B. „Sehr geehrte …,“ + 1 Leerzeile danach',
      type: 'input',
      rows: 1,
      value: fields.salutation,
      onChange: (value: string) => handleFieldChange('salutation', value)
    },
    {
      id: 'bodyIntro',
      label: 'Brieftext',
      helper: '1 Absatz',
      type: 'textarea',
      rows: 3,
      value: fields.bodyIntro,
      onChange: (value: string) => handleFieldChange('bodyIntro', value)
    }
  ];
}

function SenderAdditionInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="rounded-3xl border border-slate-200 p-5 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-700">Absender in der Zusatz-/Vermerkzone</h3>
          <p className="text-xs text-slate-500">Diese Eingabe landet automatisch in Zeile 5 der Zusatz- und Vermerkzone.</p>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-slate-400">Zeile 5</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="z. B. MÖBELFABRIK · Meindlstraße 8a · 81373 München"
        className="mt-3 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      <p className="text-xs text-blue-600 mt-2">Nutze 1 Zeile mit Trennzeichen (z. B. Mittelpunkte), damit die Zeile schlank bleibt.</p>
    </div>
  );
}

function AssignmentSelector({
  assignments,
  currentId,
  onChange
}: {
  assignments: LetterAssignment[];
  currentId: string;
  onChange: (nextId: string) => void;
}) {
  return (
    <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold space-y-2">
      Aufgabe wählen
      <select
        value={currentId}
        onChange={event => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      >
        {assignments.map(item => (
          <option key={item.id} value={item.id}>
            {item.subject}
          </option>
        ))}
      </select>
    </label>
  );
}

function validateFields(fields: LetterFields): ValidationItem[] {
  const senderLines = fields.sender.trim().split(/\n+/).filter(Boolean);
  const subjectHasWord = /betreff/i.test(fields.subject);
  const dateValid = /^\d{2}\.\d{2}\.\d{4}$/.test(fields.date.trim());
  const greetingText = fields.greeting.trim().toLowerCase();
  const usesModernGreeting = /freundliche grüße/.test(greetingText);
  const usesClassicGreeting = /mit freundlichen grüßen/.test(greetingText);
  const hasAnyGreeting = greetingText.length > 0;
  const salutationValid = /^\s*Sehr\s+/.test(fields.salutation) && /,$/.test(fields.salutation.trim());
  const attachmentsOk = !fields.attachments || /^Anlage/i.test(fields.attachments.trim());
  const closingCompanyValid = fields.closingCompany.trim().length >= 3;
  const signatureHasIA = /i\.?\s*a\.?/i.test(fields.signature);
  const signatureHasName = /[A-ZÄÖÜ][A-Za-zÄÖÜäöüß]+\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß]+/.test(fields.signature);
  const signatureMultiline = /\n/.test(fields.signature.trim());
  const closingSpacing = /\n\s*\n/.test(fields.signature);
  const additionFilled = fields.recipientAdditions.filter(Boolean).length >= 1;
  const recipientAreaFilled = fields.recipientLines.filter(Boolean).length >= 4;

  return [
    {
      id: 'sender',
      label: 'Absender max. 3 Zeilen',
      status: senderLines.length > 0 && senderLines.length <= 3 ? 'ok' : 'warn',
      message: senderLines.length <= 3 ? 'Format passt.' : 'Kürze den Absender auf höchstens 3 Zeilen.'
    },
    {
      id: 'additionZone',
      label: 'Zusatz- & Vermerkzone (5 Zeilen)',
      status: additionFilled ? 'ok' : 'warn',
      message: additionFilled ? 'Absender/Versand stehen oben links.' : 'Trage den Absender in die Zusatz-/Vermerkzone ein.'
    },
    {
      id: 'recipient',
      label: 'Empfängerzone (9 Zeilen)',
      status: recipientAreaFilled ? 'ok' : 'warn',
      message: recipientAreaFilled ? 'Adresse wirkt vollständig.' : 'Nutze bis zu 9 Zeilen für Firma/Person, Straße/Postfach und PLZ Ort.'
    },
    {
      id: 'date',
      label: 'Datum im Format TT.MM.JJJJ',
      status: dateValid ? 'ok' : 'warn',
      message: dateValid ? 'Datum korrekt.' : 'Nutze z. B. 27.11.2025.'
    },
    {
      id: 'subject',
      label: 'Betreff ohne Wort „Betreff“',
      status: !subjectHasWord && fields.subject.trim().length > 5 ? 'ok' : 'warn',
      message: !subjectHasWord ? 'Betreff ist prägnant.' : 'Lass das Wort „Betreff“ weg. Schreibe direkt das Thema.'
    },
    {
      id: 'salutation',
      label: 'Anrede korrekt mit Komma',
      status: salutationValid ? 'ok' : 'warn',
      message: salutationValid ? 'Anrede passt.' : 'Beginne mit „Sehr …“ und schließe mit Komma.'
    },
    {
      id: 'greeting',
      label: 'Grußformel modern',
      status: usesModernGreeting ? 'ok' : 'warn',
      message: usesModernGreeting
        ? '„Freundliche Grüße“ ist die aktuelle Empfehlung.'
        : usesClassicGreeting
          ? '„Mit freundlichen Grüßen“ ist korrekt, aber setze gern auf „Freundliche Grüße“.'
          : hasAnyGreeting
            ? 'Nutze eine Grußformel wie „Freundliche Grüße“.'
            : 'Trage eine Grußformel ein (z. B. „Freundliche Grüße“).'
    },
    {
      id: 'closingCompany',
      label: 'Firmenname im Briefschluss',
      status: closingCompanyValid ? 'ok' : 'warn',
      message: closingCompanyValid ? 'Firmenname steht über der Grußformel.' : 'Trage deine Firma oberhalb der Grußformel ein.'
    },
    {
      id: 'signature',
      label: 'i. A. + Vor- und Nachname',
      status: signatureHasIA && signatureHasName && signatureMultiline ? 'ok' : 'warn',
      message: signatureHasIA && signatureHasName && signatureMultiline
        ? 'Name und Funktionszeile vorhanden.'
        : 'Nutze „i. A.“ plus Vor- & Nachname in eigener Zeile.'
    },
    {
      id: 'closingSpacing',
      label: 'Leerzeile zwischen Gruß & Signatur',
      status: closingSpacing ? 'ok' : 'warn',
      message: closingSpacing ? 'Mindestens eine Leerzeile eingeplant.' : 'Füge eine Leerzeile zwischen Grußformel und i. A. ein.'
    },
    {
      id: 'attachments',
      label: 'Anlage korrekt benannt',
      status: attachmentsOk ? 'ok' : 'warn',
      message: attachmentsOk ? 'Anlage passt oder entfällt.' : 'Beginne mit „Anlage:“ oder lasse das Feld leer.'
    }
  ];
}

function LetterPreview({ fields, recipientBlock }: { fields: LetterFields; recipientBlock: string }) {
  const infoLines = buildInfoBlockLines(fields.infoBlock);
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Live-Vorschau</h2>
        <span className="text-xs text-slate-500">nicht maßstabsgetreu</span>
      </div>
      <div className="border border-slate-200 rounded-3xl p-6 bg-slate-50">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr] text-sm">
          <div className="space-y-3">
            <pre className="font-mono whitespace-pre-wrap text-slate-700">{fields.sender || 'Absender GmbH\nStraße 1\n12345 Stadt'}</pre>
            <pre className="font-mono whitespace-pre-wrap text-slate-700">{recipientBlock}</pre>
          </div>
          <div className="border border-slate-300 rounded-2xl p-4 bg-white text-xs text-slate-700 font-mono">
            {infoLines.map(line => (
              <div key={line.label} className="flex justify-between gap-2 border-b border-dashed border-slate-200 py-1 last:border-b-0">
                <span>{line.label}</span>
                <span className="text-right">{line.value || '–'}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-right text-slate-600 text-sm mt-6">{fields.date || today}</div>
        <div className="font-semibold text-slate-900 mt-4">{fields.subject || 'Thema des Schreibens'}</div>
        <div className="mt-3">{fields.salutation || 'Sehr geehrte Damen und Herren,'}</div>
        <div className="space-y-4 text-slate-700 mt-4">
          {[fields.bodyIntro, fields.bodyMain, fields.bodyClosing].filter(Boolean).map((paragraph, index) => (
            <p key={`${paragraph}-${index}`}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-6 space-y-2">
          <p className="font-semibold text-slate-800">{fields.closingCompany || 'Unternehmen GmbH'}</p>
          <p>{fields.greeting || 'Freundliche Grüße'}</p>
          <div className="h-10" />
          <pre className="font-mono whitespace-pre-wrap text-slate-700">{fields.signature || 'i. A. Max Beispiel\nVertrieb'}</pre>
        </div>
        {fields.attachments && (
          <div className="text-slate-600 text-sm border-t border-dashed border-slate-300 pt-3 mt-4">
            {fields.attachments}
          </div>
        )}
      </div>
    </div>
  );
}

function ValidationList({ items, combinedBody, infoBlock }: { items: ValidationItem[]; combinedBody: string; infoBlock: InfoBlockFields }) {
  const textLength = combinedBody.trim().length;
  const infoComplete = Boolean(infoBlock.reference && infoBlock.contactName && infoBlock.infoDate);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Format-Check</h2>
        <span className="text-xs text-slate-500">automatisch geprüft</span>
      </div>
      <ul className="space-y-3">
        {items.map(item => (
          <li key={item.id} className="flex items-start gap-3 text-sm">
            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <div>
              <p className="font-semibold">{item.label}</p>
              <p className="text-slate-500 text-xs">{item.message}</p>
            </div>
          </li>
        ))}
        <li className="flex items-start gap-3 text-sm">
          <span className={`mt-1 h-2.5 w-2.5 rounded-full ${infoComplete ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <div>
            <p className="font-semibold">Infoblock vollständig</p>
            <p className="text-slate-500 text-xs">Pflichtfelder „Ihr Zeichen“, Ansprechpartner und Datum sollten gesetzt sein.</p>
          </div>
        </li>
      </ul>
      <div className="text-xs text-slate-500 border-t border-slate-100 pt-3">
        <p><strong>Textumfang:</strong> {textLength} Zeichen</p>
        <p><strong>Leerzeilen:</strong> 2 vor Betreff · 2 nach Betreff · 1 nach Anrede · 3 vor Unterschrift</p>
      </div>
    </div>
  );
}

function SpacingCoach() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section className="bg-white rounded-3xl border border-slate-200">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div>
          <h2 className="text-lg font-bold">Abstände & Leerzeilen</h2>
          <p className="text-sm text-slate-500">Tipps erst einblenden, wenn du sie brauchst.</p>
        </div>
        <span className="text-xl text-slate-500">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="border-t border-slate-100 px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Fenster DIN lang</p>
            <span className="text-xs text-slate-500">2 × vor Betreff · 2 × nach Betreff</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {spacingHints.map(hint => (
              <div key={hint.title} className="rounded-2xl border border-dashed border-slate-200 p-3 bg-slate-50">
                <p className="text-xs uppercase tracking-widest text-slate-500">{hint.title}</p>
                <p className="text-sm text-slate-700 mt-1">{hint.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function StructuredAddressInputs({
  recipientLines,
  recipientType,
  availablePieces,
  linePieceMap,
  activeLineIndex,
  onRecipientLineChange,
  onRecipientTypeChange,
  onPieceApply,
  onPieceReturn,
  onResetPieces,
  onActiveLineChange
}: {
  recipientLines: string[];
  recipientType: 'business' | 'private';
  availablePieces: RecipientPiece[];
  linePieceMap: (string | null)[];
  activeLineIndex: number | null;
  onRecipientLineChange: (index: number, value: string) => void;
  onRecipientTypeChange: (type: 'business' | 'private') => void;
  onPieceApply: (pieceId: string) => void;
  onPieceReturn: (lineIndex: number) => void;
  onResetPieces: () => void;
  onActiveLineChange: (index: number | null) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 p-5 bg-slate-50 shadow-inner space-y-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-slate-700">Anschriftenfeld</h3>
        <p className="text-xs text-slate-500">
          5 Zeilen Zusatz-/Vermerkzone für Absender + Versandhinweis, anschließend 9 Zeilen Empfängeradresse.
        </p>
        <div className="flex gap-2 text-xs">
          {(['business', 'private'] as const).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => onRecipientTypeChange(type)}
              className={`px-3 py-1 rounded-full border ${recipientType === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
            >
              {type === 'business' ? 'Unternehmen' : 'Privatperson'}
            </button>
          ))}
        </div>
        <ul className="text-xs text-slate-600 list-disc pl-4">
          {recipientTypeGuidance[recipientType].map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      {/* Zusatz- & Vermerkzone entfällt – Absender wird bereits oben abgefragt */}
      <RecipientPiecesBoard
        pieces={availablePieces}
        onApply={onPieceApply}
        onReset={onResetPieces}
        activeLineIndex={activeLineIndex}
      />
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Empfängeradresse</p>
          <p className="text-[11px] text-slate-400">Tipp: Zeile auswählen, dann Baustein klicken.</p>
        </div>
        <div className="grid gap-2">
          {recipientLines.map((line, index) => (
            <div key={`line-${index}`} className="flex items-center gap-2">
              <input
                type="text"
                value={line}
                placeholder={`Empfänger Zeile ${index + 1}`}
                onFocus={() => onActiveLineChange(index)}
                onChange={event => onRecipientLineChange(index, event.target.value)}
                className={`flex-1 rounded-2xl border px-3 py-2 text-sm font-mono ${linePieceMap[index] ? 'border-blue-400 bg-white' : 'border-slate-300'}`}
              />
              <button
                type="button"
                onClick={() => onPieceReturn(index)}
                disabled={!linePieceMap[index]}
                className={`text-xs px-3 py-2 rounded-2xl border ${linePieceMap[index] ? 'border-blue-500 text-blue-700' : 'border-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {linePieceMap[index] ? 'Baustein zurück' : 'leer'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecipientPiecesBoard({
  pieces,
  onApply,
  onReset,
  activeLineIndex
}: {
  pieces: RecipientPiece[];
  onApply: (pieceId: string) => void;
  onReset: () => void;
  activeLineIndex: number | null;
}) {
  const activeLabel = activeLineIndex === null ? 'keine Zeile gewählt' : `Zeile ${activeLineIndex + 1}`;
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Adressbausteine ({pieces.length})</p>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-blue-700 font-semibold hover:underline"
        >
          Alles zurücksetzen
        </button>
      </div>
      <p className="text-xs text-slate-500">Klicke zuerst auf die Zielzeile, danach auf einen Baustein.</p>
      {pieces.length === 0 ? (
        <p className="text-sm text-emerald-600">Alle Bausteine sind verteilt. Prüfe nun die Reihenfolge.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {pieces.map(piece => (
            <button
              key={piece.id}
              type="button"
              onClick={() => onApply(piece.id)}
              className="px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm"
            >
              {piece.text}
            </button>
          ))}
        </div>
      )}
      <p className="text-[11px] text-slate-500">Aktive Zeile: {activeLabel}</p>
    </div>
  );
}

function SubjectInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="rounded-3xl border border-slate-200 p-5 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-700">Betreff formulieren</h3>
          <p className="text-xs text-slate-500">Eine Zeile, ohne das Wort „Betreff“. Vor und nach dieser Zeile bleiben jeweils zwei Leerzeilen frei.</p>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-slate-400">Zeile 19–20</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={event => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      <p className="text-xs text-blue-600 mt-2">Tipp: Oberbegriff + Vorgangsnummer wirkt professionell.</p>
    </div>
  );
}

function ClosingBlockInputs({
  company,
  greeting,
  signature,
  onChange
}: {
  company: string;
  greeting: string;
  signature: string;
  onChange: (field: 'closingCompany' | 'greeting' | 'signature', value: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 p-5 bg-white space-y-4">
      <div>
        <p className="text-xs text-slate-500">Reihenfolge: Firmenname → Grußformel → i. A. + Vor- & Nachname.</p>
      </div>
      <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold space-y-1">
        Firmenname
        <input
          type="text"
          value={company}
          onChange={event => onChange('closingCompany', event.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm font-mono"
        />
      </label>
      <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold space-y-1">
        Grußformel
        <input
          type="text"
          value={greeting}
          placeholder="Freundliche Grüße"
          onChange={event => onChange('greeting', event.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm font-mono"
        />
      </label>
      <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold space-y-1">
        i. A. + Vor- und Nachname
        <textarea
          value={signature}
          placeholder="i. A. Vorname Nachname\nFunktion"
          onChange={event => onChange('signature', event.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm font-mono"
        />
      </label>
      <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
        <p>Leerzeilen-Regel:</p>
        <ul className="list-disc pl-4 mt-1 space-y-1">
          <li>1 Leerzeile zwischen Text und Grußformel</li>
          <li>3 Leerzeilen zwischen Grußformel und i. A.</li>
          <li>„i. A.“ immer klein schreiben und mit Name kombinieren</li>
        </ul>
      </div>
    </div>
  );
}

function InfoBlockInputs({ info, onChange }: { info: InfoBlockFields; onChange: (info: InfoBlockFields) => void }) {
  const update = (key: keyof InfoBlockFields, value: string) => {
    onChange({ ...info, [key]: value });
  };
  return (
    <div className="rounded-3xl border border-slate-200 p-5 bg-slate-50 shadow-inner">
      <h3 className="text-sm font-bold text-slate-700 mb-4">Infoblock</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <InputField label="Ihr Zeichen" value={info.reference} onChange={value => update('reference', value)} />
        <InputField label="Ihre Nachricht vom" value={info.clientMessageDate} onChange={value => update('clientMessageDate', value)} />
        <InputField label="Unser Zeichen" value={info.ourReference} onChange={value => update('ourReference', value)} />
        <InputField label="Unsere Nachricht vom" value={info.ourMessageDate} onChange={value => update('ourMessageDate', value)} />
        <InputField label="Name" value={info.contactName} onChange={value => update('contactName', value)} />
        <InputField label="Telefon" value={info.phone} onChange={value => update('phone', value)} />
        <InputField label="Fax" value={info.fax} onChange={value => update('fax', value)} />
        <InputField label="E-Mail" value={info.mail} onChange={value => update('mail', value)} />
        <InputField label="Datum" value={info.infoDate} onChange={value => update('infoDate', value)} />
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold space-y-1">
      {label}
      <input
        type="text"
        value={value}
        onChange={event => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm font-mono"
      />
    </label>
  );
}

function buildRecipientBlock(additions: string[], lines: string[]) {
  return [...additions, ...lines].join('\n');
}

function buildInfoBlockLines(info: InfoBlockFields) {
  return [
    { label: 'Ihr Zeichen', value: info.reference },
    { label: 'Ihre Nachricht vom', value: info.clientMessageDate },
    { label: 'Unser Zeichen', value: info.ourReference },
    { label: 'Unsere Nachricht vom', value: info.ourMessageDate },
    { label: 'Name', value: info.contactName },
    { label: 'Telefon', value: info.phone },
    { label: 'Fax', value: info.fax },
    { label: 'E-Mail', value: info.mail },
    { label: 'Datum', value: info.infoDate }
  ];
}
