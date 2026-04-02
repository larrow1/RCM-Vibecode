import { describe, it, expect } from "vitest";
import { parseCsv, detectColumns } from "../lib/import-parser";

describe("parseCsv", () => {
  it("parses a simple CSV string", () => {
    const csv = `Account,Jan 2024,Feb 2024
Revenue,100000,110000
COGS,40000,42000
SGA Expenses,30000,31000`;

    const result = parseCsv(csv);
    expect(result.headers).toEqual(["Account", "Jan 2024", "Feb 2024"]);
    expect(result.rows).toHaveLength(3);
    expect(result.errors).toHaveLength(0);
  });

  it("extracts values correctly", () => {
    const csv = `Account Name,2024-01,2024-02
Product Revenue,500000,520000`;

    const result = parseCsv(csv);
    expect(result.rows[0].values["Account Name"]).toBe("Product Revenue");
    expect(result.rows[0].values["2024-01"]).toBe(500000);
    expect(result.rows[0].values["2024-02"]).toBe(520000);
  });

  it("handles empty CSV", () => {
    const result = parseCsv("");
    expect(result.headers).toHaveLength(0);
    expect(result.rows).toHaveLength(0);
  });

  it("skips empty lines", () => {
    const csv = `Account,Amount
Revenue,100000

COGS,40000

`;
    const result = parseCsv(csv);
    expect(result.rows).toHaveLength(2);
  });

  it("handles numeric type detection", () => {
    const csv = `Name,Amount
Revenue,100000
COGS,40000.50`;

    const result = parseCsv(csv);
    expect(typeof result.rows[0].values["Amount"]).toBe("number");
    expect(result.rows[1].values["Amount"]).toBe(40000.5);
  });
});

describe("detectColumns", () => {
  it("detects account name column", () => {
    const result = detectColumns(["Account Name", "Jan 2024", "Feb 2024"]);
    expect(result.accountNameColumn).toBe("Account Name");
  });

  it("detects account code column", () => {
    const result = detectColumns(["Account Code", "Description", "Amount"]);
    expect(result.accountCodeColumn).toBe("Account Code");
  });

  it("detects amount columns with year patterns", () => {
    const result = detectColumns([
      "Account",
      "2024-01",
      "2024-02",
      "2024-03",
    ]);
    expect(result.amountColumns).toEqual(["2024-01", "2024-02", "2024-03"]);
  });

  it("detects amount columns with month names", () => {
    const result = detectColumns(["Account", "Jan 2024", "Feb 2024"]);
    expect(result.amountColumns).toContain("Jan 2024");
    expect(result.amountColumns).toContain("Feb 2024");
  });

  it("detects amount columns with 'Amount' keyword", () => {
    const result = detectColumns(["Account", "Amount", "Total"]);
    expect(result.amountColumns).toContain("Amount");
    expect(result.amountColumns).toContain("Total");
  });

  it("falls back to first column as account name", () => {
    const result = detectColumns(["GL Item", "2024-01"]);
    expect(result.accountNameColumn).toBe("GL Item");
  });

  it("handles empty headers", () => {
    const result = detectColumns([]);
    expect(result.accountCodeColumn).toBeNull();
    expect(result.accountNameColumn).toBeNull();
    expect(result.amountColumns).toHaveLength(0);
  });
});
