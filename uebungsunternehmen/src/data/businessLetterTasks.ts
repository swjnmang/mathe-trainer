export interface LetterScenario {
  id: string;
  title: string;
  company: string;
  situation: string;
  objectives: string[];
  requiredElements: string[];
  languageHints: string[];
  focus: {
    type: 'angebot' | 'reklamation' | 'zahlung' | 'allgemein';
    tone: 'freundlich' | 'bestimmt' | 'dringend';
  };
}

export interface DinSectionGuideline {
  id: string;
  title: string;
  description: string;
  position: string;
  checklist: string[];
}

export const dinSectionGuidelines: DinSectionGuideline[] = [
  {
    id: 'sender',
    title: 'Absenderzone',
    description: 'Ihre Firmenanschrift oben links, maximal 3 Zeilen, Schriftgröße 10-12 pt.',
    position: 'Zeile 1–3, linker Rand 2,5 cm',
    checklist: ['Firmenname', 'Straße + Hausnummer', 'PLZ Ort']
  },
  {
    id: 'recipient',
    title: 'Empfängerzone',
    description: 'Beginnt zwei Leerzeilen unter dem Absender. Optional Zusatz- und Informationszeile.',
    position: 'Zeile 5–15',
    checklist: ['Anrede + Name', 'Straße / Postfach', 'PLZ Ort']
  },
  {
    id: 'date',
    title: 'Bezugszeichenzeile & Datum',
    description: 'Datum rechtsbündig, z. B. „27.11.2025“. Bezugszeichenzeile optional darunter.',
    position: 'Zeile 17',
    checklist: ['aktuelles Datum', 'rechtsbündig ausrichten']
  },
  {
    id: 'subject',
    title: 'Betreffzeile',
    description: 'Kurzer, prägnanter Betreff ohne das Wort „Betreff“. Eine Leerzeile nach dem Betreff.',
    position: 'Zeile 19–20',
    checklist: ['Fett oder hervorgehoben', 'Keine Satzzeichen am Ende']
  },
  {
    id: 'salutation',
    title: 'Anrede',
    description: '„Sehr geehrte Frau...,“ oder „Sehr geehrter Herr...,“ gefolgt von Leerzeile.',
    position: 'Zeile 21/22',
    checklist: ['Komma verwenden', 'Leerzeile zum Textblock']
  },
  {
    id: 'body',
    title: 'Textblock',
    description: 'Absätze durch Leerzeile trennen, links bündig. Ein Gedanke pro Absatz.',
    position: 'ab Zeile 23',
    checklist: ['Einleitung', 'Hauptteil', 'Schluss']
  },
  {
    id: 'closing',
    title: 'Grußformel & Unterschrift',
    description: '„Mit freundlichen Grüßen“ gefolgt von drei Leerzeilen für Unterschrift + Name.',
    position: 'nach Textblock',
    checklist: ['Grußformel', 'Unterschrift', 'Name / Funktion']
  },
  {
    id: 'attachments',
    title: 'Anlagen / Verteiler',
    description: 'Optional. Zwei Leerzeilen Abstand zur Unterschrift. Auflisten, wenn vorhanden.',
    position: 'nach Unterschrift',
    checklist: ['„Anlage:“ + Aufzählung', 'Optional Verteiler']
  }
];

export const letterScenarios: LetterScenario[] = [
  {
    id: 'angebot_followup',
    title: 'Angebotsnachfrage beantworten',
    company: 'Nordlicht Technik GmbH',
    situation: 'Die Kundin hat eine Anfrage zu Notebooks gestellt. Sie sollen ein offizielles Angebot inkl. Lieferzeit senden.',
    objectives: ['Preis und Lieferzeit nennen', 'Skonto- und Rabattstaffel erwähnen', 'freundlich zum Abschluss motivieren'],
    requiredElements: ['Betreff mit Angebotsnummer', 'Hinweis auf Lieferzeit', 'Verweis auf Ansprechpartner'],
    languageHints: ['freundlicher Ton', 'Einladung zu Rückfragen', 'positive Schlussformel'],
    focus: { type: 'angebot', tone: 'freundlich' }
  },
  {
    id: 'reklamation',
    title: 'Reklamation formulieren',
    company: 'CityShop GmbH',
    situation: 'Ein Kunde erhielt beschädigte Ware und möchte Ersatz. Sie antworten im Namen des Unternehmens.',
    objectives: ['Schaden anerkennen', 'Lösung anbieten', 'Kulanz zeigen, aber professionell bleiben'],
    requiredElements: ['Datum der Lieferung', 'Auflistung der Schäden', 'konkrete Lösung (Ersatz oder Gutschrift)'],
    languageHints: ['bestimmter, aber wertschätzender Ton', 'Verständnis ausdrücken', 'Bitte um Rückmeldung'],
    focus: { type: 'reklamation', tone: 'bestimmt' }
  },
  {
    id: 'zahlungserinnerung',
    title: 'Zahlungserinnerung',
    company: 'OfficePro Handels GmbH',
    situation: 'Eine Rechnung ist überfällig. Erinnern Sie den Geschäftspartner höflich an die offene Zahlung.',
    objectives: ['Rechnungsdaten nennen', 'neue Frist setzen', 'Folgen einer Nichtzahlung ankündigen'],
    requiredElements: ['Rechnungsnummer', 'ursprüngliches Fälligkeitsdatum', 'Bankverbindung / Zahlungsweg'],
    languageHints: ['bestimmt und sachlich', 'freundlicher Einstieg, klarer Schluss'],
    focus: { type: 'zahlung', tone: 'dringend' }
  },
  {
    id: 'absage',
    title: 'Absage formulieren',
    company: 'GreenOffice Supplies',
    situation: 'Sie müssen ein Angebot ablehnen, möchten jedoch respektvoll bleiben und spätere Zusammenarbeit offen lassen.',
    objectives: ['Dank für Angebot', 'Absage begründen', 'Alternative Aussicht geben'],
    requiredElements: ['Referenz auf Angebot', 'begründete Absage', 'positive Schlussformel'],
    languageHints: ['wertschätzend', 'klar aber höflich', 'Verweis auf zukünftige Projekte'],
    focus: { type: 'allgemein', tone: 'freundlich' }
  }
];

export function getRandomScenario(): LetterScenario {
  return letterScenarios[Math.floor(Math.random() * letterScenarios.length)];
}
