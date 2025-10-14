import { z } from "zod";

export const payinCreateSchema = z.object({
  method: z.literal("SEPA"),
  amount_cents: z.number().min(100).max(10000),
});

export const payinWebhookSchema = z.object({
  type: z.union([z.literal("payin.succeeded"), z.literal("payout.sent")]),
  data: z.object({
    id: z.string(),
  }),
});
