"use client";

import { Button } from "@/components/ui/button";
import ExcelJS from "exceljs";
// import { saveAs } from 'file-saver';
import { AddUsersButton } from "@/features/dashboard/user-management/components/add-users-button";
import { Download } from "lucide-react";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";

const sampleUsers = [
  {
    id: "1",
    name: "Alice Smith",
    email: "alice@example.com",
    role: "admin",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "user",
    createdAt: new Date(),
  },
  {
    id: "3",
    username: "username_123",
    email: "charlie@example.com",
    role: "editor",
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Dana Lee",
    role: "viewer",
    createdAt: new Date(),
  },
];
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

async function generalExport(data: Record<string, any>[], name: string) {
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
  console.log("DATA", data);

  const keys = new Set<string>();
  for (const row of data) {
    Object.keys(row).forEach((key) => {
      keys.add(key);
    });
  }

  console.log("KEYS", keys);

  const columnsKeys = Array.from(keys);

  console.log("COLUMNS KEYS", columnsKeys);

  const columns: Partial<ExcelJS.Column>[] = [];

  for (var i = 0; i < columnsKeys.length; ++i) {
    const width = maxWidth(data, columnsKeys[i]!);
    columns.push({
      header:
        columnsKeys[i]?.charAt(0).toUpperCase() + columnsKeys[i]!.slice(1),
      key: columnsKeys[i],
      width: width,

      style: {
        alignment: {
          horizontal: "center",
        },
        font: {
          name: "Arial",
          size: 12,
          bold: true,
        },
      },
    });
  }

  workSheet.columns = columns;

  // add the rows in the worksheet I am trying to export
  data.forEach((row) => {
    const normalized = normalizeRow(row, columnsKeys);
    const addedRow = workSheet.addRow(normalized);
    addedRow.height = 30;
    addedRow.eachCell((cell) => {
      cell.font = { name: "Calibri", size: 12, bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFF0B3" }, // Light yellow
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
    workSheet.getRow(workSheet.lastRow!.number);
  });

  // for (const row of data) {
  //   const normalized = normalizeRow(data, columnsKeys);
  //   workSheet.addRow(normalized);
  // }

  // Generate buffer
  const buffer = await workBook.xlsx.writeBuffer();

  // Save file
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  //   saveAs(blob, "users.xlsx");
  var csvURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement("a");
  tempLink.href = csvURL;
  tempLink.setAttribute("download", "filename.xlsx");
  tempLink.click();
}

function normalizeRow(row: Record<string, any>, allKeys: string[]) {
  const normalized: Record<string, any> = {};
  for (const key of allKeys) {
    normalized[key] = row[key] ?? null; // or "" if you prefer empty string
  }
  return normalized;
}

function maxWidth(data: Record<string, any>[], key: string) {
  var maximum = key.length;
  data.forEach((row) => {
    if (key in row) {
      const obj = row[key] != null ? String(row[key]) : "";
      const length = obj.length;

      if (maximum < length) {
        maximum = length;
      }
    }
  });
  return maximum * 1.5;
}
