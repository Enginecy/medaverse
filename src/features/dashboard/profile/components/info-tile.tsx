import { User } from "lucide-react";
import React from "react";

export function InfoTile({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string  
  | null | undefined
  ;
}) {
    if(!content ){
        return (<div></div>)
    }
    if(content === undefined){
        return (<div></div>)
    }
  return (
    <div className="h-full flex flex-row p-2 items-center">
      <div
        className="max-h-9 bg-primary-100 flex items-center justify-center rounded-lg
          p-2"
      >
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<any>, {
              className: "h-5 w-5 text-primary-500",
            })
          : icon}
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
