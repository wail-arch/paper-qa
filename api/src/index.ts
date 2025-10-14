import { buildApp } from "./app.js";
import { env } from "./env.js";

const app = buildApp();

app.listen({ port: env.port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err, "startup_error");
  process.exit(1);
});
