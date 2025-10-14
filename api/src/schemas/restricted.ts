import { z } from "zod";

const categorySchema = z.enum(["pharmacy", "grocery", "library"]);

export const restrictedSendSchema = z.object({
  recipient_id: z.string(),
  amount_cents: z.number().int().min(100).max(10000),
  categories: z.array(categorySchema).min(1),
  merchant_whitelist: z.array(z.string()).optional(),
  expires_at: z.string().optional(),
});

export const restrictedCancelSchema = z.object({
  id: z.string(),
});

export const payPrepareSchema = z.object({
  restricted_id: z.string(),
  merchant_id: z.string(),
  amount_cents: z.number().min(100),
});

export const payConfirmSchema = z.object({
  issuance_id: z.string(),
  merchant_id: z.string(),
  amount_cents: z.number(),
  nonce: z.string(),
});
