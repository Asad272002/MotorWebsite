"use client";

import { useMemo, useState } from "react";
import { Palette } from "lucide-react";
import { createBikeStockVariant } from "@/app/admin/erp-actions/stock";
import { AdminForm } from "@/components/admin/admin-form.client";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-ui";
import { titleCaseColorName } from "@/lib/admin/standard-colors";
import { ChasisFields } from "./chasis-fields.client";
import { ColorFields } from "./color-fields.client";

type ModelOption = Readonly<{
  id: string;
  name: string;
  brand: { id: string; name: string; slug: string };
  variant_count: number;
  template_variant: { cc: number; price: number } | null;
  existing_colors: string[];
}>;

function pkr(value: number): string {
  return "PKR " + (Number(value) || 0).toLocaleString("en-PK");
}

export function AddBikeVariantForm({
  models,
  existingChasisNumbers,
}: Readonly<{
  models: readonly ModelOption[];
  existingChasisNumbers: string[];
}>) {
  const [motorcycleId, setMotorcycleId] = useState("");
  const [colorName, setColorName] = useState("");
  const selectedModel = useMemo(() => models.find((model) => model.id === motorcycleId) ?? null, [models, motorcycleId]);
  const templateVariant = selectedModel?.template_variant ?? null;
  const normalizedColor = titleCaseColorName(colorName);
  const duplicateColor = useMemo(() => {
    if (!selectedModel || !normalizedColor) return false;
    return selectedModel.existing_colors.some((existing) => existing.toLowerCase() === normalizedColor.toLowerCase());
  }, [normalizedColor, selectedModel]);

  return (
    <AdminForm action={createBikeStockVariant} hideAutoSubmit className="grid grid-cols-1 gap-5">
      <div>
        <label className={adminLabelClass}>Existing bike</label>
        <select
          name="motorcycleId"
          required
          value={motorcycleId}
          onChange={(event) => setMotorcycleId(event.target.value)}
          className={adminInputClass}
        >
          <option value="">Select bike model</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.brand.name} - {model.name} ({model.variant_count} variant{model.variant_count === 1 ? "" : "s"})
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className={adminLabelClass}>CC</label>
          <input
            readOnly
            value={templateVariant ? `${templateVariant.cc}` : ""}
            className={`${adminInputClass} bg-[#F7F7F8] text-[#6B7280]`}
            placeholder="Select a bike first"
          />
          <p className="mt-1 text-xs text-[#6B7280]">Inherited from the selected model.</p>
        </div>
        <div>
          <label className={adminLabelClass}>Sale price, PKR</label>
          <input
            readOnly
            value={templateVariant ? `${templateVariant.price}` : ""}
            className={`${adminInputClass} bg-[#F7F7F8] text-[#6B7280]`}
            placeholder="Select a bike first"
          />
          <p className="mt-1 text-xs text-[#6B7280]">
            Using {templateVariant ? pkr(templateVariant.price) : "the selected model price"} to keep variants aligned.
          </p>
        </div>
        <ColorFields
          idPrefix="add-bike-variant"
          defaultColorHex="#C62828"
          defaultColorName=""
          colorNameField="colorName"
          colorHexField="colorHex"
          onColorNameChange={setColorName}
        />
        <ChasisFields existingChasisNumbers={existingChasisNumbers} />
        <div className="flex items-end rounded-md border border-[#E5E7EB] bg-[#F7F7F8] p-4 text-sm text-[#6B7280]">
          <div className="flex items-start gap-3">
            <Palette aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[#C62828]" />
            <span>Adds a separate sellable stock row using the selected model&apos;s existing CC and price.</span>
          </div>
        </div>
      </div>
      {duplicateColor ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[#C62828]">
          {selectedModel?.brand.name} {selectedModel?.name} already has a {normalizedColor} variant.
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!selectedModel || !templateVariant || duplicateColor}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#C62828] bg-[#C62828] px-5 text-sm font-semibold text-white transition-colors duration-200 hover:border-[#A91F1F] hover:bg-[#A91F1F] disabled:cursor-not-allowed disabled:border-[#E5E7EB] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
        >
          Add variant
        </button>
        <p className="text-xs text-[#6B7280]">
          {!selectedModel
            ? "Select a bike model to inherit its CC and sale price."
            : duplicateColor
              ? "That color already exists for this bike."
              : "CC and price are locked to the selected model&apos;s existing stock setup."}
        </p>
      </div>
    </AdminForm>
  );
}
