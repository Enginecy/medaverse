"use client";

import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { generalExport } from "@/utils/exporting";
import { getExportUsers } from "@/features/dashboard/user-management/server/db/user-management";
import { useQuery } from "@tanstack/react-query";
import { showSonnerToast } from "@/lib/react-utils";
import { PulseMultiple } from "react-svg-spinners";
import React from "react";

export function UploadCSVButton() {
  function uploadFile() {}

  return (
    <Button className="w-35" variant="outline" asChild>
      <label>
        <span>Upload CSV</span>
        <Upload />
        <input className="" type="file" onChange={uploadFile}  />
      </label>
    </Button>
  );
}
