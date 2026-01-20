import { ComoFuncionaEmpresas } from "../../components/LandingComponents/Empresas/ComoFuncionaEmpresas"
import { CTAContacto } from "../../components/LandingComponents/Empresas/CTAContacto"
import { FAQ } from "../../components/LandingComponents/Empresas/FAQ"
import { FeaturesATS } from "../../components/LandingComponents/Empresas/FeaturesATS"
import { HeroEmpresas } from "../../components/LandingComponents/Empresas/HeroEmpresas"
// import { LogosEmpresas } from "../../components/LandingComponents/Empresas/LogosEmpresas"
import { Pricing } from "../../components/LandingComponents/Empresas/Pricing"
import { PropuestaValor } from "../../components/LandingComponents/Empresas/PropuestaValor"
// import { Testimonios } from "../../components/LandingComponents/Empresas/Testimonios"
import { LandingLayout } from "../../components/Layouts/LandingLayout"

export default function EmpresasPage() {
  return (
    <LandingLayout>
      <main className="flex flex-col relative">
        <HeroEmpresas />
        {/* TODO: Descomentar cuando tengamos logos de empresas clientes */}
        {/* <LogosEmpresas /> */}
        <PropuestaValor />
        <ComoFuncionaEmpresas />
        <FeaturesATS />
        <Pricing />
        {/* TODO: Descomentar cuando tengamos testimonios reales */}
        {/* <Testimonios /> */}
        <FAQ />
        <CTAContacto />
      </main>
    </LandingLayout>
  )
}
