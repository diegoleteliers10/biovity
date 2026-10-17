require("./register-ts.cjs");
const assert = require("node:assert/strict");
const { test } = require("node:test");
const Module = require("node:module");
const { Result } = require("better-result");

let apiResult = Result.ok({ data: { status: "claimed" } });
const requests = [];
const load = Module._load;
Module._load = function (name, parent, ...args) {
  if (name === "@/lib/admin/contact-inquiries") {
    return {
      ADMIN_API_BASE: "https://api.biovity.test",
      apiErrorResponse: (error) =>
        Response.json({ error: error.message }, { status: 502 }),
      responsePayload: (value) => value?.data ?? value,
    };
  }
  if (name === "@/lib/auth") {
    return {
      auth: { api: { getSession: async () => ({ user: { type: "admin" } }) } },
      isAdminSession: (value) => Boolean(value?.user?.type === "admin"),
    };
  }
  if (name === "@/lib/result") {
    return {
      fetchJsonWithSession: async (...args) => {
        requests.push(args);
        return apiResult;
      },
    };
  }
  return load.call(this, name, parent, ...args);
};

const {
  PATCH,
} = require("../app/api/admin/operations-queue/[kind]/[sourceId]/assignment/route.ts");
const sourceId = "00000000-0000-4000-8000-000000000001";
const request = (body) =>
  new Request("https://biovity.test", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });
const params = (kind = "expired_job", id = sourceId) => ({
  params: Promise.resolve({ kind, sourceId: id }),
});

test("validates and forwards source-scoped admin task follow-ups", async () => {
  requests.length = 0;
  const malformedKind = await PATCH(
    request(JSON.stringify({ action: "release" })),
    params("application_follow_up"),
  );
  const malformedId = await PATCH(
    request(JSON.stringify({ action: "release" })),
    params("expired_job", "bad-id"),
  );
  const missingPlan = await PATCH(
    request(JSON.stringify({ action: "claim" })),
    params(),
  );
  assert.equal(malformedKind.status, 400);
  assert.equal(malformedId.status, 400);
  assert.equal(missingPlan.status, 400);

  const plan = {
    action: "claim",
    nextAction: "Revisar vacante",
    targetDate: "2026-10-20",
  };
  const response = await PATCH(request(JSON.stringify(plan)), params());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "claimed" });
  assert.equal(
    requests[0][0],
    `https://api.biovity.test/api/v1/admin/operations-queue/expired_job/${sourceId}/assignment`,
  );
  assert.deepEqual(JSON.parse(requests[0][2].body), plan);
});
