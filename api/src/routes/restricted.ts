import { FastifyInstance } from "fastify";
import { createRestricted, getMerchantsByIds, listRestrictedForRecipient, listRestrictedForIssuer, spendRestricted } from "../data.js";
import { payPrepareSchema, payConfirmSchema, restrictedCancelSchema, restrictedSendSchema } from "../schemas/restricted.js";
import crypto from "node:crypto";

export async function restrictedRoutes(fastify: FastifyInstance) {
  fastify.post("/restricted/send", async (request, reply) => {
    if (!request.currentUser) return reply.status(401).send({ error: "AUTH" });
    const parsed = restrictedSendSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: "INVALID_BODY" });
    const issuance = createRestricted({
      issuerId: request.currentUser.id,
      recipientId: parsed.data.recipient_id,
      amountCents: parsed.data.amount_cents,
      categories: parsed.data.categories,
      merchants: parsed.data.merchant_whitelist,
      expiresAt: parsed.data.expires_at,
    });
    return { issuance };
  });

  fastify.get("/restricted/mine", async (request, reply) => {
    if (!request.currentUser) return reply.status(401).send({ error: "AUTH" });
    const list = listRestrictedForRecipient(request.currentUser.id);
    return { items: list };
  });

  fastify.get("/restricted/sent", async (request, reply) => {
    if (!request.currentUser) return reply.status(401).send({ error: "AUTH" });
    const list = listRestrictedForIssuer(request.currentUser.id);
    return { items: list };
  });

  fastify.post("/pay/prepare", async (request, reply) => {
    if (!request.currentUser) return reply.status(401).send({ error: "AUTH" });
    const parsed = payPrepareSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: "INVALID_BODY" });
    const nonce = crypto.randomBytes(8).toString("hex");
    const ts = Date.now();
    const payload = `caddyqr:v1|issuance_id=${parsed.data.restricted_id}|merchant_id=${parsed.data.merchant_id}|amount_cents=${parsed.data.amount_cents}|ts=${ts}|nonce=${nonce}|kid=primary|sig=dummy`;
    const merchant = getMerchantsByIds([parsed.data.merchant_id])[0];
    return { qr: payload, merchant };
  });

  fastify.post("/pay/confirm", async (request, reply) => {
    if (!request.currentUser) return reply.status(401).send({ error: "AUTH" });
    const parsed = payConfirmSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: "INVALID_BODY" });
    try {
      const { item, merchant } = spendRestricted({
        restrictedId: parsed.data.issuance_id,
        merchantId: parsed.data.merchant_id,
        amountCents: parsed.data.amount_cents,
      });
      return { success: true, item, merchant };
    } catch (error: any) {
      if (error.message === "CATEGORY_MISMATCH") {
        return reply.status(403).send({ error: "Ce lieu n’est pas autorisé pour cet argent." });
      }
      return reply.status(400).send({ error: error.message });
    }
  });

  fastify.post("/restricted/cancel", async (request, reply) => {
    if (!request.currentUser) return reply.status(401).send({ error: "AUTH" });
    const parsed = restrictedCancelSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: "INVALID_BODY" });
    return { ok: true, id: parsed.data.id };
  });
}
