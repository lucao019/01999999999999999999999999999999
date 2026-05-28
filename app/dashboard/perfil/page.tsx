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
  X,
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

  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [cropImageUrl, setCropImageUrl] = useState("")
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [cropZoom, setCropZoom] = useState(1)
  const [cropX, setCropX] = useState(0)
  const [cropY, setCropY] = useState(0)
  const [isDraggingCrop, setIsDraggingCrop] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

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
            displayName:
              data.display_name || user.email || defaultProfile.displayName,
            username:
              data.username ||
              user.email?.split("@")[0] ||
              defaultProfile.username,
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
            displayName:
              user.user_metadata?.display_name || user.email || "Usuário",
            username: user.email?.split("@")[0] || "usuario",
            role: "basic",
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

  function validateImageFile(file: File) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

    if (!allowedTypes.includes(file.type)) {
      return "Formato inválido. Use JPG, PNG, WEBP ou GIF."
    }

    const maxSizeMb = 3
    const maxSizeBytes = maxSizeMb * 1024 * 1024

    if (file.size > maxSizeBytes) {
      return `Imagem muito grande. Use uma imagem com até ${maxSizeMb}MB.`
    }

    return ""
  }

  function openAvatarCrop(file: File) {
    const objectUrl = URL.createObjectURL(file)

    setCropFile(file)
    setCropImageUrl(objectUrl)
    setCropZoom(1)
    setCropX(0)
    setCropY(0)
    setCropModalOpen(true)
  }

  function closeCropModal() {
    if (cropImageUrl) {
      URL.revokeObjectURL(cropImageUrl)
    }

    setCropModalOpen(false)
    setCropImageUrl("")
    setCropFile(null)
    setCropZoom(1)
    setCropX(0)
    setCropY(0)
    setIsDraggingCrop(false)
  }

  function handleCropMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    setIsDraggingCrop(true)
    setDragStart({
      x: event.clientX - cropX,
      y: event.clientY - cropY,
    })
  }

  function handleCropMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!isDraggingCrop) return

    setCropX(event.clientX - dragStart.x)
    setCropY(event.clientY - dragStart.y)
  }

  function handleCropMouseUp() {
    setIsDraggingCrop(false)
  }

  function handleCropTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0]

    setIsDraggingCrop(true)
    setDragStart({
      x: touch.clientX - cropX,
      y: touch.clientY - cropY,
    })
  }

  function handleCropTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (!isDraggingCrop) return

    const touch = event.touches[0]

    setCropX(touch.clientX - dragStart.x)
    setCropY(touch.clientY - dragStart.y)
  }

  function handleCropTouchEnd() {
    setIsDraggingCrop(false)
  }

  async function createCroppedAvatarBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!cropFile || !cropImageUrl) {
        reject(new Error("Nenhuma imagem selecionada."))
        return
      }

      const image = new Image()
      image.src = cropImageUrl

      image.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = 800
        canvas.height = 800

        const context = canvas.getContext("2d")

        if (!context) {
          reject(new Error("Não foi possível processar a imagem."))
          return
        }

        context.fillStyle = "#000"
        context.fillRect(0, 0, canvas.width, canvas.height)

        const imageRatio = image.width / image.height

        let drawWidth = canvas.width * cropZoom
        let drawHeight = drawWidth / imageRatio

        if (drawHeight < canvas.height * cropZoom) {
          drawHeight = canvas.height * cropZoom
          drawWidth = drawHeight * imageRatio
        }

        const drawX = (canvas.width - drawWidth) / 2 + cropX * 2
        const drawY = (canvas.height - drawHeight) / 2 + cropY * 2

        context.drawImage(image, drawX, drawY, drawWidth, drawHeight)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Não foi possível gerar o recorte."))
              return
            }

            resolve(blob)
          },
          "image/jpeg",
          0.92
        )
      }

      image.onerror = () => {
        reject(new Error("Erro ao carregar imagem."))
      }
    })
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    field: "avatar" | "banner"
  ) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!userId) {
      setMessageType("error")
      setSavedMessage("Usuário não carregado. Atualize a página e tente novamente.")
      event.target.value = ""
      return
    }

    const validationError = validateImageFile(file)

    if (validationError) {
      setMessageType("error")
      setSavedMessage(validationError)
      event.target.value = ""
      return
    }

    if (field === "avatar") {
      openAvatarCrop(file)
      event.target.value = ""
      return
    }

    setIsUploading(true)
    setSavedMessage("")
    setMessageType("info")

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

    const filePath = `${userId}/${field}-${cleanId}.${extension}`

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
      setSavedMessage("Banner enviado. Clique em Salvar perfil.")

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

  async function handleConfirmAvatarCrop() {
    if (!cropFile) return

    if (!userId) {
      setMessageType("error")
      setSavedMessage("Usuário não carregado. Atualize a página e tente novamente.")
      return
    }

    setIsUploading(true)
    setSavedMessage("")
    setMessageType("info")

    try {
      const croppedBlob = await createCroppedAvatarBlob()

      const cleanId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now())

      const filePath = `${userId}/avatar-${cleanId}.jpg`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, croppedBlob, {
          cacheControl: "3600",
          contentType: "image/jpeg",
          upsert: true,
        })

      if (uploadError) {
        setIsUploading(false)
        setMessageType("error")
        setSavedMessage(`Erro ao enviar imagem: ${uploadError.message}`)
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
        return
      }

      updateProfile("avatar", data.publicUrl)

      setIsUploading(false)
      setMessageType("success")
      setSavedMessage("Foto recortada. Clique em Salvar perfil.")

      closeCropModal()
    } catch (error) {
      setIsUploading(false)
      setMessageType("error")
      setSavedMessage(`Erro ao recortar imagem: ${getSupabaseErrorMessage(error)}`)
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
          // username sanitizado: apenas letras, números e hífens
          username: profile.username
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
            .slice(0, 30),
          // role NUNCA é enviado pelo cliente — protegido pelo banco via RLS
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

      {cropModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-5 text-white shadow-2xl">
            <button
              type="button"
              onClick={closeCropModal}
              disabled={isUploading}
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 p-2 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 pr-10">
              <h2 className="text-xl font-black">Ajustar foto de perfil</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Arraste a imagem e ajuste o zoom antes de salvar.
              </p>
            </div>

            <div
              className="relative mx-auto h-72 w-72 cursor-grab touch-none overflow-hidden rounded-full border-4 border-red-500/40 bg-black active:cursor-grabbing"
              onMouseDown={handleCropMouseDown}
              onMouseMove={handleCropMouseMove}
              onMouseUp={handleCropMouseUp}
              onMouseLeave={handleCropMouseUp}
              onTouchStart={handleCropTouchStart}
              onTouchMove={handleCropTouchMove}
              onTouchEnd={handleCropTouchEnd}
            >
              <img
                src={cropImageUrl}
                alt="Recorte do avatar"
                draggable={false}
                className="absolute left-1/2 top-1/2 max-w-none select-none"
                style={{
                  width: `${100 * cropZoom}%`,
                  transform: `translate(calc(-50% + ${cropX}px), calc(-50% + ${cropY}px))`,
                }}
              />

              <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/30" />
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-sm text-zinc-400">
                <span>Zoom</span>
                <span>{cropZoom.toFixed(1)}x</span>
              </div>

              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={cropZoom}
                onChange={(event) => setCropZoom(Number(event.target.value))}
                className="w-full accent-red-600"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeCropModal}
                disabled={isUploading}
                className="flex-1"
              >
                Cancelar
              </Button>

              <Button
                type="button"
                onClick={handleConfirmAvatarCrop}
                disabled={isUploading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isUploading ? "Enviando..." : "Salvar recorte"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}