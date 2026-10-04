import { Result } from "better-result"
import { z } from "zod"
import { getServerSession, isAdminSession, type ServerSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { ApiError } from "@/lib/errors"

type AuthorizedSession = NonNullable<ServerSession>
type Permission = "read" | "recruit" | "manage"

export async function authorizeResource(
  resource: { kind: "application" | "organization"; id: string },
  permission: Permission
): Promise<Result<AuthorizedSession, ApiError>> {
  if (!z.string().uuid().safeParse(resource.id).success)
    return Result.err(new ApiError({ status: 400, message: "Recurso inválido" }))
  const session = await getServerSession()
  if (!session?.user.id) return Result.err(new ApiError({ status: 401, message: "No autorizado" }))
  const query = await Result.tryPromise({
    try: () =>
      pool.query<{ allowed: boolean }>(
        `SELECT EXISTS (
         SELECT 1 FROM public."user" AS requester
         JOIN public.session AS active_session ON active_session.user_id = requester.id
         WHERE requester.id = $1::uuid AND active_session.id = $2::uuid
           AND requester."isActive" IS TRUE AND active_session.expires_at > now()
           AND EXISTS (
             SELECT 1 FROM public.organization AS organization
             WHERE organization.id = CASE WHEN $3 = 'application' THEN
               (SELECT job."organizationId" FROM public.application AS application
                JOIN public.job AS job ON job.id = application."jobId" WHERE application.id = $4::uuid)
               ELSE $4::uuid END
             AND ($5::boolean OR (requester.type = 'organization' AND (
               requester."organizationId" = organization.id OR EXISTS (
                 SELECT 1 FROM public.organization_member AS member
                 WHERE member.user_id = requester.id AND member.organization_id = organization.id
                   AND ($6 = 'read' OR member.role = 'admin' OR ($6 = 'recruit' AND member.role = 'recruiter'))
               )
             )))
           )
       ) AS allowed`,
        [
          session.user.id,
          session.session.id,
          resource.kind,
          resource.id,
          isAdminSession(session),
          permission,
        ]
      ),
    catch: () => new ApiError({ status: 503, message: "No se pudieron validar los permisos" }),
  })
  if (query.isErr()) return Result.err(query.error)
  return query.value.rows[0]?.allowed
    ? Result.ok(session)
    : Result.err(new ApiError({ status: 403, message: "No tienes acceso a este recurso" }))
}
