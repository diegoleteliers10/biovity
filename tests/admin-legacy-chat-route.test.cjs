require("./register-ts.cjs");
const assert = require("node:assert/strict");
const { test } = require("node:test");
const Module = require("node:module");
const { Result } = require("better-result");

let session = { user: { id: "admin-1" } };
let apiResult = Result.ok(null);
const requests = [];
const load = Module._load;
Module._load = function (name, parent, ...args) {
  if (name === "@/lib/auth") {
    return {
      auth: { api: { getSession: async () => session } },
      isAdminSession: (value) => value?.user?.id === "admin-1",
    };
  }
  if (name === "@/lib/result") {
    return {
      fetchJsonWithSession: async (url, headers, init) => {
        requests.push({ url, headers, init });
        return apiResult;
      },
    };
  }
  return load.call(this, name, parent, ...args);
};

const {
  GET,
  PATCH,
} = require("../app/api/admin/chats/[chatId]/organization/route.ts");
const chatId = "00000000-0000-4000-8000-000000000001";
const organizationId = "00000000-0000-4000-8000-000000000002";
const detail = {
  id: chatId,
  createdAt: "2026-10-10T12:00:00.000Z",
  updatedAt: null,
  recruiter: { id: "recruiter-1", name: "Recruiter", email: "r@example.com" },
  professional: {
    id: "candidate-1",
    name: "Candidate",
    email: "c@example.com",
  },
  messages: [],
};

function request(body) {
  return new Request("http://localhost/api/admin/chats", {
    method: body === undefined ? "GET" : "PATCH",
    headers: { "content-type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

function params(id = chatId) {
  return { params: Promise.resolve({ chatId: id }) };
}

test("legacy chat detail requires an admin before calling the backend", async () => {
  session = null;
  requests.length = 0;

  const response = await GET(request(), params());

  assert.equal(response.status, 403);
  assert.equal(requests.length, 0);
});

test("legacy chat detail rejects an invalid backend payload", async () => {
  session = { user: { id: "admin-1" } };
  apiResult = Result.ok({ data: { id: chatId } });
  requests.length = 0;

  const response = await GET(request(), params());

  assert.equal(response.status, 502);
  assert.equal(requests.length, 1);
});

test("legacy chat detail returns a validated backend record", async () => {
  apiResult = Result.ok({ data: detail });

  const response = await GET(request(), params());

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), detail);
  assert.equal(
    requests.at(-1).url,
    `http://localhost:3001/api/v1/admin/legacy-chats/${chatId}`,
  );
});

test("organization assignment rejects invalid input before calling the backend", async () => {
  requests.length = 0;

  const response = await PATCH(request({ organizationId: "bad-id" }), params());

  assert.equal(response.status, 400);
  assert.equal(requests.length, 0);
});

test("organization assignment sends the selected organization to the backend", async () => {
  const assignment = {
    chatId,
    organizationId,
    assignedById: "admin-1",
    assignedAt: "2026-10-10T12:00:00.000Z",
  };
  apiResult = Result.ok({ data: assignment });

  const response = await PATCH(request({ organizationId }), params());

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), assignment);
  assert.equal(requests.at(-1).init.method, "PATCH");
  assert.deepEqual(JSON.parse(requests.at(-1).init.body), { organizationId });
});

test("organization assignment requires an admin before reading its body", async () => {
  session = null;
  requests.length = 0;

  const response = await PATCH(request({ organizationId }), params());

  assert.equal(response.status, 403);
  assert.equal(requests.length, 0);
  session = { user: { id: "admin-1" } };
});

test("organization assignment preserves backend conflict status", async () => {
  apiResult = Result.err({
    _tag: "ApiError",
    status: 409,
    message: "Chat already assigned",
  });

  const response = await PATCH(request({ organizationId }), params());

  assert.equal(response.status, 409);
  assert.deepEqual(await response.json(), { error: "Chat already assigned" });
});

test("legacy chat detail preserves backend authorization errors", async () => {
  apiResult = Result.err({
    _tag: "ApiError",
    status: 403,
    message: "Admin access is required",
  });

  const response = await GET(request(), params());

  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), {
    error: "Admin access is required",
  });
});

test("legacy chat detail maps network failures to gateway errors", async () => {
  apiResult = Result.err({
    _tag: "NetworkError",
    message: "Backend unavailable",
  });

  const response = await GET(request(), params());

  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { error: "Backend unavailable" });
});

test("organization assignment rejects malformed JSON", async () => {
  requests.length = 0;
  const malformedRequest = new Request("http://localhost/api/admin/chats", {
    method: "PATCH",
    body: "{",
  });

  const response = await PATCH(malformedRequest, params());

  assert.equal(response.status, 400);
  assert.equal(requests.length, 0);
});

test("organization assignment rejects a malformed backend response", async () => {
  apiResult = Result.ok({ data: { chatId } });
  requests.length = 0;

  const response = await PATCH(request({ organizationId }), params());

  assert.equal(response.status, 502);
  assert.equal(requests.length, 1);
});
