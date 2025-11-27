export interface LetterAssignment {
  id: string;
  title: string;
  company: string;
  companyAddress: string;
  managerName: string;
  senderPlaceholder: string;
  context: string[];
  requirements: string[];
  contactData: {
    phone: string;
    fax: string;
    mail: string;
  };
  references: {
    ourLetter: string;
    theirLetter: string;
    theirReference: string;
  };
  recipientType: 'business' | 'private';
  recipientPieces: string[];
  deliveryNote: string;
  subject: string;
  bodyDraft: string;
}

export const letterAssignments: LetterAssignment[] = [
  {
    id: 'katalog-buero',
    title: 'Spezialkatalog über Büromöbel',
    company: 'MÖBELFABRIK Peter Jordan GmbH',
    companyAddress: 'Meindlstraße 8a\n81373 München',
    managerName: 'Werner Volk',
    senderPlaceholder: 'MÖBELFABRIK Peter Jordan GmbH · Meindlstraße 8a · 81373 München',
    context: [
      'Arbeitsauftrag: Du schreibst für die MÖBELFABRIK Peter Jordan GmbH, Meindlstraße 8a, 81373 München. Dein Vorgesetzter Werner Volk erwartet das fertige Schreiben und ist unter Tel. Durchwahl 142, Fax 100 oder vorname.nachname@jordanmoebel.de erreichbar. Der Brief geht an Merkur & Söhne GmbH, Frau Elke Schnell, Postfach 11609, 83425 Bad Reichenhall; übernimm diese Adresse zeilengenau.',
      'Die Kundin benötigt einen aktualisierten Spezialkatalog und eine kurze Übersicht über verfügbare Büromodule. Sichere zu, dass die Unterlagen versandfertig sind und dass die Reservierung nur bis Ende nächster Woche aufrechterhalten wird.'
    ],
    requirements: [
      'Einschreiben-Vermerk in die Zusatz- und Vermerkzone aufnehmen',
      'Infoblock mit beiden Bezugszeichen ausfüllen',
      'Anrede und Briefschluss selbst formulieren'
    ],
    contactData: {
      phone: 'Durchwahl 142',
      fax: 'Fax 100',
      mail: 'vorname.nachname@jordanmoebel.de'
    },
    references: {
      ourLetter: '12.02.20XX',
      theirLetter: '18.02.20XX',
      theirReference: 'es-el'
    },
    recipientType: 'business',
    recipientPieces: [
      'Merkur & Söhne GmbH',
      'Frau Elke Schnell',
      'Postfach 11609',
      '83425 Bad Reichenhall'
    ],
    deliveryNote: 'Einschreiben',
    subject: 'Spezialkatalog über Büromöbel',
    bodyDraft:
      'vielen dank für ihr schreiben vom 18.02. wir haben die markierten büromodule zusammengestellt und die preise ohne überschriften direkt in die tabelle getippt damit sie schneller vergleichen können. bitte melden sie sich bis ende nächster woche, sonst reservieren wir die muster nur noch lose.'
  },
  {
    id: 'leasing-rueckfrage',
    title: 'Rückfrage Leasingangebot',
    company: 'Nordstadt Auto-Leasing GmbH',
    companyAddress: 'Leipziger Platz 7\n10117 Berlin',
    managerName: 'Mara Dietz',
    senderPlaceholder: 'Nordstadt Auto-Leasing GmbH · Leipziger Platz 7 · 10117 Berlin',
    context: [
      'Arbeitsauftrag: Du schreibst für die Nordstadt Auto-Leasing GmbH, Leipziger Platz 7, 10117 Berlin. Dein Vorgesetzter Mara Dietz hat den Auftrag erteilt und ist über Tel. +49 30 4455-221, Fax +49 30 4455-290 oder vertrieb@nordstadt-leasing.de erreichbar. Der Brief adressiert die Futura Print AG, Herrn Jonas Krauß, Rechenzentrum 2, 60596 Frankfurt am Main; übernimm die Angaben exakt.',
      'Bestätige die gewünschten Leasingparameter, weise auf den beigefügten Serviceplan hin und setze eine klare Frist zur Vertragsunterzeichnung.'
    ],
    requirements: [
      'Hinweis auf beiliegende Serviceübersicht',
      'Frist zur Vertragszeichnung setzen',
      'Kontaktmöglichkeiten im Infoblock vollständig angeben'
    ],
    contactData: {
      phone: '+49 30 4455-221',
      fax: '+49 30 4455-290',
      mail: 'vertrieb@nordstadt-leasing.de'
    },
    references: {
      ourLetter: '03.03.20XX',
      theirLetter: '28.02.20XX',
      theirReference: 'fp-ld'
    },
    recipientType: 'business',
    recipientPieces: [
      'Futura Print AG',
      'Herrn Jonas Krauß',
      'Rechenzentrum 2',
      '60596 Frankfurt am Main'
    ],
    deliveryNote: 'Per Kurier',
    subject: 'Bestätigung Ihres Leasingpakets',
    bodyDraft:
      'wir bestätigen ihnen die 48 monate laufzeit und haben die wartungsflatrate kommentarlos in den anhang gepackt. die version mit winterreifen kostet exakt wie telefonisch notiert, das musste nicht mehr fett hervorgehoben werden.'
  },
  {
    id: 'messestand-logistik',
    title: 'Logistik für Messestand',
    company: 'ExpoCraft Systems KG',
    companyAddress: 'Ruhrallee 112\n45136 Essen',
    managerName: 'Kathrin Plöger',
    senderPlaceholder: 'ExpoCraft Systems KG · Ruhrallee 112 · 45136 Essen',
    context: [
      'Arbeitsauftrag: Du schreibst für die ExpoCraft Systems KG, Ruhrallee 112, 45136 Essen. Deine Vorgesetzte Kathrin Plöger verlangt das abgestimmte Schreiben und ist über Tel. +49 201 5512-70, Fax +49 201 5512-90 oder logistik@expocraft.de erreichbar. Adressiere Additive Motion GmbH, Frau Dr. Jana Herbst, Gutenbergstraße 8, 60316 Frankfurt am Main.',
      'Sichere die Aufbauzeiten zur Formnext-Messe verbindlich zu, erkläre die nächsten Schritte für Sicherheitsfreigaben und nenne den Kontakt des Logistikteams.'
    ],
    requirements: [
      'Aufbaukalender ansprechen',
      'Hinweis auf benötigte Freigaben geben',
      'Kontaktdaten des Logistikteams nennen'
    ],
    contactData: {
      phone: '+49 201 5512-70',
      fax: '+49 201 5512-90',
      mail: 'logistik@expocraft.de'
    },
    references: {
      ourLetter: '10.04.20XX',
      theirLetter: '05.04.20XX',
      theirReference: 'fn-stand'
    },
    recipientType: 'business',
    recipientPieces: [
      'Additive Motion GmbH',
      'Frau Dr. Jana Herbst',
      'Gutenbergstraße 8',
      '60316 Frankfurt am Main'
    ],
    deliveryNote: 'Per E-Mail + Ausdruck',
    subject: 'Messelogistik Formnext 20XX',
    bodyDraft:
      'anbei erhalten sie die aufbauzeiten, wir haben die pausen einfach in klammern gesetzt damit nichts verloren geht. bitte schicken sie uns die brandschutzfreigabe noch ohne logos zurück, das vereinfacht die ablage.'
  },
  {
    id: 'schulung-bestaetigung',
    title: 'Schulungsbestätigung Technikteam',
    company: 'HelioVolt Energy Solutions',
    companyAddress: 'Energiestraße 14\n90471 Nürnberg',
    managerName: 'Sabine Köhler',
    senderPlaceholder: 'HelioVolt Energy Solutions · Energiestraße 14 · 90471 Nürnberg',
    context: [
      'Arbeitsauftrag: Du schreibst für HelioVolt Energy Solutions, Energiestraße 14, 90471 Nürnberg. Deine Vorgesetzte Sabine Köhler möchte einen unterschriftsreifen Brief und ist über Tel. +49 911 7654-230, Fax +49 911 7654-200 oder service@heliovolt.de erreichbar. Empfänger ist Metron GmbH, Herrn Boris Wittke, Hauptlager 3, 47443 Moers.',
      'Bestätige die Schulungstermine, nenne Trainer und digitale Unterlagen und fordere eine Rückmeldung bis zum abgestimmten Datum an.'
    ],
    requirements: [
      'Zeiträume und Trainer nennen',
      'Digitale Unterlagen erwähnen',
      'Rückmeldung bis zu einem Datum erbitten'
    ],
    contactData: {
      phone: '+49 911 7654-230',
      fax: '+49 911 7654-200',
      mail: 'service@heliovolt.de'
    },
    references: {
      ourLetter: '14.05.20XX',
      theirLetter: '11.05.20XX',
      theirReference: 'mt-install'
    },
    recipientType: 'business',
    recipientPieces: [
      'Metron GmbH',
      'Herrn Boris Wittke',
      'Hauptlager 3',
      '47443 Moers'
    ],
    deliveryNote: 'Per Bote',
    subject: 'Bestätigung Ihrer Schulungstermine',
    bodyDraft:
      'wir haben die drei trainingstage in eine kleine liste gepackt und wieder ohne absätze geschrieben damit der überblick bleibt. bitte reservieren sie uns die genannten räume, sonst schieben wir das einfach still in kalenderwoche 24.'
  },
  {
    id: 'spendenquittung',
    title: 'Übermittlung Spendenquittung',
    company: 'Stiftung Horizonte',
    companyAddress: 'Seestraße 18\n78462 Konstanz',
    managerName: 'Dr. Jana Fuchs',
    senderPlaceholder: 'Stiftung Horizonte · Seestraße 18 · 78462 Konstanz',
    context: [
      'Arbeitsauftrag: Du repräsentierst die Stiftung Horizonte, Seestraße 18, 78462 Konstanz. Deine Vorgesetzte Dr. Jana Fuchs beauftragt dich mit dem Schreiben und ist über Tel. +49 7531 22880, Fax +49 7531 228812 oder spenden@horizonte-stiftung.de erreichbar. Der Brief geht an Herrn Dr. Leonhard Pötzsch, Seeuferweg 4, 78464 Konstanz.',
      'Bedanke dich für die Spende, verweise auf aktuelle Projekte, nenne die Quittungsnummer und bestätige, dass die Unterlagen auf dem Weg sind.'
    ],
    requirements: [
      'Dank und Hinweis auf Projekte',
      'Quittungsnummer nennen',
      'Telefonkontakt für Rückfragen angeben'
    ],
    contactData: {
      phone: '+49 7531 22880',
      fax: '+49 7531 228812',
      mail: 'spenden@horizonte-stiftung.de'
    },
    references: {
      ourLetter: '02.01.20XX',
      theirLetter: '22.12.20XX',
      theirReference: 'priv-77'
    },
    recipientType: 'private',
    recipientPieces: [
      'Herrn Dr. Leonhard Pötzsch',
      'Seeuferweg 4',
      '78464 Konstanz'
    ],
    deliveryNote: 'Standardbrief',
    subject: 'Ihre Spendenquittung 20XX',
    bodyDraft:
      'wir freuen uns über ihre großzügige unterstützung und schicken die quittung gleich mitsamt flyer los. die projekte im bereich jugendkunst laufen weiter, deshalb erwähnen wir sie nur kurz damit der text nicht zu lang wird.'
  },
  {
    id: 'reklamation-fracht',
    title: 'Reklamation beschädigte Lieferung',
    company: 'CargoPlus Logistik AG',
    companyAddress: 'Frachtstraße 55\n21129 Hamburg',
    managerName: 'Daniela Merz',
    senderPlaceholder: 'CargoPlus Logistik AG · Frachtstraße 55 · 21129 Hamburg',
    context: [
      'Arbeitsauftrag: Du handelst für die CargoPlus Logistik AG, Frachtstraße 55, 21129 Hamburg. Deine Ansprechpartnerin Daniela Merz verlangt den abgestimmten Brief und ist über Tel. +49 40 7802-440, Fax +49 40 7802-499 oder claims@cargoplus.com erreichbar. Adressat ist Hanseatic Machines GmbH, Herrn Dirk Lucht, Wiesenhof 11, 28357 Bremen.',
      'Reagiere auf die Schadensmeldung, erkenne den Schaden an, nenne den Versicherungskontakt und koordiniere die Abholung der beschädigten Ware.'
    ],
    requirements: [
      'Schaden anerkennen',
      'Versicherungskontakt nennen',
      'Abholung der Restware koordinieren'
    ],
    contactData: {
      phone: '+49 40 7802-440',
      fax: '+49 40 7802-499',
      mail: 'claims@cargoplus.com'
    },
    references: {
      ourLetter: '18.06.20XX',
      theirLetter: '15.06.20XX',
      theirReference: 'mb-transport'
    },
    recipientType: 'business',
    recipientPieces: [
      'Hanseatic Machines GmbH',
      'Herrn Dirk Lucht',
      'Wiesenhof 11',
      '28357 Bremen'
    ],
    deliveryNote: 'Per E-Mail + Einschreiben',
    subject: 'Schadenfall Sendung 6K-884',
    bodyDraft:
      'wir sind den schadenbildern nachgegangen und haben die fotos direkt an den versicherer gepinnt, ohne große erläuterung. bitte halten sie die paletten bereit, unser fahrer meldet sich sonst einfach unangekündigt nächste woche.'
  },
  {
    id: 'preisupdate-lieferant',
    title: 'Preisupdate Lieferantenvertrag',
    company: 'Weissmann Komponentenwerke',
    companyAddress: 'Werkstraße 3\n73037 Göppingen',
    managerName: 'Ulrich Gerster',
    senderPlaceholder: 'Weissmann Komponentenwerke · Werkstraße 3 · 73037 Göppingen',
    context: [
      'Arbeitsauftrag: Du agierst für die Weissmann Komponentenwerke, Werkstraße 3, 73037 Göppingen. Dein Vorgesetzter Ulrich Gerster erwartet die abgestimmte Mitteilung und ist unter Tel. +49 7161 299-310, Fax +49 7161 299-399 oder einkauf@weissmann.de erreichbar. Schreib an TechParts Solutions s.r.o., Frau Nikola Havlicek, Václavské náměstí 17, 110 00 Praha 1, Tschechien.',
      'Stelle die neuen Preisstaffeln vor, nenne das Gültigkeitsdatum und bitte um eine Rückbestätigung bis Monatsende.'
    ],
    requirements: [
      'Staffeln erläutern',
      'Gültigkeitsdatum nennen',
      'Feedback-Kanal angeben'
    ],
    contactData: {
      phone: '+49 7161 299-310',
      fax: '+49 7161 299-399',
      mail: 'einkauf@weissmann.de'
    },
    references: {
      ourLetter: '22.07.20XX',
      theirLetter: '17.07.20XX',
      theirReference: 'lf-pricing'
    },
    recipientType: 'business',
    recipientPieces: [
      'TechParts Solutions s.r.o.',
      'Frau Nikola Havlicek',
      'Václavské náměstí 17',
      '110 00 Praha 1',
      'Tschechien'
    ],
    deliveryNote: 'Per E-Mail engl./dt.',
    subject: 'Aktualisierte Einkaufskonditionen',
    bodyDraft:
      'wir haben die neue staffel schlicht in einer tabelle notiert und keine überschriften mehr gesetzt. geben sie uns bitte trotzdem ein zeichen ob sie die konditionen bis 31. juli annehmen, sonst schalten wir einfach wieder auf basispreise.'
  },
  {
    id: 'wartungstermin',
    title: 'Vereinbarung Wartungstermin',
    company: 'AquaPure Anlagenservice',
    companyAddress: 'Filterweg 9\n24145 Kiel',
    managerName: 'Henning Lau',
    senderPlaceholder: 'AquaPure Anlagenservice · Filterweg 9 · 24145 Kiel',
    context: [
      'Arbeitsauftrag: Du arbeitest für AquaPure Anlagenservice, Filterweg 9, 24145 Kiel. Dein Vorgesetzter Henning Lau erwartet das Schreiben und ist über Tel. +49 431 9898-115, Fax +49 431 9898-199 oder service@aquapure.de erreichbar. Der Empfänger lautet Stadtwerke Flensburg GmbH, Betriebshof Klärwerk, Am Industriehafen 12, 24937 Flensburg.',
      'Unterbreite zwei Wartungsfenster, erwähne die Ersatzteilliste und biete einen Ansprechpartner für Rückfragen an.'
    ],
    requirements: [
      'Terminfenster bieten',
      'Ersatzteilliste erwähnen',
      'Kontakt für Rückfragen nennen'
    ],
    contactData: {
      phone: '+49 431 9898-115',
      fax: '+49 431 9898-199',
      mail: 'service@aquapure.de'
    },
    references: {
      ourLetter: '05.08.20XX',
      theirLetter: '01.08.20XX',
      theirReference: 'klärwerk-nord'
    },
    recipientType: 'business',
    recipientPieces: [
      'Stadtwerke Flensburg GmbH',
      'Betriebshof Klärwerk',
      'Am Industriehafen 12',
      '24937 Flensburg'
    ],
    deliveryNote: 'Per Fax + Brief',
    subject: 'Wartung Ihrer Filterstrecken',
    bodyDraft:
      'wir schlagen zwei wartungsfenster vor und haben die geräteliste ohne nummerierung direkt darunter geschrieben. bitte geben sie uns nur bescheid welches fenster bleibt, wir tragen es dann stumm in den einsatzplan ein.'
  },
  {
    id: 'azubi-bewerbung',
    title: 'Einladung Bewerbungsgespräch',
    company: 'Handelsunion Süd eG',
    companyAddress: 'Hafenstraße 6\n89073 Ulm',
    managerName: 'Simone Gruber',
    senderPlaceholder: 'Handelsunion Süd eG · Hafenstraße 6 · 89073 Ulm',
    context: [
      'Arbeitsauftrag: Du schreibst für die Handelsunion Süd eG, Hafenstraße 6, 89073 Ulm. Deine Vorgesetzte Simone Gruber gibt den Auftrag und ist unter Tel. +49 731 602-55, Fax +49 731 602-99 oder karriere@handelsunion.de erreichbar. Empfängerin ist Frau Miriam Enders, Lindenstraße 19, 89231 Neu-Ulm.',
      'Bestätige den Termin des Bewerbungsgesprächs, fordere die benötigten Unterlagen an und erwähne kurz die Ausbildungsinhalte.'
    ],
    requirements: [
      'Termin und Ort nennen',
      'Unterlagen erbitten',
      'kurz auf Ausbildungsinhalte eingehen'
    ],
    contactData: {
      phone: '+49 731 602-55',
      fax: '+49 731 602-99',
      mail: 'karriere@handelsunion.de'
    },
    references: {
      ourLetter: '18.08.20XX',
      theirLetter: '12.08.20XX',
      theirReference: 'azubibewerb'
    },
    recipientType: 'private',
    recipientPieces: [
      'Frau Miriam Enders',
      'Lindenstraße 19',
      '89231 Neu-Ulm'
    ],
    deliveryNote: 'Standardbrief',
    subject: 'Einladung zu Ihrem Bewerbungsgespräch',
    bodyDraft:
      'wir freuen uns über ihre bewerbung und schlagen direkt dienstag 14 uhr vor ohne vorher groß zu fragen. bringen sie bitte zeugnisse und einen block mit, dann müssen wir das nicht mehr einzeln nachfordern.'
  },
  {
    id: 'zahlungserinnerung',
    title: 'Zahlungserinnerung Projekt 47',
    company: 'OfficePro Handels GmbH',
    companyAddress: 'Stahltwiete 20\n22761 Hamburg',
    managerName: 'Dennis Vogt',
    senderPlaceholder: 'OfficePro Handels GmbH · Stahltwiete 20 · 22761 Hamburg',
    context: [
      'Arbeitsauftrag: Du schreibst für die OfficePro Handels GmbH, Stahltwiete 20, 22761 Hamburg. Dein Vorgesetzter Dennis Vogt erwartet die Zahlungserinnerung und ist über Tel. +49 40 5522-180, Fax +49 40 5522-199 oder buchhaltung@officepro.de erreichbar. Empfänger ist ProfiMedia Verlag GmbH, Herrn Lutz Germer, Medienallee 5, 85774 Unterföhring.',
      'Erinnere an die offene Rechnung, nenne Nummer und Fälligkeit, setze eine neue Frist und beschreibe den bevorzugten Zahlungsweg.'
    ],
    requirements: [
      'Rechnungsnr. und Fälligkeit nennen',
      'Neue Frist setzen',
      'Zahlungsweg angeben'
    ],
    contactData: {
      phone: '+49 40 5522-180',
      fax: '+49 40 5522-199',
      mail: 'buchhaltung@officepro.de'
    },
    references: {
      ourLetter: '02.09.20XX',
      theirLetter: '—',
      theirReference: 'op-47'
    },
    recipientType: 'business',
    recipientPieces: [
      'ProfiMedia Verlag GmbH',
      'Herrn Lutz Germer',
      'Medienallee 5',
      '85774 Unterföhring'
    ],
    deliveryNote: 'Per Einschreiben',
    subject: 'Zweite Erinnerung Rechnung 220347',
    bodyDraft:
      'wir verweisen erneut auf die rechnung 220347 und haben den betrag diesmal ohne dezimalstellen aufgeführt um platz zu sparen. bitte gleichen sie den posten bis 12. september aus, sonst gehen die unterlagen automatisch an das factoring.'
  },
  {
    id: 'arbeitskleidung',
    title: 'Nachbestellung Arbeitskleidung',
    company: 'SafetyWear Süd GmbH',
    companyAddress: 'Industriepark 5\n86167 Augsburg',
    managerName: 'Martin Schreiber',
    senderPlaceholder: 'SafetyWear Süd GmbH · Industriepark 5 · 86167 Augsburg',
    context: [
      'Arbeitsauftrag: Du vertrittst die SafetyWear Süd GmbH, Industriepark 5, 86167 Augsburg. Dein Vorgesetzter Martin Schreiber erwartet das Bestellschreiben und ist über Tel. +49 821 4450-60, Fax +49 821 4450-66 oder bestellung@safetywear.de erreichbar. Die Lieferung richtet sich an CleanTech Services GmbH, Frau Nadine Boll, Logistikzentrum Block C, 44805 Bochum.',
      'Bitte liste die nachbestellten Größen übersichtlich, bestätige den Liefertermin und erwähne die nachhaltigen Stoffe der Kollektion.'
    ],
    requirements: [
      'Größen tabellarisch erwähnen',
      'Liefertermin bestätigen',
      'Hinweis auf nachhaltige Stoffe geben'
    ],
    contactData: {
      phone: '+49 821 4450-60',
      fax: '+49 821 4450-66',
      mail: 'bestellung@safetywear.de'
    },
    references: {
      ourLetter: '08.09.20XX',
      theirLetter: '04.09.20XX',
      theirReference: 'sw-nachorder'
    },
    recipientType: 'business',
    recipientPieces: [
      'CleanTech Services GmbH',
      'Frau Nadine Boll',
      'Logistikzentrum Block C',
      '44805 Bochum'
    ],
    deliveryNote: 'Paket mit Begleitschein',
    subject: 'Nachbestellung Ihrer Arbeitskleidung',
    bodyDraft:
      'wir listen die nachbestellung gleich in einem atemzug auf und erwähnen die farben nicht mehr extra. falls sie die lieferung doch splitten wollen geben sie nur ein kurzes zeichen, wir richten das geräuschlos ein.'
  },
  {
    id: 'dienstreise',
    title: 'Bestätigung Dienstreiseabrechnung',
    company: 'Helvetia Consult AG',
    companyAddress: 'Bundesplatz 18\n3005 Bern',
    managerName: 'Patricia Gasser',
    senderPlaceholder: 'Helvetia Consult AG · Bundesplatz 18 · 3005 Bern',
    context: [
      'Arbeitsauftrag: Du repräsentierst die Helvetia Consult AG, Bundesplatz 18, 3005 Bern. Deine Vorgesetzte Patricia Gasser gibt den Auftrag und ist über Tel. +41 31 998-440, Fax +41 31 998-441 oder finance@helvetia-consult.ch erreichbar. Anschriftenblock: Miller & Co. Steuerberatung, Herrn Ralf Hagedorn, Hansastraße 90, 44137 Dortmund.',
      'Bestätige die Dienstreiseabrechnung mit Gesamtsumme, verweise auf die beigefügten Belege und erinnere an die steuerliche Frist.'
    ],
    requirements: [
      'Gesamtsumme nennen',
      'Belegliste erwähnen',
      'Steuerliche Frist ansprechen'
    ],
    contactData: {
      phone: '+41 31 998-440',
      fax: '+41 31 998-441',
      mail: 'finance@helvetia-consult.ch'
    },
    references: {
      ourLetter: '15.09.20XX',
      theirLetter: '09.09.20XX',
      theirReference: 'dc-travel'
    },
    recipientType: 'business',
    recipientPieces: [
      'Miller & Co. Steuerberatung',
      'Herrn Ralf Hagedorn',
      'Hansastraße 90',
      '44137 Dortmund'
    ],
    deliveryNote: 'Per Einschreiben international',
    subject: 'Dienstreiseabrechnung Projekt Delta',
    bodyDraft:
      'wir führen die spesen diesmal ohne komma auf damit nichts verrutscht. alle belegnummern finden sie direkt untereinander, das spart den anhängen seitenzahlen.'
  },
  {
    id: 'schaden-e-ladestation',
    title: 'Schadenmeldung E-Ladestation',
    company: 'GridCharge Services GmbH',
    companyAddress: 'Ulmenallee 4\n40476 Düsseldorf',
    managerName: 'Oliver Seiler',
    senderPlaceholder: 'GridCharge Services GmbH · Ulmenallee 4 · 40476 Düsseldorf',
    context: [
      'Arbeitsauftrag: Du vertrittst die GridCharge Services GmbH, Ulmenallee 4, 40476 Düsseldorf. Dein Vorgesetzter Oliver Seiler verlangt das Schadenprotokoll und ist über Tel. +49 211 6607-220, Fax +49 211 6607-299 oder support@gridcharge.de erreichbar. Empfänger ist Stadtverwaltung Krefeld, Technisches Rathaus, Dionysiusplatz 1, 47798 Krefeld.',
      'Beziehe dich auf die Ticketnummer, kündige den Einsatztermin an und verweise auf die beigefügten Fotos.'
    ],
    requirements: [
      'Ticketnummer nennen',
      'Einsatztermin anbieten',
      'Fotos im Anhang erwähnen'
    ],
    contactData: {
      phone: '+49 211 6607-220',
      fax: '+49 211 6607-299',
      mail: 'support@gridcharge.de'
    },
    references: {
      ourLetter: '21.09.20XX',
      theirLetter: '20.09.20XX',
      theirReference: 'gc-1147'
    },
    recipientType: 'business',
    recipientPieces: [
      'Stadtverwaltung Krefeld',
      'Technisches Rathaus',
      'Dionysiusplatz 1',
      '47798 Krefeld'
    ],
    deliveryNote: 'Per Kurierfach',
    subject: 'Schadenmeldung Ladestation 6B',
    bodyDraft:
      'wir haben die fotos einfach ungeordnet angehängt, wichtig ist nur dass alles dokumentiert ist. unser team könnte am donnerstag kommen, ansonsten tragen wir den einsatz kommentarlos in die nächste kalenderwoche.'
  },
  {
    id: 'kongress-anmeldung',
    title: 'Freigabe Kongressanmeldung',
    company: 'MediCon Eventagentur',
    companyAddress: 'Lichtstraße 44\n50825 Köln',
    managerName: 'Franziska Juretzek',
    senderPlaceholder: 'MediCon Eventagentur · Lichtstraße 44 · 50825 Köln',
    context: [
      'Arbeitsauftrag: Du betreust die MediCon Eventagentur, Lichtstraße 44, 50825 Köln. Deine Vorgesetzte Franziska Juretzek beauftragt dich und ist über Tel. +49 221 7994-880, Fax +49 221 7994-899 oder events@medicon-koeln.de erreichbar. Empfänger ist Clinova Healthcare AG, Frau PD Dr. Heike Lüders, Stellwerkstraße 21, 20099 Hamburg.',
      'Bestätige die Kongressanmeldung, nenne Slots und Räume und fordere die Technikangaben sowie eine Rückmeldung bis zur gesetzten Frist an.'
    ],
    requirements: [
      'Slots und Räume nennen',
      'Technikfrage stellen',
      'Frist für Rückmeldung setzen'
    ],
    contactData: {
      phone: '+49 221 7994-880',
      fax: '+49 221 7994-899',
      mail: 'events@medicon-koeln.de'
    },
    references: {
      ourLetter: '23.09.20XX',
      theirLetter: '14.09.20XX',
      theirReference: 'medcongress'
    },
    recipientType: 'business',
    recipientPieces: [
      'Clinova Healthcare AG',
      'Frau PD Dr. Heike Lüders',
      'Stellwerkstraße 21',
      '20099 Hamburg'
    ],
    deliveryNote: 'Per E-Mail + Ausdruck',
    subject: 'Ihre Kongressanmeldung 20XX',
    bodyDraft:
      'wir bestätigen den slot 9:30 uhr und listen die thematik ohne überschrift auf. schicken sie uns einfach die technikanforderungen, sonst stellen wir standard mikrofone hin.'
  },
  {
    id: 'warteliste-urlaub',
    title: 'Mitteilung Warteliste Urlaubsresort',
    company: 'Bergwald Resorts GmbH',
    companyAddress: 'Talstraße 2\n82481 Mittenwald',
    managerName: 'Lena Hartwig',
    senderPlaceholder: 'Bergwald Resorts GmbH · Talstraße 2 · 82481 Mittenwald',
    context: [
      'Arbeitsauftrag: Du schreibst für Bergwald Resorts GmbH, Talstraße 2, 82481 Mittenwald. Deine Vorgesetzte Lena Hartwig übernimmt die Verantwortung und ist über Tel. +49 8823 7712-40, Fax +49 8823 7712-49 oder reservierung@bergwald-resorts.de erreichbar. Empfängerin ist Frau Katharina Möll, Seestraße 52, 80799 München.',
      'Bestätige den Wartelistenplatz im Premiumsegment, bedanke dich für das Interesse und biete alternative Termine an.'
    ],
    requirements: [
      'Danke für Interesse aussprechen',
      'Wartelistenplatz nennen',
      'Alternative Termine vorschlagen'
    ],
    contactData: {
      phone: '+49 8823 7712-40',
      fax: '+49 8823 7712-49',
      mail: 'reservierung@bergwald-resorts.de'
    },
    references: {
      ourLetter: '25.09.20XX',
      theirLetter: '21.09.20XX',
      theirReference: 'priv-bw'
    },
    recipientType: 'private',
    recipientPieces: [
      'Frau Katharina Möll',
      'Seestraße 52',
      '80799 München'
    ],
    deliveryNote: 'Standardbrief',
    subject: 'Ihr Wartelistenplatz im Bergwald',
    bodyDraft:
      'wir haben sie auf platz 3 notiert und schreiben das hier einfach so hin ohne extra absatz. wenn ein chalet frei wird melden wir uns unangekündigt telefonisch, das geht am schnellsten.'
  },
  {
    id: 'software-lizenz',
    title: 'Verlängerung Softwarelizenz',
    company: 'Newline Digital GmbH',
    companyAddress: 'Techpark 11\n44227 Dortmund',
    managerName: 'Tobias Kraft',
    senderPlaceholder: 'Newline Digital GmbH · Techpark 11 · 44227 Dortmund',
    context: [
      'Arbeitsauftrag: Du schreibst für die Newline Digital GmbH, Techpark 11, 44227 Dortmund. Dein Vorgesetzter Tobias Kraft erwartet das Angebotsschreiben und ist unter Tel. +49 231 9904-330, Fax +49 231 9904-399 oder account@nldigital.de erreichbar. Empfänger ist Connecta IT GmbH, Herrn Marco Schenk, Serverstraße 2, 33607 Bielefeld.',
      'Bestätige die Lizenzverlängerung, skizziere beide Modulvarianten und nenne den Supportkontakt.'
    ],
    requirements: [
      'Laufzeit nennen',
      'Preisstaffel kurz umreißen',
      'Supportkontakt erwähnen'
    ],
    contactData: {
      phone: '+49 231 9904-330',
      fax: '+49 231 9904-399',
      mail: 'account@nldigital.de'
    },
    references: {
      ourLetter: '28.09.20XX',
      theirLetter: '22.09.20XX',
      theirReference: 'licenseupdate'
    },
    recipientType: 'business',
    recipientPieces: [
      'Connecta IT GmbH',
      'Herrn Marco Schenk',
      'Serverstraße 2',
      '33607 Bielefeld'
    ],
    deliveryNote: 'Per E-Mail signiert',
    subject: 'Verlängerung Ihrer Lizenzen',
    bodyDraft:
      'wir verlängern einfach wie besprochen und hängen beide modulvarianten kommentarlos an. wenn sie keine rückfrage haben klickt unser system die lizenz am 01.10. selbständig frei.'
  },
  {
    id: 'umzug-filiale',
    title: 'Information Filialumzug',
    company: 'VitaCare Sanitätshaus GmbH',
    companyAddress: 'Marktplatz 9\n35390 Gießen',
    managerName: 'Heike Fröhlich',
    senderPlaceholder: 'VitaCare Sanitätshaus GmbH · Marktplatz 9 · 35390 Gießen',
    context: [
      'Arbeitsauftrag: Du informierst im Namen der VitaCare Sanitätshaus GmbH, Marktplatz 9, 35390 Gießen. Deine Vorgesetzte Heike Fröhlich koordiniert das Projekt und ist über Tel. +49 641 3377-0, Fax +49 641 3377-19 oder service@vitacare.de erreichbar. Empfänger ist Praxis Dr. Reuter, Facharzt für Orthopädie, Bahnhofstraße 4, 35037 Marburg.',
      'Teile den Filialumzug mit, nenne neue Öffnungszeiten, gib Parkhinweise und bitte darum, Rezepte künftig an die neue Adresse zu senden.'
    ],
    requirements: [
      'Neue Öffnungszeiten nennen',
      'Parkhinweise geben',
      'Bitte um Adressupdate aufnehmen'
    ],
    contactData: {
      phone: '+49 641 3377-0',
      fax: '+49 641 3377-19',
      mail: 'service@vitacare.de'
    },
    references: {
      ourLetter: '30.09.20XX',
      theirLetter: '—',
      theirReference: 'umzug-gi'
    },
    recipientType: 'business',
    recipientPieces: [
      'Praxis Dr. Reuter',
      'Facharzt für Orthopädie',
      'Bahnhofstraße 4',
      '35037 Marburg'
    ],
    deliveryNote: 'Per Post',
    subject: 'Neue Adresse Ihrer Filiale',
    bodyDraft:
      'wir ziehen zum 15. oktober um und schreiben die adresse einfach mitten in den text. bitte schicken sie rezepte sofort an den neuen standort, sonst laufen sendungen ins leere.'
  },
  {
    id: 'versicherungsnachweis',
    title: 'Anforderung Versicherungsnachweis',
    company: 'BauKontor Rhein-Main',
    companyAddress: 'Schleusenweg 3\n65462 Ginsheim-Gustavsburg',
    managerName: 'Sven Scheer',
    senderPlaceholder: 'BauKontor Rhein-Main · Schleusenweg 3 · 65462 Ginsheim-Gustavsburg',
    context: [
      'Arbeitsauftrag: Du forderst im Namen der BauKontor Rhein-Main, Schleusenweg 3, 65462 Ginsheim-Gustavsburg, den Versicherungsnachweis an. Dein Vorgesetzter Sven Scheer erwartet eine klare Anweisung und ist unter Tel. +49 6134 880-70, Fax +49 6134 880-99 oder projekte@baukontor-rm.de erreichbar. Empfänger ist SAK Bau GmbH, Herrn Pavel Kral, Werkhof 12, 65428 Rüsselsheim.',
      'Benenne die Baustelle, setze eine Frist und schildere die Konsequenz, dass ohne Nachweis kein Zugang zur Kolonne gewährt wird.'
    ],
    requirements: [
      'Baustelle nennen',
      'Frist setzen',
      'Konsequenzen benennen'
    ],
    contactData: {
      phone: '+49 6134 880-70',
      fax: '+49 6134 880-99',
      mail: 'projekte@baukontor-rm.de'
    },
    references: {
      ourLetter: '02.10.20XX',
      theirLetter: '29.09.20XX',
      theirReference: 'bk-versicherung'
    },
    recipientType: 'business',
    recipientPieces: [
      'SAK Bau GmbH',
      'Herrn Pavel Kral',
      'Werkhof 12',
      '65428 Rüsselsheim'
    ],
    deliveryNote: 'Per Bote',
    subject: 'Versicherungsnachweis Baustelle SkyLoop',
    bodyDraft:
      'wir brauchen den nachweis bis freitag und schreiben das hier ohne große ausschmückung. ohne dokument lassen wir die kolonne schlicht nicht aufs gelände, das sollte deutlich genug sein.'
  }
];
