"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  BadgeCheck,
  Crown,
  ExternalLink,
  RefreshCw,
  Shield,
  Trash2,
  UserCheck,
} from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type MemberAdminRow = {
  user_id: string
  display_name: string | null
  username: string | null
  login: string | null
  role: string | null
  status: string | null
  created_at: string | null
  updated_at: string | null
}

export default function AdminMembersPage() {
  const [currentUserId, setCurrentUserId] = useState("")
  const [currentRole, setCurrentRole] = useState("basic")
  const [members, setMembers] = useState<MemberAdminRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState("")

  const isAdmin = currentRole === "admin"

  async function loadMembers() {
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

    const { data: myProfile, error: myProfileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle()

    if (myProfileError) {
      setFeedback(`Erro ao carregar seu perfil: ${myProfileError.message}`)
      setIsLoading(false)
      return
    }

    const role = myProfile?.role || "basic"
    setCurrentRole(role)

    if (role !== "admin") {
      setFeedback("Acesso restrito ao administrador.")
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "user_id, display_name, username, login, role, status, created_at, updated_at"
      )
      .order("created_at", { ascending: false })

    if (error) {
      setFeedback(`Erro ao carregar membros: ${error.message}`)
      setIsLoading(false)
      return
    }

    setMembers((data || []) as MemberAdminRow[])
    setIsLoading(false)
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const stats = useMemo(() => {
    return {
      total: members.length,
      admins: members.filter((item) => item.role === "admin").length,
      members: members.filter((item) => item.role === "member").length,
      basic: members.filter((item) => item.role === "basic" || !item.role)
        .length,
    }
  }, [members])

  async function handleChangeRole(userId: string, nextRole: string) {
    const confirmed = window.confirm(`Alterar role para ${nextRole}?`)
    if (!confirmed) return

    const { error } = await supabase.rpc("admin_set_user_role", {
      p_user_id: userId,
      p_role: nextRole,
    })

    if (error) {
      setFeedback(`Erro ao alterar role: ${error.message}`)
      return
    }

    setMembers((current) =>
      current.map((item) =>
        item.user_id === userId ? { ...item, role: nextRole } : item
      )
    )

    setFeedback("Role atualizada com sucesso.")
  }

  async function handleCreateJoinEvent(userId: string) {
    const { error } = await supabase.rpc("admin_create_user_joined_event", {
      p_user_id: userId,
    })

    if (error) {
      setFeedback(`Erro ao criar evento: ${error.message}`)
      return
    }

    setFeedback("Evento público criado na timeline.")
  }

  async function handleDeleteUser(member: MemberAdminRow) {
    const name =
      member.display_name || member.username || member.login || "usuário"

    if (member.user_id === currentUserId) {
      setFeedback("Você não pode excluir sua própria conta por aqui.")
      return
    }

    const confirmed = window.confirm(
      `Excluir completamente a conta de ${name}?\n\nIsso remove perfil, comentários, chat, pontos, presença, eventos e Auth.`
    )

    if (!confirmed) return

    const { error } = await supabase.rpc("admin_delete_user_full", {
      p_user_id: member.user_id,
    })

    if (error) {
      setFeedback(`Erro ao excluir usuário: ${error.message}`)
      return
    }

    setMembers((current) =>
      current.filter((item) => item.user_id !== member.user_id)
    )

    setFeedback("Conta excluída com sucesso.")
  }

  async function handleResetNonAdminUsers() {
    const confirmed = window.confirm(
      "Apagar TODAS as contas que não são admin?\n\nIsso remove usuários, perfis, comentários, chat, pontos, presença e eventos.\n\nEssa ação é perigosa."
    )

    if (!confirmed) return

    const secondConfirm = window.confirm(
      "Confirma mesmo? Somente contas admin serão mantidas."
    )

    if (!secondConfirm) return

    const { error } = await supabase.rpc("admin_reset_non_admin_users")

    if (error) {
      setFeedback(`Erro ao resetar usuários: ${error.message}`)
      return
    }

    setFeedback("Todas as contas não-admin foram removidas.")
    await loadMembers()
  }

  async function handleClearMemberContent() {
    const confirmed = window.confirm(
      "Limpar publicações, comentários, chat, pontos e eventos de membros?\n\nContas admin serão mantidas."
    )

    if (!confirmed) return

    const { error } = await supabase.rpc("admin_clear_member_content")

    if (error) {
      setFeedback(`Erro ao limpar conteúdo: ${error.message}`)
      return
    }

    setFeedback("Conteúdo dos membros limpo com sucesso.")
    await loadMembers()
  }

  return (
    <AppShell
      title="Administração de membros"
      description="Gerencie contas, roles, perfis e eventos públicos sem usar o SQL Editor."
    >
      <div className="space-y-6">
        {feedback && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {feedback}
          </div>
        )}

        {!isAdmin && !isLoading ? (
          <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
            <CardContent className="p-6 text-zinc-400">
              Acesso restrito ao administrador.
            </CardContent>
          </Card>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <Card className="border-white/10 bg-zinc-950/80 text-white">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Total
                  </p>
                  <p className="mt-2 text-3xl font-black">{stats.total}</p>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-zinc-950/80 text-white">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Admins
                  </p>
                  <p className="mt-2 text-3xl font-black text-yellow-400">
                    {stats.admins}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-zinc-950/80 text-white">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Members
                  </p>
                  <p className="mt-2 text-3xl font-black text-sky-400">
                    {stats.members}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-zinc-950/80 text-white">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Basic
                  </p>
                  <p className="mt-2 text-3xl font-black text-zinc-400">
                    {stats.basic}
                  </p>
                </CardContent>
              </Card>
            </section>

            <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    Membros cadastrados
                  </span>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={loadMembers}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Atualizar
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearMemberContent}
                      className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
                    >
                      Limpar conteúdo
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleResetNonAdminUsers}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      Reset membros
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <p className="text-sm text-zinc-500">
                    Carregando membros...
                  </p>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => {
                      const name =
                        member.display_name ||
                        member.username ||
                        member.login ||
                        "Usuário"

                      return (
                        <div
                          key={member.user_id}
                          className="rounded-2xl border border-white/10 bg-black/30 p-4"
                        >
                          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate font-black">{name}</p>

                                {member.role === "admin" ? (
                                  <Badge className="gap-1 border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
                                    <Crown className="h-3 w-3" />
                                    Admin
                                  </Badge>
                                ) : (
                                  <Badge className="gap-1 border-blue-500/30 bg-blue-500/10 text-blue-400">
                                    <BadgeCheck className="h-3 w-3" />
                                    {member.role || "basic"}
                                  </Badge>
                                )}
                              </div>

                              <p className="mt-1 truncate text-sm text-zinc-500">
                                {member.login || "sem login"} · @
                                {member.username || "sem-username"}
                              </p>

                              <p className="mt-1 break-all font-mono text-xs text-zinc-600">
                                {member.user_id}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Link
                                href={`/dashboard/membros/${member.user_id}`}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Perfil
                                </Button>
                              </Link>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleChangeRole(member.user_id, "member")
                                }
                                className="gap-2"
                              >
                                <UserCheck className="h-4 w-4" />
                                Member
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleChangeRole(member.user_id, "basic")
                                }
                              >
                                Basic
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleCreateJoinEvent(member.user_id)
                                }
                              >
                                Evento
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(member)}
                                className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  )
}