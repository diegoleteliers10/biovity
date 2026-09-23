import { Footer } from "../common/Footer"
import { Header } from "../common/Header"

// Sin bloqueo de sesion: el Header resuelve la sesion en el cliente.
// Antes, getServerSession() frenaba el TTFB de cada pagina publica (/, /jobs, /learn).
export const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-x-hidden">
      <Header session={null} />
      {children}
      <Footer />
    </div>
  )
}
