"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface SegmentedButtonProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: React.ComponentProps<"div">["className"];
}

export function SegmentedButton({
  options,
  value,
  onChange,
  className,
}: SegmentedButtonProps) {
  const selectedIndex = options.indexOf(value);

  return (
    <div
      className={cn(
        "bg-muted relative flex items-center justify-around rounded-xl p-1",
        className,
      )}
    >
      {/* Sliding background */}
      <div
        className="bg-primary absolute top-1 bottom-1 rounded-xl shadow-sm
          transition-all duration-300 ease-in-out"
        style={{
          width: `${100 / options.length}%`,
          left: `${(selectedIndex * 100) / options.length}%`,
        }}
      />

      {/* Buttons */}
      {options.map((option) => {
        const isSelected = value === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              `relative z-10 cursor-pointer rounded-xl px-4 py-3 text-center
              font-medium transition-colors duration-300`,
              isSelected
                ? "text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
