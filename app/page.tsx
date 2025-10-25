import { Categories } from "../components/LandingComponents/Home/Categories"
import { Hero } from "../components/LandingComponents/Home/Hero"
import { Stats } from "../components/LandingComponents/Home/Stats"
import { LandingLayout } from "../components/Layouts/LandingLayout"

//landing page
export default function Home() {
	return (
		<LandingLayout>
			<main className="flex min-h-screen flex-col">
				<div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 -z-10">
					<div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl"></div>
					<div className="absolute top-20 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-25 blur-3xl"></div>
					<div className="absolute top-40 left-1/4 w-72 h-72 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-20 blur-3xl"></div>
					<div className="absolute top-10 left-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-25 blur-3xl"></div>
				</div>

				<Hero />
				<Stats />
				<Categories />
			</main>
		</LandingLayout>
	)
}
