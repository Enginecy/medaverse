/**
 * Converts an array of objects to CSV format and triggers download
 * @param data Array of objects to convert to CSV
 * @param filename Name of the file to download (without extension)
 */
export function exportToCSV<T extends Record<string, string | number | null | undefined>>(
  data: T[],
  filename: string,
): void {
  if (data.length === 0) {
    return;
  }

  // Get all unique keys from all objects
  const keys = new Set<string>();
  data.forEach((row) => {
    Object.keys(row).forEach((key) => keys.add(key));
  });

  const headers = Array.from(keys);

  // Create CSV header row
  const headerRow = headers.map((header) => escapeCSVValue(header)).join(",");

  // Create CSV data rows
  const csvRows = [headerRow];
  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      return escapeCSVValue(value?.toString() ?? "");
    });
    csvRows.push(values.join(","));
  });

  // Combine all rows
  const csvContent = csvRows.join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Escapes CSV values that contain commas, quotes, or newlines
 */
function escapeCSVValue(value: string): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

