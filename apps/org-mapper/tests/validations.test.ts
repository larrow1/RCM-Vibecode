import { describe, it, expect } from "vitest";
import {
  engagementSchema,
  orgUnitSchema,
  findingSchema,
  csvColumnMapping,
} from "@/lib/validations";

describe("engagementSchema", () => {
  const valid = {
    name: "Test Engagement",
    clientName: "Acme Corp",
    type: "OrgAssessment",
    startDate: "2026-01-01",
  };

  it("accepts valid input", () => {
    const result = engagementSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = engagementSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing clientName", () => {
    const result = engagementSchema.safeParse({ ...valid, clientName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid type", () => {
    const result = engagementSchema.safeParse({ ...valid, type: "Invalid" });
    expect(result.success).toBe(false);
  });

  it("accepts all valid types", () => {
    for (const type of [
      "OrgAssessment",
      "DueDiligence",
      "CostOptimization",
      "OperationalAssessment",
      "PostMergerIntegration",
    ]) {
      const result = engagementSchema.safeParse({ ...valid, type });
      expect(result.success).toBe(true);
    }
  });

  it("defaults status to Analysis", () => {
    const result = engagementSchema.parse(valid);
    expect(result.status).toBe("Analysis");
  });

  it("accepts optional endDate", () => {
    const result = engagementSchema.safeParse({ ...valid, endDate: "2026-06-01" });
    expect(result.success).toBe(true);
  });
});

describe("orgUnitSchema", () => {
  const valid = {
    engagementId: "abc123",
    name: "John Doe",
  };

  it("accepts minimal valid input", () => {
    const result = orgUnitSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = orgUnitSchema.safeParse({ engagementId: "abc" });
    expect(result.success).toBe(false);
  });

  it("rejects missing engagementId", () => {
    const result = orgUnitSchema.safeParse({ name: "Test" });
    expect(result.success).toBe(false);
  });

  it("defaults type to Role", () => {
    const result = orgUnitSchema.parse(valid);
    expect(result.type).toBe("Role");
  });

  it("defaults headcount to 1", () => {
    const result = orgUnitSchema.parse(valid);
    expect(result.headcount).toBe(1);
  });

  it("defaults totalCompensation to 0", () => {
    const result = orgUnitSchema.parse(valid);
    expect(result.totalCompensation).toBe(0);
  });

  it("accepts all valid types", () => {
    for (const type of ["Division", "Department", "Team", "Role"]) {
      const result = orgUnitSchema.safeParse({ ...valid, type });
      expect(result.success).toBe(true);
    }
  });

  it("rejects negative headcount", () => {
    const result = orgUnitSchema.safeParse({ ...valid, headcount: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects negative compensation", () => {
    const result = orgUnitSchema.safeParse({ ...valid, totalCompensation: -100 });
    expect(result.success).toBe(false);
  });
});

describe("findingSchema", () => {
  const valid = {
    engagementId: "abc123",
    category: "Risk",
    severity: "High",
    title: "Test Finding",
    description: "Test description",
  };

  it("accepts valid input", () => {
    const result = findingSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("defaults workstream to Organizational", () => {
    const result = findingSchema.parse(valid);
    expect(result.workstream).toBe("Organizational");
  });

  it("defaults status to Draft", () => {
    const result = findingSchema.parse(valid);
    expect(result.status).toBe("Draft");
  });

  it("accepts all valid categories", () => {
    for (const category of ["Risk", "Opportunity", "Observation", "Anomaly"]) {
      const result = findingSchema.safeParse({ ...valid, category });
      expect(result.success).toBe(true);
    }
  });

  it("accepts all valid severities", () => {
    for (const severity of ["Critical", "High", "Medium", "Low", "Informational"]) {
      const result = findingSchema.safeParse({ ...valid, severity });
      expect(result.success).toBe(true);
    }
  });

  it("rejects missing title", () => {
    const result = findingSchema.safeParse({ ...valid, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing description", () => {
    const result = findingSchema.safeParse({ ...valid, description: "" });
    expect(result.success).toBe(false);
  });

  it("accepts nullable orgUnitId", () => {
    const result = findingSchema.safeParse({ ...valid, orgUnitId: null });
    expect(result.success).toBe(true);
  });

  it("accepts optional financialImpact", () => {
    const result = findingSchema.safeParse({ ...valid, financialImpact: 250000 });
    expect(result.success).toBe(true);
  });
});

describe("csvColumnMapping", () => {
  it("requires name", () => {
    const result = csvColumnMapping.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts minimal mapping", () => {
    const result = csvColumnMapping.safeParse({ name: "Employee Name" });
    expect(result.success).toBe(true);
  });

  it("accepts full mapping", () => {
    const result = csvColumnMapping.safeParse({
      name: "Name",
      title: "Title",
      department: "Dept",
      managerId: "Mgr ID",
      managerName: "Manager",
      level: "Level",
      compensation: "Salary",
      employeeId: "EmpID",
      headcount: "HC",
      type: "Type",
    });
    expect(result.success).toBe(true);
  });
});
