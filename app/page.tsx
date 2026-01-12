import { Categories } from "../components/LandingComponents/Home/Categories"
import { CTA } from "../components/LandingComponents/Home/CTA"
import { ForStudents } from "../components/LandingComponents/Home/ForStudents"
import { Hero } from "../components/LandingComponents/Home/Hero"
import { HowItWorks } from "../components/LandingComponents/Home/HowItWorks"
import { TransparencyGuarantee } from "../components/LandingComponents/Home/TransparencyGuarantee"
import { LandingLayout } from "../components/Layouts/LandingLayout"

export default function Home() {

  return (
    <LandingLayout>
      <main className="flex min-h-screen flex-col relative">
        <Hero />
        <TransparencyGuarantee />
        <HowItWorks />
        <ForStudents />
        <Categories />
        <CTA />
      </main>
    </LandingLayout>
  )
}
