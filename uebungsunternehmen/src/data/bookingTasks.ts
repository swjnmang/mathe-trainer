export type DocumentType = 'Eingangsrechnung' | 'Ausgangsrechnung' | 'Kontoauszug';

export interface BookingLine {
  account: string; // Account number
  amount: number;
  isDebit: boolean; // true = Soll, false = Haben
}

export interface Task {
  id: string;
  type: DocumentType;
  description: string;
  hint: string;
  documentData: {
    sender: string;
    receiver: string;
    date: string;
    number: string; // Invoice number or Statement number
    items: { description: string; amount: number; taxRate: number }[];
    totalAmount: number;
    taxAmount: number;
    netAmount: number;
    // For Bank Statement
    transactions?: { date: string; description: string; amount: number; type: 'Soll' | 'Haben' }[];
  };
  solution: BookingLine[];
}

const COMPANIES = [
  'Müller & Söhne KG', 'Schmidt GmbH', 'TechnoParts AG', 'Büro-Welt e.K.', 
  'Logistik Express', 'Metallbau Weber', 'Elektro-Handel Nord', 'Global Supplies Ltd.'
];

const ITEMS_BUY = [
  { desc: 'Eichenholz Platten', account: '2000', type: 'Rohstoffe' },
  { desc: 'Schrauben und Nägel', account: '2020', type: 'Hilfsstoffe' },
  { desc: 'Schmieröl', account: '2030', type: 'Betriebsstoffe' },
  { desc: 'Bürostühle (Handelsware)', account: '2280', type: 'Handelswaren' },
  { desc: 'Elektronik-Module', account: '2010', type: 'Fremdbauteile' },
  { desc: 'Neuer LKW', account: '0840', type: 'Fuhrpark' },
  { desc: 'Schreibtische für Verwaltung', account: '0860', type: 'Büroausstattung' },
  { desc: 'CNC-Fräse', account: '0700', type: 'Maschinen' }
];

const ITEMS_SELL = [
  { desc: 'Schreibtisch "Executive"', account: '5000', type: 'Eigene Erzeugnisse' },
  { desc: 'Bürostuhl "Ergo" (Handelsware)', account: '5100', type: 'Handelswaren' }
];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = <T>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];
const randomDate = () => {
  const day = randomInt(1, 28).toString().padStart(2, '0');
  const month = randomInt(1, 12).toString().padStart(2, '0');
  return `${day}.${month}.2025`;
};

export const generateBookingTask = (): Task => {
  const typeRoll = Math.random();
  const id = Date.now().toString();
  
  // 40% Eingangsrechnung, 30% Ausgangsrechnung, 30% Kontoauszug
  if (typeRoll < 0.4) {
    // EINGANGSRECHNUNG
    const item = randomItem(ITEMS_BUY);
    const amount = randomInt(500, 5000);
    const tax = amount * 0.19;
    const total = amount + tax;
    const sender = randomItem(COMPANIES);
    
    return {
      id,
      type: 'Eingangsrechnung',
      description: `Wir kaufen ${item.type} auf Ziel.`,
      hint: `Beim Einkauf von ${item.type} buchen wir auf das entsprechende Bestandskonto (Aktiva) im Soll. Die Vorsteuer kommt ebenfalls ins Soll. Die Verbindlichkeit entsteht im Haben.`,
      documentData: {
        sender: `${sender}\nIndustriestraße ${randomInt(1, 99)}\n12345 Musterstadt`,
        receiver: 'Büro-Design GmbH\nMusterstraße 1\n12345 Musterstadt',
        date: randomDate(),
        number: `RE-${randomInt(1000, 9999)}`,
        items: [{ description: item.desc, amount: amount, taxRate: 0.19 }],
        netAmount: amount,
        taxAmount: tax,
        totalAmount: total
      },
      solution: [
        { account: item.account, amount: amount, isDebit: true },
        { account: '2600', amount: tax, isDebit: true },
        { account: '4400', amount: total, isDebit: false }
      ]
    };
  } else if (typeRoll < 0.7) {
    // AUSGANGSRECHNUNG
    const item = randomItem(ITEMS_SELL);
    const amount = randomInt(1000, 8000);
    const tax = amount * 0.19;
    const total = amount + tax;
    const receiver = randomItem(COMPANIES);

    return {
      id,
      type: 'Ausgangsrechnung',
      description: `Wir verkaufen ${item.type} auf Ziel.`,
      hint: `Beim Verkauf entstehen Forderungen an den Kunden (Soll). Die Erlöse (Haben) und die Umsatzsteuer (Haben) müssen gebucht werden.`,
      documentData: {
        sender: 'Büro-Design GmbH\nMusterstraße 1\n12345 Musterstadt',
        receiver: `${receiver}\nHandelsweg ${randomInt(1, 99)}\n54321 Stadt`,
        date: randomDate(),
        number: `AR-${randomInt(1000, 9999)}`,
        items: [{ description: item.desc, amount: amount, taxRate: 0.19 }],
        netAmount: amount,
        taxAmount: tax,
        totalAmount: total
      },
      solution: [
        { account: '2400', amount: total, isDebit: true },
        { account: item.account, amount: amount, isDebit: false },
        { account: '4800', amount: tax, isDebit: false }
      ]
    };
  } else {
    // KONTOAUSZUG
    const subType = Math.random();
    const amount = randomInt(500, 5000);
    const date = randomDate();
    
    if (subType < 0.4) {
      // Kunde zahlt (Haben auf KA -> Bank im Soll)
      return {
        id,
        type: 'Kontoauszug',
        description: 'Ein Kunde begleicht eine offene Rechnung.',
        hint: 'Wenn Geld auf dem Bankkonto eingeht (Haben auf dem Auszug), nimmt das Bankkonto zu (Soll). Die Forderung an den Kunden erlischt (Haben).',
        documentData: {
          sender: 'Volksbank',
          receiver: 'Büro-Design GmbH',
          date: date,
          number: `KA-${randomInt(1, 12)}`,
          items: [], netAmount: 0, taxAmount: 0, totalAmount: 0,
          transactions: [{ date, description: 'Gutschrift Kunde', amount, type: 'Haben' }]
        },
        solution: [
          { account: '2800', amount, isDebit: true },
          { account: '2400', amount, isDebit: false }
        ]
      };
    } else if (subType < 0.7) {
      // Wir zahlen Lieferant (Soll auf KA -> Bank im Haben)
      return {
        id,
        type: 'Kontoauszug',
        description: 'Wir begleichen eine Lieferantenrechnung per Überweisung.',
        hint: 'Geld fließt ab (Soll auf dem Auszug -> Haben auf dem Bankkonto). Unsere Verbindlichkeiten verringern sich (Soll).',
        documentData: {
          sender: 'Volksbank',
          receiver: 'Büro-Design GmbH',
          date: date,
          number: `KA-${randomInt(1, 12)}`,
          items: [], netAmount: 0, taxAmount: 0, totalAmount: 0,
          transactions: [{ date, description: 'Überweisung an Lieferant', amount, type: 'Soll' }]
        },
        solution: [
          { account: '4400', amount, isDebit: true },
          { account: '2800', amount, isDebit: false }
        ]
      };
    } else {
      // Miete (Soll auf KA)
      return {
        id,
        type: 'Kontoauszug',
        description: 'Die monatliche Büromiete wird abgebucht.',
        hint: 'Miete ist ein Aufwand (Soll). Das Bankkonto nimmt ab (Haben).',
        documentData: {
          sender: 'Volksbank',
          receiver: 'Büro-Design GmbH',
          date: date,
          number: `KA-${randomInt(1, 12)}`,
          items: [], netAmount: 0, taxAmount: 0, totalAmount: 0,
          transactions: [{ date, description: 'Miete Bürogebäude', amount, type: 'Soll' }]
        },
        solution: [
          { account: '6700', amount, isDebit: true },
          { account: '2800', amount, isDebit: false }
        ]
      };
    }
  }
};

// Initial seed
export const TASKS: Task[] = [generateBookingTask()];

