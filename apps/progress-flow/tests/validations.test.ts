import { describe, it, expect } from "vitest";
import {
  createFlowSchema,
  updateFlowSchema,
  createPhaseSchema,
  updatePhaseSchema,
  createTaskSchema,
  updateTaskSchema,
  generateFlowSchema,
} from "@/lib/validations";

describe("createFlowSchema", () => {
  it("should accept valid input", () => {
    const result = createFlowSchema.parse({
      engagementId: "eng-123",
      name: "My Flow",
    });
    expect(result.engagementId).toBe("eng-123");
    expect(result.name).toBe("My Flow");
  });

  it("should accept optional description", () => {
    const result = createFlowSchema.parse({
      engagementId: "eng-123",
      name: "My Flow",
      description: "A description",
    });
    expect(result.description).toBe("A description");
  });

  it("should reject empty engagement ID", () => {
    expect(() =>
      createFlowSchema.parse({ engagementId: "", name: "My Flow" })
    ).toThrow();
  });

  it("should reject empty name", () => {
    expect(() =>
      createFlowSchema.parse({ engagementId: "eng-123", name: "" })
    ).toThrow();
  });

  it("should reject name over 200 characters", () => {
    expect(() =>
      createFlowSchema.parse({ engagementId: "eng-123", name: "x".repeat(201) })
    ).toThrow();
  });
});

describe("updateFlowSchema", () => {
  it("should accept valid status", () => {
    const result = updateFlowSchema.parse({ status: "In Progress" });
    expect(result.status).toBe("In Progress");
  });

  it("should accept all valid statuses", () => {
    for (const status of ["Not Started", "In Progress", "Completed", "On Hold"]) {
      expect(updateFlowSchema.parse({ status }).status).toBe(status);
    }
  });

  it("should reject invalid status", () => {
    expect(() => updateFlowSchema.parse({ status: "Invalid" })).toThrow();
  });

  it("should accept partial updates", () => {
    const result = updateFlowSchema.parse({ name: "Updated" });
    expect(result.name).toBe("Updated");
    expect(result.status).toBeUndefined();
  });
});

describe("createPhaseSchema", () => {
  it("should accept valid input", () => {
    const result = createPhaseSchema.parse({ name: "Phase 1" });
    expect(result.name).toBe("Phase 1");
  });

  it("should accept optional fields", () => {
    const result = createPhaseSchema.parse({
      name: "Phase 1",
      description: "First phase",
      sortOrder: 0,
      startDate: "2026-01-01",
    });
    expect(result.description).toBe("First phase");
    expect(result.sortOrder).toBe(0);
  });

  it("should reject empty name", () => {
    expect(() => createPhaseSchema.parse({ name: "" })).toThrow();
  });
});

describe("updatePhaseSchema", () => {
  it("should accept valid statuses", () => {
    for (const status of ["Not Started", "In Progress", "Completed", "Blocked"]) {
      expect(updatePhaseSchema.parse({ status }).status).toBe(status);
    }
  });

  it("should reject invalid status", () => {
    expect(() => updatePhaseSchema.parse({ status: "Done" })).toThrow();
  });
});

describe("createTaskSchema", () => {
  it("should accept valid input", () => {
    const result = createTaskSchema.parse({ title: "My Task" });
    expect(result.title).toBe("My Task");
  });

  it("should accept all priority levels", () => {
    for (const priority of ["Critical", "High", "Medium", "Low"]) {
      const result = createTaskSchema.parse({ title: "Task", priority });
      expect(result.priority).toBe(priority);
    }
  });

  it("should reject empty title", () => {
    expect(() => createTaskSchema.parse({ title: "" })).toThrow();
  });

  it("should reject invalid priority", () => {
    expect(() =>
      createTaskSchema.parse({ title: "Task", priority: "Urgent" })
    ).toThrow();
  });

  it("should reject title over 300 characters", () => {
    expect(() =>
      createTaskSchema.parse({ title: "x".repeat(301) })
    ).toThrow();
  });
});

describe("updateTaskSchema", () => {
  it("should accept valid task statuses", () => {
    for (const status of ["Pending", "In Progress", "Completed", "Blocked", "Skipped"]) {
      expect(updateTaskSchema.parse({ status }).status).toBe(status);
    }
  });

  it("should reject invalid status", () => {
    expect(() => updateTaskSchema.parse({ status: "Done" })).toThrow();
  });

  it("should accept partial updates", () => {
    const result = updateTaskSchema.parse({ assignee: "John" });
    expect(result.assignee).toBe("John");
    expect(result.status).toBeUndefined();
  });
});

describe("generateFlowSchema", () => {
  it("should accept valid input", () => {
    const result = generateFlowSchema.parse({
      engagementId: "eng-123",
      engagementType: "Full Assessment",
    });
    expect(result.engagementId).toBe("eng-123");
  });

  it("should accept optional scope", () => {
    const result = generateFlowSchema.parse({
      engagementId: "eng-123",
      engagementType: "Full Assessment",
      scope: "Financial only",
    });
    expect(result.scope).toBe("Financial only");
  });

  it("should reject empty engagement ID", () => {
    expect(() =>
      generateFlowSchema.parse({ engagementId: "", engagementType: "Full Assessment" })
    ).toThrow();
  });
});
