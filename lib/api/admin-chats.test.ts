import assert from "node:assert/strict"
import { test } from "node:test"
import {
  buildAdminChatReviewUrl,
  buildAdminChatsUrl,
  buildVerifiedOrganizationsUrl,
} from "./admin-chats"

test("builds a paginated URL for the unassigned chat queue", () => {
  assert.equal(buildAdminChatsUrl({ page: 2, limit: 25 }), "/api/admin/chats?page=2&limit=25")
})

test("builds a search URL for verified organization choices", () => {
  assert.equal(
    buildVerifiedOrganizationsUrl({ page: 1, limit: 20, search: "Verified Labs" }),
    "/api/admin/chats?resource=verified-organizations&page=1&limit=20&search=Verified+Labs"
  )
})

test("encodes chat IDs in the review detail route", () => {
  assert.equal(buildAdminChatReviewUrl("chat/1"), "/api/admin/chats/chat%2F1/organization")
})
