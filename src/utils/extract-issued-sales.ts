import ExcelJS from "exceljs";

export type IssuedSaleRecord = {
  policyNo: string;
  customer: string;
  status: string;
  state: string;
  productType: string;
  planName: string;
  submittedDate: string;
  effectiveDate: string;
  termDate: string;
  paySched: string;
  payCode: string;
  agent: string;
  writingAgentID: string;
  monthlyPremium: string;
};

export async function readIssuedSalesFile(file: File): Promise<IssuedSaleRecord[]> {
  const buffer = await file.arrayBuffer();
  if (!(buffer instanceof ArrayBuffer)) {
    throw { message: "Invalid file buffer." };
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  const rows = worksheet?.getSheetValues();

  if (!rows || rows.length < 2) {
    throw { message: "The file does not contain enough rows." };
  }

  const headerRow = rows[1];
  if (!headerRow || !Array.isArray(headerRow)) {
    throw { message: "The file does not contain enough columns." };
  }

  // Expected headers (case-insensitive matching)
  const expectedHeaders = [
    "PolicyNo",
    "Customer",
    "Status",
    "State",
    "ProductType",
    "PlanName",
    "SubmittedDate",
    "EffectiveDate",
    "TermDate",
    "PaySched",
    "PayCode",
    "Agent",
    "WritingAgentID",
    "Monthly Premium",
  ];

  // Normalize headers (trim and convert to lowercase for matching)
  const headerMap: Record<string, number> = {};
  headerRow.forEach((cell, index) => {
    const headerName = cell?.toString().trim();
    if (headerName) {
      const normalizedHeader = headerName.toLowerCase().replace(/\s+/g, "");
      headerMap[normalizedHeader] = index;
    }
  });

  // Verify all required headers exist
  const missingHeaders: string[] = [];
  expectedHeaders.forEach((expectedHeader) => {
    const normalized = expectedHeader.toLowerCase().replace(/\s+/g, "");
    if (headerMap[normalized] === undefined) {
      missingHeaders.push(expectedHeader);
    }
  });

  if (missingHeaders.length > 0) {
    throw {
      message: `The file is missing required columns: ${missingHeaders.join(", ")}`,
    };
  }

  const records: IssuedSaleRecord[] = [];

  // Process data rows (skip header row at index 1, start from index 2)
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    if (!Array.isArray(row) || row.length < 2) continue;

    // Extract values based on header positions
    const getCellValue = (headerName: string): string => {
      const normalized = headerName.toLowerCase().replace(/\s+/g, "");
      const colIndex = headerMap[normalized];
      if (colIndex === undefined) return "";
      const value = row[colIndex];
      return value?.toString().trim() ?? "";
    };

    const policyNo = getCellValue("PolicyNo");
    
    // Skip rows without PolicyNo (empty rows)
    if (!policyNo) continue;

    const record: IssuedSaleRecord = {
      policyNo,
      customer: getCellValue("Customer"),
      status: getCellValue("Status"),
      state: getCellValue("State"),
      productType: getCellValue("ProductType"),
      planName: getCellValue("PlanName"),
      submittedDate: getCellValue("SubmittedDate"),
      effectiveDate: getCellValue("EffectiveDate"),
      termDate: getCellValue("TermDate"),
      paySched: getCellValue("PaySched"),
      payCode: getCellValue("PayCode"),
      agent: getCellValue("Agent"),
      writingAgentID: getCellValue("WritingAgentID"),
      monthlyPremium: getCellValue("Monthly Premium"),
    };

    records.push(record);
  }

  if (records.length === 0) {
    throw { message: "The file does not contain any valid sales records." };
  }

  return records;
}

