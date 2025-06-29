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
    <div className="flex h-full w-full flex-col items-start gap-6 p-6">
      <div className="flex w-full justify-between">
        <h1 className="text-2xl font-semibold">Documents Management</h1>
        <AddDocumentButton />
      </div>
      <TabBar />
      <Card className="w-full grow py-0">
        <CardContent className="grow">{children}</CardContent>
      </Card>
    </div>
  );
}

function TabBar() {
  const path = usePathname();

  return (
    <Tabs defaultValue={path} className="w-[30%]">
      <TabsList className="bg-card h-10 w-full">
        <TabsLinkTrigger href="/dashboard/docs-management/news">
          News
        </TabsLinkTrigger>
        <TabsLinkTrigger href="/dashboard/docs-management/contracts">
          Contracts
        </TabsLinkTrigger>
        <TabsLinkTrigger href="/dashboard/docs-management/recruiting">
          Recruiting
        </TabsLinkTrigger>
      </TabsList>
    </Tabs>
  );
}
