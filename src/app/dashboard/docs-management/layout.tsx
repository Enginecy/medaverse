"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsLinkTrigger, TabsList } from "@/components/ui/tabs";
import { AddDocumentButton } from "@/features/dashboard/docs/components/ui/add-document-button";
import { usePathname } from "next/navigation";
import React from "react";

export default function DocsManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col items-start gap-4 md:gap-6">
      <div className="flex w-full flex-col sm:flex-row sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold">Documents Management</h1>
        <AddDocumentButton />
      </div>
      <TabBar />
      <Card className="w-full grow py-0">
        <CardContent className="grow p-2 md:p-6">{children}</CardContent>
      </Card>
    </div>
  );
}

function TabBar() {
  const path = usePathname();

  return (
    <Tabs defaultValue={path} className="w-full md:w-auto">
      <TabsList className="bg-card h-12 md:h-10 w-full md:w-auto grid grid-cols-3 md:flex">
        <TabsLinkTrigger href="/dashboard/docs-management/news" className="min-h-[44px] md:min-h-auto text-sm">
          News
        </TabsLinkTrigger>
        <TabsLinkTrigger href="/dashboard/docs-management/contracts" className="min-h-[44px] md:min-h-auto text-sm">
          Contracts
        </TabsLinkTrigger>
        <TabsLinkTrigger href="/dashboard/docs-management/recruiting" className="min-h-[44px] md:min-h-auto text-sm">
          Recruiting
        </TabsLinkTrigger>
      </TabsList>
    </Tabs>
  );
}
