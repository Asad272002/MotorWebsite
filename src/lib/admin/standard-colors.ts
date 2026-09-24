export type StandardColor = Readonly<{
  name: string;
  hex: `#${string}`;
  aliases?: readonly string[];
}>;

export const STANDARD_BIKE_COLORS: readonly StandardColor[] = [
  { name: "Black", hex: "#111111", aliases: ["Jet Black", "Matte Black"] },
  { name: "White", hex: "#F5F5F5", aliases: ["Pearl White"] },
  { name: "Red", hex: "#C62828", aliases: ["Crimson", "Cherry Red"] },
  { name: "Blue", hex: "#1565C0", aliases: ["Navy Blue", "Deep Blue"] },
  { name: "Green", hex: "#2E7D32", aliases: ["Racing Green"] },
  { name: "Yellow", hex: "#F9A825", aliases: ["Sun Yellow"] },
  { name: "Orange", hex: "#EF6C00", aliases: ["Burnt Orange"] },
  { name: "Silver", hex: "#9CA3AF", aliases: ["Metallic Silver"] },
  { name: "Gray", hex: "#6B7280", aliases: ["Grey", "Gunmetal"] },
  { name: "Maroon", hex: "#800000", aliases: ["Wine Red"] },
  { name: "Brown", hex: "#8D6E63", aliases: ["Chocolate Brown"] },
];

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
}

function normalizeHex(value: string): string {
  return value.trim().toUpperCase();
}

export function titleCaseColorName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function findStandardColorByName(value: string): StandardColor | null {
  const target = normalize(value);
  if (!target) return null;
  return STANDARD_BIKE_COLORS.find((color) =>
    normalize(color.name) === target || color.aliases?.some((alias) => normalize(alias) === target),
  ) ?? null;
}

export function findStandardColorByHex(value: string): StandardColor | null {
  const target = normalizeHex(value);
  return STANDARD_BIKE_COLORS.find((color) => normalizeHex(color.hex) === target) ?? null;
}

export function canonicalizeBikeColor(colorName: string, colorHex: string): { colorName: string; colorHex: string } {
  const byName = findStandardColorByName(colorName);
  if (byName) {
    return { colorName: byName.name, colorHex: byName.hex };
  }

  const byHex = findStandardColorByHex(colorHex);
  if (byHex) {
    return { colorName: byHex.name, colorHex: byHex.hex };
  }

  return {
    colorName: titleCaseColorName(colorName),
    colorHex: normalizeHex(colorHex),
  };
}
