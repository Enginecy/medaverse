"use client";

import { Button } from "@/components/ui/button";
import ExcelJS from "exceljs";
// import { saveAs } from 'file-saver';
import { AddUsersButton } from "@/features/dashboard/user-management/components/add-users-button";
import { Download } from "lucide-react";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";

export function UsersActions({ users }: { users: User[] }) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => generalExport(users, "Users")}>
        Download CSV
        <Download />
      </Button>
      <AddUsersButton />
    </div>
  );
}

async function generalExport(data: object[], name: string) {
  {
    /*
        create a new workbook and add a worksheet to it
    */
  }
  const workBook = new ExcelJS.Workbook();
  const workSheet = workBook.addWorksheet(name); // naming it

  {
    /*
    define columns data here  in the excel sheet from the data
    */
  }
  //   const tryColumnsData = Object.keys(data);
  //   var tryColumns: Partial<ExcelJS.Column>[] = [];
  //   for (var i = 0; i < Object.keys(data).length; i++) {
  //     tryColumns.push({
  //       header: tryColumnsData[i]?.charAt(0).toUpperCase(),
  //       key: tryColumnsData[i],
  //       width: 10,
  //       style: {

  //         font: {
  //           name: "Arial",
  //           size: 12,
  //           bold: true,
  //         },

  //       }
  //     });
  //   }

  //   workSheet.columns = tryColumnsData;

  // add the rows in the worksheet I am trying to export
  data.forEach((dataItem) => {
    // workSheet.addRow(dataItem ) ;
    workSheet.addRows([1, 1, 1, 11, 1]);
  });
  // Generate buffer
  const buffer = await workBook.csv.writeBuffer();

  // Save file
  const blob = new Blob(
    [buffer],
    // { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
  );
  //   saveAs(blob, "users.xlsx");
  var csvURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement("a");
  tempLink.href = csvURL;
  tempLink.setAttribute("download", "filename.csv");
  tempLink.click();
}
