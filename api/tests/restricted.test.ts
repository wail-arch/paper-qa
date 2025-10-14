import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

function auth(headers: Record<string, string> = {}) {
  return { ...headers, authorization: "Bearer user-a" };
}

describe("restricted flows", () => {
  const app = buildApp();

  it("creates a restricted send", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/restricted/send",
      headers: auth(),
      payload: {
        recipient_id: "user-b",
        amount_cents: 1500,
        categories: ["pharmacy", "grocery"],
      },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.issuance.categories).toContain("pharmacy");
  });

  it("prevents paying at wrong category", async () => {
    const prepare = await app.inject({
      method: "POST",
      url: "/pay/prepare",
      headers: auth({ authorization: "Bearer user-b" }),
      payload: {
        restricted_id: "restricted-1",
        merchant_id: "library-1",
        amount_cents: 500,
      },
    });
    expect(prepare.statusCode).toBe(200);
    const confirm = await app.inject({
      method: "POST",
      url: "/pay/confirm",
      headers: auth({ authorization: "Bearer user-b" }),
      payload: {
        issuance_id: "restricted-1",
        merchant_id: "library-1",
        amount_cents: 500,
        nonce: "n",
      },
    });
    expect(confirm.statusCode).toBe(403);
  });
});
