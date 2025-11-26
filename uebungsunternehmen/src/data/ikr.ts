export interface Account {
  number: string;
  name: string;
}

export const IKR_ACCOUNTS: Account[] = [
  // Aktiva
  { number: '0700', name: 'Technische Anlagen und Maschinen' },
  { number: '0840', name: 'Fuhrpark' },
  { number: '0860', name: 'Büroausstattung' },
  { number: '2000', name: 'Rohstoffe' },
  { number: '2010', name: 'Fremdbauteile' },
  { number: '2020', name: 'Hilfsstoffe' },
  { number: '2030', name: 'Betriebsstoffe' },
  { number: '2200', name: 'Fertigerzeugnisse' },
  { number: '2280', name: 'Handelswaren' },
  { number: '2400', name: 'Forderungen a.LL.' },
  { number: '2600', name: 'Vorsteuer' },
  { number: '2800', name: 'Bank' },
  { number: '2880', name: 'Kasse' },

  // Passiva
  { number: '3000', name: 'Eigenkapital' },
  { number: '4250', name: 'Langfristige Bankverbindlichkeiten' },
  { number: '4400', name: 'Verbindlichkeiten a.LL.' },
  { number: '4800', name: 'Umsatzsteuer' },

  // Erträge
  { number: '5000', name: 'Umsatzerlöse für eigene Erzeugnisse' },
  { number: '5100', name: 'Umsatzerlöse für Handelswaren' },
  { number: '5400', name: 'Mieterträge' },
  { number: '5710', name: 'Zinserträge' },

  // Aufwendungen
  { number: '6000', name: 'Aufwendungen für Rohstoffe' },
  { number: '6010', name: 'Aufwendungen für Fremdbauteile' },
  { number: '6020', name: 'Aufwendungen für Hilfsstoffe' },
  { number: '6030', name: 'Aufwendungen für Betriebsstoffe' },
  { number: '6080', name: 'Aufwendungen für Handelswaren' },
  { number: '6160', name: 'Fremdinstandhaltung' },
  { number: '6200', name: 'Löhne' },
  { number: '6300', name: 'Gehälter' },
  { number: '6400', name: 'Arbeitgeberanteil zur Sozialversicherung' },
  { number: '6520', name: 'Abschreibungen auf Sachanlagen' },
  { number: '6700', name: 'Mietaufwendungen' },
  { number: '6800', name: 'Büromaterial' },
  { number: '6950', name: 'Abschreibungen auf Forderungen' },
  { number: '7510', name: 'Zinsaufwendungen' },
];

export const getAccountName = (number: string) => {
  return IKR_ACCOUNTS.find(a => a.number === number)?.name || 'Unbekanntes Konto';
};
