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
  const buffer = await readFileAsync(file);
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
  console.log("ADDING USERS TO THE DB");

  return await addImportedUsers(users);
}

function readFileAsync(file: File) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file.bytes);
  });
}
