"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit01Icon,
  FloppyDiskIcon,
  Cancel01Icon,
  UserIcon,
  Mail01Icon,
  SmartPhone01Icon,
  Location01Icon,
  Briefcase01Icon,
  Calendar01Icon,
  Camera01Icon,
} from "@hugeicons/core-free-icons"
import { authClient } from "@/lib/auth-client"
import { profileSaveSchema, validateForm as validateFormZod } from "@/lib/validations"

type ProfileData = {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly location: string
  readonly profession: string
  readonly bio: string
  readonly experience: string
  readonly skills: readonly string[]
  readonly avatar: string
}

type SessionUser = {
  readonly name?: string
  readonly email?: string
  readonly image?: string
  readonly location?: string
  readonly title?: string
}

const EmployeeProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Aline Larroucau",
    email: "aline.larroucau@email.com",
    phone: "+1 (555) 123-4567",
    location: "Madrid, España",
    profession: "Biotecnóloga",
    bio: "Especialista en biotecnología con más de 5 años de experiencia en investigación y desarrollo de productos farmacéuticos. Apasionada por la innovación y el impacto positivo en la salud.",
    experience: "5 años",
    skills: ["Biotecnología", "Investigación", "Desarrollo", "Análisis"],
    avatar: "",
  })

  const [formData, setFormData] = useState<ProfileData>(profileData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { useSession } = authClient
  const { data: session } = useSession()

  useEffect(() => {
    const user: SessionUser | undefined = session?.user as SessionUser | undefined
    if (!user) return

    setProfileData((prev) => ({
      ...prev,
      name: user.name ?? prev.name,
      email: user.email ?? prev.email,
      avatar: user.image ?? prev.avatar,
      location: user.location ?? prev.location,
      profession: user.title ?? prev.profession,
    }))
  }, [session])

  useEffect(() => {
    setFormData(profileData)
  }, [profileData])

  const handleInputChange = useCallback(
    (field: keyof ProfileData, value: string | readonly string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => {
        if (prev[field]) {
          const next = { ...prev }
          delete next[field]
          return next
        }
        return prev
      })
    },
    []
  )

  const handleSave = useCallback(() => {
    const result = validateFormZod(profileSaveSchema, {
      name: formData.name,
      email: formData.email,
      profession: formData.profession,
    })

    if (!result.success) {
      setErrors(result.errors)
      return
    }

    setProfileData(formData)
    setIsEditing(false)
    setErrors({})
  }, [formData])

  const handleCancel = useCallback(() => {
    setFormData(profileData)
    setIsEditing(false)
    setErrors({})
  }, [profileData])

  const handleAvatarUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData((prev) => ({ ...prev, avatar: result }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y profesional</p>
        </div>
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing(!isEditing)}
          className="gap-2"
        >
          <HugeiconsIcon icon={isEditing ? Cancel01Icon : Edit01Icon} size={16} />
          {isEditing ? "Cancelar" : "Editar Perfil"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center pb-4">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <HugeiconsIcon icon={UserIcon} size={32} className="text-primary" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                  <HugeiconsIcon icon={Camera01Icon} size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <CardTitle className="text-xl">{profileData.name}</CardTitle>
            <p className="text-muted-foreground">{profileData.profession}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <HugeiconsIcon icon={Location01Icon} size={16} className="text-muted-foreground" />
              <span>{profileData.location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <HugeiconsIcon icon={Briefcase01Icon} size={16} className="text-muted-foreground" />
              <span>{profileData.experience} de experiencia</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <HugeiconsIcon icon={Calendar01Icon} size={16} className="text-muted-foreground" />
              <span>Miembro desde 2023</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={UserIcon} size={20} />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nombre completo</label>
                  {isEditing ? (
                    <div className="relative">
                      <HugeiconsIcon
                        icon={UserIcon}
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                        placeholder="Tu nombre completo"
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{profileData.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  {isEditing ? (
                    <div className="relative">
                      <HugeiconsIcon
                        icon={Mail01Icon}
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                        placeholder="tu@email.com"
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{profileData.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Teléfono</label>
                  {isEditing ? (
                    <div className="relative">
                      <HugeiconsIcon
                        icon={SmartPhone01Icon}
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-10"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{profileData.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Ubicación</label>
                  {isEditing ? (
                    <div className="relative">
                      <HugeiconsIcon
                        icon={Location01Icon}
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="pl-10"
                        placeholder="Ciudad, País"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{profileData.location}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={Briefcase01Icon} size={20} />
                Información Profesional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Profesión</label>
                {isEditing ? (
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Briefcase01Icon}
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      value={formData.profession}
                      onChange={(e) => handleInputChange("profession", e.target.value)}
                      className={`pl-10 ${errors.profession ? "border-destructive" : ""}`}
                      placeholder="Tu profesión"
                    />
                    {errors.profession && (
                      <p className="text-sm text-destructive">{errors.profession}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{profileData.profession}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Biografía</label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none"
                    placeholder="Cuéntanos sobre ti..."
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{profileData.bio}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Años de experiencia</label>
                {isEditing ? (
                  <Input
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    placeholder="Ej: 5 años"
                  />
                ) : (
                  <p className="text-muted-foreground">{profileData.experience}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Habilidades</label>
                {isEditing ? (
                  <Input
                    value={formData.skills.join(", ")}
                    onChange={(e) => handleInputChange("skills", e.target.value.split(", "))}
                    placeholder="Habilidad 1, Habilidad 2, Habilidad 3"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleCancel}>
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
                Guardar Cambios
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default EmployeeProfile
