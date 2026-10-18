require("./register-ts.cjs");
const assert = require("node:assert/strict");
const { test } = require("node:test");
const Module = require("node:module");
const { Result } = require("better-result");

const emailUserId = "candidate-1";
const emailOrganizationId = "organization-1";
const emailApplication = {
  id: "application-1",
  candidateId: emailUserId,
  job: { organizationId: emailOrganizationId, title: "Researcher" },
};
let queuedEmail;
let storedPdf;
const load = Module._load;

Module._load = function (name, parent, ...args) {
  if (name === "next/headers") return { headers: async () => new Headers() };
  if (name === "next/server") return { NextResponse: Response };
  if (name === "@/lib/auth") {
    return {
      auth: {
        api: {
          getSession: async () => ({
            user: { id: "recruiter-1", organizationId: emailOrganizationId },
          }),
        },
      },
    };
  }
  if (name === "@/components/pdf/offer-letter-document") {
    return {
      defaultOfferLetterData: (data) => ({
        candidateName: "Candidate",
        jobTitle: "Researcher",
        ...data,
      }),
    };
  }
  if (name === "@/lib/email-outbox") {
    return {
      enqueueEmail: async (input) => {
        queuedEmail = input;
        return true;
      },
    };
  }
  if (name === "@/lib/offer-letter-pdf") {
    return { renderOfferLetterToPdf: async () => new Uint8Array([1, 2, 3]) };
  }
  if (name === "@/lib/result") {
    return {
      fetchJsonWithSession: async () =>
        Result.ok({ data: { id: "offer-1", chatId: "chat-1" } }),
    };
  }
  if (name === "@/lib/supabase") {
    return {
      getSupabaseAdmin: () => ({
        from: (table) => ({
          select: () => ({
            eq: () => ({
              single: async () =>
                table === "application"
                  ? { data: emailApplication, error: null }
                  : {
                      data: {
                        email: "candidate@example.com",
                        name: "Candidate",
                      },
                      error: null,
                    },
            }),
          }),
        }),
        storage: {
          from: () => ({
            upload: async (_path, file) => {
              storedPdf = file;
              return { error: null };
            },
          }),
        },
      }),
    };
  }
  return load.call(this, name, parent, ...args);
};

const { POST } = require("../app/api/offer-letters/send/route.tsx");
Module._load = load;

test("queues the offer letter for its candidate and keeps the PDF in private storage", async () => {
  queuedEmail = null;
  storedPdf = null;
  const response = await POST(
    new Request("http://localhost/api/offer-letters/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: "application-1",
        letterData: { candidateName: "Candidate", jobTitle: "Researcher" },
      }),
    }),
  );

  assert.equal(response.status, 200);
  assert.equal(queuedEmail.type, "offer_letter");
  assert.equal(queuedEmail.recipientUserId, emailUserId);
  assert.ok(queuedEmail.attachments[0].content);
  assert.ok(storedPdf);
});
