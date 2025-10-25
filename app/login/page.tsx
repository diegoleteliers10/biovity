"use client"

import { Building2, Lock, Mail, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

const { signIn } = authClient

export default function LoginPage() {
	const [activeTab, setActiveTab] = useState<"organización" | "persona">("persona")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [rememberMe, setRememberMe] = useState(true)
	const [isLoading, setIsLoading] = useState(false)

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const result = await signIn.email({
				email,
				password,
				rememberMe: rememberMe,
				callbackURL: "/dashboard/employee",
			})

			if (result.error) {
				console.error("Sign in error:", result.error)
				// Handle error (show toast, etc.)
			}
		} catch (error) {
			console.error("Sign in error:", error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-r from-green-100 to-purple-100 flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center space-y-4">
					{/* Logo */}
					<div className="mx-auto w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
						<span className="text-2xl font-bold text-white">B</span>
					</div>

					<div className="space-y-2">
						<CardTitle className="text-2xl font-bold text-gray-800">Bienvenido</CardTitle>
						<CardDescription className="text-gray-600">
							Ingresa tus credenciales para continuar
						</CardDescription>
					</div>

					{/* Tab Navigation */}
					<div className="flex bg-gray-100 rounded-lg p-1">
						<button
							type="button"
							onClick={() => setActiveTab("persona")}
							className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
								activeTab === "persona"
									? "bg-white text-gray-800 shadow-sm"
									: "text-gray-600 hover:text-gray-800"
							}`}
						>
							<User className="w-4 h-4" />
							Persona
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("organización")}
							className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
								activeTab === "organización"
									? "bg-white text-gray-800 shadow-sm"
									: "text-gray-600 hover:text-gray-800"
							}`}
						>
							<Building2 className="w-4 h-4" />
							Organización
						</button>
					</div>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSignIn} className="space-y-6">
						{/* Email Field */}
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium text-gray-700">
								Correo electrónico
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									id="email"
									type="email"
									placeholder="tu@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="pl-10"
									required
									autoComplete="email"
								/>
							</div>
						</div>

						{/* Password Field */}
						<div className="space-y-2">
							<label htmlFor="password" className="text-sm font-medium text-gray-700">
								Contraseña
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="pl-10"
									required
									autoComplete="current-password"
								/>
							</div>
						</div>

						{/* Remember Me and Forgot Password */}
						<div className="flex items-center justify-between">
							<Checkbox
								id="remember"
								checked={rememberMe}
								onChange={(e) => setRememberMe(e.target.checked)}
								label="Recordarme"
							/>
							<button
								type="button"
								className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
							>
								¿Olvidaste tu contraseña?
							</button>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full bg-black text-white hover:bg-gray-800 h-11"
							disabled={isLoading}
						>
							{isLoading ? "Cargando..." : "Iniciar sesión"}
						</Button>
					</form>

					{/* Sign Up Link */}
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							¿No tienes una cuenta?{" "}
							<Link
								href="/register"
								className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
							>
								Regístrate aquí
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
