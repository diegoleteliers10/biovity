require("./register-ts.cjs");
const assert = require("node:assert/strict");
const Module = require("node:module");
const { test } = require("node:test");

let sendEmail = async () => ({ data: { id: "provider-1" }, error: null });
const resendPath = require.resolve("resend");
const originalResendModule = require.cache[resendPath];
const fakeResendModule = new Module(resendPath);
fakeResendModule.exports = {
  Resend: class FakeResend {
    constructor() {
      this.emails = { send: (...args) => sendEmail(...args) };
    }
  },
};
require.cache[resendPath] = fakeResendModule;

const { pool } = require("../lib/db");
const { processEmailOutbox } = require("../lib/email-outbox-worker.ts");
const originalQuery = pool.query;
const originalFetch = global.fetch;
const originalApiUrl = process.env.API_URL;
const originalInternalKey = process.env.INTERNAL_API_KEY;
const originalResendApiKey = process.env.RESEND_API_KEY;

test.afterEach(() => {
  pool.query = originalQuery;
  global.fetch = originalFetch;
  if (originalApiUrl === undefined) delete process.env.API_URL;
  else process.env.API_URL = originalApiUrl;
  if (originalInternalKey === undefined) delete process.env.INTERNAL_API_KEY;
  else process.env.INTERNAL_API_KEY = originalInternalKey;
  if (originalResendApiKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = originalResendApiKey;
  sendEmail = async () => ({ data: { id: "provider-1" }, error: null });
});

test("expires terminal email and retry audit rows when delivery is unavailable", async () => {
  delete process.env.RESEND_API_KEY;
  const queries = [];
  pool.query = async (sql, values) => {
    queries.push({ sql, values });
    return { rows: [] };
  };

  const result = await processEmailOutbox();

  assert.equal(result.status, "unavailable");
  assert.match(queries[0].sql, /status IN \('pending', 'processing'\).*expires_at <= now\(\)/s);
  assert.match(queries[1].sql, /DELETE FROM email_outbox_admin_retry/);
  assert.match(queries[1].sql, /status IN \('sent', 'dead', 'suppressed'\) AND expires_at <= now\(\)/);
  assert.equal(queries.length, 2);
});

test.after(() => {
  if (originalResendModule) require.cache[resendPath] = originalResendModule;
  else delete require.cache[resendPath];
});

test("marks exhausted rows dead and excludes them from claims", async () => {
  process.env.RESEND_API_KEY = "test-key";
  const queries = [];
  pool.query = async (sql, values) => {
    queries.push({ sql, values });
    return { rows: [] };
  };

  await processEmailOutbox();

  const exhausted = queries.find(({ sql }) => sql.includes("attempts >= $1"));
  const claim = queries.find(({ sql }) => sql.includes("WITH ready AS"));
  assert.ok(exhausted);
  assert.deepEqual(exhausted.values, [8, 5]);
  assert.match(exhausted.sql, /status = 'processing'.*locked_at/s);
  assert.match(claim.sql, /attempts < \$3/);
  assert.equal(claim.values[2], 8);
});

test("records a resolved provider error as a retry", async () => {
  process.env.RESEND_API_KEY = "test-key";
  const queries = [];
  pool.query = async (sql, values) => {
    queries.push({ sql, values });
    if (sql.includes("WITH ready AS")) {
      return {
        rows: [
          {
            id: "row-1",
            to: "person@example.com",
            from: "Biovity <mail@example.com>",
            subject: "Welcome",
            html: "<p>Welcome</p>",
            attachments: [],
            attempts: 1,
            sourceType: null,
            sourceId: null,
          },
        ],
      };
    }
    return { rows: [] };
  };
  sendEmail = async (_message, options) => {
    assert.deepEqual(options, { idempotencyKey: "biovity-email-row-1" });
    return { data: null, error: { message: "provider rejected message" } };
  };

  const result = await processEmailOutbox();

  assert.equal(result.deliveries[0].status, "retry");
  const retry = queries.find(({ sql }) =>
    sql.includes("status = CASE WHEN attempts"),
  );
  assert.equal(retry.values[1], 8);
  assert.equal(retry.values[3], "provider rejected message");
});

test("sends a claimed message and clears its stored body", async () => {
  process.env.RESEND_API_KEY = "test-key";
  const queries = [];
  pool.query = async (sql, values) => {
    queries.push({ sql, values });
    if (sql.includes("WITH ready AS")) {
      return {
        rows: [
          {
            id: "row-2",
            to: "person@example.com",
            from: "Biovity <mail@example.com>",
            subject: "Welcome",
            html: "<p>Welcome</p>",
            attachments: [],
            attempts: 1,
            sourceType: null,
            sourceId: null,
          },
        ],
      };
    }
    return { rows: [] };
  };

  const result = await processEmailOutbox();

  assert.equal(result.deliveries[0].status, "sent");
  const delivered = queries.find(({ sql }) =>
    sql.includes("WITH delivered AS"),
  );
  assert.match(delivered.sql, /html = NULL/);
  assert.deepEqual(delivered.values, ["row-2", "provider-1"]);
});

test("suppresses an offer letter when application email preferences are disabled", async () => {
  process.env.RESEND_API_KEY = "test-key";
  process.env.API_URL = "https://api.example.com";
  process.env.INTERNAL_API_KEY = "internal-key";
  const queries = [];
  pool.query = async (sql, values) => {
    queries.push({ sql, values });
    if (sql.includes("WITH ready AS")) {
      return {
        rows: [
          {
            id: "offer-row",
            type: "offer_letter",
            recipientUserId: "user-1",
            to: "person@example.com",
            from: "Biovity <mail@example.com>",
            subject: "Offer",
            html: "<p>Offer</p>",
            attachments: [{ filename: "offer.pdf", content: "pdf" }],
            attempts: 1,
            sourceType: null,
            sourceId: null,
          },
        ],
      };
    }
    return { rows: [] };
  };
  global.fetch = async (_url, options) => {
    assert.equal(
      _url,
      "https://api.example.com/api/v1/internal/email-preferences/application",
    );
    assert.equal(options.headers["x-internal-key"], "internal-key");
    return Response.json({ decisions: { "user-1": "disabled" } });
  };
  sendEmail = async () => assert.fail("suppressed message reached Resend");

  const result = await processEmailOutbox();

  assert.equal(result.deliveries[0].status, "suppressed");
  const suppressed = queries.find(({ sql }) =>
    sql.includes("status = 'suppressed'"),
  );
  assert.ok(suppressed);
  assert.match(suppressed.sql, /html = NULL/);
  assert.match(suppressed.sql, /attachments = '\[\]'::jsonb/);
  assert.match(suppressed.sql, /recipient_user_id = NULL/);
});

test("suppresses preference emails without a recipient user ID", async () => {
  process.env.RESEND_API_KEY = "test-key";
  const queries = [];
  pool.query = async (sql, values) => {
    queries.push({ sql, values });
    if (sql.includes("WITH ready AS")) {
      return {
        rows: [
          {
            id: "offer-row",
            type: "offer_letter",
            recipientUserId: null,
            to: "person@example.com",
            from: "Biovity <mail@example.com>",
            subject: "Offer",
            html: "<p>Offer</p>",
            attachments: [{ filename: "offer.pdf", content: "pdf" }],
            attempts: 1,
            sourceType: null,
            sourceId: null,
          },
        ],
      };
    }
    return { rows: [] };
  };
  sendEmail = async () =>
    assert.fail("message without a preference owner reached Resend");

  const result = await processEmailOutbox();

  assert.equal(result.deliveries[0].status, "suppressed");
  const suppressed = queries.find(({ sql }) =>
    sql.includes("status = 'suppressed'"),
  );
  assert.ok(suppressed);
  assert.deepEqual(suppressed.values, [
    "offer-row",
    "Destinatario sin usuario asociado",
  ]);
});

test("sends an offer letter when application email preferences are enabled", async () => {
  process.env.RESEND_API_KEY = "test-key";
  process.env.API_URL = "https://api.example.com";
  process.env.INTERNAL_API_KEY = "internal-key";
  const queries = [];
  pool.query = async (sql, values) => {
    queries.push({ sql, values });
    if (sql.includes("WITH ready AS")) {
      return {
        rows: [
          {
            id: "offer-row",
            type: "offer_letter",
            recipientUserId: "user-1",
            to: "person@example.com",
            from: "Biovity <mail@example.com>",
            subject: "Offer",
            html: "<p>Offer</p>",
            attachments: [{ filename: "offer.pdf", content: "pdf" }],
            attempts: 1,
            sourceType: null,
            sourceId: null,
          },
        ],
      };
    }
    return { rows: [] };
  };
  global.fetch = async () =>
    Response.json({ decisions: { "user-1": "enabled" } });
  let sentMessage;
  sendEmail = async (message) => {
    sentMessage = message;
    return { data: { id: "provider-1" }, error: null };
  };

  const result = await processEmailOutbox();

  assert.equal(result.deliveries[0].status, "sent");
  assert.equal(sentMessage.to, "person@example.com");
  assert.equal(sentMessage.attachments[0].filename, "offer.pdf");
  assert.ok(queries.some(({ sql }) => sql.includes("status = 'sent'")));
});

test("suppresses a weekly digest when its email preference changed before delivery", async () => {
  process.env.RESEND_API_KEY = "test-key";
  const queries = [];
  pool.query = async (sql, values) => {
    queries.push({ sql, values });
    if (sql.includes("WITH ready AS")) {
      return {
        rows: [
          {
            id: "digest-row",
            type: "organization_weekly_digest",
            recipientUserId: "user-1",
            to: "owner@example.com",
            from: "Biovity <mail@example.com>",
            subject: "Weekly summary",
            html: "<p>Summary</p>",
            attachments: [],
            attempts: 1,
            sourceType: null,
            sourceId: null,
          },
        ],
      };
    }
    if (sql.includes('SELECT id, notification_preferences FROM "user"')) {
      return {
        rows: [{ id: "user-1", notification_preferences: { digest: "weekly", channels: { email: false } } }],
      };
    }
    return { rows: [] };
  };
  sendEmail = async () => assert.fail("disabled weekly digest reached Resend");

  const result = await processEmailOutbox();

  assert.equal(result.deliveries[0].status, "suppressed");
  const suppressed = queries.find(({ sql }) => sql.includes("status = 'suppressed'"));
  assert.deepEqual(suppressed.values, ["digest-row", "Preferencia de resumen semanal desactivada"]);
});

test("suppresses an offer response when application email preferences are disabled", async () => {
  process.env.RESEND_API_KEY = "test-key";
  process.env.API_URL = "https://api.example.com";
  process.env.INTERNAL_API_KEY = "internal-key";
  const queries = [];
  pool.query = async (sql, values) => {
    queries.push({ sql, values });
    if (sql.includes("WITH ready AS")) {
      return {
        rows: [
          {
            id: "response-row",
            type: "offer_response",
            recipientUserId: "user-1",
            to: "recruiter@example.com",
            from: "Biovity <mail@example.com>",
            subject: "Offer response",
            html: "<p>Response</p>",
            attachments: [],
            attempts: 1,
            sourceType: null,
            sourceId: null,
          },
        ],
      };
    }
    return { rows: [] };
  };
  global.fetch = async () =>
    Response.json({ decisions: { "user-1": "disabled" } });
  sendEmail = async () => assert.fail("disabled response email reached Resend");

  const result = await processEmailOutbox();

  assert.equal(result.deliveries[0].status, "suppressed");
  assert.ok(queries.some(({ sql }) => sql.includes("status = 'suppressed'")));
});

test("retries offer response rows when preference lookup fails", async () => {
  process.env.RESEND_API_KEY = "test-key";
  process.env.API_URL = "https://api.example.com";
  process.env.INTERNAL_API_KEY = "internal-key";
  const queries = [];
  pool.query = async (sql, values) => {
    queries.push({ sql, values });
    if (sql.includes("WITH ready AS")) {
      return {
        rows: [
          {
            id: "offer-row",
            type: "offer_response",
            recipientUserId: "user-1",
            to: "person@example.com",
            from: "Biovity <mail@example.com>",
            subject: "Offer",
            html: "<p>Offer</p>",
            attachments: [],
            attempts: 1,
            sourceType: null,
            sourceId: null,
          },
        ],
      };
    }
    return { rows: [] };
  };
  global.fetch = async () => new Response(null, { status: 503 });
  sendEmail = async () => assert.fail("lookup failure reached Resend");

  const result = await processEmailOutbox();

  assert.equal(result.deliveries[0].status, "retry");
  assert.ok(
    queries.some(({ sql }) =>
      sql.includes("No se pudieron consultar las preferencias"),
    ),
  );
});
