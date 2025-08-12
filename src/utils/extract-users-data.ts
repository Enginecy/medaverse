import { addImportedUsers } from "@/features/dashboard/user-management/server/actions/user-mangement";
import ExcelJS from "exceljs";

export async function readUsersFile(file: File) {
  const user = {
    name: "",
    username: "",
    phoneNumber: "",
    email: "",
    role: "",
    office: "",
    npnNumber: "",
    dob: new Date("MM/DD/YYYY"),
  };
  const buffer = await file.arrayBuffer();
  if (!(buffer instanceof ArrayBuffer)) return;

  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];

  const rows = worksheet?.getSheetValues();

  if (!rows || rows.length < 2) {
    throw { message: "The file does not contain enough rows." };
  }

  const headerRow = rows[1];
  console.log(headerRow, "<======== Header Row");

  if (!headerRow || !Array.isArray(headerRow)) {
    throw { message: "The file does not contain enough columns." };
  }

  const headers = headerRow.slice(1).map((cell) => {
    const formattedCell = cell?.toString().trim();
    const formattedHeader =
      formattedCell!.charAt(0).toLowerCase() + formattedCell?.slice(1);

    return formattedHeader;
  });

  console.log(headers, "<======== Headers");
  Object.keys(user).forEach((key) => {
    if (!headers.includes(key)) {
      throw {
        message: `The file does not contain the required column: ${key}`,
      };
    }
  });
  const users: Record<string, string>[] = [];
  for (const row of rows.slice(2)) {
    if (!Array.isArray(row) || row.length < headers.length + 1) continue;
    const userData: Record<string, string> = {};
    headers.forEach((header, index) => {
      const cellValue = row[index + 1]?.toString().trim() ?? "";
      userData[header] = cellValue;

      // Validate required fields
      switch (header) {
        case "phoneNumber":
          if (!cellValue) {
            throw {
              message: "Phone number is required for all users.",
            };
          }
          break;

        case "email":
          if (!cellValue) {
            throw {
              message: "Email address is required for all users.",
            };
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(cellValue)) {
            throw {
              message: "Invalid email format provided.",
            };
          }
          break;

        case "dob":
          if (!cellValue) break;

          const parsedDate = new Date(cellValue);
          if (isNaN(parsedDate.getTime())) {
            throw {
              message: "Invalid date of birth provided.",
            };
          }
          break;
      }
    });
    users.push(userData);
  }

  if (users.length === 0) {
    throw { message: "The file does not contain any valid user data." };
  }

  Object.keys(user).forEach((key) => {
    const obj = user as Record<string, unknown>;
    if (obj[key] === undefined || obj[key] === null) {
      throw {
        message: `The file does not contain the required column: ${key}`,
      };
    }
  });

  await addImportedUsers(users);
}
