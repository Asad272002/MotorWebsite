"use client";

import { useId, useMemo, useState } from "react";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-ui";
import { STANDARD_BIKE_COLORS, findStandardColorByHex, findStandardColorByName } from "@/lib/admin/standard-colors";

export function ColorFields({
  colorNameField = "colorName",
  colorHexField = "colorHex",
  defaultColorName = "",
  defaultColorHex = "#111111",
  idPrefix,
  onColorNameChange,
  onColorHexChange,
}: Readonly<{
  colorNameField?: string;
  colorHexField?: string;
  defaultColorName?: string;
  defaultColorHex?: string;
  idPrefix?: string;
  onColorNameChange?: (value: string) => void;
  onColorHexChange?: (value: string) => void;
}>) {
  const reactId = useId();
  const listId = `${idPrefix ?? reactId}-standard-bike-colors`;
  const [colorName, setColorName] = useState(defaultColorName);
  const [colorHex, setColorHex] = useState(defaultColorHex.toUpperCase());
  const [lastSuggestedName, setLastSuggestedName] = useState<string | null>(
    findStandardColorByName(defaultColorName)?.name ?? findStandardColorByHex(defaultColorHex)?.name ?? null,
  );

  const suggested = useMemo(() => {
    return findStandardColorByName(colorName) ?? findStandardColorByHex(colorHex) ?? null;
  }, [colorHex, colorName]);

  function applySuggestion() {
    if (!suggested) return;
    setColorName(suggested.name);
    setColorHex(suggested.hex);
    setLastSuggestedName(suggested.name);
    onColorNameChange?.(suggested.name);
    onColorHexChange?.(suggested.hex);
  }

  return (
    <>
      <div>
        <label className={adminLabelClass}>Color</label>
        <input
          name={colorNameField}
          required
          value={colorName}
          list={listId}
          onChange={(event) => {
            const next = event.target.value;
            setColorName(next);
            onColorNameChange?.(next);
            const matched = findStandardColorByName(next);
            if (matched) {
              setColorHex(matched.hex);
              setLastSuggestedName(matched.name);
              onColorHexChange?.(matched.hex);
            }
          }}
          className={adminInputClass}
          placeholder="Red"
        />
        <datalist id={listId}>
          {STANDARD_BIKE_COLORS.map((color) => (
            <option key={color.name} value={color.name} />
          ))}
        </datalist>
      </div>
      <div>
        <label className={adminLabelClass}>Color swatch</label>
        <input
          name={colorHexField}
          required
          type="color"
          value={colorHex}
          onChange={(event) => {
            const next = event.target.value.toUpperCase();
            setColorHex(next);
            onColorHexChange?.(next);
            const matched = findStandardColorByHex(next);
            if (matched && (!colorName.trim() || colorName === lastSuggestedName)) {
              setColorName(matched.name);
              setLastSuggestedName(matched.name);
              onColorNameChange?.(matched.name);
            }
          }}
          className="mt-2 h-11 w-full rounded-md border border-[#D1D5DB] bg-white p-1"
        />
        {suggested ? (
          <p className="mt-1 text-xs text-[#6B7280]">
            Suggestion:{" "}
            <button type="button" onClick={applySuggestion} className="font-semibold text-[#C62828] underline underline-offset-2">
              {suggested.name}
            </button>
          </p>
        ) : null}
      </div>
    </>
  );
}
