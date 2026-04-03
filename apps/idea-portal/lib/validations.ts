import { z } from "zod";

export const CATEGORIES = [
  "evidence-collection",
  "data-normalization",
  "structural-analysis",
  "pattern-recognition",
  "cross-domain-synthesis",
  "impact-quantification",
  "communication-delivery",
] as const;

export const CATEGORY_LABELS: Record<string, { name: string; description: string }> = {
  "evidence-collection": {
    name: "Evidence Collection",
    description: "Gathering and organizing source data from clients",
  },
  "data-normalization": {
    name: "Data Normalization",
    description: "Making heterogeneous data comparable and analyzable",
  },
  "structural-analysis": {
    name: "Structural Analysis",
    description: "Understanding how the organization is built (people, contracts, finances)",
  },
  "pattern-recognition": {
    name: "Pattern Recognition",
    description: "Finding anomalies, trends, risks, and opportunities",
  },
  "cross-domain-synthesis": {
    name: "Cross-Domain Synthesis",
    description: "Connecting findings across workstreams into a cohesive narrative",
  },
  "impact-quantification": {
    name: "Impact Quantification",
    description: "Putting dollar values on findings and recommendations",
  },
  "communication-delivery": {
    name: "Communication & Delivery",
    description: "Translating analysis into client-ready deliverables",
  },
};

export const PERSONAS = ["Rachel", "James", "Priya", "Marcus", "All"] as const;

export const STATUSES = [
  "submitted",
  "under-review",
  "researching",
  "specified",
  "in-development",
  "shipped",
  "declined",
] as const;

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  submitted: { label: "Submitted", color: "bg-gray-100 text-gray-700" },
  "under-review": { label: "Under Review", color: "bg-blue-100 text-blue-700" },
  researching: { label: "Researching", color: "bg-purple-100 text-purple-700" },
  specified: { label: "Specified", color: "bg-indigo-100 text-indigo-700" },
  "in-development": { label: "In Development", color: "bg-yellow-100 text-yellow-700" },
  shipped: { label: "Shipped", color: "bg-green-100 text-green-700" },
  declined: { label: "Declined", color: "bg-red-100 text-red-700" },
};

export const ideaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  authorName: z.string().min(1, "Author name is required").max(100),
  category: z.enum(CATEGORIES),
  persona: z.enum(PERSONAS).optional(),
  tags: z.string().max(500).optional(),
});

export const ideaUpdateSchema = z.object({
  status: z.enum(STATUSES).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  effort: z.enum(["low", "medium", "high"]).optional(),
  impact: z.enum(["low", "medium", "high", "very-high"]).optional(),
});

export const commentSchema = z.object({
  ideaId: z.string().min(1),
  authorName: z.string().min(1, "Author name is required"),
  content: z.string().min(1, "Comment cannot be empty").max(2000),
  role: z.enum(["user", "product-manager", "architect", "developer"]).optional(),
});

export const voteSchema = z.object({
  voterName: z.string().min(1, "Voter name is required"),
});

export type IdeaInput = z.infer<typeof ideaSchema>;
export type IdeaUpdate = z.infer<typeof ideaUpdateSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
