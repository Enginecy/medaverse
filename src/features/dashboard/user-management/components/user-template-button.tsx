"use client"
import { Button } from "@/components/ui/button";
import { usersTemplateXLSX } from "@/utils/users-template-xlsx";

export function UsersTemplateButton() {
  return (
    <Button
      variant={"link"}
      className="text-primary  px-1 mx-1 underline hover:cursor-pointer"
      onClick={usersTemplateXLSX}
    >
      Users Template
    </Button>
  );
}
