import Link from "next/link";
import { Layers } from "lucide-react";
import { AdminEmptyState, AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { listMotorcycleStockUnitsForStock, listSaleHistoryChasisNumbers, listStockBrands, listStockMotorcycleModels } from "@/lib/erp/queries";
import { getAuthenticatedProfile } from "@/lib/supabase/auth";
import { AddBikeVariantForm } from "./add-bike-variant-form.client";
import { NewBikeModelForm } from "./new-bike-model-form.client";

export const metadata = { title: "Add Bike Stock" };

export default async function AddBikeStockPage() {
  const actor = await getAuthenticatedProfile();
  const role = actor?.profile.role ?? "apprentice";
  const allowed = ["developer", "admin", "manager"].includes(role);
  const [brands, models, stockUnits, saleHistoryChasisNumbers] = allowed ? await Promise.all([listStockBrands(), listStockMotorcycleModels(), listMotorcycleStockUnitsForStock(), listSaleHistoryChasisNumbers()]) : [[], [], [], []];
  const existingChasisNumbers = Array.from(new Set([...(stockUnits as readonly { chasis_number?: string | null }[]).map((unit) => unit.chasis_number ?? ""), ...(saleHistoryChasisNumbers as string[])].map((item) => String(item).trim().toUpperCase()).filter(Boolean)));

  if (!allowed) {
    return <AdminEmptyState title="Not available" description="Your role can check stock, but cannot add bike stock records." action={<Link href="/admin/stock/availability" className="ow-button-primary">Back to stock</Link>} />;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Stock Management"
        title="Add Bike Stock"
        description="Create a model once, then add every CC and color as a separate stock variant."
        actions={<Link href="/admin/stock/availability" className="inline-flex min-h-11 items-center rounded-md border border-[#D1D5DB] bg-white px-4 text-sm font-semibold text-[#374151] hover:bg-[#F7F7F8]">Back to stock</Link>}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.78fr)]">
        <AdminPanel title="New bike model" description="Use this once for a model that does not exist yet.">
          <NewBikeModelForm brands={brands} existingChasisNumbers={existingChasisNumbers} />
        </AdminPanel>

        <AdminPanel title="Add color / CC" description="Use this for more variants of an existing model.">
          {models.length === 0 ? (
            <div className="flex min-h-52 items-center justify-center rounded-md border border-dashed border-[#D1D5DB] bg-[#FAFAFA] p-6 text-center">
              <div>
                <Layers aria-hidden className="mx-auto h-8 w-8 text-[#9CA3AF]" />
                <p className="mt-3 text-sm font-semibold text-[#374151]">Create a model first.</p>
              </div>
            </div>
          ) : (
            <AddBikeVariantForm models={models} existingChasisNumbers={existingChasisNumbers} />
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
