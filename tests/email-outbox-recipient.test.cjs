require("./register-ts.cjs");
const assert = require("node:assert/strict");
const { test } = require("node:test");
const { pool } = require("../lib/db");
const { enqueueEmail } = require("../lib/email-outbox.ts");

const originalQuery = pool.query;

test.afterEach(() => {
  pool.query = originalQuery;
});

test("stores the preference owner with an email outbox row", async () => {
  let inserted;
  pool.query = async (sql, values) => {
    inserted = { sql, values };
    return { rowCount: 1, rows: [] };
  };

  const recipientUserId = "123e4567-e89b-42d3-a456-426614174000";
  const queued = await enqueueEmail({
    type: "offer_letter",
    recipientUserId,
    to: "candidate@example.com",
    subject: "Offer",
    html: "<p>Offer</p>",
  });

  assert.equal(queued, true);
  assert.match(inserted.sql, /recipient_user_id/);
  assert.equal(inserted.values[5], recipientUserId);
  assert.equal(inserted.values[6], "candidate@example.com");
});
