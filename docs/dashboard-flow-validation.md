# Dashboard release checks

Use one professional account, one organization owner, one recruiter, one viewer, and one platform admin. Use separate browser profiles for each account. Use a second organization for access tests.

## Release order

1. Apply `20261004083000_dashboard_resource_events.sql` to Supabase.
2. Run `node scripts/migrate-private-cvs.cjs --copy` from the frontend repository. This creates the private `biovity_cv` bucket and verifies each copy with SHA-256. It keeps the public originals.
3. Set `SUPABASE_CV_BUCKET=biovity_cv` in the frontend deployment.
4. Set `MERCADO_PAGO_WEBHOOK_SECRET` in the backend deployment. Get this value from the Mercado Pago webhook settings. Use the same webhook application as the access token.
5. Deploy the backend and frontend changes.
6. Open each current and historical application CV with its permitted account. Check that an anonymous account and a viewer cannot open a CV.
7. Run `node scripts/migrate-private-cvs.cjs --finalize --readers-deployed`. This verifies each copy again, updates stored links, and removes only the verified public CV originals. It preserves avatars and logos.
8. Repeat the CV access tests. Check that the old public CV links fail.

Do not finalize before the new CV reader is deployed. Keep the public bucket for avatars and logos. Create a new checkout after this release. Old checkouts without a stored pending subscription cannot activate a paid plan.

## Use cases

| Account | Action | Expected result |
| --- | --- | --- |
| Anonymous | Open `/jobs` and an active job | Public data loads. Apply requires an account. Draft and closed jobs stay private. |
| Professional | Apply to a job | The application and counts update. The organization receives its notification and updated application list. |
| Organization | Change an application stage | The pipeline, lists, and metrics update. The professional sees the new status. |
| Both chat participants | Send two messages without navigation | Each message appears once in both browsers. The recipient gets one notification per message. |
| Both chat participants | Switch chats and dashboard pages | The live channel stays active. Notification lists and counts agree across pages. |
| Both chat participants | Close the network, send a message in the other browser, restore the network | The next connection reloads authoritative messages and notifications. |
| Recipient | Read a chat | Only incoming messages become read. The sender cannot mark the recipient's messages as read. |
| Recipient | Read the same notification twice | The unread count decreases once. Another user cannot mark it as read. |
| Owner or recruiter | Create, edit, and delete a job or draft | Offers update after success without a page reload. Status and search filters remain correct. |
| Professional | Save and remove a job | The saved flag, finite and infinite lists, and counts update. Other users' saved jobs remain private. |
| Professional | Create and delete an alert | The alert list updates. Other users cannot read or change it. |
| Professional | Edit the profile or resume | The profile, completion, and permitted talent views update. |
| Professional | Upload, open, and remove a CV | The stored path survives. Removal clears metadata. Foreign files cannot be removed. |
| Organization | Save candidates and add or remove tags | Lists and flags update. Failed requests remain failures. Another organization sees its own tags. |
| Organizer and candidate | Create or edit an interview, then accept or decline it | Calendar, participant status, and notifications update in the other browser. |
| Organization | Add or remove a note or evaluation | The authorized organization panel updates. Professionals and other organizations cannot read internal notes or evaluations. |
| Owner | Change member roles or remove a member | Current resource permissions apply on the next request. A viewer cannot mutate recruiting data or open CVs and contact fields. |
| Recruiter | Run an approved AI status action | The authenticated backend changes the stage. The panel refreshes through its private resource event. |
| Organization | Queue Jev analyses | The endpoint returns 202. Pending results become ready, insufficient, or failed. The score is compatibility, not success probability. |
| Owner | Pay for a plan in provider test mode | A signed verified callback activates the correct plan once. A forged callback changes nothing. |
| Admin | Deactivate a user | Existing sessions stop. The account cannot read private data or join Realtime. |
| Owner | Refund, cancel, or charge back a payment in provider test mode | Only the matching subscription stops. A newer subscription stays active. |
| Admin | Read users, organizations, and metrics | Permitted data loads. Single and bulk changes show failures and update counts. |
| Any account | Sign out and sign in as another account | The new session gets a separate dashboard cache and channel. No data from the previous account appears. |

## Automated checks

Frontend: `node --test tests/data-flows.test.cjs tests/professional-data-flows.test.cjs tests/cv-security.test.cjs` and `npx tsc --noEmit`.

Backend: `npm test -- --runInBand` and `npx tsc --noEmit`.

Live probes: frontend `node --test tests/jev-postgres-smoke.cjs tests/realtime-live.cjs`. The Jev probe uses rollback. The Realtime probe removes its temporary grant. Backend `TEST_MIGRATION_APPLIED=true TEST_ENV_FILE=/absolute/path/to/frontend/.env node --test test/dashboard-realtime-smoke.cjs` also uses rollback.

These checks do not prove a complete browser session or a real payment. Run the use cases above after deployment.
