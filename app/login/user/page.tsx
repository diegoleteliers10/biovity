"use client";

import {
  SquareLock02Icon,
  Mail01Icon,
  UserIcon,
  ViewIcon,
  ViewOffSlashIcon,
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
import { authClient } from "@/lib/auth-client";
import { Logo } from "@/components/ui/logo";

const { signIn } = authClient;

export default function UserLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard/employee";
  const { useSession } = authClient;
  const { data: session, isPending } = useSession();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    profession: "",
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-r from-green-100 to-purple-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          {/* Logo */}
          <div className="mx-auto">
            <Logo size="lg" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Bienvenido
            </CardTitle>
            <CardDescription className="text-gray-600">
              Acceso para usuarios individuales
            </CardDescription>
          </div>

          {/* User Type Indicator */}
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 rounded-md">
            <HugeiconsIcon
              icon={UserIcon}
              size={16}
              strokeWidth={1.5}
              className="text-blue-600"
            />
            <span className="text-sm font-medium text-blue-700">
              Acceso de Usuario
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Correo electrónico
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
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  required
                  autoComplete="email"
                  autoFill="current-email"
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
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  required
                  autoComplete="current-password"
                  autoFill="current-password"
                />
                <button
                  type="button"
                  aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={isPasswordVisible}
                  onClick={() => setIsPasswordVisible((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-0 rounded"
                >
                  <HugeiconsIcon
                    icon={isPasswordVisible ? ViewOffSlashIcon : ViewIcon}
                    size={18}
                    strokeWidth={1.75}
                  />
                </button>
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
                label="Recordarme"
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
              className="w-full bg-black text-white hover:bg-gray-800 h-11"
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Iniciar sesión"}
            </Button>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link
                  href="/register/user"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Regístrate como usuario
                </Link>
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Eres una organización?{" "}
                <Link
                  href="/login/organization"
                  className="text-purple-600 hover:text-purple-800 hover:underline font-medium"
                >
                  Acceso organizacional
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
