export type CalculationSchema = 'Bezugskalkulation' | 'Handelskalkulation';
export type CalculationDirection = 'Vorwärts' | 'Rückwärts' | 'Differenz';

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

  // Recalculate for Backward direction to ensure rounding consistency
  if (direction === 'Rückwärts') {
    if (schema === 'Handelskalkulation') {
      // Start from Brutto
      const new_nvp = round2(brutto / (1 + percentages.ust_p / 100));
      const new_ust = round2(brutto - new_nvp);
      
      // NVP is 100% base for Rabatt
      const new_k_rabatt = round2(new_nvp * (percentages.k_rabatt_p / 100));
      const new_zvp = round2(new_nvp - new_k_rabatt);
      
      // ZVP is 100% base for Skonto
      const new_k_skonto = round2(new_zvp * (percentages.k_skonto_p / 100));
      const new_bvp = round2(new_zvp - new_k_skonto);
      
      // SK is 100% base for Gewinn
      const new_sk = round2(new_bvp / (1 + percentages.gewinn_p / 100));
      const new_gewinn = round2(new_bvp - new_sk);
      
      // BP is 100% base for HKZ
      const new_bp = round2(new_sk / (1 + percentages.hkz_p / 100));
      const new_hkz = round2(new_sk - new_bp);
      
      const new_bep = round2(new_bp - bezugskosten);
      
      // LEP is 100% base for Rabatt/Skonto (Purchase side)
      // ZEP = BEP / (1 - skonto)
      const new_zep = round2(new_bep / (1 - percentages.l_skonto_p / 100));
      const new_l_skonto = round2(new_zep - new_bep);
      
      // LEP = ZEP / (1 - rabatt)
      const new_lep = round2(new_zep / (1 - percentages.l_rabatt_p / 100));
      const new_l_rabatt = round2(new_lep - new_zep);
      
      values.lep = new_lep;
      values.l_rabatt = new_l_rabatt;
      values.zep = new_zep;
      values.l_skonto = new_l_skonto;
      values.bep = new_bep;
      values.bp = new_bp;
      values.hkz = new_hkz;
      values.sk = new_sk;
      values.gewinn = new_gewinn;
      values.bvp = new_bvp;
      values.k_skonto = new_k_skonto;
      values.zvp = new_zvp;
      values.k_rabatt = new_k_rabatt;
      values.nvp = new_nvp;
      values.ust = new_ust;
      
    } else if (schema === 'Bezugskalkulation') {
      // Start from BP
      const new_bep = round2(bp - bezugskosten);
      
      const new_zep = round2(new_bep / (1 - percentages.l_skonto_p / 100));
      const new_l_skonto = round2(new_zep - new_bep);
      
      const new_lep = round2(new_zep / (1 - percentages.l_rabatt_p / 100));
      const new_l_rabatt = round2(new_lep - new_zep);
      
      values.lep = new_lep;
      values.l_rabatt = new_l_rabatt;
      values.zep = new_zep;
      values.l_skonto = new_l_skonto;
      values.bep = new_bep;
    }
  } else if (direction === 'Differenz') {
    // Differenzkalkulation: LEP and Brutto are given. Calculate everything in between.
    // 1. Forward from LEP to SK
    // 2. Backward from Brutto to BVP
    // 3. Calculate Gewinn and Gewinn %

    // We keep the generated LEP and calculate forward to SK
    // But we need a Brutto that is somewhat realistic (higher than SK)
    // Let's generate a random profit margin between -5% and 30% to make it interesting (maybe loss?)
    // User requirement: "Gewinn in € und Prozent gesucht". Usually implies profit.
    // Let's ensure profit.
    
    // Recalculate forward part to be sure
    const d_l_rabatt = round2(lep * (percentages.l_rabatt_p / 100));
    const d_zep = round2(lep - d_l_rabatt);
    const d_l_skonto = round2(d_zep * (percentages.l_skonto_p / 100));
    const d_bep = round2(d_zep - d_l_skonto);
    const d_bp = round2(d_bep + bezugskosten);
    const d_hkz = round2(d_bp * (percentages.hkz_p / 100));
    const d_sk = round2(d_bp + d_hkz);

    // Now generate a target Brutto. 
    // Let's say target profit is between 5% and 25%
    const target_profit_p = randomInt(5, 25) + (randomInt(0, 99) / 100);
    const target_bvp = d_sk * (1 + target_profit_p / 100);
    
    // Calculate up to Brutto from this target BVP to get a "nice" Brutto?
    // Or just pick a random Brutto > SK * 1.2?
    // Let's do the full forward calc with the random profit to get a Brutto, then round that Brutto to 2 decimals,
    // and then recalculate backward to get the EXACT BVP and Profit.
    
    const d_zvp_temp = target_bvp / (1 - (percentages.k_skonto_p / 100));
    const d_nvp_temp = d_zvp_temp / (1 - (percentages.k_rabatt_p / 100));
    const d_brutto_temp = d_nvp_temp * (1 + percentages.ust_p / 100);
    
    // Fix Brutto
    const d_brutto = round2(d_brutto_temp);

    // Now Backward from fixed Brutto
    const d_nvp = round2(d_brutto / (1 + percentages.ust_p / 100));
    const d_ust = round2(d_brutto - d_nvp);
    
    const d_k_rabatt = round2(d_nvp * (percentages.k_rabatt_p / 100));
    const d_zvp = round2(d_nvp - d_k_rabatt);
    
    const d_k_skonto = round2(d_zvp * (percentages.k_skonto_p / 100));
    const d_bvp = round2(d_zvp - d_k_skonto);

    // Now we have SK (from forward) and BVP (from backward)
    // Calculate Profit
    const d_gewinn = round2(d_bvp - d_sk);
    const d_gewinn_p = round2((d_gewinn / d_sk) * 100);

    // Update values
    values.lep = lep;
    values.l_rabatt = d_l_rabatt;
    values.zep = d_zep;
    values.l_skonto = d_l_skonto;
    values.bep = d_bep;
    values.bp = d_bp;
    values.hkz = d_hkz;
    values.sk = d_sk;
    
    values.brutto = d_brutto;
    values.ust = d_ust;
    values.nvp = d_nvp;
    values.k_rabatt = d_k_rabatt;
    values.zvp = d_zvp;
    values.k_skonto = d_k_skonto;
    values.bvp = d_bvp;
    
    values.gewinn = d_gewinn;
    percentages.gewinn_p = d_gewinn_p; // Update the percentage in the object
  }

  let description = '';
  if (schema === 'Bezugskalkulation') {
    if (direction === 'Vorwärts') {
      description = `Ein Unternehmen kauft Waren mit einem Listenpreis von ${lep.toFixed(2)}€. ` +
        `Der Lieferant gewährt ${percentages.l_rabatt_p}% Rabatt. ` +
        `Bei Zahlung innerhalb von 10 Tagen werden zusätzlich ${percentages.l_skonto_p}% Skonto gewährt. ` +
        `Die Bezugskosten betragen ${bezugskosten.toFixed(2)}€. ` +
        `Berechnen Sie den Bezugspreis.`;
    } else {
      description = `Rückwärtskalkulation (Bezug): Der Bezugspreis beträgt ${bp.toFixed(2)}€. ` +
        `Die Bezugskosten lagen bei ${bezugskosten.toFixed(2)}€. ` +
        `Der Lieferant gewährte ${percentages.l_skonto_p}% Skonto und ${percentages.l_rabatt_p}% Rabatt. ` +
        `Ermitteln Sie den Listeneinkaufspreis.`;
    }
  } else {
    if (direction === 'Vorwärts') {
      description = `Berechnen Sie die Handelskalkulation (Vorwärts) für folgende Eckdaten: ` +
        `Listeneinkaufspreis: ${lep.toFixed(2)}€, ` +
        `Liefererrabatt: ${percentages.l_rabatt_p}%, Liefererskonto: ${percentages.l_skonto_p}%, ` +
        `Bezugskosten: ${bezugskosten.toFixed(2)}€, ` +
        `Handlungskostenzuschlag: ${percentages.hkz_p}%, Gewinnzuschlag: ${percentages.gewinn_p}%, ` +
        `Kundenskonto: ${percentages.k_skonto_p}%, Kundenrabatt: ${percentages.k_rabatt_p}%, ` +
        `Umsatzsteuer: ${percentages.ust_p}%.`;
    } else if (direction === 'Rückwärts') {
      description = `Berechnen Sie die Handelskalkulation (Rückwärts) ausgehend vom Bruttoverkaufspreis: ${values.brutto.toFixed(2)}€. ` +
        `Gegeben sind: Umsatzsteuer: ${percentages.ust_p}%, Kundenrabatt: ${percentages.k_rabatt_p}%, ` +
        `Kundenskonto: ${percentages.k_skonto_p}%, Gewinnzuschlag: ${percentages.gewinn_p}%, ` +
        `Handlungskostenzuschlag: ${percentages.hkz_p}%, Bezugskosten: ${bezugskosten.toFixed(2)}€, ` +
        `Liefererskonto: ${percentages.l_skonto_p}%, Liefererrabatt: ${percentages.l_rabatt_p}%. ` +
        `Ermitteln Sie den Listeneinkaufspreis.`;
    } else {
      description = `Differenzkalkulation: Gegeben sind der Listeneinkaufspreis (${values.lep.toFixed(2)}€) und der Bruttoverkaufspreis (${values.brutto.toFixed(2)}€). ` +
        `Ermitteln Sie den Gewinn in Euro und Prozent. ` +
        `Kalkulationsdaten: Liefererrabatt ${percentages.l_rabatt_p}%, Liefererskonto ${percentages.l_skonto_p}%, ` +
        `Bezugskosten ${bezugskosten.toFixed(2)}€, Handlungskostenzuschlag ${percentages.hkz_p}%, ` +
        `Kundenskonto ${percentages.k_skonto_p}%, Kundenrabatt ${percentages.k_rabatt_p}%, Umsatzsteuer ${percentages.ust_p}%.`;
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

export const getCalculationExplanation = (
  key: string, 
  direction: CalculationDirection, 
  task: CalcTask
): string => {
  const p = task.percentages;
  const v = task.values;
  const f = (n: number) => n.toFixed(2).replace('.', ',') + '€';
  const fp = (n: number) => n.toString().replace('.', ',') + '%';

  if (direction === 'Vorwärts') {
    switch (key) {
      case 'l_rabatt': return `Listeneinkaufspreis (${f(v.lep)}) × ${fp(p.l_rabatt_p)} ÷ 100`;
      case 'zep': return `Listeneinkaufspreis (${f(v.lep)}) – Liefererrabatt (${f(v.l_rabatt)})`;
      case 'l_skonto': return `Zieleinkaufspreis (${f(v.zep)}) × ${fp(p.l_skonto_p)} ÷ 100`;
      case 'bep': return `Zieleinkaufspreis (${f(v.zep)}) – Liefererskonto (${f(v.l_skonto)})`;
      case 'bezugskosten': return `Gegebener Wert`;
      case 'bp': return `Bareinkaufspreis (${f(v.bep)}) + Bezugskosten (${f(v.bezugskosten)})`;
      case 'hkz': return `Bezugspreis (${f(v.bp)}) × ${fp(p.hkz_p)} ÷ 100`;
      case 'sk': return `Bezugspreis (${f(v.bp)}) + Handlungskostenzuschlag (${f(v.hkz)})`;
      case 'gewinn': return `Selbstkosten (${f(v.sk)}) × ${fp(p.gewinn_p)} ÷ 100`;
      case 'bvp': return `Selbstkosten (${f(v.sk)}) + Gewinn (${f(v.gewinn)})`;
      case 'zvp': return `Barverkaufspreis (${f(v.bvp)}) ÷ (100 - ${fp(p.k_skonto_p)}) × 100`;
      case 'k_skonto': return `Zielverkaufspreis (${f(v.zvp)}) – Barverkaufspreis (${f(v.bvp)})`;
      case 'nvp': return `Zielverkaufspreis (${f(v.zvp)}) ÷ (100 - ${fp(p.k_rabatt_p)}) × 100`;
      case 'k_rabatt': return `Nettoverkaufspreis (${f(v.nvp)}) – Zielverkaufspreis (${f(v.zvp)})`;
      case 'ust': return `Nettoverkaufspreis (${f(v.nvp)}) × ${fp(p.ust_p)} ÷ 100`;
      case 'brutto': return `Nettoverkaufspreis (${f(v.nvp)}) + Umsatzsteuer (${f(v.ust)})`;
      default: return '';
    }
  } else if (direction === 'Rückwärts') {
    switch (key) {
      case 'ust': return `Bruttoverkaufspreis (${f(v.brutto)}) ÷ (100 + ${fp(p.ust_p)}) × ${fp(p.ust_p)}`;
      case 'nvp': return `Bruttoverkaufspreis (${f(v.brutto)}) – Umsatzsteuer (${f(v.ust)})`;
      case 'k_rabatt': return `Nettoverkaufspreis (${f(v.nvp)}) × ${fp(p.k_rabatt_p)} ÷ 100`;
      case 'zvp': return `Nettoverkaufspreis (${f(v.nvp)}) – Kundenrabatt (${f(v.k_rabatt)})`;
      case 'k_skonto': return `Zielverkaufspreis (${f(v.zvp)}) × ${fp(p.k_skonto_p)} ÷ 100`;
      case 'bvp': return `Zielverkaufspreis (${f(v.zvp)}) – Kundenskonto (${f(v.k_skonto)})`;
      case 'gewinn': return `Barverkaufspreis (${f(v.bvp)}) ÷ (100 + ${fp(p.gewinn_p)}) × ${fp(p.gewinn_p)}`;
      case 'sk': return `Barverkaufspreis (${f(v.bvp)}) – Gewinn (${f(v.gewinn)})`;
      case 'hkz': return `Selbstkosten (${f(v.sk)}) ÷ (100 + ${fp(p.hkz_p)}) × ${fp(p.hkz_p)}`;
      case 'bp': return `Selbstkosten (${f(v.sk)}) – Handlungskostenzuschlag (${f(v.hkz)})`;
      case 'bezugskosten': return `Gegebener Wert`;
      case 'bep': return `Bezugspreis (${f(v.bp)}) – Bezugskosten (${f(v.bezugskosten)})`;
      case 'l_skonto': return `Bareinkaufspreis (${f(v.bep)}) ÷ (100 - ${fp(p.l_skonto_p)}) × ${fp(p.l_skonto_p)}`;
      case 'zep': return `Bareinkaufspreis (${f(v.bep)}) + Liefererskonto (${f(v.l_skonto)})`;
      case 'l_rabatt': return `Zieleinkaufspreis (${f(v.zep)}) ÷ (100 - ${fp(p.l_rabatt_p)}) × ${fp(p.l_rabatt_p)}`;
      case 'lep': return `Zieleinkaufspreis (${f(v.zep)}) + Liefererrabatt (${f(v.l_rabatt)})`;
      default: return '';
    }
  } else if (direction === 'Differenz') {
    // Differenzkalkulation
    switch (key) {
      // Forward part (LEP -> SK)
      case 'l_rabatt': return `Listeneinkaufspreis (${f(v.lep)}) × ${fp(p.l_rabatt_p)} ÷ 100`;
      case 'zep': return `Listeneinkaufspreis (${f(v.lep)}) – Liefererrabatt (${f(v.l_rabatt)})`;
      case 'l_skonto': return `Zieleinkaufspreis (${f(v.zep)}) × ${fp(p.l_skonto_p)} ÷ 100`;
      case 'bep': return `Zieleinkaufspreis (${f(v.zep)}) – Liefererskonto (${f(v.l_skonto)})`;
      case 'bezugskosten': return `Gegebener Wert`;
      case 'bp': return `Bareinkaufspreis (${f(v.bep)}) + Bezugskosten (${f(v.bezugskosten)})`;
      case 'hkz': return `Bezugspreis (${f(v.bp)}) × ${fp(p.hkz_p)} ÷ 100`;
      case 'sk': return `Bezugspreis (${f(v.bp)}) + Handlungskostenzuschlag (${f(v.hkz)})`;
      
      // Backward part (Brutto -> BVP)
      case 'ust': return `Bruttoverkaufspreis (${f(v.brutto)}) ÷ (100 + ${fp(p.ust_p)}) × ${fp(p.ust_p)}`;
      case 'nvp': return `Bruttoverkaufspreis (${f(v.brutto)}) – Umsatzsteuer (${f(v.ust)})`;
      case 'k_rabatt': return `Nettoverkaufspreis (${f(v.nvp)}) × ${fp(p.k_rabatt_p)} ÷ 100`;
      case 'zvp': return `Nettoverkaufspreis (${f(v.nvp)}) – Kundenrabatt (${f(v.k_rabatt)})`;
      case 'k_skonto': return `Zielverkaufspreis (${f(v.zvp)}) × ${fp(p.k_skonto_p)} ÷ 100`;
      case 'bvp': return `Zielverkaufspreis (${f(v.zvp)}) – Kundenskonto (${f(v.k_skonto)})`;
      
      // The difference
      case 'gewinn': return `Barverkaufspreis (${f(v.bvp)}) – Selbstkosten (${f(v.sk)})`;
      
      default: return '';
    }
  }
  return '';
};
