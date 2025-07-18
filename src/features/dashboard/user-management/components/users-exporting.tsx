"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generalExport } from "@/utils/exporting";
import { getExportUsers } from "@/features/dashboard/user-management/server/db/user-management";
import { useQuery } from "@tanstack/react-query";
import { showSonnerToast } from "@/lib/react-utils";
import { PulseMultiple } from "react-svg-spinners";
import React from "react";

export function ExportUsersButton() {
  const [isLoading, setIsLoading] = React.useState(false);
  useQuery({
    queryKey: ["users_export"],
    queryFn: getExportUsers,
    enabled: false,
  });
  async function exportUsersData() {
    try {
      setIsLoading(true);
      console.log("Exporting users data..." + isLoading);
      const data = await getExportUsers();
      console.log("Exporting users data..." + isLoading);

      if (data) {
        const exportedData = await generalExport(data!, "Users");
        showSonnerToast({
          message: "Success",
          description: "Users data exported successfully check your files",
          type: "success",
        });
        setIsLoading(false);
        return exportedData;
      } else {
        setIsLoading(false);
        showSonnerToast({
          message: "Failure",
          description: "Failed to export users data",
          type: "error",
        });
      }
    } catch (e) {
      setIsLoading(false);
      showSonnerToast({
        message: "Failure",
        description: "Failed to export users data",
        type: "error",
      });
    }
  }
  return (
    <Button
      className="w-35"
      variant="outline"
      onClick={() => exportUsersData()}
      disabled={isLoading}
    >
      {isLoading ? (
        <PulseMultiple color="#02459e" />
      ) : (
        //TODO: make it with the primary color global css
        <>
          Download xlsx
          <Download />
        </>
      )}
    </Button>
  );
}
