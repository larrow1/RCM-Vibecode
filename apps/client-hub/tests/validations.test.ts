import { describe, it, expect } from "vitest";
import {
  createClientSchema,
  createContactSchema,
  createEngagementSchema,
} from "@/lib/validations";

describe("createClientSchema", () => {
  it("accepts valid client data with only name", () => {
    const result = createClientSchema.safeParse({ name: "Acme Corp" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Acme Corp");
      expect(result.data.status).toBe("Active");
    }
  });

  it("accepts full client data", () => {
    const result = createClientSchema.safeParse({
      name: "Global Tech",
      industry: "Technology",
      website: "https://globaltech.com",
      notes: "Important client",
      status: "Prospect",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createClientSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects name exceeding 200 characters", () => {
    const result = createClientSchema.safeParse({ name: "A".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = createClientSchema.safeParse({
      name: "Test",
      status: "Invalid",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid statuses", () => {
    for (const status of ["Prospect", "Active", "Inactive"]) {
      const result = createClientSchema.safeParse({ name: "Test", status });
      expect(result.success).toBe(true);
    }
  });
});

describe("createContactSchema", () => {
  it("accepts valid contact with only name", () => {
    const result = createContactSchema.safeParse({ name: "John Smith" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isPrimary).toBe(false);
    }
  });

  it("accepts full contact data", () => {
    const result = createContactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+1-555-0101",
      role: "VP Engineering",
      isPrimary: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createContactSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const result = createContactSchema.safeParse({
      name: "Test",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty email string", () => {
    const result = createContactSchema.safeParse({
      name: "Test",
      email: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("createEngagementSchema", () => {
  it("accepts valid engagement with required fields", () => {
    const result = createEngagementSchema.safeParse({
      clientId: "client-1",
      name: "Cloud Migration",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe("TM");
      expect(result.data.status).toBe("Lead");
    }
  });

  it("accepts full engagement data", () => {
    const result = createEngagementSchema.safeParse({
      clientId: "client-1",
      name: "Operations Review",
      description: "End-to-end operations review",
      type: "FixedFee",
      status: "Active",
      startDate: "2026-01-15",
      endDate: "2026-06-30",
      budget: 250000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing clientId", () => {
    const result = createEngagementSchema.safeParse({ name: "Test" });
    expect(result.success).toBe(false);
  });

  it("rejects missing name", () => {
    const result = createEngagementSchema.safeParse({ clientId: "client-1" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid engagement type", () => {
    const result = createEngagementSchema.safeParse({
      clientId: "client-1",
      name: "Test",
      type: "InvalidType",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid engagement status", () => {
    const result = createEngagementSchema.safeParse({
      clientId: "client-1",
      name: "Test",
      status: "InvalidStatus",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid engagement types", () => {
    for (const type of ["TM", "FixedFee", "Retainer", "ValueBased"]) {
      const result = createEngagementSchema.safeParse({
        clientId: "client-1",
        name: "Test",
        type,
      });
      expect(result.success).toBe(true);
    }
  });

  it("accepts all valid engagement statuses", () => {
    for (const status of ["Lead", "Proposal", "Active", "Delivered", "Closed"]) {
      const result = createEngagementSchema.safeParse({
        clientId: "client-1",
        name: "Test",
        status,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects negative budget", () => {
    const result = createEngagementSchema.safeParse({
      clientId: "client-1",
      name: "Test",
      budget: -1000,
    });
    expect(result.success).toBe(false);
  });
});
