import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";
import { signPayload } from "../src/lib/hmac.js";
import { env } from "../src/env.js";

const app = buildApp();

function authSender() {
  return { authorization: "Bearer user-a" };
}

describe("payins", () => {
  it("creates and confirms a payin", async () => {
    const create = await app.inject({
      method: "POST",
      url: "/payins",
      headers: authSender(),
      payload: { method: "SEPA", amount_cents: 1200 },
    });
    expect(create.statusCode).toBe(200);
    const payinId = create.json().payin.id as string;

    const body = { type: "payin.succeeded", data: { id: payinId } };
    const raw = JSON.stringify(body);
    const ts = Date.now();
    const signature = signPayload(env.hmacPrimary, ts, raw);

    const webhook = await app.inject({
      method: "POST",
      url: "/webhooks/psp",
      headers: {
        "x-signature": signature,
        "x-timestamp": ts.toString(),
        "x-key-id": "primary",
      },
      payload: body,
    });
    expect(webhook.statusCode).toBe(200);
  });
});
