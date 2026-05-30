"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { BadgeCheck, Circle, Crown, Trophy, Users } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type MemberProfile = {
  user_id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
  role: string | null
}

type MemberPresence = {
  user_id: string
  last_seen: string
  current_page: string | null
}

type UserPoints = {
  user_id: string
  points: number
  level: number
}

type MemberView = MemberProfile & {
  online: boolean
  last_seen?: string
  current_page?: string | null
  points: number
  level: number
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

function isRecentlyOnline(lastSeen?: string) {
  if (!lastSeen) return false

  const lastSeenTime = new Date(lastSeen).getTime()
  const now = Date.now()

  return now - lastSeenTime <= 5 * 60 * 1000
}

function RoleIcon({ role }: { role: string | null }) {
  if (role === "admin") {
    return <Crown className="h-3.5 w-3.5 shrink-0 text-yellow-400" />
  }

  return <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-sky-400" />
}

export function MembersSidebar() {
  const pathname = usePathname()

  const [members, setMembers] = useState<MemberProfile[]>([])
  const [presence, setPresence] = useState<MemberPresence[]>([])
  const [points, setPoints] = useState<UserPoints[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function updateMyPresence() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error("Erro ao buscar usuário para presença:", userError)
      return
    }

    if (!user) {
      console.warn("Nenhum usuário logado para registrar presença.")
      return
    }

    const { error } = await supabase.from("member_presence").upsert(
      {
        user_id: user.id,
        last_seen: new Date().toISOString(),
        current_page: pathname,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    )

    if (error) {
      console.error("Erro ao atualizar presença:", error)
    }
  }

  async function loadMembers() {
    setIsLoading(true)

    const [
      { data: profilesData, error: profilesError },
      { data: presenceData, error: presenceError },
      { data: pointsData, error: pointsError },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url, role")
        .order("display_name", { ascending: true }),

      supabase
        .from("member_presence")
        .select("user_id, last_seen, current_page"),

      supabase.from("user_points").select("user_id, points, level"),
    ])

    if (profilesError) {
      console.error("Erro ao carregar perfis:", profilesError)
    }

    if (presenceError) {
      console.error("Erro ao carregar presença:", presenceError)
    }

    if (pointsError) {
      console.error("Erro ao carregar pontos:", pointsError)
    }

    setMembers((profilesData || []) as MemberProfile[])
    setPresence((presenceData || []) as MemberPresence[])
    setPoints((pointsData || []) as UserPoints[])
    setIsLoading(false)
  }

  useEffect(() => {
    updateMyPresence()
    loadMembers()

    const interval = window.setInterval(() => {
      updateMyPresence()
      loadMembers()
    }, 30000)

    return () => {
      window.clearInterval(interval)
    }
  }, [pathname])

  const memberList = useMemo<MemberView[]>(() => {
    return members
      .map((member) => {
        const memberPresence = presence.find(
          (item) => String(item.user_id) === String(member.user_id)
        )

        const memberPoints = points.find(
          (item) => String(item.user_id) === String(member.user_id)
        )

        return {
          ...member,
          online: isRecentlyOnline(memberPresence?.last_seen),
          last_seen: memberPresence?.last_seen,
          current_page: memberPresence?.current_page,
          points: memberPoints?.points || 0,
          level: memberPoints?.level || 1,
        }
      })
      .sort((a, b) => {
        if (a.role === "admin" && b.role !== "admin") return -1
        if (a.role !== "admin" && b.role === "admin") return 1
        if (a.online && !b.online) return -1
        if (!a.online && b.online) return 1

        return (a.display_name || "").localeCompare(b.display_name || "")
      })
  }, [members, presence, points])

  const onlineMembers = memberList.filter((member) => member.online)
  const totalMembers = memberList.length

  const rankingMembers = [...memberList]
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      return (a.display_name || "").localeCompare(b.display_name || "")
    })
    .slice(0, 5)

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-4">
        <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between gap-2 text-base">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-red-500" />
                Servidor
              </span>

              <Badge className="border-green-500/30 bg-green-500/10 text-green-400">
                {onlineMembers.length} online
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-2xl font-black">{totalMembers}</p>
              <p className="text-xs text-zinc-500">membros cadastrados</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                Online agora
              </p>

              {isLoading ? (
                <p className="text-sm text-zinc-500">Carregando membros...</p>
              ) : onlineMembers.length === 0 ? (
                <p className="text-sm text-zinc-500">Ninguém online agora.</p>
              ) : (
                onlineMembers.slice(0, 8).map((member) => (
                  <MemberRow key={member.user_id} member={member} />
                ))
              )}
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                Membros
              </p>

              {memberList.slice(0, 12).map((member) => (
                <MemberRow key={member.user_id} member={member} compact />
              ))}
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                <Trophy className="h-3.5 w-3.5 text-red-500" />
                Ranking
              </p>

              {rankingMembers.length === 0 ? (
                <p className="text-sm text-zinc-500">Sem pontos ainda.</p>
              ) : (
                rankingMembers.map((member, index) => (
                  <RankingRow
                    key={`ranking-${member.user_id}`}
                    member={member}
                    position={index + 1}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}

function MemberRow({
  member,
  compact = false,
}: {
  member: MemberView
  compact?: boolean
}) {
  const name = member.display_name || member.username || "Usuário"

return (
  <Link
    href={`/dashboard/membros/${member.user_id}`}
    className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-2 transition-colors hover:border-red-500/30 hover:bg-red-500/5"
  >
    <div className="relative">
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-red-500/10 text-xs font-black text-red-400">
        {member.avatar_url ? (
          <img
            src={member.avatar_url}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          getInitials(name)
        )}
      </div>

      <span
        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black ${
          member.online ? "bg-green-500" : "bg-zinc-600"
        }`}
      />
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1">
        <p className="truncate text-sm font-bold">{name}</p>

        {member.role === "admin" ? (
          <Crown className="h-3.5 w-3.5 text-yellow-400" />
        ) : (
          <BadgeCheck className="h-3.5 w-3.5 text-zinc-500" />
        )}
      </div>

      {!compact && (
        <p className="truncate text-xs text-zinc-500">
          {member.online ? "Online" : "Offline"} · {member.points} XP · Lv.{" "}
          {member.level}
        </p>
      )}

      {compact && (
        <p className="truncate text-xs text-zinc-500">
          {member.points} XP · Lv. {member.level}
        </p>
      )}
    </div>

    {!compact && (
      <Circle
        className={`h-2.5 w-2.5 ${
          member.online
            ? "fill-green-500 text-green-500"
            : "fill-zinc-600 text-zinc-600"
        }`}
      />
    )}
  </Link>
)  
}

function RankingRow({
  member,
  position,
}: {
  member: MemberView
  position: number
}) {
  const name = member.display_name || member.username || "Usuário"

  return (
    <Link
      href={`/dashboard/membros/${member.user_id}`}
      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3 transition-colors hover:border-red-500/30 hover:bg-red-500/5"
      title={`Abrir perfil de ${name}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-xs font-black text-red-400">
          #{position}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="truncate text-sm font-bold">{name}</p>
            <RoleIcon role={member.role} />
          </div>

          <p className="text-xs text-zinc-500">Lv. {member.level}</p>
        </div>
      </div>

      <p className="shrink-0 text-sm font-black text-red-400">
        {member.points} XP
      </p>
    </Link>
  )
}