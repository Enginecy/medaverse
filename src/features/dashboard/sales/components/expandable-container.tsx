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
      className="border-b last:border-b-0"
    >
      <AccordionTrigger>{summery}</AccordionTrigger>
      <AccordionContent
        className="flex flex-col"
        aria-controls={"panel1-content" + details.productId.toString()}
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
