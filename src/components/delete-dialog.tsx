import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { Trash2 } from "lucide-react";
import { useRef } from "react";

export function DeleteDialog(
    {title ,  content } : { title: string , content : string} 
) {
  return (
    <DialogContent
      className=" w-85 border-0 focus-visible:ring-0
        focus-visible:outline-none rounded-2xl p-7 "
      showCloseButton={false}
    >
        
      <div className="flex flex-col  justify-center items-center" >
        <div className=" flex h-14 w-14 rounded-full bg-red-50  items-center justify-center m-2">
          <div className="flex h-10 w-10 rounded-full bg-red-100 items-center justify-center">
            <Trash2 className="h-6 w-6 text-red-500" />

          </div>
        </div>
        <DialogTitle className="text-base font-semibold text-center ">
          {title}
        </DialogTitle>
        <p className="text-sm font-light text-gray-600 text-center ">
          {content}
        </p>
        <p className="text-sm text-gray-500">
          This action cannot be undone.
        </p>
        <div className=" w-full flex flex-row justify-around py-3">
            <Button className="w-30" variant="outline">Cancel</Button>
            <Button className="w-30 bg-red-600">Delete</Button>


        </div>
      </div>
    </DialogContent>
  );
}
