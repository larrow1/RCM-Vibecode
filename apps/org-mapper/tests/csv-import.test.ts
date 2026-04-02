import { describe, it, expect } from "vitest";
import { parseCsvToOrgUnits } from "@/lib/org-utils";

describe("parseCsvToOrgUnits", () => {
  it("parses basic CSV rows with full mapping", () => {
    const rows = [
      { Name: "Alice", Title: "CEO", Dept: "Executive", Level: "0", Salary: "400000", EmpId: "E001" },
      { Name: "Bob", Title: "CTO", Dept: "Engineering", Level: "1", Salary: "300000", EmpId: "E002" },
    ];
    const mapping = {
      name: "Name",
      title: "Title",
      department: "Dept",
      level: "Level",
      compensation: "Salary",
      employeeId: "EmpId",
    };

    const { units, errors } = parseCsvToOrgUnits(rows, mapping);
    expect(errors).toHaveLength(0);
    expect(units).toHaveLength(2);
    expect(units[0].name).toBe("Alice");
    expect(units[0].title).toBe("CEO");
    expect(units[0].department).toBe("Executive");
    expect(units[0].level).toBe(0);
    expect(units[0].totalCompensation).toBe(400000);
    expect(units[0].employeeId).toBe("E001");
  });

  it("handles minimal mapping (name only)", () => {
    const rows = [
      { FullName: "Alice" },
      { FullName: "Bob" },
    ];
    const { units, errors } = parseCsvToOrgUnits(rows, { name: "FullName" });
    expect(errors).toHaveLength(0);
    expect(units).toHaveLength(2);
    expect(units[0].title).toBeNull();
    expect(units[0].department).toBeNull();
    expect(units[0].level).toBe(0);
    expect(units[0].headcount).toBe(1);
    expect(units[0].totalCompensation).toBe(0);
  });

  it("reports errors for rows missing name", () => {
    const rows = [
      { Name: "Alice" },
      { Name: "" },
      { Name: "Charlie" },
    ];
    const { units, errors } = parseCsvToOrgUnits(rows, { name: "Name" });
    expect(units).toHaveLength(2);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("Row 2");
  });

  it("handles non-numeric level gracefully", () => {
    const rows = [{ Name: "Alice", Level: "not-a-number" }];
    const { units } = parseCsvToOrgUnits(rows, { name: "Name", level: "Level" });
    expect(units[0].level).toBe(0); // parseInt returns NaN, fallback to 0
  });

  it("handles non-numeric compensation gracefully", () => {
    const rows = [{ Name: "Alice", Salary: "N/A" }];
    const { units } = parseCsvToOrgUnits(rows, { name: "Name", compensation: "Salary" });
    expect(units[0].totalCompensation).toBe(0);
  });

  it("trims whitespace from values", () => {
    const rows = [{ Name: "  Alice  ", Title: "  CEO  ", Dept: " Executive " }];
    const { units } = parseCsvToOrgUnits(rows, { name: "Name", title: "Title", department: "Dept" });
    expect(units[0].name).toBe("Alice");
    expect(units[0].title).toBe("CEO");
    expect(units[0].department).toBe("Executive");
  });

  it("sets default type to Role when not mapped", () => {
    const rows = [{ Name: "Alice" }];
    const { units } = parseCsvToOrgUnits(rows, { name: "Name" });
    expect(units[0].type).toBe("Role");
  });

  it("uses mapped type when provided", () => {
    const rows = [{ Name: "Engineering", Type: "Department" }];
    const { units } = parseCsvToOrgUnits(rows, { name: "Name", type: "Type" });
    expect(units[0].type).toBe("Department");
  });

  it("captures manager name for later resolution", () => {
    const rows = [
      { Name: "Alice", Manager: "Bob" },
    ];
    const { units } = parseCsvToOrgUnits(rows, { name: "Name", managerName: "Manager" });
    expect(units[0].managerName).toBe("Bob");
    expect(units[0].parentId).toBeNull(); // not resolved yet
  });

  it("handles empty input", () => {
    const { units, errors } = parseCsvToOrgUnits([], { name: "Name" });
    expect(units).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });

  it("handles headcount column", () => {
    const rows = [{ Name: "Dept A", HC: "25" }];
    const { units } = parseCsvToOrgUnits(rows, { name: "Name", headcount: "HC" });
    expect(units[0].headcount).toBe(25);
  });
});
