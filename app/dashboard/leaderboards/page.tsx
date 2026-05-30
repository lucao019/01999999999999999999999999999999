"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  BadgeCheck,
  Crown,
  MessageCircle,
  Newspaper,
  Trophy,
  UserRound,
} from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Profile = {
  user_id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
  role: string | null
}

type UserPoints = {
  user_id: string
  points: number
  level: number
}

type PlayerRow = Profile & {
  points: number
  level: number
  comment_count: number
  post_count: number
  activity_count: number
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

function getLevelFromPoints(points: number) {
  if (points >= 1000) return 5
  if (points >= 500) return 4
  if (points >= 250) return 3
  if (points >= 100) return 2
  return 1
}

export default function LeaderboardsPage() {
  const [players, setPlayers] = useState<PlayerRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadLeaderboard() {
      setIsLoading(true)
      setMessage("")

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url, role")
        .in("role", ["admin", "member"])
        .order("display_name", { ascending: true })

      if (profilesError) {
        setMessage(`Erro ao carregar membros: ${profilesError.message}`)
        setIsLoading(false)
        return
      }

      const profiles = (profilesData || []) as Profile[]
      const userIds = profiles.map((profile) => String(profile.user_id))

      if (userIds.length === 0) {
        setPlayers([])
        setIsLoading(false)
        return
      }

      const [
        { data: pointsData },
        { data: commentsData },
        { data: postsData },
        { data: activitiesData },
      ] = await Promise.all([
        supabase
          .from("user_points")
          .select("user_id, points, level")
          .in("user_id", userIds),

        supabase
          .from("comments")
          .select("user_id")
          .in("user_id", userIds),

        supabase
          .from("posts")
          .select("user_id")
          .in("user_id", userIds),

        supabase
          .from("activity_events")
          .select("user_id")
          .in("user_id", userIds),
      ])

      const pointsMap = new Map<string, UserPoints>()

      ;((pointsData || []) as UserPoints[]).forEach((item) => {
        pointsMap.set(String(item.user_id), item)
      })

      const countByUser = (items: { user_id: string }[] | null) => {
        const map = new Map<string, number>()

        ;(items || []).forEach((item) => {
          const userId = String(item.user_id)
          map.set(userId, (map.get(userId) || 0) + 1)
        })

        return map
      }

      const commentsMap = countByUser(commentsData as { user_id: string }[])
      const postsMap = countByUser(postsData as { user_id: string }[])
      const activitiesMap = countByUser(
        activitiesData as { user_id: string }[]
      )

      const rows: PlayerRow[] = profiles.map((profile) => {
        const savedPoints = pointsMap.get(String(profile.user_id))
        const points = savedPoints?.points || 0

        return {
          ...profile,
          points,
          level: savedPoints?.level || getLevelFromPoints(points),
          comment_count: commentsMap.get(String(profile.user_id)) || 0,
          post_count: postsMap.get(String(profile.user_id)) || 0,
          activity_count: activitiesMap.get(String(profile.user_id)) || 0,
        }
      })

      rows.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        if (b.level !== a.level) return b.level - a.level
        return (a.display_name || "").localeCompare(b.display_name || "")
      })

      setPlayers(rows)
      setIsLoading(false)
    }

    loadLeaderboard()
  }, [])

  const topThree = useMemo(() => players.slice(0, 3), [players])

  return (
    <AppShell
      title="Leaderboards"
      description="Ranking dos membros, XP, níveis e estatísticas da comunidade."
    >
      <div className="space-y-6">
        {message && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {message}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          {topThree.map((player, index) => {
            const name = player.display_name || player.username || "Usuário"

            return (
              <Link
                key={player.user_id}
                href={`/dashboard/membros/${player.user_id}`}
              >
                <Card className="h-full border-white/10 bg-zinc-950/80 text-white shadow-2xl transition-colors hover:border-red-500/40">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <Badge className="border-red-500/30 bg-red-500/10 text-red-400">
                        #{index + 1}
                      </Badge>

                      {player.role === "admin" ? (
                        <Crown className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <BadgeCheck className="h-5 w-5 text-sky-400" />
                      )}
                    </div>

                    <div className="mt-5 flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-red-500/10 text-lg font-black text-red-400">
                        {player.avatar_url ? (
                          <img
                            src={player.avatar_url}
                            alt={name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(name)
                        )}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-black">{name}</h2>
                        <p className="text-sm text-zinc-500">
                          Lv. {player.level}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-3xl font-black text-red-400">
                        {player.points} XP
                      </p>
                      <p className="text-xs text-zinc-500">pontuação total</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </section>

        <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-red-500" />
              Ranking geral
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p className="text-sm text-zinc-500">Carregando ranking...</p>
            ) : players.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Nenhum membro no ranking ainda.
              </p>
            ) : (
              <div className="space-y-3">
                {players.map((player, index) => {
                  const name =
                    player.display_name || player.username || "Usuário"

                  return (
                    <Link
                      key={player.user_id}
                      href={`/dashboard/membros/${player.user_id}`}
                      className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 transition-colors hover:border-red-500/40 hover:bg-red-500/5 md:grid-cols-[auto_minmax(0,1fr)_auto]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-sm font-black text-red-400">
                          #{index + 1}
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-red-500/10 text-xs font-black text-red-400">
                          {player.avatar_url ? (
                            <img
                              src={player.avatar_url}
                              alt={name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(name)
                          )}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-black">{name}</p>

                          {player.role === "admin" ? (
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

                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                          <span className="inline-flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {player.comment_count} comentários
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <Newspaper className="h-3 w-3" />
                            {player.post_count} posts
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <UserRound className="h-3 w-3" />
                            {player.activity_count} atividades
                          </span>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-xl font-black text-red-400">
                          {player.points} XP
                        </p>
                        <p className="text-xs text-zinc-500">
                          Lv. {player.level}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}