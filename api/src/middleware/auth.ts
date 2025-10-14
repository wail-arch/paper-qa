import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { getUser } from "../data.js";

declare module "fastify" {
  interface FastifyRequest {
    currentUser?: { id: string };
  }
}

async function authPlugin(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.decorateRequest("currentUser", null);
  fastify.addHook("preHandler", async (request, reply) => {
    if (request.routerPath?.startsWith("/auth")) {
      return;
    }
    const auth = request.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return reply.code(401).send({ error: "AUTH_REQUIRED" });
    }
    const token = auth.slice("Bearer ".length);
    const user = getUser(token);
    if (!user) {
      return reply.code(401).send({ error: "INVALID_TOKEN" });
    }
    request.currentUser = { id: user.id };
  });
}

export default fp(authPlugin);
