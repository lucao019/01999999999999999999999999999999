"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  Calendar,
  FileText,
  Newspaper,
  Shield,
  Target,
  User,
  Users,
} from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type ActivityEvent = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  link_url: string | null
  created_at: string
}

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_url: string | null
  category: string | null
  status: string | null
  published_at: string | null
  created_at: string
}

type FeedItem =
  | {
      type: "post"
      date: string
      post: Post
    }
  | {
      type: "activity"
      date: string
      activity: ActivityEvent
    }

export default function TimelinePage() {
  const [displayName, setDisplayName] = useState("Usuário")
  const [role, setRole] = useState("basic")
  const [posts, setPosts] = useState<Post[]>([])
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadFeed() {
      setIsLoading(true)
      setMessage("")

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = "/"
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, role")
        .eq("user_id", user.id)
        .maybeSingle()

      setDisplayName(profile?.display_name || user.email || "Usuário")
      setRole(profile?.role || "basic")

      const [
        { data: postsData, error: postsError },
        { data: activitiesData, error: activitiesError },
      ] = await Promise.all([
        supabase
          .from("posts")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false }),

        supabase
          .from("activity_events")
          .select("id, title, description, image_url, link_url, created_at")
          .order("created_at", { ascending: false })
          .limit(50),
      ])

      if (postsError) {
        setMessage(`Erro ao carregar publicações: ${postsError.message}`)
        setIsLoading(false)
        return
      }

      if (activitiesError) {
        console.error("Erro ao carregar atividades:", activitiesError)
      }

      setPosts(postsData || [])
      setActivities((activitiesData || []) as ActivityEvent[])
      setIsLoading(false)
    }

    loadFeed()
  }, [])

  const feedItems = useMemo<FeedItem[]>(() => {
    const postItems: FeedItem[] = posts.map((post) => ({
      type: "post",
      date: post.published_at || post.created_at,
      post,
    }))

    const activityItems: FeedItem[] = activities.map((activity) => ({
      type: "activity",
      date: activity.created_at,
      activity,
    }))

    return [...postItems, ...activityItems].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [posts, activities])

  if (isLoading) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 text-sm text-zinc-400">
          Carregando feed...
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-zinc-950/80 p-5 shadow-2xl sm:p-6">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute bottom-0 left-8 h-72 w-72 rounded-full bg-red-900/15 blur-3xl" />

          <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="border-red-500/30 bg-red-500/20 text-red-400">
                  Feed
                </Badge>

                <Badge variant="outline" className="text-zinc-300">
                  {role === "admin" ? "Admin" : "Conta básica"}
                </Badge>
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Bem-vindo, {displayName}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                  Timeline pública com posts e atualizações dos membros.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/perfil">
                <Button className="gap-2 bg-red-600 hover:bg-red-700">
                  <User className="h-4 w-4" />
                  Meu perfil
                </Button>
              </Link>

              <Link href="/dashboard/biblioteca">
                <Button variant="outline" className="gap-2">
                  <Target className="h-4 w-4" />
                  Biblioteca
                </Button>
              </Link>

              {role === "admin" && (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="gap-2">
                      <Shield className="h-4 w-4" />
                      Painel
                    </Button>
                  </Link>

                  <Link href="/dashboard/posts">
                    <Button variant="outline" className="gap-2">
                      <Newspaper className="h-4 w-4" />
                      Posts
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {message && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {message}
          </div>
        )}

        {feedItems.length === 0 && (
          <Card className="border-white/10 bg-zinc-950/80 text-white">
            <CardContent className="p-6 text-sm text-zinc-400">
              Nenhuma atualização ainda.
            </CardContent>
          </Card>
        )}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {feedItems.map((item) => {
            if (item.type === "activity") {
              const activity = item.activity
             const activityCard = (
  <>
    <div className="aspect-[16/10] overflow-hidden bg-black/40">
      {activity.image_url ? (
        <img
          src={activity.image_url}
          alt={activity.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-red-500">
          <Users className="h-10 w-10" />
        </div>
      )}
    </div>

    <CardContent className="space-y-4 p-5">
      <div className="flex flex-wrap gap-2">
        <Badge className="border-blue-500/30 bg-blue-500/20 text-blue-400">
          comunidade
        </Badge>

        <Badge variant="outline" className="gap-1 text-zinc-300">
          <Calendar className="h-3 w-3" />
          {new Date(activity.created_at).toLocaleDateString("pt-BR")}
        </Badge>
      </div>

      <div>
        <h2 className="line-clamp-2 text-xl font-black transition-colors group-hover:text-red-400">
          {activity.title}
        </h2>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
          {activity.description || "Atualização pública."}
        </p>
      </div>

      <Button className="w-full gap-2 bg-red-600 hover:bg-red-700">
        Ver atualização
        <ArrowRight className="h-4 w-4" />
      </Button>
    </CardContent>
  </>
)

return (
  <Card
    key={`activity-${activity.id}`}
    className="group overflow-hidden border-white/10 bg-zinc-950/80 text-white shadow-2xl transition-colors hover:border-red-500/40"
  >
    {activity.link_url ? (
      <Link href={activity.link_url} className="block">
        {activityCard}
      </Link>
    ) : (
      <div className="block">{activityCard}</div>
    )}
  </Card>
)
            }

            const post = item.post

            return (
              <Card
                key={`post-${post.id}`}
                className="group overflow-hidden border-white/10 bg-zinc-950/80 text-white shadow-2xl transition-colors hover:border-red-500/40"
              >
                <Link href={`/timeline/${post.slug}`} className="block">
                  <div className="aspect-[16/10] overflow-hidden bg-zinc-900">
                    {post.cover_url ? (
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600">
                        <FileText className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                </Link>

                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="border-red-500/30 bg-red-500/20 text-red-400">
                      {post.category || "geral"}
                    </Badge>

                    <Badge variant="outline" className="gap-1 text-zinc-300">
                      <Calendar className="h-3 w-3" />
                      {new Date(
                        post.published_at || post.created_at
                      ).toLocaleDateString("pt-BR")}
                    </Badge>
                  </div>

                  <div>
                    <Link href={`/timeline/${post.slug}`}>
                      <h2 className="line-clamp-2 text-xl font-black transition-colors group-hover:text-red-400">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                      {post.excerpt || "Sem resumo."}
                    </p>
                  </div>

                  <Link href={`/timeline/${post.slug}`}>
                    <Button className="w-full gap-2 bg-red-600 hover:bg-red-700">
                      Ler post
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </section>
      </div>
    </AppShell>
  )
}