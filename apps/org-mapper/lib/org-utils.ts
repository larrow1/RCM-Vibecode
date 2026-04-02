export interface OrgNode {
  id: string;
  name: string;
  title: string | null;
  department: string | null;
  type: string;
  parentId: string | null;
  level: number;
  headcount: number;
  totalCompensation: number;
  managerName: string | null;
  managerTitle: string | null;
  employeeId: string | null;
  children?: OrgNode[];
}

export interface SpanOfControlEntry {
  id: string;
  name: string;
  title: string | null;
  department: string | null;
  directReports: number;
  flag: "too-few" | "too-many" | "healthy";
}

export interface HeadcountBreakdown {
  label: string;
  headcount: number;
  compensation: number;
  avgCompensation: number;
}

export interface DuplicateGroup {
  normalizedTitle: string;
  departments: string[];
  count: number;
  entries: { name: string; title: string; department: string }[];
}

export const SPAN_MIN = 3;
export const SPAN_MAX = 12;

export function buildTree(flatNodes: OrgNode[]): OrgNode[] {
  const nodeMap = new Map<string, OrgNode>();
  const roots: OrgNode[] = [];

  for (const node of flatNodes) {
    nodeMap.set(node.id, { ...node, children: [] });
  }

  for (const node of flatNodes) {
    const current = nodeMap.get(node.id)!;
    if (node.parentId && nodeMap.has(node.parentId)) {
      nodeMap.get(node.parentId)!.children!.push(current);
    } else {
      roots.push(current);
    }
  }

  return roots;
}

export function computeSpanOfControl(flatNodes: OrgNode[]): SpanOfControlEntry[] {
  const childCount = new Map<string, number>();
  for (const node of flatNodes) {
    if (node.parentId) {
      childCount.set(node.parentId, (childCount.get(node.parentId) || 0) + 1);
    }
  }

  const results: SpanOfControlEntry[] = [];
  for (const [id, count] of childCount.entries()) {
    const node = flatNodes.find((n) => n.id === id);
    if (!node) continue;
    results.push({
      id: node.id,
      name: node.name,
      title: node.title,
      department: node.department,
      directReports: count,
      flag: count < SPAN_MIN ? "too-few" : count > SPAN_MAX ? "too-many" : "healthy",
    });
  }

  return results.sort((a, b) => b.directReports - a.directReports);
}

export function computeHeadcountByDepartment(flatNodes: OrgNode[]): HeadcountBreakdown[] {
  const deptMap = new Map<string, { headcount: number; compensation: number }>();

  for (const node of flatNodes) {
    const dept = node.department || "Unassigned";
    const current = deptMap.get(dept) || { headcount: 0, compensation: 0 };
    current.headcount += node.headcount;
    current.compensation += node.totalCompensation;
    deptMap.set(dept, current);
  }

  return Array.from(deptMap.entries())
    .map(([label, data]) => ({
      label,
      headcount: data.headcount,
      compensation: data.compensation,
      avgCompensation: data.headcount > 0 ? data.compensation / data.headcount : 0,
    }))
    .sort((a, b) => b.headcount - a.headcount);
}

export function computeHeadcountByLevel(flatNodes: OrgNode[]): HeadcountBreakdown[] {
  const levelMap = new Map<number, { headcount: number; compensation: number }>();

  for (const node of flatNodes) {
    const current = levelMap.get(node.level) || { headcount: 0, compensation: 0 };
    current.headcount += node.headcount;
    current.compensation += node.totalCompensation;
    levelMap.set(node.level, current);
  }

  return Array.from(levelMap.entries())
    .map(([level, data]) => ({
      label: `Level ${level}`,
      headcount: data.headcount,
      compensation: data.compensation,
      avgCompensation: data.headcount > 0 ? data.compensation / data.headcount : 0,
    }))
    .sort((a, b) => parseInt(a.label.split(" ")[1]) - parseInt(b.label.split(" ")[1]));
}

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\b(sr\.?|senior|jr\.?|junior|lead|principal|staff|chief)\b\.?/g, "")
    .replace(/\b(i{1,3}|iv|v|vi{0,3})\b/g, "")
    .replace(/[.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectDuplicateRoles(flatNodes: OrgNode[]): DuplicateGroup[] {
  const titleMap = new Map<
    string,
    { departments: Set<string>; entries: { name: string; title: string; department: string }[] }
  >();

  for (const node of flatNodes) {
    if (!node.title) continue;
    const normalized = normalizeTitle(node.title);
    if (!normalized) continue;

    const current = titleMap.get(normalized) || {
      departments: new Set<string>(),
      entries: [],
    };
    const dept = node.department || "Unassigned";
    current.departments.add(dept);
    current.entries.push({ name: node.name, title: node.title, department: dept });
    titleMap.set(normalized, current);
  }

  return Array.from(titleMap.entries())
    .filter(([, data]) => data.departments.size > 1)
    .map(([normalized, data]) => ({
      normalizedTitle: normalized,
      departments: Array.from(data.departments),
      count: data.entries.length,
      entries: data.entries,
    }))
    .sort((a, b) => b.count - a.count);
}

export function computeSummaryMetrics(flatNodes: OrgNode[]) {
  const totalHeadcount = flatNodes.reduce((sum, n) => sum + n.headcount, 0);
  const totalCompensation = flatNodes.reduce((sum, n) => sum + n.totalCompensation, 0);
  const levels = new Set(flatNodes.map((n) => n.level));
  const span = computeSpanOfControl(flatNodes);
  const avgSpan =
    span.length > 0 ? span.reduce((sum, s) => sum + s.directReports, 0) / span.length : 0;
  const departments = new Set(flatNodes.map((n) => n.department).filter(Boolean));

  return {
    totalHeadcount,
    totalCompensation,
    levelCount: levels.size,
    departmentCount: departments.size,
    avgSpanOfControl: Math.round(avgSpan * 10) / 10,
    managersCount: span.length,
    spanIssues: span.filter((s) => s.flag !== "healthy").length,
  };
}

export interface CsvRow {
  [key: string]: string;
}

export function parseCsvToOrgUnits(
  rows: CsvRow[],
  mapping: {
    name: string;
    title?: string;
    department?: string;
    managerId?: string;
    managerName?: string;
    level?: string;
    compensation?: string;
    employeeId?: string;
    headcount?: string;
    type?: string;
  }
): {
  units: Omit<OrgNode, "id" | "children">[];
  errors: string[];
} {
  const units: Omit<OrgNode, "id" | "children">[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const name = row[mapping.name]?.trim();
    if (!name) {
      errors.push(`Row ${i + 1}: missing name`);
      continue;
    }

    units.push({
      name,
      title: mapping.title ? row[mapping.title]?.trim() || null : null,
      department: mapping.department ? row[mapping.department]?.trim() || null : null,
      type: mapping.type ? row[mapping.type]?.trim() || "Role" : "Role",
      parentId: null, // resolved after import via managerId/managerName
      level: mapping.level ? parseInt(row[mapping.level]) || 0 : 0,
      headcount: mapping.headcount ? parseInt(row[mapping.headcount]) || 1 : 1,
      totalCompensation: mapping.compensation ? parseFloat(row[mapping.compensation]) || 0 : 0,
      managerName: mapping.managerName ? row[mapping.managerName]?.trim() || null : null,
      managerTitle: null,
      employeeId: mapping.employeeId ? row[mapping.employeeId]?.trim() || null : null,
    });
  }

  return { units, errors };
}

export function resolveParentIds(
  units: (Omit<OrgNode, "id" | "children"> & { _managerId?: string })[],
  idMap: Map<string, string>
): void {
  for (const unit of units) {
    if (unit._managerId && idMap.has(unit._managerId)) {
      unit.parentId = idMap.get(unit._managerId)!;
    } else if (unit.managerName) {
      // Try to find parent by manager name
      for (const [empId, dbId] of idMap.entries()) {
        const matchUnit = units.find((u) => u.employeeId === empId);
        if (matchUnit && matchUnit.name === unit.managerName) {
          unit.parentId = dbId;
          break;
        }
      }
    }
  }
}

export const DEPARTMENT_COLORS: Record<string, string> = {
  Executive: "bg-purple-100 border-purple-400 text-purple-900",
  Engineering: "bg-blue-100 border-blue-400 text-blue-900",
  Product: "bg-green-100 border-green-400 text-green-900",
  Sales: "bg-orange-100 border-orange-400 text-orange-900",
  Marketing: "bg-pink-100 border-pink-400 text-pink-900",
  Finance: "bg-yellow-100 border-yellow-400 text-yellow-900",
  "Human Resources": "bg-teal-100 border-teal-400 text-teal-900",
  HR: "bg-teal-100 border-teal-400 text-teal-900",
  Operations: "bg-indigo-100 border-indigo-400 text-indigo-900",
  Legal: "bg-gray-100 border-gray-400 text-gray-900",
  IT: "bg-cyan-100 border-cyan-400 text-cyan-900",
  Support: "bg-rose-100 border-rose-400 text-rose-900",
  default: "bg-slate-100 border-slate-400 text-slate-900",
};

export function getDepartmentColor(department: string | null): string {
  if (!department) return DEPARTMENT_COLORS.default;
  return DEPARTMENT_COLORS[department] || DEPARTMENT_COLORS.default;
}
