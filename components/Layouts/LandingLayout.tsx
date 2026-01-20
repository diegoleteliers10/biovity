import { Footer } from "../common/Footer"
import { Header } from "../common/Header"

export const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="landing-layout"
      style={{ fontFamily: "'Satoshi', 'Inter', system-ui, -apple-system, sans-serif" }}
    >
      <Header />
      {children}
      <Footer />
    </div>
  )
}
