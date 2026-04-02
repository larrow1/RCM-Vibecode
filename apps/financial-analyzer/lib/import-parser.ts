import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface ParsedRow {
  rowIndex: number;
  values: Record<string, string | number>;
}

export interface ParseResult {
  headers: string[];
  rows: ParsedRow[];
  errors: string[];
}

/**
 * Parse a CSV string into structured rows.
 */
export function parseCsv(content: string): ParseResult {
  const result = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  const headers = result.meta.fields ?? [];
  const rows: ParsedRow[] = (result.data as Record<string, unknown>[]).map(
    (row, idx) => ({
      rowIndex: idx,
      values: row as Record<string, string | number>,
    })
  );

  const errors = result.errors.map(
    (e) => `Row ${e.row}: ${e.message}`
  );

  return { headers, rows, errors };
}

/**
 * Parse an Excel buffer into structured rows (first sheet).
 */
export function parseExcel(buffer: Buffer): ParseResult {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { headers: [], rows: [], errors: ["No sheets found in workbook"] };
  }

  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  if (jsonData.length === 0) {
    return { headers: [], rows: [], errors: ["Sheet is empty"] };
  }

  const headers = Object.keys(jsonData[0]);
  const rows: ParsedRow[] = jsonData.map((row, idx) => ({
    rowIndex: idx,
    values: row as Record<string, string | number>,
  }));

  return { headers, rows, errors: [] };
}

/**
 * Detect which columns are likely account codes, names, and amount columns.
 */
export function detectColumns(headers: string[]): {
  accountCodeColumn: string | null;
  accountNameColumn: string | null;
  amountColumns: string[];
} {
  const lower = headers.map((h) => h.toLowerCase());

  let accountCodeColumn: string | null = null;
  let accountNameColumn: string | null = null;
  const amountColumns: string[] = [];

  for (let i = 0; i < headers.length; i++) {
    const h = lower[i];
    if (
      !accountCodeColumn &&
      (h.includes("code") || h.includes("account #") || h.includes("acct"))
    ) {
      accountCodeColumn = headers[i];
    } else if (
      !accountNameColumn &&
      (h.includes("name") ||
        h.includes("description") ||
        h.includes("account") ||
        h.includes("label"))
    ) {
      accountNameColumn = headers[i];
    } else if (
      h.includes("amount") ||
      h.includes("total") ||
      h.includes("balance") ||
      /^\d{4}/.test(h) || // starts with year like "2024-01"
      /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(h)
    ) {
      amountColumns.push(headers[i]);
    }
  }

  // If no account name column found, use the first string-looking column
  if (!accountNameColumn && headers.length > 0) {
    accountNameColumn = headers[0];
  }

  return { accountCodeColumn, accountNameColumn, amountColumns };
}
