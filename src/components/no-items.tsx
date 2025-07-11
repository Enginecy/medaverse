"use client";

import type { ReactNode } from "react";
import Image from "next/image";

export function NoItems({
  message = "Nothing here yet.",
  description = "There are no records to display.",
  children,
}: {
  message?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mt-10 h-full w-full px-6 py-10 text-center">
      <div
        className="flex h-full flex-col items-center justify-center space-y-4"
      >
        
          <Image src={"/cat.png"} alt="No Items" width={200} height={200} className="flex w-50 h-50 items-center justify-center "/>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{message}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
