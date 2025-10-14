import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

const app = buildApp();

describe("requests flow", () => {
  it("allows recipient to create request and sender to approve", async () => {
    const create = await app.inject({
      method: "POST",
      url: "/requests",
      headers: { authorization: "Bearer user-b" },
      payload: {
        target_issuer_id: "user-a",
        amount_cents: 900,
        categories: ["library"],
        note: "Livres",
      },
    });
    expect(create.statusCode).toBe(200);
    const id = create.json().request.id as string;

    const approve = await app.inject({
      method: "POST",
      url: `/requests/${id}/approve`,
      headers: { authorization: "Bearer user-a" },
    });
    expect(approve.statusCode).toBe(200);
  });
});
