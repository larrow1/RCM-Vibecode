import { z } from "zod";

export const workstreams = ["Financial", "Organizational", "Contracts", "CrossCutting"] as const;
export const categories = ["Risk", "Opportunity", "Observation", "Anomaly"] as const;
export const severities = ["Critical", "High", "Medium", "Low", "Informational"] as const;
export const findingStatuses = ["Draft", "Confirmed", "Disputed", "Resolved"] as const;
export const recommendationTypes = [
  "CostReduction",
  "RevenueEnhancement",
  "RiskMitigation",
  "OperationalImprovement",
  "StructuralChange",
] as const;
export const recommendationStatuses = ["Draft", "Reviewed", "Approved", "Presented"] as const;
export const effortLevels = ["Low", "Medium", "High"] as const;
export const timeframes = ["QuickWin", "ShortTerm", "MediumTerm", "LongTerm"] as const;
export const confidenceLevels = ["High", "Medium", "Low"] as const;
export const sourceTypes = ["FinancialStatement", "OrgUnit", "Contract", "Document", "Other"] as const;

export const evidenceSchema = z.object({
  description: z.string().min(1, "Evidence description is required"),
  sourceType: z.enum(sourceTypes).optional().nullable(),
  sourceRef: z.string().optional().nullable(),
});

export const createFindingSchema = z.object({
  engagementId: z.string().min(1),
  workstream: z.enum(workstreams),
  category: z.enum(categories),
  severity: z.enum(severities),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  financialImpact: z.number().optional().nullable(),
  tags: z.string().optional().nullable(),
  status: z.enum(findingStatuses).optional().default("Draft"),
  createdBy: z.string().optional().nullable(),
  evidence: z.array(evidenceSchema).optional().default([]),
});

export const updateFindingSchema = createFindingSchema.partial().omit({ engagementId: true });

export const createFindingLinkSchema = z.object({
  toFindingId: z.string().min(1, "Target finding ID is required"),
  description: z.string().optional().nullable(),
});

export const createRecommendationSchema = z.object({
  engagementId: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(recommendationTypes),
  status: z.enum(recommendationStatuses).optional().default("Draft"),
  impactBase: z.number().optional().nullable(),
  impactAdjPct: z.number().min(0).max(100).optional().nullable(),
  impactConfidence: z.enum(confidenceLevels).optional().nullable(),
  effort: z.enum(effortLevels).optional().nullable(),
  timeframe: z.enum(timeframes).optional().nullable(),
  risks: z.string().optional().nullable(),
  dependencies: z.string().optional().nullable(),
  findingIds: z.array(z.string()).min(1, "At least one finding is required"),
});

export const updateRecommendationSchema = createRecommendationSchema
  .partial()
  .omit({ engagementId: true });

export const createThemeSchema = z.object({
  engagementId: z.string().min(1),
  name: z.string().min(1, "Theme name is required"),
  description: z.string().optional().nullable(),
  color: z.string().optional().default("#3B82F6"),
});

export const updateThemeSchema = createThemeSchema.partial().omit({ engagementId: true });

export const impactCalculationSchema = z.object({
  impactBase: z.number().min(0),
  impactAdjPct: z.number().min(0).max(100),
  impactConfidence: z.enum(confidenceLevels),
  effort: z.enum(effortLevels),
});
