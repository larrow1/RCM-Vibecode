import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "Client name is required").max(200),
  industry: z.string().max(100).optional().default(""),
  website: z.string().optional().default(""),
  notes: z.string().max(2000).optional().default(""),
  status: z.enum(["Prospect", "Active", "Inactive"]).default("Active"),
});

export const updateClientSchema = createClientSchema.partial();

export const createContactSchema = z.object({
  name: z.string().min(1, "Contact name is required").max(200),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(50).optional().default(""),
  role: z.string().max(100).optional().default(""),
  isPrimary: z.boolean().default(false),
});

export const updateContactSchema = createContactSchema.partial();

export const createEngagementSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  name: z.string().min(1, "Engagement name is required").max(200),
  description: z.string().max(2000).optional().default(""),
  type: z.enum(["TM", "FixedFee", "Retainer", "ValueBased"]).default("TM"),
  status: z.enum(["Lead", "Proposal", "Active", "Delivered", "Closed"]).default("Lead"),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  budget: z.union([z.number().nonnegative(), z.string()]).optional(),
});

export const updateEngagementSchema = createEngagementSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type CreateContactInput = z.infer<typeof createContactSchema>;
export type CreateEngagementInput = z.infer<typeof createEngagementSchema>;
