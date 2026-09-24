"use client";

import { useMemo, useState } from "react";
import { PackagePlus } from "lucide-react";
import { createSimpleBikeStock } from "@/app/admin/erp-actions/stock";
import { AdminForm } from "@/components/admin/admin-form.client";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-ui";
import { ChasisFields } from "./chasis-fields.client";
import { ColorFields } from "./color-fields.client";

type BrandOption = Readonly<{
  id: string;
  name: string;
}>;

const NEW_BRAND_OPTION = "__new__";

export function NewBikeModelForm({
  brands,
  existingChasisNumbers,
}: Readonly<{
  brands: readonly BrandOption[];
  existingChasisNumbers: string[];
}>) {
  const [brandValue, setBrandValue] = useState(brands[0]?.id ?? "");
  const showNewBrand = brandValue === NEW_BRAND_OPTION || brands.length === 0;
  const placeholder = useMemo(() => {
    if (!brands.length) return "Brand name";
    return showNewBrand ? "Brand name" : undefined;
  }, [brands.length, showNewBrand]);

  return (
    <AdminForm action={createSimpleBikeStock} submitLabel="Create model" pendingLabel="Creating..." className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div>
        <label className={adminLabelClass}>Brand</label>
        <select
          name="brandId"
          value={showNewBrand ? NEW_BRAND_OPTION : brandValue}
          onChange={(event) => setBrandValue(event.target.value)}
          className={adminInputClass}
        >
          {brands.length > 0 ? <option value="">Select brand</option> : null}
          {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
          <option value={NEW_BRAND_OPTION}>Add new brand</option>
        </select>
      </div>
      <div>
        <label className={adminLabelClass}>{showNewBrand ? "New brand" : "Model name"}</label>
        {showNewBrand ? (
          <input name="newBrandName" required className={adminInputClass} placeholder={placeholder} />
        ) : (
          <input name="modelName" required className={adminInputClass} placeholder="e.g. GP V3" />
        )}
      </div>
      {showNewBrand ? (
        <div className="md:col-span-2">
          <label className={adminLabelClass}>Model name</label>
          <input name="modelName" required className={adminInputClass} placeholder="e.g. GP V3" />
        </div>
      ) : null}
      <div>
        <label className={adminLabelClass}>CC</label>
        <input name="cc" required type="number" min={25} max={2500} className={adminInputClass} placeholder="250" />
      </div>
      <ColorFields idPrefix="new-bike-model" defaultColorName="Black" defaultColorHex="#111111" />
      <div>
        <label className={adminLabelClass}>Sale price, PKR</label>
        <input name="price" required type="number" min={0} step="1" className={adminInputClass} placeholder="285000" />
      </div>
      <ChasisFields existingChasisNumbers={existingChasisNumbers} />
      <div className="flex items-end rounded-md border border-[#E5E7EB] bg-[#F7F7F8] p-4 text-sm text-[#6B7280]">
        <div className="flex items-start gap-3">
          <PackagePlus aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[#C62828]" />
          <span>Creates one model with its first variant.</span>
        </div>
      </div>
    </AdminForm>
  );
}
