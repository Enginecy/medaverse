"use client";

import type { Sale } from "@/features/dashboard/sales/server/db/sales";
import Image from "next/image";
import { ProductExpandContainer } from "@/features/dashboard/sales/components/expandable-container";
import { DataTile } from "@/features/dashboard/sales/components/data-tile";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion } from "@/components/ui/accordion";

export function SaleInfoDrawer({
  closeDrawer,
  selectedRow,
}: {
  closeDrawer: (value: unknown) => void;

  selectedRow: Sale;
}) {
  console.log("Selected Row:", selectedRow.products[0]?.productName);
  return (
    <SheetContent className="w-1/3 overflow-auto p-5">
      <SheetHeader>
        <SheetTitle>Sale Info</SheetTitle>
      </SheetHeader>
      <div className="flex flex-col gap-2">
        <AgentTile
          agentName={selectedRow.user.name}
          agentRole={"selectedRow.user.role"} //TODO: replace with actual role
          avatarUlr={selectedRow.user.avatar || "/public/profile.jpg"}
        />
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
        <Accordion type="multiple" className="w-full flex flex-col gap-3  ">
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

function AgentTile({
  avatarUlr,
  agentName,
  agentRole,
}: {
  avatarUlr: string;
  agentName: string;
  agentRole: string;
}) {
  return (
    <div className="flex flex-row gap-3 border-b-1 py-2">
      <Image
        src={avatarUlr}
        alt={"Agent Avatar"}
        className="rounded-full"
        width={50}
        height={50}
      />
      <div className="flex flex-col">
        <p>{agentName} </p>
        <p className="text-muted-foreground text-sm">{agentRole}</p>
      </div>
    </div>
  );
}
