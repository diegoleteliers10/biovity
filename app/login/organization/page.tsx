"use client";

import {
  Building06Icon,
  Globe02Icon,
  SquareLock02Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { authClient } from "@/lib/auth-client";

const { signIn } = authClient;

export default function OrganizationLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard/organization";
  const { useSession } = authClient;
  const { data: session, isPending } = useSession();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    organizationDomain: "",
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirigir si ya hay sesión activa
  useEffect(() => {
    if (!isPending && session?.user) {
      if (session.user.type === "persona") {
        router.push("/dashboard/employee");
      } else if (session.user.type === "organización") {
        router.push("/dashboard/organization");
      }
    }
  }, [session, isPending, router]);

  // Mostrar loading mientras se verifica la sesión
  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-sm text-gray-600">Verificando sesión...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si hay sesión, no mostrar nada (se está redirigiendo)
  if (session?.user) {
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const result = await signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: rememberMe,
        // Metadata adicional para organizaciones
        organizationType: "organization",
        domain: formData.organizationDomain,
      });

      if (result.error) {
        console.error("Sign in error:", result.error);
        setErrors({
          general:
            "Credenciales inválidas. Por favor verifica tu email y contraseña.",
        });
      } else {
        // Login exitoso, redirigir a la página solicitada
        router.push(redirectTo);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setErrors({ general: "Error al iniciar sesión. Inténtalo de nuevo." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          {/* Logo */}
          <div className="mx-auto">
            <Logo size="lg" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Portal Organizacional
            </CardTitle>
            <CardDescription className="text-gray-600">
              Acceso para empresas y organizaciones
            </CardDescription>
          </div>

          {/* Organization Type Indicator */}
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-purple-50 rounded-md">
            <HugeiconsIcon
              icon={Building06Icon}
              size={16}
              strokeWidth={1.5}
              className="text-purple-600"
            />
            <span className="text-sm font-medium text-purple-700">
              Acceso Organizacional
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Organization Domain Field */}
            <div className="space-y-2">
              <label
                htmlFor="organizationDomain"
                className="text-sm font-medium text-gray-700"
              >
                Dominio de la organización
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Globe02Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  id="organizationDomain"
                  type="text"
                  placeholder="tuorganizacion.com"
                  value={formData.organizationDomain}
                  onChange={(e) =>
                    handleInputChange("organizationDomain", e.target.value)
                  }
                  className={`pl-10 ${errors.organizationDomain ? "border-red-500" : ""}`}
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Ingresa el dominio de tu organización sin http://
              </p>
              {errors.organizationDomain && (
                <p className="text-sm text-red-500">
                  {errors.organizationDomain}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Correo electrónico corporativo
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@tuorganizacion.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  required
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={SquareLock02Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                  required
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                label="Recordar organización"
              />
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="text-sm text-red-500 text-center">
                {errors.general}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 text-white hover:bg-purple-700 h-11"
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Acceder al portal"}
            </Button>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Tu organización no está registrada?{" "}
                <Link
                  href="/register/organization"
                  className="text-purple-600 hover:text-purple-800 hover:underline font-medium"
                >
                  Registrar organización
                </Link>
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Eres usuario individual?{" "}
                <Link
                  href="/login/user"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Acceso de usuario
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
