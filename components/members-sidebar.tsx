"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { BadgeCheck, Circle, Crown, Users } from "lucide-react"

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

type MemberView = MemberProfile & {
  online: boolean
  last_seen?: string
  current_page?: string | null
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

export function MembersSidebar() {
  const pathname = usePathname()

  const [members, setMembers] = useState<MemberProfile[]>([])
  const [presence, setPresence] = useState<MemberPresence[]>([])
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

  console.log("Registrando presença para:", user.id)

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
    return
  }

  console.log("Presença atualizada com sucesso.")
}

  async function loadMembers() {
    setIsLoading(true)

    const [{ data: profilesData }, { data: presenceData }] = await Promise.all([
      supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url, role")
        .order("created_at", { ascending: true }),

      supabase
        .from("member_presence")
        .select("user_id, last_seen, current_page"),
    ])

    setMembers((profilesData || []) as MemberProfile[])
    setPresence((presenceData || []) as MemberPresence[])
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
          (item) => item.user_id === member.user_id
        )

        return {
          ...member,
          online: isRecentlyOnline(memberPresence?.last_seen),
          last_seen: memberPresence?.last_seen,
          current_page: memberPresence?.current_page,
        }
      })
      .sort((a, b) => {
        if (a.role === "admin" && b.role !== "admin") return -1
        if (a.role !== "admin" && b.role === "admin") return 1
        if (a.online && !b.online) return -1
        if (!a.online && b.online) return 1

        return (a.display_name || "").localeCompare(b.display_name || "")
      })
  }, [members, presence])

  const onlineMembers = memberList.filter((member) => member.online)
  const totalMembers = memberList.length

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
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-2">
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
            {member.online ? "Online" : "Offline"}
          </p>
        )}
      </div>

      {!compact && (
        <Circle
          className={`h-2.5 w-2.5 ${
            member.online ? "fill-green-500 text-green-500" : "fill-zinc-600 text-zinc-600"
          }`}
        />
      )}
    </div>
  )
}