import { Footer } from "../common/Footer"
import { Header } from "../common/Header"

export const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-x-hidden">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
