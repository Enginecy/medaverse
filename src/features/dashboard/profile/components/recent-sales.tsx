import React from "react";
import { cn } from "@/lib/utils";

export function RecentSales({
  sales,
}: {
  sales: {
    today: Array<{ clientName: string; description: string; amount: number }>;
  };
}) {
  const dotSize = 16;
  const dotRadius = dotSize / 2;
  const lineWidth = 2;

  const lineHeightBase = 24;

  const dotVerticalOffset = (lineHeightBase - dotSize) / 2;

  return (
    <div
      className="w-1/3 rounded-3xl border border-[#E5ECF6] bg-white p-6
        shadow-sm"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Recent Sales</h2>
        <button
          className="flex items-center justify-center rounded-lg border
            border-[#E5ECF6] px-4 py-2 text-sm font-medium text-gray-700
            transition hover:bg-gray-50"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {" "}
        {/* This maintains spacing for potential 'Today', 'Yesterday' sections */}
        {sales.today && sales.today.length > 0 && (
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-500">Today</h3>
            <div className="relative">
              {" "}
              {/* Main relative container for timeline items */}
              {sales.today.map((sale, index) => (
                // Each sale item is a flex container, and is also relative for internal absolute positioning
                // pb-6 (24px) creates the exact vertical gap shown in Figma between sales items
                <div
                  key={index}
                  className="relative flex items-start justify-between pb-6
                    last:pb-0"
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
                  {index < sales.today.length - 1 && (
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
                      {sale.clientName}
                    </p>
                    <p className="mt-0.5 text-sm leading-tight text-gray-500">
                      {sale.description}
                    </p>
                  </div>

                  {/* Amount - aligned with the top of the main content block */}
                  <div
                    className="ml-4"
                    style={{ paddingTop: dotVerticalOffset }}
                  >
                    <p className="text-base font-semibold text-gray-900">
                      ${sale.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
