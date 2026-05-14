import { Footer } from "../common/Footer"
import { Header } from "../common/Header"
import { getServerSession } from "@/lib/auth"

export const LandingLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession()

  return (
    <div className="overflow-x-hidden">
      <Header session={session} />
      {children}
      <Footer />
    </div>
  )
}
