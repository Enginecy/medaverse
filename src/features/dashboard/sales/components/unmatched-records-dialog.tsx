"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exportToCSV } from "@/utils/export-csv";
import type { IssuedSaleRecord } from "@/utils/extract-issued-sales";
import { Download } from "lucide-react";

interface UnmatchedRecordsDialogProps {
  records: IssuedSaleRecord[];
  onClose: () => void;
}

export function UnmatchedRecordsDialog({
  records,
  onClose,
}: UnmatchedRecordsDialogProps) {
  const handleDownloadCSV = () => {
    // Convert records to format suitable for CSV export
    const csvData = records.map((record) => ({
      PolicyNo: record.policyNo,
      Customer: record.customer,
      Status: record.status,
      State: record.state,
      ProductType: record.productType,
      PlanName: record.planName,
      SubmittedDate: record.submittedDate,
      EffectiveDate: record.effectiveDate,
      TermDate: record.termDate,
      PaySched: record.paySched,
      PayCode: record.payCode,
      Agent: record.agent,
      WritingAgentID: record.writingAgentID,
      "Monthly Premium": record.monthlyPremium,
    }));

    exportToCSV(csvData, `unmatched-records-${new Date().toISOString().split("T")[0]}`);
  };

  return (
    <DialogContent
      className="max-h-[90vh] w-[95vw] max-w-[95vw] overflow-hidden flex flex-col"
      showCloseButton={true}
    >
      <DialogHeader>
        <DialogTitle>Unmatched Records</DialogTitle>
        <DialogDescription>
          The following {records.length} policy record(s) from the imported file
          could not be matched with existing sales in the database. These
          policies may not have been submitted yet or the Policy Number may be
          incorrect.
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-auto border rounded-lg">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead>Policy No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Product Type</TableHead>
              <TableHead>Plan Name</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Term Date</TableHead>
              <TableHead>Pay Sched</TableHead>
              <TableHead>Pay Code</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Writing Agent ID</TableHead>
              <TableHead>Monthly Premium</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {record.policyNo}
                </TableCell>
                <TableCell>{record.customer}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>{record.state}</TableCell>
                <TableCell>{record.productType}</TableCell>
                <TableCell>{record.planName}</TableCell>
                <TableCell>{record.submittedDate}</TableCell>
                <TableCell>{record.effectiveDate}</TableCell>
                <TableCell>{record.termDate}</TableCell>
                <TableCell>{record.paySched}</TableCell>
                <TableCell>{record.payCode}</TableCell>
                <TableCell>{record.agent}</TableCell>
                <TableCell>{record.writingAgentID}</TableCell>
                <TableCell>{record.monthlyPremium}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DialogFooter className="flex flex-row gap-2">
        <Button variant="outline" onClick={handleDownloadCSV}>
          <Download className="h-4 w-4 mr-2" />
          Download CSV
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  );
}

