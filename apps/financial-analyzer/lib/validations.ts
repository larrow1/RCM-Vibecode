import { z } from "zod";

export const createEngagementSchema = z.object({
  name: z.string().min(1, "Name is required"),
  clientName: z.string().min(1, "Client name is required"),
  type: z.enum([
    "DueDiligence",
    "OrgAssessment",
    "ContractReview",
    "OperationalAssessment",
    "CostOptimization",
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
    .optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  scopeDescription: z.string().optional(),
});

export const updateEngagementSchema = createEngagementSchema.partial();

export const createFindingSchema = z.object({
  engagementId: z.string().min(1),
  workstream: z.enum(["Financial", "Organizational", "Contracts", "CrossCutting"]).default("Financial"),
  category: z.enum(["Risk", "Opportunity", "Observation", "Anomaly"]),
  severity: z.enum(["Critical", "High", "Medium", "Low", "Informational"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  financialImpact: z.number().optional(),
  tags: z.string().optional(),
  status: z.enum(["Draft", "Confirmed", "Disputed", "Resolved"]).default("Draft"),
  evidenceLineItemIds: z.array(z.string()).optional(),
});

export const updateFindingSchema = createFindingSchema.partial().omit({
  engagementId: true,
});

export const confirmImportSchema = z.object({
  engagementId: z.string().min(1),
  entity: z.string().min(1),
  statementType: z.enum(["ProfitAndLoss", "BalanceSheet", "CashFlow"]),
  periodType: z.enum(["Monthly", "Quarterly", "Annual"]),
  currency: z.string().default("USD"),
  sourceFileName: z.string().optional(),
  accountNameColumn: z.string().min(1),
  accountCodeColumn: z.string().optional(),
  periodAmountMappings: z.array(
    z.object({
      column: z.string(),
      period: z.string(), // e.g. "2024-01"
    })
  ),
  rows: z.array(
    z.object({
      values: z.record(z.union([z.string(), z.number()])),
    })
  ),
});

export const bulkUpdateLineItemsSchema = z.object({
  updates: z.array(
    z.object({
      id: z.string(),
      standardCategory: z.string().nullable(),
      subcategory: z.string().nullable().optional(),
    })
  ),
});

export const createEbitdaAdjustmentSchema = z.object({
  engagementId: z.string().min(1),
  description: z.string().min(1),
  amount: z.number(),
  classification: z.enum([
    "NonRecurring",
    "OwnerRelated",
    "NonOperating",
    "RunRate",
    "ProForma",
    "Other",
  ]),
  notes: z.string().optional(),
  lineItemId: z.string().optional(),
});
