"use client";

import { Button } from "@/components/ui/button";
import type { Sale } from "@/features/dashboard/sales/server/db/sales";
import Drawer from "@mui/material/Drawer";
import Image from "next/image";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { ProductExpandContainer } from "@/features/dashboard/sales/components/expandable-container";
import { DataTile } from "@/features/dashboard/sales/components/data-tile";

export function SaleInfoDrawer({
  drawerOpen,
  setDrawerOpen,
  selectedRow,
}: {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  selectedRow: Sale;
}) {
  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <div style={{ width: 400, padding: 16 }}>
        <p className="text-sm font-bold">Sale Info</p>
        {selectedRow ? (
          <div className="flex flex-col gap-2">
            <AgentTile
              agentName="ORANGE"
              agentRole="President"
              avatarUlr="https://axdfmmwtobzrqbdcikrt.supabase.co/storage/v1/object/public/profile-images/b66f7120-38ac-4805-8e87-40e070108566/avatar.jpg"
            />
            <DataTile title="Client Name" content={selectedRow.customerName} />
            <DataTile
              title="Submitted Date"
              content={selectedRow.saleDate.toDateString()}
            />
            <DataTile title="Zip" content="12345" />
            {/* TODO: replace with actual zip code */}
            <DataTile title="Total premiums" content={selectedRow.totalAmount!.toString()} />
            {/* TODO: replace with actual total premiums code */}
            
            {selectedRow.products.map((product) => (
              <ProductExpandContainer
                summery={selectedRow.productName}
                details={product}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No sale selected</p>
        )}
      </div>
    </Drawer>
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
        alt={"public/profile.jpg"}
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
