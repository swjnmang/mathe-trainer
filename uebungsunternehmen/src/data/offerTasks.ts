export type ProductType = 'Drucker' | 'Smartphone' | 'PC';

export interface Supplier {
  name: string;
  description: string; // Quality, Environment, Service info
}

export interface Offer {
  id: string;
  supplier: Supplier;
  price: number;
  deliveryTime: number; // in days
  warranty: number; // in years
  qualityScore: number; // 1-10 internal score for generation
  environmentScore: number; // 1-10 internal score
  serviceScore: number; // 1-10 internal score
}

export interface ComparisonTask {
  id: string;
  product: ProductType;
  offers: Offer[];
}

const SUPPLIERS = [
  { name: 'TechGiant GmbH', description: 'Marktführer, bekannt für sehr hohe Qualität und exzellenten 24/7 Support. Setzt allerdings noch teilweise auf ältere Verpackungsmaterialien.' },
  { name: 'EcoTech Solutions', description: 'Junges Unternehmen mit Fokus auf Nachhaltigkeit. CO2-neutrale Lieferung und Recycling-Programm. Der Support ist nur per E-Mail erreichbar.' },
  { name: 'BudgetHardware24', description: 'Discounter mit sehr günstigen Preisen. Die Geräte sind solide, aber der Service ist minimal. Lange Wartezeiten bei Reklamationen.' },
  { name: 'Office Partner AG', description: 'Spezialist für Büroausstattung. Bietet solide Qualität und gute Garantieleistungen. Solides Mittelmaß in allen Bereichen.' },
  { name: 'GreenGadgets', description: 'Verwendet recycelte Materialien. Die Technik ist nicht immer die allerneueste, aber sehr langlebig. Sehr umweltbewusst.' },
  { name: 'SpeedyDelivery', description: 'Fokus auf extrem schnelle Lieferung. Die Preise sind etwas höher. Qualität ist gut, aber nicht Premium.' }
];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateComparisonTask = (): ComparisonTask => {
  const products: ProductType[] = ['Drucker', 'Smartphone', 'PC'];
  const product = products[randomInt(0, 2)];
  
  // Select 3 random unique suppliers
  const shuffledSuppliers = [...SUPPLIERS].sort(() => 0.5 - Math.random());
  const selectedSuppliers = shuffledSuppliers.slice(0, 3);

  const offers: Offer[] = selectedSuppliers.map((supplier, index) => {
    let basePrice = 0;
    if (product === 'Drucker') basePrice = 300;
    if (product === 'Smartphone') basePrice = 600;
    if (product === 'PC') basePrice = 1200;

    // Adjust price based on supplier "vibe" (simple heuristic based on name/desc)
    let priceMod = 1;
    let quality = randomInt(5, 9);
    let env = randomInt(4, 8);
    let service = randomInt(4, 8);

    if (supplier.name.includes('Budget')) { priceMod = 0.8; quality = 4; service = 2; }
    if (supplier.name.includes('TechGiant')) { priceMod = 1.3; quality = 10; service = 9; }
    if (supplier.name.includes('Eco') || supplier.name.includes('Green')) { priceMod = 1.1; env = 10; }

    return {
      id: `offer-${index}`,
      supplier,
      price: Math.round(basePrice * priceMod * (randomInt(90, 110) / 100)),
      deliveryTime: randomInt(1, 14),
      warranty: randomInt(1, 3),
      qualityScore: quality,
      environmentScore: env,
      serviceScore: service
    };
  });

  return {
    id: Date.now().toString(),
    product,
    offers
  };
};
