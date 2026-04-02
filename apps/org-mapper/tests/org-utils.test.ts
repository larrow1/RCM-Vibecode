import { describe, it, expect } from "vitest";
import {
  buildTree,
  computeSpanOfControl,
  computeHeadcountByDepartment,
  computeHeadcountByLevel,
  normalizeTitle,
  detectDuplicateRoles,
  computeSummaryMetrics,
  getDepartmentColor,
  SPAN_MIN,
  SPAN_MAX,
  DEPARTMENT_COLORS,
  type OrgNode,
} from "@/lib/org-utils";

// Helper to create a test node
function node(overrides: Partial<OrgNode> & { id: string }): OrgNode {
  return {
    name: "Test",
    title: null,
    department: null,
    type: "Role",
    parentId: null,
    level: 0,
    headcount: 1,
    totalCompensation: 100000,
    managerName: null,
    managerTitle: null,
    employeeId: null,
    ...overrides,
  };
}

describe("buildTree", () => {
  it("returns roots when no parents", () => {
    const nodes = [
      node({ id: "1", name: "CEO" }),
      node({ id: "2", name: "CTO" }),
    ];
    const tree = buildTree(nodes);
    expect(tree).toHaveLength(2);
    expect(tree[0].children).toHaveLength(0);
  });

  it("nests children under parents", () => {
    const nodes = [
      node({ id: "1", name: "CEO", level: 0 }),
      node({ id: "2", name: "CTO", parentId: "1", level: 1 }),
      node({ id: "3", name: "Dev", parentId: "2", level: 2 }),
    ];
    const tree = buildTree(nodes);
    expect(tree).toHaveLength(1);
    expect(tree[0].name).toBe("CEO");
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children![0].name).toBe("CTO");
    expect(tree[0].children![0].children).toHaveLength(1);
    expect(tree[0].children![0].children![0].name).toBe("Dev");
  });

  it("handles multiple roots", () => {
    const nodes = [
      node({ id: "1", name: "CEO" }),
      node({ id: "2", name: "Board Chair" }),
      node({ id: "3", name: "VP", parentId: "1" }),
    ];
    const tree = buildTree(nodes);
    expect(tree).toHaveLength(2);
  });

  it("handles orphan nodes (parent not in list)", () => {
    const nodes = [
      node({ id: "1", name: "Orphan", parentId: "nonexistent" }),
    ];
    const tree = buildTree(nodes);
    expect(tree).toHaveLength(1); // treated as root
  });

  it("returns empty array for empty input", () => {
    expect(buildTree([])).toHaveLength(0);
  });
});

describe("computeSpanOfControl", () => {
  it("counts direct reports per manager", () => {
    const nodes = [
      node({ id: "1", name: "CEO", level: 0 }),
      node({ id: "2", name: "VP1", parentId: "1", level: 1 }),
      node({ id: "3", name: "VP2", parentId: "1", level: 1 }),
      node({ id: "4", name: "VP3", parentId: "1", level: 1 }),
    ];
    const span = computeSpanOfControl(nodes);
    expect(span).toHaveLength(1);
    expect(span[0].name).toBe("CEO");
    expect(span[0].directReports).toBe(3);
    expect(span[0].flag).toBe("healthy");
  });

  it("flags too few direct reports", () => {
    const nodes = [
      node({ id: "1", name: "Manager" }),
      node({ id: "2", name: "Report1", parentId: "1" }),
      node({ id: "3", name: "Report2", parentId: "1" }),
    ];
    const span = computeSpanOfControl(nodes);
    expect(span[0].directReports).toBe(2);
    expect(span[0].flag).toBe("too-few");
  });

  it("flags too many direct reports", () => {
    const reports = Array.from({ length: 13 }, (_, i) =>
      node({ id: `r${i}`, name: `Report ${i}`, parentId: "mgr" })
    );
    const nodes = [node({ id: "mgr", name: "Manager" }), ...reports];
    const span = computeSpanOfControl(nodes);
    expect(span[0].directReports).toBe(13);
    expect(span[0].flag).toBe("too-many");
  });

  it("returns empty for flat org (no parent relationships)", () => {
    const nodes = [
      node({ id: "1", name: "A" }),
      node({ id: "2", name: "B" }),
    ];
    expect(computeSpanOfControl(nodes)).toHaveLength(0);
  });

  it("sorts by direct reports descending", () => {
    const nodes = [
      node({ id: "1", name: "Small Manager" }),
      node({ id: "2", name: "Big Manager" }),
      node({ id: "r1", parentId: "1" }),
      node({ id: "r2", parentId: "1" }),
      node({ id: "r3", parentId: "1" }),
      node({ id: "r4", parentId: "2" }),
      node({ id: "r5", parentId: "2" }),
      node({ id: "r6", parentId: "2" }),
      node({ id: "r7", parentId: "2" }),
      node({ id: "r8", parentId: "2" }),
    ];
    const span = computeSpanOfControl(nodes);
    expect(span[0].name).toBe("Big Manager");
    expect(span[0].directReports).toBe(5);
  });

  it("uses correct threshold constants", () => {
    expect(SPAN_MIN).toBe(3);
    expect(SPAN_MAX).toBe(12);
  });
});

describe("computeHeadcountByDepartment", () => {
  it("groups headcount by department", () => {
    const nodes = [
      node({ id: "1", department: "Engineering", headcount: 5, totalCompensation: 500000 }),
      node({ id: "2", department: "Engineering", headcount: 3, totalCompensation: 300000 }),
      node({ id: "3", department: "Sales", headcount: 4, totalCompensation: 400000 }),
    ];
    const result = computeHeadcountByDepartment(nodes);
    expect(result).toHaveLength(2);
    const eng = result.find((r) => r.label === "Engineering")!;
    expect(eng.headcount).toBe(8);
    expect(eng.compensation).toBe(800000);
    expect(eng.avgCompensation).toBe(100000);
  });

  it("uses 'Unassigned' for null department", () => {
    const nodes = [node({ id: "1", department: null, headcount: 2 })];
    const result = computeHeadcountByDepartment(nodes);
    expect(result[0].label).toBe("Unassigned");
  });

  it("sorts by headcount descending", () => {
    const nodes = [
      node({ id: "1", department: "Small", headcount: 2 }),
      node({ id: "2", department: "Big", headcount: 10 }),
    ];
    const result = computeHeadcountByDepartment(nodes);
    expect(result[0].label).toBe("Big");
  });

  it("handles zero headcount without division by zero", () => {
    const nodes = [node({ id: "1", department: "Empty", headcount: 0, totalCompensation: 0 })];
    const result = computeHeadcountByDepartment(nodes);
    expect(result[0].avgCompensation).toBe(0);
  });
});

describe("computeHeadcountByLevel", () => {
  it("groups by level", () => {
    const nodes = [
      node({ id: "1", level: 0, headcount: 1 }),
      node({ id: "2", level: 1, headcount: 3 }),
      node({ id: "3", level: 1, headcount: 2 }),
      node({ id: "4", level: 2, headcount: 5 }),
    ];
    const result = computeHeadcountByLevel(nodes);
    expect(result).toHaveLength(3);
    expect(result[0].label).toBe("Level 0");
    expect(result[0].headcount).toBe(1);
    expect(result[1].label).toBe("Level 1");
    expect(result[1].headcount).toBe(5);
    expect(result[2].label).toBe("Level 2");
    expect(result[2].headcount).toBe(5);
  });

  it("sorts by level ascending", () => {
    const nodes = [
      node({ id: "1", level: 3 }),
      node({ id: "2", level: 1 }),
      node({ id: "3", level: 0 }),
    ];
    const result = computeHeadcountByLevel(nodes);
    expect(result[0].label).toBe("Level 0");
    expect(result[1].label).toBe("Level 1");
    expect(result[2].label).toBe("Level 3");
  });
});

describe("normalizeTitle", () => {
  it("lowercases and strips seniority prefixes", () => {
    expect(normalizeTitle("Senior Software Engineer")).toBe("software engineer");
    expect(normalizeTitle("Jr. Data Analyst")).toBe("data analyst");
    expect(normalizeTitle("Lead Designer")).toBe("designer");
  });

  it("strips roman numeral suffixes", () => {
    expect(normalizeTitle("Analyst II")).toBe("analyst");
    expect(normalizeTitle("Engineer III")).toBe("engineer");
  });

  it("normalizes whitespace", () => {
    expect(normalizeTitle("  Software   Engineer  ")).toBe("software engineer");
  });

  it("handles already normalized titles", () => {
    expect(normalizeTitle("manager")).toBe("manager");
  });

  it("strips 'principal' and 'staff'", () => {
    expect(normalizeTitle("Principal Engineer")).toBe("engineer");
    expect(normalizeTitle("Staff Designer")).toBe("designer");
  });

  it("strips 'chief'", () => {
    expect(normalizeTitle("Chief Operating Officer")).toBe("operating officer");
  });
});

describe("detectDuplicateRoles", () => {
  it("finds titles appearing in multiple departments", () => {
    const nodes = [
      node({ id: "1", title: "Software Engineer", department: "Engineering" }),
      node({ id: "2", title: "Software Engineer", department: "Data" }),
      node({ id: "3", title: "Designer", department: "Marketing" }),
    ];
    const dupes = detectDuplicateRoles(nodes);
    expect(dupes).toHaveLength(1);
    expect(dupes[0].normalizedTitle).toBe("software engineer");
    expect(dupes[0].departments).toContain("Engineering");
    expect(dupes[0].departments).toContain("Data");
    expect(dupes[0].count).toBe(2);
  });

  it("matches across seniority levels", () => {
    const nodes = [
      node({ id: "1", title: "Senior Engineer", department: "Backend" }),
      node({ id: "2", title: "Junior Engineer", department: "Frontend" }),
    ];
    const dupes = detectDuplicateRoles(nodes);
    expect(dupes).toHaveLength(1);
    expect(dupes[0].normalizedTitle).toBe("engineer");
  });

  it("ignores titles only in one department", () => {
    const nodes = [
      node({ id: "1", title: "Engineer", department: "Engineering" }),
      node({ id: "2", title: "Engineer", department: "Engineering" }),
    ];
    const dupes = detectDuplicateRoles(nodes);
    expect(dupes).toHaveLength(0);
  });

  it("handles null titles gracefully", () => {
    const nodes = [
      node({ id: "1", title: null, department: "A" }),
      node({ id: "2", title: "Engineer", department: "B" }),
    ];
    const dupes = detectDuplicateRoles(nodes);
    expect(dupes).toHaveLength(0);
  });

  it("sorts by count descending", () => {
    const nodes = [
      node({ id: "1", title: "Analyst", department: "A" }),
      node({ id: "2", title: "Analyst", department: "B" }),
      node({ id: "3", title: "Engineer", department: "C" }),
      node({ id: "4", title: "Engineer", department: "D" }),
      node({ id: "5", title: "Engineer", department: "E" }),
    ];
    const dupes = detectDuplicateRoles(nodes);
    expect(dupes[0].normalizedTitle).toBe("engineer");
    expect(dupes[0].count).toBe(3);
  });
});

describe("computeSummaryMetrics", () => {
  const sampleNodes = [
    node({ id: "1", level: 0, headcount: 1, totalCompensation: 400000 }),
    node({ id: "2", level: 1, headcount: 1, totalCompensation: 300000, parentId: "1", department: "Engineering" }),
    node({ id: "3", level: 1, headcount: 1, totalCompensation: 250000, parentId: "1", department: "Sales" }),
    node({ id: "4", level: 2, headcount: 1, totalCompensation: 150000, parentId: "2", department: "Engineering" }),
    node({ id: "5", level: 2, headcount: 1, totalCompensation: 120000, parentId: "2", department: "Engineering" }),
    node({ id: "6", level: 2, headcount: 1, totalCompensation: 130000, parentId: "3", department: "Sales" }),
  ];

  it("computes total headcount", () => {
    const m = computeSummaryMetrics(sampleNodes);
    expect(m.totalHeadcount).toBe(6);
  });

  it("computes total compensation", () => {
    const m = computeSummaryMetrics(sampleNodes);
    expect(m.totalCompensation).toBe(1350000);
  });

  it("computes level count", () => {
    const m = computeSummaryMetrics(sampleNodes);
    expect(m.levelCount).toBe(3);
  });

  it("computes department count (excluding null)", () => {
    const m = computeSummaryMetrics(sampleNodes);
    expect(m.departmentCount).toBe(2);
  });

  it("computes managers count", () => {
    const m = computeSummaryMetrics(sampleNodes);
    // nodes 1, 2, and 3 are managers
    expect(m.managersCount).toBe(3);
  });

  it("computes avg span of control", () => {
    const m = computeSummaryMetrics(sampleNodes);
    // node 1: 2 reports, node 2: 2 reports, node 3: 1 report => avg = 5/3 = 1.7
    expect(m.avgSpanOfControl).toBe(1.7);
  });

  it("counts span issues", () => {
    const m = computeSummaryMetrics(sampleNodes);
    // all managers have <3 reports
    expect(m.spanIssues).toBe(3);
  });

  it("handles empty input", () => {
    const m = computeSummaryMetrics([]);
    expect(m.totalHeadcount).toBe(0);
    expect(m.totalCompensation).toBe(0);
    expect(m.avgSpanOfControl).toBe(0);
    expect(m.managersCount).toBe(0);
  });
});

describe("getDepartmentColor", () => {
  it("returns correct color for known departments", () => {
    expect(getDepartmentColor("Engineering")).toBe(DEPARTMENT_COLORS.Engineering);
    expect(getDepartmentColor("Sales")).toBe(DEPARTMENT_COLORS.Sales);
    expect(getDepartmentColor("Finance")).toBe(DEPARTMENT_COLORS.Finance);
  });

  it("returns default for unknown department", () => {
    expect(getDepartmentColor("Unknown Dept")).toBe(DEPARTMENT_COLORS.default);
  });

  it("returns default for null", () => {
    expect(getDepartmentColor(null)).toBe(DEPARTMENT_COLORS.default);
  });
});
