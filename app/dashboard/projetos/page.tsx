"use client"

import { useEffect, useRef, useState } from "react"
import {
  BadgeCheck,
  Camera,
  Image as ImageIcon,
  LogOut,
  MapPin,
  Phone,
  Save,
  Shield,
  User,
  UserRound,
} from "lucide-react"

import { AppShell } from "@/components/app-shell"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { supabase } from "@/lib/supabase"

type ProfileData = {
  displayName: string
  username: string
  role: string
  status: string
  bio: string
  phone: string
  city: string
  state: string
  zip: string
  avatar: string
  banner: string
  login: string
}

const defaultProfile: ProfileData = {
  displayName: "Usuário",
  username: "usuario",
  role: "basic",
  status: "online",
  bio: "Transformando conversas, estudos, projetos e ideias em um sistema próprio.",
  phone: "",
  city: "",
  state: "",
  zip: "",
  avatar: "",
  banner: "",
  login: "",
}

const statusLabels: Record<string, string> = {
  online: "Online",
  focado: "Focado",
  trabalhando: "Trabalhando",
  offline: "Offline",
}

const statusStyles: Record<string, string> = {
  online: "bg-green-500/20 text-green-400 border-green-500/30",
  focado: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  trabalhando: "bg-red-500/20 text-red-400 border-red-500/30",
  offline: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
}

function getSupabaseErrorMessage(error: any) {
  if (!error) return "Erro desconhecido."
  if (typeof error === "string") return error

  return (
    error.message ||
    error.details ||
    error.hint ||
    error.code ||
    JSON.stringify(error)
  )
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [userId, setUserId] = useState("")
  const [savedMessage, setSavedMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const bannerInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true)
      setSavedMessage("")
      setMessageType("info")

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          window.location.href = "/"
          return
        }

        setUserId(user.id)

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()

        if (error) {
          setMessageType("error")
          setSavedMessage(
            `Erro ao carregar perfil: ${getSupabaseErrorMessage(error)}`
          )
          setIsLoading(false)
          return
        }

        if (data) {
          setProfile({
            ...defaultProfile,
            displayName: data.display_name || user.email || defaultProfile.displayName,
            username: data.username || user.email?.split("@")[0] || defaultProfile.username,
            role: data.role || defaultProfile.role,
            status: data.status || defaultProfile.status,
            bio: data.bio || defaultProfile.bio,
            phone: data.phone || "",
            city: data.city || "",
            state: data.state || "",
            zip: data.zip || "",
            avatar: data.avatar_url || "",
            banner: data.banner_url || "",
            login: data.login || user.email || "",
          })
        } else {
          setProfile({
            ...defaultProfile,
            displayName: user.user_metadata?.display_name || user.email || "Usuário",
            username: user.email?.split("@")[0] || "usuario",
            login: user.email || "",
          })
        }

        setIsLoading(false)
      } catch (error) {
        setMessageType("error")
        setSavedMessage(
          `Erro de conexão com Supabase: ${getSupabaseErrorMessage(error)}`
        )
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  function updateProfile<K extends keyof ProfileData>(
    key: K,
    value: ProfileData[K]
  ) {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    field: "avatar" | "banner"
  ) {
    const file = event.target.files?.[0]

    if (!file) return

    setIsUploading(true)
    setSavedMessage("")
    setMessageType("info")

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

    if (!allowedTypes.includes(file.type)) {
      setIsUploading(false)
      setMessageType("error")
      setSavedMessage("Formato inválido. Use JPG, PNG, WEBP ou GIF.")
      event.target.value = ""
      return
    }

    const maxSizeMb = 3
    const maxSizeBytes = maxSizeMb * 1024 * 1024

    if (file.size > maxSizeBytes) {
      setIsUploading(false)
      setMessageType("error")
      setSavedMessage(`Imagem muito grande. Use uma imagem com até ${maxSizeMb}MB.`)
      event.target.value = ""
      return
    }

    const extensionByType: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    }

    const extension = extensionByType[file.type] || "jpg"

    const cleanId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now())

    const filePath = `${userId || "user"}/${field}-${cleanId}.${extension}`

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: true,
        })

      if (uploadError) {
        setIsUploading(false)
        setMessageType("error")
        setSavedMessage(`Erro ao enviar imagem: ${uploadError.message}`)
        event.target.value = ""
        return
      }

      const uploadedPath = uploadData?.path || filePath

      const { data } = supabase.storage
        .from("profile-images")
        .getPublicUrl(uploadedPath)

      if (!data.publicUrl) {
        setIsUploading(false)
        setMessageType("error")
        setSavedMessage("Imagem enviada, mas não foi possível gerar URL pública.")
        event.target.value = ""
        return
      }

      updateProfile(field, data.publicUrl)

      setIsUploading(false)
      setMessageType("success")
      setSavedMessage(
        field === "avatar"
          ? "Foto enviada. Clique em Salvar perfil."
          : "Banner enviado. Clique em Salvar perfil."
      )

      event.target.value = ""
    } catch (error) {
      setIsUploading(false)
      setMessageType("error")
      setSavedMessage(
        `Erro de conexão ao enviar imagem: ${getSupabaseErrorMessage(error)}`
      )
      event.target.value = ""
    }
  }

  async function handleSaveProfile() {
    if (!userId) {
      setMessageType("error")
      setSavedMessage("Usuário não encontrado. Faça login novamente.")
      return
    }

    setIsSaving(true)
    setSavedMessage("")
    setMessageType("info")

    try {
      const { error } = await supabase.from("profiles").upsert(
        {
          user_id: userId,
          display_name: profile.displayName,
          username: profile.username,
          role: profile.role,
          status: profile.status,
          bio: profile.bio,
          phone: profile.phone,
          city: profile.city,
          state: profile.state,
          zip: profile.zip,
          avatar_url: profile.avatar,
          banner_url: profile.banner,
          login: profile.login,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )

      setIsSaving(false)

      if (error) {
        setMessageType("error")
        setSavedMessage(`Erro ao salvar: ${getSupabaseErrorMessage(error)}`)
        return
      }

      setMessageType("success")
      setSavedMessage("Perfil salvo na nuvem.")

      window.setTimeout(() => {
        setSavedMessage("")
      }, 2500)
    } catch (error) {
      setIsSaving(false)
      setMessageType("error")
      setSavedMessage(
        `Erro de conexão ao salvar: ${getSupabaseErrorMessage(error)}`
      )
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.localStorage.removeItem("monstro:last-email")
    window.location.href = "/"
  }

  const messageClass =
    messageType === "error"
      ? "border-red-500/20 bg-red-500/10 text-red-400"
      : messageType === "success"
        ? "border-green-500/20 bg-green-500/10 text-green-400"
        : "border-white/10 bg-black/30 text-zinc-400"

  return (
    <AppShell>
      <div className="space-y-6">
        <Card className="overflow-hidden border-white/10 bg-zinc-950/80 text-white shadow-2xl">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-red-950 via-zinc-950 to-black">
            {profile.banner ? (
              <img
                src={profile.banner}
                alt="Banner do perfil"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <>
                <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-red-600/30 blur-3xl" />
                <div className="absolute bottom-0 left-20 h-72 w-72 rounded-full bg-red-900/30 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px]" />
              </>
            )}

            <div className="absolute inset-0 bg-black/35" />

            <Button
              variant="outline"
              size="sm"
              disabled={isUploading}
              className="absolute right-4 top-4 gap-2 bg-black/40 backdrop-blur"
              onClick={() => bannerInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4" />
              {isUploading ? "Enviando..." : "Trocar banner"}
            </Button>

            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleImageUpload(event, "banner")}
            />
          </div>

          <CardContent className="relative p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-black bg-red-500/20 shadow-xl">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-12 w-12 text-red-500" />
                    )}
                  </div>

                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black text-white shadow-lg transition-colors hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Camera className="h-4 w-4" />
                  </button>

                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageUpload(event, "avatar")}
                  />
                </div>

                <div className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-black tracking-tight">
                      {profile.displayName || "Sem nome"}
                    </h1>

                    <Badge className="gap-1 border-red-500/30 bg-red-500/20 text-red-400">
                      <BadgeCheck className="h-3 w-3" />
                      {profile.role === "admin" ? "Admin" : "Membro"}
                    </Badge>
                  </div>

                  <p className="text-sm text-zinc-400">
                    @{profile.username || "usuario"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={
                        statusStyles[profile.status] ||
                        "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
                      }
                    >
                      {statusLabels[profile.status] || profile.status}
                    </Badge>

                    <Badge variant="outline">{profile.login}</Badge>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={isSaving || isLoading || isUploading}
                className="gap-2 bg-red-600 hover:bg-red-700"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Salvando..." : "Salvar perfil"}
              </Button>
            </div>

            {savedMessage && (
              <div className={`mt-4 rounded-lg border p-3 text-sm ${messageClass}`}>
                {savedMessage}
              </div>
            )}

            {isLoading && (
              <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-zinc-400">
                Carregando perfil do Supabase...
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-red-500" />
                  Identidade
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Nome de exibição</Label>
                    <Input
                      value={profile.displayName}
                      onChange={(event) =>
                        updateProfile("displayName", event.target.value)
                      }
                      placeholder="Seu nome"
                      className="border-white/10 bg-black/30 text-white"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Username</Label>
                    <Input
                      value={profile.username}
                      onChange={(event) =>
                        updateProfile("username", event.target.value)
                      }
                      placeholder="seu-nick"
                      className="border-white/10 bg-black/30 text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Role do sistema</Label>
                    <Input
                      value={profile.role}
                      disabled
                      className="border-white/10 bg-black/30 text-zinc-400"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select
                      value={profile.status}
                      onValueChange={(value) => updateProfile("status", value)}
                    >
                      <SelectTrigger className="border-white/10 bg-black/30 text-white">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="focado">Focado</SelectItem>
                        <SelectItem value="trabalhando">Trabalhando</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={profile.bio}
                    onChange={(event) => updateProfile("bio", event.target.value)}
                    placeholder="Escreva uma bio curta..."
                    className="min-h-[120px] border-white/10 bg-black/30 text-white placeholder:text-zinc-500"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Login e segurança
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
                  Perfil conectado ao Supabase. Seus dados ficam salvos na
                  nuvem e ligados ao seu usuário real.
                </div>

                <div className="grid gap-2">
                  <Label>Email de login</Label>
                  <Input
                    value={profile.login}
                    disabled
                    className="border-white/10 bg-black/30 text-zinc-400"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-red-500" />
                  Contato
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Telefone</Label>
                  <Input
                    value={profile.phone}
                    onChange={(event) =>
                      updateProfile("phone", event.target.value)
                    }
                    placeholder="(00) 00000-0000"
                    className="border-white/10 bg-black/30 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-500" />
                  Localização
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Cidade</Label>
                  <Input
                    value={profile.city}
                    onChange={(event) =>
                      updateProfile("city", event.target.value)
                    }
                    placeholder="Cidade"
                    className="border-white/10 bg-black/30 text-white"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Estado</Label>
                  <Input
                    value={profile.state}
                    onChange={(event) =>
                      updateProfile("state", event.target.value)
                    }
                    placeholder="RS, SP, RJ..."
                    className="border-white/10 bg-black/30 text-white"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>CEP</Label>
                  <Input
                    value={profile.zip}
                    onChange={(event) => updateProfile("zip", event.target.value)}
                    placeholder="00000-000"
                    className="border-white/10 bg-black/30 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
              <CardHeader>
                <CardTitle>Tags do sistema</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Biohacker Engine</Badge>
                  <Badge variant="outline">Oficina Tech</Badge>
                  <Badge variant="outline">Consultoria</Badge>
                  <Badge variant="outline">Conteúdo</Badge>
                  <Badge variant="outline">Second Brain</Badge>
                  <Badge variant="outline">Knowledge Base</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500/20 bg-red-950/10 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="text-red-400">Sessão</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving || isLoading || isUploading}
                  className="w-full gap-2 bg-red-600 hover:bg-red-700"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Salvando..." : "Salvar alterações"}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair da conta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}