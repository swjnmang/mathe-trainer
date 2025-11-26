export type CalculationSchema = 'Bezugskalkulation' | 'Handelskalkulation';
export type CalculationDirection = 'Vorwärts' | 'Rückwärts';

export interface CalculationRow {
  label: string;
  key: string;
  operator?: '-' | '+' | '=';
  percentageKey?: string;
  isPercentageBase?: boolean; // If true, this row is the base for the percentage calculation of the NEXT row (Purchase side)
  isPercentageTarget?: boolean; // If true, this row is the 100% base for the PREVIOUS row (Sales side "im Hundert")
}

export const SCHEMA_ROWS: CalculationRow[] = [
  // Bezugskalkulation
  { label: 'Listeneinkaufspreis', key: 'lep', isPercentageBase: true },
  { label: 'Liefererrabatt', key: 'l_rabatt', operator: '-', percentageKey: 'l_rabatt_p' },
  { label: 'Zieleinkaufspreis', key: 'zep', operator: '=', isPercentageBase: true },
  { label: 'Liefererskonto', key: 'l_skonto', operator: '-', percentageKey: 'l_skonto_p' },
  { label: 'Bareinkaufspreis', key: 'bep', operator: '=' },
  { label: 'Bezugskosten', key: 'bezugskosten', operator: '+' },
  { label: 'Bezugspreis', key: 'bp', operator: '=', isPercentageBase: true },
  
  // Handelskalkulation (continues from BP)
  { label: 'Handlungskostenzuschlag', key: 'hkz', operator: '+', percentageKey: 'hkz_p' },
  { label: 'Selbstkosten', key: 'sk', operator: '=', isPercentageBase: true },
  { label: 'Gewinnzuschlag', key: 'gewinn', operator: '+', percentageKey: 'gewinn_p' },
  { label: 'Barverkaufspreis', key: 'bvp', operator: '=' }, // Base for Kundenskonto (im Hundert) -> ZVP is 100%
  { label: 'Kundenskonto', key: 'k_skonto', operator: '+', percentageKey: 'k_skonto_p' },
  { label: 'Zielverkaufspreis', key: 'zvp', operator: '=' }, // Base for Kundenrabatt (im Hundert) -> NVP is 100%
  { label: 'Kundenrabatt', key: 'k_rabatt', operator: '+', percentageKey: 'k_rabatt_p' },
  { label: 'Nettoverkaufspreis', key: 'nvp', operator: '=', isPercentageBase: true }, // Base for Tax
  { label: 'Umsatzsteuer', key: 'ust', operator: '+', percentageKey: 'ust_p' },
  { label: 'Bruttoverkaufspreis', key: 'brutto', operator: '=' },
];

export interface CalcTask {
  id: string;
  schema: CalculationSchema;
  direction: CalculationDirection;
  values: Record<string, number>;
  percentages: Record<string, number>;
  description: string;
}

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const round2 = (num: number) => Math.round(num * 100) / 100;

export const generateTask = (schema: CalculationSchema, direction: CalculationDirection): CalcTask => {
  const percentages = {
    l_rabatt_p: randomInt(5, 20),
    l_skonto_p: randomInt(1, 3),
    hkz_p: randomInt(20, 40),
    gewinn_p: randomInt(5, 20),
    k_skonto_p: randomInt(1, 3),
    k_rabatt_p: randomInt(5, 15),
    ust_p: 19
  };

  // Start with a random Listeneinkaufspreis
  const lep = randomInt(100, 1000) + (randomInt(0, 99) / 100);
  const bezugskosten = randomInt(10, 50) + (randomInt(0, 99) / 100);

  // Calculate Forward
  const l_rabatt = round2(lep * (percentages.l_rabatt_p / 100));
  const zep = round2(lep - l_rabatt);
  const l_skonto = round2(zep * (percentages.l_skonto_p / 100));
  const bep = round2(zep - l_skonto);
  const bp = round2(bep + bezugskosten);

  const hkz = round2(bp * (percentages.hkz_p / 100));
  const sk = round2(bp + hkz);
  const gewinn = round2(sk * (percentages.gewinn_p / 100));
  const bvp = round2(sk + gewinn);

  // Sales Side "Im Hundert"
  // ZVP = BVP / (1 - k_skonto_p)
  const zvp = round2(bvp / (1 - (percentages.k_skonto_p / 100)));
  const k_skonto = round2(zvp - bvp);

  // NVP = ZVP / (1 - k_rabatt_p)
  const nvp = round2(zvp / (1 - (percentages.k_rabatt_p / 100)));
  const k_rabatt = round2(nvp - zvp);

  const ust = round2(nvp * (percentages.ust_p / 100));
  const brutto = round2(nvp + ust);

  const values: Record<string, number> = {
    lep, l_rabatt, zep, l_skonto, bep, bezugskosten, bp,
    hkz, sk, gewinn, bvp, k_skonto, zvp, k_rabatt, nvp, ust, brutto
  };

  let description = '';
  if (schema === 'Bezugskalkulation') {
    description = `Ein Unternehmen kauft Waren mit einem Listenpreis von ${lep.toFixed(2)}€. ` +
      `Der Lieferant gewährt ${percentages.l_rabatt_p}% Rabatt. ` +
      `Bei Zahlung innerhalb von 10 Tagen werden zusätzlich ${percentages.l_skonto_p}% Skonto gewährt. ` +
      `Die Bezugskosten betragen ${bezugskosten.toFixed(2)}€. ` +
      `Berechnen Sie den Bezugspreis.`;
  } else {
    if (direction === 'Vorwärts') {
      description = `Berechnen Sie die Handelskalkulation (Vorwärts) für folgende Eckdaten: ` +
        `Listeneinkaufspreis: ${lep.toFixed(2)}€, ` +
        `Liefererrabatt: ${percentages.l_rabatt_p}%, Liefererskonto: ${percentages.l_skonto_p}%, ` +
        `Bezugskosten: ${bezugskosten.toFixed(2)}€, ` +
        `Handlungskostenzuschlag: ${percentages.hkz_p}%, Gewinnzuschlag: ${percentages.gewinn_p}%, ` +
        `Kundenskonto: ${percentages.k_skonto_p}%, Kundenrabatt: ${percentages.k_rabatt_p}%, ` +
        `Umsatzsteuer: ${percentages.ust_p}%.`;
    } else {
      description = `Berechnen Sie die Handelskalkulation (Rückwärts) ausgehend vom Bruttoverkaufspreis: ${brutto.toFixed(2)}€. ` +
        `Gegeben sind: Umsatzsteuer: ${percentages.ust_p}%, Kundenrabatt: ${percentages.k_rabatt_p}%, ` +
        `Kundenskonto: ${percentages.k_skonto_p}%, Gewinnzuschlag: ${percentages.gewinn_p}%, ` +
        `Handlungskostenzuschlag: ${percentages.hkz_p}%, Bezugskosten: ${bezugskosten.toFixed(2)}€, ` +
        `Liefererskonto: ${percentages.l_skonto_p}%, Liefererrabatt: ${percentages.l_rabatt_p}%. ` +
        `Ermitteln Sie den Listeneinkaufspreis.`;
    }
  }

  return {
    id: Date.now().toString(),
    schema,
    direction,
    values,
    percentages,
    description
  };
};
