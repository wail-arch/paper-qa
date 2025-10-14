import { FastifyInstance } from "fastify";
import { getMerchants } from "../data.js";

export async function merchantRoutes(fastify: FastifyInstance) {
  fastify.get("/merchants", async (request) => {
    const category = request.query && typeof request.query === "object" ? (request.query as any).category : undefined;
    const merchants = getMerchants({ category });
    return { merchants };
  });
}
