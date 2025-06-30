import { Button } from "@/components/ui/button";
import Image from "next/image";

export function CarrierContainer({ imageUrl , link}: { imageUrl: string, link: string }) {
  return (
    <Button
      variant="outline"
      className="h-40 w-60 rounded-2xl border-4 border-gray-100
        hover:cursor-pointer bg-white"
        onClick={() => window.open(link, "_blank")}
    >
     <div className="relative w-full h-full max-w-[190px] max-h-[120px]">
        <Image
          src={imageUrl}
          alt="Carrier"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    </Button>
  );
}
