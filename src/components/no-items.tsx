"use client";

import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function NoItems({
  message = "Nothing here yet.",
  description = "There are no records to display.",
  icon = <Inbox className="h-8 w-8 text-gray-400" />,
  children,
}: {
  message?: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mt-10 w-full   px-6 py-10 text-center ">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{message}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
