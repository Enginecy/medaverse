import type { User } from "@/features/dashboard/user-management/server/db/user-management";
import ExcelJS from "exceljs";

export async function usersTemplateXLSX() {
  const workBook = new ExcelJS.Workbook();
  const workSheet = workBook.addWorksheet("Users Template");

  const keys: Record<keyof User, any> = {} as User;

  for (const key in keys) {
    workSheet.columns.push({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key: key,
      width: 20,
      style: {
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
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
  workSheet.addRow(keys);

  const buffer = await workBook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  var csvURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement("a");
  tempLink.href = csvURL;
  tempLink.setAttribute("download", "users_template.xlsx");
  tempLink.click();
  
}
