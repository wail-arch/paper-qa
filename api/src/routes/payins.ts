import { FastifyInstance } from "fastify";
import { createPayin, getPayin, markPayinSucceeded } from "../data.js";
import { payinCreateSchema, payinWebhookSchema } from "../schemas/payins.js";
import { HMAC_HEADER, parseEnvelope, verifyEnvelope } from "../lib/hmac.js";
import { env } from "../env.js";

export async function payinRoutes(fastify: FastifyInstance) {
  fastify.post("/payins", async (request, reply) => {
    if (!request.currentUser) return reply.status(401).send({ error: "AUTH" });
    const parsed = payinCreateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "INVALID_BODY" });
    }
    const payin = createPayin(request.currentUser.id, parsed.data.amount_cents);
    return { payin };
  });

  fastify.get("/payins/:id", async (request, reply) => {
    if (!request.currentUser) return reply.status(401).send({ error: "AUTH" });
    const payin = getPayin((request.params as any).id);
    if (!payin) return reply.status(404).send({ error: "NOT_FOUND" });
    return { payin };
  });

  fastify.post("/webhooks/psp", async (request, reply) => {
    const rawBody = JSON.stringify(request.body ?? {});
    const envelope = parseEnvelope({
      [HMAC_HEADER.signature]: request.headers[HMAC_HEADER.signature]?.toString(),
      [HMAC_HEADER.timestamp]: request.headers[HMAC_HEADER.timestamp]?.toString(),
      [HMAC_HEADER.keyId]: request.headers[HMAC_HEADER.keyId]?.toString(),
    });
    if (!envelope) {
      return reply.status(401).send({ error: "INVALID_SIGNATURE" });
    }
    const valid = verifyEnvelope(envelope, rawBody, {
      primary: env.hmacPrimary,
      secondary: env.hmacSecondary,
    });
    if (!valid) {
      return reply.status(401).send({ error: "INVALID_SIGNATURE" });
    }
    const parsed = payinWebhookSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "INVALID_PAYLOAD" });
    }
    if (parsed.data.type === "payin.succeeded") {
      const payin = markPayinSucceeded(parsed.data.data.id);
      if (!payin) {
        return reply.status(404).send({ error: "NOT_FOUND" });
      }
    }
    return reply.status(200).send({ received: true });
  });
}
