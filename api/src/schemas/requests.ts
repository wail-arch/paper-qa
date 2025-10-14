import { z } from "zod";

const categorySchema = z.enum(["pharmacy", "grocery", "library"]);

export const requestCreateSchema = z.object({
  target_issuer_id: z.string().optional(),
  target_email: z.string().email().optional(),
  amount_cents: z.number().int().min(100).max(10000),
  categories: z.array(categorySchema).min(1),
  note: z.string().max(140).optional(),
});

export const requestDecisionSchema = z.object({
  id: z.string(),
});
