import React from "react";

export function InfoTile({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) {
  return (
    <div className="flex flex-row items-center p-2">
      <div
        className="bg-primary-100 flex max-h-9 items-center justify-center
          rounded-lg p-2"
      >
        {icon}
      </div>
      <div className="flex flex-col px-1">
        <p className="text-muted-foreground overflow-auto text-sm font-semibold">
          {title}
        </p>
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
}
