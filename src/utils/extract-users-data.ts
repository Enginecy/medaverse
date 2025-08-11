import { addImportedUsers } from "@/features/dashboard/user-management/server/actions/user-mangement";
import ExcelJS from "exceljs";

export async function readUsersFile(file: File) {
  const user = {
    name: "",
    username: "",
    phoneNumber: "",
    email: "",
    role: "",
    address: "",
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
  var users: {}[] = [];
  for (const row of rows.slice(2)) {
    if (!Array.isArray(row) || row.length < headers.length + 1) continue;
    const userData: Record<string, string> = {};
    headers.forEach((header, index) => {
      userData[header] = row[index + 1]?.toString().trim() || "";
      if (header === "phoneNumber" && !userData[header]) {
        throw {
          message: "Make sure all required data is set (Phone Numbers).",
        };
      } else if (header === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userData[header]) {
          throw { message: "Make sure all required data is set (Email)." };
        }
        if (!emailRegex.test(userData[header])) {
          throw { message: "Invalid email format." };
        }
      } else if (header === "dob" && (!userData[header] || userData[header] || userData[header] === "")) {
        throw { message: "Make sure all required data is set (DOB)." };
      } else { }
      
    });
    users.push(userData);
  }

  if (users.length === 0) {
    throw { message: "The file does not contain any valid user data." };
  }

  Object.keys(user).forEach((key) => {
    if ((user as any)[key] === undefined || (user as any)[key] === null) {
      throw {
        message: `The file does not contain the required column: ${key}`,
      };
    }
  });

  await addImportedUsers(users);
}
