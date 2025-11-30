export interface AddressExercise {
  id: string;
  category: 'Privat' | 'Geschäftlich';
  title: string;
  task: string;
  solution: string[]; // 6 lines
  hints: string[];
}

export const addressTasks: AddressExercise[] = [
  // --- PRIVAT (15 Aufgaben) ---
  {
    id: 'p-01',
    category: 'Privat',
    title: 'Privatbrief an Herrn Müller',
    task: 'Sende einen Brief an Herrn Thomas Müller, der in der Goethestraße 12 in 20095 Hamburg wohnt.',
    solution: ['Herrn', 'Thomas Müller', 'Goethestraße 12', '20095 Hamburg', '', ''],
    hints: ['Anrede in Zeile 1', 'Name in Zeile 2', 'Straße in Zeile 3', 'PLZ/Ort in Zeile 4']
  },
  {
    id: 'p-02',
    category: 'Privat',
    title: 'Privatbrief an Frau Klein',
    task: 'Adressiere an Frau Sabine Klein, wohnhaft am Lindenring 44 in 80331 München.',
    solution: ['Frau', 'Sabine Klein', 'Lindenring 44', '80331 München', '', ''],
    hints: ['Anrede in Zeile 1', 'Name in Zeile 2', 'Straße in Zeile 3', 'PLZ/Ort in Zeile 4']
  },
  {
    id: 'p-03',
    category: 'Privat',
    title: 'Eheleute anschreiben',
    task: 'Schreibe an das Ehepaar Hans und Grete Lustig. Sie wohnen im Tulpenweg 3 in 12345 Berlin.',
    solution: ['Eheleute', 'Hans und Grete Lustig', 'Tulpenweg 3', '12345 Berlin', '', ''],
    hints: ['Anrede "Eheleute" oder "Herrn und Frau"', 'Namen in Zeile 2']
  },
  {
    id: 'p-04',
    category: 'Privat',
    title: 'Familie anschreiben',
    task: 'Ein Brief für Familie Sommer, wohnhaft in der Badstraße 9, 70173 Stuttgart.',
    solution: ['Familie', 'Sommer', 'Badstraße 9', '70173 Stuttgart', '', ''],
    hints: ['Anrede "Familie" in Zeile 1', 'Nachname in Zeile 2']
  },
  {
    id: 'p-05',
    category: 'Privat',
    title: 'Herrn Dr. Arzt',
    task: 'Adressiere an Herrn Dr. med. Klaus Riemer, Parkallee 55, 28209 Bremen.',
    solution: ['Herrn', 'Dr. med. Klaus Riemer', 'Parkallee 55', '28209 Bremen', '', ''],
    hints: ['Doktortitel gehört zum Namen']
  },
  {
    id: 'p-06',
    category: 'Privat',
    title: 'Frau Professorin',
    task: 'Schreibe an Frau Prof. Dr. Maria Schmidt, Uniplatz 1, 69117 Heidelberg.',
    solution: ['Frau', 'Prof. Dr. Maria Schmidt', 'Uniplatz 1', '69117 Heidelberg', '', ''],
    hints: ['Titel gehören zum Namen']
  },
  {
    id: 'p-07',
    category: 'Privat',
    title: 'Anwalt privat',
    task: 'Herr Peter Recht (Rechtsanwalt) soll privat angeschrieben werden. Adresse: Kanzleistraße 2, 40213 Düsseldorf.',
    solution: ['Herrn', 'Rechtsanwalt Peter Recht', 'Kanzleistraße 2', '40213 Düsseldorf', '', ''],
    hints: ['Berufsbezeichnung kann im Namen stehen']
  },
  {
    id: 'p-08',
    category: 'Privat',
    title: 'Wohnung mit c/o',
    task: 'Schreibe an Herrn Jan Kurz, der bei Frau Lang wohnt (c/o). Adresse: Hauptstr. 10, 50667 Köln.',
    solution: ['Herrn Jan Kurz', 'c/o Frau Lang', 'Hauptstr. 10', '50667 Köln', '', ''],
    hints: ['Empfänger in Zeile 1', 'c/o Vermerk in Zeile 2']
  },
  {
    id: 'p-09',
    category: 'Privat',
    title: 'Appartement Nummer',
    task: 'Frau Lisa Berg, Sonnenallee 100, App. 402, 12045 Berlin.',
    solution: ['Frau', 'Lisa Berg', 'Sonnenallee 100 // App. 402', '12045 Berlin', '', ''],
    hints: ['Wohnungsnummer mit // abtrennen oder in Zusatzzeile (hier Anschriftzone)']
  },
  {
    id: 'p-10',
    category: 'Privat',
    title: 'Postfach privat',
    task: 'Herr Karl Post nutzt das Postfach 1234 in 01099 Dresden.',
    solution: ['Herrn', 'Karl Post', 'Postfach 12 34', '01099 Dresden', '', ''],
    hints: ['Postfach statt Straße', 'Postfachnummer von rechts gliedern']
  },
  {
    id: 'p-11',
    category: 'Privat',
    title: 'Zwei Vornamen',
    task: 'Frau Anna-Maria Zimmermann, Blumenweg 8, 99084 Erfurt.',
    solution: ['Frau', 'Anna-Maria Zimmermann', 'Blumenweg 8', '99084 Erfurt', '', ''],
    hints: ['Bindestrich-Namen ausschreiben']
  },
  {
    id: 'p-12',
    category: 'Privat',
    title: 'Adliger Name',
    task: 'Herrn Graf von Zahl, Schlossallee 1, 10117 Berlin.',
    solution: ['Herrn', 'Graf von Zahl', 'Schlossallee 1', '10117 Berlin', '', ''],
    hints: ['Adelstitel ist Teil des Namens']
  },
  {
    id: 'p-13',
    category: 'Privat',
    title: 'Langer Straßenname',
    task: 'Frau Ute Lang, Bürgermeister-Smidt-Straße 120, 27568 Bremerhaven.',
    solution: ['Frau', 'Ute Lang', 'Bürgermeister-Smidt-Straße 120', '27568 Bremerhaven', '', ''],
    hints: ['Lange Straßennamen ausschreiben wenn möglich']
  },
  {
    id: 'p-14',
    category: 'Privat',
    title: 'Ortsteil',
    task: 'Herrn Max Moritz, Dorfstraße 5, 24103 Kiel (Ortsteil Pries).',
    solution: ['Herrn', 'Max Moritz', 'Dorfstraße 5', '24103 Kiel', '', ''],
    hints: ['Ortsteil wird in der Anschriftzone meist weggelassen, PLZ reicht']
  },
  {
    id: 'p-15',
    category: 'Privat',
    title: 'Ausland privat',
    task: 'Herr John Smith, 10 Downing Street, London SW1A 2AA, Großbritannien.',
    solution: ['Herrn', 'John Smith', '10 Downing Street', 'London SW1A 2AA', 'GROSSBRITANNIEN', ''],
    hints: ['Bestimmungsland in Großbuchstaben in letzte Zeile']
  },

  // --- GESCHÄFTLICH (35 Aufgaben) ---
  {
    id: 'b-01',
    category: 'Geschäftlich',
    title: 'Einfache Firmenadresse',
    task: 'Schreibe an die Müller GmbH, Industriestraße 5, 44137 Dortmund.',
    solution: ['Müller GmbH', 'Industriestraße 5', '44137 Dortmund', '', '', ''],
    hints: ['Firmenname Zeile 1', 'Straße Zeile 2', 'Ort Zeile 3']
  },
  {
    id: 'b-02',
    category: 'Geschäftlich',
    title: 'Firma mit Rechtsform',
    task: 'An die "Bäckerei Schmidt e.K.", Hauptstraße 10, 50667 Köln.',
    solution: ['Bäckerei Schmidt e.K.', 'Hauptstraße 10', '50667 Köln', '', '', ''],
    hints: ['Rechtsform gehört zum Namen']
  },
  {
    id: 'b-03',
    category: 'Geschäftlich',
    title: 'Firma mit Ansprechpartner (Herr)',
    task: 'An die TechSoft AG, Herrn Peter Meier, Digitalweg 1, 10115 Berlin.',
    solution: ['TechSoft AG', 'Herrn Peter Meier', 'Digitalweg 1', '10115 Berlin', '', ''],
    hints: ['Firma Zeile 1', 'Ansprechpartner Zeile 2']
  },
  {
    id: 'b-04',
    category: 'Geschäftlich',
    title: 'Firma mit Ansprechpartner (Frau)',
    task: 'An die Logistik Express GmbH, Frau Sabine Schnell, Frachtstraße 9, 20457 Hamburg.',
    solution: ['Logistik Express GmbH', 'Frau Sabine Schnell', 'Frachtstraße 9', '20457 Hamburg', '', ''],
    hints: ['Firma Zeile 1', 'Ansprechpartner Zeile 2']
  },
  {
    id: 'b-05',
    category: 'Geschäftlich',
    title: 'Firma mit Abteilung',
    task: 'An die Bauunion GmbH, Abteilung Einkauf, Mauerweg 3, 04109 Leipzig.',
    solution: ['Bauunion GmbH', 'Abteilung Einkauf', 'Mauerweg 3', '04109 Leipzig', '', ''],
    hints: ['Firma Zeile 1', 'Abteilung Zeile 2']
  },
  {
    id: 'b-06',
    category: 'Geschäftlich',
    title: 'Firma, Abteilung, Person',
    task: 'An die Mediengruppe West, Personalabteilung, Frau Weber, Medienhafen 1, 40221 Düsseldorf.',
    solution: ['Mediengruppe West', 'Personalabteilung', 'Frau Weber', 'Medienhafen 1', '40221 Düsseldorf', ''],
    hints: ['Firma Z1', 'Abteilung Z2', 'Person Z3']
  },
  {
    id: 'b-07',
    category: 'Geschäftlich',
    title: 'Postfach Firma',
    task: 'Versicherung AG, Postfach 40 50 60, 80331 München.',
    solution: ['Versicherung AG', 'Postfach 40 50 60', '80331 München', '', '', ''],
    hints: ['Postfach statt Straße', 'Gliederung von rechts']
  },
  {
    id: 'b-08',
    category: 'Geschäftlich',
    title: 'Postfach mit Person',
    task: 'Bankhaus Reiche, Herrn Direktor Geld, Postfach 100, 60311 Frankfurt.',
    solution: ['Bankhaus Reiche', 'Herrn Direktor Geld', 'Postfach 100', '60311 Frankfurt', '', ''],
    hints: ['Person vor Postfach']
  },
  {
    id: 'b-09',
    category: 'Geschäftlich',
    title: 'Behörde',
    task: 'An das Finanzamt Mitte, Steuerstelle, Steuermannstraße 1, 10179 Berlin.',
    solution: ['Finanzamt Mitte', 'Steuerstelle', 'Steuermannstraße 1', '10179 Berlin', '', ''],
    hints: ['Behördenname Z1', 'Abteilung Z2']
  },
  {
    id: 'b-10',
    category: 'Geschäftlich',
    title: 'Stadtverwaltung',
    task: 'Stadtverwaltung Musterstadt, Bauamt, Rathausplatz 1, 12345 Musterstadt.',
    solution: ['Stadtverwaltung Musterstadt', 'Bauamt', 'Rathausplatz 1', '12345 Musterstadt', '', ''],
    hints: []
  },
  {
    id: 'b-11',
    category: 'Geschäftlich',
    title: 'Langer Firmenname',
    task: 'An die "Gesellschaft für internationale Zusammenarbeit und Entwicklung mbH", Tor 1, 53113 Bonn.',
    solution: ['Gesellschaft für internationale', 'Zusammenarbeit und Entwicklung mbH', 'Tor 1', '53113 Bonn', '', ''],
    hints: ['Lange Namen sinnvoll umbrechen']
  },
  {
    id: 'b-12',
    category: 'Geschäftlich',
    title: 'Firma im Ausland',
    task: 'TechCorp Inc., 500 Silicon Drive, Palo Alto, CA 94301, USA.',
    solution: ['TechCorp Inc.', '500 Silicon Drive', 'Palo Alto, CA 94301', 'VEREINIGTE STAATEN VON AMERIKA', '', ''],
    hints: ['Land in Großbuchstaben (deutsch)', 'USA = VEREINIGTE STAATEN...']
  },
  {
    id: 'b-13',
    category: 'Geschäftlich',
    title: 'Firma Österreich',
    task: 'Alpenmilch AG, Dorfplatz 1, 6020 Innsbruck, Österreich.',
    solution: ['Alpenmilch AG', 'Dorfplatz 1', '6020 Innsbruck', 'ÖSTERREICH', '', ''],
    hints: ['Land in Großbuchstaben']
  },
  {
    id: 'b-14',
    category: 'Geschäftlich',
    title: 'Firma Schweiz',
    task: 'Uhrenmanufaktur AG, Zeitweg 12, 8001 Zürich, Schweiz.',
    solution: ['Uhrenmanufaktur AG', 'Zeitweg 12', '8001 Zürich', 'SCHWEIZ', '', ''],
    hints: ['Land in Großbuchstaben']
  },
  {
    id: 'b-15',
    category: 'Geschäftlich',
    title: 'Anwaltskanzlei',
    task: 'Kanzlei Müller & Partner, Rechtsanwälte, Gerichtsweg 5, 20354 Hamburg.',
    solution: ['Kanzlei Müller & Partner', 'Rechtsanwälte', 'Gerichtsweg 5', '20354 Hamburg', '', ''],
    hints: ['Berufsbezeichnung kann eigene Zeile sein']
  },
  {
    id: 'b-16',
    category: 'Geschäftlich',
    title: 'Arztpraxis',
    task: 'Gemeinschaftspraxis Dr. A und Dr. B, Heilweg 10, 70174 Stuttgart.',
    solution: ['Gemeinschaftspraxis', 'Dr. A und Dr. B', 'Heilweg 10', '70174 Stuttgart', '', ''],
    hints: ['Name aufteilen wenn zu lang']
  },
  {
    id: 'b-17',
    category: 'Geschäftlich',
    title: 'Hotel',
    task: 'Hotel zur Post, Rezeption, Markt 1, 99423 Weimar.',
    solution: ['Hotel zur Post', 'Rezeption', 'Markt 1', '99423 Weimar', '', ''],
    hints: ['Abteilung (Rezeption) Z2']
  },
  {
    id: 'b-18',
    category: 'Geschäftlich',
    title: 'Schule',
    task: 'Goethe-Gymnasium, Sekretariat, Schulstraße 1, 60385 Frankfurt.',
    solution: ['Goethe-Gymnasium', 'Sekretariat', 'Schulstraße 1', '60385 Frankfurt', '', ''],
    hints: []
  },
  {
    id: 'b-19',
    category: 'Geschäftlich',
    title: 'Verein',
    task: 'Sportverein 1899 e.V., Vorstand, Sportplatz 1, 12345 Musterstadt.',
    solution: ['Sportverein 1899 e.V.', 'Vorstand', 'Sportplatz 1', '12345 Musterstadt', '', ''],
    hints: []
  },
  {
    id: 'b-20',
    category: 'Geschäftlich',
    title: 'Firma mit Untertitel',
    task: 'WebDesign GmbH - Agentur für neue Medien, Pixelweg 8, 10119 Berlin.',
    solution: ['WebDesign GmbH', 'Agentur für neue Medien', 'Pixelweg 8', '10119 Berlin', '', ''],
    hints: ['Untertitel in Zeile 2']
  },
  {
    id: 'b-21',
    category: 'Geschäftlich',
    title: 'Großkunde Postleitzahl',
    task: 'Versandhaus Quelle, 90762 Fürth (Großkunden-PLZ, keine Straße nötig).',
    solution: ['Versandhaus Quelle', '90762 Fürth', '', '', '', ''],
    hints: ['Bei Großkunden-PLZ entfällt die Straße']
  },
  {
    id: 'b-22',
    category: 'Geschäftlich',
    title: 'Firma z. Hd. (veraltet)',
    task: 'Meier AG, z. Hd. Herrn Müller (Hinweis: z. Hd. ist veraltet!), Werkstraße 1, 50670 Köln.',
    solution: ['Meier AG', 'Herrn Müller', 'Werkstraße 1', '50670 Köln', '', ''],
    hints: ['"z. Hd." wird nicht mehr geschrieben']
  },
  {
    id: 'b-23',
    category: 'Geschäftlich',
    title: 'Firma Ansprechpartner Titel',
    task: 'Chemie AG, Frau Dr. Sauer, Laborweg 2, 67059 Ludwigshafen.',
    solution: ['Chemie AG', 'Frau Dr. Sauer', 'Laborweg 2', '67059 Ludwigshafen', '', ''],
    hints: []
  },
  {
    id: 'b-24',
    category: 'Geschäftlich',
    title: 'Firma zwei Ansprechpartner',
    task: 'Kanzlei Recht & Ordnung, Herrn Recht und Frau Ordnung, Justizweg 1, 20355 Hamburg.',
    solution: ['Kanzlei Recht & Ordnung', 'Herrn Recht und Frau Ordnung', 'Justizweg 1', '20355 Hamburg', '', ''],
    hints: ['Beide Namen in eine Zeile wenn möglich']
  },
  {
    id: 'b-25',
    category: 'Geschäftlich',
    title: 'Firma Gebäude',
    task: 'StartUp Hub, Gebäude C, Etage 4, Innovation Road 1, 10115 Berlin.',
    solution: ['StartUp Hub', 'Gebäude C // Etage 4', 'Innovation Road 1', '10115 Berlin', '', ''],
    hints: ['Gebäudeteile mit // trennen oder Zusatzzeile']
  },
  {
    id: 'b-26',
    category: 'Geschäftlich',
    title: 'Firma c/o',
    task: 'Projekt X, c/o Inkubator GmbH, Startplatz 1, 50672 Köln.',
    solution: ['Projekt X', 'c/o Inkubator GmbH', 'Startplatz 1', '50672 Köln', '', ''],
    hints: []
  },
  {
    id: 'b-27',
    category: 'Geschäftlich',
    title: 'Firma Frankreich',
    task: 'Mode Parisienne, 10 Rue de la Mode, 75001 Paris, Frankreich.',
    solution: ['Mode Parisienne', '10 Rue de la Mode', '75001 Paris', 'FRANKREICH', '', ''],
    hints: ['Land in Großbuchstaben']
  },
  {
    id: 'b-28',
    category: 'Geschäftlich',
    title: 'Firma Italien',
    task: 'Pasta S.r.l., Via Roma 1, 00184 Roma, Italien.',
    solution: ['Pasta S.r.l.', 'Via Roma 1', '00184 Roma', 'ITALIEN', '', ''],
    hints: []
  },
  {
    id: 'b-29',
    category: 'Geschäftlich',
    title: 'Firma Spanien',
    task: 'Sol y Mar S.A., Calle Mayor 1, 28013 Madrid, Spanien.',
    solution: ['Sol y Mar S.A.', 'Calle Mayor 1', '28013 Madrid', 'SPANIEN', '', ''],
    hints: []
  },
  {
    id: 'b-30',
    category: 'Geschäftlich',
    title: 'Firma Niederlande',
    task: 'Handel B.V., Gracht 1, 1011 Amsterdam, Niederlande.',
    solution: ['Handel B.V.', 'Gracht 1', '1011 Amsterdam', 'NIEDERLANDE', '', ''],
    hints: []
  },
  {
    id: 'b-31',
    category: 'Geschäftlich',
    title: 'Firma Polen',
    task: 'Firma Polska Sp. z o.o., Ul. Dluga 1, 00-001 Warszawa, Polen.',
    solution: ['Firma Polska Sp. z o.o.', 'Ul. Dluga 1', '00-001 Warszawa', 'POLEN', '', ''],
    hints: []
  },
  {
    id: 'b-32',
    category: 'Geschäftlich',
    title: 'Autohaus',
    task: 'Autohaus Schnell, Werkstattannahme, Dieselstraße 4, 70469 Stuttgart.',
    solution: ['Autohaus Schnell', 'Werkstattannahme', 'Dieselstraße 4', '70469 Stuttgart', '', ''],
    hints: []
  },
  {
    id: 'b-33',
    category: 'Geschäftlich',
    title: 'Spedition',
    task: 'Spedition Last & Kraft, Dispo, LKW-Weg 9, 21129 Hamburg.',
    solution: ['Spedition Last & Kraft', 'Dispo', 'LKW-Weg 9', '21129 Hamburg', '', ''],
    hints: []
  },
  {
    id: 'b-34',
    category: 'Geschäftlich',
    title: 'Verlag',
    task: 'Buchverlag Wortreich, Lektorat, Buchgasse 1, 04103 Leipzig.',
    solution: ['Buchverlag Wortreich', 'Lektorat', 'Buchgasse 1', '04103 Leipzig', '', ''],
    hints: []
  },
  {
    id: 'b-35',
    category: 'Geschäftlich',
    title: 'Werbeagentur',
    task: 'Kreativbude, Art Direction, Buntstiftweg 3, 10999 Berlin.',
    solution: ['Kreativbude', 'Art Direction', 'Buntstiftweg 3', '10999 Berlin', '', ''],
    hints: []
  }
];
