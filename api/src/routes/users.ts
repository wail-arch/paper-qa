import { FastifyInstance } from "fastify";
import {
  computeRecipientCategoryBalance,
  computeSenderBalance,
  getUser,
  listActivity,
  listRestrictedForIssuer,
  listRestrictedForRecipient,
} from "../data.js";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/me", async (request, reply) => {
    if (!request.currentUser) return reply.status(401).send({ error: "AUTH" });
    const user = getUser(request.currentUser.id);
    if (!user) return reply.status(404).send({ error: "NOT_FOUND" });
    const senderBalance = computeSenderBalance(user.id);
    const restricted = listRestrictedForRecipient(user.id);
    const sent = listRestrictedForIssuer(user.id);
    const categories = computeRecipientCategoryBalance(user.id);
    const activity = listActivity(user.id);
    return {
      user,
      sender_balance_cents: senderBalance,
      recipient_restricted: restricted,
      sent,
      category_summary: categories,
      activity,
    };
  });
}
