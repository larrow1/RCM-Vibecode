import { z } from "zod";

export const createFlowSchema = z.object({
  engagementId: z.string().min(1, "Engagement is required"),
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional(),
  templateId: z.string().optional(),
});

export const updateFlowSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(["Not Started", "In Progress", "Completed", "On Hold"]).optional(),
});

export const createPhaseSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const updatePhaseSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(["Not Started", "In Progress", "Completed", "Blocked"]).optional(),
  sortOrder: z.number().int().min(0).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  description: z.string().optional(),
  priority: z.enum(["Critical", "High", "Medium", "Low"]).optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  description: z.string().optional(),
  status: z.enum(["Pending", "In Progress", "Completed", "Blocked", "Skipped"]).optional(),
  priority: z.enum(["Critical", "High", "Medium", "Low"]).optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
});

export const generateFlowSchema = z.object({
  engagementId: z.string().min(1),
  engagementType: z.string().min(1),
  scope: z.string().optional(),
});

export type CreateFlowInput = z.infer<typeof createFlowSchema>;
export type UpdateFlowInput = z.infer<typeof updateFlowSchema>;
export type CreatePhaseInput = z.infer<typeof createPhaseSchema>;
export type UpdatePhaseInput = z.infer<typeof updatePhaseSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type GenerateFlowInput = z.infer<typeof generateFlowSchema>;
