"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  BadgeCheck,
  Crown,
  Loader2,
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

type ChatMessage = {
  id: string
  room_id: string
  user_id: string
  content: string
  image_url: string | null
  reply_to: string | null
  is_deleted: boolean
  created_at: string
  updated_at: string
}

type Profile = {
  user_id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
  role: string | null
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

export default function ChatPage() {
  const [currentUserId, setCurrentUserId] = useState("")
  const [currentRole, setCurrentRole] = useState("basic")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [profiles, setProfiles] = useState<Record<string, Profile>>({})
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [feedback, setFeedback] = useState("")

  const bottomRef = useRef<HTMLDivElement | null>(null)

  const canUseChat = useMemo(() => {
    return currentRole === "admin" || currentRole === "member"
  }, [currentRole])

  async function loadMessages() {
    const { data: messagesData, error: messagesError } = await supabase
      .from("chat_messages")
.select(
  "id, room_id, user_id, content, image_url, reply_to, is_deleted, created_at, updated_at"
)
.eq("room_id", "general")
.order("created_at", { ascending: true })
.limit(100)

    if (messagesError) {
      setFeedback(`Erro ao carregar chat: ${messagesError.message}`)
      setIsLoading(false)
      return
    }

    const loadedMessages = (messagesData || []) as ChatMessage[]

    setMessages(loadedMessages)

    const userIds = Array.from(
      new Set(loadedMessages.map((item) => String(item.user_id)))
    )

    if (userIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url, role")
        .in("user_id", userIds)

      if (profilesError) {
        console.error("Erro ao carregar perfis do chat:", profilesError)
      }

      const profileMap: Record<string, Profile> = {}

      ;((profilesData || []) as Profile[]).forEach((profile) => {
        profileMap[String(profile.user_id)] = profile
      })

      setProfiles(profileMap)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    async function initChat() {
      setIsLoading(true)
      setFeedback("")

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = "/login"
        return
      }

      setCurrentUserId(user.id)

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle()

      if (profileError) {
        setFeedback(`Erro ao carregar perfil: ${profileError.message}`)
        setIsLoading(false)
        return
      }

      const role = profile?.role || "basic"

      setCurrentRole(role)

      if (!["admin", "member"].includes(role)) {
        setFeedback("Sua conta ainda não tem acesso ao chat.")
        setIsLoading(false)
        return
      }

      await loadMessages()
    }

    initChat()

    const channel = supabase
      .channel("chat-geral")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
        },
        () => {
          loadMessages()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend() {
    const cleanContent = content.trim()

    if (!cleanContent || !currentUserId || !canUseChat || isSending) return

    setIsSending(true)
    setFeedback("")

    const { error } = await supabase.from("chat_messages").insert({
  room_id: "general",
  user_id: currentUserId,
  content: cleanContent,
})

    setIsSending(false)

    if (error) {
      setFeedback(`Erro ao enviar mensagem: ${error.message}`)
      return
    }

    setContent("")
  }

  async function handleDelete(chatMessage: ChatMessage) {
    const confirmed = window.confirm("Apagar esta mensagem?")

    if (!confirmed) return

    const { error } = await supabase
      .from("chat_messages")
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", chatMessage.id)

    if (error) {
      setFeedback(`Erro ao apagar mensagem: ${error.message}`)
      return
    }

    setMessages((current) =>
      current.map((item) =>
        item.id === chatMessage.id ? { ...item, is_deleted: true } : item
      )
    )
  }

  function canDeleteMessage(chatMessage: ChatMessage) {
    if (currentRole === "admin") return true

    return String(chatMessage.user_id) === String(currentUserId)
  }

  return (
    <AppShell
      title="Chat geral"
      description="Canal público dos membros do servidor. Admin modera tudo; membros apagam apenas as próprias mensagens."
    >
      <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-red-500" />
            Servidor / Geral
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {feedback && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {feedback}
            </div>
          )}

          <div className="h-[560px] overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                Carregando chat...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                Nenhuma mensagem ainda.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((chatMessage) => {
                  const profile = profiles[String(chatMessage.user_id)]
                  const name =
                    profile?.display_name || profile?.username || "Usuário"
                  const role = profile?.role || "member"

                  return (
                    <div
                      key={chatMessage.id}
                      className="group flex gap-3 rounded-2xl border border-white/10 bg-zinc-950/70 p-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-red-500/10 text-xs font-black text-red-400">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(name)
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold">{name}</p>

                          {role === "admin" ? (
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

                          <span className="text-xs text-zinc-500">
                            {new Date(chatMessage.created_at).toLocaleString(
                              "pt-BR"
                            )}
                          </span>
                        </div>

                        {chatMessage.is_deleted ? (
                          <p className="mt-2 italic text-zinc-500">
                            Mensagem apagada.
                          </p>
                        ) : (
                          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-300">
                            {chatMessage.content}
                          </p>
                        )}
                      </div>

                      {!chatMessage.is_deleted &&
                        canDeleteMessage(chatMessage) && (
                          <button
                            type="button"
                            onClick={() => handleDelete(chatMessage)}
                            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/30 bg-black/50 text-red-400 transition-colors hover:bg-red-500/10 group-hover:flex"
                            title="Apagar mensagem"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                    </div>
                  )
                })}

                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  handleSend()
                }
              }}
              disabled={!canUseChat || isSending}
              placeholder={
                canUseChat
                  ? "Mensagem para o chat geral..."
                  : "Sua conta não tem acesso ao chat."
              }
              className="min-h-[90px] border-white/10 bg-black/30 text-white placeholder:text-zinc-500"
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSend}
                disabled={!content.trim() || !canUseChat || isSending}
                className="gap-2 bg-red-600 hover:bg-red-700"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}