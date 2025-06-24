"use client";

import { DataTile } from "@/features/dashboard/sales/components/data-tile";
import type {  SaleItem } from "@/features/dashboard/sales/server/db/sales";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
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
    <Accordion
      className="mt-4"
      defaultExpanded={isOpen}
      onChange={(_, expanded) => {
        setContainerExpand(expanded);
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        {summery}
      </AccordionSummary>
      <AccordionDetails className="flex flex-col">
        <DataTile title="Product" content={details.productName}></DataTile>
        <DataTile title="Premium Amount" content={details.premiumAmount.toString()}></DataTile>
        <DataTile title="Policy Number" content={details.policyNumber}></DataTile>
      </AccordionDetails>
    </Accordion>
  );
}
