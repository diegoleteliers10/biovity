"use client"

import { Building2, Globe, Lock, Mail, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

const { signUp } = authClient

export default function RegisterPage() {
	const [activeTab, setActiveTab] = useState<"organización" | "persona">("persona")
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		organizationName: "",
		organizationWebsite: "",
		type: activeTab === "persona" ? "persona" : "organización",
	})
	const [acceptTerms, setAcceptTerms] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }))
		}
	}

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.name.trim()) {
			newErrors.name = "El nombre es requerido"
		}

		if (!formData.email.trim()) {
			newErrors.email = "El correo electrónico es requerido"
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "El correo electrónico no es válido"
		}

		if (!formData.password) {
			newErrors.password = "La contraseña es requerida"
		} else if (formData.password.length < 6) {
			newErrors.password = "La contraseña debe tener al menos 6 caracteres"
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Las contraseñas no coinciden"
		}

		if (activeTab === "organización") {
			if (!formData.organizationName.trim()) {
				newErrors.organizationName = "El nombre de la organización es requerido"
			}

			if (!formData.organizationWebsite.trim()) {
				newErrors.organizationWebsite = "La web de la organización es requerida"
			} else if (!/^https?:\/\/.+/.test(formData.organizationWebsite)) {
				newErrors.organizationWebsite = "La URL debe comenzar con http:// o https://"
			}
		}

		if (!acceptTerms) {
			newErrors.terms = "Debes aceptar los términos y condiciones"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		setIsLoading(true)

		try {
			const result = await signUp.email({
				email: formData.email,
				password: formData.password,
				name: formData.name,
				type: formData.type,
				callbackURL: "/dashboard/employee",
			})

			if (result.error) {
				console.error("Sign up error:", result.error)
				setErrors({ general: "Error al crear la cuenta. Inténtalo de nuevo." })
			} else {
				// Redirect to dashboard
				window.location.href = "/register"
			}
		} catch (error) {
			console.error("Sign up error:", error)
			setErrors({ general: "Error al crear la cuenta. Inténtalo de nuevo." })
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
						<CardTitle className="text-2xl font-bold text-gray-800">Crear cuenta</CardTitle>
						<CardDescription className="text-gray-600">
							Completa el formulario para registrarte
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
							Usuario
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
					<form onSubmit={handleSignUp} className="space-y-6">
						{/* Name Field */}
						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium text-gray-700">
								{activeTab === "persona" ? "Nombre" : "Nombre de la persona"}
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									id="name"
									type="text"
									placeholder={
										activeTab === "persona" ? "Tu nombre completo" : "Tu nombre completo"
									}
									value={formData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
									required
								/>
							</div>
							{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
						</div>

						{/* Organization Fields - Only show when organization tab is selected */}
						{activeTab === "organización" && (
							<>
								{/* Organization Name Field */}
								<div className="space-y-2">
									<label htmlFor="organizationName" className="text-sm font-medium text-gray-700">
										Nombre de la organización
									</label>
									<div className="relative">
										<Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
										<Input
											id="organizationName"
											type="text"
											placeholder="Nombre de tu organización"
											value={formData.organizationName}
											onChange={(e) => handleInputChange("organizationName", e.target.value)}
											className={`pl-10 ${errors.organizationName ? "border-red-500" : ""}`}
											required
										/>
									</div>
									{errors.organizationName && (
										<p className="text-sm text-red-500">{errors.organizationName}</p>
									)}
								</div>

								{/* Organization Website Field */}
								<div className="space-y-2">
									<label
										htmlFor="organizationWebsite"
										className="text-sm font-medium text-gray-700"
									>
										Web de la organización
									</label>
									<div className="relative">
										<Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
										<Input
											id="organizationWebsite"
											type="url"
											placeholder="https://tuorganizacion.com"
											value={formData.organizationWebsite}
											onChange={(e) => handleInputChange("organizationWebsite", e.target.value)}
											className={`pl-10 ${errors.organizationWebsite ? "border-red-500" : ""}`}
											required
										/>
									</div>
									{errors.organizationWebsite && (
										<p className="text-sm text-red-500">{errors.organizationWebsite}</p>
									)}
								</div>
							</>
						)}

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
									value={formData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
									required
								/>
							</div>
							{errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
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
									value={formData.password}
									onChange={(e) => handleInputChange("password", e.target.value)}
									className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
									required
								/>
							</div>
							{errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
						</div>

						{/* Confirm Password Field */}
						<div className="space-y-2">
							<label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
								Confirmar contraseña
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									id="confirmPassword"
									type="password"
									placeholder="••••••••"
									value={formData.confirmPassword}
									onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
									className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
									required
								/>
							</div>
							{errors.confirmPassword && (
								<p className="text-sm text-red-500">{errors.confirmPassword}</p>
							)}
						</div>

						{/* Terms and Conditions */}
						<div className="space-y-2">
							<Checkbox
								id="terms"
								checked={acceptTerms}
								onChange={(e) => setAcceptTerms(e.target.checked)}
								label={
									<span className="text-sm text-gray-700">
										Acepto los{" "}
										<button
											type="button"
											className="text-blue-600 hover:text-blue-800 hover:underline"
										>
											términos y condiciones
										</button>
									</span>
								}
							/>
							{errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
						</div>

						{/* General Error */}
						{errors.general && (
							<div className="text-sm text-red-500 text-center">{errors.general}</div>
						)}

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full bg-black text-white hover:bg-gray-800 h-11"
							disabled={isLoading}
						>
							{isLoading ? "Creando cuenta..." : "Crear cuenta"}
						</Button>
					</form>

					{/* Login Link */}
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							¿Ya tienes una cuenta?{" "}
							<Link
								href="/login"
								className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
							>
								Inicia sesión aquí
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
