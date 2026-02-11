import { Footer } from "../common/Footer"
import { Header } from "../common/Header"

export const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="landing-layout font-rubik">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
