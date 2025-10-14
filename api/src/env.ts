import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
  hmacPrimary: process.env.HMAC_SECRET_PRIMARY ?? "primary",
  hmacSecondary: process.env.HMAC_SECRET_SECONDARY ?? "secondary",
  magicLinkSecret: process.env.MAGIC_LINK_SECRET ?? "magic",
};
