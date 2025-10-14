import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

async function errorsPlugin(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, "request_error");
    if (error.validation) {
      reply.status(400).send({ error: "VALIDATION_ERROR", details: error.validation });
      return;
    }
    reply.status(error.statusCode ?? 500).send({ error: error.message ?? "SERVER_ERROR" });
  });
}

export default fp(errorsPlugin);
