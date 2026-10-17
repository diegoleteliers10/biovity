DO $$
DECLARE
  table_name text;
  internal_tables text[] := ARRAY[
    'migrations',
    'offer_letter',
    'notification_deduplication',
    'pipeline_stage_order_backup_1791800000003',
    'organization_verification_request',
    'offer_response_email_intent',
    'event_participant_status_history',
    'event_interviewer',
    'event_interview_evaluation',
    'event_interview_outcome',
    'event_interview_audit',
    'organization_onboarding_assignment',
    'organization_onboarding_assignment_audit',
    'event_change_history',
    'organization_rejection_reason',
    'offer_response_email_admin_retry',
    'admin_operations_queue_assignment',
    'admin_operations_queue_assignment_audit',
    'organization_verification_email_intent',
    'application_status_notification_intent',
    'application_status_notification_admin_retry'
  ];
BEGIN
  FOREACH table_name IN ARRAY internal_tables LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format(
      'REVOKE ALL ON TABLE public.%I FROM PUBLIC, anon, authenticated, service_role',
      table_name
    );
  END LOOP;
END $$;

INSERT INTO migrations (timestamp, name)
SELECT 1737450000030, '030_internal_ats_rls'
WHERE NOT EXISTS (
  SELECT 1 FROM migrations WHERE name = '030_internal_ats_rls'
);
