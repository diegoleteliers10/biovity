require("./register-ts.cjs");
const assert = require("node:assert/strict");
const { test } = require("node:test");

const {
  buildOperationsQueueUrl,
  buildOnboardingAssignmentUrl,
  buildAdminTaskAssignmentUrl,
  buildOfferResponseEmailRetryUrl,
  getOnboardingGaps,
  buildApplicationStatusNotificationRetryUrl,
  buildApplicationCreatedNotificationRetryUrl,
  buildEventChangeNotificationRetryUrl,
  buildEventLifecycleNotificationRetryUrl,
  buildMessageNotificationRetryUrl,
  buildInterviewReminderNotificationRetryUrl,
  buildSystemBroadcastNotificationRetryUrl,
  buildSavedSearchAlertRetryUrl,
  buildSavedSearchMatchRetryUrl,
  buildAiExplanationRetryUrl,
} = require("../components/dashboard/admin/AdminOperationsQueue.tsx");

test("builds the selected queue request with search and paging filters", () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: "organization_without_active_jobs",
      page: 3,
      limit: 20,
      search: " BioVity ",
    }),
    "/api/admin/operations-queue?type=organization_without_active_jobs&page=3&limit=20&search=BioVity",
  );
});

test("builds the failed message notice queue and retry URL", () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: "message_notification",
      page: 1,
      limit: 20,
      search: "",
    }),
    "/api/admin/operations-queue?type=message_notification&page=1&limit=20",
  );
  assert.equal(
    buildMessageNotificationRetryUrl("intent id"),
    "/api/admin/operations-queue/message-notification/intent%20id/retry",
  );
});

test("builds the failed AI explanation queue and retry URL", () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: "ai_explanation",
      page: 1,
      limit: 20,
      search: "",
    }),
    "/api/admin/operations-queue?type=ai_explanation&page=1&limit=20",
  );
  assert.equal(
    buildAiExplanationRetryUrl("revision id"),
    "/api/admin/operations-queue/ai-explanation/revision%20id/retry",
  );
});

test("builds the failed event-change notice queue and retry URL", () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: "event_change_notification",
      page: 1,
      limit: 20,
      search: "",
    }),
    "/api/admin/operations-queue?type=event_change_notification&page=1&limit=20",
  );
  assert.equal(
    buildEventChangeNotificationRetryUrl("intent id"),
    "/api/admin/operations-queue/event-change-notification/intent%20id/retry",
  );
});

test("builds the dead event lifecycle notice queue and retry URL", () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: "event_lifecycle_notification",
      page: 1,
      limit: 20,
      search: "",
    }),
    "/api/admin/operations-queue?type=event_lifecycle_notification&page=1&limit=20",
  );
  assert.equal(
    buildEventLifecycleNotificationRetryUrl("intent id"),
    "/api/admin/operations-queue/event-lifecycle-notification/intent%20id/retry",
  );
});

test("builds the dead interview reminder queue and retry URL", () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: "interview_reminder_notification",
      page: 1,
      limit: 20,
      search: "",
    }),
    "/api/admin/operations-queue?type=interview_reminder_notification&page=1&limit=20",
  );
  assert.equal(
    buildInterviewReminderNotificationRetryUrl("intent id"),
    "/api/admin/operations-queue/interview-reminder-notification/intent%20id/retry",
  );
});

test("builds the dead system broadcast queue and retry URL", () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: "system_broadcast_notification",
      page: 1,
      limit: 20,
      search: "",
    }),
    "/api/admin/operations-queue?type=system_broadcast_notification&page=1&limit=20",
  );
  assert.equal(
    buildSystemBroadcastNotificationRetryUrl("intent id"),
    "/api/admin/operations-queue/system-broadcast-notification/intent%20id/retry",
  );
});

test("builds saved-search alert and profile-match retry URLs", () => {
  for (const [type, buildUrl, path] of [
    ["saved_search_alert", buildSavedSearchAlertRetryUrl, "saved-search-alert"],
    ["saved_search_match", buildSavedSearchMatchRetryUrl, "saved-search-match"],
  ]) {
    assert.equal(
      buildOperationsQueueUrl({ type, page: 1, limit: 20, search: "" }),
      `/api/admin/operations-queue?type=${type}&page=1&limit=20`,
    );
    assert.equal(
      buildUrl("change id"),
      `/api/admin/operations-queue/${path}/change%20id/retry`,
    );
  }
});

test("keeps the existing queue filters available", () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: "expired_job",
      page: 1,
      limit: 20,
      search: "",
    }),
    "/api/admin/operations-queue?type=expired_job&page=1&limit=20",
  );
  assert.equal(
    buildOperationsQueueUrl({
      type: "application_follow_up",
      page: 2,
      limit: 20,
      search: "",
    }),
    "/api/admin/operations-queue?type=application_follow_up&page=2&limit=20",
  );
});

test("builds the organization onboarding queue request", () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: "organization_onboarding",
      page: 1,
      limit: 20,
      search: "",
    }),
    "/api/admin/operations-queue?type=organization_onboarding&page=1&limit=20",
  );
});

test("builds the dead offer-response email queue and retry URL", () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: "offer_response_email",
      page: 1,
      limit: 20,
      search: "",
    }),
    "/api/admin/operations-queue?type=offer_response_email&page=1&limit=20",
  );
  assert.equal(
    buildOfferResponseEmailRetryUrl("intent id"),
    "/api/admin/operations-queue/offer-response-email/intent%20id/retry",
  );
});

test("builds the failed application status notice queue and retry URL", () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: "application_status_notification",
      page: 1,
      limit: 20,
      search: "",
    }),
    "/api/admin/operations-queue?type=application_status_notification&page=1&limit=20",
  );
  assert.equal(
    buildApplicationStatusNotificationRetryUrl("intent id"),
    "/api/admin/operations-queue/application-status-notification/intent%20id/retry",
  );
});

test("builds the failed new-application notice queue and retry URL", () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: "application_created_notification",
      page: 1,
      limit: 20,
      search: "",
    }),
    "/api/admin/operations-queue?type=application_created_notification&page=1&limit=20",
  );
  assert.equal(
    buildApplicationCreatedNotificationRetryUrl("intent id"),
    "/api/admin/operations-queue/application-created-notification/intent%20id/retry",
  );
});

test("builds source-scoped URLs for admin-owned operational tasks", () => {
  assert.equal(
    buildAdminTaskAssignmentUrl("expired_job", "job id"),
    "/api/admin/operations-queue/expired_job/job%20id/assignment",
  );
  assert.equal(
    buildAdminTaskAssignmentUrl("organization_without_active_jobs", "org-id"),
    "/api/admin/operations-queue/organization_without_active_jobs/org-id/assignment",
  );
});

test("filters onboarding cases by assignment state", () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: "organization_onboarding",
      page: 1,
      limit: 20,
      search: "",
      assignment: "unassigned",
    }),
    "/api/admin/operations-queue?type=organization_onboarding&page=1&limit=20&assignment=unassigned",
  );
  assert.equal(
    buildOnboardingAssignmentUrl("organization id"),
    "/api/admin/operations-queue/organizations/organization%20id/assignment",
  );
});

test("lists incomplete onboarding milestones and required profile fields", () => {
  assert.deepEqual(
    getOnboardingGaps({
      onboardingSteps: {
        corporateEmailVerified: true,
        profileComplete: false,
        legalReviewApproved: false,
        firstJobCreated: false,
      },
      missingProfileFields: ["description", "city", "website"],
    }),
    [
      "Perfil de empresa completo",
      "Revisión legal aprobada",
      "Primera vacante creada",
      "Descripción",
      "Ciudad",
      "Sitio web",
    ],
  );
});

test("explains when the verified email domain does not match the company website", () => {
  assert.deepEqual(
    getOnboardingGaps({
      onboardingSteps: {
        corporateEmailVerified: false,
        profileComplete: true,
        legalReviewApproved: true,
        firstJobCreated: true,
      },
      missingProfileFields: [],
    }),
    ["Correo confirmado y dominio coincidente"],
  );
});
