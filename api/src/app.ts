import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { authRoutes } from "./routes/auth.js";
import { userRoutes } from "./routes/users.js";
import { merchantRoutes } from "./routes/merchants.js";
import { payinRoutes } from "./routes/payins.js";
import { restrictedRoutes } from "./routes/restricted.js";
import { requestRoutes } from "./routes/requests.js";
import authPlugin from "./middleware/auth.js";
import errorsPlugin from "./middleware/errors.js";
import { env } from "./env.js";
import { logger } from "./lib/logger.js";

export function buildApp() {
  const fastify = Fastify({
    logger,
  });

  fastify.register(cors, { origin: env.webOrigin, credentials: true });
  fastify.register(helmet);
  fastify.register(sensible);
  fastify.register(swagger, {
    openapi: {
      info: {
        title: "Caddy Money API",
        version: "0.1.0",
      },
    },
  });
  fastify.register(swaggerUi, {
    routePrefix: "/docs",
  });

  fastify.register(errorsPlugin);
  fastify.register(authPlugin);

  fastify.get("/healthz", async () => ({ status: "ok" }));
  fastify.get("/readiness", async () => ({ status: "ready" }));

  fastify.register(authRoutes);
  fastify.register(userRoutes);
  fastify.register(merchantRoutes);
  fastify.register(payinRoutes);
  fastify.register(restrictedRoutes);
  fastify.register(requestRoutes);

  return fastify;
}
