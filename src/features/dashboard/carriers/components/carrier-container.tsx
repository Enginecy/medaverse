import { Button } from "@/components/ui/button";
import Image from "next/image";

export function CarrierContainer({ imageUrl , link}: { imageUrl: string, link: string }) {
  return (
    <Button
      variant="outline"
      className="h-50 w-70 rounded-2xl border-4 border-gray-100
        hover:cursor-pointer bg-white"
        onClick={() => window.open(link, "_blank")}
    >
      <Image
        src={imageUrl}
        alt="Carrier"
        width={100}
        height={100}
        className="mx-auto my-4 h-24 w-24 rounded-lg"
      />
    </Button>
  );
}
