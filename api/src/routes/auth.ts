import { FastifyInstance } from "fastify";
import { devLoginSchema } from "../schemas/auth.js";
import { findUserByEmail, listAllUsers } from "../data.js";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/dev-login", async (request, reply) => {
    const parsed = devLoginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "INVALID_EMAIL" });
    }
    const user = findUserByEmail(parsed.data.email);
    if (!user) {
      return reply.status(403).send({ error: "NOT_INVITED" });
    }
    return {
      token: user.id,
      user,
      beta_users: listAllUsers().map((u) => ({ id: u.id, email: u.email })),
    };
  });

  fastify.post("/auth/logout", async (_request, reply) => {
    return reply.status(200).send({ ok: true });
  });
}
