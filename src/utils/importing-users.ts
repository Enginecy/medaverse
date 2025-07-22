import { addImportedUsers } from "@/features/dashboard/user-management/server/actions/user-mangement";
import { showSonnerToast } from "@/lib/react-utils";
import ExcelJS from "exceljs";

export function readUsersFile(file: File) : Promise<void> {
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
  const reader = new FileReader();

  reader.onload = async (event) => {
    const buffer = event.target?.result;
    if (!(buffer instanceof ArrayBuffer)) return;

    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];

    const rows = worksheet?.getSheetValues();

    if (!rows || rows.length < 2) {
      alert("The file is empty or does not contain valid data.");
      return;
    }
    const headerRow = rows[1];
    console.log(headerRow, "<======== Header Row");

    if (!headerRow || !Array.isArray(headerRow)) {
      alert("The file does not contain enough columns.");
      return;
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
        alert(`The file does not contain the required column: ${key}`);
        return;
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
      showSonnerToast({
        message: "No users data found in the file.",
        type: "error",
      });
      return;
    }

    Object.keys(user).forEach((key) => {
        if((user as any )[key ] === undefined || (user as any)[key ] === null) {
          showSonnerToast({
            message: `The file does not contain the required column: ${key}`,
            type: "error",
          });
          return;
        }
    }) ;

    await addImportedUsers(users );
  };
      reader.readAsArrayBuffer(file);
    return new Promise<void> ((resolve, reject) => {}) ;    
}
