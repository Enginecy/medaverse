import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Sale } from "@/features/dashboard/sales/server/db/sales";
import Link from "next/link";
import React from "react";

export function RecentSales({ sales }: { sales: Sale[] }) {
  const dotSize = 16;
  const dotRadius = dotSize / 2;
  const lineWidth = 2;

  const lineHeightBase = 24;

  const dotVerticalOffset = (lineHeightBase - dotSize) / 2;

  return (
    <Card className="w-full rounded-3xl shadow-none border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Recent Sales
        </CardTitle>
        <CardAction>
          <Link
            href="/dashboard/sales"
            className="flex items-center justify-center rounded-lg border
              border-[#E5ECF6] px-4 py-2 text-sm font-medium text-gray-700
              transition hover:bg-gray-50"
          >
            View All
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {sales.map((sale, index) => (
          // Each sale item is a flex container, and is also relative for internal absolute positioning
          // pb-6 (24px) creates the exact vertical gap shown in Figma between sales items
          <div
            key={index}
            className="relative flex items-start justify-between pb-6 last:pb-0"
          >
            {/* Absolute positioned Dot */}
            <div
              className="absolute left-0 rounded-full bg-[#1766A6]"
              style={{
                width: dotSize,
                height: dotSize,
                top: dotVerticalOffset, // Aligns dot center with client name text center
              }}
            ></div>

            {/* Absolute positioned Vertical Line - Only for items that are not the last */}
            {index < sales.length - 1 && (
              <div
                className="absolute bg-gray-200"
                style={{
                  left: dotRadius - lineWidth / 2,
                  top: dotVerticalOffset + dotSize,

                  height: `calc(100% - ${dotVerticalOffset + dotSize}px + ${dotVerticalOffset}px)`,

                  width: lineWidth,
                }}
              ></div>
            )}

            <div className="ml-8 flex-1">
              {" "}
              <p className="text-base font-semibold text-gray-900">
                {sale.customerName}
              </p>
              <p className="mt-0.5 text-sm leading-tight text-gray-500">
                {sale.products.map((product) => product.productName).join(", ")}
              </p>
            </div>

            {/* Amount - aligned with the top of the main content block */}
            <div className="ml-4" style={{ paddingTop: dotVerticalOffset }}>
              <p className="text-base font-semibold text-gray-900">
                {sale.totalAmount}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
