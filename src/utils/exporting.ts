import ExcelJS from "exceljs";

export async function generalExport(data: Record<string, unknown>[], name: string) {
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

  for (const key of columnsKeys) {
    const width = maxWidth(data, key);
    columns.push({
      header:
        key?.charAt(0).toUpperCase() + key!.slice(1),
      key: key,
      width: width,
      style: {
        border:{
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

  workSheet.columns = columns;

  // add the rows in the worksheet I am trying to export
  data.forEach((row) => {
    const normalized = normalizeRow(row, columnsKeys);
    const addedRow = workSheet.addRow(normalized);
    addedRow.height = 20;
    addedRow.eachCell((cell) => {
      cell.font = { name: "Calibri", size: 12 };
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

  // Generate buffer
  const buffer = await workBook.csv.writeBuffer();

  // Save file
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  //   saveAs(blob, "users.xlsx");
  var csvURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement("a");
  tempLink.href = csvURL;
  tempLink.setAttribute("download", "filename.csv");
  tempLink.click();
}

function normalizeRow(row: Record<string, any>, allKeys: string[]) {
  const normalized: Record<string, any> = {};
  for (const key of allKeys) {
    normalized[key] = row[key] ?? ""; // or "" if you prefer empty string
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
