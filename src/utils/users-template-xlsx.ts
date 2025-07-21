import { getRoles } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";
import ExcelJS from "exceljs";

export async function usersTemplateXLSX() {
  const workBook = new ExcelJS.Workbook();
  const workSheet = workBook.addWorksheet("Users Template");

  // Define example user to extract keys
  const exampleUser:  Partial<User> & {excelRole: string}= {
    name: "",
    username: "",
    phoneNumber: "",
    email: "",
    address: "",
    npnNumber: "",
    excelRole:"",
  };
  const keys = Object.keys(exampleUser);

  // Set worksheet columns
  workSheet.columns = keys.map((key) => ({
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
  }));

  // Add empty row to allow data entry
  workSheet.addRow({});

  // Fetch roles and extract their names
  const roles = await getRoles();
  const roleNames = roles.map((r) => r.name).filter(Boolean);

  // Add dropdown to the "role" column
  const roleColIdx = keys.indexOf("excelRole") + 1;
  if (roleNames.length > 0 && roleColIdx >= 1) {
    const list = roleNames.join(",");
    workSheet
      .getColumn(roleColIdx)
      .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber === 1) return; // skip header
        cell.dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`"${list}"`], 
        };
      });
  }

  // Download
  const buffer = await workBook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "users_template.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
