import { Footer } from "../common/Footer"
import { Header } from "../common/Header"

export const LandingLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	)
}
