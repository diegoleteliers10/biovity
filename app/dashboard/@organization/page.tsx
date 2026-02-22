import { LogoutButton } from "@/components/common/LogoutButton"

export default function OrganizationDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard Organización</h1>
      <p className="mt-2 text-muted-foreground">
        Gestiona ofertas de empleo, candidatos y tu perfil empresarial.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Próximamente: panel completo para organizaciones.
      </p>
      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  )
}
