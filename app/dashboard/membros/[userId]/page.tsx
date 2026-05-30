"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  BadgeCheck,
  Crown,
  MapPin,
  MessageCircle,
  Trophy,
  UserRound,
} from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PublicProfile = {
  user_id: string
  display_name: string | null
  username: string | null
  role: string | null
  status: string | null
  bio: string | null
  city: string | null
  state: string | null
  avatar_url: string | null
  banner_url: string | null
}

type UserPoints = {
  user_id: string
  points: number
  level: number
}

type MemberPresence = {
  user_id: string
  last_seen: string
  current_page: string | null
}

function isRecentlyOnline(lastSeen?: string | null) {
  if (!lastSeen) return false

  const lastSeenTime = new Date(lastSeen).getTime()
  const now = Date.now()

  return now - lastSeenTime <= 5 * 60 * 1000
}

function getInitials(name?: string | null) {
  if (!name) return "U"

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const statusLabels: Record<string, string> = {
  disponivel: "Disponível",
  focado: "Focado",
  trabalhando: "Trabalhando",
  offline: "Offline",
}

const statusStyles: Record<string, string> = {
  disponivel: "border-green-500/30 bg-green-500/10 text-green-400",
  focado: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  trabalhando: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  offline: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
}

export default function MembroPage() {
  const params = useParams()
  const userId = String(params.userId || "")

  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [points, setPoints] = useState<UserPoints | null>(null)
  const [presence, setPresence] = useState<MemberPresence | null>(null)
  const [commentCount, setCommentCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    async function loadMember() {
      if (!userId) return

      setIsLoading(true)
      setErrorMessage("")

      const [
        { data: profileData, error: profileError },
        { data: pointsData, error: pointsError },
        { data: presenceData, error: presenceError },
        { count, error: commentsError },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "user_id, display_name, username, role, status, bio, city, state, avatar_url, banner_url"
          )
          .eq("user_id", userId)
          .maybeSingle(),

        supabase
          .from("user_points")
          .select("user_id, points, level")
          .eq("user_id", userId)
          .maybeSingle(),

        supabase
          .from("member_presence")
          .select("user_id, last_seen, current_page")
          .eq("user_id", userId)
          .maybeSingle(),

        supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId),
      ])

      if (profileError) {
        console.error("Erro ao carregar membro:", profileError)
        setErrorMessage(`Erro ao carregar membro: ${profileError.message}`)
      }

      if (pointsError) {
        console.error("Erro ao carregar pontos:", pointsError)
      }

      if (presenceError) {
        console.error("Erro ao carregar presença:", presenceError)
      }

      if (commentsError) {
        console.error("Erro ao contar comentários:", commentsError)
      }

      setProfile(profileData as PublicProfile | null)
      setPoints(pointsData as UserPoints | null)
      setPresence(presenceData as MemberPresence | null)
      setCommentCount(count || 0)
      setIsLoading(false)
    }

    loadMember()
  }, [userId])

  if (isLoading) {
    return (
      <AppShell>
        <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
          <CardContent className="p-6 text-zinc-400">
            Carregando perfil do membro...
          </CardContent>
        </Card>
      </AppShell>
    )
  }

  if (!profile) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Link href="/timeline">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>

          <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
            <CardContent className="space-y-3 p-6">
              <p className="text-zinc-400">Membro não encontrado.</p>

              {errorMessage && (
                <p className="text-sm text-red-400">{errorMessage}</p>
              )}

              <p className="break-all text-xs text-zinc-600">
                user_id recebido: {userId || "vazio"}
              </p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  const name = profile.display_name || profile.username || "Usuário"
  const online = isRecentlyOnline(presence?.last_seen)
  const status = profile.status || "offline"

  return (
    <AppShell>
      <div className="space-y-6">
        <Link href="/timeline">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <Card className="overflow-hidden border-white/10 bg-zinc-950/80 text-white shadow-2xl">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-red-950 via-zinc-950 to-black">
            {profile.banner_url ? (
              <img
                src={profile.banner_url}
                alt={`Banner de ${name}`}
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
          </div>

          <CardContent className="relative p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-black bg-red-500/20 shadow-xl">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-black text-red-400">
                        {getInitials(name)}
                      </span>
                    )}
                  </div>

                  <span
                    className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-black ${
                      online ? "bg-green-500" : "bg-zinc-600"
                    }`}
                  />
                </div>

                <div className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-black tracking-tight">
                      {name}
                    </h1>

                    {profile.role === "admin" ? (
                      <Badge className="gap-1 border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
                        <Crown className="h-3 w-3" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge className="gap-1 border-blue-500/30 bg-blue-500/10 text-blue-400">
                        <BadgeCheck className="h-3 w-3" />
                        Membro
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-zinc-400">
                    @{profile.username || "usuario"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={
                        statusStyles[status] ||
                        "border-zinc-500/30 bg-zinc-500/10 text-zinc-300"
                      }
                    >
                      {statusLabels[status] || status}
                    </Badge>

                    <Badge
                      variant="outline"
                      className={
                        online
                          ? "border-green-500/30 bg-green-500/10 text-green-400"
                          : "border-zinc-500/30 bg-zinc-500/10 text-zinc-300"
                      }
                    >
                      {online ? "Online" : "Offline"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <Trophy className="h-4 w-4" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em]">
                      XP
                    </p>
                  </div>

                  <p className="mt-2 text-2xl font-black">
                    {points?.points || 0}
                  </p>

                  <p className="text-xs text-zinc-500">
                    Lv. {points?.level || 1}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <MessageCircle className="h-4 w-4" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em]">
                      Coment.
                    </p>
                  </div>

                  <p className="mt-2 text-2xl font-black">{commentCount}</p>
                  <p className="text-xs text-zinc-500">interações</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
            <CardHeader>
              <CardTitle>Bio</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="leading-relaxed text-zinc-300">
                {profile.bio || "Este membro ainda não adicionou uma bio."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>
                  {[profile.city, profile.state].filter(Boolean).join(", ") ||
                    "Localização não informada"}
                </span>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Página atual
                </p>

                <p className="mt-1 truncate text-zinc-300">
                  {presence?.current_page || "Sem atividade recente"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  ID do membro
                </p>

                <p className="mt-1 break-all font-mono text-xs text-zinc-500">
                  {profile.user_id}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}