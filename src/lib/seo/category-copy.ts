const CATEGORY_COPY: Readonly<Record<string, { title: string; description: string }>> = {
  "sport-bikes": { title: "Sport Motorcycles in Pakistan", description: "Compare sport motorcycles available through OW Motors, including engine options, colors, current prices, and detailed specifications." },
  "street-bikes": { title: "Street Motorcycles in Pakistan", description: "Explore street motorcycles for everyday riding, with current OW Motors pricing, available colors, engine options, and specifications." },
  cruisers: { title: "Cruiser Motorcycles in Pakistan", description: "Browse cruiser motorcycles available through OW Motors and compare their engine sizes, colors, prices, and touring-focused specifications." },
  adventure: { title: "Adventure Motorcycles in Pakistan", description: "Compare adventure motorcycles at OW Motors, including touring equipment, engine options, available colors, prices, and specifications." },
  replicas: { title: "Replica Motorcycles in Pakistan", description: "Explore replica-style motorcycles at OW Motors with dedicated engine, braking, color, price, and specification options." },
};

export function categoryMetadataCopy(slug: string, name: string) {
  return CATEGORY_COPY[slug] ?? { title: `${name} at OW Motors`, description: `Compare ${name.toLowerCase()} available through OW Motors, including current prices, colors, engine options, and specifications.` };
}
