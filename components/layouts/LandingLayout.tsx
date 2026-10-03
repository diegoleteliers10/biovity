import "@/app/landing-scroll.css"
import { Footer } from "../common/Footer"
import { Header } from "../common/Header"

// Sin bloqueo de sesion: el Header resuelve la sesion en el cliente.
// Antes, getServerSession() frenaba el TTFB de cada pagina publica (/, /jobs, /learn).
export const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // overflow-x: clip, not hidden. "hidden" makes the computed overflow-y
    // "auto", which turns this wrapper into a nested scroll container and
    // breaks scrollIntoView plus any scroll-linked animation. "clip" hides the
    // same overflow and creates no scroll box.
    <div className="landing-public overflow-x-clip">
      <Header session={null} />
      {children}
      <Footer />
    </div>
  )
}
