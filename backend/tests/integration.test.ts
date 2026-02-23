import { describe, test, expect } from "bun:test";
import { api, authenticatedApi, signUpTestUser, expectStatus, connectWebSocket, connectAuthenticatedWebSocket, waitForMessage } from "./helpers";

describe("API Integration Tests", () => {
  let authToken: string;

  test("Sign up test user", async () => {
    const { token } = await signUpTestUser();
    authToken = token;
    expect(authToken).toBeDefined();
  });

  // Premium Status Tests
  test("GET /api/premium/status returns current premium status", async () => {
    const res = await authenticatedApi("/api/premium/status", authToken);
    await expectStatus(res, 200);
    const data = await res.json();
    expect(data.isPremium).toBeDefined();
    expect(data.type).toBeDefined();
  });

  test("GET /api/premium/status without auth returns 401", async () => {
    const res = await api("/api/premium/status");
    await expectStatus(res, 401);
  });

  // Premium Purchase Tests
  test("POST /api/premium/purchase with lifetime creates purchase", async () => {
    const res = await authenticatedApi("/api/premium/purchase", authToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseType: "lifetime" }),
    });
    await expectStatus(res, 201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.purchase).toBeDefined();
    expect(data.purchase.id).toBeDefined();
  });

  test("POST /api/premium/purchase with monthly creates purchase", async () => {
    const res = await authenticatedApi("/api/premium/purchase", authToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseType: "monthly" }),
    });
    await expectStatus(res, 201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.purchase).toBeDefined();
  });

  test("POST /api/premium/purchase with appleTransactionId", async () => {
    const res = await authenticatedApi("/api/premium/purchase", authToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        purchaseType: "lifetime",
        appleTransactionId: "test-transaction-123",
      }),
    });
    await expectStatus(res, 201);
  });

  test("POST /api/premium/purchase without required purchaseType returns 400", async () => {
    const res = await authenticatedApi("/api/premium/purchase", authToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    await expectStatus(res, 400);
  });

  test("POST /api/premium/purchase without auth returns 401", async () => {
    const res = await api("/api/premium/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseType: "monthly" }),
    });
    await expectStatus(res, 401);
  });

  // Premium Verify Code Tests
  test("POST /api/premium/verify-code with invalid code returns 400", async () => {
    const res = await authenticatedApi("/api/premium/verify-code", authToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "invalid-code-xyz" }),
    });
    await expectStatus(res, 400);
  });

  test("POST /api/premium/verify-code without code field returns 400", async () => {
    const res = await authenticatedApi("/api/premium/verify-code", authToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    await expectStatus(res, 400);
  });

  test("POST /api/premium/verify-code without auth returns 401", async () => {
    const res = await api("/api/premium/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "test-code" }),
    });
    await expectStatus(res, 401);
  });

  // Premium Cancel Tests
  test("DELETE /api/premium/cancel without auth returns 401", async () => {
    const res = await api("/api/premium/cancel", {
      method: "DELETE",
    });
    await expectStatus(res, 401);
  });

  test("DELETE /api/premium/cancel cancels subscription", async () => {
    const res = await authenticatedApi("/api/premium/cancel", authToken, {
      method: "DELETE",
    });
    await expectStatus(res, 200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
