import { describe, it, expect } from "vitest";
import {
  ASSESSMENT_TEMPLATES,
  getTemplateForType,
  generateFlowFromTemplate,
  computeFlowProgress,
  getPhaseStatus,
} from "@/lib/flow-templates";

describe("ASSESSMENT_TEMPLATES", () => {
  it("should have three templates", () => {
    const keys = Object.keys(ASSESSMENT_TEMPLATES);
    expect(keys).toHaveLength(3);
    expect(keys).toContain("full-assessment");
    expect(keys).toContain("financial-dd");
    expect(keys).toContain("operational-review");
  });

  it("full-assessment should have 5 phases", () => {
    const template = ASSESSMENT_TEMPLATES["full-assessment"];
    expect(template.phases).toHaveLength(5);
    expect(template.phases[0].name).toBe("Scoping & Planning");
    expect(template.phases[4].name).toBe("Deliverable & Presentation");
  });

  it("financial-dd should have 4 phases", () => {
    const template = ASSESSMENT_TEMPLATES["financial-dd"];
    expect(template.phases).toHaveLength(4);
    expect(template.phases[0].name).toBe("Scoping");
    expect(template.phases[3].name).toBe("Reporting");
  });

  it("operational-review should have 3 phases", () => {
    const template = ASSESSMENT_TEMPLATES["operational-review"];
    expect(template.phases).toHaveLength(3);
    expect(template.phases[0].name).toBe("Discovery");
  });

  it("every phase should have at least one task", () => {
    for (const [, template] of Object.entries(ASSESSMENT_TEMPLATES)) {
      for (const phase of template.phases) {
        expect(phase.tasks.length).toBeGreaterThan(0);
      }
    }
  });

  it("every task should have a valid priority", () => {
    const validPriorities = ["Critical", "High", "Medium", "Low"];
    for (const [, template] of Object.entries(ASSESSMENT_TEMPLATES)) {
      for (const phase of template.phases) {
        for (const task of phase.tasks) {
          expect(validPriorities).toContain(task.priority);
        }
      }
    }
  });
});

describe("getTemplateForType", () => {
  it("should return full-assessment for Full Assessment type", () => {
    const template = getTemplateForType("Full Assessment");
    expect(template.name).toBe("Full Assessment");
  });

  it("should return financial-dd for Financial Due Diligence type", () => {
    const template = getTemplateForType("Financial Due Diligence");
    expect(template.name).toBe("Financial Due Diligence");
  });

  it("should return operational-review for Operational Review type", () => {
    const template = getTemplateForType("Operational Review");
    expect(template.name).toBe("Operational Review");
  });

  it("should default to full-assessment for unknown types", () => {
    const template = getTemplateForType("Unknown Type");
    expect(template.name).toBe("Full Assessment");
  });
});

describe("generateFlowFromTemplate", () => {
  it("should return all phases for full template", () => {
    const template = ASSESSMENT_TEMPLATES["full-assessment"];
    const result = generateFlowFromTemplate(template);
    expect(result.phases).toHaveLength(5);
  });

  it("should return all phases when scope is empty", () => {
    const template = ASSESSMENT_TEMPLATES["full-assessment"];
    const result = generateFlowFromTemplate(template, "");
    expect(result.phases).toHaveLength(5);
  });

  it("should not modify original template", () => {
    const template = ASSESSMENT_TEMPLATES["full-assessment"];
    const originalLength = template.phases.length;
    generateFlowFromTemplate(template, "financial only");
    expect(template.phases).toHaveLength(originalLength);
  });
});

describe("computeFlowProgress", () => {
  it("should return 0% for no tasks", () => {
    const result = computeFlowProgress([]);
    expect(result.totalTasks).toBe(0);
    expect(result.completedTasks).toBe(0);
    expect(result.percentage).toBe(0);
  });

  it("should return 0% for phases with no tasks", () => {
    const result = computeFlowProgress([{ tasks: [] }]);
    expect(result.totalTasks).toBe(0);
    expect(result.percentage).toBe(0);
  });

  it("should return 100% when all tasks completed", () => {
    const result = computeFlowProgress([
      { tasks: [{ status: "Completed" }, { status: "Completed" }] },
      { tasks: [{ status: "Completed" }] },
    ]);
    expect(result.totalTasks).toBe(3);
    expect(result.completedTasks).toBe(3);
    expect(result.percentage).toBe(100);
  });

  it("should return correct percentage for partial completion", () => {
    const result = computeFlowProgress([
      { tasks: [{ status: "Completed" }, { status: "Pending" }] },
      { tasks: [{ status: "Completed" }, { status: "In Progress" }] },
    ]);
    expect(result.totalTasks).toBe(4);
    expect(result.completedTasks).toBe(2);
    expect(result.percentage).toBe(50);
  });

  it("should round percentage", () => {
    const result = computeFlowProgress([
      { tasks: [{ status: "Completed" }, { status: "Pending" }, { status: "Pending" }] },
    ]);
    expect(result.percentage).toBe(33);
  });
});

describe("getPhaseStatus", () => {
  it("should return Not Started for empty tasks", () => {
    expect(getPhaseStatus([])).toBe("Not Started");
  });

  it("should return Not Started when all tasks are Pending", () => {
    expect(getPhaseStatus([
      { status: "Pending" },
      { status: "Pending" },
    ])).toBe("Not Started");
  });

  it("should return In Progress when some tasks are In Progress", () => {
    expect(getPhaseStatus([
      { status: "Pending" },
      { status: "In Progress" },
    ])).toBe("In Progress");
  });

  it("should return In Progress when some tasks are Completed but not all", () => {
    expect(getPhaseStatus([
      { status: "Completed" },
      { status: "Pending" },
    ])).toBe("In Progress");
  });

  it("should return Completed when all tasks are Completed", () => {
    expect(getPhaseStatus([
      { status: "Completed" },
      { status: "Completed" },
    ])).toBe("Completed");
  });

  it("should return Completed when all tasks are Completed or Skipped", () => {
    expect(getPhaseStatus([
      { status: "Completed" },
      { status: "Skipped" },
    ])).toBe("Completed");
  });

  it("should return Blocked when any task is Blocked", () => {
    expect(getPhaseStatus([
      { status: "Completed" },
      { status: "Blocked" },
    ])).toBe("Blocked");
  });
});
