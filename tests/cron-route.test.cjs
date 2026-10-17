require("./register-ts.cjs");
const assert = require("node:assert/strict");
const { test } = require("node:test");
const Module = require("node:module");

const queries = [];
const fetchCalls = [];
let fetchResponse = Response.json({ ok: true });
const load = Module._load;
global.fetch = async (...args) => {
  fetchCalls.push(args);
  return fetchResponse;
};
Module._load = function (name, parent, ...args) {
  if (name === "next/server") return { NextResponse: { json: Response.json } };
  if (name === "@/lib/db") {
    return { pool: { query: async (...query) => queries.push(query) } };
  }
  if (name === "@/lib/errors") {
    return { DbError: class DbError extends Error {} };
  }
  return load.call(this, name, parent, ...args);
};

const { GET } = require("../app/api/cron/route.ts");

test("denies cron pings without a valid bearer secret", async () => {
  process.env.CRON_SECRET = "cron-secret";
  queries.length = 0;

  const missing = await GET(new Request("https://biovity.test/api/cron"));
  const invalid = await GET(
    new Request("https://biovity.test/api/cron", {
      headers: { authorization: "Bearer invalid" },
    }),
  );

  assert.equal(missing.status, 401);
  assert.equal(invalid.status, 401);
  assert.equal(queries.length, 0);
});

test("runs the ping after cron authentication", async () => {
  process.env.CRON_SECRET = "cron-secret";
  process.env.NEXT_PUBLIC_API_URL = "https://api.biovity.test/";
  process.env.INTERNAL_API_KEY = "internal-secret";
  queries.length = 0;
  fetchCalls.length = 0;

  const response = await GET(
    new Request("https://biovity.test/api/cron", {
      headers: { authorization: "Bearer cron-secret" },
    }),
  );

  assert.equal(response.status, 200);
  assert.equal(queries.length, 1);
  assert.deepEqual(queries[0], ["SELECT 1"]);
  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0][0], "https://api.biovity.test/api/v1/internal/cron/dispatch");
  assert.deepEqual(fetchCalls[0][1], {
    method: "POST",
    headers: { "x-internal-key": "internal-secret" },
    cache: "no-store",
  });
});

test("does not dispatch when backend credentials are missing", async () => {
  process.env.CRON_SECRET = "cron-secret";
  delete process.env.INTERNAL_API_KEY;
  process.env.NEXT_PUBLIC_API_URL = "https://api.biovity.test";
  fetchCalls.length = 0;

  const response = await GET(
    new Request("https://biovity.test/api/cron", {
      headers: { authorization: "Bearer cron-secret" },
    }),
  );

  assert.equal(response.status, 503);
  assert.equal(fetchCalls.length, 0);
});

test("reports backend dispatch failures to the cron caller", async () => {
  process.env.CRON_SECRET = "cron-secret";
  process.env.INTERNAL_API_KEY = "internal-secret";
  process.env.NEXT_PUBLIC_API_URL = "https://api.biovity.test";
  fetchResponse = Response.json({ error: "unavailable" }, { status: 503 });

  const response = await GET(
    new Request("https://biovity.test/api/cron", {
      headers: { authorization: "Bearer cron-secret" },
    }),
  );

  assert.equal(response.status, 502);
  fetchResponse = Response.json({ ok: false, jobs: [{ job: "email_outbox", status: "rejected" }] });
  const partialFailure = await GET(
    new Request("https://biovity.test/api/cron", {
      headers: { authorization: "Bearer cron-secret" },
    }),
  );

  assert.equal(partialFailure.status, 502);
  fetchResponse = Response.json({ ok: true, jobs: [] });
});
