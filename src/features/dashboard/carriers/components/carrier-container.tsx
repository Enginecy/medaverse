import { Button } from "@/components/ui/button";
import { DeleteCarrierButton } from "@/features/dashboard/carriers/components/delete-carrier-button";
import { X } from "lucide-react";
import Image from "next/image";

export function CarrierContainer({
  imageUrl,
  link,
}: {
  imageUrl: string;
  link: string;
}) {
  return (
    <div className="relative">
      <Button
        variant="outline"
        className="h-40 w-60 rounded-2xl border-4 border-gray-100 bg-white
          hover:cursor-pointer"
        onClick={() => window.open(link, "_blank")}
      >
        <div className="relative h-full max-h-[120px] w-full max-w-[190px]">
          <Image
            src={imageUrl}
            alt="Carrier"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </Button>
       <DeleteCarrierButton/>
    </div>
  );
}
