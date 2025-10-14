import { z } from "zod";

export const devLoginSchema = z.object({
  email: z.string().email(),
});

export const logoutSchema = z.object({});
