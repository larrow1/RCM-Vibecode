import { z } from "zod";

// Engagement types
export const ENGAGEMENT_TYPES = [
  "DueDiligence",
  "OrgAssessment",
  "ContractReview",
  "OperationalAssessment",
  "CostOptimization",
] as const;

export const ENGAGEMENT_STATUSES = [
  "Scoping",
  "DataCollection",
  "Analysis",
  "Synthesis",
  "Reporting",
  "Complete",
] as const;

export const DATA_REQUEST_CATEGORIES = [
  "Financial",
  "Organizational",
  "Contracts",
  "Operational",
  "Legal",
  "IT",
] as const;

export const DATA_REQUEST_STATUSES = [
  "Requested",
  "Received",
  "PartiallyReceived",
  "Overdue",
  "NotAvailable",
] as const;

export const DATA_REQUEST_PRIORITIES = [
  "Critical",
  "High",
  "Medium",
  "Low",
] as const;

export const DOCUMENT_FILE_TYPES = [
  "PDF",
  "Excel",
  "CSV",
  "Word",
  "Image",
  "Other",
] as const;

export const DOCUMENT_CATEGORIES = [
  "FinancialStatement",
  "OrgChart",
  "Contract",
  "Policy",
  "HRData",
  "Other",
] as const;

export const DOCUMENT_STATUSES = [
  "Pending",
  "Reviewed",
  "Extracted",
  "Flagged",
] as const;

export const TEAM_ROLES = [
  "Lead",
  "Financial Analyst",
  "Org Consultant",
  "Contract Specialist",
  "Associate",
] as const;

export const WORKSTREAMS = ["Financial", "Organizational", "Contracts"] as const;

// Zod schemas
export const createEngagementSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  clientName: z.string().min(1, "Client name is required").max(200),
  type: z.enum(ENGAGEMENT_TYPES),
  status: z.enum(ENGAGEMENT_STATUSES).optional().default("Scoping"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  scopeDescription: z.string().optional().nullable(),
});

export const updateEngagementSchema = createEngagementSchema.partial();

export const createDataRequestSchema = z.object({
  category: z.enum(DATA_REQUEST_CATEGORIES),
  description: z.string().min(1, "Description is required").max(1000),
  priority: z.enum(DATA_REQUEST_PRIORITIES).optional().default("Medium"),
  status: z.enum(DATA_REQUEST_STATUSES).optional().default("Requested"),
  dueDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateDataRequestSchema = createDataRequestSchema.partial();

export const bulkUpdateDataRequestSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one ID is required"),
  status: z.enum(DATA_REQUEST_STATUSES),
});

export const createDocumentSchema = z.object({
  fileName: z.string().min(1, "File name is required").max(500),
  fileType: z.enum(DOCUMENT_FILE_TYPES),
  fileSize: z.number().optional().default(0),
  category: z.enum(DOCUMENT_CATEGORIES),
  entity: z.string().optional().nullable(),
  period: z.string().optional().nullable(),
  dataRequestId: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
});

export const updateDocumentSchema = createDocumentSchema.partial();

export const createTeamMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  role: z.string().min(1, "Role is required").max(100),
  email: z.string().email().optional().nullable(),
});

// Type exports
export type CreateEngagementInput = z.infer<typeof createEngagementSchema>;
export type UpdateEngagementInput = z.infer<typeof updateEngagementSchema>;
export type CreateDataRequestInput = z.infer<typeof createDataRequestSchema>;
export type UpdateDataRequestInput = z.infer<typeof updateDataRequestSchema>;
export type BulkUpdateDataRequestInput = z.infer<typeof bulkUpdateDataRequestSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;
