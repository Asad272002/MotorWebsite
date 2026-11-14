export function productDisplayName(brandName: string, modelName: string) {
  const brand = brandName.trim();
  const model = modelName.trim();
  const normalizedBrand = brand.toLocaleLowerCase();
  const normalizedModel = model.toLocaleLowerCase();
  return normalizedModel === normalizedBrand || normalizedModel.startsWith(`${normalizedBrand} `)
    ? model
    : `${brand} ${model}`;
}

export function dedupeRepeatedSentences(value: string) {
  const sentences = value.trim().split(/(?<=[.!?])\s+/).filter(Boolean);
  const seen = new Set<string>();
  return sentences.filter((sentence) => {
    const key = sentence.toLocaleLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).join(" ");
}
