import { z } from "zod";

export const engagementSchema = z.object({
  name: z.string().min(1, "Name is required"),
  clientName: z.string().min(1, "Client name is required"),
  type: z.enum([
    "OrgAssessment",
    "DueDiligence",
    "CostOptimization",
    "OperationalAssessment",
    "PostMergerIntegration",
  ]),
  status: z
    .enum([
      "Scoping",
      "DataCollection",
      "Analysis",
      "Synthesis",
      "Reporting",
      "Complete",
    ])
    .default("Analysis"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  scopeDescription: z.string().optional(),
});

export const orgUnitSchema = z.object({
  engagementId: z.string().min(1),
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  department: z.string().optional(),
  type: z.enum(["Division", "Department", "Team", "Role"]).default("Role"),
  parentId: z.string().nullable().optional(),
  level: z.number().int().min(0).default(0),
  headcount: z.number().int().min(0).default(1),
  totalCompensation: z.number().min(0).default(0),
  managerName: z.string().optional(),
  managerTitle: z.string().optional(),
  employeeId: z.string().optional(),
});

export const orgUnitUpdateSchema = orgUnitSchema.partial().omit({ engagementId: true });

export const findingSchema = z.object({
  engagementId: z.string().min(1),
  orgUnitId: z.string().nullable().optional(),
  workstream: z.string().default("Organizational"),
  category: z.enum(["Risk", "Opportunity", "Observation", "Anomaly"]),
  severity: z.enum(["Critical", "High", "Medium", "Low", "Informational"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  financialImpact: z.number().nullable().optional(),
  tags: z.string().optional(),
  status: z.enum(["Draft", "Confirmed", "Disputed", "Resolved"]).default("Draft"),
});

export const findingUpdateSchema = findingSchema.partial().omit({ engagementId: true });

export const csvColumnMapping = z.object({
  name: z.string().min(1),
  title: z.string().optional(),
  department: z.string().optional(),
  managerId: z.string().optional(),
  managerName: z.string().optional(),
  level: z.string().optional(),
  compensation: z.string().optional(),
  employeeId: z.string().optional(),
  headcount: z.string().optional(),
  type: z.string().optional(),
});

export type EngagementInput = z.infer<typeof engagementSchema>;
export type OrgUnitInput = z.infer<typeof orgUnitSchema>;
export type FindingInput = z.infer<typeof findingSchema>;
export type CsvColumnMapping = z.infer<typeof csvColumnMapping>;
