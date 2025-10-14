"use client";

import { DataTile } from "@/features/dashboard/sales/components/data-tile";
import type { SaleItem } from "@/features/dashboard/sales/server/db/sales";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export function ProductExpandContainer({
  summery,
  details,
}: {
  summery: string;
  details: SaleItem;
}) {
  return (
    <AccordionItem
      value={"panel1-header" + details.policyNumber.toString()}
      className="rounded-2xl border-1 p-3 last:border-b-1"
    >
      <AccordionTrigger
        className="focus:[text-decoration-none] p-2 font-bold hover:bg-gray-200
          hover:text-inherit hover:[text-decoration:none]
          focus:[text-decoration:none] focus-visible:border-none
          focus-visible:ring-0"
      >
        {summery}
      </AccordionTrigger>
      <AccordionContent
        className="flex flex-col gap-4 p-2"
        aria-controls={"panel1-content " + details.policyNumber.toString()}
        id={"panel1-header" + details.policyNumber.toString()}
      >
        <DataTile title="Product" content={details.productName} />
        <DataTile
          title="Premium Amount"
          content={details.premiumAmount.toString()}
        />
        <DataTile title="Policy Number" content={details.policyNumber} />
      </AccordionContent>
    </AccordionItem>
  );
}
