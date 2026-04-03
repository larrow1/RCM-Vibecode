import { describe, it, expect } from "vitest";
import {
  ideaSchema,
  ideaUpdateSchema,
  commentSchema,
  voteSchema,
  CATEGORIES,
  PERSONAS,
  STATUSES,
} from "@/lib/validations";

describe("ideaSchema", () => {
  const valid = {
    title: "Test Idea Title Here",
    description: "This is a description that is at least 20 characters long for validation",
    authorName: "Alice",
    category: "pattern-recognition" as const,
  };

  it("accepts valid input", () => {
    expect(ideaSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects title shorter than 5 chars", () => {
    expect(ideaSchema.safeParse({ ...valid, title: "Hi" }).success).toBe(false);
  });

  it("rejects description shorter than 20 chars", () => {
    expect(ideaSchema.safeParse({ ...valid, description: "Too short" }).success).toBe(false);
  });

  it("rejects missing authorName", () => {
    expect(ideaSchema.safeParse({ ...valid, authorName: "" }).success).toBe(false);
  });

  it("rejects invalid category", () => {
    expect(ideaSchema.safeParse({ ...valid, category: "invalid" }).success).toBe(false);
  });

  it("accepts all valid categories", () => {
    for (const cat of CATEGORIES) {
      expect(ideaSchema.safeParse({ ...valid, category: cat }).success).toBe(true);
    }
  });

  it("accepts all valid personas", () => {
    for (const p of PERSONAS) {
      expect(ideaSchema.safeParse({ ...valid, persona: p }).success).toBe(true);
    }
  });

  it("accepts optional tags", () => {
    expect(ideaSchema.safeParse({ ...valid, tags: "ai,finance" }).success).toBe(true);
  });

  it("accepts without optional fields", () => {
    const result = ideaSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});

describe("ideaUpdateSchema", () => {
  it("accepts valid status update", () => {
    for (const status of STATUSES) {
      expect(ideaUpdateSchema.safeParse({ status }).success).toBe(true);
    }
  });

  it("accepts priority values", () => {
    for (const p of ["low", "medium", "high", "critical"]) {
      expect(ideaUpdateSchema.safeParse({ priority: p }).success).toBe(true);
    }
  });

  it("accepts effort values", () => {
    for (const e of ["low", "medium", "high"]) {
      expect(ideaUpdateSchema.safeParse({ effort: e }).success).toBe(true);
    }
  });

  it("accepts impact values", () => {
    for (const i of ["low", "medium", "high", "very-high"]) {
      expect(ideaUpdateSchema.safeParse({ impact: i }).success).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(ideaUpdateSchema.safeParse({ status: "invalid" }).success).toBe(false);
  });

  it("accepts empty object (all optional)", () => {
    expect(ideaUpdateSchema.safeParse({}).success).toBe(true);
  });
});

describe("commentSchema", () => {
  const valid = {
    ideaId: "abc123",
    authorName: "Bob",
    content: "Great idea!",
  };

  it("accepts valid input", () => {
    expect(commentSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty content", () => {
    expect(commentSchema.safeParse({ ...valid, content: "" }).success).toBe(false);
  });

  it("rejects missing authorName", () => {
    expect(commentSchema.safeParse({ ...valid, authorName: "" }).success).toBe(false);
  });

  it("accepts all valid roles", () => {
    for (const role of ["user", "product-manager", "architect", "developer"]) {
      expect(commentSchema.safeParse({ ...valid, role }).success).toBe(true);
    }
  });

  it("rejects invalid role", () => {
    expect(commentSchema.safeParse({ ...valid, role: "admin" }).success).toBe(false);
  });
});

describe("voteSchema", () => {
  it("accepts valid voter name", () => {
    expect(voteSchema.safeParse({ voterName: "Alice" }).success).toBe(true);
  });

  it("rejects empty voter name", () => {
    expect(voteSchema.safeParse({ voterName: "" }).success).toBe(false);
  });
});

describe("constants", () => {
  it("has 7 categories matching assessment fundamentals", () => {
    expect(CATEGORIES).toHaveLength(7);
    expect(CATEGORIES).toContain("evidence-collection");
    expect(CATEGORIES).toContain("cross-domain-synthesis");
  });

  it("has 5 personas", () => {
    expect(PERSONAS).toHaveLength(5);
    expect(PERSONAS).toContain("Rachel");
    expect(PERSONAS).toContain("James");
    expect(PERSONAS).toContain("All");
  });

  it("has 7 statuses covering the lifecycle", () => {
    expect(STATUSES).toHaveLength(7);
    expect(STATUSES).toContain("submitted");
    expect(STATUSES).toContain("shipped");
    expect(STATUSES).toContain("declined");
  });
});
