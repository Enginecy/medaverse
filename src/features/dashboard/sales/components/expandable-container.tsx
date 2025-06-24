"use client";

import { DataTile } from "@/features/dashboard/sales/components/data-tile";
import type { SaleItem } from "@/features/dashboard/sales/server/db/sales";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
export function ProductExpandContainer({
  summery,
  details,
}: {
  summery: string;
  details: SaleItem;
}) {
  const [isOpen, setContainerExpand] = useState<boolean>(false);
  return (
    <AccordionItem
      value={"panel1-header" + details.policyNumber.toString()}
      className="rounded-2xl border-1 p-3 last:border-b-1 "
    >
      <AccordionTrigger
        className="font-bold focus:[text-decoration-none] p-2 hover:bg-gray-200
          hover:text-inherit hover:[text-decoration:none]
          focus:[text-decoration:none] focus-visible:border-none
          focus-visible:ring-0 "
      >
        {summery}
      </AccordionTrigger>
      <AccordionContent
        className="flex flex-col gap-4 p-2"
        aria-controls={"panel1-content " + details.productId.toString()}
        id={"panel1-header" + details.productId.toString()}
      >
        <DataTile title="Product" content={details.productName}></DataTile>
        <DataTile
          title="Premium Amount"
          content={details.premiumAmount.toString()}
        ></DataTile>
        <DataTile
          title="Policy Number"
          content={details.policyNumber}
        ></DataTile>
      </AccordionContent>
    </AccordionItem>
  );
}
