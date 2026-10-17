require("./register-ts.cjs");
const assert = require("node:assert/strict");
const { test } = require("node:test");
const Module = require("node:module");
const { Result } = require("better-result");

const load = Module._load;

test("resend stores a PDF with the new deadline and escapes the candidate name", async () => {
  const offer = {
    id: "offer-1",
    applicationId: "application-1",
    organizationId: "organization-1",
    candidateId: "candidate-1",
    title: "Carta",
    letterData: {
      candidateName: "<img src=x onerror=alert(1)>",
      companyName: "Bio",
      jobTitle: "Researcher",
      offerValidUntil: "2026-10-20",
    },
  };
  const apiCalls = [];
  let renderedData;
  let uploadedPath;
  let queuedEmail;
  Module._load = function (name, parent, ...args) {
    if (name === "next/headers") return { headers: async () => new Headers() };
    if (name === "next/server") return { NextResponse: Response };
    if (name === "@/lib/auth") {
      return {
        auth: {
          api: {
            getSession: async () => ({
              user: { id: "recruiter-1", organizationId: "organization-1" },
            }),
          },
        },
      };
    }
    if (name === "@/lib/api/offer-letters") return {};
    if (name === "@/lib/email-outbox") {
      return { enqueueEmail: async (input) => ((queuedEmail = input), true) };
    }
    if (name === "@/lib/result") {
      return {
        fetchJsonWithSession: async (url, _headers, options = {}) => {
          apiCalls.push({ url, options });
          return options.method === "POST" ? Result.ok({ status: "sent" }) : Result.ok(offer);
        },
      };
    }
    if (name === "@/lib/offer-letter-pdf") {
      return {
        renderOfferLetterToPdf: async (data) => {
          renderedData = data;
          return new Uint8Array([1, 2, 3]);
        },
      };
    }
    if (name === "@/lib/supabase") {
      return {
        getSupabaseAdmin: () => ({
          from: () => ({
            select: () => ({
              eq: () => ({ single: async () => ({ data: { email: "candidate@example.com" } }) }),
            }),
          }),
          storage: {
            from: () => ({
              upload: async (path) => ((uploadedPath = path), { error: null }),
              remove: async () => ({ error: null }),
            }),
          },
        }),
      };
    }
    return load.call(this, name, parent, ...args);
  };
  const { POST } = require("../app/api/offer-letters/[id]/resend/route.ts");
  Module._load = load;

  const response = await POST(
    new Request("http://localhost/api/offer-letters/offer-1/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expiresOn: "2026-10-30" }),
    }),
    { params: Promise.resolve({ id: "offer-1" }) },
  );

  assert.equal(response.status, 200);
  assert.equal(renderedData.offerValidUntil, "2026-10-30");
  assert.match(uploadedPath, /^offer-letters\/application-1\/.+\.pdf$/);
  assert.equal(apiCalls.length, 2);
  assert.equal(apiCalls[1].options.method, "POST");
  const payload = JSON.parse(apiCalls[1].options.body);
  assert.equal(payload.expiresOn, "2026-10-30");
  assert.equal(payload.pdfPath, uploadedPath);
  assert.match(queuedEmail.html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(queuedEmail.html, /<img/);
});
