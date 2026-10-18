REVOKE ALL ON TABLE
  account,
  capsule_module_progress,
  capsule_progress,
  certificates,
  job,
  job_question,
  notification,
  organization,
  resume,
  salary_submissions,
  saved_job,
  saved_search,
  session,
  subscription,
  "user",
  verification,
  waitlist
FROM PUBLIC, anon, authenticated;

REVOKE ALL ON SEQUENCE
  admin_operations_queue_assignment_audit_id_seq,
  contact_message_events_id_seq,
  contact_messages_id_seq,
  migrations_id_seq
FROM PUBLIC, anon, authenticated;

INSERT INTO migrations (timestamp, name)
SELECT 1791800000044, '033_revoke_default_api_grants'
WHERE NOT EXISTS (
  SELECT 1 FROM migrations WHERE name = '033_revoke_default_api_grants'
);
