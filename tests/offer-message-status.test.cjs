require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { resolveOfferMessageStatus } = require('../lib/offer-message-status.ts')

test('a server status replaces local offer response state', () => {
  assert.equal(resolveOfferMessageStatus('sent', 'accepted'), 'accepted')
  assert.equal(resolveOfferMessageStatus('superseded', 'accepted'), 'superseded')
})

test('an unanswered offer defaults to sent', () => {
  assert.equal(resolveOfferMessageStatus(undefined, null), 'sent')
})
