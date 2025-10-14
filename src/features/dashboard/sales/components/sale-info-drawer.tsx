"use client";

import type { Sale } from "@/features/dashboard/sales/server/db/sales";
import { ProductExpandContainer } from "@/features/dashboard/sales/components/expandable-container";
import { DataTile } from "@/features/dashboard/sales/components/data-tile";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion } from "@/components/ui/accordion";
import { UserChip } from "@/features/dashboard/admin-settings/components/ui/user-chip";

export function SaleInfoDrawer({
  // closeDrawer,
  selectedRow,
}: {
  // closeDrawer: (value: unknown) => void;

  selectedRow: Sale;
}) {
  return (
    <SheetContent className="overflow-auto p-5">
      <SheetHeader>
        <SheetTitle>Sale Info</SheetTitle>
      </SheetHeader>
      <div className="flex flex-col gap-2">
        <UserChip user={selectedRow.user} size="sm" />
        <DataTile title="Client Name" content={selectedRow.customerName} />
        <DataTile
          title="Submitted Date"
          content={selectedRow.saleDate.toDateString()}
        />
        <DataTile title="Zip" content="12345" />
        {/* TODO: replace with actual zip code */}
        <DataTile
          title="Total premiums"
          content={selectedRow.totalAmount!.toString()}
        />
        {/* TODO: replace with actual total premiums code */}
        <Accordion type="multiple" className="flex w-full flex-col gap-3">
          {selectedRow.products.map((product) => (
            <ProductExpandContainer
              key={product.policyNumber}
              summery={`${selectedRow.customerName} - ${product.productName}`}
              details={product}
            />
          ))}
        </Accordion>
      </div>
    </SheetContent>
  );
}
