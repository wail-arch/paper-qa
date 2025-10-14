import { FastifyInstance } from "fastify";
import { createRequest, findUserByEmail, listRequestsForUser, setRequestStatus, createRestricted } from "../data.js";
import { requestCreateSchema, requestDecisionSchema } from "../schemas/requests.js";

export async function requestRoutes(fastify: FastifyInstance) {
  fastify.post("/requests", async (request, reply) => {
    if (!request.currentUser) return reply.status(401).send({ error: "AUTH" });
    const parsed = requestCreateSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: "INVALID_BODY" });
    let targetIssuerId = parsed.data.target_issuer_id;
    if (!targetIssuerId && parsed.data.target_email) {
      const target = findUserByEmail(parsed.data.target_email);
      if (!target) return reply.status(404).send({ error: "NOT_FOUND" });
      targetIssuerId = target.id;
    }
    if (!targetIssuerId) return reply.status(400).send({ error: "MISSING_TARGET" });
    const reqRecord = createRequest({
      requesterId: request.currentUser.id,
      targetIssuerId,
      amountCents: parsed.data.amount_cents,
      currency: "EUR",
      categories: parsed.data.categories,
      note: parsed.data.note,
    });
    return { request: reqRecord };
  });

  fastify.post("/requests/:id/approve", async (request, reply) => {
    if (!request.currentUser) return reply.status(401).send({ error: "AUTH" });
    const parsed = requestDecisionSchema.safeParse({ id: (request.params as any).id });
    if (!parsed.success) return reply.status(400).send({ error: "INVALID_BODY" });
    const reqRecord = setRequestStatus(parsed.data.id, "APPROVED");
    if (!reqRecord) return reply.status(404).send({ error: "NOT_FOUND" });
    createRestricted({
      issuerId: request.currentUser.id,
      recipientId: reqRecord.requesterId,
      amountCents: reqRecord.amountCents,
      categories: reqRecord.categories,
    });
    return { request: reqRecord };
  });

  fastify.post("/requests/:id/decline", async (request, reply) => {
    if (!request.currentUser) return reply.status(401).send({ error: "AUTH" });
    const parsed = requestDecisionSchema.safeParse({ id: (request.params as any).id });
    if (!parsed.success) return reply.status(400).send({ error: "INVALID_BODY" });
    const reqRecord = setRequestStatus(parsed.data.id, "DECLINED");
    if (!reqRecord) return reply.status(404).send({ error: "NOT_FOUND" });
    return { request: reqRecord };
  });

  fastify.get("/requests/mine", async (request, reply) => {
    if (!request.currentUser) return reply.status(401).send({ error: "AUTH" });
    const list = listRequestsForUser(request.currentUser.id);
    return { requests: list };
  });
}
