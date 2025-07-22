import { getRoles } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";
import ExcelJS from "exceljs";

export async function usersTemplateXLSX() {
  const workBook = new ExcelJS.Workbook();
  const workSheet = workBook.addWorksheet("Users Template");

  // Define example user to extract keys
  const exampleUser: Partial<User> & { Role: string; Dob: Date } = {
    name: "",
    username: "",
    phoneNumber: "",
    email: "",
    Role: "",
    address: "",
    npnNumber: "",
    Dob: new Date("MM/DD/YYYY"),
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
  const roleColIdx = keys.indexOf("Role") + 1;
  const dobColIdx = keys.indexOf("Dob") + 1;
  const NUM_ROWS = 100;

  if (roleNames.length > 0 && roleColIdx >= 1) {
    const list = roleNames.join(",");
    for (let i = 2; i < NUM_ROWS; i++) {
      const cell = workSheet.getCell(i, roleColIdx);
      cell.dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${list}"`],
      };
    }
  }

  for (let i = 2; i < NUM_ROWS; i++) {
    const cell = workSheet.getCell(i, dobColIdx);
    cell.dataValidation = {
      type: "date",
      operator: "between",
      formulae: ["1900-01-01", "2200-12-31"],
    };
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
